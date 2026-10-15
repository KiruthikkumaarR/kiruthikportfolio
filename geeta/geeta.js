document.getElementById("year").textContent = new Date().getFullYear();
const count = el => {
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "", t0 = performance.now();
  const tick = t => { const p = Math.min(1, (t - t0) / 1200); el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  e.target.querySelectorAll("[data-count]").forEach(count);
  if (e.target.dataset.count) count(e.target);
  io.unobserve(e.target);
}), { threshold: .12 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
