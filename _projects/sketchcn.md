---
title: "sketchcn"
date: 2026-11-17
description: "A sketch tool for shadcn/ui and coding agents."
assets: sketchcn
toc: true
---

sketchcn is a sketch tool for shadcn/ui. You drag your own components onto a screen, link screens into a flow, and copy a brief your coding agent can build without guessing.

<figure class="sk-figure">
  <div class="sk-demo" data-demo="hero" aria-label="A part is dragged onto a screen, then the prompt is copied"></div>
  <figcaption>Drag a part in, copy the prompt. The agent gets your components, not a picture.</figcaption>
</figure>

I built this because describing a screen to an agent in words is slow and lossy. "A sidebar, a table of customers, a button that opens a form." The agent fills every gap with its own guesses, and those guesses look like every other generated app. Figma is too much for this. I don't need pixels, I need structure.<sup class="sk-fn"><a href="#fn-1" id="fnref-1">1</a></sup>

So sketchcn sketches with the components your project already has, and hands the agent a tree instead of a paragraph.

## Getting started

```bash
npx shadcn@latest add https://vittoriotaucer.github.io/r/sketchcn.json
```

It installs like any other shadcn component, into `components/sketchcn/`, along with the ui components it uses. Render it in development:

```tsx
import { Sketch } from "@/components/sketchcn"

{import.meta.env.DEV && <Sketch />}
```

Press <kbd>S</kbd>. That's it.

## What the agent receives

A sketch is a tree of shadcn components. Every part knows how to render itself with your components, and how to describe itself as JSX. When you press <kbd>C</kbd>, the agent gets your import paths, the flow between screens, and the structure of each one, with your notes as comments.

<figure class="sk-figure">
  <div class="sk-demo" data-demo="tree" aria-label="The sketch tree beside the prompt it produces"></div>
  <figcaption>Hover a part to see the lines it becomes.</figcaption>
</figure>

The imports list only the components the sketch actually uses, at your alias. Links between screens become routes. A note like "rows open the customer" sits right above the table it describes, which is where an agent will read it.

## Blocks

shadcn gives you atoms: a button, a card, an input. A full template gives you someone else's product. What's missing is the middle: the sections AI-native products are actually assembled from. A header with its actions, a sidebar with its account menu, a composer, a chat panel on the right or along the bottom, a chart panel with its sort controls, an API console.

That middle is where taste lives, and it's what agents get wrong most often. So sketchcn ships 66 of them, each in a few variants that differ in layout, not just in copy.

<figure class="sk-figure">
  <div class="sk-demo" data-demo="composers" aria-label="Three composer variants morphing into each other"></div>
  <figcaption>Three of the six composers. Pick one, then edit every part of it.</figcaption>
</figure>

Sidebars are treated as layout, not content. Drop one on a page and the screen wraps into sidebar and content. Drop another and it swaps in place. Every block has a full-size preview, and the arrow keys flip through its variants.

## From blank page to brief

Here's one screen from start to finish, the way I'd build it: a support inbox with an assistant on the side.

<figure class="sk-figure">
  <div class="sk-demo" data-demo="steps" aria-label="Six steps from a blank page to a prompt"></div>
</figure>

None of the steps take long, and that's the point. The decisions that usually live in a long prompt, or in my head, end up in the sketch, where the agent can't miss them.

## Presets

Sometimes you want a whole app to start from. sketchcn has sixteen: a dashboard, mail, tasks, settings, auth, a database studio, an issue tracker, a booking page, a CRM, and a set of AI products: chat, an agent builder, a coding agent, an agent panel, and AI teammates on desktop and mobile.

I didn't want these to be my guesses at what those apps look like. Each one was rebuilt from the layout code of an open-source app that does it well: Supabase Studio, Plane, Cal.com, Twenty, OpenHands, Cline, Open WebUI and others. The structure is theirs. The parts, copy and names are not.<sup class="sk-fn"><a href="#fn-2" id="fnref-2">2</a></sup>

## Try it

<figure class="sk-figure sk-wide">
  <div class="sk-play">
    <iframe src="/play/sketchcn/" title="sketchcn playground" loading="lazy"></iframe>
  </div>
  <figcaption>The real thing. Press <kbd>T</kbd> for presets, or switch to Blocks on the left. <a href="/play/sketchcn/" target="_blank" rel="noopener">Open full screen</a></figcaption>
</figure>

Everything stays in your browser. Nothing leaves your machine until you copy it.

## Details

A few things I cared about that don't need their own section:

- **Drag and drop** is pointer-driven, not the browser's. A ghost tells you where the part will land, the insertion line glides, and <kbd>Esc</kbd> cancels.
- **The canvas** pans and zooms like a design tool. Pinch, scroll, or hold <kbd>Space</kbd>. Screens keep their real device width.
- **Keyboard first.** <kbd>⌘K</kbd> finds any part, block, screen or action. Figma's <kbd>⌥A</kbd> <kbd>⌥H</kbd> <kbd>⌥D</kbd> align things. Undo works everywhere.
- **Themes** work like `shadcn create`: base colour, accent, radius and font, live on the sketch. The prompt carries the CSS variables and the font install.
- **The interface** stays out of the way: compact, icon-first, quiet scrollbars, one accent colour for selection and the one main action.

## How it works

Each part is a small object: how it renders with your components, which fields it exposes, and the JSX it hands the agent. Containers know how their children flow, so the drop line can measure where a part will land. The sketch itself is plain JSON, saved in your browser as you work, and you can copy it raw if a tool wants structure instead of prose.

It installs through the shadcn registry, so it lives in your repo as ordinary source. Change a part, add your own, or delete what you don't use.

## Props

<div class="sk-props">
  <div><code>defaultOpen</code><span>boolean</span><span>false</span></div>
  <div><code>hotkey</code><span>string</span><span>"s"</span></div>
  <div><code>uiAlias</code><span>string</span><span>"@/components/ui"</span></div>
  <div><code>onCopy</code><span>(prompt: string) =&gt; void</span><span></span></div>
</div>

## Acknowledgements

Inspired by Benji Taylor's [Agentation](https://agentation.com), which showed how much an agent gains from being shown instead of told, and by [M3E Canvas](https://github.com/lnkiai/m3e-canvas), which proved people want to sketch before they prompt. Built on [shadcn/ui](https://ui.shadcn.com) and its new AI components.

The source is on [GitHub](https://github.com/vittoriotaucer/sketchcn), MIT licensed.

<ol class="sk-footnotes">
  <li id="fn-1">It isn't a Figma replacement, and doesn't try to be. It's for deciding what goes where before anyone writes code. <a href="#fnref-1" aria-label="Back to text">↩</a></li>
  <li id="fn-2">Some of those apps are AGPL. That's why only the layout was studied: no code, assets or branding came along. Every preset credits its sources. <a href="#fnref-2" aria-label="Back to text">↩</a></li>
</ol>
