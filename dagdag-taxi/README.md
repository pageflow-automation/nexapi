# DagDag Taxi — website

Website voor DagDag Taxi, Culemborg. Statische site, geen runtime-dependencies, gebouwd voor Vercel.

```bash
npm run dev      # bouwt en start preview op http://localhost:8765
npm run build    # bouwt naar dist/ en draait de SEO-controle (faalt bij fouten)
npm run assets   # (alleen nodig na logo/kleur-wijzigingen) favicons, share-afbeeldingen, QR, print-PDF's
```

## Waar staat wat

| Wat | Bestand |
| --- | --- |
| Telefoonnummer, WhatsApp, KvK, standaard WhatsApp-bericht | `src/data.mjs` → `SITE` |
| Plaatsen (eigen pagina per plaats, teksten, FAQ) | `src/data.mjs` → `TOWNS` |
| Pagina's en teksten | `src/pages.mjs` |
| Header, footer, secties | `src/layout.mjs` |
| Kaart, vertrekbord, structured data | `src/lib.mjs` |
| Stijl / beweging | `src/site.css`, `src/site.js` |
| Huisstijlgids (niet geïndexeerd) | `/merk` |

Een plaats toevoegen = één object in `TOWNS`. Pagina, sitemap, kaart, footer-link, share-afbeelding (na `npm run assets`) en structured data volgen vanzelf.

## Deploy op Vercel

1. Importeer de repository in Vercel.
2. **Root Directory:** `dagdag-taxi`. Framework preset: *Other*. De rest staat in `vercel.json`.
3. Koppel `dagdagtaxi.nl` (hoofddomein) en `www.dagdagtaxi.nl` (redirect naar het hoofddomein) in Vercel → Domains.
   Canonical-URL's, sitemap en share-links wijzen standaard naar `https://dagdagtaxi.nl` (aan te passen met `SITE_URL`).

## QR-code (quishing-veilig)

`public/img/qr-contact.svg` bevat **alleen een contactkaart** (naam + nummer), geen link. Er zit dus geen
redirect-dienst tussen die later omgezet kan worden, en scannen opent nooit een website of betaalverzoek.
Het nummer staat altijd leesbaar naast de code, zodat klanten kunnen controleren wat ze opslaan.
`tools/make_qr.py` controleert na het maken dat de code terug-decodeert naar precies deze gegevens.

Drukwerk (3 mm afloop, voor de drukker): `public/print/visitekaartje.pdf`, `sticker.pdf`, `flyer-a6.pdf`.
Tip: plak stickers alleen op plekken die jij beheert (auto, balie) en controleer ze af en toe op overplakte codes.

## SEO

Op de site geregeld:
- Eigen landingspagina per plaats met eigen teksten, reistijden, FAQ en interne links (geen kopie-pagina's).
- `LocalBusiness` + `TaxiService` + `BreadcrumbList` + `FAQPage` structured data, sitemap, robots.txt, canonical-URL's.
- Share-afbeelding per pagina, volledige favicon-set, manifest, `llms.txt` voor AI-zoekmachines.
- Snel: geen frameworks, fonts lokaal en gesubset, CSS inline. Lighthouse (mobiel): Accessibility, Best Practices en SEO 100.
- `scripts/seo-check.mjs` draait bij elke build en blokkeert de deploy bij kapotte links, dubbele titels,
  te lange meta-descriptions, ontbrekende canonical/og-image/structured data, of een verkeerd telefoonnummer.

Buiten de site (dit bepaalt het meest hoe hoog je in Google Maps staat):
1. **Google Bedrijfsprofiel** aanmaken en verifiëren. Categorie *Taxibedrijf*, servicegebied = de plaatsen uit `TOWNS`,
   openingstijden 24/7, website-link, telefoonnummer exact `06 28 69 55 50`.
2. **Reviews** vragen na ritten (link vanuit Bedrijfsprofiel). Reageer op elke review.
3. **Zelfde naam, plaats en nummer overal**: Bing Places, Apple Bedrijfsgegevens, Telefoonboek.nl, De Telefoongids, Facebook.
4. **Google Search Console**: domein verifiëren, `sitemap.xml` indienen.
5. **KvK-nummer** invullen in `src/data.mjs` (wettelijk verplicht op de website).
6. **Echte foto's** van de auto en chauffeur toevoegen aan het Bedrijfsprofiel (en later de site, zie `/merk`).
