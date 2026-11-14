
export function ys_download(name, mime, data) {
  const blob = new Blob([data.slice()], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.style.display = 'none';
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 4000);
}
export function ys_open(url) { window.open(url, '_blank'); }
export function ys_pick() {
  return new Promise((ok) => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.multiple = true;
    inp.style.position = 'fixed'; inp.style.left = '-1000px';
    document.body.appendChild(inp);
    inp.onchange = async () => {
      const out = [];
      for (const f of inp.files) {
        try { out.push([f.name, new Uint8Array(await f.arrayBuffer())]); } catch (e) { console.error(e); }
      }
      inp.remove();
      ok(out);
    };
    inp.click();
  });
}
