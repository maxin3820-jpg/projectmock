"use client";
import { useState, useRef } from "react";
import { useAdminData } from "@/lib/hooks/useAdmin";
import { useAdminStore } from "@/store/adminStore";

// ─── CSV Format ────────────────────────────────────────────────
// question, a, b, c, d, answer, subject, university
// "What is 2+2?","3","4","5","6","B","Mathematics","NED University"
// answer = A | B | C | D
// c and d are optional
// ───────────────────────────────────────────────────────────────

interface ParsedRow {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: string;      // "A" | "B" | "C" | "D"
  answerIndex: number; // 0-3
  subject: string;
  university: string;
  valid: boolean;
  error?: string;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const data = lines.slice(1).filter(l => l.trim());

  return data.map((line, idx) => {
    const cols: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQ = !inQ; continue; }
      if (c === "," && !inQ) { cols.push(cur.trim()); cur = ""; continue; }
      cur += c;
    }
    cols.push(cur.trim());

    const row = cols.map(c => c.replace(/^"|"$/g, "").trim());
    const [question = "", a = "", b = "", c = "", d = "", answerRaw = "", subject = "", university = ""] = row;

    const rowNum = idx + 2;

    if (!question) return { question, a, b, c, d, answer: "", answerIndex: -1, subject, university, valid: false, error: `Row ${rowNum}: question is empty` };
    if (!a || !b)  return { question, a, b, c, d, answer: "", answerIndex: -1, subject, university, valid: false, error: `Row ${rowNum}: options A and B are required` };

    const letter = answerRaw.trim().toUpperCase();
    const answerIndex = ["A","B","C","D"].indexOf(letter);
    if (answerIndex === -1) return { question, a, b, c, d, answer: letter, answerIndex: -1, subject, university, valid: false, error: `Row ${rowNum}: answer "${answerRaw}" must be A, B, C, or D` };

    const opts = [a, b, c, d];
    if (answerIndex >= 2 && !opts[answerIndex]) return { question, a, b, c, d, answer: letter, answerIndex: -1, subject, university, valid: false, error: `Row ${rowNum}: answer is ${letter} but option ${letter} is empty` };

    return { question, a, b, c, d, answer: letter, answerIndex, subject, university, valid: true };
  });
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  subjects: { id: string; name: string }[];
}

