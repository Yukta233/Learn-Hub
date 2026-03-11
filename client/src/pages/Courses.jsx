import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { THEME } from "./theme"

const pageStyles = `
  ${THEME}

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 22px;
    margin-top: 8px;
  }

  .course-card {
    background: rgba(7,18,32,0.8);
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    display: flex; flex-direction: column;
  }
  .course-card:hover {
    transform: translateY(-5px);
    border-color: var(--border-hover);
    box-shadow: 0 16px 48px rgba(0,0,0,0.45);
  }

  .course-thumb {
    height: 130px;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    font-size: 44px;
  }
  .course-thumb::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(7,18,32,0.95) 100%);
  }

  .course-body { padding: 20px 22px 22px; flex: 1; display: flex; flex-direction: column; }

  .course-title {
    font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
    margin-bottom: 8px; line-height: 1.3; color: var(--text);
  }

  .course-desc {
    font-size: 13px; color: var(--muted); line-height: 1.65;
    margin-bottom: 14px; flex: 1;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  .course-meta {
    display: flex; align-items: center; gap: 10px;
    flex-wrap: wrap; margin-bottom: 16px;
  }
  .course-meta-item { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
  .course-price {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;
    color: var(--sky); margin-left: auto;
  }

  .course-videos-section { margin: 14px 0; }
  .video-accordion-toggle {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: 10px 14px; background: rgba(14,28,46,0.7); border: 1px solid var(--border);
    border-radius: 9px; cursor: pointer; font-size: 13px; font-weight: 500;
    color: var(--muted); font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s;
  }
  .video-accordion-toggle:hover { border-color: var(--border-hover); color: var(--text); }

  .video-item { margin-top: 10px; }
  .video-label { font-size: 13px; font-weight: 600; color: var(--muted); margin-bottom: 7px; }

  .course-actions { display: flex; gap: 8px; margin-top: 4px; }
  .course-actions .btn-primary { flex: 1; text-align: center; }
  .course-actions .btn-ghost   { flex: 1; }

  /* ── SEARCH BAR ── */
  .search-wrap {
    position: relative;
    margin-bottom: 32px;
  }
  .search-icon {
    position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
    color: var(--dim); font-size: 16px; pointer-events: none;
    display: flex; align-items: center;
  }
  .search-input {
    width: 100%;
    padding: 15px 50px 15px 50px;
    background: rgba(7,18,32,0.85);
    border: 1px solid var(--border);
    border-radius: 14px;
    color: var(--text);
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .search-input::placeholder { color: var(--dim); }
  .search-input:focus {
    border-color: rgba(56,189,248,0.45);
    box-shadow: 0 0 0 4px rgba(56,189,248,0.08), 0 4px 24px rgba(0,0,0,0.25);
  }
  .search-clear {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2);
    color: var(--muted); border-radius: 7px; padding: 4px 10px;
    font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, color 0.2s;
  }
  .search-clear:hover { background: rgba(56,189,248,0.18); color: var(--text); }

  /* ── FILTER CHIPS ── */
  .filter-row {
    display: flex; gap: 10px; flex-wrap: wrap;
    margin-bottom: 28px; align-items: center;
  }
  .filter-label {
    font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--dim); font-weight: 600;
  }
  .filter-chip {
    padding: 6px 16px; border-radius: 20px;
    font-size: 12px; font-weight: 600; cursor: pointer;
    border: 1px solid var(--border);
    background: transparent; color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .filter-chip:hover { border-color: var(--border-hover); color: var(--text); }
  .filter-chip.active {
    background: linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.18));
    border-color: rgba(56,189,248,0.4);
    color: var(--sky);
  }

  /* ── RESULTS INFO ── */
  .results-info {
    font-size: 13px; color: var(--dim);
    margin-bottom: 20px;
  }
  .results-info strong { color: var(--sky); font-weight: 700; }

  /* ── HIGHLIGHT MATCH ── */
  .highlight { color: var(--sky); font-weight: 700; }

  /* ── NO RESULTS ── */
  .no-results {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 72px 0;
    color: var(--dim); gap: 14px;
  }
  .no-results-icon { font-size: 48px; opacity: 0.4; }
  .no-results-text { font-size: 15px; }
  .no-results-sub { font-size: 13px; color: var(--dim); }
`

const THUMBS = [
  "linear-gradient(135deg,#1e3a4a,#0f2535)",
  "linear-gradient(135deg,#1a3a2a,#0e2018)",
  "linear-gradient(135deg,#3a1a3a,#20102a)",
  "linear-gradient(135deg,#2a1a3a,#1a0f28)",
  "linear-gradient(135deg,#3a2a1a,#281a0e)",
  "linear-gradient(135deg,#1a2a3a,#0e1828)",
]
const ICONS = ["⚛️","🐍","🎨","☁️","🔐","📱","🧠","⚙️","📊","🌐"]

