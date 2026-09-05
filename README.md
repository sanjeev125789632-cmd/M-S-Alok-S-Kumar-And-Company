# M/S Alok S Kumar And Company Website

Production website for **M/S Alok S Kumar And Company**, a Chartered Accountancy practice in Rohini, Delhi.

- Live site: [https://www.alokskumar.com/](https://www.alokskumar.com/)
- Professional: **Alok S Kumar**
- Qualification: **B.Com (Hons), FCA**
- ICAI Membership No.: **094095**
- Office: **311 Sathi Apartment, Sector 9, Rohini, Delhi – 110085**

## About the project

This repository contains a dependency-free static website built with semantic HTML, a shared CSS design system and vanilla JavaScript. It presents the firm's verified services, professional profile, contact information and tax/compliance resources.

The website is designed to support:

- Accessible and responsive browsing
- Traditional search engine optimisation (SEO)
- Answer engine optimisation (AEO)
- Clear entity relationships for generative search systems (GEO)
- Local business discovery for Rohini and Delhi
- Factual, professionally reviewed tax and compliance content

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- JSON-LD structured data
- Netlify configuration and redirects
- Web3Forms enquiry handling

There is no framework, package manager or build step.

## Repository structure

```text
.
├── index.html                         # Homepage
├── about/index.html                   # Firm and professional profile
├── contact/index.html                 # Office details and enquiry form
├── services/
│   ├── index.html                     # Services overview
│   ├── gst/index.html
│   ├── income-tax/index.html
│   ├── company-registration/index.html
│   ├── trust-registration/index.html
│   ├── investment-advisory/index.html
│   ├── deed-drafting/index.html
│   └── accounting-assurance/index.html
├── blog/
│   ├── index.html                     # Resource library
│   ├── gst-return-filing-guide-delhi/index.html
│   ├── itr-filing-checklist/index.html
│   └── 12a-80g-registration-explained/index.html
├── assets/
│   ├── css/styles.css                 # Shared design system and responsive styles
│   ├── js/main.js                     # Navigation, accessibility and form behaviour
│   └── img/                           # Logo and social-sharing images
├── 404.html
├── robots.txt
├── sitemap.xml
├── _redirects
└── netlify.toml
```

## Run locally

From the repository root, start any static HTTP server. For example:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173/](http://localhost:4173/).

Do not open the HTML files directly with a `file://` URL. The site uses root-relative links such as `/assets/css/styles.css`, which require an HTTP server.

## Content and factual-safety rules

This is a professional-services website covering taxation, accounting and regulatory compliance. Accuracy takes priority over keyword density.

When editing content:

1. Preserve the verified business name, professional qualification, ICAI membership number and office address exactly.
2. Do not invent awards, ratings, reviews, clients, statistics, fees, founding dates, success rates or additional locations.
3. Do not use unsupported claims such as “best,” “leading,” “top,” “No. 1” or “guaranteed approval.”
4. Check time-sensitive tax and compliance statements against official sources before publishing changes.
5. Add `<!-- TODO: CONFIRM -->` when a required fact cannot be verified.
6. Keep article publication and review dates factual. Do not infer dates from commit history.
7. Treat articles as general information, not advice for a specific case.

Preferred primary references include:

- [Income Tax Department](https://www.incometax.gov.in/iec/foportal/)
- [GST Portal](https://www.gst.gov.in/)
- [CBIC GST](https://cbic-gst.gov.in/)
- [Ministry of Corporate Affairs](https://www.mca.gov.in/)
- [Institute of Chartered Accountants of India](https://www.icai.org/)

## SEO and structured-data conventions

Every indexable page should retain:

- One descriptive `<title>`
- One unique meta description
- A self-referencing HTTPS canonical URL using `www.alokskumar.com`
- Matching Open Graph URL, title and description
- One clear `<h1>` followed by a logical heading hierarchy
- Descriptive internal links and breadcrumbs
- Indexable content rendered directly in HTML

The JSON-LD entity graph uses stable identifiers:

- Firm: `https://www.alokskumar.com/#business`
- Professional: `https://www.alokskumar.com/#alok-s-kumar`
- Website: `https://www.alokskumar.com/#website`
- Individual services and pages: canonical URL plus a stable fragment such as `#service`, `#webpage` or `#breadcrumb`

Structured data must match visible content. Do not add ratings, reviews, prices, coordinates, social profiles or other properties unless they are verified and published visibly where appropriate.

## Accessibility and responsive behaviour

The site includes:

- A keyboard-accessible mobile menu and services dropdown
- Escape-key handling and focus restoration
- Visible focus states
- Semantic labels and error messages for the enquiry form
- A skip link
- Reduced-motion support
- Responsive layouts and mobile contact actions
- Explicit image dimensions to reduce layout shift

Test changes at a minimum of 360px, 768px, 1024px and 1440px. Confirm that navigation, dropdowns, form validation, focus states and contact links still work and that no horizontal overflow is introduced.

## Validation checklist

Before publishing:

```bash
node --check assets/js/main.js
python3 -m xml.etree.ElementTree sitemap.xml
git diff --check
```

Also verify:

- All public routes return HTTP 200
- Unknown routes return the custom 404 page with HTTP 404
- `robots.txt` allows important pages and references the sitemap
- `sitemap.xml` contains only canonical, indexable URLs
- JSON-LD parses without duplicate `@id` values
- Titles and meta descriptions remain unique
- Internal links and image paths are valid
- The 404 page remains `noindex, follow`
- No unverified claims or visible placeholders are published

## Deployment

The repository is configured for Netlify as a static site:

- Publish directory: repository root (`.`)
- Build command: none
- Redirects and security/cache headers: `netlify.toml` and `_redirects`
- Canonical production host: `https://www.alokskumar.com/`

After deployment, verify the production URLs, redirects, response status codes, enquiry form and structured data. Search indexing and Core Web Vitals should be reviewed separately in Google Search Console.

## Maintenance notes

- Keep existing public URLs stable. Add permanent redirects before changing a route.
- Update `sitemap.xml` when an indexable page is added or removed.
- Keep visible FAQ answers aligned with any FAQ structured data.
- Link new articles to the relevant service page and enquiry path.
- Use official sources for statutory claims and re-review time-sensitive content periodically.
- Do not commit private client documents, financial records, credentials or unpublished personal information.

## Licence

No open-source licence is currently included in this repository. All rights remain with the project owner unless a licence is added explicitly.
