# Trio, variant 9

A desktop React and Vite prototype. The Greece-led landing page uses Outfit and Instrument Sans, a travel-desk layout, a category directory and date-led trip rows. The trip listing uses horizontal tickets.

## Run

Run `npx vite build` in this folder. Open `dist/index.html` through the lab server, not as a `file://` URL. Dependencies resolve from the lab workspace. Do not run `npm install`.

## Routes

- `#/` is the landing page.
- `#/trips` lists published trips. `?category=advent`, `culture`, `spa` or `greece` sets the initial filter.
- `#/trip/10292` is the Greece stay. `#/trip/10244` is Christmas Vienna.
- `#/booking/10244` opens the departure, seat and passenger steps.
- `#/confirmation/<booking-id>` shows a saved demo booking.
- `#/contact` includes the office, insurance, vouchers and all 15 partner agencies.
- `#/terms` contains the supplied cancellation terms.
- `#/admin` is the hidden administration route. The demo passphrase is `trio2026`.

## Prototype limits

Bookings have a working local submission path. The app validates the form and saves the booking in localStorage. It then displays a confirmation, blocks the selected seats and adds the booking to administration. Nothing is sent to CA Trio and no email is sent. The interface states this before submission and on the confirmation page. The honeypot is present. Google reCAPTCHA is not connected because this prototype has no server endpoint or site key.

The admin passphrase is a UI demonstration, not secure authentication. Trips and bookings are stored only in this browser, using keys prefixed `trio-9-`. The login lasts for the browser session. Clear those keys in browser storage to restore the source data. Do not enter real customer data.

Each trip starts with a simulated 49-seat bus. The fixed unavailable seats are demo data, not real availability. The admin can set 9 to 81 seats. The map has 2+2 rows with an aisle, an optional partial row, and a final row of five. Seat counts cannot be reduced below an existing booked seat number.

Source facts come from `content/cs.md` and `content/en.md` in the CA Trio project. Images are supplied placeholders. Czech is the default; switching language preserves the route, filters and booking selections. Both languages have full local font coverage. No external font or tracking requests are made.

This is desktop-only, designed for widths of 1024px and above. A narrow window scrolls the desktop layout rather than loading a mobile redesign.

## Before production

Add server-side authentication, a shared booking database, atomic seat locking, server validation, real submissions, reCAPTCHA, email delivery and an approved privacy policy. Confirm real bus capacities, prices and availability with the agency. This prototype deliberately has no analytics, tracking cookies, search indexing or public deployment.
