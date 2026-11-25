# Priyanka Singh — Interactive Research Portfolio (V4)

A lightweight, responsive GitHub Pages website made with HTML, CSS, and vanilla JavaScript. It presents public-facing research themes without disclosing unpublished project details.

## Features

- **Letter-by-letter headline**: “Making biology computable!” with a reduced-motion accessibility fallback.
- **Photo-ready hero**: circular portrait frame and soft blended background.
- **Click-to-open robot chat**: the robot begins closed and its greeting appears only after clicking. It provides answers to common questions about the portfolio and links to sections.
- **Collapsible sections**, **light/dark themes**, and **mobile-friendly layout**.

## Add your picture

1. Choose a portrait you own or have permission to publish.
2. Crop it to a square (recommended 900 × 900 pixels or larger) and save it as `profile.jpg`.
3. Upload it to the `assets/` directory, so the path is exactly `assets/profile.jpg` (case-sensitive).
4. The round frame automatically displays the picture with `object-fit: cover`; you can adjust its positioning in `style.css` at `.portrait-frame img { object-position: center 30%; }`.

Until the image is provided, the circle shows a tasteful `PS` placeholder. No profile photo is embedded in this ZIP.

## Chatbot limitations

This is a **guided FAQ**, not a generative AI chatbot. It does not connect to ChatGPT, collect or store questions, send messages to you, or require any API key. The user can ask brief questions or tap suggested topics. For real inquiries, it gives your email address and an email link. You can edit the answers/keywords in `script.js` under `answerRules`.

A genuinely open-ended AI chatbot would require a secure backend or external service; **never put an API key directly into public GitHub Pages JavaScript**.

## Track website visitors (optional)

GitHub Pages does not provide a dashboard identifying individual site visitors. You can add privacy-conscious aggregate traffic analytics:

**Option A: GoatCounter (simple starting point)**
1. Create a site at https://www.goatcounter.com/.
2. In `index.html`, find the commented example in `<head>`.
3. Put the following *actual* `<script>` tag in `<head>` **outside** the HTML comment, replacing `YOURCODE` with your GoatCounter site code:

```html
<script data-goatcounter="https://YOURCODE.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
```
4. Commit and visit your published site; check your GoatCounter dashboard. Some browsers/ad blockers may suppress tracking.

**Option B: Cloudflare Web Analytics**
- Cloudflare can provide an analytics JavaScript snippet compatible with GitHub Pages; use the exact site-specific snippet from your Cloudflare dashboard. See https://developers.cloudflare.com/web-analytics/get-started/.

Typical analytics: pageviews, approximate unique visits, referrer sources, countries/devices (provider dependent). They **cannot reliably tell you the names or identities of people who visited**. Avoid intrusive tracking; disclose analytics in a short privacy notice if you enable it, following applicable requirements.

## Publish to GitHub Pages

1. Extract this ZIP.
2. Upload `index.html`, `style.css`, `script.js`, and the `assets/` folder to the **root** of your existing `decoder108.github.io` repository.
3. In GitHub, open **Settings → Pages** and choose **Deploy from a branch → main → /(root)** if not already enabled.
4. Open https://decoder108.github.io/ after deployment and refresh. Check dark/light mode and the chat on a phone, too.

There are no `npm` packages, API keys, or build steps.

## Source code organization and maintenance

**Portfolio owner / author credit: Priyanka Singh.** Source files include a file header identifying the project and describing its purpose. The code is organized into named, commented sections so a future contributor can quickly understand what to edit.

| File | What it controls | Where to edit |
| --- | --- | --- |
| `index.html` | Text, navigation tiles, publications, About, hobbies, portrait placeholder, robot markup | Find the HTML comment above the relevant page section |
| `style.css` | Colors, typography, cards, portrait, chatbot, mobile layout, reduced motion | Find the matching commented style group |
| `script.js` | Open/close panels, research filters, light/dark preference, robot FAQ and typing effect | Find the numbered JavaScript section (`01`–`07`) |
| `assets/profile.jpg` | Optional personal headshot | Add a photo you have permission to publish |

### Small edits you may want to make

- **Change homepage text:** Edit `.lead` content in `index.html` under the Hero section comment.
- **Change the typed headline:** Edit `phraseIntro` and `phraseEmphasis` in Section 06 of `script.js`, and update the static heading's `aria-label` in `index.html` to match.
- **Change colors:** Edit `:root` (dark theme) and `html[data-theme="light"]` (light theme) near the start of `style.css`.
- **Add an FAQ answer:** Add a new `{ match, answer, panel? }` entry to `answerRules` in Section 05 of `script.js`. Use a precise regular expression to prevent unrelated questions from matching.
- **Change an existing publication:** Edit only the relevant entry in the Scientific Works panel in `index.html`.
- **Add photo:** Place `profile.jpg` inside `assets/`; this is intentionally left for you to upload.

### Development conventions

- No secrets, API keys, unpublished research details, or private data in a public GitHub repository.
- Keep interactive elements usable by keyboard, with accessible labels and focus states.
- Respect `prefers-reduced-motion` and test both dark and light themes.
- Use meaningful function and variable names, small focused functions, and explanatory comments for intent rather than every statement.
- Keep HTML for content, CSS for appearance, and JavaScript for behavior.
- Test changes on desktop and mobile before publishing. GitHub Pages serves static files directly.

### Quick checks

With Node.js installed, you can check the JavaScript for syntax errors:

```bash
node --check script.js
```

You can also open `index.html` in a browser without installing Node.js. Test each expandable card, robot FAQ, typing animation, the portrait placeholder, and the light/dark switch.
