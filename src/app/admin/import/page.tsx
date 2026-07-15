"use client";

import { useState } from "react";

type VariantRow = { name: string; exShowroom: number; fuelType: string; transmission: string };
type PreviewItem = { carSlug: string; carName: string; variants: VariantRow[] };

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewItem[] | null>(null);
  const [results, setResults] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleParse() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setPreview(null);
    setResults(null);
    const fd = new FormData();
    fd.append("pdf", file);
    fd.append("apply", "false");
    const res = await fetch("/api/import-pdf", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Unknown error"); return; }
    setPreview(data.preview);
  }

  async function handleApply() {
    if (!file) return;
    setLoading(true);
    setError(null);
    const fd = new FormData();
    fd.append("pdf", file);
    fd.append("apply", "true");
    const res = await fetch("/api/import-pdf", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Unknown error"); return; }
    setResults(data.results);
    setPreview(null);
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Import Price List PDF</h1>
      <p className="text-sm text-gray-500">
        Upload a Maruti Suzuki NEXA price list PDF. Gemini AI will extract variant prices.
        Review the preview before applying changes to Sanity.
      </p>

      <div className="space-y-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); setPreview(null); setResults(null); }}
          className="block w-full text-sm border rounded p-2"
        />
        <button
          onClick={handleParse}
          disabled={!file || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Parsing…" : "Parse PDF"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {preview && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preview — {preview.length} car(s) found</h2>
          {preview.map((item) => (
            <div key={item.carSlug} className="border rounded p-4 space-y-2">
              <p className="font-medium">{item.carName} <span className="text-gray-400 text-xs">({item.carSlug})</span></p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pr-4">Variant</th>
                    <th className="pr-4">Ex-Showroom</th>
                    <th className="pr-4">Fuel</th>
                    <th>Transmission</th>
                  </tr>
                </thead>
                <tbody>
                  {item.variants.map((v, i) => (
                    <tr key={i} className="border-t">
                      <td className="pr-4 py-1">{v.name}</td>
                      <td className="pr-4">₹{v.exShowroom.toLocaleString("en-IN")}</td>
                      <td className="pr-4">{v.fuelType}</td>
                      <td>{v.transmission}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <button
            onClick={handleApply}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Applying…" : "Apply to Sanity"}
          </button>
        </div>
      )}

      {results && (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Done</h2>
          {results.map((r, i) => (
            <p key={i} className={`text-sm ${r.startsWith("OK") ? "text-green-700" : "text-yellow-700"}`}>{r}</p>
          ))}
        </div>
      )}
    </main>
  );
}
