// Facebook Custom Audiences from GoHighLevel, EMAIL ONLY (hashed).
// Phone numbers are never sent: Privacy Policy 6.4 / carrier SMS rules.
// Contacts with Do Not Disturb or email unsubscribed are left out.
//
// Three audiences in the SubTrade ad account, fully replaced on every run:
//   SubTrade – Customers  (lookalikes + exclude from trial ads)
//   SubTrade – Trials     (exclude from "start trial" ads)
//   SubTrade – Leads      (retarget people who never started)
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
  let skipped = 0;
  for (const c of contacts) {
    const email = (c.email || '').trim().toLowerCase();
    if (!okEmail(email) || optedOut(c)) {
      skipped++;
      continue;
    }
    const tags = c.tags || [];
    if (customerIds.has(c.id) || tags.includes('paying-customer')) lists.customers.add(email);
    else if (trialIds.has(c.id) || tags.includes('trial-card-on-file')) lists.trials.add(email);
    else lists.leads.add(email);
  }
  return { lists, total: contacts.length, skipped };
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
  const { lists, total, skipped } = await buildLists();
  const result = { ok: true, contacts: total, skipped_no_email_or_opted_out: skipped, audiences: {} };
  for (const [key, def] of Object.entries(AUDIENCES)) {
    const id = await ensureAudience(def);
    await replaceAudience(id, lists[key]);
    result.audiences[key] = { id, name: def.name, emails: lists[key].size };
  }
  console.log('[audiences] synced', JSON.stringify(result));
  return result;
}
