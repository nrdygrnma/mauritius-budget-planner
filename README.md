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
- **Dual-currency support** — destination expenses in local currency, converted via a configurable rate
- **Optional future expenses** — toggle items like car rental, housing fees, and business costs individually to
  stress-test your timeline
- **Three scenarios** — conservative, base case, and optimistic savings rates side by side
- **Milestone tracker** — projected dates for €25k, €50k, €75k, €100k, €125k, and target reached
- **Live savings chart** — cumulative savings curve with a target reference line
- **Transfer coverage warning** — alerts when destination living costs exceed the visa transfer amount
- **Settings page** — configure origin/destination country, currencies, exchange rates, relocation date, and scenario
  thresholds
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
app/
├── components/
│   ├── budget/
│   │   ├── Income.vue          # Income sliders
│   │   ├── Transfer.vue        # Visa transfer + exchange rates
│   │   ├── DestExpenses.vue    # Destination living costs
│   │   ├── HomeExpenses.vue    # Home country expenses + flights
│   │   ├── Optional.vue        # Toggleable future expenses
│   │   └── Target.vue          # Purchase target + fees
│   ├── results/
│   │   ├── Chart.vue           # Savings timeline chart card
│   │   ├── Milestones.vue      # Progress + milestone dates
│   │   ├── Scenarios.vue       # Three scenario comparison
│   │   └── Breakdown.vue       # Monthly savings breakdown
│   ├── AppLogo.vue             # Logo mark + wordmark
│   ├── PlannerSummary.vue      # Sticky summary strip
│   ├── ResetModal.vue          # Reset confirmation modal
│   ├── SavingsChart.vue        # Chart.js canvas component
│   ├── SectionHeader.vue       # Icon + title + description
│   └── StatRow.vue             # Key/value row with tone colouring
├── composables/
│   ├── useChartConfig.ts       # Chart.js options + dataset
│   ├── useFormatters.ts        # Intl-based currency + date formatters
│   └── useNav.ts               # Navigation items + active state
├── data/
│   ├── countries.ts            # Country list grouped by region
│   ├── currencies.ts           # Currency list with symbols + locales
│   └── optionalExpenses.ts     # Default optional expense definitions
├── pages/
│   ├── index.vue               # Main planner (~50 lines)
│   ├── docs.vue                # How it works
│   └── settings.vue            # Global configuration
├── stores/
│   ├── budget.ts               # Financial model + computed values
│   └── settings.ts             # Global config (countries, currencies, rates)
├── types/
│   └── index.ts                # All TypeScript interfaces
└── app.vue                     # App shell + navigation
```

---

## Getting started

**Prerequisites:** Node.js 20+, npm 10+

```bash
# Install
npm install

# Develop
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## How the maths works

```
Monthly savings = Total income
               − Visa transfer (covers destination living costs)
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

Global settings live in **Settings** (gear icon in the nav). Key fields:

| Setting               | Default   | Description                         |
|-----------------------|-----------|-------------------------------------|
| Origin country        | Austria   | Where you currently live            |
| Destination country   | Mauritius | Where you are relocating to         |
| Origin currency       | EUR       | Currency you earn in                |
| Destination currency  | MUR       | Local currency at destination       |
| EUR → USD rate        | 1.09      | For the visa transfer conversion    |
| Dest. units per EUR   | 52        | e.g. 52 MUR = €1                    |
| Relocation date       | Jan 2027  | When savings accumulation begins    |
| Conservative scenario | €4,200/mo | Lower bound for scenario comparison |
| Optimistic scenario   | €6,500/mo | Upper bound for scenario comparison |

Planner-level defaults (income, rent, groceries, etc.) live in `app/stores/budget.ts`.

---

## Stores

### `budget.ts`

The financial model. All refs, computeds, and the `resetToDefaults` action. Reads `originToUsdRate`,
`destUnitsPerOrigin`, `relocationDate`, and scenario thresholds from the settings store so the Settings page drives the
planner.

### `settings.ts`

Global configuration — countries, currencies, exchange rates, relocation date, scenario thresholds, and display
preferences. Changing the destination country auto-fills the destination currency.

Both stores are persisted to `localStorage` independently:

- Budget state: `meridian-budget-v1`
- Settings: `meridian-settings-v1`

---

## Persistence

Use **Export JSON** in the summary strip to save a dated snapshot of your budget state. Use **Reset to defaults** to
restore factory values. Settings have their own reset button on the Settings page.

SSR is disabled (`ssr: false`) to avoid hydration mismatches with browser storage APIs.

---

## Licence

MIT