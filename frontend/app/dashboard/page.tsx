"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const d = await api.reportSummary();
      setData(d);
    } catch (e: any) {
      setErr(e.message || "Failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const byCategory = useMemo(() => (data?.by_category || []).map((r: any) => ({
    category: r.category,
    total: Number(r.total),
    count: Number(r.count),
  })), [data]);

  const monthly = useMemo(() => (data?.monthly || []).map((r: any) => ({
    month: (r.month || "").slice(0, 7),
    total: Number(r.total),
  })), [data]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h1>Dashboard (Reporting + Visualization)</h1>
        <p className="small">
          Charts are generated from database data via <code>/api/reports/summary/</code>. Add/update/delete expenses and refresh this page to see changes.
        </p>
        <div className="row">
          <button className="secondary" onClick={load}>Refresh</button>
        </div>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </div>

      {!data ? (
        <div className="card"><p className="small">Loading…</p></div>
      ) : (
        <>
          <div className="grid grid2">
            <div className="card">
              <h2>Summary</h2>
              <p><b>Total expenses:</b> {data.metrics.total_expenses}</p>
              <p><b>Total amount (raw):</b> {data.metrics.total_amount}</p>
              <p className="small">Tip: You can customize the report to convert totals into INR if you want.</p>
            </div>

            <div className="card">
              <h2>Category Breakdown (Total)</h2>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Monthly Trend (Total)</h2>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
