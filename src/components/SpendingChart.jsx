import { categories, money } from "../lib/ledger";
const colors = ["#365e69", "#8fa877", "#d5b181", "#8d92ac", "#b6c1c2"];
export default function SpendingChart({ entries }) {
  const totals = categories.map((category) =>
    entries
      .filter((item) => item.kind === "expense" && item.category === category)
      .reduce((sum, item) => sum + item.cents, 0),
  );
  const max = Math.max(...totals, 1);
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <h2>Where it went</h2>
        <span className="tag">By category</span>
      </div>
      <p className="muted small">Expense totals for your selected month.</p>
      <div
        className="chart"
        role="img"
        aria-label={categories
          .map((category, i) => `${category}: ${money(totals[i])}`)
          .join(", ")}
      >
        {categories.map((category, i) => (
          <div className="chart-row" key={category}>
            <span>{category}</span>
            <div className="chart-track">
              <div
                style={{
                  width: `${(totals[i] / max) * 100}%`,
                  background: colors[i],
                }}
              />
            </div>
            <strong>{money(totals[i])}</strong>
          </div>
        ))}
      </div>
      {!entries.some((item) => item.kind === "expense") && (
        <p className="small muted">
          Add an expense to see your spending breakdown.
        </p>
      )}
    </section>
  );
}
