window.LAB_PROJECTS = [
  {
    "id": "trio",
    "name": "Trio",
    "summary": "A Czech travel agency site with trip listings, seat booking and a hidden admin area.",
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
        "entry": "builds/deepseek/design-taste/1/dist/index.html",
        "id": "01",
        "url": "/projects/trio/builds/deepseek/design-taste/1/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 2,
        "entry": "builds/deepseek/design-taste/2/dist/index.html",
        "id": "02",
        "url": "/projects/trio/builds/deepseek/design-taste/2/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 3,
        "entry": "builds/deepseek/design-taste/3/dist/index.html",
        "id": "03",
        "url": "/projects/trio/builds/deepseek/design-taste/3/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 4,
        "entry": "builds/deepseek/design-taste/4/dist/index.html",
        "id": "04",
        "url": "/projects/trio/builds/deepseek/design-taste/4/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 5,
        "entry": "builds/deepseek/design-taste/5/dist/index.html",
        "id": "05",
        "url": "/projects/trio/builds/deepseek/design-taste/5/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "builds/sol6/apple-sol/1/dist/index.html",
        "id": "06",
        "url": "/projects/trio/builds/sol6/apple-sol/1/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 2,
        "entry": "builds/sol6/apple-sol/2/dist/index.html",
        "id": "07",
        "url": "/projects/trio/builds/sol6/apple-sol/2/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "builds/sol6/apple-sol/3/dist/index.html",
        "id": "08",
        "url": "/projects/trio/builds/sol6/apple-sol/3/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "builds/deepseek/apple-design/1/dist/index.html",
        "id": "09",
        "url": "/projects/trio/builds/deepseek/apple-design/1/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 2,
        "entry": "builds/deepseek/apple-design/2/dist/index.html",
        "id": "10",
        "url": "/projects/trio/builds/deepseek/apple-design/2/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "builds/deepseek/apple-design/3/dist/index.html",
        "id": "11",
        "url": "/projects/trio/builds/deepseek/apple-design/3/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 4,
        "entry": "builds/deepseek/apple-design/4/dist/index.html",
        "id": "12",
        "url": "/projects/trio/builds/deepseek/apple-design/4/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 5,
        "entry": "builds/deepseek/apple-design/5/dist/index.html",
        "id": "13",
        "url": "/projects/trio/builds/deepseek/apple-design/5/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "builds/deepseek/apple-design-plus/1/dist/index.html",
        "id": "14",
        "url": "/projects/trio/builds/deepseek/apple-design-plus/1/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "builds/deepseek/apple-design-plus/2/dist/index.html",
        "id": "15",
        "url": "/projects/trio/builds/deepseek/apple-design-plus/2/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "builds/deepseek/apple-design-plus/3/dist/index.html",
        "id": "16",
        "url": "/projects/trio/builds/deepseek/apple-design-plus/3/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 4,
        "entry": "builds/deepseek/apple-design-plus/4/dist/index.html",
        "id": "17",
        "url": "/projects/trio/builds/deepseek/apple-design-plus/4/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 5,
        "entry": "builds/deepseek/apple-design-plus/5/dist/index.html",
        "id": "18",
        "url": "/projects/trio/builds/deepseek/apple-design-plus/5/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "builds/sol6/apple-plus-sol/1/dist/index.html",
        "id": "19",
        "url": "/projects/trio/builds/sol6/apple-plus-sol/1/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "builds/sol6/apple-plus-sol/2/dist/index.html",
        "id": "20",
        "url": "/projects/trio/builds/sol6/apple-plus-sol/2/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "builds/sol6/apple-plus-sol/3/dist/index.html",
        "id": "21",
        "url": "/projects/trio/builds/sol6/apple-plus-sol/3/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 6,
        "entry": "builds/sol6/apple-plus-special/6/dist/index.html",
        "id": "22",
        "url": "/projects/trio/builds/sol6/apple-plus-special/6/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 7,
        "entry": "builds/sol6/apple-plus-special/7/dist/index.html",
        "id": "23",
        "url": "/projects/trio/builds/sol6/apple-plus-special/7/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 8,
        "entry": "builds/sol6/apple-plus-liked/8/dist/index.html",
        "id": "24",
        "url": "/projects/trio/builds/sol6/apple-plus-liked/8/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 9,
        "entry": "builds/sol6/apple-plus-liked/9/dist/index.html",
        "id": "25",
        "url": "/projects/trio/builds/sol6/apple-plus-liked/9/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 6,
        "entry": "builds/deepseek/ds-apple-special/6/dist/index.html",
        "id": "26",
        "url": "/projects/trio/builds/deepseek/ds-apple-special/6/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 7,
        "entry": "builds/deepseek/ds-apple-special/7/dist/index.html",
        "id": "27",
        "url": "/projects/trio/builds/deepseek/ds-apple-special/7/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 8,
        "entry": "builds/deepseek/ds-apple-liked/8/dist/index.html",
        "id": "28",
        "url": "/projects/trio/builds/deepseek/ds-apple-liked/8/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 9,
        "entry": "builds/deepseek/ds-apple-liked/9/dist/index.html",
        "id": "29",
        "url": "/projects/trio/builds/deepseek/ds-apple-liked/9/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 4,
        "entry": "builds/sol6/apple-plus-cairn/4/dist/index.html",
        "id": "30",
        "url": "/projects/trio/builds/sol6/apple-plus-cairn/4/dist/index.html"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 5,
        "entry": "builds/sol6/apple-plus-cairn/5/dist/index.html",
        "id": "31",
        "url": "/projects/trio/builds/sol6/apple-plus-cairn/5/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 6,
        "entry": "builds/deepseek/apple-design/6/dist/index.html",
        "id": "32",
        "url": "/projects/trio/builds/deepseek/apple-design/6/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 7,
        "entry": "builds/deepseek/apple-design/7/dist/index.html",
        "id": "33",
        "url": "/projects/trio/builds/deepseek/apple-design/7/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 8,
        "entry": "builds/deepseek/apple-design/8/dist/index.html",
        "id": "34",
        "url": "/projects/trio/builds/deepseek/apple-design/8/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 9,
        "entry": "builds/deepseek/apple-design/9/dist/index.html",
        "id": "35",
        "url": "/projects/trio/builds/deepseek/apple-design/9/dist/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 10,
        "entry": "builds/deepseek/apple-design/10/dist/index.html",
        "id": "36",
        "url": "/projects/trio/builds/deepseek/apple-design/10/dist/index.html"
      }
    ]
  },
  {
    "id": "demo",
    "name": "Demo",
    "summary": "A note-taking app landing page, iterated three times with a switcher.",
    "brief": "Build a landing page for a note-taking app. The page is iterated three times, with a switcher so the iterations can be opened and compared.\n\nEach build follows the same brief. Browse the model and skill combinations, select a variant, or pin a build to compare it with another.",
    "models": [
      "DeepSeek V4.1 Flash"
    ],
    "builds": [
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 1,
        "entry": "1/index.html",
        "id": "01",
        "url": "/projects/demo/1/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 2,
        "entry": "2/index.html",
        "id": "02",
        "url": "/projects/demo/2/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 3,
        "entry": "3/index.html",
        "id": "03",
        "url": "/projects/demo/3/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 1,
        "entry": "design/1/index.html",
        "id": "04",
        "url": "/projects/demo/design/1/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 2,
        "entry": "design/2/index.html",
        "id": "05",
        "url": "/projects/demo/design/2/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "apple-design/1/index.html",
        "id": "06",
        "url": "/projects/demo/apple-design/1/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "apple-design/3/index.html",
        "id": "07",
        "url": "/projects/demo/apple-design/3/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "apple-design-plus/1/index.html",
        "id": "08",
        "url": "/projects/demo/apple-design-plus/1/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "apple-design-plus/2/index.html",
        "id": "09",
        "url": "/projects/demo/apple-design-plus/2/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "apple-design-plus/3/index.html",
        "id": "10",
        "url": "/projects/demo/apple-design-plus/3/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 1,
        "entry": "design-taste-motion/1/index.html",
        "id": "11",
        "url": "/projects/demo/design-taste-motion/1/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 2,
        "entry": "design-taste-motion/2/index.html",
        "id": "12",
        "url": "/projects/demo/design-taste-motion/2/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 3,
        "entry": "design-taste-motion/3/index.html",
        "id": "13",
        "url": "/projects/demo/design-taste-motion/3/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 1,
        "entry": "design-taste-apple-motion/1/index.html",
        "id": "14",
        "url": "/projects/demo/design-taste-apple-motion/1/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 2,
        "entry": "design-taste-apple-motion/2/index.html",
        "id": "15",
        "url": "/projects/demo/design-taste-apple-motion/2/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 3,
        "entry": "design-taste-apple-motion/3/index.html",
        "id": "16",
        "url": "/projects/demo/design-taste-apple-motion/3/index.html"
      }
    ]
  },
  {
    "id": "test-1",
    "name": "Test 1",
    "summary": "Layout experiments.",
    "brief": "Layout experiments.\n\nCompare four builds side by side. Each build has its own model, skill, variant and local entry path.",
    "models": [
      "DeepSeek V4.1 Flash"
    ],
    "builds": [
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 1,
        "entry": "builds/deepseek/no-skill/1/index.html",
        "id": "01",
        "url": "/projects/test-1/builds/deepseek/no-skill/1/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 2,
        "entry": "builds/deepseek/no-skill/2/index.html",
        "id": "02",
        "url": "/projects/test-1/builds/deepseek/no-skill/2/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "builds/deepseek/apple-design/1/index.html",
        "id": "03",
        "url": "/projects/test-1/builds/deepseek/apple-design/1/index.html"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 2,
        "entry": "builds/deepseek/apple-design/2/index.html",
        "id": "04",
        "url": "/projects/test-1/builds/deepseek/apple-design/2/index.html"
      }
    ]
  }
];
