import React, { useState, useMemo } from "react";
import {
  LayoutGrid, Users, CalendarCheck, Wallet, MessageCircle, UserCog,
  BarChart3, Settings, Search, Plus, X, Check, ChevronRight, Clock,
  Wifi, WifiOff, Send, Printer, Edit3, Trash2, ShieldCheck, Bell,
  ArrowLeft, RefreshCcw
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS
   Ink       #1E1B16  chalkboard charcoal
   Chalk     #F7F3EA  chalk-dust paper
   Marigold  #E2963C  primary accent (brand)
   Martial   #8C3A2B  vertical: martial arts
   Sports    #2C6E63  vertical: sports academy
   ArtsMusic #6B3F72  vertical: dance / music
----------------------------------------------------------------*/
const V = {
  martial: { label: "Martial Arts", color: "#8C3A2B", bg: "#F5E6E1" },
  sports: { label: "Sports", color: "#2C6E63", bg: "#E1EEEA" },
  arts: { label: "Dance & Music", color: "#6B3F72", bg: "#EDE1EF" },
};

const initialStudents = [
  { id: "s1", name: "Arjun Prakash", vertical: "martial", batch: "b1", phone: "+91 90031 22110", joined: "2025-11-02", belt: "Green Belt", fee: "due", history: [{ date: "2026-06-01", note: "Promoted to Green Belt" }] },
  { id: "s2", name: "Divya Shree", vertical: "martial", batch: "b1", phone: "+91 90031 22111", joined: "2025-09-14", belt: "Blue Belt", fee: "paid", history: [{ date: "2026-05-10", note: "Promoted to Blue Belt" }] },
  { id: "s3", name: "Karthik Raja", vertical: "sports", batch: "b2", phone: "+91 90031 22112", joined: "2026-01-20", belt: "-", fee: "overdue", history: [] },
  { id: "s4", name: "Meena Iyappan", vertical: "sports", batch: "b2", phone: "+91 90031 22113", joined: "2025-12-05", belt: "-", fee: "paid", history: [] },
  { id: "s5", name: "Sanjay Kumar", vertical: "arts", batch: "b3", phone: "+91 90031 22114", joined: "2026-02-18", belt: "Grade 3", fee: "due", history: [{ date: "2026-04-02", note: "Cleared Grade 2 exam" }] },
  { id: "s6", name: "Priya Dharshini", vertical: "arts", batch: "b3", phone: "+91 90031 22115", joined: "2025-08-30", belt: "Grade 5", fee: "paid", history: [] },
];

const initialBatches = [
  { id: "b1", name: "Silambam — Evening Batch", vertical: "martial", coach: "c1", schedule: "Mon/Wed/Fri · 5:30–6:30 PM", students: ["s1", "s2"] },
  { id: "b2", name: "Cricket Foundation — U14", vertical: "sports", coach: "c2", schedule: "Tue/Thu/Sat · 6:00–7:30 AM", students: ["s3", "s4"] },
  { id: "b3", name: "Bharatanatyam — Beginners", vertical: "arts", coach: "c3", schedule: "Sat/Sun · 4:00–5:30 PM", students: ["s5", "s6"] },
];

const initialCoaches = [
  { id: "c1", name: "Master Ravindran", phone: "+91 94433 10201", role: "Coach", batches: ["b1"] },
  { id: "c2", name: "Coach Selvam", phone: "+91 94433 10202", role: "Coach", batches: ["b2"] },
  { id: "c3", name: "Kalaimagal Akka", phone: "+91 94433 10203", role: "Coach", batches: ["b3"] },
  { id: "c4", name: "Divya Ramesh", phone: "+91 94433 10204", role: "Assistant", batches: [] },
];

const initialPayments = [
  { id: "p1", studentId: "s1", amount: 1200, due: "2026-07-20", status: "due", method: "-", receipt: null },
  { id: "p2", studentId: "s2", amount: 1200, due: "2026-07-10", status: "paid", method: "UPI", receipt: "RCPT-1042" },
  { id: "p3", studentId: "s3", amount: 900, due: "2026-07-05", status: "overdue", method: "-", receipt: null },
  { id: "p4", studentId: "s4", amount: 900, due: "2026-07-10", status: "paid", method: "Razorpay", receipt: "RCPT-1043" },
  { id: "p5", studentId: "s5", amount: 1000, due: "2026-07-22", status: "due", method: "-", receipt: null },
  { id: "p6", studentId: "s6", amount: 1000, due: "2026-07-08", status: "paid", method: "Cash", receipt: "RCPT-1041" },
];

const initialReminders = [
  { id: "r1", type: "payment_due", studentId: "s1", sentAt: "2026-07-20 09:02", status: "Delivered" },
  { id: "r2", type: "payment_due", studentId: "s3", sentAt: "2026-07-05 09:00", status: "Delivered" },
  { id: "r3", type: "escalation", studentId: "s3", sentAt: "2026-07-08 09:00", status: "Delivered" },
  { id: "r4", type: "absent_alert", studentId: "s2", sentAt: "2026-07-21 18:41", status: "Read" },
];

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "students", label: "Students", icon: Users },
  { id: "batches", label: "Batches", icon: ShieldCheck },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "reminders", label: "WhatsApp Log", icon: MessageCircle },
  { id: "coaches", label: "Coaches & Roles", icon: UserCog },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

