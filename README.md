# Ashutosh Trade website

A responsive business website for Ashutosh Trade in Kathmandu, Nepal. It includes five main pages, ten product-category routes, a searchable catalogue, product details, quotation enquiries and digital marketing consultation requests.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL shown by the development server. To create the production bundle:

```bash
npm run build
```

The project uses Cloudflare D1 for durable form submissions. The local preview needs the generated migration applied before a successful form submission:

```bash
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_happy_boomer.sql
```

## Update the site

- Business and contact settings: `lib/business-config.ts`
- Category and product records: `lib/site-data.ts`
- Shared visitor experience and forms: `components/site-client.tsx`
- Visual system and responsive rules: `app/globals.css`
- Form storage schema: `db/schema.ts`

Every catalogue product has a unique ID, category, description, image path and alt text, branded/generic classification, optional verified brand/specification/packaging fields and a sample-data flag. Set `sample` to `false` only after the record is verified, and update the visible sample labels if verified inventory is introduced.

## Images and content

The current hero image is an original, brand-neutral asset at `public/assets/ashutosh-trade-supplies.png`. Add optimized replacement files under `public/assets`, then update image paths and alt text in `lib/site-data.ts` or `components/site-client.tsx`. Do not add brand imagery, specifications, performance claims or certifications until verified.

## Enquiries and consultation requests

`POST /api/enquiries` validates each submission, rejects a hidden spam field, checks submission timing, prevents duplicate client tokens and stores accepted records in D1. It returns success only after storage accepts the record. Production deployments apply the Drizzle migration in `drizzle/`.

To forward stored enquiries by email or CRM, add that integration in `app/api/enquiries/route.ts` after the D1 insert. Keep credentials server-side using the hosting platform’s encrypted runtime settings; do not add them to source files.

The consultation flow is deliberately a request, not an automatically confirmed booking. It uses the `Asia/Kathmandu` timezone. If a verified scheduling service is added later, put its URL in `liveSchedulingUrl` in `lib/business-config.ts`, then replace or augment the request form only after real availability and persistence are connected.

## Catalogue PDF

No PDF was supplied. The site therefore shows a working **Request Catalogue** enquiry action. To enable a real download:

1. Add the verified PDF under `public/`.
2. Set `cataloguePdfUrl` in `lib/business-config.ts` to its public path, such as `/ashutosh-trade-catalogue.pdf`.
3. Rebuild and verify the download.

## Deployment

The project is configured for OpenAI Sites in `.openai/hosting.json`. The Sites workflow builds the Cloudflare-compatible worker, applies new D1 migrations and publishes the verified source version. Keep contact details and catalogue claims accurate before changing site access for external visitors.
