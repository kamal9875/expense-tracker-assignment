"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ExchangePage() {
  const [base, setBase] = useState("USD");
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setData(null);
    try {
      const d = await api.exchangeLatest(base);
      setData(d);
    } catch (e: any) {
      setErr(e.message || "Failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h1>Third‑Party API Feature: Exchange Rates</h1>
        <p className="small">
          This page calls the backend endpoint <code>/api/integrations/exchange/latest/</code>,
          which fetches live data from an external API (<code>exchangerate.host</code>).
        </p>

        <div className="row" style={{ gap: 12 }}>
          <div style={{ minWidth: 220 }}>
            <div className="small">Base currency</div>
            <select value={base} onChange={(e) => setBase(e.target.value)}>
              {["USD", "INR", "EUR", "GBP", "AED"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={load}>Fetch latest</button>
        </div>

        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </div>

      {!data ? (
        <div className="card"><p className="small">Loading…</p></div>
      ) : (
        <div className="card">
          <h2>Rates (showing a few)</h2>
          <p className="small">Base: {data.base} | Date: {data.date}</p>
          <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {["INR","USD","EUR","GBP","AED","JPY","AUD","CAD"].map((k) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{data.rates?.[k] ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
