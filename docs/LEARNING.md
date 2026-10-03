# Learning guide — PennyScope

A personal cash-flow dashboard with a clear, editable transaction ledger.

## Important files

- [`src/App.jsx`](../src/App.jsx): State, derived totals, month/category/search filters, and CRUD handlers.
- [`src/components/EntryForm.jsx`](../src/components/EntryForm.jsx): Controlled form and amount validation.
- [`src/components/SpendingChart.jsx`](../src/components/SpendingChart.jsx): Accessible category totals and CSS bars.
- [`src/lib/ledger.js`](../src/lib/ledger.js): Integer cents, aggregation, saved-data validation, and CSV escaping.
- [`src/hooks/useSavedState.js`](../src/hooks/useSavedState.js): Reading and saving browser data with failure handling.
- [`tests/app.spec.js`](../tests/app.spec.js): CRUD, arithmetic, CSV safety, persistence, and mobile checks.

## Five things to study

1. Trace how a form amount becomes integer cents before it is stored.
2. Use filter and reduce to derive a monthly summary without extra React state.
3. Explain immutable updates when editing or deleting a transaction.
4. Understand why a CSV cell beginning with a formula character needs neutralization.
5. Trace localStorage initialization and what happens when writes fail.

## One feature to build independently

Add a category spending limit and a text warning when the selected month exceeds it.

## Rebuild to understand

Start in an empty branch or separate practice folder. Rebuild the main form and one data update without copying, then add persistence or the API request. Explain the data flow aloud and recreate one behavior test. Compare your work with the original only after it works.

## Honest presentation

This is an AI-assisted learning project. Describe the code you can explain and the features you rebuilt yourself. Do not present it as employment, client work, or proof of independent mastery before studying it.
