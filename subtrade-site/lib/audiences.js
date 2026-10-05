// Facebook Custom Audiences from GoHighLevel, EMAIL ONLY (hashed).
// Phone numbers are never sent: Privacy Policy 6.4 / carrier SMS rules.
// Contacts with Do Not Disturb or email unsubscribed are left out.
//
// Three audiences in the SubTrade ad account, fully replaced on every run:
//   SubTrade – Customers  (lookalikes + exclude from trial ads)
//   SubTrade – Trials     (exclude from "start trial" ads)
//   SubTrade – Leads      (retarget people who never started)
//
// Every run also gives each GHL contact exactly one mailing-list tag (see
// LIST_TAGS), swapping it when they move, so lists can be filtered in GHL.
//
// Needs META_ADS_TOKEN (system user token with ads_management on the ad
// account). Optional META_AD_ACCOUNT (default act_1615988616297907).

import crypto from 'node:crypto';
import { ghl, LOCATION_ID } from './stripeGhl';

const AD_ACCOUNT = process.env.META_AD_ACCOUNT || 'act_1615988616297907';
const GRAPH = 'https://graph.facebook.com/v21.0';

const SUBTRADE_PIPELINE = 'ehpEmBoueE7AcdOXAyP9';
const FUNNEL_PIPELINE = 'OuxZEd4r0BA8PEreH5n6';
const CUSTOMER_STAGES = {
  [SUBTRADE_PIPELINE]: [
    'fd449da6-dab0-42d9-940b-fd93718363e6', // Converted (paid)
    '4a2439a7-9e71-4a2f-be1d-595a87e84ac8', // Onboarding
    '9a8a523f-c1d1-4851-9174-bf9d1c862829', // 1YR Free
  ],
  [FUNNEL_PIPELINE]: ['eff7a931-a879-415b-abb1-7360d6fc5f5b'], // Won – paying
};
const TRIAL_STAGES = {
  [SUBTRADE_PIPELINE]: ['c008ef5f-bc7b-455d-a615-496bc57fa32c'], // 14-Day Free Trial
  [FUNNEL_PIPELINE]: ['8094972b-1354-4448-a2c5-4bdd0c9cc265'], // Trial started
};

export const AUDIENCES = {
  customers: { name: 'SubTrade – Customers', description: 'Paying and onboarded SubTrade customers (from GoHighLevel, email only). Use for lookalikes and to exclude from trial ads.' },
  trials: { name: 'SubTrade – Trials', description: 'Companies on a SubTrade free trial (from GoHighLevel, email only). Exclude from "start trial" ads.' },
  leads: { name: 'SubTrade – Leads', description: 'Leads who have not started a trial or bought (from GoHighLevel, email only). Retargeting.' },
};

// One per contact. Unsubscribed beats everything (never email them).
export const LIST_TAGS = {
  customers: 'list-customer',
  trials: 'list-trial',
  leads: 'list-lead',
  unsubscribed: 'list-unsubscribed', // DND or email unsubscribed: do not email
  phoneOnly: 'list-phone-only', // no email, has a phone: call list only
  noContact: 'list-no-contact', // no email, no phone: nobody can reach them
};
const ALL_LIST_TAGS = Object.values(LIST_TAGS);

const sha = (v) => crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
const okEmail = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const optedOut = (c) => c.dnd === true || c.dndSettings?.Email?.status === 'active';

/* ---------------- GoHighLevel ---------------- */

async function allContacts() {
  const out = [];
  for (let page = 1; page <= 200; page++) {
    const r = await ghl('/contacts/search', 'POST', { locationId: LOCATION_ID, page, pageLimit: 100 });
    const list = r?.contacts || [];
    out.push(...list);
    if (list.length < 100) break;
  }
  return out;
}

async function contactIdsInStages(stagesByPipeline) {
  const ids = new Set();
  for (const [pipeline, stages] of Object.entries(stagesByPipeline)) {
    for (const stage of stages) {
      for (let page = 1; page <= 50; page++) {
        const q = new URLSearchParams({ location_id: LOCATION_ID, pipeline_id: pipeline, pipeline_stage_id: stage, limit: '100', page: String(page) });
        const r = await ghl(`/opportunities/search?${q}`, 'GET');
        const list = r?.opportunities || [];
        list.forEach((o) => o.contactId && ids.add(o.contactId));
        if (list.length < 100) break;
      }
    }
  }
  return ids;
}

