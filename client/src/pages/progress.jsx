import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import API, { getMyProgress } from '../services/api'
import { THEME } from './theme'

const pageStyles = `
  ${THEME}

  .progress-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
  @media (max-width: 760px) { .progress-grid { grid-template-columns: 1fr; } }

  .chart-wrap {
    background: rgba(7,18,32,0.8); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px 22px; overflow: hidden;
  }
  .chart-title {
    font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--dim); margin-bottom: 16px; font-weight: 600;
  }

  .course-progress-card {
    background: rgba(7,18,32,0.8); border: 1px solid var(--border);
    border-radius: 16px; padding: 22px 24px; margin-bottom: 16px;
    transition: border-color 0.25s;
  }
  .course-progress-card:hover { border-color: var(--border-hover); }

  .course-progress-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 16px;
  }
  .course-progress-name {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
  }
  .course-updated { font-size: 11px; color: var(--dim); }

  .progress-section { margin-top: 16px; }
  .progress-section-title {
    font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--dim); font-weight: 600; margin-bottom: 10px;
  }

  .video-pill {
    display: inline-block; padding: 4px 10px; border-radius: 6px;
    background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.15);
    color: var(--emerald); font-size: 12px; margin: 3px;
  }

  .quiz-attempt-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: 9px;
    background: rgba(14,28,46,0.6); border: 1px solid var(--border);
    margin-bottom: 8px;
  }
  .quiz-score { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: var(--text); }
  .quiz-date  { font-size: 11px; color: var(--dim); }
  .quiz-frac  { font-size: 12px; color: var(--muted); }
`

