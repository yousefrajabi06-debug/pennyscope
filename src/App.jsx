import { useState } from "react";
import Shell from "./components/Shell";
import Dialog from "./components/Dialog";
import EntryForm from "./components/EntryForm";
import SpendingChart from "./components/SpendingChart";
import useSavedState from "./hooks/useSavedState";
import {
  monthKey,
  money,
  validEntries,
  summary,
  downloadCsv,
} from "./lib/ledger";
export default function App() {
  const [entries, saveEntries, storageError] = useSavedState(
    "pennyscope.entries.v1",
    [],
    validEntries,
  );
  const [month, setMonth] = useState(monthKey());
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState("");
  const monthly = entries.filter((item) => item.date.startsWith(month));
  const totals = summary(monthly);
  const visible = monthly
    .filter(
      (item) =>
        (kind === "all" || item.kind === kind) &&
        `${item.note} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  function save(fields) {
    saveEntries(
      editing.id
        ? entries.map((item) =>
            item.id === editing.id ? { ...item, ...fields } : item,
          )
        : [...entries, { ...fields, id: crypto.randomUUID() }],
    );
    setMonth(fields.date.slice(0, 7));
    setEditing(null);
    setNotice("Transaction saved.");
  }
  function sample() {
    const m = month || monthKey();
    saveEntries([
      {
        id: "demo-1",
        note: "Sample monthly income",
        cents: 180000,
        date: m + "-01",
        kind: "income",
        category: "Other",
      },
      {
        id: "demo-2",
        note: "Sample groceries",
        cents: 8640,
        date: m + "-03",
        kind: "expense",
        category: "Food",
      },
      {
        id: "demo-3",
        note: "Sample course materials",
        cents: 4500,
        date: m + "-05",
        kind: "expense",
        category: "Learning",
      },
      {
        id: "demo-4",
        note: "Sample transit pass",
        cents: 3200,
        date: m + "-07",
        kind: "expense",
        category: "Transport",
      },
      {
        id: "demo-5",
        note: "Sample household supplies",
        cents: 6800,
        date: m + "-08",
        kind: "expense",
        category: "Home",
      },
    ]);
    setNotice("Fictional sample transactions loaded.");
  }
  return (
    <Shell section="Monthly overview">
      <section className="heading">
        <div>
          <p className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</p>
          <h1>Your money, at a glance.</h1>
          <p className="subtitle">
            A simple ledger for seeing the story behind your spending.
          </p>
        </div>
        <button className="primary" onClick={() => setEditing({})}>
          ＋ Add transaction
        </button>
      </section>
      <div className="toolbar">
        <div className="toolbar-left">
          <label className="small">
            Month{" "}
            <input
              className="control"
              aria-label="Month"
              type="month"
              required
              value={month}
              onChange={(e) => {
                if (e.target.value) setMonth(e.target.value);
              }}
            />
          </label>
          <span className="tag">USD · stored on this device</span>
        </div>
        <button
          className="secondary"
          disabled={!visible.length}
          onClick={() => downloadCsv(visible)}
        >
          Export filtered CSV ↓
        </button>
      </div>
      <p role="status" className="sr-only">
        {notice}
      </p>
      {storageError && (
        <p role="alert" className="error">
          {storageError}
        </p>
      )}
      <section className="stats">
        <div className="stat">
          <span>Money in</span>
          <strong>{money(totals.income)}</strong>
          <small>Income this month</small>
        </div>
        <div className="stat">
          <span>Money out</span>
          <strong>{money(totals.expense)}</strong>
          <small>Expenses this month</small>
        </div>
        <div className="stat accent">
          <span>Net change</span>
          <strong>{money(totals.income - totals.expense)}</strong>
          <small>Income minus expenses</small>
        </div>
      </section>
      <div className="finance-grid">
        <SpendingChart entries={monthly} />
        <section className="insight-panel">
          <p className="eyebrow">MAKE IT A SMALL HABIT</p>
          <h2>
            Know where you stand.
            <br />
            Decide what comes next.
          </h2>
          <p>
            Record the little things. Review one month at a time. Your numbers
            stay yours.
          </p>
          <div className="insight-number">
            {monthly.length}
            <span>transactions this month</span>
          </div>
        </section>
      </div>
      <section className="panel ledger-panel">
        <div className="panel-heading">
          <h2>
            Transactions <span className="count">{visible.length}</span>
          </h2>
          <div className="actions">
            <input
              type="search"
              className="control search"
              aria-label="Search transactions"
              placeholder="Search descriptions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="control"
              aria-label="Transaction type"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        {visible.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td className="entry-note">{item.note}</td>
                    <td>
                      <span className="tag">{item.category}</span>
                    </td>
                    <td className="muted">{item.date}</td>
                    <td className={`money ${item.kind}`}>
                      {item.kind === "income" ? "+" : "−"}
                      {money(item.cents)}
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="text-button"
                          aria-label={`Edit ${item.note}`}
                          onClick={() => setEditing(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-button danger-text"
                          aria-label={`Delete ${item.note}`}
                          onClick={() => setDeleting(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <span>↗</span>
            <h2>
              {entries.length
                ? "No matching transactions."
                : "A fresh start for your finances."}
            </h2>
            <p>
              {entries.length
                ? "Try another month, search, or type."
                : "Add a transaction, or explore with fictional sample data."}
            </p>
            {!entries.length && (
              <button className="secondary" onClick={sample}>
                Load sample transactions
              </button>
            )}
          </div>
        )}
      </section>
      {editing && (
        <Dialog
          title={editing.id ? "Edit transaction" : "Add a transaction"}
          onClose={() => setEditing(null)}
        >
          <EntryForm
            entry={editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        </Dialog>
      )}
      {deleting && (
        <Dialog title="Delete transaction?" onClose={() => setDeleting(null)}>
          <p>Remove “{deleting.note}” from this device?</p>
          <div className="form-actions">
            <button className="secondary" onClick={() => setDeleting(null)}>
              Keep transaction
            </button>
            <button
              className="danger"
              onClick={() => {
                saveEntries(entries.filter((item) => item.id !== deleting.id));
                setDeleting(null);
                setNotice("Transaction deleted.");
              }}
            >
              Delete transaction
            </button>
          </div>
        </Dialog>
      )}
    </Shell>
  );
}
