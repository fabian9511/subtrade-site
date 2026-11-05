/**
 * GoHighLevel plumbing shared by the Builders Night API routes
 * (app/api/builders-night/route.js and app/api/builders-night/check-in/route.js).
 * Server only: it reads GHL_PRIVATE_TOKEN through the routes, never in the browser.
 *
 * Pipelines and stages are found by NAME, so nobody has to paste ids anywhere.
 * Create them in GHL with these names (spacing, dashes and case don't matter):
 *   "Builders Night 2027 - Subs"      Qualified, Not qualified, Paid, Checked in, No-show
 *   "Builders Night 2027 - Builders"  Invited, Wants a table, Table confirmed, Guest ($25), Sponsor, Checked in, No-show, Declined
 *   "Builders Night 2027 - Suppliers" Invited, Wants a table, Paid, Checked in, No-show, Declined
 */

export const GHL = 'https://services.leadconnectorhq.com';
export const LOCATION_ID = process.env.GHL_LOCATION_ID || 'tvaEDkrxBWUrDUqzetBb';

export const PIPELINE_NAMES = {
  subs: 'Builders Night 2027 - Subs',
  builders: 'Builders Night 2027 - Builders',
  suppliers: 'Builders Night 2027 - Suppliers',
};
export const STAGE_NAMES = {
  qualified: 'Qualified',
  notQualified: 'Not qualified',
  table: 'Wants a table',
  guest: 'Guest ($25)',
  checkedIn: 'Checked in',
};

export const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// A small fetch wrapper for the LeadConnector API. Logs failures, never throws on a bad status.
export function makeGhl(token, logTag = '[builders-night]') {
  const headers = {
    Authorization: `Bearer ${token}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  return (path, method, payload) =>
    fetch(`${GHL}${path}`, { method, headers, ...(payload ? { body: JSON.stringify(payload) } : {}) }).then(async (r) => {
      if (!r.ok) console.error(`${logTag} ${method} ${path.split('?')[0].split('/').slice(0, 3).join('/')} failed`, r.status, (await r.clone().text()).slice(0, 200));
      return r;
    });
}

// Looked up once per server instance, looked up again if something is missing.
let pipelineCache = null;
export async function getPipelines(ghl, fresh = false) {
  if (!pipelineCache || fresh) {
    try {
      const r = await ghl(`/opportunities/pipelines?locationId=${LOCATION_ID}`, 'GET');
      const data = await r.json().catch(() => ({}));
      if (Array.isArray(data?.pipelines)) pipelineCache = data.pipelines;
    } catch (err) {
      console.error('[builders-night] pipeline lookup error', err?.message);
    }
  }
  return pipelineCache || [];
}

export async function findStage(ghl, pipelineName, stageName) {
  const find = (list) => {
    const pipe = list.find((p) => norm(p.name) === norm(pipelineName));
    const stage = pipe?.stages?.find((s) => norm(s.name) === norm(stageName));
    return pipe && stage ? { pipelineId: pipe.id, stageId: stage.id } : null;
  };
  return find(await getPipelines(ghl)) || find(await getPipelines(ghl, true));
}

// The Builders Night pipeline ids, so check-in only moves Builders Night cards.
export async function buildersNightPipelines(ghl) {
  const names = Object.values(PIPELINE_NAMES).map(norm);
  return (await getPipelines(ghl)).filter((p) => names.includes(norm(p.name)));
}
