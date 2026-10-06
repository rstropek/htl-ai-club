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
- **Sessions:** one YAML file per semester in `src/content/semesters/`. Every session needs a `date`. A `title` is optional (sessions without one show as "Club meeting"). Times and place default to the semester's `defaults` (place falls back to HTL Leonding) and can be overridden per session with `start`, `end` and `place`. These optional fields fill the expandable details if you ever need them: `room`, `summary`, `agenda`, `bring`, `level`, `prerequisites`, `host`, `links`. Done, next, and upcoming are worked out from the date in the visitor's browser.
- **People:** `people` in `src/data/site.ts`.

Each session has its own link, such as `/#w26-02`, which opens with that session expanded.

## Deploy

Pushing to `main` builds and deploys through `.github/workflows/deploy.yml`. In the repository settings, set Pages to deploy from **GitHub Actions**. The workflow also rebuilds daily, so the next session stays correct for visitors without JavaScript.

## Promo images

`promo/ccc-1920x1080.png` is a Full HD image announcing the Cloudflight Coding Contest, for the screen in the school entrance. Its source is `src/pages/promo/[name].astro`, a route that exists only in `astro dev` and is never published. Date, time, place and the registration link come from the semester data, so after changing them run:

```sh
npm run promo     # writes promo/ccc-1920x1080.png (set CHROME_PATH if Chrome isn't found)
```
