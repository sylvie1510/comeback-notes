/* ============================================================
   הזמנות קטנות · המנוע
   ============================================================ */
(function(){
'use strict';

const KEY = 'notes.g';          // 'f' = אני כותבת לו · 'm' = אני כותב לה
let G = 'f';
try{ const r = localStorage.getItem(KEY); if(r === 'm' || r === 'f') G = r; }catch(e){}

const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* [שלי] לפי המגדר שלי · <שלך> לפי המגדר של מי שמקבל */
function rz(t){
  const meM = (G === 'm'), youM = !meM;
  return String(t)
    .replace(/\[([^\[\]]*?)\/([^\[\]]*?)\]/g, (_,m,f) => meM ? m : f)
    .replace(/<([^<>]*?)\/([^<>]*?)>/g,      (_,m,f) => youM ? m : f);
}

function render(){
  document.getElementById('title').textContent = TITLE;
  document.getElementById('sub').textContent = rz(SUB);

  document.querySelectorAll('[data-g]').forEach(b =>
    b.setAttribute('aria-pressed', b.dataset.g === G));

  const hb = document.getElementById('howto');
  if(hb) hb.innerHTML = `<div class="eyebrow">${esc(HOWTO_T)}</div>` +
    HOWTO.map(l => `<p>${esc(rz(l))}</p>`).join('');

  document.getElementById('cats').innerHTML = `<div class="cards">${
    NOTES.map(t => {
      const v = rz(t);
      const msg = v + '\n' + rz(CLOSER);
      return `<article class="note">
        <p>${esc(v)}</p>
        <span class="closer">${esc(rz(CLOSER))}</span>
        <div class="acts">
          <a class="wa" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.67.15-.2.3-.77.97-.94 1.16-.18.2-.35.23-.65.08-.3-.15-1.26-.47-2.39-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 00-3.48-8.42z"/></svg>
            לשלוח
          </a>
          <button type="button" class="cp" data-cp="${esc(msg)}">להעתיק</button>
        </div>
      </article>`;
    }).join('')
  }</div>`;
}

document.addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.g){
    G = b.dataset.g;
    try{ localStorage.setItem(KEY, G); }catch(err){}
    render();
    return;
  }
  if(b.dataset.cp !== undefined){
    const t = b.dataset.cp;
    const done = () => { b.textContent = 'הועתק'; setTimeout(()=>{ b.textContent = 'להעתיק'; }, 1600); };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(done).catch(()=>{});
    } else {
      const ta = document.createElement('textarea');
      ta.value = t; ta.setAttribute('readonly','');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); done(); }catch(err){}
      document.body.removeChild(ta);
    }
  }
});

document.readyState === 'loading' ? addEventListener('DOMContentLoaded', render) : render();
})();
