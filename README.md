# Taniya's Birthday Universe 💜

A one-continuous-story, 7-part interactive birthday site for **Taniya**, made by **Riyaz**.
Mobile-first (tested down to 360px wide), works with zero dependencies — just open `index.html`.

## How to add your real content

### 1. Photos (Page 5 — Our Little Story)
Drop 4 images into `/assets/` named exactly:
```
photo1.jpg
photo2.jpg
photo3.jpg
photo4.jpg
```
Until you add them, each memory card shows a tasteful placeholder instead of a broken image — so the site works fine either way.
While you're there, edit the captions in `index.html` inside each `.memory-card` (the `memory-meta`, `memory-text`, `memory-caption` lines).

### 2. Music
Drop an mp3 at:
```
assets/birthday-music.mp3
```
Music never force-autoplays (mobile browsers block that anyway) — it starts on the first tap anywhere on the site, and there's a small play/pause/mute pill top-right that stays in sync across pages.

### 3. Names
Both names are set at the top of `script.js`:
```js
const HER_NAME = "Taniya";
const MY_NAME  = "Riyaz";
```
Changing these updates the quiz options and the love-trap/gift-shop copy automatically. The terminal intro, riddle, letter, and final message are written by hand in `index.html` (search for "Taniya" / "Riyaz") since they're personal — edit the wording there directly.

### 4. The letter (Page 7)
Find the `<div class="letter glass glow-edge">` block in `index.html` and rewrite the paragraphs — that's the one part of this site that should sound like *you*, not a template.

## Structure
```
index.html   — all 7 pages/sections (markup + copy)
style.css    — design tokens (colors/type/spacing) + all styling
script.js    — navigation, quiz logic, the evasive NO button, confetti, music, easter eggs
assets/      — photos + music go here
```

## Notes
- No build step, no frameworks — open `index.html` directly or host it anywhere static (GitHub Pages, Netlify, Vercel, etc.).
- Everything works without login and without a server.
- Reduced-motion is respected for anyone with that OS setting on.
- Easter eggs: tap the "Hey You" heading 5 times fast, or long-press the small white heart in the footer.
