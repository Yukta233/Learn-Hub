import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import { markVideoComplete } from "../services/api"
import { THEME } from "./theme"

const pageStyles = `
  ${THEME}

  .detail-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 28px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .detail-layout { grid-template-columns: 1fr; }
  }

  /* Left: video list */
  .video-list { display: flex; flex-direction: column; gap: 18px; }

  .video-card {
    background: rgba(7,18,32,0.8);
    border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
    transition: border-color 0.25s;
  }
  .video-card:hover { border-color: var(--border-hover); }

  .video-card-header {
    padding: 14px 18px;
    display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid var(--border);
  }
  .video-card-num {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--sky);
  }
  .video-card-title {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; flex: 1;
  }
  .video-card-body { padding: 16px 18px; }

  .video-embed-wrap {
    position: relative; padding-bottom: 56.25%; height: 0;
    overflow: hidden; border-radius: 10px; background: #000;
  }
  .video-embed-wrap iframe,
  .video-embed-wrap video {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  }

  .mark-btn {
    margin-top: 12px; padding: 9px 18px;
    background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25);
    border-radius: 8px; color: var(--emerald); font-size: 13px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: background 0.2s;
  }
  .mark-btn:hover { background: rgba(52,211,153,0.18); }

  /* Right: course info sidebar */
  .sidebar {
    position: sticky; top: 96px;
    background: rgba(7,18,32,0.85);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 24px;
    backdrop-filter: blur(16px);
  }

  .sidebar-price {
    font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800;
    color: var(--sky); margin-bottom: 18px;
  }

  .sidebar-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .sidebar-row:last-of-type { border-bottom: none; }
  .sidebar-key { color: var(--muted); }
  .sidebar-val { color: var(--text); font-weight: 600; }

  .course-page-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(26px, 4vw, 38px); font-weight: 800;
    letter-spacing: -0.02em; margin-bottom: 10px;
  }
  .course-page-desc {
    font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 24px;
  }
`

function CourseDetails() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axios.get(`http://localhost:5000/api/courses/${id}`)
      setCourse(res.data)
    }
    fetchCourse()
  }, [id])

  if (!course) return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="state-screen">
          <div className="spinner" />
          <span>Loading course…</span>
        </div>
      </div>
    </>
  )

  const videos = Array.isArray(course.videos) ? course.videos : []

  return (
    <>
      <style>{pageStyles}</style>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner">
          <div className="page-header fade-up">
            <div className="page-tag">Course Details</div>
            <h1 className="course-page-title">{course.title}</h1>
            <p className="course-page-desc">{course.description}</p>
          </div>

          <div className="detail-layout">
            {/* Video list */}
            <div>
              <div className="section-label fade-up delay-1">
                {videos.length} {videos.length === 1 ? "Video" : "Videos"}
              </div>
              {videos.length === 0 ? (
                <div className="glass-card" style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>
                  No videos available yet.
                </div>
              ) : (
                <div className="video-list">
                  {videos.map((video, index) => {
                    const url = video.url || ""
                    const m1 = url.match(/youtu\.be\/([^?&]+)/)
                    const m2 = url.match(/youtube\.com\/watch\?v=([^&]+)/)
                    const m3 = url.match(/youtube\.com\/embed\/([^?&]+)/)
                    const ytId = (m1 && m1[1]) || (m2 && m2[1]) || (m3 && m3[1])
                    const isDirect = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)

                    return (
                      <div key={index} className="video-card fade-up" style={{ animationDelay: `${index * 0.07}s` }}>
                        <div className="video-card-header">
                          <div className="video-card-num">{index + 1}</div>
                          <div className="video-card-title">{video.title || `Video ${index + 1}`}</div>
                          <span className="badge badge-violet">🎬</span>
                        </div>
                        <div className="video-card-body">
                          {ytId ? (
                            <div className="video-embed-wrap">
                              <iframe
                                src={`https://www.youtube.com/embed/${ytId}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={`video-${index}`}
                              />
                            </div>
                          ) : isDirect ? (
                            <div className="video-embed-wrap" style={{ paddingBottom: "40%" }}>
                              <video
                                controls
                                src={url}
                                style={{ borderRadius: "10px" }}
                                onEnded={() => {
                                  const videoId = video.title || url
                                  markVideoComplete(id, videoId).catch(() => {})
                                }}
                              />
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <a href={url} target="_blank" rel="noreferrer" style={{ color: "var(--sky)", fontSize: 13 }}>{url}</a>
                              <button className="mark-btn" onClick={() => {
                                const videoId = video.title || url
                                markVideoComplete(id, videoId).catch(() => {})
                              }}>✓ Mark Completed</button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="sidebar fade-up delay-2">
              <div className="sidebar-price">${course.price}</div>
              <div className="sidebar-row">
                <span className="sidebar-key">Instructor</span>
                <span className="sidebar-val">{course.instructor?.username || "—"}</span>
              </div>
              <div className="sidebar-row">
                <span className="sidebar-key">Videos</span>
                <span className="sidebar-val">{videos.length}</span>
              </div>
              <div className="sidebar-row">
                <span className="sidebar-key">Level</span>
                <span className="sidebar-val"><span className="badge badge-sky">All Levels</span></span>
              </div>
              <div style={{ marginTop: 20 }}>
                {/* <button className="btn-primary" style={{ width: "100%", textAlign: "center" }}>Enroll Now</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetails