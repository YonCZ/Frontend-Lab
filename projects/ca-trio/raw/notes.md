# Crawl notes

Capture date: 2026-11-14T18:45:54+01:00
Starting URL: https://www.ca-trio.cz/
User-Agent: OpenCode site rebuild preparation for the ca-trio.cz site owner; read-only content capture
Crawl method: sequential GET requests with at least 400 ms between requests. No forms, logins, bookings, or payment actions were used.
Discovery: internal links only, including pagination, sort categories, and trip details linked from main and last-minute listings. No numeric IDs were generated.

## Counts and sizes

HTML pages captured: 23
Subpages discovered: 22
Subpages captured: 22
Discovered subpages not captured: 0
Images saved: 37
All referenced assets saved successfully: 72
HTTP requests made: 103
Saved HTML bytes: 282874
Saved asset bytes: 6224377
Total saved HTML and asset bytes: 6507251
Page cap reached: no
Category filter pages captured: 4
Trip detail pages captured: 10
Last-minute trips and category filters discovered: 0
Pagination links discovered: 0
Other linked variants captured: index.php and the empty id filter on the main listing

## Technology

Server: PHP-style server-rendered pages using index.php query parameters. The crawl did not inspect server source code.
HTML: UTF-8, HTML5 doctype, Czech language declaration. No generator meta tag is declared.
Template: the HTML comments credit a responsive TemplateMonster travel agency theme and implementation by ZEPPYR s.r.o.
Client libraries: jQuery, jQuery Migrate, Superfish, Camera slideshow. Owl Carousel is also loaded. The saved source includes booking form code, but the crawl did not submit any forms.
External services referenced but not fetched: Google reCAPTCHA, Google Maps, Google Analytics, and Facebook SDK.
Client assets: CSS, JavaScript, and fonts are saved under assets/other. Conditional IE assets are included.

## Navigation

- NABÍDKA ZÁJEZDŮ: https://www.ca-trio.cz/index.php?page=main
- LAST MINUTE: https://www.ca-trio.cz/index.php?page=lm
- SMLUVNÍ CK: https://www.ca-trio.cz/index.php?page=ck
- STORNO PODMÍNKY: https://www.ca-trio.cz/index.php?page=storno
- HISTORIE: https://www.ca-trio.cz/index.php?page=hist
- KONTAKT: https://www.ca-trio.cz/index.php?page=kon

## CSS colours

- #fff: 25 occurrence(s)
- #737272: 15 occurrence(s)
- #c73430: 8 occurrence(s)
- #f0f3f5: 8 occurrence(s)
- #ccc: 6 occurrence(s)
- #e5e5e5: 6 occurrence(s)
- rgba(0, 0, 0, 0.2): 6 occurrence(s)
- #002747: 5 occurrence(s)
- #000: 4 occurrence(s)
- #3498db: 4 occurrence(s)
- #eeeeee: 4 occurrence(s)
- #3d454b: 3 occurrence(s)
- #f3aa29: 3 occurrence(s)
- #ffffff: 3 occurrence(s)
- #002141: 2 occurrence(s)
- #3e454c: 2 occurrence(s)
- #98a6b3: 2 occurrence(s)
- #adaeaf: 2 occurrence(s)
- #d2dae0: 2 occurrence(s)
- #e3e3e3: 2 occurrence(s)
- #efefef: 2 occurrence(s)
- #f1f1f1: 2 occurrence(s)
- #f5f5f5: 2 occurrence(s)
- #001c35: 1 occurrence(s)
- #193c46: 1 occurrence(s)
- #202020: 1 occurrence(s)
- #333333: 1 occurrence(s)
- #3f4b57: 1 occurrence(s)
- #433d45: 1 occurrence(s)
- #696969: 1 occurrence(s)
- #777: 1 occurrence(s)
- #7ecefd: 1 occurrence(s)
- #8fbf4d: 1 occurrence(s)
- #927c67: 1 occurrence(s)
- #a3afba: 1 occurrence(s)
- #b42d29: 1 occurrence(s)
- #c5302c: 1 occurrence(s)
- #cdcdce: 1 occurrence(s)
- #d64842: 1 occurrence(s)
- #d67807: 1 occurrence(s)
- #d74d30: 1 occurrence(s)
- #d84a45: 1 occurrence(s)
- #e02a05: 1 occurrence(s)
- #e08885: 1 occurrence(s)
- #e6e6e6: 1 occurrence(s)
- #f00: 1 occurrence(s)
- #fe5353: 1 occurrence(s)
- rgba(255, 255, 255, 0.9): 1 occurrence(s)

## CSS font families

- FontAwesome
- Open Sans
- PT Sans Narrow
- sans-serif

## Failures and skipped pages

- Request failed: https://www.ca-trio.cz/images/favicon.ico: 404 Client Error: Not Found for url: https://www.ca-trio.cz/images/favicon.ico
- Request failed: https://www.ca-trio.cz/images/blank.gif: 404 Client Error: Not Found for url: https://www.ca-trio.cz/images/blank.gif
- Request failed: https://www.ca-trio.cz/images/prevnext_bg.png: 404 Client Error: Not Found for url: https://www.ca-trio.cz/images/prevnext_bg.png
- Request failed: https://www.ca-trio.cz/images/prev.png: 404 Client Error: Not Found for url: https://www.ca-trio.cz/images/prev.png
- Request failed: https://www.ca-trio.cz/images/thumb_bg.png: 404 Client Error: Not Found for url: https://www.ca-trio.cz/images/thumb_bg.png
- Request failed: https://www.ca-trio.cz/images/pagination.png: 404 Client Error: Not Found for url: https://www.ca-trio.cz/images/pagination.png
- Request failed: https://www.ca-trio.cz/images/count_icon.png: 404 Client Error: Not Found for url: https://www.ca-trio.cz/images/count_icon.png
- Request failed: https://www.ca-trio.cz/css/js/PIE.htc: 404 Client Error: Not Found for url: https://www.ca-trio.cz/css/js/PIE.htc
No discovered internal content subpages were skipped.

External domains, Facebook, mailto, and tel links were not followed. Linked documents and media files were not captured as HTML pages.
