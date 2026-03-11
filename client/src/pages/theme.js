// Shared theme tokens — import this string into each page's <style> tag
export const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --sky: #38bdf8;
    --sky-dim: #0ea5e9;
    --violet: #818cf8;
    --emerald: #34d399;
    --rose: #f87171;
    --amber: #fbbf24;
    --bg:   #040d18;
    --bg2:  #071220;
    --bg3:  #0b1a2e;
    --bg4:  #0f2040;
    --text: #e2eaf5;
    --muted: #7a9bbf;
    --dim:   #3a5a7a;
    --border: rgba(56,189,248,0.12);
    --border-hover: rgba(56,189,248,0.3);
    --glow: 0 0 40px rgba(56,189,248,0.15);
    --card-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  /* ── PAGE WRAPPER ── */
  .page-wrap {
    min-height: 100vh;
    background: var(--bg);
    padding-top: 88px;
    position: relative;
  }
  .page-wrap::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 55% 40% at 15% 20%, rgba(56,189,248,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 50% at 85% 70%, rgba(129,140,248,0.05) 0%, transparent 70%);
  }
  .page-wrap::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  /* ── PAGE INNER ── */
  .page-inner {
    position: relative; z-index: 1;
    padding: 48px 7% 80px;
  }

  /* ── PAGE HEADER ── */
  .page-header { margin-bottom: 36px; }
  .page-tag {
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--sky); font-weight: 600; margin-bottom: 8px;
  }
  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .page-title span { color: var(--sky); }

  /* ── STAT CARDS ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px 22px;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border-hover); }
  .stat-card-label { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim); margin-bottom: 8px; }
  .stat-card-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: var(--text); }
  .stat-card-value.sky { color: var(--sky); }
  .stat-card-value.emerald { color: var(--emerald); }
  .stat-card-value.violet { color: var(--violet); }

  /* ── GLASS CARD ── */
  .glass-card {
    background: rgba(7,18,32,0.7);
    border: 1px solid var(--border);
    border-radius: 18px;
    backdrop-filter: blur(16px);
    box-shadow: var(--card-shadow);
    overflow: hidden;
  }
  .glass-card-header {
    padding: 20px 24px 18px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .glass-card-title {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
  }
  .glass-card-body { padding: 20px 24px; }

  /* ── BUTTONS ── */
  .btn-primary {
    padding: 10px 22px; border-radius: 9px;
    background: linear-gradient(135deg, var(--sky), var(--violet));
    color: #fff; font-size: 14px; font-weight: 600;
    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 3px 14px rgba(56,189,248,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none; display: inline-block;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(56,189,248,0.38); }

  .btn-ghost {
    padding: 10px 22px; border-radius: 9px;
    background: transparent; color: var(--muted);
    font-size: 14px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .btn-ghost:hover { border-color: var(--border-hover); color: var(--text); background: rgba(56,189,248,0.06); }

  .btn-danger {
    padding: 10px 22px; border-radius: 9px;
    background: transparent; color: var(--rose);
    font-size: 14px; border: 1px solid rgba(248,113,113,0.2);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
  }
  .btn-danger:hover { background: rgba(248,113,113,0.08); }

  /* ── BADGE ── */
  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
  }
  .badge-sky { background: rgba(56,189,248,0.12); color: var(--sky); }
  .badge-emerald { background: rgba(52,211,153,0.12); color: var(--emerald); }
  .badge-violet { background: rgba(129,140,248,0.12); color: var(--violet); }
  .badge-amber { background: rgba(251,191,36,0.12); color: var(--amber); }

  /* ── SECTION LABEL ── */
  .section-label {
    font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--dim); font-weight: 600; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── LIST ROWS ── */
  .list-row {
    padding: 12px 0; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  }
  .list-row:last-child { border-bottom: none; }
  .list-row-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .list-row-sub { font-size: 12px; color: var(--muted); }

  /* ── PROGRESS BAR ── */
  .progress-track {
    width: 100%; height: 8px; border-radius: 99px;
    background: rgba(56,189,248,0.08); border: 1px solid var(--border);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--sky), var(--violet));
    transition: width 0.6s ease;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .delay-1 { animation-delay: 0.08s; }
  .delay-2 { animation-delay: 0.16s; }
  .delay-3 { animation-delay: 0.24s; }
  .delay-4 { animation-delay: 0.32s; }

  /* ── FORM INPUTS ── */
  .field-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--dim); margin-bottom: 7px;
  }
  .field-input {
    width: 100%; padding: 11px 14px;
    background: rgba(14,28,46,0.8); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text); font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field-input::placeholder { color: var(--dim); }
  .field-input:focus { border-color: rgba(56,189,248,0.4); box-shadow: 0 0 0 3px rgba(56,189,248,0.07); }

  /* ── LOADING / ERROR ── */
  .state-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; gap: 14px; color: var(--muted); font-size: 15px;
  }
  .spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid var(--border); border-top-color: var(--sky);
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`