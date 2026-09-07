"use client";
import { useState } from "react";
import { ROLE_MAP } from "@/lib/roleMap";

const EXAMPLE = `CSC 3350 — Applied Data Systems
Topics: relational databases and SQL querying, Python for data cleaning and analysis, descriptive and inferential statistics, building dashboards for data visualization, and a final group project presenting findings to a non-technical audience (written report + oral presentation). Midterm covers Excel-based forecasting exercises.`;

type RoleResult = { role: string; matched: string[]; gap: string[]; pct: number };

export default function Home() {
  const [syllabus, setSyllabus] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [roles, setRoles] = useState<RoleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMap() {
    if (!syllabus.trim()) {
      setError("Paste a syllabus first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabus }),
      });
      const data = await res.json();
      if (!data.skills || !data.skills.length) {
        setError("Couldn't find clear skills in that text — try adding more detail.");
        setLoading(false);
        return;
      }
      setSkills(data.skills);
      setRoles(scoreRoles(data.skills));
    } catch (e) {
      setError("Something went wrong reading that syllabus. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function scoreRoles(found: string[]): RoleResult[] {
    return Object.entries(ROLE_MAP)
      .map(([role, roleSkills]) => {
        const matched = roleSkills.filter((s) => found.includes(s));
        const gap = roleSkills.filter((s) => !found.includes(s));
        return { role, matched, gap, pct: Math.round((matched.length / roleSkills.length) * 100) };
      })
      .filter((r) => r.matched.length > 0)
      .sort((a, b) => b.pct - a.pct || b.matched.length - a.matched.length)
      .slice(0, 4);
  }

  return (
    <div className="wrap">
      <div className="hero">
        <svg className="contours" viewBox="0 0 300 300">
          <g fill="none" stroke="#C79A54" strokeWidth="1">
            <ellipse cx="150" cy="150" rx="30" ry="22" opacity=".9" />
            <ellipse cx="150" cy="150" rx="60" ry="46" opacity=".7" />
            <ellipse cx="150" cy="150" rx="92" ry="72" opacity=".5" />
            <ellipse cx="150" cy="150" rx="126" ry="100" opacity=".35" />
            <ellipse cx="150" cy="150" rx="160" ry="130" opacity=".2" />
          </g>
        </svg>
        <p className="wordmark">Pathlyst</p>
        <h1>Turn your course into a career map.</h1>
        <p className="lede">Paste a syllabus. See which career paths it actually builds toward — and what's missing to get there.</p>
      </div>

      <div className="input-area">
        <label htmlFor="syllabus">Course syllabus or description</label>
        <textarea
          id="syllabus"
          placeholder="Paste your syllabus, topic list, or a summary of what the course covers..."
          value={syllabus}
          onChange={(e) => setSyllabus(e.target.value)}
        />
        <div className="row">
          <button className="primary" onClick={handleMap} disabled={loading}>
            {loading ? "Reading…" : "Map my skills"}
          </button>
          <button className="link-btn" onClick={() => setSyllabus(EXAMPLE)}>Try an example</button>
        </div>
        {error && <div className="status err">{error}</div>}
      </div>

      {roles.length > 0 && (
        <section className="results show">
          <h2>Skills found</h2>
          <div className="chips">
            {skills.map((s) => <span className="chip" key={s}>{s}</span>)}
          </div>

          <h2>Career paths this maps to</h2>
          {roles.map((r) => (
            <div className="role-card" key={r.role}>
              <div className="role-head">
                <span className="role-name">{r.role}</span>
                <span className="role-score">{r.pct}%</span>
              </div>
              <div className="bar"><div className="bar-fill" style={{ width: `${r.pct}%` }} /></div>
              <p className="matched"><span className="label">Covered</span>{r.matched.join(", ")}</p>
              {r.gap.length > 0 && (
                <p className="gap"><span className="label">To strengthen</span>{r.gap.join(", ")}</p>
              )}
            </div>
          ))}
        </section>
      )}

      <footer>Skill extraction runs live against your pasted text — nothing is stored.</footer>
    </div>
  );
}