function highlightText(text, query) {
  if (!query || !text) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="highlight">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

function VideoBlock({ v, idx }) {
  const url = v.url || ""
  const m1 = url.match(/youtu\.be\/([^?&]+)/)
  const m2 = url.match(/youtube\.com\/watch\?v=([^&]+)/)
  const m3 = url.match(/youtube\.com\/embed\/([^?&]+)/)
  const ytId = (m1 && m1[1]) || (m2 && m2[1]) || (m3 && m3[1])
  const isDirect = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)

  return (
    <div className="video-item">
      <div className="video-label">{v.title || `Video ${idx + 1}`}</div>
      {ytId ? (
        <div style={{ position:"relative", paddingBottom:"56.25%", height:0, overflow:"hidden", borderRadius:"10px" }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`video-${idx}`}
            style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%" }}
          />
        </div>
      ) : isDirect ? (
        <video controls style={{ width:"100%", borderRadius:"10px", background:"#000" }} src={url} />
      ) : (
        <a href={url} target="_blank" rel="noreferrer" style={{ color:"var(--sky)", fontSize:13 }}>{url}</a>
      )}
    </div>
  )
}

function CourseCard({ course, index, saveCourse, searchQuery }) {
  const [showVideos, setShowVideos] = useState(false)
  const bg = THUMBS[index % THUMBS.length]
  const icon = ICONS[index % ICONS.length]
  const hasVideos = Array.isArray(course.videos) && course.videos.length > 0

  return (
    <div className="course-card fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="course-thumb" style={{ background: bg }}>{icon}</div>
      <div className="course-body">
        <div className="course-title">{highlightText(course.title, searchQuery)}</div>
        <div className="course-desc">{highlightText(course.description, searchQuery)}</div>
        <div className="course-meta">
          <span className="badge badge-sky">👤 {course.instructor?.username || "Instructor"}</span>
          {hasVideos && <span className="badge badge-violet">🎬 {course.videos.length} videos</span>}
          <span className="course-price">${course.price}</span>
        </div>

        {hasVideos && (
          <div className="course-videos-section">
            <button className="video-accordion-toggle" onClick={() => setShowVideos(v => !v)}>
              <span>Course Videos</span>
              <span>{showVideos ? "▲" : "▼"}</span>
            </button>
            {showVideos && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
                {course.videos.map((v, idx) => <VideoBlock key={idx} v={v} idx={idx} />)}
              </div>
            )}
          </div>
        )}

        <div className="course-actions">
          <Link to={`/course/${course._id}`} className="btn-primary">View Course</Link>
          <button className="btn-ghost" onClick={() => saveCourse(course)}>Save</button>
        </div>
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { key: "default", label: "Default" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "price-desc", label: "Price: High → Low" },
  { key: "videos", label: "Most Videos" },
]

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortKey, setSortKey] = useState("default")
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses")
        setCourses(res.data)
      } catch (err) {
        console.error("Failed to load courses:", err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const saveCourse = (course) => {
    if (!userId) { alert("Please login as a student to save courses"); return }
    try {
      const key = `savedCourses_${userId}`
      const prev = JSON.parse(localStorage.getItem(key) || "[]")
      const exists = prev.some(c => c._id === course._id)
      const next = exists ? prev : [...prev, course]
      localStorage.setItem(key, JSON.stringify(next))
      alert(exists ? "Course already saved" : "Course saved!")
    } catch (e) { console.error("Save course failed", e) }
  }

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let result = courses

    if (q) {
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.instructor?.username?.toLowerCase().includes(q)
      )
    }

    if (sortKey === "price-asc")  return [...result].sort((a,b) => (a.price||0) - (b.price||0))
    if (sortKey === "price-desc") return [...result].sort((a,b) => (b.price||0) - (a.price||0))
    if (sortKey === "videos")     return [...result].sort((a,b) => (b.videos?.length||0) - (a.videos?.length||0))
    return result
  }, [courses, searchQuery, sortKey])

  return (
    <>
      <style>{pageStyles}</style>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner">

          <div className="page-header fade-up">
            <div className="page-tag">Browse</div>
            <h1 className="page-title">All <span>Courses</span></h1>
          </div>

          {/* Search bar */}
          <div className="search-wrap fade-up">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by title, description, or instructor…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery("")}>✕ Clear</button>
            )}
          </div>

          {/* Sort chips */}
          <div className="filter-row fade-up">
            <span className="filter-label">Sort by</span>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                className={`filter-chip ${sortKey === opt.key ? "active" : ""}`}
                onClick={() => setSortKey(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Results info */}
          {!loading && (
            <div className="results-info fade-up">
              {searchQuery
                ? <>Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""} for "<strong>{searchQuery}</strong>"</>
                : <><strong>{filtered.length}</strong> course{filtered.length !== 1 ? "s" : ""} available</>
              }
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="state-screen">
              <div className="spinner" />
              <span>Loading courses…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <div className="no-results-text">No courses found</div>
              <div className="no-results-sub">Try a different keyword or clear the search</div>
              <button className="btn-ghost" style={{marginTop:'8px'}} onClick={() => setSearchQuery("")}>Clear Search</button>
            </div>
          ) : (
            <div className="courses-grid">
              {filtered.map((course, i) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  index={i}
                  saveCourse={saveCourse}
                  searchQuery={searchQuery.trim()}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default Courses