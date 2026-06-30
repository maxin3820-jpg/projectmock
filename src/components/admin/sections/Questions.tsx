"use client";
import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useAdminData } from "@/lib/hooks/useAdmin";

interface QuestionRow {
  id: string;
  question_text: string;
  question_type: string;
  difficulty: string;
  is_active: boolean;
  created_at: string;
  subjects: { name: string } | null;
  chapters: { name: string } | null;
  question_options: { id: string; option_text: string; is_correct: boolean; sort_order: number }[];
}

export default function Questions() {
  const { showToast, darkMode } = useAdminStore();
  const { getQuestions, createQuestion, updateQuestion, deleteQuestion, getSubjects } = useAdminData();

  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDiff, setFilterDiff] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{
    id?: string; question_text: string; question_type: string; difficulty: string;
    subject_id: string; chapter_id: string; explanation: string; tags: string;
    options: { text: string; is_correct: boolean }[];
  } | null>(null);

  const PER_PAGE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    const [qRes, sRes] = await Promise.all([
      getQuestions(page, PER_PAGE, search, filterSubject, filterDiff),
      getSubjects(),
    ]);
    setQuestions((qRes.data ?? []) as unknown as QuestionRow[]);
    setTotal(qRes.count ?? 0);
    setSubjects((sRes.data ?? []) as { id: string; name: string }[]);
    setLoading(false);
  }, [getQuestions, getSubjects, page, search, filterSubject, filterDiff]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); load(); }, 400); return () => clearTimeout(t); }, [search]); // eslint-disable-line

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";
  const totalPages = Math.ceil(total / PER_PAGE);
  const diffColor = (d: string) => d === "easy" ? { bg: "#dcfce7", text: "#16a34a" } : d === "medium" ? { bg: "#fef3c7", text: "#92400e" } : { bg: "#fee2e2", text: "#dc2626" };

  const blankModal = () => ({
    question_text: "", question_type: "mcq", difficulty: "medium",
    subject_id: "", chapter_id: "", explanation: "", tags: "",
    options: [{ text: "", is_correct: false }, { text: "", is_correct: false }, { text: "", is_correct: false }, { text: "", is_correct: false }],
  });

  const handleSave = async () => {
    if (!modal) return;
    const qData = {
      question_text: modal.question_text,
      question_type: modal.question_type as "mcq" | "multi_correct" | "true_false" | "image",
      difficulty: modal.difficulty as "easy" | "medium" | "hard",
      subject_id: modal.subject_id || null,
      chapter_id: modal.chapter_id || null,
      explanation: modal.explanation || null,
      tags: modal.tags ? modal.tags.split(",").map(t => t.trim()) : [],
      is_active: true,
      created_by: null, topic_id: null, image_url: null,
    };
    const opts = modal.options.filter(o => o.text).map((o, i) => ({
      option_text: o.text, is_correct: o.is_correct, sort_order: i,
      question_id: "", image_url: null,
    }));

    if (modal.id) {
      const { error } = await updateQuestion(modal.id, qData, opts);
      if (error) { showToast(error.message, "error"); return; }
      showToast("Question updated", "success");
    } else {
      const { error } = await createQuestion(qData, opts);
      if (error) { showToast(error.message, "error"); return; }
      showToast("Question added", "success");
    }
    setModal(null); load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteQuestion(id);
    if (error) showToast(error.message, "error");
    else { showToast("Deleted", "error"); load(); }
  };

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search questions..."
          style={{ flex: 1, minWidth: 180, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }} />
        <select value={filterSubject} onChange={e => { setFilterSubject(e.target.value); setPage(1); }}
          style={{ padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 13, outline: "none" }}>
          <option value="all">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterDiff} onChange={e => { setFilterDiff(e.target.value); setPage(1); }}
          style={{ padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 13, outline: "none" }}>
          <option value="all">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={() => setModal(blankModal())}
          style={{ padding: "9px 18px", borderRadius: 10, background: "#1e3a5f", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + Add Question
        </button>
      </div>

      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["#", "Question", "Subject", "Type", "Difficulty", "Options", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: sub, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}><div style={{ height: 14, background: darkMode ? "#334155" : "#f1f5f9", borderRadius: 4, width: j === 1 ? "80%" : "60%" }} /></td>
                    ))}
                  </tr>
                ))
              ) : questions.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: sub }}>No questions found</td></tr>
              ) : questions.map((q, i) => {
                const dc = diffColor(q.difficulty);
                return (
                  <tr key={q.id} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: sub }}>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td style={{ padding: "12px 16px", maxWidth: 260 }}>
                      <p style={{ fontSize: 13, color: text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.question_text}</p>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: sub, whiteSpace: "nowrap" }}>{q.subjects?.name ?? "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#eff6ff", color: "#2563eb" }}>{q.question_type}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: dc.bg, color: dc.text }}>{q.difficulty}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: sub }}>{q.question_options?.length ?? 0}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => setModal({
                          id: q.id, question_text: q.question_text, question_type: q.question_type,
                          difficulty: q.difficulty, subject_id: "", chapter_id: "", explanation: "",
                          tags: "", options: q.question_options?.map(o => ({ text: o.option_text, is_correct: o.is_correct })) ?? [],
                        })} style={{ padding: "5px 10px", borderRadius: 7, background: "#eff6ff", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handleDelete(q.id)} style={{ padding: "5px 10px", borderRadius: 7, background: "#fee2e2", border: "none", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <span style={{ fontSize: 13, color: sub }}>{total} questions</span>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${page === p ? "#2a5298" : border}`, background: page === p ? "#2a5298" : card, color: page === p ? "#fff" : text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{p}</button>
          ))}
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: card, borderRadius: 20, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 20 }}>{modal.id ? "Edit Question" : "Add Question"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Question Text</label>
                <textarea value={modal.question_text} onChange={e => setModal({ ...modal, question_text: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Type</label>
                  <select value={modal.question_type} onChange={e => setModal({ ...modal, question_type: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="mcq">MCQ</option>
                    <option value="multi_correct">Multi-Correct</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Subject</label>
                  <select value={modal.subject_id} onChange={e => setModal({ ...modal, subject_id: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="">Select</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Difficulty</label>
                  <select value={modal.difficulty} onChange={e => setModal({ ...modal, difficulty: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 8 }}>Options (✓ = correct)</label>
                {modal.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <input type="checkbox" checked={opt.is_correct} onChange={e => {
                      const opts = [...modal.options];
                      if (modal.question_type === "mcq") opts.forEach((o, j) => { o.is_correct = j === i && e.target.checked; });
                      else opts[i] = { ...opts[i], is_correct: e.target.checked };
                      setModal({ ...modal, options: opts });
                    }} style={{ width: 16, height: 16, flexShrink: 0 }} />
                    <input value={opt.text} onChange={e => {
                      const opts = [...modal.options];
                      opts[i] = { ...opts[i], text: e.target.value };
                      setModal({ ...modal, options: opts });
                    }} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 13, outline: "none" }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Explanation</label>
                <textarea value={modal.explanation} onChange={e => setModal({ ...modal, explanation: e.target.value })} rows={2}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Tags (comma-separated)</label>
                <input value={modal.tags} onChange={e => setModal({ ...modal, tags: e.target.value })} placeholder="algebra, calculus, important"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={handleSave} style={{ flex: 1, padding: 11, borderRadius: 10, background: "#1e3a5f", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {modal.id ? "Save" : "Add Question"}
              </button>
              <button onClick={() => setModal(null)} style={{ padding: "11px 20px", borderRadius: 10, background: darkMode ? "#334155" : "#f1f5f9", border: "none", color: text, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
