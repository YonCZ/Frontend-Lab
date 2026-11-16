# Verification

All three variants passed the required check.py command at 1440 x 900 and 390 x 844, on the library and Trio project screens. The checks found no console errors, failed local requests, broken images or horizontal overflow. All scripts passed node --check.

## Browser assertions

The same 26 assertions passed for each variant at both widths. They cover the three project entries, live model search, empty search and clearing it, the 36 Trio builds, brief expansion and collapse, model and skill filters, empty filters, opening a preview, pinning a second frame, retaining the pinned iframe and its document while switching the selected build, full-window mode and return, Escape inside the iframe and in the parent, the selected tile, preserving the pin across close and reopen, removing the pin, and a library with 50 entries.

The 50-entry check repeated the supplied project records temporarily in the browser. The saved data still contains exactly the three requested projects. Test 1 uses four real DeepSeek entries, two with No skill and two with Apple Design, to preserve the count in the brief.

The tested preview flow made no external requests. Browser sandbox warnings are present because the local builds need scripts and same-origin access for Escape handling. The browser reported no console errors or failed requests.

## Visual review

The required shot.py script captured each library and project at desktop and phone widths. Each review pass used at most two images. The review also covered the comparison overlay. A clipped paragraph boundary in the collapsed brief and count placement in the phone index were corrected and checked again. The full-window control has an explicit accessible name when its text hides on a phone.

No package installation, build step, project.json edit or change to another project's builds was required.
