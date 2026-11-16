# Trio prototype, variant 6

Run `npx vite build` in this folder. Serve `dist/` over HTTP. The Vite base is relative, so the build also runs under the supplied preview path.

Routes use hashes. Open `#/trips`, `#/trip/10244`, `#/booking/10244`, `#/contact`, `#/terms`, or `#/about`. Czech is the default. The language switch keeps the current page and in-progress booking.

## Demo storage

Bookings and trip edits use localStorage, under keys beginning with `trio-v6-`. Nothing reaches the agency, no email is sent, and no payment occurs. The booking form and confirmation explain this. Occupied seats are demo data. Booking a seat makes it unavailable in this browser after reload. Do not enter real personal details.

Open `#/admin` with passphrase `trio-demo`. The passphrase gates the client interface only. It is not production authentication. Admin access uses sessionStorage. Trip creation and edits require Czech and English content. Seat counts use complete 2+2 rows and a rear row of five, such as 45, 49 or 53. Admin edits persist after reload. To reset, remove this variant's localStorage keys in browser developer tools.

Trip content comes from the supplied `content/cs.md` and `content/en.md`. Theatre prices cover transport, not admission. Greece is a flight package; its bus seats refer to the optional airport transfer. Production requires server-side booking, shared seat inventory, access control, spam protection and a privacy policy before collecting real customer details.
