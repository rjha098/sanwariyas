// FILE: server/utils/pdfParsing.js
// Pure helpers for poppler output – no I/O, no dependencies.

// `pdfinfo` → total page count (NaN-safe: returns 0 when absent).
export const parsePageCount = (stdout) => {
  const n = Number.parseInt(/^Pages:\s+(\d+)/m.exec(String(stdout))?.[1], 10);
  return Number.isFinite(n) ? n : 0;
};

// `pdfinfo -f N -l N` → { w, h } in PDF points, or null.
export const parsePageSize = (stdout, page) => {
  const m = new RegExp(
    `^Page\\s+${Number(page)}\\s+size:\\s+([\\d.]+)\\s+x\\s+([\\d.]+)`,
    "m",
  ).exec(String(stdout));
  return m ? { w: Number(m[1]), h: Number(m[2]) } : null;
};

// `pdfimages -list` → one row per image, in the SAME order pdfimages writes
// its numbered output files (img-000, img-001, …) for a single-page run.
export const parseImageList = (stdout) => {
  const rows = [];
  for (const line of String(stdout).split("\n").slice(2)) {
    const c = line.trim().split(/\s+/);
    if (c.length < 14 || !/^\d+$/.test(c[0])) continue;
    rows.push({
      type: c[2],
      width: Number(c[3]),
      height: Number(c[4]),
      xppi: Number(c[12]),
      yppi: Number(c[13]),
    });
  }
  return rows;
};

// True when an embedded image covers (almost) the whole page, i.e. a scanned
// page. The rendered page image already contains it, so it is not extracted
// again as a separate asset. Orientation/rotation agnostic.
export const isFullPageImage = (row, pageSize, coverage = 0.85) => {
  if (!pageSize || !(row.xppi > 0) || !(row.yppi > 0)) return false;
  const wPts = (row.width / row.xppi) * 72;
  const hPts = (row.height / row.yppi) * 72;
  const pageLong = Math.max(pageSize.w, pageSize.h);
  const pageShort = Math.min(pageSize.w, pageSize.h);
  return (
    Math.max(wPts, hPts) >= pageLong * coverage &&
    Math.min(wPts, hPts) >= pageShort * coverage
  );
};