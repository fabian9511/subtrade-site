// Dependency-free PDF writer for the holdback calculator.
//
// Builds a one-page Letter progress draw summary using the 14 standard PDF
// fonts, so there is nothing to embed, nothing to install, and nothing leaves
// the browser. Amounts are set in Courier (a fixed 600/1000 em) so they can be
// right-aligned exactly; labels are set in Helvetica and measured against the
// standard AFM width table below.

const PAGE_W = 612;
const PAGE_H = 792;
const M = 56;
const RIGHT = PAGE_W - M;
const COURIER_EM = 0.6;

// Helvetica advance widths, ASCII 32-126, in 1/1000 em.
const HELV = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];

// The standard fonts are single-byte encoded, so fold everything down to plain
// ASCII first. That also keeps byte offsets equal to string length in the xref.
function ascii(v) {
  return String(v == null ? '' : v)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[−­]/g, '-')
    .replace(/ /g, ' ')
    .replace(/[^\x20-\x7E]/g, '');
}

function esc(v) {
  return ascii(v)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function helvWidth(s, size) {
  const t = ascii(s);
  let w = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i) - 32;
    w += HELV[c] === undefined ? 556 : HELV[c];
  }
  return (w / 1000) * size;
}

function courierWidth(s, size) {
  return ascii(s).length * COURIER_EM * size;
}

