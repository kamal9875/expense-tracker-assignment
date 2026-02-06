"use client";

import { useEffect, useMemo, useState } from "react";
import { api, Category, Expense } from "@/lib/api";

type FormState = {
  id?: number;
  title: string;
  amount: string;
  currency: string;
  expense_date: string;
  notes: string;
  category: number | "";
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ExpensesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [newCat, setNewCat] = useState("");
  const [form, setForm] = useState<FormState>({
    title: "",
    amount: "",
    currency: "INR",
    expense_date: todayISO(),
    notes: "",
    category: "",
  });

  const isEditing = useMemo(() => Boolean(form.id), [form.id]);

  async function refresh() {
    setErr(null);
    setLoading(true);
    try {
      const [cats, exps] = await Promise.all([api.listCategories(), api.listExpenses()]);
      setCategories(cats);
      setExpenses(exps);
    } catch (e: any) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addCategory() {
    if (!newCat.trim()) return;
    try {
      await api.createCategory(newCat.trim());
      setNewCat("");
      await refresh();
    } catch (e: any) {
      setErr(e.message || "Failed");
    }
  }

  async function saveExpense() {
    setErr(null);
    if (!form.title.trim() || !form.amount || !form.expense_date || !form.category) {
      setErr("Please fill Title, Amount, Date, Category.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      amount: form.amount,
      currency: form.currency,
      expense_date: form.expense_date,
      notes: form.notes || "",
      category: Number(form.category),
    };
    try {
      if (form.id) {
        await api.updateExpense(form.id, payload);
      } else {
        await api.createExpense(payload);
      }
      setForm({ title: "", amount: "", currency: "INR", expense_date: todayISO(), notes: "", category: "" });
      await refresh();
    } catch (e: any) {
      setErr(e.message || "Failed");
    }
  }

  function startEdit(exp: Expense) {
    setForm({
      id: exp.id,
      title: exp.title,
      amount: exp.amount,
      currency: exp.currency,
      expense_date: exp.expense_date,
      notes: exp.notes || "",
      category: exp.category,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeExpense(id: number) {
    if (!confirm("Delete this expense?")) return;
    try {
      await api.deleteExpense(id);
      await refresh();
    } catch (e: any) {
      setErr(e.message || "Failed");
    }
  }

  async function removeCategory(id: number) {
    if (!confirm("Delete this category? (Will fail if expenses use it)")) return;
    try {
      await api.deleteCategory(id);
      await refresh();
    } catch (e: any) {
      setErr(e.message || "Failed");
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h1>Expenses (Full CRUD)</h1>
        <p className="small">Create, view, update, and delete expenses from this UI. These actions call REST APIs (POST/PATCH/DELETE).</p>

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <div className="grid grid2">
          <div className="card">
            <h2>{isEditing ? "Edit Expense" : "Create Expense"}</h2>
            <div className="grid">
              <div>
                <div className="small">Title</div>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Uber, Groceries" />
              </div>

              <div className="grid grid2">
                <div>
                  <div className="small">Amount</div>
                  <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g., 499.00" />
                </div>
                <div>
                  <div className="small">Currency</div>
                  <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    {["INR", "USD", "EUR", "GBP", "AED"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid2">
                <div>
                  <div className="small">Date</div>
                  <input type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
                </div>
                <div>
                  <div className="small">Category</div>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="small">Notes</div>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional" />
              </div>

              <div className="row">
                <button onClick={saveExpense}>{isEditing ? "Save Changes" : "Create Expense"}</button>
                {isEditing && (
                  <button
                    className="secondary"
                    onClick={() => setForm({ title: "", amount: "", currency: "INR", expense_date: todayISO(), notes: "", category: "" })}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Categories</h2>
            <div className="row">
              <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category (e.g., Travel)" />
              <button onClick={addCategory}>Add</button>
            </div>

            <div style={{ marginTop: 12 }}>
              {categories.length === 0 ? (
                <p className="small">No categories yet. Create one first.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th style={{ width: 110 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>
                          <button className="danger" onClick={() => removeCategory(c.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <p className="small" style={{ marginTop: 10 }}>
              Tip: Deleting a category will fail if any expenses are linked (protected FK).
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Expense List</h2>
        {loading ? (
          <p className="small">Loading…</p>
        ) : expenses.length === 0 ? (
          <p className="small">No expenses yet. Create one above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td><span className="badge">{e.category_name}</span></td>
                  <td>{e.amount} {e.currency}</td>
                  <td>{e.expense_date}</td>
                  <td className="row">
                    <button className="secondary" onClick={() => startEdit(e)}>Edit</button>
                    <button className="danger" onClick={() => removeExpense(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
