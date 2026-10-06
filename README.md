# AI Club website

Homepage of **Algorithmic Problem Solving with AI**, the AI Club at HTL Leonding. Built with Astro and deployed to GitHub Pages.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
```

## Edit content

- **Forms:** `joinFormUrl` (students) and `guestFormUrl` (external guests) in `src/data/site.ts`. The sign-up QR code is generated from `joinFormUrl` at build time, on the page and as a printable `/qr-signup.svg`. If `joinFormUrl` is emptied, the join prompt says the link is coming soon instead of linking nowhere.
- **Sessions:** one YAML file per semester in `src/content/semesters/`. Every session needs a `date`. A `title` is optional (sessions without one show as "Club meeting"). Times and place default to the semester's `defaults` (place falls back to HTL Leonding) and can be overridden per session with `start`, `end` and `place`. A `schedule` list (`time` as `HH:MM`, or `~HH:MM` when approximate, plus a `label`) shows the run of the day as a timeline, as for the bus to the CCC. These optional fields fill the expandable details if you ever need them: `room`, `summary`, `agenda`, `bring`, `level`, `prerequisites`, `host`, `links`. Done, next, and upcoming are worked out from the date in the visitor's browser.
- **People:** `people` in `src/data/site.ts`.

Each session has its own link, such as `/#w26-02`, which opens with that session expanded.

## Deploy

Pushing to `main` builds and deploys through `.github/workflows/deploy.yml`. In the repository settings, set Pages to deploy from **GitHub Actions**. The workflow also rebuilds daily, so the next session stays correct for visitors without JavaScript.

## Kiosk slides

`/kiosk/` (for example https://rstropek.github.io/htl-ai-club/kiosk/) is a self-advancing slide loop for a stand, such as the Club Convention Day. Open it in a browser on the screen and press `f` for fullscreen. It fits any screen size, hides the mouse pointer, keeps the screen awake where the browser allows it, and drops the CCC slide once the contest is over. It is not linked from the homepage.

Keys: `→` or `PageDown` next, `←` or `PageUp` back, `space` pause, `f` fullscreen. A click also advances. `#3` in the URL starts at slide 3. Without internet at the venue, run `npm run build && npm run preview` on the laptop and open `/kiosk/` there.

The texts come from `src/data/copy.ts` (shared with the homepage) and the session data, so both stay in sync.

## Promo images

`promo/ccc-1920x1080.png` is a Full HD image announcing the Cloudflight Coding Contest, for the screen in the school entrance. Its source is `src/pages/promo/[name].astro`, a route that exists only in `astro dev` and is never published. Date, time, place and the registration link come from the semester data, so after changing them run:

```sh
npm run promo     # writes promo/ccc-1920x1080.png (set CHROME_PATH if Chrome isn't found)
```
