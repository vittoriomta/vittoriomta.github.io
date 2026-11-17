// Table of contents built from the article's h2s. In the left margin on wide screens, highlighting the
// section in view; hidden on narrow ones, where the article is short enough to scroll.
;(() => {
  const nav = document.querySelector(".toc")
  const heads = [...document.querySelectorAll(".prose h2")]
  if (!nav || heads.length < 3) return
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const links = heads.map((h) => {
    if (!h.id) h.id = slug(h.textContent)
    const a = document.createElement("a")
    a.href = `#${h.id}`
    a.textContent = h.textContent
    nav.appendChild(a)
    return a
  })
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const i = heads.indexOf(e.target)
        links.forEach((l, j) => l.toggleAttribute("aria-current", i === j))
      }
    },
    { rootMargin: "0px 0px -70% 0px" },
  )
  heads.forEach((h) => io.observe(h))

  // Wide figures (like the playground) run under the margin: step aside while one overlaps.
  const wide = [...document.querySelectorAll(".sk-wide, [data-toc-hide]")]
  if (!wide.length) return
  let raf = 0
  const check = () => {
    raf = 0
    const n = nav.getBoundingClientRect()
    const hit = wide.some((el) => {
      const r = el.getBoundingClientRect()
      return r.top < n.bottom + 24 && r.bottom > n.top - 24
    })
    nav.classList.toggle("is-hidden", hit)
  }
  const queue = () => raf || (raf = requestAnimationFrame(check))
  addEventListener("scroll", queue, { passive: true })
  addEventListener("resize", queue)
  check()
})()
