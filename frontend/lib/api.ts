export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export type Category = { id: number; name: string };
export type Expense = {
  id: number;
  title: string;
  amount: string;
  currency: string;
  expense_date: string;
  notes: string;
  category: number;
  category_name?: string;
};

export const api = {
  // Categories
  listCategories: () => http<Category[]>("/categories/"),
  createCategory: (name: string) => http<Category>("/categories/", { method: "POST", body: JSON.stringify({ name }) }),
  deleteCategory: (id: number) => http(`/categories/${id}/`, { method: "DELETE" }),

  // Expenses
  listExpenses: () => http<Expense[]>("/expenses/"),
  createExpense: (payload: Omit<Expense, "id" | "category_name">) => http<Expense>("/expenses/", { method: "POST", body: JSON.stringify(payload) }),
  updateExpense: (id: number, payload: Partial<Omit<Expense, "id" | "category_name">>) => http<Expense>(`/expenses/${id}/`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteExpense: (id: number) => http(`/expenses/${id}/`, { method: "DELETE" }),

  // Report
  reportSummary: () => http<any>("/reports/summary/"),

  // Third-party integration (via backend)
  exchangeLatest: (base: string) => http<any>(`/integrations/exchange/latest/?base=${encodeURIComponent(base)}`),
};
