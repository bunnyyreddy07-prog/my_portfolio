# Ushike Pavan Reddy — Developer Portfolio

A responsive, premium dark/light portfolio built with plain **HTML5, CSS3 and JavaScript** (no build step, no framework).

## Project structure

```
portfolio/
├── index.html
├── css/style.css
├── js/main.js
├── assets/
│   ├── resume/Ushike_Pavan_Reddy_Resume.pdf
│   └── certificates/
│       ├── genai-data-analytics-forage.(pdf|jpg)
│       ├── data-visualisation-forage.(pdf|jpg)
│       ├── web-development-codsoft.(pdf|jpg)
│       └── web-development-internship-apsche.(pdf|jpg)
└── README.md
```

## Run locally

Option 1: double-click `index.html` (works in any modern browser).

Option 2: a local server (recommended):

```bash
cd portfolio
python3 -m http.server 8000      # then open http://localhost:8000
# or
npx serve .
```

Fonts (Google Fonts), UI icons (Font Awesome) and technology icons (Devicon) load from CDNs, so you need an internet connection for those.

## Make the contact form deliver to your inbox

1. Create a free form at https://formspree.io and copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`).
2. Open `js/main.js` and set it at the top:
   ```js
   formspreeEndpoint: "https://formspree.io/f/abcdwxyz",
   ```
3. Done. The success message only appears when Formspree confirms the message was accepted; any error is shown to the visitor.

If `formspreeEndpoint` is left empty, the form falls back to opening the visitor's email app with the message pre-filled (a `mailto:` link). In that mode the site does not claim the message was sent.

## Add the Cisco certificate

The Cisco Networking Basics card is shown as "Certificate file not added yet" because the file was not provided. To enable it:

1. Add `assets/certificates/cisco-networking-basics.pdf` and a preview image `cisco-networking-basics.jpg`
   (create it with: `pdftoppm -jpeg -r 130 -singlefile cisco-networking-basics.pdf cisco-networking-basics`).
2. In `index.html`, replace the `cert-pending` card with the same markup as the other certificate cards, using those two file paths.

## Deploy (free)

- **GitHub Pages:** push the folder to a repo → Settings → Pages → deploy from `main` / root.
- **Netlify / Vercel:** drag and drop the folder, or connect the repo (no build command, publish directory `.`).

## Customising

- Colours and spacing: CSS variables at the top of `css/style.css`.
- Typing roles and contact settings: `CONFIG` at the top of `js/main.js`.
- Update the resume: replace `assets/resume/Ushike_Pavan_Reddy_Resume.pdf` (keep the filename).
