import { useState } from "react";
import { categories, today } from "../lib/ledger";
export default function EntryForm({ entry, onSave, onCancel }) {
  const [form, setForm] = useState({
    note: entry.note || "",
    date: entry.date || today(),
    kind: entry.kind || "expense",
    category: entry.category || "Food",
    amount: entry.cents ? entry.cents / 100 : "",
  });
  const [error, setError] = useState("");
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  function submit(event) {
    event.preventDefault();
    const cents = Math.round(Number(form.amount) * 100);
    if (
      !form.note.trim() ||
      !Number.isSafeInteger(cents) ||
      cents <= 0 ||
      cents > 100000000
    ) {
      setError("Add a description and an amount between $0.01 and $1,000,000.");
      return;
    }
    onSave({
      note: form.note.trim(),
      date: form.date,
      kind: form.kind,
      category: form.category,
      cents,
    });
  }
  return (
    <form className="form" onSubmit={submit}>
      <label>
        Description
        <input
          autoFocus
          name="note"
          maxLength={120}
          required
          value={form.note}
          onChange={update}
          placeholder="e.g. Monthly bus pass"
        />
      </label>
      <div className="form-row">
        <label>
          Amount (USD)
          <input
            name="amount"
            type="number"
            min="0.01"
            max="1000000"
            step="0.01"
            required
            value={form.amount}
            onChange={update}
          />
        </label>
        <label>
          Date
          <input
            name="date"
            type="date"
            required
            value={form.date}
            onChange={update}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Type
          <select name="kind" value={form.kind} onChange={update}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={update}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary">Save transaction</button>
      </div>
    </form>
  );
}