function AttemptsChart({ data }) {
  const keys = Object.keys(data)
  const max = Math.max(1, ...keys.map(k => data[k].attempts || 0))
  const width = 480, height = 160, pad = 28
  const barW = (width - pad * 2) / Math.max(1, keys.length)
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {keys.map((k, i) => {
        const v = data[k].attempts || 0
        const h = (v / max) * (height - pad * 2)
        return (
          <g key={k}>
            <rect x={pad + i * barW + 8} y={height - pad - h} width={barW - 16} height={Math.max(h, 2)} rx="4"
              fill="url(#skyGrad)" opacity="0.9" />
            <text x={pad + i * barW + barW / 2} y={height - 6} fill="#4a6a88" fontSize="9" textAnchor="middle">{k.slice(-4)}</text>
            {v > 0 && <text x={pad + i * barW + barW / 2} y={height - pad - h - 6} fill="#e2eaf5" fontSize="9" textAnchor="middle">{v}</text>}
          </g>
        )
      })}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function VideosChart({ data }) {
  const keys = Object.keys(data)
  const max = Math.max(1, ...keys.map(k => data[k].videos || 0))
  const width = 480, height = 160, pad = 28
  const barW = (width - pad * 2) / Math.max(1, keys.length)
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {keys.map((k, i) => {
        const v = data[k].videos || 0
        const h = (v / max) * (height - pad * 2)
        return (
          <g key={k}>
            <rect x={pad + i * barW + 8} y={height - pad - h} width={barW - 16} height={Math.max(h, 2)} rx="4"
              fill="url(#emGrad)" opacity="0.9" />
            <text x={pad + i * barW + barW / 2} y={height - 6} fill="#4a6a88" fontSize="9" textAnchor="middle">{k.slice(-4)}</text>
            {v > 0 && <text x={pad + i * barW + barW / 2} y={height - pad - h - 6} fill="#e2eaf5" fontSize="9" textAnchor="middle">{v}</text>}
          </g>
        )
      })}
      <defs>
        <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ProgressBar({ value = 0, total = 0 }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
        <span>{value} / {total} videos</span>
        <span style={{ color: "var(--sky)", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function MiniAttempts({ attempts = [] }) {
  const arr = Array.isArray(attempts) ? attempts : []
  const width = 200, height = 40, pad = 4
  const n = Math.max(1, arr.length)
  const barW = (width - pad * 2) / n
  return (
    <svg width={width} height={height} style={{ borderRadius: 6, display: "block" }}>
      {arr.map((a, i) => {
        const frac = (typeof a?.score === "number" && typeof a?.total === "number" && a.total > 0) ? (a.score / a.total) : 0
        const h = frac * (height - pad * 2)
        return (
          <rect key={i} x={pad + i * barW + 2} y={height - pad - h} width={barW - 4} height={Math.max(h, 2)} rx="3"
            fill="#60a5fa" opacity="0.8" />
        )
      })}
    </svg>
  )
}

function ProgressPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const timerRef = useRef(null)
  const [courseMap, setCourseMap] = useState({})

  const load = async () => {
    try {
      setError('')
      const res = await getMyProgress()
      setData(res)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load progress')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    timerRef.current = setInterval(load, 30000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const courses = Array.isArray(data?.courses) ? data.courses : []

  useEffect(() => {
    let aborted = false
    const fetchMissing = async () => {
      try {
        const ids = courses.map(c => String(c.courseId))
        const missing = ids.filter(id => !courseMap[id])
        if (missing.length === 0) return
        const pairs = await Promise.all(missing.map(async (id) => {
          try {
            const res = await API.get(`/api/courses/${id}`)
            return [id, res.data]
          } catch { return [id, null] }
        }))
        if (!aborted) {
          const next = { ...courseMap }
          pairs.forEach(([id, co]) => { if (co) next[id] = co })
          setCourseMap(next)
        }
      } catch {}
    }
    fetchMissing()
    return () => { aborted = true }
  }, [courses])

  const computeAnalytics = (list) => {
    const byCourse = {}
    let totalAttempts = 0, totalVideos = 0
    const safeList = Array.isArray(list) ? list : []
    for (const c of safeList) {
      const cid = `${c?.courseId ?? ''}`
      const attemptsArr = Array.isArray(c?.quizAttempts) ? c.quizAttempts : []
      const videosArr = Array.isArray(c?.videosCompleted) ? c.videosCompleted : []
      const attempts = attemptsArr.length
      const videos = videosArr.length
      totalAttempts += attempts; totalVideos += videos
      let sum = 0
      for (const qa of attemptsArr) {
        const s = typeof qa?.score === 'number' && isFinite(qa.score) ? qa.score : 0
        sum += s
      }
      const avg = attempts > 0 ? Math.round((sum / attempts) * 100) / 100 : 0
      byCourse[cid] = { attempts, avg, videos }
    }
    return { byCourse, totalAttempts, totalVideos }
  }
  const analytics = computeAnalytics(courses)

  if (loading) return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="state-screen"><div className="spinner" /><span>Loading progress…</span></div>
      </div>
    </>
  )

  if (error) return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="state-screen" style={{ color: "var(--rose)" }}>⚠ {error}</div>
      </div>
    </>
  )

  return (
    <>
      <style>{pageStyles}</style>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner">
          <div className="page-header fade-up">
            <div className="page-tag">Student</div>
            <h1 className="page-title">My <span>Progress</span></h1>
          </div>

          {/* Stats */}
          <div className="stats-grid fade-up delay-1">
            <div className="stat-card">
              <div className="stat-card-label">Courses Tracked</div>
              <div className="stat-card-value sky">{courses.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Quiz Attempts</div>
              <div className="stat-card-value violet">{analytics.totalAttempts}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Videos Completed</div>
              <div className="stat-card-value emerald">{analytics.totalVideos}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="progress-grid fade-up delay-2">
            <div className="chart-wrap">
              <div className="chart-title">Quiz Attempts by Course</div>
              <AttemptsChart data={analytics.byCourse} />
            </div>
            <div className="chart-wrap">
              <div className="chart-title">Videos Completed by Course</div>
              <VideosChart data={analytics.byCourse} />
            </div>
          </div>

          {/* Per-course */}
          <div className="section-label fade-up delay-3">Course Breakdown</div>
          {courses.length === 0 ? (
            <div className="glass-card" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              No progress yet. Watch videos or take quizzes to see your data here.
            </div>
          ) : (
            courses.map((c, idx) => (
              <div key={idx} className="course-progress-card fade-up" style={{ animationDelay: `${idx * 0.07}s` }}>
                <div className="course-progress-header">
                  <div>
                    <div className="course-progress-name">
                      {courseMap[String(c.courseId)]?.title || `Course ${String(c.courseId).slice(-6)}`}
                    </div>
                    <div className="course-updated">Updated {new Date(c.updatedAt).toLocaleString()}</div>
                  </div>
                  <span className="badge badge-sky">{(Array.isArray(c.videosCompleted) ? c.videosCompleted.length : 0)} videos done</span>
                </div>

                <ProgressBar
                  value={Array.isArray(c.videosCompleted) ? c.videosCompleted.length : 0}
                  total={courseMap[String(c.courseId)]?.videos?.length || 0}
                />

                {Array.isArray(c.videosCompleted) && c.videosCompleted.length > 0 && (
                  <div className="progress-section">
                    <div className="progress-section-title">Completed Videos</div>
                    <div>{c.videosCompleted.map((vid, i) => <span key={i} className="video-pill">✓ {vid}</span>)}</div>
                  </div>
                )}

                <div className="progress-section">
                  <div className="progress-section-title">
                    Quiz Attempts
                    {c.latestScore != null && (
                      <span className="badge badge-amber" style={{ marginLeft: 8 }}>
                        Latest: {c.latestScore}/{c.latestTotal}
                      </span>
                    )}
                  </div>
                  {Array.isArray(c.quizAttempts) && c.quizAttempts.length > 0 ? (
                    <>
                      <MiniAttempts attempts={c.quizAttempts} />
                      <div style={{ marginTop: 10 }}>
                        {c.quizAttempts.slice().reverse().map((qa, qi) => (
                          <div key={qi} className="quiz-attempt-row">
                            <div>
                              <div className="quiz-score">{qa.score} / {qa.total}</div>
                              <div className="quiz-frac">{qa.total > 0 ? Math.round((qa.score / qa.total) * 100) : 0}% correct</div>
                            </div>
                            <div className="quiz-date">{new Date(qa.ts).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ color: "var(--dim)", fontSize: 13 }}>No quiz attempts yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default ProgressPage