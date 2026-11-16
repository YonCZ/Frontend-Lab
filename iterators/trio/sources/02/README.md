# trio variant 5

React and Vite desktop prototype. Build with `npx vite build`. The entry is `dist/index.html`.

Preview: http://localhost:5173/projects/trio/builds/sol6/apple-plus-cairn/5/dist/index.html

Routes use the URL hash. The site includes `#/trips`, `#/trip/10244`, `#/booking/10244`, `#/contact`, `#/terms` and `#/partners`. Switch CZ/EN in the navigation to keep the current page and booking selections.

Open `#/admin` with the demo passphrase `trio2026`. Admin can create bilingual trips, edit prices, dates, departures, descriptions, included and excluded items, cover images and galleries, change capacity, view bookings, mark trips sold out and publish or unpublish them. Seat counts use 2+2 rows and a five-seat back row.

Bookings are a working local mock. Confirmation saves the booking in localStorage and blocks those seats on the next booking. No message, payment or reservation reaches the agency. Admin changes also stay in localStorage. The passphrase is a prototype gate, not server authentication. The form has a spam trap and local validation; this mock does not connect to Google reCAPTCHA.

Trip facts and partner descriptions come from the supplied `content/cs.md` and `content/en.md`. Images are supplied placeholders. The initial capacity of 49 and occupied seats 1, 2, 9, 10, 21 and 22 are demo fixtures, not live availability. The Greece booking includes the optional return bus transfer to Brno airport at 500 CZK per person, shown separately before confirmation.

Storage keys are `trio-5-trips`, `trio-5-bookings` and `trio-5-lang`. Remove these keys to restore the supplied catalogue and clear test bookings. Admin login uses the sessionStorage key `trio-5-auth`.

## What it means for you

You can review the design and complete bookings locally. Real bookings require a submission service and server authentication before launch.
