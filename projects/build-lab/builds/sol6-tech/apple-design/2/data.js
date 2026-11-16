window.LAB_PROJECTS = [
  {
    "id": "trio",
    "name": "Trio",
    "initial": "T",
    "summary": "A Czech travel agency site with a trip listing, detail pages, seat booking and a hidden admin area.",
    "brief": "CA Trio is a Czech travel agency in Moravské Budějovice. It sells day trips (Advent trips, musicals and theatre, thermal spas), one Greece package stay, and stays through partner agencies.\n\nBuild a multi-page site that turns a visitor into a booking. Pages: landing, trip listing with filters, trip detail, booking with seat selection, contact and cancellation terms, and a hidden admin area.\n\nListing: filter by category, month, availability and price. Each trip page answers what happens, what is included, what it costs, and where it leaves from.\n\nBooking: choose a departure point, then pick seats on a bus plan. Seats already taken show as unavailable.\n\nSeat map: a bus with 2+2 seating and an aisle, plus a back row of 5 seats. Admin sets the seat count per trip.\n\nAdmin: a route behind a passphrase. Create a trip and edit its name, price, dates, departure points, seat count, description, included and excluded items, and images. See bookings per trip, mark a trip sold out, unpublish it.\n\nCzech and English both ship. Czech is primary, the switch keeps the visitor on the same page.\n\nTake every fact from content/en.md and content/cs.md. Images in public/assets are placeholders.\n\nArchitecture is yours, Design is open. Do not copy the old site.\n\n## Sources\n\n- Content: `/Users/yon/Desktop/Programming/Projects/Frontend Lab/projects/ca-trio/content/en.md` (English) and `/Users/yon/Desktop/Programming/Projects/Frontend Lab/projects/ca-trio/content/cs.md` (Czech). Both use the same sections.\n- Images: flat files in public/assets, taken from the old site. Each trip in the content lists its image.\n\n## Landing hero\n\nThe landing hero comes from the wide images only: hero.jpg, hero-2.jpg, hero-3.jpg, hero-4.jpg, vienna-christmas-market.jpg, hotel-sissy.jpg and vienna-christmas-market-portrait.jpg. Each variant opens with a different one, so no two variants share the same first picture. Keep these out of trip pages; a trip page uses its own thumbnail.\n\nMatch the hero to the palette. Decide the design direction first, then pick a photo that fits it. A dark interface takes a dark scene; a light interface takes a bright one. hero.jpg, hero-2.jpg, hero-3.jpg, hero-4.jpg and both vienna-christmas-market files are night or overcast scenes. hotel-sissy.jpg is the only bright daylight photo, so it belongs with a light theme and must not sit behind a dark one.",
    "models": [
      "DeepSeek V4.1 Flash",
      "GPT Sol 6.1 High"
    ],
    "builds": [
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 1,
        "entry": "../../../../../trio/builds/deepseek/design-taste/1/dist/index.html",
        "id": "trio-1"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 2,
        "entry": "../../../../../trio/builds/deepseek/design-taste/2/dist/index.html",
        "id": "trio-2"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 3,
        "entry": "../../../../../trio/builds/deepseek/design-taste/3/dist/index.html",
        "id": "trio-3"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 4,
        "entry": "../../../../../trio/builds/deepseek/design-taste/4/dist/index.html",
        "id": "trio-4"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 5,
        "entry": "../../../../../trio/builds/deepseek/design-taste/5/dist/index.html",
        "id": "trio-5"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "../../../../../trio/builds/sol6/apple-sol/1/dist/index.html",
        "id": "trio-6"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 2,
        "entry": "../../../../../trio/builds/sol6/apple-sol/2/dist/index.html",
        "id": "trio-7"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "../../../../../trio/builds/sol6/apple-sol/3/dist/index.html",
        "id": "trio-8"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "../../../../../trio/builds/deepseek/apple-design/1/dist/index.html",
        "id": "trio-9"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 2,
        "entry": "../../../../../trio/builds/deepseek/apple-design/2/dist/index.html",
        "id": "trio-10"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "../../../../../trio/builds/deepseek/apple-design/3/dist/index.html",
        "id": "trio-11"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 4,
        "entry": "../../../../../trio/builds/deepseek/apple-design/4/dist/index.html",
        "id": "trio-12"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 5,
        "entry": "../../../../../trio/builds/deepseek/apple-design/5/dist/index.html",
        "id": "trio-13"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/1/dist/index.html",
        "id": "trio-14"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/2/dist/index.html",
        "id": "trio-15"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/3/dist/index.html",
        "id": "trio-16"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 4,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/4/dist/index.html",
        "id": "trio-17"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 5,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/5/dist/index.html",
        "id": "trio-18"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "../../../../../trio/builds/sol6/apple-plus-sol/1/dist/index.html",
        "id": "trio-19"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "../../../../../trio/builds/sol6/apple-plus-sol/2/dist/index.html",
        "id": "trio-20"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "../../../../../trio/builds/sol6/apple-plus-sol/3/dist/index.html",
        "id": "trio-21"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 6,
        "entry": "../../../../../trio/builds/sol6/apple-plus-special/6/dist/index.html",
        "id": "trio-22"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 7,
        "entry": "../../../../../trio/builds/sol6/apple-plus-special/7/dist/index.html",
        "id": "trio-23"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 8,
        "entry": "../../../../../trio/builds/sol6/apple-plus-liked/8/dist/index.html",
        "id": "trio-24"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 9,
        "entry": "../../../../../trio/builds/sol6/apple-plus-liked/9/dist/index.html",
        "id": "trio-25"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 6,
        "entry": "../../../../../trio/builds/deepseek/ds-apple-special/6/dist/index.html",
        "id": "trio-26"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 7,
        "entry": "../../../../../trio/builds/deepseek/ds-apple-special/7/dist/index.html",
        "id": "trio-27"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 8,
        "entry": "../../../../../trio/builds/deepseek/ds-apple-liked/8/dist/index.html",
        "id": "trio-28"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 9,
        "entry": "../../../../../trio/builds/deepseek/ds-apple-liked/9/dist/index.html",
        "id": "trio-29"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 4,
        "entry": "../../../../../trio/builds/sol6/apple-plus-cairn/4/dist/index.html",
        "id": "trio-30"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 5,
        "entry": "../../../../../trio/builds/sol6/apple-plus-cairn/5/dist/index.html",
        "id": "trio-31"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 6,
        "entry": "../../../../../trio/builds/deepseek/apple-design/6/dist/index.html",
        "id": "trio-32"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 7,
        "entry": "../../../../../trio/builds/deepseek/apple-design/7/dist/index.html",
        "id": "trio-33"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 8,
        "entry": "../../../../../trio/builds/deepseek/apple-design/8/dist/index.html",
        "id": "trio-34"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 9,
        "entry": "../../../../../trio/builds/deepseek/apple-design/9/dist/index.html",
        "id": "trio-35"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 10,
        "entry": "../../../../../trio/builds/deepseek/apple-design/10/dist/index.html",
        "id": "trio-36"
      }
    ]
  },
  {
    "id": "demo",
    "name": "Demo",
    "initial": "D",
    "summary": "A landing page for a note-taking app, iterated three times with a switcher.",
    "brief": "Design the landing page for a note-taking application as essentially a second brain, in three iterations with a switcher.",
    "models": [
      "DeepSeek V4.1 Flash"
    ],
    "builds": [
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 1,
        "entry": "../../../../../demo/1/index.html",
        "id": "demo-1"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 2,
        "entry": "../../../../../demo/2/index.html",
        "id": "demo-2"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 3,
        "entry": "../../../../../demo/3/index.html",
        "id": "demo-3"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 1,
        "entry": "../../../../../demo/design/1/index.html",
        "id": "demo-4"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 2,
        "entry": "../../../../../demo/design/2/index.html",
        "id": "demo-5"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "../../../../../demo/apple-design/1/index.html",
        "id": "demo-6"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "../../../../../demo/apple-design/3/index.html",
        "id": "demo-7"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "../../../../../demo/apple-design-plus/1/index.html",
        "id": "demo-8"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "../../../../../demo/apple-design-plus/2/index.html",
        "id": "demo-9"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "../../../../../demo/apple-design-plus/3/index.html",
        "id": "demo-10"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 1,
        "entry": "../../../../../demo/design-taste-motion/1/index.html",
        "id": "demo-11"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 2,
        "entry": "../../../../../demo/design-taste-motion/2/index.html",
        "id": "demo-12"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 3,
        "entry": "../../../../../demo/design-taste-motion/3/index.html",
        "id": "demo-13"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 1,
        "entry": "../../../../../demo/design-taste-apple-motion/1/index.html",
        "id": "demo-14"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 2,
        "entry": "../../../../../demo/design-taste-apple-motion/2/index.html",
        "id": "demo-15"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 3,
        "entry": "../../../../../demo/design-taste-apple-motion/3/index.html",
        "id": "demo-16"
      }
    ]
  },
  {
    "id": "test-1",
    "name": "Test 1",
    "initial": "1",
    "summary": "Layout experiments.",
    "brief": "Layout experiments.",
    "models": [],
    "builds": [
      {
        "id": "test-1-1",
        "model": null,
        "skill": "No skill",
        "variant": 1,
        "entry": "frame.html?variant=1"
      },
      {
        "id": "test-1-2",
        "model": null,
        "skill": "No skill",
        "variant": 2,
        "entry": "frame.html?variant=2"
      },
      {
        "id": "test-1-3",
        "model": null,
        "skill": "No skill",
        "variant": 3,
        "entry": "frame.html?variant=3"
      },
      {
        "id": "test-1-4",
        "model": null,
        "skill": "No skill",
        "variant": 4,
        "entry": "frame.html?variant=4"
      }
    ]
  }
];
