import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import { getMyProgress } from "../services/api"

const STYLES = `
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

  /* ── PAGE WRAPPER ── */
  .sd-page-wrap {
    min-height: 100vh;
    background: var(--bg);
    padding-top: 88px;
    position: relative;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
  }
  .sd-page-wrap::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 55% 40% at 15% 20%, rgba(56,189,248,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 50% at 85% 70%, rgba(129,140,248,0.05) 0%, transparent 70%);
  }
  .sd-page-wrap::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  .sd-inner {
    position: relative; z-index: 1;
    padding: 48px 7% 80px;
  }

  /* ── PAGE HEADER ── */
  .sd-page-tag {
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--sky); font-weight: 600; margin-bottom: 8px;
  }
  .sd-page-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(24px, 3.5vw, 36px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
  }
  .sd-page-title span { color: var(--sky); }

  /* ── DASHBOARD GRID ── */
  .sd-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    grid-template-rows: auto auto;
    gap: 24px;
  }
  .sd-full { grid-column: 1 / -1; }

  /* ── GLASS CARD ── */
  .sd-card {
    background: rgba(7,18,32,0.7);
    border: 1px solid var(--border);
    border-radius: 18px;
    backdrop-filter: blur(16px);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .sd-card:hover { border-color: var(--border-hover); }
  .sd-card-header {
    padding: 20px 24px 18px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .sd-card-title {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
    letter-spacing: -0.01em;
  }
  .sd-card-title span { color: var(--sky); }
  .sd-card-body { padding: 22px 24px; }

  /* ── PROFILE ── */
  .sd-profile-row {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 18px;
  }
  .sd-profile-avatar {
    width: 72px; height: 72px; border-radius: 50%; object-fit: cover;
    border: 2px solid rgba(56,189,248,0.25);
    box-shadow: 0 0 24px rgba(56,189,248,0.14);
    flex-shrink: 0;
  }
  .sd-profile-name {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px;
    margin-bottom: 4px;
  }
  .sd-profile-meta { font-size: 12px; color: var(--muted); margin-top: 3px; }

  /* ── FIELD ── */
  .sd-field-group { margin-bottom: 14px; }
  .sd-field-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--dim); margin-bottom: 7px;
  }
  .sd-field-input {
    width: 100%; padding: 11px 14px;
    background: rgba(14,28,46,0.8); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text); font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .sd-field-input::placeholder { color: var(--dim); }
  .sd-field-input:focus { border-color: rgba(56,189,248,0.4); box-shadow: 0 0 0 3px rgba(56,189,248,0.07); }

  /* ── BUTTONS ── */
  .sd-btn-primary {
    padding: 10px 22px; border-radius: 9px;
    background: linear-gradient(135deg, var(--sky), var(--violet));
    color: #fff; font-size: 14px; font-weight: 600;
    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 3px 14px rgba(56,189,248,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-block;
  }
  .sd-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(56,189,248,0.38); }

  .sd-btn-ghost {
    padding: 10px 22px; border-radius: 9px;
    background: transparent; color: var(--muted);
    font-size: 14px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    margin-left: 8px;
  }
  .sd-btn-ghost:hover { border-color: var(--border-hover); color: var(--text); background: rgba(56,189,248,0.06); }

  /* ── LIST ── */
  .sd-list { list-style: none; padding: 0; margin: 0; }
  .sd-list-item {
    padding: 13px 0; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  }
  .sd-list-item:last-child { border-bottom: none; }
  .sd-list-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .sd-list-sub { font-size: 12px; color: var(--muted); }

  /* ── VIEW LINK ── */
  .sd-view-link {
    padding: 6px 14px; border-radius: 7px;
    background: rgba(56,189,248,0.08); color: var(--sky);
    font-size: 12px; font-weight: 600;
    border: 1px solid rgba(56,189,248,0.2);
    text-decoration: none; white-space: nowrap;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .sd-view-link:hover { background: rgba(56,189,248,0.16); }

  /* ── QUIZ SCORE ── */
  .sd-quiz-score {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 13px; font-weight: 700; color: var(--emerald);
    background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2);
    border-radius: 7px; padding: 2px 10px;
    margin-bottom: 4px;
  }
  .sd-quiz-date { font-size: 11px; color: var(--dim); margin-top: 4px; }
  .sd-course-ref { font-size: 11px; color: var(--muted); margin-bottom: 4px; }

  /* ── SECTION LABEL ── */
  .sd-section-label {
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--dim); font-weight: 600; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .sd-section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── EMPTY STATE ── */
  .sd-empty {
    padding: 28px 0; text-align: center; color: var(--dim); font-size: 13px;
  }

  /* ── STAT ROW ── */
  .sd-stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    margin-bottom: 24px;
  }
  .sd-stat {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 18px;
  }
  .sd-stat-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim); margin-bottom: 6px; }
  .sd-stat-value { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; }
  .sd-stat-value.sky { color: var(--sky); }
  .sd-stat-value.emerald { color: var(--emerald); }
  .sd-stat-value.violet { color: var(--violet); }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sd-fade-up { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .sd-delay-1 { animation-delay: 0.08s; }
  .sd-delay-2 { animation-delay: 0.16s; }
  .sd-delay-3 { animation-delay: 0.24s; }

  /* Responsive */
  @media (max-width: 900px) {
    .sd-grid { grid-template-columns: 1fr; }
    .sd-full { grid-column: 1; }
    .sd-stats-row { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .sd-stats-row { grid-template-columns: 1fr; }
  }
`

