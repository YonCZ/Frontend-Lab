# CA Trio, varianta 9: pokladna

Runnable React + Vite prototype for CA Trio, a Czech travel agency in
Moravské Budějovice. Desktop-first. Czech is the default language; English is a
second locale and the switch keeps the current page.

## Run

```
npx vite build
```

The entry is `dist/index.html`; assets are served from `public/assets`.

## Routes

| Route | Page |
| --- | --- |
| `#/` | landing |
| `#/zajezdy` | trip listing with filters |
| `#/zajezdy/<id>` | trip detail |
| `#/objednavka/<id>` | booking with departure point and seat selection |
| `#/kontakt` | contact, cancellation terms, partner agencies |
| `#/admin` | hidden admin behind a passphrase |

Language is stored in `localStorage` under `ca-trio-9-lang`. The admin session
lives in `sessionStorage`.

## Admin

Passphrase: `trio2026`

The admin can create a trip and edit its name in both languages, category,
price, price note, start and end date, departure points, seat count, image,
summary, description, included and excluded items. It can mark a trip sold out
and publish or hide it. Bookings are listed for the selected trip and in a
separate tab for all trips.

## Booking submission

This is a documented mock. Submitting the booking form validates the fields and
writes the booking to `localStorage` (`ca-trio-9-state-v1`), so it appears in the
admin and its seats become unavailable on the bus plan. Nothing leaves the
browser. A production build would post the same object to a server endpoint and
send the confirmation email. The form already includes a hidden honeypot field;
Google reCAPTCHA is not wired in the prototype.

## Content and assets

Trip copy, prices, dates, departure points, cancellation terms and partner
agencies come from `content/cs.md` and `content/en.md`. Images in
`public/assets` are placeholders from the old site; the logo is used in the
admin gate. Fonts are Anton and Public Sans, copied from the local font kit with
the latin-ext subset for Czech diacritics.

## Design

A box-office reading of the shared language: Anton set in uppercase at poster
scale, ticket stubs with punched notches and dashed perforations, a ruled season
board, and a 2px ink frame around every panel. The same warm off-white, ink,
cobalt, coral, green and mustard palette is used only in small marks and strips.
The footer is the one ink field, closing the page with the departure call.
