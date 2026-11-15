/**
 * A small Markdown → HTML renderer for the component READMEs: headings,
 * paragraphs, lists, tables, blockquotes, fenced code, inline code, bold,
 * italics and links. Everything is escaped first, so README text can never
 * inject markup. Output uses the library's own classes.
 */

export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

/** Inline spans. `link(href)` rewrites link targets; return null to drop the link. */
export function inline(text, link = (href) => href) {
  const codes = [];
  let out = escapeHtml(text).replace(/`([^`]+)`/g, (_, code) => `\u0000${codes.push(code) - 1}\u0000`);
  out = out
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const target = link(href.replace(/&amp;/g, "&"));
      return target === null ? label : `<a href="${escapeHtml(target)}">${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])_([^_\s][^_]*)_(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}

const splitRow = (line) => line.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, "|"));

/**
 * Render a Markdown fragment. `headingOffset` shifts heading levels (## → h2
 * by default); `idPrefix` namespaces heading ids.
 */
export function markdown(md, { link, headingOffset = 0, idPrefix = "" } = {}) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const slug = (s) => idPrefix + s.toLowerCase().replace(/<[^>]+>|&[a-z#0-9]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const body = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) body.push(lines[i]);
      i++;
      out.push(`<figure class="mp-code-block" data-theme="dark"><pre tabindex="0"><code>${escapeHtml(body.join("\n"))}</code></pre></figure>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(6, heading[1].length + headingOffset);
      const text = inline(heading[2], link);
      out.push(`<h${level} id="${slug(text)}">${text}</h${level}>`);
      i++;
      continue;
    }

    if (/^\|/.test(line) && /^\|?\s*:?-{3,}/.test(lines[i + 1] || "")) {
      const head = splitRow(line);
      const rows = [];
      for (i += 2; i < lines.length && /^\|/.test(lines[i]); i++) rows.push(splitRow(lines[i]));
      const name = head.map((h) => h.replace(/[`*_]/g, "")).join(", ");
      out.push(`<div class="mp-table-wrap" tabindex="0" role="region" aria-label="${escapeHtml(name)}"><table class="mp-table"><thead><tr>${head.map((h) => `<th scope="col">${inline(h, link)}</th>`).join("")}</tr></thead><tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c, link)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const body = [];
      for (; i < lines.length && /^>\s?/.test(lines[i]); i++) body.push(lines[i].replace(/^>\s?/, ""));
      out.push(`<blockquote>${markdown(body.join("\n"), { link, headingOffset, idPrefix })}</blockquote>`);
      continue;
    }

    const bullet = /^(\s*)([-*]|\d+\.)\s+/;
    if (bullet.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      for (; i < lines.length && lines[i].trim(); i++) {
        if (bullet.test(lines[i])) items.push(lines[i].replace(bullet, ""));
        else items[items.length - 1] += " " + lines[i].trim(); // continuation line
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((item) => `<li>${inline(item, link)}</li>`).join("")}</${tag}>`);
      continue;
    }

    const para = [];
    for (; i < lines.length && lines[i].trim() && !/^(```|#{1,6}\s|>|\||\s*([-*]|\d+\.)\s)/.test(lines[i]); i++) para.push(lines[i].trim());
    out.push(`<p>${inline(para.join(" "), link)}</p>`);
  }
  return out.join("\n");
}
