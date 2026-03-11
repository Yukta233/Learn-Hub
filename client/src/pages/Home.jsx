import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sky: #38bdf8;
    --sky-dim: #0ea5e9;
    --bg: #040d18;
    --bg2: #071220;
    --bg3: #0b1a2e;
    --text: #e2eaf5;
    --muted: #7a9bbf;
    --border: rgba(56,189,248,0.12);
    --glow: 0 0 40px rgba(56,189,248,0.18);
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  /* ── CANVAS STARS ── */
  #star-canvas {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
  }

  /* ── HERO ── */
  .home-wrap { position: relative; overflow: hidden; }

  .hero {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 140px 24px 100px;
  }

  .hero::before {
    content: '';
    position: absolute; inset: 0; z-index: -1;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(56,189,248,0.13) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 80% 80%, rgba(14,165,233,0.08) 0%, transparent 60%);
  }

  .welcome-pill {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid var(--border);
    background: rgba(56,189,248,0.07);
    padding: 6px 18px; border-radius: 999px;
    font-size: 20px; letter-spacing: 0.06em;
    color: var(--sky); margin-bottom: 28px;
    animation: fadeSlideDown 0.7s ease both;
  }
  .welcome-pill span { width: 7px; height: 7px; border-radius: 50%; background: var(--sky); display: inline-block; animation: pulse 1.8s ease infinite; }

  .hero-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(44px, 7vw, 86px);
    font-weight: 800; line-height: 1.05;
    letter-spacing: -0.02em;
    animation: fadeSlideUp 0.8s 0.15s ease both;
  }
  .hero-headline em {
    font-style: normal;
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 60%, #c084fc 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .hero-sub {
    margin-top: 22px; max-width: 520px;
    font-size: 17px; line-height: 1.7;
    color: var(--muted);
    animation: fadeSlideUp 0.8s 0.28s ease both;
  }

  .hero-ctas {
    margin-top: 40px; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
    animation: fadeSlideUp 0.8s 0.4s ease both;
  }

  .btn-primary {
    padding: 13px 32px; border-radius: 10px; font-size: 15px; font-weight: 600;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    color: #fff; border: none; cursor: pointer;
    box-shadow: 0 4px 24px rgba(56,189,248,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(56,189,248,0.45); }

  .btn-ghost {
    padding: 13px 32px; border-radius: 10px; font-size: 15px; font-weight: 500;
    background: transparent; color: var(--text);
    border: 1px solid var(--border); cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-ghost:hover { border-color: var(--sky); background: rgba(56,189,248,0.06); }

  /* ── STATS ── */
  .stats-row {
    position: relative; z-index: 1;
    display: flex; justify-content: center; flex-wrap: wrap; gap: 0;
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    background: var(--bg2);
  }
  .stat-item {
    flex: 1; min-width: 160px; padding: 28px 24px; text-align: center;
    border-right: 1px solid var(--border);
  }
  .stat-item:last-child { border-right: none; }
  .stat-num {
    font-family: 'Syne', sans-serif; font-size: 34px; font-weight: 700;
    background: linear-gradient(135deg, #38bdf8, #c084fc);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .stat-label { font-size: 13px; color: var(--muted); margin-top: 4px; letter-spacing: 0.04em; }

  /* ── SECTION SHARED ── */
  .section { position: relative; z-index: 1; padding: 96px 24px; max-width: 1120px; margin: 0 auto; }
  .section-tag {
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--sky); margin-bottom: 12px; font-weight: 600;
  }
  .section-title {
    font-family: 'Syne', sans-serif; font-size: clamp(30px, 4vw, 48px);
    font-weight: 700; line-height: 1.15; margin-bottom: 16px;
  }
  .section-title em { font-style: normal; color: var(--sky); }
  .section-sub { color: var(--muted); font-size: 16px; line-height: 1.7; max-width: 520px; }

  /* ── CATEGORIES ── */
  .categories-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 56px;
  }
  .cat-card {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 14px; padding: 28px 22px;
    cursor: pointer; transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    position: relative; overflow: hidden;
  }
  .cat-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--card-color, #38bdf8) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 14px;
  }
  .cat-card:hover { transform: translateY(-4px); border-color: rgba(56,189,248,0.35); box-shadow: var(--glow); }
  .cat-card:hover::before { opacity: 0.07; }
  .cat-icon { font-size: 30px; margin-bottom: 12px; }
  .cat-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .cat-count { font-size: 12px; color: var(--muted); }

  /* ── FEATURED COURSES ── */
  .courses-row { margin-top: 56px; }
  .course-scroll {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;
  }
  .course-card {
    background: var(--bg3); border: 1px solid var(--border); border-radius: 16px;
    overflow: hidden; transition: transform 0.25s, box-shadow 0.25s;
    cursor: pointer;
  }
  .course-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
  .course-thumb {
    height: 140px;
    display: flex; align-items: center; justify-content: center;
    font-size: 48px;
  }
  .course-body { padding: 20px; }
  .course-badge {
    display: inline-block; padding: 3px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em; margin-bottom: 10px;
    background: rgba(56,189,248,0.12); color: var(--sky);
  }
  .course-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
  .course-meta { display: flex; gap: 14px; align-items: center; margin-top: 14px; }
  .course-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #fbbf24; }
  .course-students { font-size: 12px; color: var(--muted); }
  .course-price { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: var(--sky); margin-left: auto; }

  /* ── HOW IT WORKS ── */
  .how-bg { background: var(--bg2); }
  .steps-row {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; margin-top: 56px;
  }
  .step-card {
    padding: 32px 24px; border-radius: 16px; border: 1px solid var(--border);
    background: var(--bg3); position: relative;
  }
  .step-num {
    font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800;
    color: rgba(56,189,248,0.12); line-height: 1; margin-bottom: 16px;
  }
  .step-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 8px; }
  .step-desc { font-size: 14px; color: var(--muted); line-height: 1.65; }

  /* ── TESTIMONIALS ── */
  .testimonials-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 56px;
  }
  .testi-card {
    padding: 28px; border-radius: 16px; border: 1px solid var(--border);
    background: var(--bg3); transition: border-color 0.25s;
  }
  .testi-card:hover { border-color: rgba(56,189,248,0.3); }
  .testi-stars { color: #fbbf24; font-size: 14px; margin-bottom: 14px; }
  .testi-text { font-size: 15px; line-height: 1.7; color: var(--muted); font-style: italic; margin-bottom: 20px; }
  .testi-author { display: flex; align-items: center; gap: 12px; }
  .testi-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 700;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
  }
  .testi-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
  .testi-role { font-size: 12px; color: var(--muted); }

  /* ── CTA BANNER ── */
  .cta-banner {
    position: relative; z-index: 1;
    margin: 0 24px 80px; border-radius: 24px;
    padding: 72px 40px; text-align: center;
    background: linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(129,140,248,0.12) 100%);
    border: 1px solid rgba(56,189,248,0.2);
    overflow: hidden;
  }
  .cta-banner::before {
    content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%);
    top: -150px; left: 50%; transform: translateX(-50%);
  }
  .cta-title { font-family: 'Syne', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 800; margin-bottom: 14px; }
  .cta-sub { color: var(--muted); font-size: 16px; margin-bottom: 36px; }

  /* ── FOOTER STRIP ── */
  .footer-strip {
    position: relative; z-index: 1;
    border-top: 1px solid var(--border);
    padding: 28px 40px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
    font-size: 13px; color: var(--muted);
    background: var(--bg2);
  }
  .footer-logo { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--text); }
  .footer-logo span { color: var(--sky); }

  /* ── ANIMATIONS ── */
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.75); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .fade-in-section {
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-in-section.visible { opacity: 1; transform: translateY(0); }
`;

const CATEGORIES = [
  { icon: "💻", name: "Web Development", count: "142 courses", color: "#38bdf8" },
  { icon: "🧠", name: "Machine Learning", count: "98 courses", color: "#818cf8" },
  { icon: "📱", name: "Mobile Apps", count: "76 courses", color: "#34d399" },
  { icon: "🎨", name: "UI/UX Design", count: "63 courses", color: "#f472b6" },
  { icon: "☁️", name: "Cloud & DevOps", count: "55 courses", color: "#fb923c" },
  { icon: "🔐", name: "Cybersecurity", count: "41 courses", color: "#a78bfa" },
];

const COURSES = [
  { icon: "⚛️", bg: "linear-gradient(135deg,#1e3a4a,#0f2535)", badge: "Bestseller", title: "React & Next.js Complete Bootcamp", rating: "4.9", students: "18.4k", price: "$49" },
  { icon: "🐍", bg: "linear-gradient(135deg,#1a3a2a,#0e2018)", badge: "New", title: "Python for Data Science & AI", rating: "4.8", students: "24.1k", price: "$39" },
  { icon: "🎨", bg: "linear-gradient(135deg,#3a1a3a,#20102a)", badge: "Trending", title: "Figma & Design Systems Pro", rating: "4.7", students: "9.2k", price: "$44" },
];

const STEPS = [
  { num: "01", title: "Browse Courses", desc: "Explore our library of 500+ expert-led courses across every discipline." },
  { num: "02", title: "Enroll & Learn", desc: "Follow structured paths with video, projects, and quizzes at your pace." },
  { num: "03", title: "Get Certified", desc: "Earn shareable certificates that showcase your new skills to employers." },
  { num: "04", title: "Land Your Dream Job", desc: "Join alumni who've moved into roles at top tech companies worldwide." },
];

const TESTIMONIALS = [
  { stars: "★★★★★", text: "I went from zero coding knowledge to landing a frontend role in 6 months. The courses are incredibly structured.", name: "Priya S.", role: "Frontend Developer", avatar: "P" },
  { stars: "★★★★★", text: "The ML path is the best I've tried. Real projects, real datasets, and instructors who actually respond.", name: "Marcus T.", role: "ML Engineer", avatar: "M" },
  { stars: "★★★★☆", text: "Design systems course completely changed how I approach UI work. Worth every penny.", name: "Aiko N.", role: "Product Designer", avatar: "A" },
];

function StarCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const alpha = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} id="star-canvas" />;
}

function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-section");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Home() {
  const username = localStorage.getItem("username");
  useFadeIn();

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <div className="home-wrap">
        <StarCanvas />

        {/* ── HERO ── */}
        <section className="hero">
          {username && (
            <div className="welcome-pill">
              <span /> Hello, {username} 👋 Welcome back
            </div>
          )}
          <h1 className="hero-headline">
            Master Skills That<br /><em>Shape Tomorrow</em>
          </h1>
          <p className="hero-sub">
            Explore 500+ expert-led courses in tech, design, and business.
            Learn at your pace, earn certificates, and level up your career.
          </p>
          <div className="hero-ctas">
            <Link to="/courses" className="btn-primary">Explore Courses</Link>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="stats-row fade-in-section">
          {[["500+","Courses"], ["120k+","Learners"], ["4.9★","Avg Rating"], ["95%","Completion Rate"]].map(([n, l]) => (
            <div className="stat-item" key={l}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>

        {/* ── CATEGORIES ── */}
        <div className="fade-in-section">
          <div className="section">
            <div className="section-tag">Browse by Topic</div>
            <h2 className="section-title">Find your <em>perfect path</em></h2>
            <p className="section-sub">Whatever you want to build, we have a structured course to get you there fast.</p>
            <div className="categories-grid">
              {CATEGORIES.map(c => (
                <div className="cat-card" key={c.name} style={{ "--card-color": c.color }}>
                  <div className="cat-icon">{c.icon}</div>
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-count">{c.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FEATURED COURSES ── */}
        <div className="fade-in-section">
          <div className="section">
            <div className="section-tag">Featured</div>
            <h2 className="section-title">Top-rated <em>courses</em></h2>
            <p className="section-sub">Handpicked by our team for quality, depth, and real-world applicability.</p>
            <div className="courses-row">
              <div className="course-scroll">
                {COURSES.map(c => (
                  <div className="course-card" key={c.title}>
                    <div className="course-thumb" style={{ background: c.bg }}>{c.icon}</div>
                    <div className="course-body">
                      <div className="course-badge">{c.badge}</div>
                      <div className="course-title">{c.title}</div>
                      <div className="course-meta">
                        <span className="course-rating">★ {c.rating}</span>
                        <span className="course-students">{c.students} students</span>
                        <span className="course-price">{c.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="how-bg fade-in-section">
          <div className="section">
            <div className="section-tag">How It Works</div>
            <h2 className="section-title">Four steps to <em>transform</em> your career</h2>
            <p className="section-sub">A clear path from beginner to job-ready professional — no guesswork required.</p>
            <div className="steps-row">
              {STEPS.map(s => (
                <div className="step-card" key={s.num}>
                  <div className="step-num">{s.num}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TESTIMONIALS ── */}
        <div className="fade-in-section">
          <div className="section">
            <div className="section-tag">Testimonials</div>
            <h2 className="section-title">Loved by <em>learners</em> worldwide</h2>
            <p className="section-sub">Real stories from people who transformed their careers with our platform.</p>
            <div className="testimonials-grid">
              {TESTIMONIALS.map(t => (
                <div className="testi-card" key={t.name}>
                  <div className="testi-stars">{t.stars}</div>
                  <div className="testi-text">"{t.text}"</div>
                  <div className="testi-author">
                    <div className="testi-avatar">{t.avatar}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div className="cta-banner fade-in-section">
          <h2 className="cta-title">Start learning for free today</h2>
          <p className="cta-sub">Join 120,000+ learners already building their future on our platform.</p>
          <button className="btn-primary" style={{ fontSize: "16px", padding: "15px 40px" }}>
            Get Started — It's Free
          </button>
        </div>

        {/* ── FOOTER STRIP ── */}
        <div className="footer-strip">
          <div className="footer-logo">Learn<span>Hub</span></div>
          <div>© 2025 LearnHub. All rights reserved.</div>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Contact"].map(l => (
              <a key={l} href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;