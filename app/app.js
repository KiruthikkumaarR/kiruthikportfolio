// Sends the visitor to GEETA's current address. The address lives in url.json and is
// updated automatically by the GEETA computer (deploy/update_public_link.sh) when it changes.
(async () => {
  const msg = document.getElementById("msg"), go = document.getElementById("go"), spin = document.getElementById("spin");
  const ALLOWED = /^https:\/\/[a-z0-9-]+\.trycloudflare\.com\/?$|^https:\/\/geeta\.kiruthikportfolio\.com\/?$/;
  try {
    const r = await fetch("url.json?t=" + Date.now(), { cache: "no-store" });
    const { url } = await r.json();
    if (!ALLOWED.test(url)) throw new Error("bad address");
    go.href = url; go.hidden = false;
    msg.textContent = "Taking you there now.";
    location.replace(url);
  } catch (e) {
    spin.hidden = true;
    msg.textContent = "GEETA isn't available right now. Please try again later.";
  }
})();