function StudentDashboard(){
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  const [profile, setProfile] = useState({ username:'', email:'', phone:'', avatarUrl:'' })
  const [editingProfile, setEditingProfile] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)

  const [savedCourses, setSavedCourses] = useState([])
  const [quizAttempts, setQuizAttempts] = useState([])
  const [progress, setProgress] = useState(null)

  useEffect(()=>{
    const load = async()=>{
      try{
        if(token){
          const meRes = await axios.get("http://localhost:5000/api/auth/me", { headers:{ Authorization:`Bearer ${token}` } })
          setProfile({
            username: meRes.data?.username || '',
            email: meRes.data?.email || '',
            phone: meRes.data?.phone || '',
            avatarUrl: meRes.data?.avatarUrl || ''
          })
        }
      }catch(err){ console.error("Failed to load profile", err.response?.data || err.message) }

      try{
        const saved = JSON.parse(localStorage.getItem(`savedCourses_${userId}`) || '[]')
        setSavedCourses(Array.isArray(saved) ? saved : [])
      }catch{ setSavedCourses([]) }

      try{
        const attempts = JSON.parse(localStorage.getItem(`quizAttempts_${userId}`) || '[]')
        setQuizAttempts(Array.isArray(attempts) ? attempts : [])
      }catch{ setQuizAttempts([]) }

      try{
        if(token){
          const p = await getMyProgress()
          setProgress(p)
        }
      }catch(e){ console.error('Failed to load progress', e.response?.data || e.message) }
    }
    load()
  },[])

  // Flatten quiz attempts from progress
  const allAttempts = Array.isArray(progress?.courses)
    ? progress.courses.flatMap(c=>(c.quizAttempts||[]).map(qa=>({ cid: String(c.courseId), qa })))
    : []

  // Stats
  const totalCourses = savedCourses.length
  const totalQuizzes = allAttempts.length
  const avgScore = totalQuizzes > 0
    ? Math.round(allAttempts.reduce((sum, r) => sum + (r.qa.total > 0 ? (r.qa.score / r.qa.total) * 100 : 0), 0) / totalQuizzes)
    : 0

  return (
    <>
      <style>{STYLES}</style>
      <Navbar/>
      <div className="sd-page-wrap">
        <div className="sd-inner">

          <p className="sd-page-tag">Student Portal</p>
          <h1 className="sd-page-title">My <span>Dashboard</span></h1>

          {/* Stats */}
          <div className="sd-stats-row sd-fade-up">
            <div className="sd-stat">
              <div className="sd-stat-label">Saved Courses</div>
              <div className="sd-stat-value sky">{totalCourses}</div>
            </div>
            <div className="sd-stat">
              <div className="sd-stat-label">Quizzes Done</div>
              <div className="sd-stat-value emerald">{totalQuizzes}</div>
            </div>
            <div className="sd-stat">
              <div className="sd-stat-label">Avg. Score</div>
              <div className="sd-stat-value violet">{avgScore}%</div>
            </div>
          </div>

          <div className="sd-grid">

            {/* Profile */}
            <div className="sd-card sd-fade-up">
              <div className="sd-card-header">
                <span className="sd-card-title">My <span>Profile</span></span>
              </div>
              <div className="sd-card-body">
                <div className="sd-profile-row">
                  <img
                    src={profile.avatarUrl
                      ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:5000${profile.avatarUrl}`)
                      : 'https://via.placeholder.com/80'}
                    alt="avatar"
                    className="sd-profile-avatar"
                  />
                  <div>
                    <div className="sd-profile-name">{profile.username || 'Unnamed'}</div>
                    <div className="sd-profile-meta">{profile.email || ''}</div>
                    <div className="sd-profile-meta">📞 {profile.phone || '—'}</div>
                  </div>
                </div>

                {editingProfile ? (
                  <div>
                    <div className="sd-field-group">
                      <label className="sd-field-label">Name</label>
                      <input className="sd-field-input" placeholder="Name" value={profile.username} onChange={e=>setProfile({...profile, username: e.target.value})} />
                    </div>
                    <div className="sd-field-group">
                      <label className="sd-field-label">Phone</label>
                      <input className="sd-field-input" placeholder="Phone" value={profile.phone} onChange={e=>setProfile({...profile, phone: e.target.value})} />
                    </div>
                    <div className="sd-field-group">
                      <label className="sd-field-label">Avatar</label>
                      <input className="sd-field-input" type="file" accept="image/*" onChange={async (e)=>{
                        const file = e.target.files?.[0]
                        if(!file) return
                        const reader = new FileReader()
                        reader.onload = ()=>{ setAvatarFile(reader.result) }
                        reader.readAsDataURL(file)
                      }} />
                    </div>
                    <button className="sd-btn-primary" onClick={async()=>{
                      try{
                        await axios.put('http://localhost:5000/api/auth/me', {
                          username: profile.username, phone: profile.phone, avatarFile: avatarFile || null
                        }, { headers:{ Authorization:`Bearer ${token}` } })
                        setEditingProfile(false)
                      }catch(err){ console.error('Profile update failed', err.response?.data || err.message) }
                    }}>Save</button>
                    <button className="sd-btn-ghost" onClick={()=>setEditingProfile(false)}>Cancel</button>
                  </div>
                ) : (
                  <button className="sd-btn-primary" style={{width:'100%', textAlign:'center'}} onClick={()=>setEditingProfile(true)}>Edit Profile</button>
                )}
              </div>
            </div>

            {/* Saved Courses */}
            <div className="sd-card sd-fade-up sd-delay-1">
              <div className="sd-card-header">
                <span className="sd-card-title">Saved <span>Courses</span></span>
                <span style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  minWidth:'22px', height:'22px', padding:'0 7px',
                  background:'rgba(56,189,248,0.12)', color:'var(--sky)',
                  borderRadius:'20px', fontSize:'11px', fontWeight:700
                }}>{totalCourses}</span>
              </div>
              <div className="sd-card-body">
                {savedCourses.length === 0 ? (
                  <p className="sd-empty">No saved courses yet.</p>
                ) : (
                  <ul className="sd-list">
                    {savedCourses.map((c)=>(
                      <li key={c._id} className="sd-list-item">
                        <div>
                          <div className="sd-list-title">{c.title}</div>
                          <div className="sd-list-sub">{c.description}</div>
                        </div>
                        <a href={`/course/${c._id}`} className="sd-view-link">View →</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Completed Quizzes */}
            <div className="sd-card sd-full sd-fade-up sd-delay-2">
              <div className="sd-card-header">
                <span className="sd-card-title">Quiz <span>History</span></span>
                <span style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  minWidth:'22px', height:'22px', padding:'0 7px',
                  background:'rgba(52,211,153,0.1)', color:'var(--emerald)',
                  borderRadius:'20px', fontSize:'11px', fontWeight:700
                }}>{totalQuizzes}</span>
              </div>
              <div className="sd-card-body">
                {allAttempts.length === 0 ? (
                  <p className="sd-empty">No quiz attempts yet.</p>
                ) : (
                  <ul className="sd-list">
                    {allAttempts.slice().reverse().map((row, idx)=>(
                      <li key={idx} className="sd-list-item">
                        <div>
                          <div className="sd-course-ref">Course ···{row.cid.slice(-6)}</div>
                          <div className="sd-quiz-score">
                            ✓ {row.qa.score} / {row.qa.total}
                            <span style={{fontSize:'11px', fontWeight:400, color:'var(--muted)', marginLeft:'4px'}}>
                              ({row.qa.total > 0 ? Math.round((row.qa.score/row.qa.total)*100) : 0}%)
                            </span>
                          </div>
                          <div className="sd-quiz-date">{new Date(row.qa.ts).toLocaleString()}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default StudentDashboard