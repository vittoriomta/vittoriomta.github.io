// askmap project page: three small live demos. Vanilla, no dependencies. Each plays only while
// on screen and settles to a still frame under reduced motion.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
  const NS = "http://www.w3.org/2000/svg"
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag)
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v)
    parent?.appendChild(e)
    return e
  }
  const onVisible = (node, start, stop) => new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.35 }).observe(node)

  // One small map, shared by the pipeline and friction demos (viewBox 600 × 320).
  const CATS = [
    { name: "IT and access", x: 170, y: 165, r: 95, hue: "#6d5bb5", kids: [
      { name: "Reset VPN access", x: 142, y: 142, r: 48, f: 0.46 },
      { name: "Set up laptops", x: 206, y: 207, r: 32, f: 0.22 },
      { name: "Email sync", x: 218, y: 118, r: 23, f: 0.31 },
    ] },
    { name: "Writing", x: 372, y: 118, r: 78, hue: "#2f7ea3", kids: [
      { name: "Summarize documents", x: 352, y: 114, r: 44, f: 0.09 },
      { name: "Translate", x: 417, y: 150, r: 25, f: 0.16 },
      { name: "", x: 410, y: 82, r: 17, f: 0.12 },
    ] },
    { name: "Customers", x: 446, y: 252, r: 62, hue: "#c27c2c", kids: [
      { name: "Reply to complaints", x: 432, y: 247, r: 34, f: 0.19 },
      { name: "", x: 482, y: 275, r: 19, f: 0.1 },
      { name: "", x: 474, y: 216, r: 15, f: 0.14 },
    ] },
  ]
  const surface = "#201e18"
  const mix = (hex, amount) => {
    const n = (h) => parseInt(h, 16)
    const a = [n(hex.slice(1, 3)), n(hex.slice(3, 5)), n(hex.slice(5, 7))]
    const b = [n(surface.slice(1, 3)), n(surface.slice(3, 5)), n(surface.slice(5, 7))]
    return `rgb(${a.map((v, i) => Math.round(v * amount + b[i] * (1 - amount))).join(",")})`
  }
  const topicFill = (cat) => mix(cat.hue, 0.42)
  const frictionFill = (f) => mix("#eb5600", 0.12 + Math.min(1, f / 0.5) * 0.8)

  function drawMap(svg) {
    const blobs = []
    const rings = []
    const labels = []
    for (const cat of CATS) {
      const ring = el("circle", { cx: cat.x, cy: cat.y, r: cat.r, class: "am-ring" }, svg)
      const t = el("text", { x: cat.x, y: cat.y - cat.r - 8, class: "am-label am-cat" }, svg)
      t.textContent = cat.name
      rings.push(ring)
      labels.push(t)
      for (const k of cat.kids) {
        const b = el("circle", { cx: k.x, cy: k.y, r: k.r, class: "am-blob", fill: topicFill(cat) }, svg)
        blobs.push({ el: b, cat, k })
        if (k.name && k.r > 22) {
          const words = k.name.split(" ")
          const lines = k.r > 40 || words.length < 2 ? [k.name] : [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")]
          lines.forEach((line, i) => {
            const lt = el("text", { x: k.x, y: k.y + 4 + (i - (lines.length - 1) / 2) * 12, class: "am-label" }, svg)
            lt.textContent = line
            labels.push(lt)
          })
        }
      }
    }
    return { blobs, rings, labels }
  }

  /* ── Pipeline: scattered conversations gather into the map ─────────── */

  function pipeline(root) {
    const svg = el("svg", { viewBox: "0 0 600 320", role: "img", "aria-hidden": "true" }, root)
    const dotsLayer = el("g", {}, svg)
    const { blobs, rings, labels } = drawMap(svg)
    const all = CATS.flatMap((c) => c.kids)
    const weight = all.reduce((s, k) => s + k.r * k.r, 0)
    const dots = []
    let seed = 3
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (const k of all) {
      const n = Math.max(2, Math.round((k.r * k.r * 90) / weight))
      for (let i = 0; i < n; i++) {
        const a = rnd() * Math.PI * 2
        const d = Math.sqrt(rnd()) * k.r * 0.75
        dots.push({
          el: el("circle", { r: 2.6, class: "am-dot", fill: "#6b6860", opacity: 0 }, dotsLayer),
          from: [20 + rnd() * 560, 20 + rnd() * 280],
          to: [k.x + Math.cos(a) * d, k.y + Math.sin(a) * d],
        })
      }
    }
    const place = (d, [x, y]) => (d.el.style.transform = `translate(${x}px, ${y}px)`)
    const show = (on) => {
      blobs.forEach((b) => b.el.classList.toggle("on", on))
      rings.forEach((r) => r.classList.toggle("on", on))
      labels.forEach((l) => l.classList.toggle("on", on))
    }

    if (reduce) {
      dots.forEach((d) => d.el.remove())
      return show(true)
    }

    let run = 0
    async function loop(id) {
      const wait = async (ms) => {
        await sleep(ms)
        if (run !== id) throw 0
      }
      try {
        for (;;) {
          show(false)
          dots.forEach((d) => {
            d.el.style.transition = "none"
            place(d, d.from)
            d.el.setAttribute("opacity", 0)
          })
          await wait(60)
          dots.forEach((d, i) => {
            d.el.style.transition = ""
            setTimeout(() => d.el.setAttribute("opacity", 1), i * 8)
          })
          await wait(1300)
          dots.forEach((d, i) => setTimeout(() => place(d, d.to), (i % 20) * 18))
          await wait(1500)
          show(true)
          await wait(300)
          dots.forEach((d) => d.el.setAttribute("opacity", 0))
          await wait(3200)
        }
      } catch {
        /* stopped */
      }
    }
    let playing = false
    onVisible(
      root,
      () => !playing && ((playing = true), loop(++run)),
      () => ((playing = false), run++),
    )
  }

  /* ── Friction: the same map, coloured by where it struggles ────────── */

  function friction(root) {
    const svg = el("svg", { viewBox: "0 0 600 320", role: "img", "aria-hidden": "true" }, root)
    const { blobs, rings, labels } = drawMap(svg)
    blobs.forEach((b) => b.el.classList.add("on"))
    rings.forEach((r) => r.classList.add("on"))
    labels.forEach((l) => l.classList.add("on"))
    const toggle = document.createElement("div")
    toggle.className = "am-toggle"
    toggle.innerHTML = "<span class=on>Topics</span><span>Friction</span>"
    root.appendChild(toggle)
    const [a, b] = toggle.children
    const set = (mode) => {
      a.classList.toggle("on", mode === "topic")
      b.classList.toggle("on", mode === "friction")
      blobs.forEach(({ el: e, cat, k }) => e.setAttribute("fill", mode === "topic" ? topicFill(cat) : frictionFill(k.f)))
    }
    if (reduce) return set("friction")
    let timer = 0
    let mode = "topic"
    onVisible(
      root,
      () => {
        clearInterval(timer)
        timer = setInterval(() => set((mode = mode === "topic" ? "friction" : "topic")), 2600)
      },
      () => clearInterval(timer),
    )
  }

  /* ── Redaction: a conversation becomes one general line ────────────── */

  function redact(root) {
    root.innerHTML = `
      <div class="am-steps"><span data-s="0">Read</span><span data-s="1">Remove</span><span data-s="2">Summarize</span></div>
      <div class="am-chat">
        <div class="am-bubble u">Hi, it's <span class="am-pii">Marco Bianchi</span> from <span class="am-pii">Lumen Logistics</span>. My VPN stopped working after I changed phone, and <span class="am-pii">marco.b@lumen.it</span> doesn't get the code.</div>
        <div class="am-bubble a">Open the access portal and choose Reset two-factor. If it still fails, IT can enrol your new phone.</div>
      </div>
      <div class="am-summary"><i></i>Asked how to regain VPN access after changing phone</div>`
    const steps = [...root.querySelectorAll(".am-steps span")]
    const pii = [...root.querySelectorAll(".am-pii")]
    const chat = root.querySelector(".am-chat")
    const summary = root.querySelector(".am-summary")
    const step = (n) => steps.forEach((s, i) => s.classList.toggle("on", i === n))
    const reset = () => {
      pii.forEach((p) => p.classList.remove("mark", "gone"))
      chat.classList.remove("fade")
      summary.classList.remove("on")
    }
    if (reduce) {
      step(2)
      pii.forEach((p) => p.classList.add("gone"))
      chat.classList.add("fade")
      return summary.classList.add("on")
    }
    let run = 0
    async function loop(id) {
      const wait = async (ms) => {
        await sleep(ms)
        if (run !== id) throw 0
      }
      try {
        for (;;) {
          reset()
          step(0)
          await wait(1600)
          step(1)
          for (const p of pii) {
            p.classList.add("mark")
            await wait(260)
          }
          await wait(600)
          pii.forEach((p) => p.classList.add("gone"))
          await wait(900)
          step(2)
          chat.classList.add("fade")
          summary.classList.add("on")
          await wait(3400)
        }
      } catch {
        /* stopped */
      }
    }
    let playing = false
    onVisible(
      root,
      () => !playing && ((playing = true), loop(++run)),
      () => ((playing = false), run++),
    )
  }

  const demos = { pipeline, friction, redact }
  document.querySelectorAll(".am-demo[data-demo]").forEach((node) => demos[node.dataset.demo]?.(node))
})()