export async function buildLists() {
  const [contacts, customerIds, trialIds] = await Promise.all([
    allContacts(),
    contactIdsInStages(CUSTOMER_STAGES),
    contactIdsInStages(TRIAL_STAGES),
  ]);
  const lists = { customers: new Set(), trials: new Set(), leads: new Set() };
  const listTag = new Map(); // contact id -> its mailing-list tag
  let skipped = 0;
  for (const c of contacts) {
    const email = (c.email || '').trim().toLowerCase();
    if (optedOut(c)) {
      listTag.set(c.id, LIST_TAGS.unsubscribed);
      skipped++;
      continue;
    }
    if (!okEmail(email)) {
      listTag.set(c.id, String(c.phone || '').replace(/\D/g, '').length >= 7 ? LIST_TAGS.phoneOnly : LIST_TAGS.noContact);
      skipped++;
      continue;
    }
    const tags = c.tags || [];
    const key = customerIds.has(c.id) || tags.includes('paying-customer')
      ? 'customers'
      : trialIds.has(c.id) || tags.includes('trial-card-on-file') ? 'trials' : 'leads';
    lists[key].add(email);
    listTag.set(c.id, LIST_TAGS[key]);
  }
  return { lists, total: contacts.length, skipped, contacts, listTag };
}

// Add the right list tag and drop a stale one. Only contacts that need a change
// are touched; paced under GHL's 100 requests / 10 s, and stops before the
// function time limit (the next run carries on).
async function syncListTags(contacts, listTag, deadline) {
  const todo = [];
  for (const c of contacts) {
    const want = listTag.get(c.id);
    const have = (c.tags || []).filter((t) => ALL_LIST_TAGS.includes(t));
    const stale = have.filter((t) => t !== want);
    if (want && (!have.includes(want) || stale.length)) todo.push({ id: c.id, want, stale, add: !have.includes(want) });
  }
  const counts = {};
  let done = 0;
  for (let i = 0; i < todo.length; i += 6) {
    if (Date.now() > deadline) break;
    const started = Date.now();
    await Promise.all(todo.slice(i, i + 6).map(async (t) => {
      if (t.add) await ghl(`/contacts/${t.id}/tags`, 'POST', { tags: [t.want] });
      if (t.stale.length) await ghl(`/contacts/${t.id}/tags`, 'DELETE', { tags: t.stale });
      counts[t.want] = (counts[t.want] || 0) + 1;
      done++;
    }));
    const wait = 1000 - (Date.now() - started);
    if (wait > 0) await new Promise((res) => setTimeout(res, wait));
  }
  return { changed: done, remaining: todo.length - done, by_tag: counts };
}

/* ---------------- Meta ---------------- */

async function graph(path, method = 'GET', body) {
  const token = process.env.META_ADS_TOKEN;
  const url = `${GRAPH}/${path}${path.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${path.split('?')[0]}: ${data?.error?.message || res.status}`);
  return data;
}

async function ensureAudience({ name, description }) {
  const existing = await graph(`${AD_ACCOUNT}/customaudiences?fields=id,name&limit=200`);
  const found = (existing.data || []).find((a) => a.name === name);
  if (found) return found.id;
  const made = await graph(`${AD_ACCOUNT}/customaudiences`, 'POST', {
    name,
    description,
    subtype: 'CUSTOM',
    customer_file_source: 'USER_PROVIDED_ONLY',
  });
  return made.id;
}

// Replace the whole audience with this list (Meta "usersreplace" session).
async function replaceAudience(id, emails) {
  const hashes = [...emails].map(sha);
  if (!hashes.length) return; // Meta rejects an empty replace; keep the audience as it is
  const sessionId = Math.floor(Math.random() * 1e15);
  const size = 10000;
  const batches = Math.max(1, Math.ceil(hashes.length / size));
  for (let i = 0; i < batches; i++) {
    await graph(`${id}/usersreplace`, 'POST', {
      session: { session_id: sessionId, batch_seq: i + 1, last_batch_flag: i === batches - 1, estimated_num_total: hashes.length },
      payload: { schema: 'EMAIL_SHA256', data: hashes.slice(i * size, (i + 1) * size) },
    });
  }
}

export async function syncAudiences() {
  if (!process.env.META_ADS_TOKEN) return { ok: false, reason: 'META_ADS_TOKEN not set' };
  if (!process.env.GHL_PRIVATE_TOKEN) return { ok: false, reason: 'GHL_PRIVATE_TOKEN not set' };
  const deadline = Date.now() + 50_000;
  const { lists, total, skipped, contacts, listTag } = await buildLists();
  const result = { ok: true, contacts: total, skipped_no_email_or_opted_out: skipped, audiences: {} };
  for (const [key, def] of Object.entries(AUDIENCES)) {
    // A Meta hiccup (e.g. the last upload is still processing) must not stop
    // the other audiences or the GHL tagging; the next run catches up.
    try {
      const id = await ensureAudience(def);
      await replaceAudience(id, lists[key]);
      result.audiences[key] = { id, name: def.name, emails: lists[key].size };
    } catch (err) {
      result.audiences[key] = { name: def.name, emails: lists[key].size, error: err?.message };
    }
  }
  const totals = {};
  for (const t of listTag.values()) totals[t] = (totals[t] || 0) + 1;
  result.list_tags = { totals, ...(await syncListTags(contacts, listTag, deadline)) };
  console.log('[audiences] synced', JSON.stringify(result));
  return result;
}
