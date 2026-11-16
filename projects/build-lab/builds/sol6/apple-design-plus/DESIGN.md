# Frontend Lab variants

Software workbench for reviewing local frontend builds. Main action: open a project and compare builds.

## Shared system

Background #ffffff, ink #222925, muted #656d68, surface #f2f4f1, accent #31644e. Hairlines use ink at low opacity. One local Instrument Sans family, regular and bold. Weight and size show hierarchy. Left alignment, readable brief measures, no decorative motion. Interface copy uses direct action labels and the supplied facts.

## Layouts

1. Index. A narrow library rail beside a compact project table. Project title, model and build count align in columns. Build thumbnails use a grid on the project screen.

   Library rail | Title and search
                | Project / Models / Builds
                | Project rows

2. Gallery. A broad horizontal header and three unboxed project covers. Large neutral initials identify the projects. Build images take precedence after opening a project.

   Header
   Title                         Search
   Cover         Cover           Cover
   Project       Project         Project

3. Workspace. A project navigator stays beside the main area. Opening a project places its readable brief in a fixed-width column beside the build grid.

   Projects | Brief | Build grid
            |       | Selected preview

The first plan used oversized cover tiles for all three variants. That repeated the same composition, so the index now prioritizes aligned metadata and the workspace uses a persistent project navigator. The supplied workbench requirements replace the marketing skill's hero, section-height, photographic, motion and effects recipes. No external assets, install or build step.

## Verification

All three variants passed scripts/check.py on the library and the 36-build project at 1440px and 390px. The interaction checks covered project and model search, empty results, brief expansion, build filters, preview, comparison, full window and Escape. A pinned iframe retained its document and state across build changes. Escape also closed the preview from inside its iframe. The expanded brief stayed within a 390px viewport. A temporary 50-entry library stayed within desktop width. The tests reported no console or page errors. Desktop libraries, the split project view and phone library and project views received visual review.
