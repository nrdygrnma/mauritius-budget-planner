# Meridian — Relocation Budget Planner

A real-time financial planning tool for calculating how long it takes to save enough to make a major purchase —
typically a property — after relocating abroad.

Configure your income, destination living costs, visa transfer requirements, home country expenses, and purchase target.
Every slider updates the savings timeline instantly. Settings persist across sessions.

---

## Features

- **Real-time savings timeline** — every slider change updates the chart, milestones, and target date instantly
- **Visa transfer modelling** — handles residency permits that require a minimum monthly transfer to a destination bank
  account (spending money, not savings)
- **Dual-currency support** — destination expenses entered in local currency, converted via a configurable rate
- **Optional future expenses** — toggle items like car rental, housing fees, business costs, and emergency fund
  contributions individually to stress-test your timeline
- **Three scenarios** — conservative, base case, and optimistic savings rates shown side by side
- **Milestone tracker** — projected dates for €25k, €50k, €75k, €100k, €125k, and target reached
- **Live savings chart** — cumulative savings curve with a target reference line
- **Transfer coverage warning** — alerts when destination living costs exceed the visa transfer amount
- **Export to JSON** — download a dated snapshot of your current settings
- **Reset to defaults** — restore all values with confirmation
- **Dark mode** — full light/dark theme
- **Persistent state** — all settings saved to `localStorage` automatically

---

## Tech stack

| Layer      | Choice                                                                                                                                                         |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Framework  | [Nuxt 4](https://nuxt.com)                                                                                                                                     |
| UI library | [Nuxt UI v3](https://ui.nuxt.com)                                                                                                                              |
| Styling    | Tailwind CSS v4 (via Nuxt UI)                                                                                                                                  |
| State      | [Pinia](https://pinia.vuejs.org) + [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)                                      |
| Charts     | [Chart.js](https://www.chartjs.org) + [vue-chartjs](https://vue-chartjs.org) + [chartjs-plugin-annotation](https://www.chartjs.org/chartjs-plugin-annotation/) |
| Dates      | [date-fns](https://date-fns.org)                                                                                                                               |
| Utilities  | [VueUse](https://vueuse.org)                                                                                                                                   |
| Language   | TypeScript                                                                                                                                                     |
| Rendering  | SPA (`ssr: false` — localStorage-first)                                                                                                                        |

---

## Project structure

```
meridian/
├── app/
│   ├── assets/css/
│   │   └── main.css              # Tailwind + Nuxt UI imports
│   ├── components/
│   │   ├── AppLogo.vue           # Logo mark + wordmark
│   │   ├── SavingsChart.vue      # Chart.js timeline chart
│   │   ├── SectionHeader.vue     # Icon + title + description
│   │   ├── SliderRow.vue         # Labelled USlider with formatted value
│   │   └── StatRow.vue           # Key/value row with tone colouring
│   ├── composables/
│   │   └── useFormatters.ts      # Currency and date formatting helpers
│   ├── pages/
│   │   ├── index.vue             # Main planner
│   │   └── docs.vue              # How it works
│   ├── stores/
│   │   └── budget.ts             # All state and computed values
│   ├── types/
│   │   └── budget.ts             # TypeScript interfaces
│   └── app.vue                   # App shell with header and nav
├── nuxt.config.ts
├── app.config.ts                 # Theme (teal primary, slate neutral)
└── package.json
```

---

## Getting started

**Prerequisites:** Node.js 20+, npm 10+

```bash
# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

---

## How the maths works

```
Monthly savings = Total income
               − Visa transfer (spent on destination living costs)
               − Health insurance
               − Flights (amortised monthly)
               − Any enabled optional expenses

Months to target = (Purchase price + fees + relocation costs − existing savings)
                 ÷ Monthly savings
```

The mandatory visa transfer is **not savings** — it flows into your destination bank account and covers rent, utilities,
groceries, and daily life. Only the income remaining in your home country after the transfer and home expenses
accumulates toward the purchase target.

---

## Configuration

Default values are set in `app/stores/budget.ts`. Key fields:

| Field              | Default      | Description                        |
|--------------------|--------------|------------------------------------|
| `incomeYou`        | €4,000/mo    | Your net monthly income            |
| `incomePartner`    | €3,500/mo    | Partner's net monthly income       |
| `transferUSD`      | $2,000/mo    | Minimum visa transfer requirement  |
| `eurUsdRate`       | 1.09         | EUR/USD exchange rate              |
| `destCurrencyRate` | 52           | Destination currency units per EUR |
| `rent`             | 45,000 dest. | Monthly rent in local currency     |
| `groceries`        | €400/mo      | Food shopping                      |
| `healthInsurance`  | €200/mo      | International cover, 2 people      |
| `tripsYouPerYear`  | 2            | Return trips home per year         |
| `flightPriceYou`   | €800         | Cost per person return flight      |
| `propertyPrice`    | €130,000     | Target purchase price              |
| `purchaseFees`     | €13,000      | Taxes, legal, agent fees           |
| `relocationCosts`  | €1,200       | One-time moving and setup costs    |
| `startDate`        | Jan 2027     | Date savings accumulation begins   |

---

## Persistence

Settings are stored in `localStorage` under the key `meridian-budget-v1`. SSR is disabled to avoid hydration mismatches
with browser storage APIs.

Use **Export JSON** to save a dated snapshot. Use **Reset to defaults** to restore factory values.

---

## Licence

MIT
