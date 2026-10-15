
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.getElementById("year").textContent = new Date().getFullYear();

// ---------------------------------------------------------------- nav
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
document.getElementById("menu-btn").addEventListener("click", () => document.getElementById("menu").classList.toggle("open"));
document.querySelectorAll("#menu a").forEach(a => a.addEventListener("click", () => document.getElementById("menu").classList.remove("open")));
const links = [...document.querySelectorAll("#menu a")];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach(s => spy.observe(s));

// ---------------------------------------------------------------- reveal + counters
const count = el => {
  const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || (to % 1 ? 1 : 0)), suf = el.dataset.suffix || "";
  if (reduced) { el.textContent = to.toFixed(dec) + suf; return; }
  const t0 = performance.now();
  (function step(t) { const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 4); el.textContent = (to * e).toFixed(dec) + suf; if (k < 1) requestAnimationFrame(step); })(t0);
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  e.target.querySelectorAll("[data-count]").forEach(count);
  io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });

// ---------------------------------------------------------------- metrics that are filled from results.json
fetch("assets/results.json").then(r => r.ok ? r.json() : null).then(res => {
  if (!res) return;
  document.querySelectorAll("[data-k]").forEach(td => {
    const v = res[td.dataset.k]; if (v == null) return;
    const pass = td.dataset.k.startsWith("faith") && v >= 0.95;
    td.innerHTML = pass ? `<span class="ok">${v.toFixed(2)}</span>` : v.toFixed(2);
  });
}).catch(() => {});

// ---------------------------------------------------------------- tilt on screenshots
document.querySelectorAll(".shot").forEach(el => {
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1200px) rotateY(${(x - .5) * 6}deg) rotateX(${(.5 - y) * 6}deg)`;
    el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%");
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});

// ---------------------------------------------------------------- hero: a slowly turning "knowledge constellation"
// The 3D hero is progressive enhancement: Three.js (~690 KB) is fetched only after the page has rendered, and not at
// all on small screens, data-saver connections or when the visitor prefers reduced motion.
function startHero() {
  const small = matchMedia("(max-width: 720px)").matches, saveData = navigator.connection?.saveData;
  if (reduced || small || saveData) return;
  import("../vendor/three.module.min.js").then(hero).catch(() => {});
}
if (document.readyState === "complete") (window.requestIdleCallback || setTimeout)(startHero);
else addEventListener("load", () => (window.requestIdleCallback || setTimeout)(startHero));

function hero(THREE) {
  const canvas = document.getElementById("hero3d");
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return; }
  requestAnimationFrame(() => requestAnimationFrame(() => canvas.classList.add("on")));
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(55, 1, .1, 200);
  camera.position.set(0, 0, 34);
  const group = new THREE.Group(); scene.add(group);

  // nodes on a few concentric shells, like documents around a query
  const N = 900, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), pts = [];
  const ca = new THREE.Color("#3fd6c4"), cb = new THREE.Color("#5b8cff"), cc = new THREE.Color("#b48cff");
  for (let i = 0; i < N; i++) {
    const shell = 6 + (i % 4) * 4.2 + Math.random() * 1.5;
    const v = new THREE.Vector3().randomDirection().multiplyScalar(shell);
    v.y *= .62;
    pts.push(v); pos.set([v.x, v.y, v.z], i * 3);
    const c = ca.clone().lerp(i % 3 ? cb : cc, Math.random());
    col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const sprite = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.3, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  group.add(new THREE.Points(g, new THREE.PointsMaterial({ size: .42, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  // links between near neighbours
  const lp = [];
  for (let i = 0; i < N; i += 2) for (let j = i + 1; j < Math.min(N, i + 40); j++) if (pts[i].distanceTo(pts[j]) < 3.1) { lp.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z); }
  const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(lp, 3));
  group.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: "#5b8cff", transparent: true, opacity: .16, blending: THREE.AdditiveBlending })));

  // the "query" core with retrieval pulses travelling out to a few nodes
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: "#3fd6c4", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  core.scale.setScalar(5); group.add(core);
  const pulses = Array.from({ length: 14 }, () => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: "#9ef0e4", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.scale.setScalar(.9); group.add(s);
    return { s, target: pts[Math.floor(Math.random() * N)], t: Math.random() };
  });

  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    group.position.x = w > 960 ? 14 : 0; };
  addEventListener("resize", resize); resize();
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
    mx += (tx - mx) * .04; my += (ty - my) * .04;
    if (!reduced) group.rotation.y += dt * .06;
    group.rotation.x = .25 + my * .3; camera.position.x = mx * 4; camera.lookAt(group.position);
    core.scale.setScalar(5 + Math.sin(t * 2) * .5);
    for (const p of pulses) {
      p.t += dt * .45;
      if (p.t > 1) { p.t = 0; p.target = pts[Math.floor(Math.random() * N)]; }
      p.s.position.copy(p.target).multiplyScalar(p.t); p.s.material.opacity = Math.sin(p.t * Math.PI);
    }
    renderer.render(scene, camera);
  })();
}
