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
})()