export default function CSVUpload({ onClose, onSuccess, subjects }: Props) {
  const { showToast, darkMode } = useAdminStore();
  const { createQuestion } = useAdminData();
  const fileRef = useRef<HTMLInputElement>(null);

  const [parsed, setParsed]           = useState<ParsedRow[]>([]);
  const [fileName, setFileName]       = useState("");
  const [uploading, setUploading]     = useState(false);
  const [progress, setProgress]       = useState(0);
  const [defaultSubjectId, setDSId]   = useState("");
  const [step, setStep]               = useState<"upload"|"preview"|"done">("upload");
  const [doneCount, setDoneCount]     = useState(0);

  const card     = darkMode ? "#1e293b" : "#fff";
  const bg       = darkMode ? "#0f172a" : "#f8fafc";
  const border   = darkMode ? "#334155" : "#e2e8f0";
  const text     = darkMode ? "#f1f5f9" : "#0f172a";
  const sub      = darkMode ? "#94a3b8" : "#64748b";
  const inputBg  = darkMode ? "#0f172a" : "#f8fafc";

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) { showToast("Only .csv files are accepted", "error"); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const rows = parseCSV(e.target?.result as string);
      setParsed(rows);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const downloadTemplate = () => {
    const csv = [
      "question,a,b,c,d,answer,subject,university",
      '"What is the value of π approximately?","3.14","2.71","1.41","1.73","A","Mathematics","NED University"',
      '"Which is Newton\'s second law?","F=mv","F=ma","F=m/a","F=a/m","B","Physics","NED University"',
      '"Chemical symbol for Gold?","Ag","Au","Fe","Cu","B","Chemistry","NED University"',
      '"What is 15 squared?","125","225","200","175","B","Mathematics","NED University"',
      '"Earth\'s most abundant gas?","Oxygen","Nitrogen","CO2","Hydrogen","B","Chemistry","NED University"',
    ].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "mcq_template.csv";
    a.click();
    showToast("Template downloaded", "info");
  };

  const handleImport = async () => {
    const valid = parsed.filter(r => r.valid);
    if (!valid.length) { showToast("No valid rows to import", "error"); return; }
    setUploading(true);
    setProgress(0);
    let success = 0;

    for (let i = 0; i < valid.length; i++) {
      const row = valid[i];
      const subjectId = defaultSubjectId
        || subjects.find(s => s.name.toLowerCase() === row.subject.toLowerCase())?.id
        || null;

      const opts = [row.a, row.b, row.c, row.d].filter(Boolean);
      const { error } = await createQuestion(
        {
          question_text: row.question,
          question_type: "mcq",
          difficulty: "medium",
          subject_id: subjectId,
          chapter_id: null, topic_id: null,
          explanation: null,
          tags: row.university ? [row.university] : [],
          is_active: true, created_by: null, image_url: null,
        },
        opts.map((opt, idx) => ({
          option_text: opt,
          is_correct: idx === row.answerIndex,
          sort_order: idx,
          question_id: "", image_url: null,
        }))
      );
      if (!error) success++;
      setProgress(Math.round(((i + 1) / valid.length) * 100));
    }

    setUploading(false);
    setDoneCount(success);
    setStep("done");
    if (success > 0) {
      showToast(`✓ ${success} question${success !== 1 ? "s" : ""} imported`, "success");
      onSuccess();
    } else {
      showToast("Import failed — check your data", "error");
    }
  };

  const validCount   = parsed.filter(r => r.valid).length;
  const invalidCount = parsed.filter(r => !r.valid).length;

  const COLS = ["#", "✓", "Question", "A", "B", "C", "D", "Ans", "Subject", "University"];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(4px)" }}>
      <div style={{ background:card, borderRadius:20, width:"100%", maxWidth:780, maxHeight:"92vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 25px 80px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div style={{ padding:"18px 24px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:text, margin:0 }}>📥 Bulk Upload MCQs</h2>
            <p style={{ fontSize:12, color:sub, marginTop:3 }}>Import questions from a CSV file</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:sub, fontSize:22, lineHeight:1, padding:4 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>

          {/* ── STEP 1: Upload ── */}
          {step === "upload" && (
            <>
              {/* Column guide */}
              <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:14, padding:"16px 18px", marginBottom:20 }}>
                <p style={{ fontSize:13, fontWeight:800, color:"#1d4ed8", marginBottom:12 }}>📋 Required Column Order</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8, marginBottom:14 }}>
                  {[
                    {col:"question", desc:"MCQ text"},
                    {col:"a",        desc:"Option A"},
                    {col:"b",        desc:"Option B"},
                    {col:"c",        desc:"Option C (optional)"},
                    {col:"d",        desc:"Option D (optional)"},
                    {col:"answer",   desc:"A / B / C / D"},
                    {col:"subject",  desc:"e.g. Mathematics"},
                    {col:"university", desc:"e.g. NED University"},
                  ].map(item => (
                    <div key={item.col} style={{ background:"#fff", borderRadius:8, padding:"8px 10px", border:"1px solid #bfdbfe" }}>
                      <code style={{ fontSize:12, fontWeight:800, color:"#1d4ed8", display:"block" }}>{item.col}</code>
                      <span style={{ fontSize:11, color:"#64748b" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
                <button onClick={downloadTemplate} style={{ padding:"7px 18px", borderRadius:8, background:"#1d4ed8", border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  ⬇ Download Sample CSV Template
                </button>
              </div>

              {/* Default subject override */}
              <div style={{ marginBottom:18 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:sub, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                  Override Subject (optional)
                </label>
                <select value={defaultSubjectId} onChange={e => setDSId(e.target.value)}
                  style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:`1.5px solid ${border}`, background:inputBg, color:text, fontSize:14, outline:"none" }}>
                  <option value="">Use subject column from CSV</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* Drop zone */}
              <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
                style={{ border:`2px dashed ${border}`, borderRadius:16, padding:"56px 24px", textAlign:"center", cursor:"pointer", background:inputBg, transition:"border-color 0.2s" }}>
                <div style={{ fontSize:52, marginBottom:12 }}>📂</div>
                <p style={{ fontSize:15, fontWeight:700, color:text, marginBottom:6 }}>Drop your CSV file here</p>
                <p style={{ fontSize:13, color:sub, marginBottom:4 }}>or click to browse</p>
                <p style={{ fontSize:11, color:sub }}>Only .csv files · Max 10,000 rows</p>
                <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
            </>
          )}

          {/* ── STEP 2: Preview ── */}
          {step === "preview" && (
            <>
              {/* Summary pills */}
              <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap" }}>
                {[
                  {label:"Total",   value:parsed.length,  bg:"#eff6ff", color:"#2563eb"},
                  {label:"Valid",   value:validCount,      bg:"#dcfce7", color:"#16a34a"},
                  {label:"Invalid", value:invalidCount,   bg: invalidCount>0?"#fee2e2":"#f1f5f9", color: invalidCount>0?"#dc2626":"#94a3b8"},
                ].map(s => (
                  <div key={s.label} style={{ background:s.bg, borderRadius:12, padding:"12px 20px", textAlign:"center", flex:1, minWidth:90 }}>
                    <div style={{ fontSize:26, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:s.color, marginTop:3 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize:12, color:sub, marginBottom:12 }}>📄 <strong style={{color:text}}>{fileName}</strong> — showing first 25 rows</p>

              {/* Table */}
              <div style={{ border:`1px solid ${border}`, borderRadius:12, overflow:"hidden", marginBottom:14 }}>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead>
                      <tr style={{ background:bg, borderBottom:`1px solid ${border}` }}>
                        {COLS.map(h => (
                          <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:700, color:sub, whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.slice(0, 25).map((row, i) => (
                        <tr key={i} style={{ borderBottom:`1px solid ${border}`, background:!row.valid?(darkMode?"#2d1515":"#fff5f5"):"transparent" }}>
                          <td style={{ padding:"7px 10px", color:sub }}>{i+1}</td>
                          <td style={{ padding:"7px 10px" }}>
                            <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:18, height:18, borderRadius:"50%", background:row.valid?"#dcfce7":"#fee2e2", fontSize:10, fontWeight:800, color:row.valid?"#16a34a":"#dc2626" }}>
                              {row.valid?"✓":"✕"}
                            </span>
                          </td>
                          <td style={{ padding:"7px 10px", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:row.valid?text:"#dc2626" }}>
                            {row.valid ? row.question : row.error}
                          </td>
                          {[row.a, row.b, row.c, row.d].map((opt, oi) => (
                            <td key={oi} style={{ padding:"7px 10px", color: row.answerIndex===oi?"#16a34a":sub, fontWeight: row.answerIndex===oi?800:400, maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {opt || <span style={{color:"#cbd5e1"}}>—</span>}
                            </td>
                          ))}
                          <td style={{ padding:"7px 10px" }}>
                            <span style={{ padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:800, background:"#dcfce7", color:"#16a34a" }}>
                              {row.answer || "?"}
                            </span>
                          </td>
                          <td style={{ padding:"7px 10px", color:sub, whiteSpace:"nowrap" }}>{row.subject||"—"}</td>
                          <td style={{ padding:"7px 10px", color:sub, whiteSpace:"nowrap" }}>{row.university||"—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsed.length > 25 && (
                  <div style={{ padding:"9px 12px", borderTop:`1px solid ${border}`, fontSize:12, color:sub, background:bg, textAlign:"center" }}>
                    Showing 25 of {parsed.length} rows
                  </div>
                )}
              </div>

              {invalidCount > 0 && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"10px 14px", marginBottom:8, fontSize:12, color:"#dc2626" }}>
                  ⚠ {invalidCount} invalid row{invalidCount>1?"s":""} will be skipped. {validCount} valid question{validCount!==1?"s":""} will be imported.
                </div>
              )}

              {/* Progress */}
              {uploading && (
                <div style={{ marginTop:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, color:sub }}>Importing questions...</span>
                    <span style={{ fontSize:13, fontWeight:700, color:text }}>{progress}%</span>
                  </div>
                  <div style={{ height:8, borderRadius:4, background:border, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#16a34a,#22c55e)", borderRadius:4, transition:"width 0.2s" }} />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── STEP 3: Done ── */}
          {step === "done" && (
            <div style={{ textAlign:"center", padding:"48px 24px" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
              <h3 style={{ fontSize:22, fontWeight:900, color:text, marginBottom:8 }}>Import Complete!</h3>
              <p style={{ color:sub, fontSize:15 }}>
                <strong style={{color:"#16a34a"}}>{doneCount} question{doneCount!==1?"s":""}</strong> added to the Question Bank.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 24px", borderTop:`1px solid ${border}`, display:"flex", gap:10, justifyContent:"flex-end", flexShrink:0 }}>
          {step === "upload" && (
            <button onClick={onClose} style={{ padding:"10px 20px", borderRadius:10, background:darkMode?"#334155":"#f1f5f9", border:"none", color:text, fontWeight:700, cursor:"pointer" }}>
              Cancel
            </button>
          )}
          {step === "preview" && (
            <>
              <button onClick={() => { setStep("upload"); setParsed([]); setFileName(""); }}
                style={{ padding:"10px 20px", borderRadius:10, background:darkMode?"#334155":"#f1f5f9", border:"none", color:text, fontWeight:700, cursor:"pointer" }}>
                ← Back
              </button>
              <button onClick={handleImport} disabled={uploading || validCount === 0}
                style={{ padding:"10px 28px", borderRadius:10, background:validCount>0?"#16a34a":"#94a3b8", border:"none", color:"#fff", fontWeight:800, fontSize:14, cursor:validCount>0?"pointer":"not-allowed" }}>
                {uploading ? `Importing... ${progress}%` : `⬆ Import ${validCount} Question${validCount!==1?"s":""}`}
              </button>
            </>
          )}
          {step === "done" && (
            <button onClick={onClose} style={{ padding:"10px 28px", borderRadius:10, background:"#16a34a", border:"none", color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer" }}>
              Done ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
