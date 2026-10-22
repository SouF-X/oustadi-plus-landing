# Oustadi Plus — landing page

French and Moroccan Darija landing page for the Oustadi Plus tutoring platform.

**[Live website](https://oustadi-plus-le-lien.berryibis10.chatgpt.site/)**

## Run locally

Use Node.js 22 or later:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:3000**. No application dependencies, API keys or backend are required. Set `PORT` to choose another local port.

## Deploy

The complete website is in **`dist/`**. `npm run build` validates the scripts and asset references; no bundler is needed.

| Host | Setup |
| --- | --- |
| Vercel | Import this repository. `vercel.json` sets the build command and `dist` output directory. |
| Netlify | Import this repository. `netlify.toml` sets the build command and publish directory. |
| Other static hosting | Upload the contents of `dist/`, keeping the `assets/` folder. |
| Docker / Linux VM | Run `docker compose up --build -d`, then open port **8080**. Configure HTTPS through your host or reverse proxy. |

Optional **`SITE_URL`** sets the production URL used in social-sharing metadata. The build also detects Netlify, Vercel and Cloudflare Pages URLs. Set it explicitly when deploying on your own domain or subpath. The pilot-brief download automatically links to the host currently serving the page.

Deployment configuration references: [Vercel](https://vercel.com/docs/project-configuration/vercel-json), [Netlify](https://docs.netlify.com/build/configure-builds/file-based-configuration/), [unprivileged NGINX](https://github.com/nginx/docker-nginx-unprivileged).

## Included

- Complete French/Darija copy, RTL layout and saved language preference.
- Classroom-to-phone animation, replay and reduced-motion support.
- Interactive teacher → center → student journey, quiz and provider preview.
- Responsive demo form, local brief download and branded focus/scrollbar styles.
- Self-hosted fonts, approved logo, social image and a QR code for the current live website.
- Design tokens, product/design notes, research references and browser-check records.

## Edit

| Path | Purpose |
| --- | --- |
| `dist/index.html` | Structure and default French content |
| `dist/app.js` | Translations, interaction state and form download |
| `dist/styles.css`, `scene.css`, `motion.css`, `chrome.css` | Page styling, hero scene, motion and form styling |
| `dist/motion.js` | Animation sequence and interaction transitions |
| `dist/assets/` | Brand assets, fonts and font licenses |
| `PRODUCT.md`, `DESIGN.md`, `RESEARCH.md`, `tokens.json` | Product and design handoff |
| `qa/` | Recorded browser and contrast checks |
| `docs/oustadi-plus-qr.*` | QR code for the current live website |

Run `npm run check` after changes. When editing translations, keep the default French HTML synchronized with `copy.fr`.

GitHub Actions validates the build on pushes and pull requests. Local deployment checks are recorded in `qa/deployment-verification.json`: build, custom-domain metadata and HTTP serving passed; Docker Compose configuration was validated. The Docker image was not run locally because the Docker engine was stopped.

## Product scope

This repository is the marketing website. The tutoring screens are interactive examples, not a connected teaching backend. The form downloads a text brief to the visitor’s device; it does not send leads. No analytics or external font service is included.

The existing Sites hosting identity is intentionally excluded so this repository can deploy independently. Font licenses are included alongside the font files in `dist/assets/`.
