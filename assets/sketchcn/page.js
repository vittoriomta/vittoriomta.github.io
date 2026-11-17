// sketchcn project page: four small live demos. Vanilla, no dependencies.
// Each demo plays only while on screen and settles to a still frame under reduced motion.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function onVisible(el, start, stop) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.35 }).observe(el);
  }

  const icon = {
    cursor:
      '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M1.5 1.5 12 6l-4.4 1.6L6 12z" fill="#fff" stroke="#14120b" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    copy: '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="5" width="9" height="9" rx="2"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/></svg>',
    check:
      '<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8.5 3.2 3L13 4.5"/></svg>',
  };

  /* ── Hero: drag a part in, copy the prompt ──────────────────────── */

  function hero(root) {
    root.innerHTML = `
      <div class="sk-win">
        <div class="sk-bar">
          <span class="sk-tab on">Overview</span><span class="sk-tab">Customers</span><span class="sk-tab">Customer</span>
          <span class="sk-copy"><span class="sk-swap"><i>${icon.copy}</i><i>${icon.check}</i></span><span class="lbl">Copy prompt</span></span>
        </div>
        <div class="sk-body">
          <div class="sk-palette"><span>Heading</span><span>Button</span><span data-pick>Stat</span><span>Table</span><span>Tabs</span><span>Chart</span><span>Composer</span></div>
          <div class="sk-canvas"><div class="sk-frame">
            <div class="sk-h-head">Overview<span class="sk-h-btn">Export</span></div>
            <div class="sk-h-grid">
              <div class="sk-stat"><small>Revenue</small><strong>$48.2k</strong></div>
              <div class="sk-stat"><small>Customers</small><strong>1,204</strong></div>
              <div class="sk-stat"><small>Active now</small><strong>87</strong></div>
              <div class="sk-stat new"><small>Churn</small><strong>1.8%</strong></div>
              <span class="sk-line"></span>
            </div>
            <div class="sk-rows">
              <div><span>Customer</span><span>Email</span><span>Plan</span><span>MRR</span></div>
              <div><span>Maya Chen</span><span>maya@north.co</span><em>Pro</em><span>$240</span></div>
              <div><span>Sam Okafor</span><span>sam@lumen.io</span><em>Team</em><span>$90</span></div>
            </div>
          </div></div>
        </div>
      </div>
      <div class="sk-ghost">Stat<b>in Grid</b></div>
      <div class="sk-cursor">${icon.cursor}</div>
      <div class="sk-toast">Prompt copied · 3 screens, 6 components</div>`;

    const $ = (s) => root.querySelector(s);
    const cur = $(".sk-cursor"), ghost = $(".sk-ghost"), toast = $(".sk-toast");
    const pick = $("[data-pick]"), line = $(".sk-line"), fresh = $(".sk-stat.new");
    const copy = $(".sk-copy"), label = copy.querySelector(".lbl");
    const stats = [...root.querySelectorAll(".sk-stat:not(.new)")];
    fresh.style.whiteSpace = "nowrap";

    if (reduce) {
      fresh.classList.add("in");
      cur.style.display = "none";
      return;
    }

    const box = () => root.getBoundingClientRect();
    const at = (el, fx = 0.5, fy = 0.5) => {
      const r = el.getBoundingClientRect(), o = box();
      return [r.left - o.left + r.width * fx, r.top - o.top + r.height * fy];
    };
    const after = (el) => el.offsetLeft + el.offsetWidth + 4 - 1.5;
    const place = ([x, y], ms) => {
      const t = ms ? `transform ${ms}ms cubic-bezier(.45,0,.2,1)` : "none";
      cur.style.transition = t;
      ghost.style.transition = `${t}, opacity .15s ease`;
      cur.style.transform = `translate(${x}px,${y}px)`;
      ghost.style.transform = `translate(${x + 12}px,${y + 10}px)`;
    };

    let run = 0, playing = false;

    async function loop(id) {
      const wait = async (ms) => {
        await sleep(ms);
        if (run !== id) throw 0;
      };
      const move = async (p, ms) => {
        place(p, ms);
        await wait(ms);
      };
      try {
        const [w, hgt] = [box().width, box().height];
        place([w * 0.62, hgt * 0.86], 0);
        for (;;) {
          await wait(500);
          await move(at(pick, 0.35), 750);
          pick.classList.add("hot");
          cur.classList.add("down");
          await wait(160);
          ghost.style.opacity = 1;
          await move(at(stats[1], 0.6, 0.55), 650);
          line.style.left = `${after(stats[0])}px`;
          line.style.opacity = 1;
          await wait(280);
          line.style.left = `${after(stats[1])}px`;
          await move(at(stats[2], 0.7, 0.55), 380);
          line.style.left = `${after(stats[2])}px`;
          await move(at(stats[2], 1.04, 0.5), 260);
          await wait(320);
          cur.classList.remove("down");
          pick.classList.remove("hot");
          ghost.style.opacity = 0;
          line.style.opacity = 0;
          fresh.classList.add("in");
          await wait(1000);
          await move(at(copy, 0.4), 800);
          cur.classList.add("down");
          copy.classList.add("press");
          await wait(140);
          cur.classList.remove("down");
          copy.classList.remove("press");
          copy.classList.add("done");
          label.textContent = "Copied";
          toast.classList.add("on");
          await wait(1900);
          toast.classList.remove("on");
          await move([w * 0.62, hgt * 0.86], 900);
          fresh.classList.remove("in");
          copy.classList.remove("done");
          label.textContent = "Copy prompt";
          await wait(700);
        }
      } catch {
        /* stopped */
      }
    }

    onVisible(
      root,
      () => {
        if (playing) return;
        playing = true;
        loop(++run);
      },
      () => {
        playing = false;
        run++;
      },
    );
  }

  /* ── Tree ↔ prompt ──────────────────────────────────────────────── */

  function tree(root) {
    const rows = [
      ["screen", "Customers", "/customers"],
      ["side", "Sidebar", "layout"],
      ["head", "Header", "row"],
      ["btn", "Button", "→ /customers/new", true],
      ["table", "Table", "note", true],
    ];
    const code = [
      ["btn", 'import { Button } from "@/components/ui/button"'],
      ["table", 'import { Table } from "@/components/ui/table"'],
      ["side", 'import { Sidebar } from "@/components/ui/sidebar"'],
      ["", " "],
      ["screen btn", "// /customers  ·  New customer → /customers/new", "c"],
      ["side", "<SidebarProvider>"],
      ["side", "  <AppSidebar />"],
      ["screen", "  <main>"],
      ["head", '    <header className="flex justify-between">'],
      ["head", "      <h1>Customers</h1>"],
      ["head btn", "      <Button>New customer</Button>"],
      ["head", "    </header>"],
      ["table", "    {/* rows open the customer */}", "c"],
      ["table", "    <Table>…</Table>"],
      ["screen", "  </main>"],
      ["side", "</SidebarProvider>"],
    ];
    root.innerHTML = `
      <div class="sk-tree">${rows
        .map(
          ([k, name, sub, pin], i) =>
            `<div data-k="${k}" style="padding-left:${i === 0 ? 8 : i < 3 ? 20 : 32}px">${name}<i>${sub}</i>${pin ? '<span class="sk-pin"></span>' : ""}</div>`,
        )
        .join("")}</div>
      <pre class="sk-code">${code.map(([k, t, c]) => `<span data-k="${k}"${c ? ' class="c"' : ""}>${esc(t)}</span>`).join("")}</pre>`;

    const items = [...root.querySelectorAll(".sk-tree div")];
    const lines = [...root.querySelectorAll(".sk-code span")];
    const set = (k) => {
      items.forEach((el) => el.classList.toggle("on", el.dataset.k === k));
      lines.forEach((el) => el.classList.toggle("on", !!k && el.dataset.k.split(" ").includes(k)));
    };

    let i = 0, timer = 0, hovering = false, visible = false;
    const tick = () => {
      set(rows[i % rows.length][0]);
      i++;
    };
    const auto = () => {
      clearInterval(timer);
      if (!visible || hovering || reduce) return;
      tick();
      timer = setInterval(tick, 1700);
    };

    items.forEach((el, n) =>
      el.addEventListener("pointerenter", () => {
        hovering = true;
        clearInterval(timer);
        i = n + 1;
        set(el.dataset.k);
      }),
    );
    root.querySelector(".sk-tree").addEventListener("pointerleave", () => {
      hovering = false;
      auto();
    });
    if (reduce) set("table");
    onVisible(
      root,
      () => {
        visible = true;
        auto();
      },
      () => {
        visible = false;
        clearInterval(timer);
      },
    );
  }

  /* ── Composers ──────────────────────────────────────────────────── */

  function composers(root) {
    const plus = '<span style="font-size:15px;line-height:1">+</span>';
    const variants = {
      Box: `<div class="sk-box"><div class="ph">Ask anything, @ to add files</div>
              <div class="row">${plus}<span class="sk-mode">Agent</span><span>Auto</span><span class="sk-send">↑</span></div></div>
            <div class="sk-under"><span><b>Local</b></span><span>main</span><span class="r">Full access</span></div>`,
      Pill: `<div class="sk-pill">${plus}<span>Message the assistant</span><span class="sk-send">↑</span></div>
             <div class="sk-under"><span>Model · <b>Fast</b></span><span class="r">Search the web</span></div>`,
      Agent: `<div class="sk-box"><span class="sk-ctx">@ inbox.tsx</span><span class="sk-ctx" style="margin-left:4px">Terminal</span>
                <div class="ph">Plan, search, build anything</div>
                <div class="row"><span class="sk-mode">∞ Agent</span><span>Thinking</span><span class="sk-send">↑</span></div></div>`,
    };
    const names = Object.keys(variants);
    root.innerHTML = `
      <div class="sk-chips" role="group" aria-label="Composer variant">${names
        .map((n) => `<button type="button" aria-pressed="false">${n}</button>`)
        .join("")}</div>
      <div class="sk-cstage">${names.map((n) => `<div class="sk-comp">${variants[n]}</div>`).join("")}</div>`;

    const chips = [...root.querySelectorAll(".sk-chips button")];
    const comps = [...root.querySelectorAll(".sk-comp")];
    const stage = root.querySelector(".sk-cstage");
    let cur = 0, timer = 0, touched = false;

    const show = (n) => {
      cur = n;
      chips.forEach((c, i) => c.setAttribute("aria-pressed", String(i === n)));
      comps.forEach((c, i) => c.classList.toggle("on", i === n));
      stage.style.height = `${comps[n].offsetHeight}px`;
    };
    chips.forEach((c, i) =>
      c.addEventListener("click", () => {
        touched = true;
        clearInterval(timer);
        show(i);
      }),
    );
    show(0);
    addEventListener("resize", () => show(cur));
    document.fonts?.ready.then(() => show(cur));

    onVisible(
      root,
      () => {
        if (touched || reduce) return;
        clearInterval(timer);
        timer = setInterval(() => show((cur + 1) % names.length), 2400);
      },
      () => clearInterval(timer),
    );
  }

  /* ── Steps: blank page to brief ─────────────────────────────────── */

  function steps(root) {
    const steps = [
      ["Blocks", "Start from blocks: a page header with search, and an inbox list."],
      ["Sidebar", "Drop a sidebar. The screen wraps into sidebar and content, nothing else moves."],
      ["Assistant", "Add a chat panel on the right, from the chat layouts."],
      ["Link", "Link a row to the conversation screen. It becomes a route in the brief."],
      ["Note", "Leave a note where the agent will read it, right on the list."],
      ["Copy", "Press C. The agent gets the tree, the flow and your notes."],
    ];
    const prompt = [
      "# Support inbox  /inbox",
      "<SidebarProvider>",
      "  <AppSidebar />",
      "  <main>",
      '    <PageHeader title="Inbox" search />',
      "    {/* unread first, newest on top */}",
      '    <ItemList href="/inbox/:id" />',
      "  </main>",
      '  <ChatPanel side="right" />',
    ].join("\n");

    root.innerHTML = `
      <div class="sk-steps">${steps
        .map(([n], i) => `<button type="button"><span>${i + 1}</span>${n}</button>`)
        .join("")}<button type="button" class="sk-replay">↻ Replay</button></div>
      <p class="sk-desc"></p>
      <div class="sk-sframe">
        <div class="sk-side"><div><p class="on">Inbox</p><p>Assigned</p><p>Drafts</p><p>Archived</p></div></div>
        <div class="sk-main">
          <div class="head">Inbox<i></i></div>
          <div class="sk-list">
            <div><b>Maya Chen</b><span>Charged twice for March</span><em class="sk-linkchip">→ /inbox/:id</em></div>
            <div><b>Sam Okafor</b><span>Can't invite my team</span></div>
            <div><b>Lea Brandt</b><span>Export to CSV?</span></div>
            <div><b>Tom Ruiz</b><span>SSO setup</span></div>
          </div>
          <div class="sk-note">Unread first, newest on top</div>
        </div>
        <div class="sk-aside"><div>
          <div class="sk-msg u">Summarize Maya's thread</div>
          <div class="sk-msg a">She was charged twice. Draft a refund reply?</div>
          <div class="sk-mini">Ask the assistant</div>
        </div></div>
        <div class="sk-prompt"><div>${esc(prompt)}</div></div>
      </div>`;

    const btns = [...root.querySelectorAll(".sk-steps button:not(.sk-replay)")];
    const desc = root.querySelector(".sk-desc");
    const frame = root.querySelector(".sk-sframe");
    let at = 0, timer = 0, done = false;

    const go = (n) => {
      at = n;
      btns.forEach((b, i) => {
        b.toggleAttribute("aria-current", i === n - 1);
        b.classList.toggle("past", i < n - 1);
      });
      frame.className = "sk-sframe";
      for (let i = 1; i <= n; i++) frame.classList.add(`s${i}`);
      desc.textContent = n ? steps[n - 1][1] : "";
    };
    const play = (from = 0) => {
      clearInterval(timer);
      go(from);
      timer = setInterval(() => {
        if (at >= steps.length) {
          clearInterval(timer);
          done = true;
          return;
        }
        go(at + 1);
      }, 2300);
    };

    btns.forEach((b, i) =>
      b.addEventListener("click", () => {
        clearInterval(timer);
        done = true;
        go(i + 1);
      }),
    );
    root.querySelector(".sk-replay").addEventListener("click", () => {
      done = false;
      play(0);
    });

    if (reduce) {
      go(steps.length);
      return;
    }
    go(1);
    onVisible(
      root,
      () => {
        if (!done && !timer) play(at || 1);
      },
      () => {
        clearInterval(timer);
        timer = 0;
      },
    );
  }

  const demos = { hero, tree, composers, steps };
  document.querySelectorAll(".sk-demo[data-demo]").forEach((el) => demos[el.dataset.demo]?.(el));
})();
