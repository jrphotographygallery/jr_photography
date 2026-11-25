# jr_photography website

A fast static site: plain HTML, CSS and JavaScript, no build step. All content lives in `data.js`.

## Run it
Open `index.html` in a browser. For a closer-to-live test: `python3 -m http.server 8000` in this folder, then visit http://localhost:8000.

## Edit
- `data.js`: photo titles, descriptions, categories, collections, print sizes/prices, paper finishes, social links, email.
- Fine-art paper extra is set to £10 as a placeholder. Change `extra` in `finishes`.
- `style.css`: colours and fonts (top of file). Portrait: set `portrait: "images/me.jpg"`.
- 

## Add photos
1. Resize to about 1800px on the long edge (JPEG, ~300 KB) and put it in `images/`.
2. Add an entry to `photos` in `data.js` (copy an existing one). Set `categories` and `collections` (a photo can be in several). `hero: true` adds it to the home slideshow.
The Night Photography category/collection fills in once you tag a photo with it.

## Contact form
Easiest: create a free form at formspree.io, paste its URL into `formEndpoint`. Or set `email` and the form opens the visitor's email app.

## Stripe checkout (needs setting up)
The basket works, but payment can't be taken from a static page safely. Until `checkoutEndpoint` is set, the checkout button says so.
1. Create a Stripe account and copy your secret key.
2. Deploy a small serverless function (Netlify/Vercel). It receives `{items:[{id,size,finish,qty}]}`, **looks up prices itself using the same table as data.js**, creates a Stripe Checkout Session (`mode:"payment"`, add shipping rates/countries) and returns `{url}`.
3. Put the function URL in `checkoutEndpoint`. Keep the Stripe secret key in the host's environment variables, never in these files.
Stripe's "Checkout Sessions" quickstart covers the function code.

## Publish
Drag this folder onto Netlify Drop, or use Cloudflare Pages, Vercel or GitHub Pages. Add your custom domain in the host's Domains settings and follow its DNS steps. Then update the `<title>`, description and `og:image` in `index.html` (use a full https URL for the image).