// Greedy wrap on Helvetica metrics. Bold runs ~4% wider than regular, which the
// caller absorbs by passing a slightly narrower max width if it matters.
function wrap(s, size, maxWidth) {
  const words = ascii(s).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? line + ' ' + word : word;
    if (line && helvWidth(next, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------------------------------------------------------------- content ops

class Canvas {
  constructor() {
    this.ops = [];
    this.y = PAGE_H - M;
  }

  text(s, x, y, font, size, gray) {
    const str = esc(s);
    if (!str) return;
    this.ops.push(
      'BT',
      `${gray} g`,
      `/${font} ${size} Tf`,
      `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${str}) Tj`,
      'ET'
    );
  }

  right(s, xRight, y, font, size, gray) {
    const w = font[0] === 'C' ? courierWidth(s, size) : helvWidth(s, size);
    this.text(s, xRight - w, y, font, size, gray);
  }

  rule(y, gray, width) {
    this.ops.push(
      `${width} w`,
      `${gray} G`,
      `${M} ${y.toFixed(2)} m`,
      `${RIGHT} ${y.toFixed(2)} l`,
      'S'
    );
  }

  // A label on the left, a right-aligned monospaced value on the right.
  line(label, value, opts = {}) {
    const size = opts.size || 10;
    this.y -= opts.gap === undefined ? 17 : opts.gap;
    this.text(label, M, this.y, opts.bold ? 'H2' : 'H1', size, opts.labelGray || '0.32');
    if (opts.hint) {
      this.text(
        opts.hint,
        M + helvWidth(label, size) + 5,
        this.y,
        'H1',
        size - 1.5,
        '0.55'
      );
    }
    if (value !== undefined && value !== null && value !== '') {
      this.right(value, RIGHT, this.y, opts.mono === false ? 'H1' : 'C1', size, opts.valueGray || '0.08');
    }
  }

  heading(label) {
    this.y -= 26;
    this.text(label, M, this.y, 'H2', 8.5, '0.45');
    this.y -= 7;
    this.rule(this.y, '0.78', 0.6);
    this.y -= 3;
  }

  paragraph(s, size, gray, leading) {
    const lines = wrap(s, size, RIGHT - M);
    for (const l of lines) {
      this.y -= leading;
      this.text(l, M, this.y, 'H1', size, gray);
    }
  }

  stream() {
    return this.ops.join('\n');
  }
}

// ------------------------------------------------------------------ assembler

function assemble(content, title, producer) {
  const objs = [];
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objs[3] =
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
    '/Resources << /Font << /H1 5 0 R /H2 6 0 R /C1 7 0 R /C2 8 0 R >> >> ' +
    '/Contents 4 0 R >>';
  objs[4] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  objs[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objs[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  objs[7] = '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>';
  objs[8] = '<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>';
  objs[9] = `<< /Title (${esc(title)}) /Producer (${esc(producer || 'SubTrade construction holdback calculator')}) >>`;

  let out = '%PDF-1.4\n';
  const offsets = [];
  for (let i = 1; i < objs.length; i++) {
    offsets[i] = out.length;
    out += `${i} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const startxref = out.length;
  const size = objs.length;
  out += `xref\n0 ${size}\n0000000000 65535 f \n`;
  for (let i = 1; i < size; i++) {
    out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  out += `trailer\n<< /Size ${size} /Root 1 0 R /Info 9 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  return out;
}

// ------------------------------------------------------------------- the page

/**
 * d = {
 *   country,                             // 'CA' (default) or 'US'
 *   project, drawNo, date, province, act, days, hbPct, taxLabel, taxPct,
 *   contract, complete, billed,          // formatted display strings
 *   toDate, less, draw, holdback, tax, net,
 *   holdbackToDate, taxLater,            // taxLater may be ''
 *   taxOnHoldback,                       // boolean
 *
 *   // US only
 *   projectType,                         // 'Private' | 'Public / government-owned'
 *   rateWord,                            // 'Statutory' | 'Contract'
 *   uncapped,                            // true where the state sets no ceiling
 *   reduction, stateNote                 // may be ''
 * }
 */
export function drawSummaryPdf(d) {
  const us = d.country === 'US';
  const TERM = us ? 'retainage' : 'holdback';
  const Term = us ? 'Retainage' : 'Holdback';
  const rateWord = d.rateWord || 'Statutory';
  const typeWord = /Public/.test(d.projectType || '') ? 'public' : 'private';
  const c = new Canvas();

  c.text('PROGRESS DRAW SUMMARY', M, c.y, 'H2', 19, '0.08');
  c.y -= 13;
  c.rule(c.y, '0.35', 1.1);

  c.y -= 4;
  c.line('Project', d.project || 'Not specified', { mono: false, gap: 20 });
  if (d.drawNo) c.line('Draw number', d.drawNo);
  c.line('Prepared', d.date, { mono: false });
  c.line('Jurisdiction', d.province, { mono: false });
  if (us) c.line('Project type', d.projectType, { mono: false });

  c.heading('CONTRACT');
  c.line('Contract value', d.contract, { hint: 'including approved change orders' });
  c.line('Work complete to date', d.complete);
  c.line('Previously billed', d.billed, { hint: 'all prior draws, before tax' });

  c.heading('THIS PROGRESS CLAIM');
  c.line('Work in place to date', d.toDate);
  c.line('Less previously billed', d.less);
  c.y -= 6;
  c.rule(c.y + 1, '0.78', 0.6);
  c.line(`This draw, before ${TERM}`, d.draw, { bold: true, labelGray: '0.2' });
  c.line(`${rateWord} ${TERM}`, d.holdback, { hint: `${d.hbPct}%` });
  if (!us) {
    c.line(`${d.taxLabel}`, d.tax, {
      hint: d.taxOnHoldback ? `${d.taxPct}% on the full draw` : `${d.taxPct}% on the amount payable now`,
    });
  }

  c.y -= 12;
  c.rule(c.y + 2, '0.2', 1.4);
  c.y -= 5;
  c.text('NET PAYABLE NOW', M, c.y - 14, 'H2', 12, '0.08');
  c.right(d.net, RIGHT, c.y - 15, 'C2', 15, '0.08');
  c.y -= 22;
  c.rule(c.y, '0.78', 0.6);

  c.heading(us ? 'RETAINAGE POSITION' : 'HOLDBACK POSITION');
  c.line(`${Term} accumulated to date`, d.holdbackToDate);
  if (!us && d.taxLater) {
    c.line(`${d.taxLabel} payable when the holdback is released`, d.taxLater);
  }

  c.y -= 10;

  // Notes stop rather than run into the footer. The US branch has more to say
  // than there is always room for, so the order here is deliberate: the rule
  // that changes the number first, then the fine print.
  const para = (s) => {
    if (s && c.y > M + 108) c.paragraph(s, 9.5, '0.32', 15);
  };

  if (us) {
    if (d.uncapped) {
      para(
        `${d.province} sets no statutory ceiling on ${typeWord} retainage, so the ${d.hbPct}% used here ` +
          'comes from the contract rather than from statute. Read the payment clause before you sign it.'
      );
    } else if (d.act && Number(d.hbPct) === 0) {
      para(
        `${d.province} prohibits retainage on ${typeWord} work under ${d.act}. If it is being withheld ` +
          'anyway, that is a conversation to have before the next draw rather than at closeout.'
      );
    } else if (d.act) {
      para(
        `${d.province} caps ${typeWord} retainage at ${d.hbPct}% under ${d.act}.` +
          (d.days
            ? ` Release normally runs about ${d.days} days after completion or acceptance.`
            : ' The statute sets no release deadline, so the contract controls the timing.')
      );
    }
    para(d.reduction);
    para(d.stateNote);
    para(
      'No sales tax has been added. In most states sales tax on a construction contract attaches to ' +
        'materials at the time of purchase rather than to the progress draw, so there is no tax on this ' +
        'claim to defer. Confirm the treatment in your state.'
    );
  } else {
    if (d.act) {
      para(
        `Under ${d.province}'s ${d.act}, that holdback is normally retained for ${d.days} days after ` +
          'substantial performance before it can be released.'
      );
    }
    if (!d.taxOnHoldback) {
      para(
        `${d.taxLabel} has been calculated on the amount payable now rather than on the full draw. ` +
          'Under the Excise Tax Act, tax on a holdback becomes payable on the earlier of the day the ' +
          'holdback is paid out and the day the holdback period expires.'
      );
    }
  }

  // Footer, anchored to the bottom of the page rather than to the flow.
  c.rule(M + 66, '0.78', 0.6);
  const disclaimer = us
    ? 'This summary is a planning tool, not legal or tax advice. Retainage caps, release deadlines and ' +
      'step-down rules vary by state, by contract size and by the date the contract was signed, and several ' +
      'states have changed theirs recently. Confirm the figures for your project with your attorney before you invoice.'
    : 'This summary is a planning tool, not legal or tax advice. Holdback rates, retention periods and tax ' +
      'treatment vary by jurisdiction, by contract and by project type. Confirm the figures for your project ' +
      'with your lawyer and your accountant before you invoice.';
  let fy = M + 52;
  for (const l of wrap(disclaimer, 8, RIGHT - M)) {
    c.text(l, M, fy, 'H1', 8, '0.5');
    fy -= 11;
  }
  c.text(
    us
      ? 'Built with the free retainage calculator at subtradesoftware.com/construction-retainage-calculator/'
      : 'Built with the free holdback calculator at subtradesoftware.com/construction-holdback-calculator/',
    M,
    M - 4,
    'H1',
    8,
    '0.5'
  );

  return assemble(
    c.stream(),
    d.project ? `Draw summary - ${ascii(d.project)}` : 'Progress draw summary',
    us
      ? 'SubTrade construction retainage calculator'
      : 'SubTrade construction holdback calculator'
  );
}

export function downloadPdf(pdfString, filename) {
  const bytes = new Uint8Array(pdfString.length);
  for (let i = 0; i < pdfString.length; i++) bytes[i] = pdfString.charCodeAt(i) & 0xff;
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
