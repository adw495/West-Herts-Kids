# Weekly "What's on for kids" automation

A scheduled task runs **every Wednesday at 06:57 (UK time)** and drafts the next post plus a newsletter email for you to review.

## What the task does
1. Researches kids' events from Thursday to the following Wednesday across Watford, Rickmansworth, Croxley Green, Chorleywood, Abbots Langley, Kings Langley and Bushey. Sources: Watford Palace Theatre, Watford Colosseum, Museum of Watford, Three Rivers and Watford council events pages, local libraries (Herts Libraries), Cassiobury Park, the Aquadrome, and provider websites for listed businesses.
2. Keeps only events with a date, venue and source URL. No guesses.
3. Writes a post in this repo's format: `src/content/posts/YYYY-MM-DD-whats-on.md` with frontmatter (`type: whats-on`, `related:` listing ids where they match).
4. Writes a short newsletter version (5–8 items, one line each, with links).
5. Sends both files to you for approval.

## Once the repo is on GitHub
Update the scheduled task so that, instead of sending files, it clones the repo, adds the post on a new branch and **opens a pull request**. You approve it by merging, and Cloudflare deploys it.

## Post template
```markdown
---
title: "What's on for kids in West Herts: 1–7 October 2026"
description: "Family events, workshops and things to do this week in Watford, Rickmansworth, Croxley and Chorleywood."
date: 2026-09-30
type: whats-on
towns: [watford, rickmansworth]
categories: []
related: []
---

## This weekend
- **Event name**, venue, town, date and time. Price. One line on what it is. [Details](source-url)

## During the week
- ...

## Coming up (book now)
- Half-term camps and similar, linking to listings on the site

*Running something for kids locally? [Add it for free](/list-your-activity/).*
```
