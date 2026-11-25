const S = window.SITE, $ = (s, e = document) => e.querySelector(s), $$ = (s, e = document) => [...e.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = n => S.currency + (Number.isInteger(n) ? n : n.toFixed(2));
const P = id => S.photos.find(p => p.id === id), SZ = id => S.sizes.find(s => s.id === id), FN = id => S.finishes.find(f => f.id === id);
const unit = i => SZ(i.size).price + FN(i.finish).extra;
const img = (p, c = "", eager) => `<img class="${c}" ${eager ? "" : 'loading="lazy"'} decoding="async" src="${p.src}" alt="${esc(p.title)}. ${esc(p.desc)}">`;
const inCol = id => S.photos.filter(p => p.collections.includes(id));
let basket = [], list = [], cat = "All", lbI = 0, timer, lastFocus;
try { basket = JSON.parse(localStorage.getItem("jr_basket") || "[]").filter(i => P(i.id) && SZ(i.size) && FN(i.finish)); } catch { }
const save = () => { try { localStorage.setItem("jr_basket", JSON.stringify(basket)); } catch { } };
const count = () => basket.reduce((n, i) => n + i.qty, 0);
const grid = l => { list = l; return `<div class="masonry">${l.map((p, i) => `<button class="ph" data-act="lb" data-i="${i}" data-t="${esc(p.title)}" aria-label="View ${esc(p.title)} full screen">${img(p)}</button>`).join("")}</div>`; };
const head = (t, sub = "") => `<header class="wrap" style="padding-bottom:1.5rem"><h1>${t}</h1>${sub ? `<p class="mut" style="max-width:60ch;margin-top:1rem">${sub}</p>` : ""}</header>`;
const NAV = [["home", "Home"], ["portfolio", "Portfolio"], ["prints", "Prints"], ["about", "About"], ["contact", "Contact"]];

const V = {
  home() {
    const hs = S.photos.filter(p => p.hero);
    return `<section class="hero"><div class="slides">${hs.map((p, i) => `<img class="${i ? "" : "on"}" ${i ? 'loading="lazy"' : ""} src="${p.src}" alt="${esc(p.title)}">`).join("")}</div><div class="shade"></div>
<div class="hero-in"><h1>${S.brand}</h1><p class="tag">${S.tagline}</p><div class="btns"><a class="btn" href="#portfolio">Explore My Photography</a><a class="btn ghost" href="#prints">Shop Prints</a></div></div></section>
<section class="wrap reveal"><h2>Collections</h2><div class="cols">${S.collections.map(c => { const ps = inCol(c.id); return ps.length ? `<a class="col" href="#collection-${c.id}">${img(ps[0])}<span>${c.name}</span><small>${ps.length} photo${ps.length > 1 ? "s" : ""}</small></a>` : `<div class="col empty"><span style="position:static">${c.name}</span><small style="position:static;display:block">Coming soon</small></div>`; }).join("")}</div></section>
<section class="wrap reveal" style="padding-top:0"><h2>Recent work</h2>${grid(S.photos)}</section>`;
  },
  portfolio() {
    const l = cat === "All" ? S.photos : S.photos.filter(p => p.categories.includes(cat));
    return head("Portfolio") + `<div class="wrap pills" role="group" aria-label="Filter by category">${["All", ...S.categories].map(c => `<button class="pill ${c === cat ? "on" : ""}" aria-pressed="${c === cat}" data-act="cat" data-v="${esc(c)}">${esc(c)}</button>`).join("")}</div><div class="wrap fade">${l.length ? grid(l) : `<p class="mut">There are no photos in ${esc(cat)} yet. Check back soon.</p>`}</div>`;
  },
  collection(id) {
    const c = S.collections.find(c => c.id === id); if (!c) return V.home(); const l = inCol(id);
    return head(c.name) + `<div class="wrap" style="padding-top:1rem">${l.length ? grid(l) : '<p class="mut">This collection is coming soon.</p>'}<p style="margin-top:2rem"><a class="btn ghost" href="#portfolio">All photography</a></p></div>`;
  },
  prints() {
    return head("Prints", `Unframed prints from ${money(Math.min(...S.sizes.map(s => s.price)))}. Framing is available on request, and delivery costs are calculated separately.`) +
      `<div class="wrap pgrid" style="padding-top:1rem">${S.photos.map(p => `<a class="card" href="#print-${p.id}"><div class="im">${img(p)}</div><h3>${esc(p.title)}</h3><span class="mut">From ${money(Math.min(...S.sizes.map(s => s.price)))}</span></a>`).join("")}</div>`;
  },
  print(id) {
    const p = P(id); if (!p) return V.prints();
    return `<div class="wrap prod"><div class="big">${img(p, "", 1)}</div><div><a class="mut" href="#prints">Back to prints</a><h1 style="font-size:clamp(2.2rem,5vw,3.4rem);margin:.6rem 0">${esc(p.title)}</h1><p class="mut">${esc(p.desc)}</p>
<form id="pf" data-id="${p.id}"><label for="sz">Print size</label><select id="sz">${S.sizes.map(s => `<option value="${s.id}">${s.name}, ${money(s.price)}</option>`).join("")}</select>
<label for="fn">Paper finish</label><select id="fn">${S.finishes.map(f => `<option value="${f.id}">${f.name}${f.extra ? ` (+${money(f.extra)})` : ""}</option>`).join("")}</select>
<label for="qt">Quantity</label><input id="qt" type="number" min="1" max="50" value="1"><div class="price" id="pp" aria-live="polite"></div><p class="mut" style="margin:0 0 1.2rem">Unframed print</p>
<button class="btn" type="submit">Add to basket</button></form><p class="note">Framing is available on request. Delivery costs are calculated separately.</p></div></div>`;
  },
  about() {
    return head("About") + `<div class="wrap two" style="padding-top:1rem"><div><p>I’m the photographer behind ${S.brand}. I love going out with a camera and coming back with a place: the shape of a bridge, the mood of a street, the way light settles on a hillside.</p>
<h3 style="margin:2rem 0 .6rem">My style</h3><p>I’m drawn to strong lines, big skies and quiet detail. I work in both colour and black and white, and often use long exposures to turn movement into something you can feel: traffic that streaks, people who blur, rivers that soften.</p>
<h3 style="margin:2rem 0 .6rem">What inspires me</h3><p>Landscapes, architecture, city environments, nature and everyday moments. Cities are full of angles and stories, and the countryside gives you space to slow down.</p>
<h3 style="margin:2rem 0 .6rem">Why I shoot</h3><p>I’m passionate about capturing locations and perspectives: seeing somewhere familiar from a new angle, or somewhere new for the first time. If one of my photographs makes you feel like you’re there, it’s done its job.</p>
<p style="margin-top:2rem"><a class="btn" href="#contact">Get in touch</a></p></div><div class="portrait">${S.portrait ? `<img src="${S.portrait}" alt="Portrait of the photographer">` : "A portrait will appear here once you add one in data.js"}</div></div>`;
  },
  contact() {
    const soc = Object.entries(S.social).filter(([, u]) => u);
    return head("Contact", "Questions about prints, a photography enquiry or a collaboration? Send a message.") +
      `<div class="wrap two" style="padding-top:1rem"><form id="cf"><label for="n">Name</label><input id="n" name="name" required autocomplete="name"><label for="e">Email</label><input id="e" name="email" type="email" required autocomplete="email">
<label for="t">Enquiry type</label><select id="t" name="type"><option>Print purchase</option><option>Photography enquiry</option><option>Collaboration</option><option>Other</option></select>
<label for="s">Subject</label><input id="s" name="subject" required><label for="m">Message</label><textarea id="m" name="message" rows="6" required></textarea>
<p style="margin-top:1.4rem"><button class="btn" type="submit">Send message</button></p><p id="cm" class="note" role="status"></p></form>
<div><h3>Elsewhere</h3><p class="mut">${soc.length ? soc.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" style="display:block">${n}</a>`).join("") : "Social links will appear here once you add them in data.js."}</p></div></div>`;
  }
};

function render() {
  const h = location.hash.slice(1) || "home"; let v;
  if (h.startsWith("print-")) v = V.print(h.slice(6)); else if (h.startsWith("collection-")) v = V.collection(h.slice(11)); else v = (V[h] || V.home)();
  $("#app").innerHTML = v; clearInterval(timer); scrollTo(0, 0);
  const sl = $$(".slides img"), pt = $("#pp"); if (sl.length > 1) { let k = 0; timer = setInterval(() => { sl[k].classList.remove("on"); k = (k + 1) % sl.length; sl[k].classList.add("on"); }, 6500); }
  if (pt) price();
  const base = h.split("-")[0]; $$("#nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + (base === "print" ? "prints" : base === "collection" ? "portfolio" : base)));
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .08 }); $$(".reveal").forEach(e => io.observe(e));
  const pr = P(h.slice(6)); document.title = (h.startsWith("print-") && pr ? pr.title + " print | " : "") + "jr_photography";
  closeMenu();
}
const price = () => { const i = { size: $("#sz").value, finish: $("#fn").value }; $("#pp").textContent = money(unit(i) * (+$("#qt").value || 1)); };
const closeMenu = () => { $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false"); };

function nav() { $("#nav").innerHTML = NAV.map(([h, t]) => `<a href="#${h}">${t}</a>`).join("") + `<button data-act="bk" aria-label="Open basket">Basket (<span id="bc">0</span>)</button>`; }
function foot() {
  const soc = Object.entries(S.social).filter(([, u]) => u);
  $("#foot").innerHTML = `<div class="fg"><div><a class="logo" href="#home" style="color:#fff;font-size:1.6rem;display:inline-block">${S.brand}</a><p class="mut" style="max-width:34ch">${S.tagline}</p></div><div><h4>Explore</h4>${NAV.map(([h, t]) => `<a href="#${h}">${t}</a>`).join("")}</div><div><h4>Connect</h4><a href="#contact">Send a message</a>${soc.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`).join("")}</div></div><p class="mut" style="text-align:center;font-size:.8rem;padding-bottom:2rem">© ${new Date().getFullYear()} ${S.brand}. All photographs are copyright of the photographer.</p>`;
}

function drawBasket(msg = "") {
  const b = $("#basket"), sub = basket.reduce((n, i) => n + unit(i) * i.qty, 0);
  b.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0">Basket</h2><button class="lbb" style="position:static" data-act="bc" aria-label="Close basket">✕</button></div>
<div style="flex:1;overflow:auto;margin:1rem 0">${basket.length ? basket.map((i, k) => { const p = P(i.id); return `<div class="bi">${img(p)}<div><strong style="font-weight:400">${esc(p.title)}</strong><small>${SZ(i.size).name}, ${FN(i.finish).name}</small><div class="q"><button data-act="qm" data-k="${k}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-act="qp" data-k="${k}" aria-label="Increase quantity">+</button></div></div><div style="text-align:right">${money(unit(i) * i.qty)}<br><button class="lnk" data-act="rm" data-k="${k}">Remove</button></div></div>`; }).join("") : '<p class="mut">Your basket is empty. Choose a photograph from the <a href="#prints" data-act="bc">prints</a> page.</p>'}</div>
<div style="display:flex;justify-content:space-between;font-size:1.2rem"><span>Subtotal</span><strong style="font-weight:400">${money(sub)}</strong></div><p class="note" style="margin:.5rem 0 1rem">Unframed prints. Delivery is calculated separately.</p>
<button class="btn" data-act="co" ${basket.length ? "" : "disabled"}>Proceed to checkout</button><p class="note" id="cm2" role="status">${msg}</p>`;
  $("#bc").textContent = count();
}
const openBasket = () => { drawBasket(); $("#basket").hidden = false; lastFocus = document.activeElement; $("#basket .lbb").focus(); };
const closeBasket = () => { $("#basket").hidden = true; lastFocus && lastFocus.focus(); };

async function checkout() {
  if (!S.checkoutEndpoint) return drawBasket("Checkout isn’t connected to a payment provider yet. The site owner needs to add a Stripe checkout endpoint (see README.md).");
  drawBasket("Redirecting to secure payment…");
  try {
    const r = await fetch(S.checkoutEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: basket.map(i => ({ id: i.id, title: P(i.id).title, size: i.size, finish: i.finish, qty: i.qty })) }) });
    const d = await r.json(); if (!d.url) throw 0; location.href = d.url;
  } catch { drawBasket("Sorry, checkout couldn’t start. Please try again or contact me to order."); }
}

const lbDraw = () => {
  const p = list[lbI]; $("#lb").innerHTML = `<button class="lbb lbx" data-act="lc" aria-label="Close">✕</button><button class="lbb lbp" data-act="lp" aria-label="Previous photo">‹</button><button class="lbb lbn" data-act="ln" aria-label="Next photo">›</button>
<div class="stage"><img class="fade" src="${p.src}" alt="${esc(p.title)}. ${esc(p.desc)}"></div><div class="cap"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p><a class="btn ghost" href="#print-${p.id}" data-act="lc">Buy a print</a></div>`;
  $(".lbx").focus();
};
const lbOpen = i => { lastFocus = document.activeElement; lbI = i; $("#lb").hidden = false; document.body.style.overflow = "hidden"; lbDraw(); };
const lbClose = () => { $("#lb").hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
const lbGo = d => { lbI = (lbI + d + list.length) % list.length; lbDraw(); };

document.addEventListener("click", e => {
  if (!e.target.closest("#nav") && !e.target.closest("#burger")) closeMenu();
  const t = e.target.closest("[data-act]"); if (!t) return; const k = +t.dataset.k, a = t.dataset.act;
  if (a === "lb") lbOpen(+t.dataset.i); else if (a === "lc") lbClose(); else if (a === "lp") lbGo(-1); else if (a === "ln") lbGo(1);
  else if (a === "cat") { cat = t.dataset.v; $("#app").innerHTML = V.portfolio(); }
  else if (a === "bk") openBasket(); else if (a === "bc") closeBasket(); else if (a === "co") checkout();
  else { if (a === "qp") basket[k].qty = Math.min(50, basket[k].qty + 1); if (a === "qm") basket[k].qty = Math.max(1, basket[k].qty - 1); if (a === "rm") basket.splice(k, 1); save(); drawBasket(); }
});
document.addEventListener("input", e => { if (e.target.closest("#pf")) price(); });
document.addEventListener("submit", async e => {
  e.preventDefault(); const f = e.target;
  if (f.id === "pf") {
    const id = f.dataset.id, size = $("#sz").value, finish = $("#fn").value, qty = Math.max(1, Math.min(50, +$("#qt").value || 1)), ex = basket.find(i => i.id === id && i.size === size && i.finish === finish);
    ex ? ex.qty = Math.min(50, ex.qty + qty) : basket.push({ id, size, finish, qty }); save(); openBasket();
  } else if (f.id === "cf") {
    const m = $("#cm"), d = new FormData(f);
    if (S.formEndpoint) { try { const r = await fetch(S.formEndpoint, { method: "POST", body: d, headers: { Accept: "application/json" } }); if (!r.ok) throw 0; f.reset(); m.textContent = "Thank you. Your message has been sent."; } catch { m.textContent = "Your message couldn’t be sent. Please try again later."; } }
    else if (S.email) { location.href = `mailto:${S.email}?subject=${encodeURIComponent(d.get("type") + ": " + d.get("subject"))}&body=${encodeURIComponent(d.get("message") + "\n\n" + d.get("name") + " (" + d.get("email") + ")")}`; }
    else m.textContent = "The contact form isn’t connected to email yet. The site owner needs to add a form endpoint or email address in data.js.";
  }
});
document.addEventListener("keydown", e => {
  if (!$("#lb").hidden) { if (e.key === "Escape") lbClose(); if (e.key === "ArrowLeft") lbGo(-1); if (e.key === "ArrowRight") lbGo(1); }
  else if (!$("#basket").hidden && e.key === "Escape") closeBasket();
});
$("#burger").onclick = () => { const o = $("#nav").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); };
addEventListener("hashchange", render); nav(); foot(); render(); $("#bc").textContent = count();
