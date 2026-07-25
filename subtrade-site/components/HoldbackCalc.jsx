'use client';

import { useState } from 'react';
import { PROVINCES } from '../lib/holdback';
import { STATES } from '../lib/retainage';
import { drawSummaryPdf, downloadPdf } from '../lib/holdbackPdf';

// Strip anything that isn't a digit or a decimal point, keep one decimal point.
function clean(raw) {
  const s = String(raw).replace(/[^0-9.]/g, '');
  const parts = s.split('.');
  return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : s;
}

/**
 * One engine, two jurisdictions.
 *
 * country="CA"  statutory holdback + GST/HST timing (the Canadian default)
 * country="US"  state retainage, public vs private, no tax line
 */
export default function HoldbackCalc({ country = 'CA' }) {
  const us = country === 'US';

  const [prov, setProv] = useState('AB');
  const [usState, setUsState] = useState('CA');
  const [ptype, setPtype] = useState('private');
  const [contract, setContract] = useState('180000');
  const [complete, setComplete] = useState(45);
  const [billed, setBilled] = useState('54000');
  const [pctOverride, setPctOverride] = useState('');
  const [taxOnHoldback, setTaxOnHoldback] = useState(false);
  const [project, setProject] = useState('');
  const [drawNo, setDrawNo] = useState('');

  const money = (n) =>
    (isFinite(n) ? n : 0).toLocaleString(us ? 'en-US' : 'en-CA', {
      style: 'currency',
      currency: us ? 'USD' : 'CAD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

  const list = us ? STATES : PROVINCES;
  const code = us ? usState : prov;
  const p = list.find((x) => x.code === code) || list[0];
  const custom = code === 'XX';
  const isPublic = ptype === 'public';

  // In the US the ceiling depends on who owns the job. null means there is no
  // statutory ceiling at all, which is a different thing from zero.
  const statutoryPct = us ? (isPublic ? p.publicPct : p.privatePct) : p.pct;
  const uncapped = us && !custom && statutoryPct === null;
  const openRate = custom || uncapped;

  const fallbackPct = us ? 10 : p.pct;
  const hbPct = openRate
    ? Number(pctOverride === '' ? fallbackPct : pctOverride)
    : statutoryPct;

  const days = us ? (isPublic ? p.publicDays : p.privateDays) : p.days;
  const taxPct = us ? 0 : p.tax;
  const taxLabel = taxPct === 13 ? 'HST' : 'GST';

  const contractVal = Number(contract || 0);
  const billedVal = Number(billed || 0);

  // Value of work in place to date, from the contract value and % complete.
  const toDate = contractVal * (complete / 100);
  // This claim = work in place to date, less what has already been claimed.
  const draw = Math.max(0, toDate - billedVal);

  const holdback = draw * (hbPct / 100);
  const afterHoldback = draw - holdback;

  // CRA position (Excise Tax Act s.168(7)): GST/HST on a holdback is not
  // payable until the holdback is released or the lien period expires.
  const taxBase = taxOnHoldback ? draw : afterHoldback;
  const tax = us ? 0 : taxBase * (taxPct / 100);

  const netNow = afterHoldback + tax;
  const holdbackToDate = toDate * (hbPct / 100);
  const taxLater = us || taxOnHoldback ? 0 : holdback * (taxPct / 100);

  const TERM = us ? 'retainage' : 'holdback';
  const Term = us ? 'Retainage' : 'Holdback';
  const rateWord = openRate ? 'Contract' : 'Statutory';

  function handleDownload() {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    const pdf = drawSummaryPdf({
      country,
      project: project.trim(),
      drawNo: drawNo.trim(),
      date: now.toLocaleDateString(us ? 'en-US' : 'en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      province: custom ? 'Not specified' : p.name,
      projectType: isPublic ? 'Public / government-owned' : 'Private',
      act: custom ? null : us ? p.statute : p.act,
      // Step-down rules are written for the side of the job that actually has a
      // statutory cap. Showing Arizona's public step-down to someone on private
      // work, where Arizona caps nothing, would read as a protection they do
      // not have.
      reduction: us && !custom && !uncapped ? p.reduction : '',
      stateNote: us && !custom ? p.note : '',
      uncapped,
      days,
      hbPct,
      rateWord,
      taxLabel,
      taxPct,
      contract: money(contractVal),
      complete: `${complete}%`,
      billed: money(billedVal),
      toDate: money(toDate),
      less: `-${money(billedVal)}`,
      draw: money(draw),
      holdback: `-${money(holdback)}`,
      tax: `+${money(tax)}`,
      net: money(netNow),
      holdbackToDate: money(holdbackToDate),
      taxLater: taxLater > 0 ? money(taxLater) : '',
      taxOnHoldback,
    });

    const slug = project
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);

    downloadPdf(
      pdf,
      ['draw-summary', slug, drawNo.trim() ? `draw-${drawNo.trim()}` : '', stamp]
        .filter(Boolean)
        .join('-') + '.pdf'
    );
  }

  return (
    <div className="hb">
      <div className="hb-grid">
        {/* ------------------------------------------------ inputs */}
        <div className="hb-inputs">
          <div className="hb-field">
            <label htmlFor="hb-prov">{us ? 'State' : 'Province'}</label>
            <select
              id="hb-prov"
              value={code}
              onChange={(e) => (us ? setUsState(e.target.value) : setProv(e.target.value))}
            >
              {list.map((x) => (
                <option key={x.code} value={x.code}>
                  {x.name}
                  {!us && x.code !== 'XX' ? ` — ${x.pct}%` : ''}
                </option>
              ))}
            </select>
          </div>

          {us && !custom && (
            <div className="hb-field">
              <label htmlFor="hb-ptype">Who owns the job</label>
              <div className="hb-seg" id="hb-ptype" role="group">
                <button
                  type="button"
                  className={ptype === 'private' ? 'is-on' : ''}
                  aria-pressed={ptype === 'private'}
                  onClick={() => setPtype('private')}
                >
                  Private
                </button>
                <button
                  type="button"
                  className={ptype === 'public' ? 'is-on' : ''}
                  aria-pressed={ptype === 'public'}
                  onClick={() => setPtype('public')}
                >
                  Public
                </button>
              </div>
              <p className="hb-seghint">
                Retainage caps in the US are set separately for publicly funded
                and privately funded work, and they are often not the same
                number.
              </p>
            </div>
          )}

          {openRate && (
            <div className="hb-field">
              <label htmlFor="hb-pct">{Term} percentage</label>
              <div className="hb-suffix">
                <input
                  id="hb-pct"
                  inputMode="decimal"
                  value={pctOverride}
                  placeholder={String(fallbackPct)}
                  onChange={(e) => setPctOverride(clean(e.target.value))}
                />
                <span>%</span>
              </div>
              {uncapped && (
                <p className="hb-seghint">
                  {p.name} sets no statutory ceiling on {ptype} retainage. Put in
                  the rate your contract actually says.
                </p>
              )}
            </div>
          )}

          <div className="hb-field">
            <label htmlFor="hb-contract">
              Contract value <em>including approved change orders</em>
            </label>
            <div className="hb-prefix">
              <span>$</span>
              <input
                id="hb-contract"
                inputMode="decimal"
                value={contract}
                onChange={(e) => setContract(clean(e.target.value))}
              />
            </div>
          </div>

          <div className="hb-field">
            <label htmlFor="hb-complete">
              Work complete to date:{' '}
              <b className="mono" style={{ color: 'var(--gypsum)' }}>{complete}%</b>
            </label>
            <input
              id="hb-complete"
              type="range"
              min="0"
              max="100"
              step="1"
              value={complete}
              onChange={(e) => setComplete(Number(e.target.value))}
            />
          </div>

          <div className="hb-field">
            <label htmlFor="hb-billed">
              Previously billed <em>total of all prior draws, before tax</em>
            </label>
            <div className="hb-prefix">
              <span>$</span>
              <input
                id="hb-billed"
                inputMode="decimal"
                value={billed}
                onChange={(e) => setBilled(clean(e.target.value))}
              />
            </div>
          </div>

          {!us && (
            <label className="hb-check">
              <input
                type="checkbox"
                checked={taxOnHoldback}
                onChange={(e) => setTaxOnHoldback(e.target.checked)}
              />
              <span>
                Charge {taxLabel} on the holdback now
                <em>
                  Off by default. CRA treats tax on a holdback as payable when the
                  holdback is released or the lien period expires, whichever comes
                  first.
                </em>
              </span>
            </label>
          )}
        </div>

        {/* ------------------------------------------------ results */}
        <div className="hb-out">
          <p className="eyebrow">This progress claim</p>

          <div className="hb-row">
            <span>Work in place to date</span>
            <b className="mono">{money(toDate)}</b>
          </div>
          <div className="hb-row hb-neg">
            <span>Less previously billed</span>
            <b className="mono">− {money(billedVal)}</b>
          </div>
          <div className="hb-row hb-sub">
            <span>This draw, before {TERM}</span>
            <b className="mono">{money(draw)}</b>
          </div>
          <div className="hb-row hb-neg">
            <span>
              {rateWord} {TERM} <i>{hbPct}%</i>
            </span>
            <b className="mono">− {money(holdback)}</b>
          </div>
          {!us && (
            <div className="hb-row">
              <span>
                {taxLabel} <i>{taxPct}%</i>
              </span>
              <b className="mono">+ {money(tax)}</b>
            </div>
          )}

          <div className="hb-total">
            <span>Net payable now</span>
            <b className="mono">{money(netNow)}</b>
          </div>

          <div className="hb-aside">
            <div className="hb-row">
              <span>{Term} accumulated to date</span>
              <b className="mono">{money(holdbackToDate)}</b>
            </div>
            {taxLater > 0 && (
              <div className="hb-row">
                <span>{taxLabel} payable on release</span>
                <b className="mono">{money(taxLater)}</b>
              </div>
            )}

            {us ? (
              <>
                <p className="hb-note">
                  {custom ? (
                    <>
                      Using a {hbPct}% retainage. Check your state statute for the
                      ceiling that applies and the release clock that goes with it.
                    </>
                  ) : uncapped ? (
                    <>
                      <b>{p.name} sets no statutory ceiling</b> on {ptype} retainage
                      — {p.statute === 'No retainage statute' ? 'there is no retainage statute to fall back on' : `${p.statute} does not cap it`}. The {hbPct}% above is whatever your
                      contract says, not a legal limit.
                    </>
                  ) : statutoryPct === 0 ? (
                    <>
                      <b>{p.name} prohibits retainage</b> on {ptype} work under{' '}
                      <i>{p.statute}</i>. If someone is withholding it anyway, that
                      is the conversation to have.
                    </>
                  ) : (
                    <>
                      {p.name} caps {ptype} retainage at {statutoryPct}% under{' '}
                      <i>{p.statute}</i>.
                      {days
                        ? ` Release normally runs about ${days} days after completion or acceptance.`
                        : ' The statute sets no release deadline, so the contract controls the timing.'}
                    </>
                  )}
                </p>
                {!custom && !uncapped && p.reduction && (
                  <p className="hb-note">{p.reduction}</p>
                )}
                {!custom && p.note && <p className="hb-note">{p.note}</p>}
                <p className="hb-note">
                  There is no tax line here on purpose. In most states sales tax on
                  a construction contract attaches to materials when you buy them,
                  not to the progress draw you bill — so a retainage calculation
                  has no tax to defer.
                </p>
              </>
            ) : (
              <p className="hb-note">
                {custom ? (
                  <>
                    Using a {hbPct}% holdback. Check the lien legislation in your
                    jurisdiction for the correct rate and retention period.
                  </>
                ) : (
                  <>
                    Under {p.name}&rsquo;s <i>{p.act}</i>, that holdback is
                    normally retained for {p.days} days after substantial
                    performance before it can be released.
                  </>
                )}
              </p>
            )}
          </div>

          <div className="hb-dl">
            <p className="hb-dl-head">Take it to the draw meeting</p>
            <div className="hb-dl-fields">
              <div className="hb-field">
                <label htmlFor="hb-project">Project or job</label>
                <input
                  id="hb-project"
                  type="text"
                  value={project}
                  placeholder="Optional"
                  maxLength={70}
                  onChange={(e) => setProject(e.target.value)}
                />
              </div>
              <div className="hb-field hb-field-sm">
                <label htmlFor="hb-drawno">Draw #</label>
                <input
                  id="hb-drawno"
                  type="text"
                  value={drawNo}
                  placeholder="—"
                  maxLength={8}
                  onChange={(e) => setDrawNo(e.target.value)}
                />
              </div>
            </div>
            <button type="button" className="hb-btn" onClick={handleDownload}>
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
              Download PDF summary
            </button>
            <p className="hb-dl-note">
              One page, ready to attach to your progress claim. Generated in your
              browser — nothing is uploaded and nothing is stored.
            </p>
          </div>
        </div>
      </div>

      {us ? (
        <p className="hb-disclaimer">
          This calculator is a planning tool, not legal or tax advice. Retainage
          law is moving quickly — California, New York, Mississippi, Washington,
          Ohio, Iowa and Kentucky have all changed inside the last three years,
          and several caps turn on contract size, project type or the date you
          signed. Confirm the figures for your project with your attorney before
          you invoice.
        </p>
      ) : (
        <p className="hb-disclaimer">
          This calculator is a planning tool, not legal or tax advice. Holdback
          rates, retention periods and tax treatment vary by jurisdiction, by
          contract, and by project type — Alberta alone holds 90 days rather than
          60 on concrete and on oil and gas work. Confirm the numbers for your
          project with your lawyer and your accountant before you invoice.
        </p>
      )}
    </div>
  );
}
