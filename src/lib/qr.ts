import QRCode from 'qrcode';

/**
 * A QR code as one SVG path of square cells, with a 4-cell quiet zone.
 * Rows are run-length merged so the path stays small.
 */
export function qrPath(text: string) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const quiet = 4;
  const size = modules.size;
  let d = '';
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (!modules.get(y, x)) {
        x++;
        continue;
      }
      const start = x;
      while (x < size && modules.get(y, x)) x++;
      d += `M${start + quiet} ${y + quiet}h${x - start}v1h-${x - start}z`;
    }
  }
  return { d, view: size + quiet * 2 };
}

/** Standalone SVG for print: dark cells on a light tile, which every scanner reads. */
export function qrSvg(text: string, ink = '#131215', paper = '#f6f4f1') {
  const { d, view } = qrPath(text);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${view} ${view}" shape-rendering="crispEdges"><rect width="${view}" height="${view}" fill="${paper}"/><path d="${d}" fill="${ink}"/></svg>`;
}
