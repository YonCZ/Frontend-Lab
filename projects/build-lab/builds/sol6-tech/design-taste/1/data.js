const PROJECTS = [
  {
    "id": "trio",
    "name": "Trio",
    "initial": "T",
    "count": 36,
    "summary": "A Czech travel agency site with trip listings, seat booking and a hidden admin area.",
    "models": [
      "DeepSeek V4.1 Flash",
      "GPT Sol 6.1 High"
    ],
    "brief": [
      "CA Trio is a Czech travel agency in Moravské Budějovice. It sells day trips (Advent trips, musicals and theatre, thermal spas), one Greece package stay, and stays through partner agencies.",
      "Build a multi-page site that turns a visitor into a booking. Pages: landing, trip listing with filters, trip detail, booking with seat selection, contact and cancellation terms, and a hidden admin area.",
      "Listing: filter by category, month, availability and price. Each trip page answers what happens, what is included, what it costs, and where it leaves from.",
      "Booking: choose a departure point, then pick seats on a bus plan. Seats already taken show as unavailable.",
      "Seat map: a bus with 2+2 seating and an aisle, plus a back row of 5 seats. Admin sets the seat count per trip.",
      "Admin: a route behind a passphrase. Create a trip and edit its name, price, dates, departure points, seat count, description, included and excluded items, and images. See bookings per trip, mark a trip sold out, unpublish it.",
      "Czech and English both ship. Czech is primary, the switch keeps the visitor on the same page.",
      "Take every fact from content/en.md and content/cs.md. Images in public/assets are placeholders.",
      "Architecture is yours, Design is open. Do not copy the old site.",
      "## Landing hero",
      "The landing hero comes from the wide images only: hero.jpg, hero-2.jpg, hero-3.jpg, hero-4.jpg, vienna-christmas-market.jpg, hotel-sissy.jpg and vienna-christmas-market-portrait.jpg. Each variant opens with a different one, so no two variants share the same first picture. Keep these out of trip pages; a trip page uses its own thumbnail.",
      "Match the hero to the palette. Decide the design direction first, then pick a photo that fits it. A dark interface takes a dark scene; a light interface takes a bright one. hero.jpg, hero-2.jpg, hero-3.jpg, hero-4.jpg and both vienna-christmas-market files are night or overcast scenes. hotel-sissy.jpg is the only bright daylight photo, so it belongs with a light theme and must not sit behind a dark one."
    ],
    "builds": [
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 1,
        "entry": "../../../../../trio/builds/deepseek/design-taste/1/dist/index.html",
        "id": "trio-1",
        "path": "projects/trio/builds/deepseek/design-taste/1/dist/index.html",
        "thumbnail": "assets/trio-1.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 2,
        "entry": "../../../../../trio/builds/deepseek/design-taste/2/dist/index.html",
        "id": "trio-2",
        "path": "projects/trio/builds/deepseek/design-taste/2/dist/index.html",
        "thumbnail": "assets/trio-2.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 3,
        "entry": "../../../../../trio/builds/deepseek/design-taste/3/dist/index.html",
        "id": "trio-3",
        "path": "projects/trio/builds/deepseek/design-taste/3/dist/index.html",
        "thumbnail": "assets/trio-3.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 4,
        "entry": "../../../../../trio/builds/deepseek/design-taste/4/dist/index.html",
        "id": "trio-4",
        "path": "projects/trio/builds/deepseek/design-taste/4/dist/index.html",
        "thumbnail": "assets/trio-4.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 5,
        "entry": "../../../../../trio/builds/deepseek/design-taste/5/dist/index.html",
        "id": "trio-5",
        "path": "projects/trio/builds/deepseek/design-taste/5/dist/index.html",
        "thumbnail": "assets/trio-5.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "../../../../../trio/builds/sol6/apple-sol/1/dist/index.html",
        "id": "trio-6",
        "path": "projects/trio/builds/sol6/apple-sol/1/dist/index.html",
        "thumbnail": "assets/trio-6.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 2,
        "entry": "../../../../../trio/builds/sol6/apple-sol/2/dist/index.html",
        "id": "trio-7",
        "path": "projects/trio/builds/sol6/apple-sol/2/dist/index.html",
        "thumbnail": "assets/trio-7.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "../../../../../trio/builds/sol6/apple-sol/3/dist/index.html",
        "id": "trio-8",
        "path": "projects/trio/builds/sol6/apple-sol/3/dist/index.html",
        "thumbnail": "assets/trio-8.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "../../../../../trio/builds/deepseek/apple-design/1/dist/index.html",
        "id": "trio-9",
        "path": "projects/trio/builds/deepseek/apple-design/1/dist/index.html",
        "thumbnail": "assets/trio-9.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 2,
        "entry": "../../../../../trio/builds/deepseek/apple-design/2/dist/index.html",
        "id": "trio-10",
        "path": "projects/trio/builds/deepseek/apple-design/2/dist/index.html",
        "thumbnail": "assets/trio-10.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "../../../../../trio/builds/deepseek/apple-design/3/dist/index.html",
        "id": "trio-11",
        "path": "projects/trio/builds/deepseek/apple-design/3/dist/index.html",
        "thumbnail": "assets/trio-11.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 4,
        "entry": "../../../../../trio/builds/deepseek/apple-design/4/dist/index.html",
        "id": "trio-12",
        "path": "projects/trio/builds/deepseek/apple-design/4/dist/index.html",
        "thumbnail": "assets/trio-12.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 5,
        "entry": "../../../../../trio/builds/deepseek/apple-design/5/dist/index.html",
        "id": "trio-13",
        "path": "projects/trio/builds/deepseek/apple-design/5/dist/index.html",
        "thumbnail": "assets/trio-13.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/1/dist/index.html",
        "id": "trio-14",
        "path": "projects/trio/builds/deepseek/apple-design-plus/1/dist/index.html",
        "thumbnail": "assets/trio-14.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/2/dist/index.html",
        "id": "trio-15",
        "path": "projects/trio/builds/deepseek/apple-design-plus/2/dist/index.html",
        "thumbnail": "assets/trio-15.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/3/dist/index.html",
        "id": "trio-16",
        "path": "projects/trio/builds/deepseek/apple-design-plus/3/dist/index.html",
        "thumbnail": "assets/trio-16.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 4,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/4/dist/index.html",
        "id": "trio-17",
        "path": "projects/trio/builds/deepseek/apple-design-plus/4/dist/index.html",
        "thumbnail": "assets/trio-17.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 5,
        "entry": "../../../../../trio/builds/deepseek/apple-design-plus/5/dist/index.html",
        "id": "trio-18",
        "path": "projects/trio/builds/deepseek/apple-design-plus/5/dist/index.html",
        "thumbnail": "assets/trio-18.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "../../../../../trio/builds/sol6/apple-plus-sol/1/dist/index.html",
        "id": "trio-19",
        "path": "projects/trio/builds/sol6/apple-plus-sol/1/dist/index.html",
        "thumbnail": "assets/trio-19.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "../../../../../trio/builds/sol6/apple-plus-sol/2/dist/index.html",
        "id": "trio-20",
        "path": "projects/trio/builds/sol6/apple-plus-sol/2/dist/index.html",
        "thumbnail": "assets/trio-20.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "../../../../../trio/builds/sol6/apple-plus-sol/3/dist/index.html",
        "id": "trio-21",
        "path": "projects/trio/builds/sol6/apple-plus-sol/3/dist/index.html",
        "thumbnail": "assets/trio-21.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 6,
        "entry": "../../../../../trio/builds/sol6/apple-plus-special/6/dist/index.html",
        "id": "trio-22",
        "path": "projects/trio/builds/sol6/apple-plus-special/6/dist/index.html",
        "thumbnail": "assets/trio-22.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 7,
        "entry": "../../../../../trio/builds/sol6/apple-plus-special/7/dist/index.html",
        "id": "trio-23",
        "path": "projects/trio/builds/sol6/apple-plus-special/7/dist/index.html",
        "thumbnail": "assets/trio-23.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 8,
        "entry": "../../../../../trio/builds/sol6/apple-plus-liked/8/dist/index.html",
        "id": "trio-24",
        "path": "projects/trio/builds/sol6/apple-plus-liked/8/dist/index.html",
        "thumbnail": "assets/trio-24.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 9,
        "entry": "../../../../../trio/builds/sol6/apple-plus-liked/9/dist/index.html",
        "id": "trio-25",
        "path": "projects/trio/builds/sol6/apple-plus-liked/9/dist/index.html",
        "thumbnail": "assets/trio-25.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 6,
        "entry": "../../../../../trio/builds/deepseek/ds-apple-special/6/dist/index.html",
        "id": "trio-26",
        "path": "projects/trio/builds/deepseek/ds-apple-special/6/dist/index.html",
        "thumbnail": "assets/trio-26.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 7,
        "entry": "../../../../../trio/builds/deepseek/ds-apple-special/7/dist/index.html",
        "id": "trio-27",
        "path": "projects/trio/builds/deepseek/ds-apple-special/7/dist/index.html",
        "thumbnail": "assets/trio-27.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 8,
        "entry": "../../../../../trio/builds/deepseek/ds-apple-liked/8/dist/index.html",
        "id": "trio-28",
        "path": "projects/trio/builds/deepseek/ds-apple-liked/8/dist/index.html",
        "thumbnail": "assets/trio-28.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 9,
        "entry": "../../../../../trio/builds/deepseek/ds-apple-liked/9/dist/index.html",
        "id": "trio-29",
        "path": "projects/trio/builds/deepseek/ds-apple-liked/9/dist/index.html",
        "thumbnail": "assets/trio-29.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 4,
        "entry": "../../../../../trio/builds/sol6/apple-plus-cairn/4/dist/index.html",
        "id": "trio-30",
        "path": "projects/trio/builds/sol6/apple-plus-cairn/4/dist/index.html",
        "thumbnail": "assets/trio-30.jpg"
      },
      {
        "model": "GPT Sol 6.1 High",
        "skill": "Apple Design +",
        "variant": 5,
        "entry": "../../../../../trio/builds/sol6/apple-plus-cairn/5/dist/index.html",
        "id": "trio-31",
        "path": "projects/trio/builds/sol6/apple-plus-cairn/5/dist/index.html",
        "thumbnail": "assets/trio-31.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 6,
        "entry": "../../../../../trio/builds/deepseek/apple-design/6/dist/index.html",
        "id": "trio-32",
        "path": "projects/trio/builds/deepseek/apple-design/6/dist/index.html",
        "thumbnail": "assets/trio-32.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 7,
        "entry": "../../../../../trio/builds/deepseek/apple-design/7/dist/index.html",
        "id": "trio-33",
        "path": "projects/trio/builds/deepseek/apple-design/7/dist/index.html",
        "thumbnail": "assets/trio-33.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 8,
        "entry": "../../../../../trio/builds/deepseek/apple-design/8/dist/index.html",
        "id": "trio-34",
        "path": "projects/trio/builds/deepseek/apple-design/8/dist/index.html",
        "thumbnail": "assets/trio-34.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 9,
        "entry": "../../../../../trio/builds/deepseek/apple-design/9/dist/index.html",
        "id": "trio-35",
        "path": "projects/trio/builds/deepseek/apple-design/9/dist/index.html",
        "thumbnail": "assets/trio-35.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 10,
        "entry": "../../../../../trio/builds/deepseek/apple-design/10/dist/index.html",
        "id": "trio-36",
        "path": "projects/trio/builds/deepseek/apple-design/10/dist/index.html",
        "thumbnail": "assets/trio-36.jpg"
      }
    ]
  },
  {
    "id": "demo",
    "name": "Demo",
    "initial": "D",
    "count": 16,
    "summary": "A landing page for a note-taking app, iterated three times with a switcher.",
    "models": [
      "DeepSeek V4.1 Flash"
    ],
    "brief": [
      "Design the landing page for a note-taking application as essentially a second brain, in three iterations with a switcher."
    ],
    "builds": [
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 1,
        "entry": "../../../../../demo/1/index.html",
        "id": "demo-1",
        "path": "projects/demo/1/index.html",
        "thumbnail": "assets/demo-1.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 2,
        "entry": "../../../../../demo/2/index.html",
        "id": "demo-2",
        "path": "projects/demo/2/index.html",
        "thumbnail": "assets/demo-2.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "No skill",
        "variant": 3,
        "entry": "../../../../../demo/3/index.html",
        "id": "demo-3",
        "path": "projects/demo/3/index.html",
        "thumbnail": "assets/demo-3.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 1,
        "entry": "../../../../../demo/design/1/index.html",
        "id": "demo-4",
        "path": "projects/demo/design/1/index.html",
        "thumbnail": "assets/demo-4.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design",
        "variant": 2,
        "entry": "../../../../../demo/design/2/index.html",
        "id": "demo-5",
        "path": "projects/demo/design/2/index.html",
        "thumbnail": "assets/demo-5.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 1,
        "entry": "../../../../../demo/apple-design/1/index.html",
        "id": "demo-6",
        "path": "projects/demo/apple-design/1/index.html",
        "thumbnail": "assets/demo-6.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design",
        "variant": 3,
        "entry": "../../../../../demo/apple-design/3/index.html",
        "id": "demo-7",
        "path": "projects/demo/apple-design/3/index.html",
        "thumbnail": "assets/demo-7.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 1,
        "entry": "../../../../../demo/apple-design-plus/1/index.html",
        "id": "demo-8",
        "path": "projects/demo/apple-design-plus/1/index.html",
        "thumbnail": "assets/demo-8.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 2,
        "entry": "../../../../../demo/apple-design-plus/2/index.html",
        "id": "demo-9",
        "path": "projects/demo/apple-design-plus/2/index.html",
        "thumbnail": "assets/demo-9.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Apple Design +",
        "variant": 3,
        "entry": "../../../../../demo/apple-design-plus/3/index.html",
        "id": "demo-10",
        "path": "projects/demo/apple-design-plus/3/index.html",
        "thumbnail": "assets/demo-10.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 1,
        "entry": "../../../../../demo/design-taste-motion/1/index.html",
        "id": "demo-11",
        "path": "projects/demo/design-taste-motion/1/index.html",
        "thumbnail": "assets/demo-11.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 2,
        "entry": "../../../../../demo/design-taste-motion/2/index.html",
        "id": "demo-12",
        "path": "projects/demo/design-taste-motion/2/index.html",
        "thumbnail": "assets/demo-12.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Motion",
        "variant": 3,
        "entry": "../../../../../demo/design-taste-motion/3/index.html",
        "id": "demo-13",
        "path": "projects/demo/design-taste-motion/3/index.html",
        "thumbnail": "assets/demo-13.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 1,
        "entry": "../../../../../demo/design-taste-apple-motion/1/index.html",
        "id": "demo-14",
        "path": "projects/demo/design-taste-apple-motion/1/index.html",
        "thumbnail": "assets/demo-14.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 2,
        "entry": "../../../../../demo/design-taste-apple-motion/2/index.html",
        "id": "demo-15",
        "path": "projects/demo/design-taste-apple-motion/2/index.html",
        "thumbnail": "assets/demo-15.jpg"
      },
      {
        "model": "DeepSeek V4.1 Flash",
        "skill": "Design + Taste + Apple + Motion",
        "variant": 3,
        "entry": "../../../../../demo/design-taste-apple-motion/3/index.html",
        "id": "demo-16",
        "path": "projects/demo/design-taste-apple-motion/3/index.html",
        "thumbnail": "assets/demo-16.jpg"
      }
    ]
  },
  {
    "id": "test-1",
    "name": "Test 1",
    "initial": "1",
    "count": 4,
    "summary": "Layout experiments.",
    "models": [],
    "brief": [
      "Layout experiments.",
      "Model and skill metadata were not supplied for this project. The four local specimens let you try the preview and comparison flow without assigning an unrecorded model or skill."
    ],
    "builds": [
      {
        "id": "test-1-1",
        "model": "Not recorded",
        "skill": "Not recorded",
        "variant": 1,
        "entry": "experiment.html?variant=1",
        "path": "experiment.html?variant=1",
        "thumbnail": "assets/test-1-1.jpg"
      },
      {
        "id": "test-1-2",
        "model": "Not recorded",
        "skill": "Not recorded",
        "variant": 2,
        "entry": "experiment.html?variant=2",
        "path": "experiment.html?variant=2",
        "thumbnail": "assets/test-1-2.jpg"
      },
      {
        "id": "test-1-3",
        "model": "Not recorded",
        "skill": "Not recorded",
        "variant": 3,
        "entry": "experiment.html?variant=3",
        "path": "experiment.html?variant=3",
        "thumbnail": "assets/test-1-3.jpg"
      },
      {
        "id": "test-1-4",
        "model": "Not recorded",
        "skill": "Not recorded",
        "variant": 4,
        "entry": "experiment.html?variant=4",
        "path": "experiment.html?variant=4",
        "thumbnail": "assets/test-1-4.jpg"
      }
    ]
  }
];

