---
title: "askmap"
date: 2026-11-17
description: "See what people ask your AI. A private map of your assistant's conversations, drawn on your own machine."
assets: askmap
toc: true
ai_prompt: |
  Set up askmap to see what people ask our AI assistant. It runs locally and never uploads the conversations.

  1. Find our assistant's conversation export: ChatGPT Enterprise or Claude Enterprise compliance logs, the Microsoft Copilot interaction export, a Gemini export from Google Vault, OpenTelemetry GenAI traces, or a JSONL file with one conversation per line (messages with role and content).
  2. Pick the model that reads the conversations. Local: install Ollama, run `ollama pull qwen3:4b` and use `--model ollama:qwen3:4b`. Or our API: set the key (for example OPENAI_API_KEY) and use `--model openai:gpt-5-mini`.
  3. Run `npx askmap <path-to-export> --model <model>`. It opens the map on 127.0.0.1.
  4. Tell me the main categories, and the five topics with the most friction.
---

askmap shows what people ask your AI. Point it at your assistant's conversation logs and it draws a map of what people use it for, and where it struggles, without anyone reading a single conversation.

<figure class="am-figure">
  <div class="am-demo" data-demo="pipeline" aria-label="Conversations gather into topics, then into a map"></div>
  <figcaption>Every dot is a conversation. Only the groups are ever shown.</figcaption>
</figure>

I built this because every company I work with has rolled out an assistant, ChatGPT, Claude, Copilot or one of their own, and none of them can answer the obvious question: what do people actually use it for? The usage dashboards count seats and messages, not tasks. Reading the conversations would answer it, and nobody is allowed to.

Anthropic solved this for themselves with [Clio](https://www.anthropic.com/research/clio): a model reads each conversation, keeps only a general summary, and only the groups are ever shown to a person. askmap is that method for everyone else, running on your machine.

## Getting started

```bash
npx askmap
```

It opens in your browser. Drop an export, pick a model, draw the map. Every map is saved, so next month's sits next to this one.

## What stays private

A model reads each conversation and writes one sentence about it: what was asked, never who asked or what their data said. Names, numbers, places and quotes don't make it into the summary.

<figure class="am-figure">
  <div class="am-demo" data-demo="redact" aria-label="A conversation loses its names and becomes a general summary"></div>
  <figcaption>What a person would see is the line at the bottom, and only as part of a group.</figcaption>
</figure>

Groups smaller than five people are held back, so a topic can't point at someone. Before any name reaches the screen, the model checks it again for anything identifying and rewrites it if needed. The map file holds summaries and counts only. The conversations never leave the export.

## Where it struggles

Volume tells you what people do. Friction tells you where to look. For each conversation askmap also notes whether the assistant actually helped, and the map can colour by that instead.

<figure class="am-figure">
  <div class="am-demo" data-demo="friction" aria-label="The same map coloured by topic, then by friction"></div>
  <figcaption>The orange ones are where people leave without an answer.</figcaption>
</figure>

That's usually where the work is: a missing integration, a policy the assistant doesn't know, a tool it should have.

## Your data, your model

askmap never sends anything anywhere on its own. The model that reads the conversations is yours to choose: a local one through Ollama, so nothing leaves the machine, or your company's own API key, under the contract and region you already have.

A small local model is fine for a few hundred conversations on a laptop. For thousands, a server with a GPU or the company API does it in minutes.

## Sources

askmap reads the exports teams already know how to produce. It recognises the format on its own.

<div class="am-rows">
  <div><span>ChatGPT Enterprise</span><span>Compliance API logs, or conversations.json</span></div>
  <div><span>Claude Enterprise</span><span>Compliance API chats, or conversations.json</span></div>
  <div><span>Microsoft Copilot</span><span>Graph interaction export</span></div>
  <div><span>Gemini</span><span>Google Vault export</span></div>
  <div><span>OpenTelemetry</span><span>GenAI traces from LiteLLM, Langfuse, Arize, Datadog</span></div>
  <div><span>JSONL</span><span>One conversation per line</span></div>
</div>

I built and tested it on a sample of [WildChat](https://huggingface.co/datasets/allenai/WildChat-1M), an open dataset of real chatbot conversations, running locally.

## Details

- **Sessions.** Every map is kept. Draw one a month and see what changed.
- **Exports.** An Excel workbook with every topic, and a one-page PDF to send to whoever asked.
- **Keyboard first.** <kbd>N</kbd> for a new map, <kbd>1</kbd>–<kbd>4</kbd> for views, <kbd>/</kbd> to search, <kbd>Esc</kbd> to step back.
- **Quiet.** One screen to start, one accent for what needs attention.

The source is on [GitHub](https://github.com/vittoriomta/askmap), MIT licensed.
