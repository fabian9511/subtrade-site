'use client';

import { useState } from 'react';
import { PROVINCES } from '../lib/holdback';
import { drawSummaryPdf, downloadPdf } from '../lib/holdbackPdf';

const money = (n) =>
  (isFinite(n) ? n : 0).toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

// Strip anything that isn't a digit or a decimal point, keep one decimal point.
function clean(raw) {
  const s = String(raw).replace(/[^0-9.]/g, '');
  const parts = s.split('.');
  return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : s;
}

export default function HoldbackCalc() {
  const [prov, setProv] = useState('AB');
  const [contract, setContract] = useState('180000');
  const [complete, setComplete] = useState(45);
  const [billed, setBilled] = useState('54000');
  const [pctOverride, setPctOverride] = useState('');
  const [taxOnHoldback, setTaxOnHoldback] = useState(false);
  const [project, setProject] = useState('');
  const [drawNo, setDrawNo] = useState('');

  const p = PROVINCES.find((x) => x.code === prov) || PROVINCES[0];
  const custom = prov === 'XX';

  const hbPct = custom
    ? Number(pctOverride === '' ? p.pct : pctOverride)
    : p.pct;
  const taxPct = p.tax;

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
  const tax = taxBase * (taxPct / 100);

  const netNow = afterHoldback + tax;
  const holdbackToDate = toDate * (hbPct / 100);
  const taxLater = taxOnHoldback ? 0 : holdback * (taxPct / 100);

  const taxLabel = taxPct === 13 ? 'HST' : 'GST';

  function handleDownload() {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');

    const pdf = drawSummaryPdf({
      project: project.trim(),
      drawNo: drawNo.trim(),
      date: now.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      province: custom ? 'Not specified' : p.name,
      act: custom ? null : p.act,
      days: p.days,
      hbPct,
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
            <label htmlFor="hb-prov">Province</label>
            <select
              id="hb-prov"
              value={prov}
              onChange={(e) => setProv(e.target.value)}
            >
              {PROVINCES.map((x) => (
                <option key={x.code} value={x.code}>
                  {x.name}
                  {x.code !== 'XX' ? ` — ${x.pct}%` : ''}
                </option>
              ))}
            </select>
          </div>

          {custom && (
            <div className="hb-field">
              <label htmlFor="hb-pct">Holdback percentage</label>
              <div className="hb-suffix">
                <input
                  id="hb-pct"
                  inputMode="decimal"
                  value={pctOverride}
                  placeholder="10"
                  onChange={(e) => setPctOverride(clean(e.target.value))}
                />
                <span>%</span>
              </div>
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

          <label className="hb-check">
            <input
              type="checkbox"
              checked={taxOnHoldback}
              onChange={(e) => setTaxOnHoldback(e.target.checked)}
            />
            <span>
              Charge {taxPct === 13 ? 'HST' : 'GST'} on the holdback now
              <em>
                Off by default. CRA treats tax on a holdback as payable when the
                holdback is released or the lien period expires, whichever comes
                first.
              </em>
            </span>
          </label>
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
            <span>This draw, before holdback</span>
            <b className="mono">{money(draw)}</b>
          </div>
          <div className="hb-row hb-neg">
            <span>
              Statutory holdback <i>{hbPct}%</i>
            </span>
            <b className="mono">− {money(holdback)}</b>
          </div>
          <div className="hb-row">
            <span>
              {taxPct === 13 ? 'HST' : 'GST'} <i>{taxPct}%</i>
            </span>
            <b className="mono">+ {money(tax)}</b>
          </div>

          <div className="hb-total">
            <span>Net payable now</span>
            <b className="mono">{money(netNow)}</b>
          </div>

          <div className="hb-aside">
            <div className="hb-row">
              <span>Holdback accumulated to date</span>
              <b className="mono">{money(holdbackToDate)}</b>
            </div>
            {taxLater > 0 && (
              <div className="hb-row">
                <span>{taxPct === 13 ? 'HST' : 'GST'} payable on release</span>
                <b className="mono">{money(taxLater)}</b>
              </div>
            )}
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

      <p className="hb-disclaimer">
        This calculator is a planning tool, not legal or tax advice. Holdback
        rates, retention periods and tax treatment vary by jurisdiction, by
        contract, and by project type — Alberta alone holds 90 days rather than
        60 on concrete and on oil and gas work. Confirm the numbers for your
        project with your lawyer and your accountant before you invoice.
      </p>
    </div>
  );
}
