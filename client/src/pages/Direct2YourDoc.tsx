/**
 * Direct2YourDoc — Prototype Page
 * Route: /direct2yourdoc
 *
 * Design: Luxury private medical office — walnut, fireplace, parchment, brass, warm lighting.
 * NOT hospital-blue SaaS. NOT telehealth generic. A private virtual doctor's office.
 *
 * Brand hierarchy:
 *   Direct2YourDoc       = patient-facing brand / app / front door
 *   The KeepMore Company = parent venture / owner (Nate Sillyman)
 *   Dr. Andrew Heslin    = founding physician (provider, not owner)
 *
 * All sections are prototype / coming-soon — do not claim app is live.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  FileText,
  Users,
  Calendar,
  AlertCircle,
  ChevronRight,
  Check,
  X,
  Headphones,
  Smartphone,
  Heart,
  Pill,
  Stethoscope,
  ClipboardList,
  Phone,
  Mail,
  User,
  MapPin,
  ArrowRight,
} from "lucide-react";

// ─── CDN image URLs (already uploaded) ───────────────────────────────────────
const IMG_HERO_POSTER = "/manus-storage/d2yd-hero-poster_0bcac802.png";
const IMG_WAITING_ROOM = "/manus-storage/d2yd-waiting-room_1f40a156.png";
const IMG_PATIENT_CMD = "/manus-storage/d2yd-patient-command_714f0b2d.png";
// Brand logos
const LOGO_D2YD = "/brand/direct2yourdoc-logo-light.png"; // Direct2YourDoc crest (light, for dark bg)
const KEEPMORE_MARK = "/brand/keepmore-km.svg"; // KeepMore co-brand mark (gold KM)

// ─── Fade-up animation variant ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1 },
  }),
};

// ─── Appointment Ledger Data ──────────────────────────────────────────────────
const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
const DAYS = ["Mon 7", "Tue 8", "Wed 9", "Thu 10", "Fri 11"];
const BOOKED: Record<string, boolean> = {
  "Mon 7-8:00 AM": true,
  "Mon 7-10:00 AM": true,
  "Tue 8-9:00 AM": true,
  "Wed 9-2:00 PM": true,
  "Thu 10-11:00 AM": true,
  "Fri 11-3:00 PM": true,
};

// ─── Patient Command File Items ───────────────────────────────────────────────
const COMMAND_ITEMS = [
  { icon: FileText, label: "Medical Records", desc: "Complete history, diagnoses, discharge summaries", status: "3 documents" },
  { icon: Pill, label: "Medications", desc: "Current prescriptions, dosages, refill schedule", status: "4 active" },
  { icon: Stethoscope, label: "Scans & Imaging", desc: "CT, MRI, X-ray, Ultrasound", status: "2 recent" },
  { icon: ClipboardList, label: "Lab Results", desc: "Bloodwork & diagnostics", status: "Updated 3d ago" },
  { icon: Calendar, label: "Upcoming Care", desc: "Appointments & follow-ups", status: "Next: Mon" },
  { icon: AlertCircle, label: "Emergency Plan", desc: "Protocols, contacts, allergies", status: "On file" },
  { icon: Users, label: "Second Opinions", desc: "Specialist reviews & case summaries", status: "1 pending" },
];

export default function Direct2YourDoc() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", city: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSlotClick = (key: string) => {
    if (BOOKED[key]) return;
    setSelectedSlot(prev => (prev === key ? null : key));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: "#0d1c20",
        color: "#cce2dd",
      }}
    >
      {/* ── Minimal top bar ─────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "linear-gradient(to bottom, rgba(13,28,31,0.95) 0%, transparent 100%)" }}
      >
        <div className="flex items-center gap-3">
          <img
            src={LOGO_D2YD}
            alt="Direct2YourDoc"
            style={{ height: "52px", width: "auto", objectFit: "contain" }}
          />
        </div>
        <a
          href="#request"
          className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all"
          style={{
            border: "1px solid #f5c63e",
            color: "#f5c63e",
            borderRadius: "2px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "#f5c63e";
            (e.currentTarget as HTMLElement).style.color = "#0d1c20";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#f5c63e";
          }}
        >
          Request Early Access
        </a>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={IMG_HERO_POSTER}
            alt="Private medical office"
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.45)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(13,28,31,0.92) 40%, rgba(13,28,31,0.3) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: headline */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p
              className="mb-6 uppercase tracking-widest text-xs font-medium"
              style={{ color: "#f5c63e", letterSpacing: "0.2em" }}
            >
              Direct2YourDoc &nbsp;·&nbsp; A KeepMore Company &nbsp;·&nbsp; Coming Soon
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                color: "#e7f3f0",
                letterSpacing: "-0.01em",
              }}
            >
              Open one app.
              <br />
              <span style={{ color: "#f5c63e", fontStyle: "italic" }}>You're in the office.</span>
            </h1>
            <p
              className="mt-6 text-lg leading-relaxed max-w-md"
              style={{ color: "#a6cbc5", fontFamily: "'DM Sans', sans-serif" }}
            >
              Medical care shouldn't be a password problem. Direct2YourDoc brings you directly to your private doctor — from home, on your schedule, without the chaos.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#request"
                className="flex items-center gap-2 px-7 py-3.5 font-medium transition-all"
                style={{
                  background: "#f5c63e",
                  color: "#0d1c20",
                  borderRadius: "2px",
                  fontSize: "0.85rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#d4aa52")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#f5c63e")}
              >
                Request Early Access <ArrowRight size={15} />
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-7 py-3.5 font-medium transition-all"
                style={{
                  border: "1px solid rgba(231,243,240,0.3)",
                  color: "#cce2dd",
                  borderRadius: "2px",
                  fontSize: "0.85rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                See How It Works
              </a>
            </div>
          </motion.div>

          {/* Right: feature pills */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="hidden lg:flex flex-col gap-4"
          >
            {[
              { icon: Headphones, text: "Headset included with sign-up" },
              { icon: Smartphone, text: "One app. One office. One clear next step." },
              { icon: Users, text: "Direct access. Organized care. Calm support." },
            ].map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  background: "rgba(231,243,240,0.06)",
                  border: "1px solid rgba(245,198,62,0.25)",
                  borderRadius: "4px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(245,198,62,0.15)", border: "1px solid rgba(245,198,62,0.3)" }}
                >
                  <Icon size={18} style={{ color: "#f5c63e" }} />
                </div>
                <span style={{ color: "#cce2dd", fontSize: "0.95rem" }}>{text}</span>
              </div>
            ))}
            <div
              className="mt-2 px-5 py-4 flex items-center gap-3"
              style={{
                background: "rgba(245,198,62,0.08)",
                border: "1px solid rgba(245,198,62,0.4)",
                borderRadius: "4px",
              }}
            >
              <Shield size={16} style={{ color: "#f5c63e" }} />
              <span style={{ color: "#f5c63e", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                direct2yourdoc.com &nbsp;·&nbsp; Private medical assurance for families.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, #f5c63e, transparent)" }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — THE PROBLEM
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 px-6" style={{ background: "#16292f" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16"
          >
            <p className="uppercase tracking-widest text-xs mb-4" style={{ color: "#f5c63e", letterSpacing: "0.2em" }}>
              The Problem
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 600,
                color: "#e7f3f0",
                lineHeight: 1.15,
                maxWidth: "680px",
              }}
            >
              Medical care shouldn't be a password problem.
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <p className="text-lg leading-relaxed mb-8" style={{ color: "#8fb5b0" }}>
                Too many portals. Too many logins. Too many missed follow-ups. Families navigating a loved one's care spend more time chasing paperwork than receiving it.
              </p>
              <div className="space-y-5">
                {[
                  "Scattered records across 4 different hospital systems",
                  "Prescriptions called into the wrong pharmacy",
                  "No one to call at 11pm when something feels wrong",
                  "Families left without a clear next step after discharge",
                  "Second opinions delayed by weeks of scheduling",
                ].map((pain, i) => (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i * 0.5 + 2}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(245,198,62,0.15)", border: "1px solid rgba(245,198,62,0.4)" }}
                    >
                      <X size={10} style={{ color: "#f5c63e" }} />
                    </div>
                    <span style={{ color: "#a6cbc5", fontSize: "0.95rem", lineHeight: 1.6 }}>{pain}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="space-y-5"
            >
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "#8fb5b0" }}
              >
                Direct2YourDoc eliminates the friction. One app. One office. Your doctor, your records, your care plan — organized and accessible from home.
              </p>
              {[
                "All records in one organized command file",
                "Same-day prescriptions sent to your pharmacy",
                "48-hour on-call access, 24 hours a day",
                "Hospital advocacy so you get the care you need",
                "Second opinions coordinated by Dr. Heslin directly",
              ].map((sol, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.5 + 3}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(245,198,62,0.2)", border: "1px solid rgba(245,198,62,0.5)" }}
                  >
                    <Check size={10} style={{ color: "#f5c63e" }} />
                  </div>
                  <span style={{ color: "#cce2dd", fontSize: "0.95rem", lineHeight: 1.6 }}>{sol}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — VIRTUAL WAITING ROOM
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: "#0d1c20" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16"
          >
            <p className="uppercase tracking-widest text-xs mb-4" style={{ color: "#f5c63e", letterSpacing: "0.2em" }}>
              The Virtual Office &nbsp;·&nbsp; Coming Soon
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 600,
                color: "#e7f3f0",
                lineHeight: 1.15,
                maxWidth: "700px",
              }}
            >
              A private waiting room.
              <br />
              <span style={{ color: "#f5c63e", fontStyle: "italic" }}>From your living room.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: "#8fb5b0" }}>
              When you open the Direct2YourDoc app, you enter a private virtual medical office — not a portal, not a chat window. A real waiting room experience with your care team status, queue position, and appointment options.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8 items-stretch">
            {/* Left: image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="lg:col-span-3 relative rounded-sm overflow-hidden"
              style={{ minHeight: "420px" }}
            >
              <img
                src={IMG_WAITING_ROOM}
                alt="Virtual private waiting room"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.85)" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, rgba(13,28,31,0.3) 0%, transparent 60%)" }}
              />
              {/* Overlay badge */}
              <div
                className="absolute top-5 left-5 px-3 py-1.5 text-xs uppercase tracking-widest"
                style={{
                  background: "rgba(13,28,31,0.8)",
                  border: "1px solid rgba(245,198,62,0.4)",
                  color: "#f5c63e",
                  borderRadius: "2px",
                  backdropFilter: "blur(8px)",
                }}
              >
                Prototype Preview
              </div>
            </motion.div>

            {/* Right: waiting room status panel */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              {/* Check-in status */}
              <div
                className="p-5 rounded-sm"
                style={{
                  background: "rgba(231,243,240,0.04)",
                  border: "1px solid rgba(245,198,62,0.2)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest" style={{ color: "#f5c63e", letterSpacing: "0.15em" }}>
                    Private Check-In
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(245,198,62,0.15)", color: "#f5c63e" }}
                  >
                    Checked In
                  </span>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#e7f3f0" }}>
                  Welcome back.
                </p>
                <p className="text-sm mt-1" style={{ color: "#8fb5b0" }}>Dr. Heslin will be with you shortly.</p>
              </div>

              {/* Queue + ETA */}
              <div
                className="p-5 rounded-sm grid grid-cols-2 gap-4"
                style={{
                  background: "rgba(231,243,240,0.04)",
                  border: "1px solid rgba(245,198,62,0.2)",
                }}
              >
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#f5c63e", letterSpacing: "0.12em" }}>Queue</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#e7f3f0" }}>#2</p>
                  <p className="text-xs" style={{ color: "#8fb5b0" }}>of 3 today</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#f5c63e", letterSpacing: "0.12em" }}>Est. Wait</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#e7f3f0" }}>12m</p>
                  <p className="text-xs" style={{ color: "#8fb5b0" }}>Response window</p>
                </div>
              </div>

              {/* Care team */}
              <div
                className="p-5 rounded-sm"
                style={{
                  background: "rgba(231,243,240,0.04)",
                  border: "1px solid rgba(245,198,62,0.2)",
                }}
              >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#f5c63e", letterSpacing: "0.12em" }}>Care Team Status</p>
                {[
                  { name: "Dr. Andrew Heslin", role: "Founding Physician", status: "Available" },
                  { name: "Care Coordinator", role: "Admin & Records", status: "Online" },
                ].map((member, i) => (
                  <div key={i} className={`flex items-center justify-between py-2.5 ${i < 1 ? "border-b" : ""}`} style={{ borderColor: "rgba(245,198,62,0.1)" }}>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(245,198,62,0.15)" }}
                      >
                        <User size={12} style={{ color: "#f5c63e" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#cce2dd" }}>{member.name}</p>
                        <p className="text-xs" style={{ color: "#8fb5b0" }}>{member.role}</p>
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(100,180,100,0.15)", color: "#90c890" }}
                    >
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Appointment options */}
              <div
                className="p-5 rounded-sm"
                style={{
                  background: "rgba(231,243,240,0.04)",
                  border: "1px solid rgba(245,198,62,0.2)",
                }}
              >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#f5c63e", letterSpacing: "0.12em" }}>Appointment Options</p>
                <div className="space-y-2">
                  {["Immediate consultation", "Schedule for later", "Message care team"].map((opt, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-2.5 text-sm flex items-center justify-between transition-all rounded-sm"
                      style={{
                        background: "rgba(245,198,62,0.06)",
                        border: "1px solid rgba(245,198,62,0.15)",
                        color: "#a6cbc5",
                      }}
                      onClick={() => {}}
                    >
                      {opt}
                      <ChevronRight size={14} style={{ color: "#f5c63e" }} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — HOTEL-STYLE APPOINTMENT LEDGER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6" style={{ background: "#16292f" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-14"
          >
            <p className="uppercase tracking-widest text-xs mb-4" style={{ color: "#f5c63e", letterSpacing: "0.2em" }}>
              Appointment Ledger &nbsp;·&nbsp; Coming Soon
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 600,
                color: "#e7f3f0",
                lineHeight: 1.15,
              }}
            >
              Reserve your time.
              <br />
              <span style={{ color: "#f5c63e", fontStyle: "italic" }}>Mark your X.</span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed" style={{ color: "#8fb5b0" }}>
              Like the reservation ledger of a private club — select your preferred time by marking it. No automated phone trees. No 3-week waits.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="overflow-x-auto"
          >
            <div
              className="rounded-sm overflow-hidden"
              style={{
                border: "1px solid rgba(245,198,62,0.25)",
                background: "rgba(231,243,240,0.03)",
                minWidth: "600px",
              }}
            >
              {/* Header row */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "120px repeat(5, 1fr)",
                  borderBottom: "1px solid rgba(245,198,62,0.2)",
                  background: "rgba(245,198,62,0.06)",
                }}
              >
                <div className="px-4 py-3 text-xs uppercase tracking-widest" style={{ color: "#f5c63e", borderRight: "1px solid rgba(245,198,62,0.15)" }}>
                  Time
                </div>
                {DAYS.map(day => (
                  <div
                    key={day}
                    className="px-3 py-3 text-center text-xs uppercase tracking-widest"
                    style={{ color: "#f5c63e", borderRight: "1px solid rgba(245,198,62,0.1)" }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time rows */}
              {TIMES.map((time, ti) => (
                <div
                  key={time}
                  className="grid"
                  style={{
                    gridTemplateColumns: "120px repeat(5, 1fr)",
                    borderBottom: ti < TIMES.length - 1 ? "1px solid rgba(245,198,62,0.08)" : "none",
                  }}
                >
                  <div
                    className="px-4 py-3 text-sm"
                    style={{
                      color: "#8fb5b0",
                      borderRight: "1px solid rgba(245,198,62,0.15)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {time}
                  </div>
                  {DAYS.map(day => {
                    const key = `${day}-${time}`;
                    const isBooked = BOOKED[key];
                    const isSelected = selectedSlot === key;
                    return (
                      <button
                        key={day}
                        onClick={() => handleSlotClick(key)}
                        disabled={isBooked}
                        className="py-3 flex items-center justify-center transition-all"
                        style={{
                          borderRight: "1px solid rgba(245,198,62,0.08)",
                          background: isSelected
                            ? "rgba(245,198,62,0.2)"
                            : isBooked
                            ? "rgba(231,243,240,0.02)"
                            : "transparent",
                          cursor: isBooked ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={e => {
                          if (!isBooked && !isSelected)
                            (e.currentTarget as HTMLElement).style.background = "rgba(245,198,62,0.08)";
                        }}
                        onMouseLeave={e => {
                          if (!isBooked && !isSelected)
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        {isBooked ? (
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: "1.1rem",
                              color: "rgba(245,198,62,0.35)",
                              fontWeight: 700,
                            }}
                          >
                            ×
                          </span>
                        ) : isSelected ? (
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: "1.3rem",
                              color: "#f5c63e",
                              fontWeight: 700,
                            }}
                          >
                            ✕
                          </span>
                        ) : (
                          <span
                            className="w-5 h-5 rounded-sm"
                            style={{ border: "1px solid rgba(245,198,62,0.2)" }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6 text-xs" style={{ color: "#8fb5b0" }}>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(245,198,62,0.35)" }}>×</span>
                <span>Already booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#f5c63e" }}>✕</span>
                <span>Your selection</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-sm inline-block"
                  style={{ border: "1px solid rgba(245,198,62,0.2)" }}
                />
                <span>Available</span>
              </div>
            </div>

            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 px-5 py-4 flex items-center justify-between rounded-sm"
                style={{
                  background: "rgba(245,198,62,0.1)",
                  border: "1px solid rgba(245,198,62,0.35)",
                }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#cce2dd" }}>
                    Selected: <span style={{ color: "#f5c63e" }}>{selectedSlot.replace("-", " at ")}</span>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8fb5b0" }}>
                    Complete the request form below to confirm this appointment.
                  </p>
                </div>
                <a
                  href="#request"
                  className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-sm"
                  style={{ background: "#f5c63e", color: "#0d1c20", fontWeight: 600 }}
                >
                  Confirm <ArrowRight size={12} />
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — PATIENT COMMAND FILE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: "#0d1c20" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16"
          >
            <p className="uppercase tracking-widest text-xs mb-4" style={{ color: "#f5c63e", letterSpacing: "0.2em" }}>
              Patient Command File &nbsp;·&nbsp; Coming Soon
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 600,
                color: "#e7f3f0",
                lineHeight: 1.15,
                maxWidth: "700px",
              }}
            >
              Everything about your care.
              <br />
              <span style={{ color: "#f5c63e", fontStyle: "italic" }}>In one place. Always ready.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: "#8fb5b0" }}>
              Your Patient Command File is a living record organized by Dr. Heslin's office — not a dump of PDFs, but a curated, readable overview of your entire health picture.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Left: command file items */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="lg:col-span-2 space-y-3"
            >
              {COMMAND_ITEMS.map(({ icon: Icon, label, desc, status }, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.3 + 1}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-sm transition-all cursor-default"
                  style={{
                    background: "rgba(231,243,240,0.04)",
                    border: "1px solid rgba(245,198,62,0.15)",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(245,198,62,0.4)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(245,198,62,0.15)")}
                >
                  <div
                    className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(245,198,62,0.12)", border: "1px solid rgba(245,198,62,0.25)" }}
                  >
                    <Icon size={16} style={{ color: "#f5c63e" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "#cce2dd" }}>{label}</p>
                    <p className="text-xs truncate" style={{ color: "#8fb5b0" }}>{desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs" style={{ color: "#f5c63e" }}>{status}</span>
                    <ChevronRight size={12} style={{ color: "rgba(245,198,62,0.5)" }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right: image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="lg:col-span-3 relative rounded-sm overflow-hidden"
              style={{ minHeight: "500px" }}
            >
              <img
                src={IMG_PATIENT_CMD}
                alt="Patient command file and care coordination"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.8)" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to left, rgba(13,28,31,0.2) 0%, rgba(13,28,31,0.5) 100%)" }}
              />
              <div
                className="absolute bottom-6 left-6 right-6 px-5 py-4 rounded-sm"
                style={{
                  background: "rgba(13,28,31,0.85)",
                  border: "1px solid rgba(245,198,62,0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#f5c63e", letterSpacing: "0.15em" }}>
                  Prototype Preview
                </p>
                <p className="text-sm" style={{ color: "#cce2dd" }}>
                  Patient Overview · Care Coordination · Second Opinion Review — all in one private office view.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — REQUEST / SETUP FORM
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="request" className="py-28 px-6" style={{ background: "#16292f" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-14 text-center"
          >
            <p className="uppercase tracking-widest text-xs mb-4" style={{ color: "#f5c63e", letterSpacing: "0.2em" }}>
              Request Early Access
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 600,
                color: "#e7f3f0",
                lineHeight: 1.15,
              }}
            >
              Reserve your place
              <br />
              <span style={{ color: "#f5c63e", fontStyle: "italic" }}>in the first cohort.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#8fb5b0" }}>
              Direct2YourDoc is opening to its first founding members. Your sign-up includes the headset, full setup, and onboarding with Dr. Heslin's care team.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-8 rounded-sm"
              style={{
                background: "rgba(245,198,62,0.06)",
                border: "1px solid rgba(245,198,62,0.3)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(245,198,62,0.15)", border: "1px solid rgba(245,198,62,0.4)" }}
              >
                <Check size={24} style={{ color: "#f5c63e" }} />
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  color: "#e7f3f0",
                  marginBottom: "0.75rem",
                }}
              >
                Request received.
              </h3>
              <p style={{ color: "#8fb5b0", maxWidth: "400px", margin: "0 auto", lineHeight: 1.7 }}>
                Dr. Heslin's care team will be in touch within 48 hours to discuss your membership and schedule your onboarding call.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { field: "name", label: "Full Name", icon: User, placeholder: "Your full name", type: "text" },
                  { field: "email", label: "Email Address", icon: Mail, placeholder: "your@email.com", type: "email" },
                  { field: "phone", label: "Phone Number", icon: Phone, placeholder: "+1 (000) 000-0000", type: "tel" },
                  { field: "city", label: "City / State", icon: MapPin, placeholder: "New York, NY", type: "text" },
                ].map(({ field, label, icon: Icon, placeholder, type }) => (
                  <div key={field}>
                    <label
                      className="block text-xs uppercase tracking-widest mb-2"
                      style={{ color: "#f5c63e", letterSpacing: "0.12em" }}
                    >
                      {label}
                    </label>
                    <div className="relative">
                      <Icon
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: "rgba(245,198,62,0.5)" }}
                      />
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={(formData as any)[field]}
                        onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                        className="w-full pl-9 pr-4 py-3 text-sm outline-none transition-all"
                        style={{
                          background: "rgba(231,243,240,0.04)",
                          border: "1px solid rgba(245,198,62,0.2)",
                          borderRadius: "2px",
                          color: "#cce2dd",
                        }}
                        onFocus={e => ((e.target as HTMLElement).style.borderColor = "rgba(245,198,62,0.6)")}
                        onBlur={e => ((e.target as HTMLElement).style.borderColor = "rgba(245,198,62,0.2)")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "#f5c63e", letterSpacing: "0.12em" }}
                >
                  Tell us about your care needs (optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Briefly describe what brings you to Direct2YourDoc — ongoing conditions, family care needs, or simply wanting a trusted physician on call."
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 text-sm outline-none transition-all resize-none"
                  style={{
                    background: "rgba(231,243,240,0.04)",
                    border: "1px solid rgba(245,198,62,0.2)",
                    borderRadius: "2px",
                    color: "#cce2dd",
                  }}
                  onFocus={e => ((e.target as HTMLElement).style.borderColor = "rgba(245,198,62,0.6)")}
                  onBlur={e => ((e.target as HTMLElement).style.borderColor = "rgba(245,198,62,0.2)")}
                />
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  className="mt-1 flex-shrink-0"
                  style={{ accentColor: "#f5c63e" }}
                />
                <label htmlFor="consent" className="text-xs leading-relaxed" style={{ color: "#8fb5b0" }}>
                  I understand that Direct2YourDoc is a private concierge medical service and does not constitute insurance, nor a substitute for emergency care. I consent to being contacted by Dr. Heslin's care team.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 font-medium text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "#f5c63e",
                  color: "#0d1c20",
                  borderRadius: "2px",
                  letterSpacing: "0.1em",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#d4aa52")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#f5c63e")}
              >
                Submit Request &nbsp;<ArrowRight size={15} />
              </button>

              <p className="text-center text-xs" style={{ color: "rgba(143,181,176,0.6)" }}>
                Dr. Heslin's team will respond within 48 hours.
              </p>
            </motion.form>
          )}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="py-10 px-6 text-center"
        style={{
          background: "#08161a",
          borderTop: "1px solid rgba(245,198,62,0.15)",
        }}
      >
        {/* Logo lockup — Direct2YourDoc, a KeepMore Company venture */}
        <div className="flex items-center justify-center gap-8 mb-5 flex-wrap">
          <img
            src={LOGO_D2YD}
            alt="Direct2YourDoc"
            style={{ height: "64px", width: "auto", objectFit: "contain" }}
          />
          <div style={{ width: "1px", height: "48px", background: "rgba(245,198,62,0.3)" }} />
          <span className="flex items-center gap-2.5">
            <img
              src={KEEPMORE_MARK}
              alt="The KeepMore Company"
              style={{ height: "34px", width: "auto", objectFit: "contain" }}
            />
            <span className="text-xs uppercase" style={{ color: "rgba(143,181,176,0.7)", letterSpacing: "0.1em", lineHeight: 1.3 }}>
              A KeepMore<br />Company
            </span>
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: "#f5c63e", letterSpacing: "0.16em", textTransform: "uppercase" }}>
          Your Doctor. Your Home. Now.
        </p>
        <p className="text-xs" style={{ color: "rgba(143,181,176,0.5)", maxWidth: "500px", margin: "0 auto" }}>
          © {new Date().getFullYear()} The KeepMore Company LLC · Direct2YourDoc is a private concierge medical service and does not constitute insurance or a substitute for emergency care. App coming soon.
        </p>
      </footer>
    </div>
  );
}
