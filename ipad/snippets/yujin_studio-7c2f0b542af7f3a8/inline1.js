
let dbp = null;
function db() {
  if (!dbp) dbp = new Promise((ok, ko) => {
    const r = indexedDB.open('yujin-studio', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('fichiers');
    r.onsuccess = () => ok(r.result);
    r.onerror = () => ko(r.error);
  });
  return dbp;
}
export async function idb_load_all() {
  const d = await db();
  return await new Promise((ok, ko) => {
    const out = [];
    const tx = d.transaction('fichiers', 'readonly');
    const c = tx.objectStore('fichiers').openCursor();
    c.onsuccess = () => {
      const cur = c.result;
      if (cur) { out.push([String(cur.key), cur.value.t || 0, new Uint8Array(cur.value.d)]); cur.continue(); }
      else ok(out);
    };
    c.onerror = () => ko(c.error);
  });
}
export function idb_put(k, t, data) {
  const copy = data.slice();
  db().then(d => d.transaction('fichiers', 'readwrite').objectStore('fichiers').put({ t, d: copy.buffer }, k)).catch(e => console.error(e));
}
export function idb_del(k) {
  db().then(d => d.transaction('fichiers', 'readwrite').objectStore('fichiers').delete(k)).catch(e => console.error(e));
}
export function persist() { try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {} }