function Badge({ vertical }) {
  const v = V[vertical];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: v.bg, color: v.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: v.color }} />
      {v.label}
    </span>
  );
}

function FeeChip({ status }) {
  const map = {
    paid: { bg: "#E1EEEA", color: "#2C6E63", label: "Paid" },
    due: { bg: "#F5E9D6", color: "#9C6A20", label: "Due" },
    overdue: { bg: "#F5E1DE", color: "#8C3A2B", label: "Overdue" },
  };
  const s = map[status];
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-200 ${className}`}>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`bg-white rounded-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[85vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 sticky top-0 bg-white">
          <h3 className="font-bold text-stone-900" style={{ fontFamily: "'Sora',sans-serif" }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [students, setStudents] = useState(initialStudents);
  const [batches, setBatches] = useState(initialBatches);
  const [coaches, setCoaches] = useState(initialCoaches);
  const [payments, setPayments] = useState(initialPayments);
  const [reminders, setReminders] = useState(initialReminders);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showInviteCoach, setShowInviteCoach] = useState(false);
  const [showReceipt, setShowReceipt] = useState(null);
  const [attendanceBatch, setAttendanceBatch] = useState(initialBatches[0].id);
  const [attendanceMarks, setAttendanceMarks] = useState({});
  const [syncState, setSyncState] = useState("synced"); // synced | pending | syncing
  const [broadcastText, setBroadcastText] = useState("");
  const [search, setSearch] = useState("");

  const studentById = (id) => students.find((s) => s.id === id);
  const batchById = (id) => batches.find((b) => b.id === id);
  const coachById = (id) => coaches.find((c) => c.id === id);

  const kpis = useMemo(() => {
    const totalStudents = students.length;
    const overdue = payments.filter((p) => p.status === "overdue").length;
    const revenueThisMonth = payments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
    const totalBatches = batches.length;
    return { totalStudents, overdue, revenueThisMonth, totalBatches };
  }, [students, payments, batches]);

  function markAttendance(studentId, present) {
    setAttendanceMarks((prev) => ({ ...prev, [studentId]: present }));
    setSyncState("pending");
    setTimeout(() => setSyncState("syncing"), 300);
    setTimeout(() => {
      setSyncState("synced");
      if (!present) {
        const st = studentById(studentId);
        setReminders((r) => [
          { id: "r" + Date.now(), type: "absent_alert", studentId, sentAt: "just now", status: "Sent" },
          ...r,
        ]);
      }
    }, 1100);
  }

  function markPaid(paymentId, method) {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? { ...p, status: "paid", method, receipt: "RCPT-" + Math.floor(1050 + Math.random() * 900) }
          : p
      )
    );
  }

  function sendReminder(studentId, type) {
    setReminders((r) => [
      { id: "r" + Date.now(), type, studentId, sentAt: "just now", status: "Sent" },
      ...r,
    ]);
  }

  function sendBroadcast() {
    if (!broadcastText.trim()) return;
    setReminders((r) => [
      { id: "r" + Date.now(), type: "broadcast", studentId: null, sentAt: "just now", status: "Sent to all parents", text: broadcastText },
      ...r,
    ]);
    setBroadcastText("");
  }

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F7F3EA]" style={{ fontFamily: "'Inter',sans-serif" }}>

      {/* SIDEBAR */}
      <aside className="w-60 shrink-0 bg-[#1E1B16] text-[#F7F3EA] flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: "#E2963C", color: "#1E1B16" }}>M&</div>
          <div>
            <div className="font-bold text-sm leading-tight" style={{ fontFamily: "'Sora',sans-serif" }}>Me & Coach</div>
            <div className="text-[11px] text-white/50">Sri Balamurugan Academy</div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => { setView(n.id); setSelectedStudent(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} style={{ color: active ? "#E2963C" : undefined }} />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 text-[11px] text-white/40">
          Prototype — Me & Coach MVP<br />mock data, no live backend
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div className="p-8">
            <h1 className="text-2xl font-extrabold text-stone-900" style={{ fontFamily: "'Sora',sans-serif" }}>Vanakkam, Coach 👋</h1>
            <p className="text-stone-500 text-sm mt-1">Here's how Sri Balamurugan Academy is doing today.</p>

            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { label: "Active Students", value: kpis.totalStudents, color: "#2C6E63" },
                { label: "Batches Running", value: kpis.totalBatches, color: "#6B3F72" },
                { label: "Overdue Payments", value: kpis.overdue, color: "#8C3A2B" },
                { label: "Revenue Collected", value: "₹" + kpis.revenueThisMonth.toLocaleString("en-IN"), color: "#9C6A20" },
              ].map((k) => (
                <Card key={k.label} className="p-5">
                  <div className="text-xs font-bold uppercase tracking-wide text-stone-400">{k.label}</div>
                  <div className="text-3xl font-extrabold mt-2" style={{ color: k.color, fontFamily: "'Sora',sans-serif" }}>{k.value}</div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5 mt-6">
              <Card className="p-5">
                <div className="font-bold text-stone-900 mb-3">Today's Batches</div>
                <div className="space-y-2.5">
                  {batches.map((b) => (
                    <div key={b.id} className="flex items-center justify-between border border-stone-100 rounded-xl px-3 py-2.5">
                      <div>
                        <div className="text-sm font-semibold text-stone-800">{b.name}</div>
                        <div className="text-xs text-stone-500">{b.schedule}</div>
                      </div>
                      <Badge vertical={b.vertical} />
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <div className="font-bold text-stone-900 mb-3">Needs Attention</div>
                <div className="space-y-2.5">
                  {payments.filter((p) => p.status !== "paid").map((p) => {
                    const st = studentById(p.studentId);
                    return (
                      <div key={p.id} className="flex items-center justify-between border border-stone-100 rounded-xl px-3 py-2.5">
                        <div>
                          <div className="text-sm font-semibold text-stone-800">{st.name}</div>
                          <div className="text-xs text-stone-500">₹{p.amount} · due {p.due}</div>
                        </div>
                        <FeeChip status={p.status} />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* STUDENTS LIST / DETAIL */}
        {view === "students" && !selectedStudent && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-extrabold text-stone-900" style={{ fontFamily: "'Sora',sans-serif" }}>Students</h1>
              <button onClick={() => setShowAddStudent(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ background: "#E2963C" }}>
                <Plus size={16} /> Add Student
              </button>
            </div>
            <div className="relative mb-4 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className={inputCls + " pl-8"} />
            </div>
            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-100">
                    <th className="py-3 px-5">Name</th>
                    <th className="py-3 px-5">Vertical</th>
                    <th className="py-3 px-5">Batch</th>
                    <th className="py-3 px-5">Level</th>
                    <th className="py-3 px-5">Fee</th>
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50 cursor-pointer" onClick={() => setSelectedStudent(s.id)}>
                      <td className="py-3 px-5 font-semibold text-stone-800">{s.name}</td>
                      <td className="py-3 px-5"><Badge vertical={s.vertical} /></td>
                      <td className="py-3 px-5 text-stone-600">{batchById(s.batch)?.name}</td>
                      <td className="py-3 px-5 text-stone-600">{s.belt}</td>
                      <td className="py-3 px-5"><FeeChip status={s.fee} /></td>
                      <td className="py-3 px-5"><ChevronRight size={16} className="text-stone-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {view === "students" && selectedStudent && (() => {
          const s = studentById(selectedStudent);
          const p = payments.find((p) => p.studentId === s.id);
          return (
            <div className="p-8 max-w-3xl">
              <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-4">
                <ArrowLeft size={15} /> Back to Students
              </button>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-stone-900" style={{ fontFamily: "'Sora',sans-serif" }}>{s.name}</h1>
                  <div className="flex items-center gap-2 mt-2"><Badge vertical={s.vertical} /><FeeChip status={s.fee} /></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-6">
                <Card className="p-5">
                  <div className="font-bold text-stone-900 mb-3 text-sm">Profile</div>
                  <div className="text-sm space-y-2 text-stone-600">
                    <div><span className="text-stone-400">Phone:</span> {s.phone}</div>
                    <div><span className="text-stone-400">Batch:</span> {batchById(s.batch)?.name}</div>
                    <div><span className="text-stone-400">Joined:</span> {s.joined}</div>
                    <div><span className="text-stone-400">Level:</span> {s.belt}</div>
                  </div>
                </Card>
                <Card className="p-5">
                  <div className="font-bold text-stone-900 mb-3 text-sm">Fee Plan</div>
                  {p && (
                    <div className="text-sm space-y-2 text-stone-600">
                      <div><span className="text-stone-400">Amount:</span> ₹{p.amount} / month</div>
                      <div><span className="text-stone-400">Due:</span> {p.due}</div>
                      <div><span className="text-stone-400">Status:</span> <FeeChip status={p.status} /></div>
                      {p.status !== "paid" && (
                        <button onClick={() => markPaid(p.id, "Cash")} className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "#2C6E63" }}>
                          Mark Paid (Cash)
                        </button>
                      )}
                    </div>
                  )}
                </Card>
              </div>

              <Card className="p-5 mt-5">
                <div className="font-bold text-stone-900 mb-3 text-sm">Progress History</div>
                {s.history.length === 0 && <div className="text-sm text-stone-400">No progress entries logged yet.</div>}
                <div className="space-y-2">
                  {s.history.map((h, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="font-mono text-xs text-stone-400 pt-0.5" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{h.date}</span>
                      <span className="text-stone-700">{h.note}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          );
        })()}

        {/* BATCHES */}
        {view === "batches" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-extrabold text-stone-900" style={{ fontFamily: "'Sora',sans-serif" }}>Batches</h1>
              <button onClick={() => setShowAddBatch(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ background: "#E2963C" }}>
                <Plus size={16} /> New Batch
              </button>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {batches.map((b) => (
                <Card key={b.id} className="p-5">
                  <Badge vertical={b.vertical} />
                  <div className="font-bold text-stone-900 mt-2.5">{b.name}</div>
                  <div className="text-xs text-stone-500 mt-1">{b.schedule}</div>
                  <div className="text-xs text-stone-500 mt-1">Coach: {coachById(b.coach)?.name}</div>
                  <div className="text-xs text-stone-500 mt-1">{b.students.length} students</div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex items-center gap-1 text-xs font-semibold text-stone-600 border border-stone-200 rounded-lg px-2.5 py-1.5 hover:bg-stone-50"><Edit3 size={12} /> Edit</button>
                    <button
                      disabled={b.students.length > 0}
                      title={b.students.length > 0 ? "Reassign students before deleting" : "Delete batch"}
                      className="flex items-center gap-1 text-xs font-semibold text-red-500 border border-red-200 rounded-lg px-2.5 py-1.5 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {view === "attendance" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-extrabold text-stone-900" style={{ fontFamily: "'Sora',sans-serif" }}>Attendance</h1>
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full" style={{
                background: syncState === "synced" ? "#E1EEEA" : "#F5E9D6",
                color: syncState === "synced" ? "#2C6E63" : "#9C6A20",
              }}>
                {syncState === "synced" ? <Wifi size={13} /> : <RefreshCcw size={13} className="animate-spin" />}
                {syncState === "synced" ? "Synced" : syncState === "syncing" ? "Syncing…" : "Queued (offline)"}
              </div>
            </div>

            <div className="flex gap-2 mb-5">
              {batches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setAttendanceBatch(b.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold border ${
                    attendanceBatch === b.id ? "text-white border-transparent" : "border-stone-200 text-stone-600 bg-white"
                  }`}
                  style={attendanceBatch === b.id ? { background: V[b.vertical].color } : {}}
                >
                  {b.name}
                </button>
              ))}
            </div>

            <Card className="p-5">
              <div className="text-xs text-stone-400 mb-3 flex items-center gap-1.5"><Clock size={13} /> Editable until end of day · locked after rollover for coaches</div>
              <div className="space-y-2">
                {batchById(attendanceBatch).students.map((sid) => {
                  const s = studentById(sid);
                  const mark = attendanceMarks[sid];
                  return (
                    <div key={sid} className="flex items-center justify-between border border-stone-100 rounded-xl px-4 py-3">
                      <div className="font-semibold text-stone-800 text-sm">{s.name}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => markAttendance(sid, true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${mark === true ? "text-white" : "border border-stone-200 text-stone-500"}`}
                          style={mark === true ? { background: "#2C6E63" } : {}}
                        ><Check size={13} /> Present</button>
                        <button
                          onClick={() => markAttendance(sid, false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${mark === false ? "text-white" : "border border-stone-200 text-stone-500"}`}
                          style={mark === false ? { background: "#8C3A2B" } : {}}
                        ><X size={13} /> Absent</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* PAYMENTS */}
        {view === "payments" && (
          <div className="p-8">
            <h1 className="text-2xl font-extrabold text-stone-900 mb-5" style={{ fontFamily: "'Sora',sans-serif" }}>Payments</h1>
            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-100">
                    <th className="py-3 px-5">Student</th>
                    <th className="py-3 px-5">Amount</th>
                    <th className="py-3 px-5">Due</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Method</th>
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const s = studentById(p.studentId);
                    return (
                      <tr key={p.id} className="border-b border-stone-50 last:border-0">
                        <td className="py-3 px-5 font-semibold text-stone-800">{s.name}</td>
                        <td className="py-3 px-5 text-stone-600">₹{p.amount}</td>
                        <td className="py-3 px-5 text-stone-600">{p.due}</td>
                        <td className="py-3 px-5"><FeeChip status={p.status} /></td>
                        <td className="py-3 px-5 text-stone-600">{p.method}</td>
                        <td className="py-3 px-5">
                          {p.status !== "paid" ? (
                            <div className="flex gap-1.5">
                              <button onClick={() => markPaid(p.id, "Cash")} className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-white" style={{ background: "#2C6E63" }}>Cash</button>
                              <button onClick={() => markPaid(p.id, "UPI")} className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600">UPI</button>
                            </div>
                          ) : (
                            <button onClick={() => setShowReceipt(p.id)} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600">
                              <Printer size={12} /> {p.receipt}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* REMINDERS / WHATSAPP LOG */}
        {view === "reminders" && (
          <div className="p-8">
            <h1 className="text-2xl font-extrabold text-stone-900 mb-5" style={{ fontFamily: "'Sora',sans-serif" }}>WhatsApp Log</h1>

            <Card className="p-5 mb-5">
              <div className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5"><Send size={14} /> Broadcast to Parents</div>
              <textarea value={broadcastText} onChange={(e) => setBroadcastText(e.target.value)} rows={2} placeholder="e.g. Tomorrow's class is rescheduled to 6 PM…" className={inputCls} />
              <button onClick={sendBroadcast} className="mt-2 text-xs font-bold px-3.5 py-2 rounded-lg text-white" style={{ background: "#E2963C" }}>Send Broadcast</button>
            </Card>

            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-100">
                    <th className="py-3 px-5">Type</th>
                    <th className="py-3 px-5">To</th>
                    <th className="py-3 px-5">Sent</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.map((r) => (
                    <tr key={r.id} className="border-b border-stone-50 last:border-0">
                      <td className="py-3 px-5 font-semibold text-stone-800 capitalize">{r.type.replace("_", " ")}</td>
                      <td className="py-3 px-5 text-stone-600">{r.studentId ? studentById(r.studentId)?.name : "All Parents"}</td>
                      <td className="py-3 px-5 text-stone-500 font-mono text-xs" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{r.sentAt}</td>
                      <td className="py-3 px-5"><span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#E1EEEA", color: "#2C6E63" }}>{r.status}</span></td>
                      <td className="py-3 px-5">
                        {r.studentId && (
                          <button onClick={() => sendReminder(r.studentId, r.type)} className="text-xs font-semibold text-stone-500 hover:text-stone-800">Resend</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* COACHES & ROLES */}
        {view === "coaches" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-extrabold text-stone-900" style={{ fontFamily: "'Sora',sans-serif" }}>Coaches &amp; Roles</h1>
              <button onClick={() => setShowInviteCoach(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ background: "#E2963C" }}>
                <Plus size={16} /> Invite via Phone OTP
              </button>
            </div>
            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-100">
                    <th className="py-3 px-5">Name</th>
                    <th className="py-3 px-5">Phone</th>
                    <th className="py-3 px-5">Role</th>
                    <th className="py-3 px-5">Batches</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((c) => (
                    <tr key={c.id} className="border-b border-stone-50 last:border-0">
                      <td className="py-3 px-5 font-semibold text-stone-800">{c.name}</td>
                      <td className="py-3 px-5 text-stone-600 font-mono text-xs" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{c.phone}</td>
                      <td className="py-3 px-5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                          background: c.role === "Owner" ? "#EDE1EF" : c.role === "Assistant" ? "#E1EEEA" : "#F5E9D6",
                          color: c.role === "Owner" ? "#6B3F72" : c.role === "Assistant" ? "#2C6E63" : "#9C6A20",
                        }}>{c.role}</span>
                      </td>
                      <td className="py-3 px-5 text-stone-600">{c.batches.map((bid) => batchById(bid)?.name).join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* REPORTS */}
        {view === "reports" && (
          <div className="p-8">
            <h1 className="text-2xl font-extrabold text-stone-900 mb-5" style={{ fontFamily: "'Sora',sans-serif" }}>Reports</h1>
            <div className="grid grid-cols-3 gap-5">
              {Object.entries(V).map(([key, v]) => {
                const vStudents = students.filter((s) => s.vertical === key);
                const vRevenue = payments.filter((p) => vStudents.some((s) => s.id === p.studentId) && p.status === "paid").reduce((a, p) => a + p.amount, 0);
                return (
                  <Card key={key} className="p-5">
                    <Badge vertical={key} />
                    <div className="text-2xl font-extrabold mt-3" style={{ color: v.color, fontFamily: "'Sora',sans-serif" }}>{vStudents.length} students</div>
                    <div className="text-sm text-stone-500 mt-1">₹{vRevenue.toLocaleString("en-IN")} collected</div>
                  </Card>
                );
              })}
            </div>
            <Card className="p-5 mt-5">
              <div className="font-bold text-stone-900 text-sm mb-3">Overall</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-stone-400 block text-xs">Total Revenue</span><span className="font-bold text-stone-800 text-lg">₹{kpis.revenueThisMonth.toLocaleString("en-IN")}</span></div>
                <div><span className="text-stone-400 block text-xs">Overdue Accounts</span><span className="font-bold text-stone-800 text-lg">{kpis.overdue}</span></div>
                <div><span className="text-stone-400 block text-xs">Attendance Today</span><span className="font-bold text-stone-800 text-lg">{Object.values(attendanceMarks).filter(Boolean).length}/{Object.values(attendanceMarks).length || "—"}</span></div>
              </div>
            </Card>
          </div>
        )}

        {/* SETTINGS */}
        {view === "settings" && (
          <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-extrabold text-stone-900 mb-5" style={{ fontFamily: "'Sora',sans-serif" }}>Academy Settings</h1>
            <Card className="p-5">
              <Field label="Academy Name"><input defaultValue="Sri Balamurugan Academy" className={inputCls} /></Field>
              <Field label="Verticals Active">
                <div className="flex gap-2">{Object.keys(V).map((k) => <Badge key={k} vertical={k} />)}</div>
              </Field>
              <Field label="Contact Phone"><input defaultValue="+91 95979 11062" className={inputCls} /></Field>
              <button className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ background: "#E2963C" }}>Save Changes</button>
            </Card>
          </div>
        )}
      </main>

      {/* MODALS */}
      {showAddStudent && (
        <Modal title="Add Student" onClose={() => setShowAddStudent(false)}>
          <Field label="Full Name"><input className={inputCls} placeholder="Student name" /></Field>
          <Field label="Vertical">
            <select className={inputCls}>{Object.entries(V).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          </Field>
          <Field label="Batch">
            <select className={inputCls}>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          </Field>
          <Field label="Phone (Parent)"><input className={inputCls} placeholder="+91" /></Field>
          <button onClick={() => setShowAddStudent(false)} className="w-full text-sm font-bold px-4 py-2.5 rounded-lg text-white mt-2" style={{ background: "#E2963C" }}>Add Student</button>
        </Modal>
      )}

      {showAddBatch && (
        <Modal title="New Batch" onClose={() => setShowAddBatch(false)}>
          <Field label="Batch Name"><input className={inputCls} placeholder="e.g. Karate — Kids Batch" /></Field>
          <Field label="Vertical">
            <select className={inputCls}>{Object.entries(V).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          </Field>
          <Field label="Coach">
            <select className={inputCls}>{coaches.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </Field>
          <Field label="Schedule"><input className={inputCls} placeholder="e.g. Mon/Wed/Fri · 5:00–6:00 PM" /></Field>
          <button onClick={() => setShowAddBatch(false)} className="w-full text-sm font-bold px-4 py-2.5 rounded-lg text-white mt-2" style={{ background: "#E2963C" }}>Create Batch</button>
        </Modal>
      )}

      {showInviteCoach && (
        <Modal title="Invite Coach / Assistant" onClose={() => setShowInviteCoach(false)}>
          <Field label="Phone Number"><input className={inputCls} placeholder="+91" /></Field>
          <Field label="Role">
            <select className={inputCls}><option>Coach</option><option>Assistant</option></select>
          </Field>
          <p className="text-xs text-stone-500 mb-3">An OTP invite link will be sent via WhatsApp/SMS. They set up access on first login.</p>
          <button onClick={() => setShowInviteCoach(false)} className="w-full text-sm font-bold px-4 py-2.5 rounded-lg text-white" style={{ background: "#E2963C" }}>Send Invite</button>
        </Modal>
      )}

      {showReceipt && (() => {
        const p = payments.find((p) => p.id === showReceipt);
        const s = studentById(p.studentId);
        return (
          <Modal title="Receipt" onClose={() => setShowReceipt(null)}>
            <div className="border border-stone-200 rounded-xl p-5 font-mono text-sm" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
              <div className="text-center font-bold mb-3" style={{ fontFamily: "'Sora',sans-serif" }}>Sri Balamurugan Academy</div>
              <div className="flex justify-between border-b border-dashed border-stone-300 pb-2 mb-2"><span>Receipt No.</span><span>{p.receipt}</span></div>
              <div className="flex justify-between"><span>Student</span><span>{s.name}</span></div>
              <div className="flex justify-between"><span>Amount</span><span>₹{p.amount}</span></div>
              <div className="flex justify-between"><span>Method</span><span>{p.method}</span></div>
              <div className="flex justify-between"><span>Date</span><span>{p.due}</span></div>
            </div>
            <button className="w-full mt-4 text-sm font-bold px-4 py-2.5 rounded-lg text-white flex items-center justify-center gap-2" style={{ background: "#E2963C" }}>
              <Printer size={15} /> Print
            </button>
          </Modal>
        );
      })()}
    </div>
  );
}
