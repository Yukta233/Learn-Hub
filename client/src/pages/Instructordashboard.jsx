import { useState, useEffect } from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import Navbar from "../components/Navbar"

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

  .id-page-wrap {
    min-height: 100vh;
    background: var(--bg);
    padding-top: 88px;
    position: relative;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
  }
  .id-page-wrap::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 55% 40% at 15% 20%, rgba(56,189,248,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 50% at 85% 70%, rgba(129,140,248,0.05) 0%, transparent 70%);
  }
  .id-page-wrap::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  .id-inner {
    position: relative; z-index: 1;
    padding: 48px 7% 80px;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 28px;
  }

  /* ── PAGE HEADER ── */
  .id-page-tag {
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--sky); font-weight: 600; margin-bottom: 8px;
  }
  .id-page-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(24px, 3.5vw, 36px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 28px;
  }
  .id-page-title span { color: var(--sky); }

  /* ── GLASS CARD ── */
  .id-card {
    background: rgba(7,18,32,0.7);
    border: 1px solid var(--border);
    border-radius: 18px;
    backdrop-filter: blur(16px);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    margin-bottom: 20px;
  }
  .id-card-header {
    padding: 20px 24px 18px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .id-card-title {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
    letter-spacing: -0.01em;
  }
  .id-card-title span { color: var(--sky); }
  .id-card-body { padding: 22px 24px; }

  /* ── SECTION DIVIDER ── */
  .id-section-label {
    font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--dim); font-weight: 600; margin-bottom: 16px; margin-top: 28px;
    display: flex; align-items: center; gap: 10px;
  }
  .id-section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── FORM FIELDS ── */
  .id-field-group { margin-bottom: 14px; }
  .id-field-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--dim); margin-bottom: 7px;
  }
  .id-field-input {
    width: 100%; padding: 11px 14px;
    background: rgba(14,28,46,0.8); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text); font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .id-field-input::placeholder { color: var(--dim); }
  .id-field-input:focus { border-color: rgba(56,189,248,0.4); box-shadow: 0 0 0 3px rgba(56,189,248,0.07); }

  /* 2-column form grid */
  .id-form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }

  /* ── BUTTONS ── */
  .id-btn-primary {
    padding: 10px 22px; border-radius: 9px;
    background: linear-gradient(135deg, var(--sky), var(--violet));
    color: #fff; font-size: 14px; font-weight: 600;
    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 3px 14px rgba(56,189,248,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-flex; align-items: center; gap: 7px;
  }
  .id-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(56,189,248,0.38); }

  .id-btn-ghost {
    padding: 10px 22px; border-radius: 9px;
    background: transparent; color: var(--muted);
    font-size: 14px; font-weight: 500;
    border: 1px solid var(--border); cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .id-btn-ghost:hover { border-color: var(--border-hover); color: var(--text); background: rgba(56,189,248,0.06); }

  .id-btn-danger {
    padding: 7px 14px; border-radius: 7px;
    background: transparent; color: var(--rose);
    font-size: 12px; font-weight: 600;
    border: 1px solid rgba(248,113,113,0.2);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
  }
  .id-btn-danger:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.4); }

  .id-btn-edit {
    padding: 7px 14px; border-radius: 7px;
    background: rgba(56,189,248,0.1); color: var(--sky);
    font-size: 12px; font-weight: 600;
    border: 1px solid rgba(56,189,248,0.2);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
  }
  .id-btn-edit:hover { background: rgba(56,189,248,0.18); }

  .id-btn-save {
    padding: 7px 14px; border-radius: 7px;
    background: rgba(52,211,153,0.12); color: var(--emerald);
    font-size: 12px; font-weight: 600;
    border: 1px solid rgba(52,211,153,0.2);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
    margin-right: 6px;
  }
  .id-btn-save:hover { background: rgba(52,211,153,0.2); }

  .id-btn-row { display: flex; gap: 8px; margin-top: 12px; }

  /* ── LIST ITEMS ── */
  .id-list { list-style: none; padding: 0; margin: 0; }
  .id-list-item {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .id-list-item:last-child { border-bottom: none; }
  .id-list-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .id-list-sub { font-size: 12px; color: var(--muted); }
  .id-list-answer { font-size: 12px; color: var(--emerald); margin-top: 2px; }

  /* ── ITEM COUNT BADGE ── */
  .id-count-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 22px; height: 22px; padding: 0 7px;
    background: rgba(56,189,248,0.12); color: var(--sky);
    border-radius: 20px; font-size: 11px; font-weight: 700;
  }

  /* ── EMPTY STATE ── */
  .id-empty {
    padding: 20px 0; text-align: center; color: var(--dim); font-size: 13px;
  }

  /* ── MESSAGE ── */
  .id-message {
    margin-top: 14px; padding: 12px 16px;
    border-radius: 10px; font-size: 13px; font-weight: 500;
  }
  .id-message.success {
    background: rgba(52,211,153,0.1); color: var(--emerald);
    border: 1px solid rgba(52,211,153,0.2);
  }
  .id-message.error {
    background: rgba(248,113,113,0.1); color: var(--rose);
    border: 1px solid rgba(248,113,113,0.2);
  }

  /* ── COURSE ITEM ── */
  .id-course-item {
    background: rgba(11,26,46,0.6);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    transition: border-color 0.2s;
  }
  .id-course-item:hover { border-color: var(--border-hover); }
  .id-course-price {
    display: inline-block; padding: 2px 8px; border-radius: 6px;
    background: rgba(251,191,36,0.12); color: var(--amber);
    font-size: 11px; font-weight: 700; margin-left: 8px;
  }

  /* ── PROFILE PANEL ── */
  .id-profile-avatar {
    width: 72px; height: 72px; border-radius: 50%; object-fit: cover;
    border: 2px solid rgba(56,189,248,0.25);
    box-shadow: 0 0 20px rgba(56,189,248,0.12);
  }
  .id-profile-row { display: flex; align-items: center; gap: 14px; margin-top: 12px; margin-bottom: 16px; }
  .id-profile-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; }
  .id-profile-meta { font-size: 12px; color: var(--muted); margin-top: 3px; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .id-fade-up { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .id-delay-1 { animation-delay: 0.08s; }
  .id-delay-2 { animation-delay: 0.16s; }
  .id-delay-3 { animation-delay: 0.24s; }

  /* ── HR ── */
  .id-hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }

  /* Responsive */
  @media (max-width: 900px) {
    .id-inner { grid-template-columns: 1fr; }
    .id-form-grid { grid-template-columns: 1fr; }
  }
`

function InstructorDashboard(){

const [title,setTitle] = useState("")
const [description,setDescription] = useState("")
const [instructor,setInstructor] = useState("")
const [price,setPrice] = useState(0)

const [videoTitle,setVideoTitle] = useState("")
const [videoUrl,setVideoUrl] = useState("")
const [videos,setVideos] = useState([])

const [question,setQuestion] = useState("")
const [option1,setOption1] = useState("")
const [option2,setOption2] = useState("")
const [option3,setOption3] = useState("")
const [option4,setOption4] = useState("")
const [correct,setCorrect] = useState("")
const [quiz,setQuiz] = useState([])

const removeVideo = (index) => {
 setVideos(videos.filter((_, i) => i !== index))
}

const removeQuiz = (index) => {
 setQuiz(quiz.filter((_, i) => i !== index))
}

const [message,setMessage] = useState("")
const [messageType,setMessageType] = useState("success")

const [myCourses, setMyCourses] = useState([])
const [myQuizzes, setMyQuizzes] = useState([])
const [editingCourseId, setEditingCourseId] = useState(null)
const [editCourseData, setEditCourseData] = useState({ title:"", description:"", price:0, videos:[] })
const [editingQuizId, setEditingQuizId] = useState(null)
const [editQuizQuestions, setEditQuizQuestions] = useState([])

const [profile, setProfile] = useState({ username:'', email:'', phone:'', avatarUrl:'' })
const [editingProfile, setEditingProfile] = useState(false)
const [avatarFile, setAvatarFile] = useState(null)

const token = localStorage.getItem("token")

const addVideo = ()=>{
  const newVideo = { title:videoTitle, url:videoUrl }
  setVideos([...videos,newVideo])
  setVideoTitle("")
  setVideoUrl("")
}

const addQuiz = ()=>{
  const newQuiz = { question, options:[option1,option2,option3,option4], correctAnswer:correct }
  setQuiz([...quiz,newQuiz])
  setQuestion(""); setOption1(""); setOption2(""); setOption3(""); setOption4(""); setCorrect("")
}

const createCourse = async ()=>{
  try{
    const res = await axios.post(
      "http://localhost:5000/api/courses/create",
      { title, description, price: Number(price) || 0, videos },
      { headers:{ Authorization:`Bearer ${token}` } }
    )
    const courseId = res.data.course._id
    await axios.post(
      "http://localhost:5000/api/quizzes/create",
      { courseId, questions:quiz },
      { headers:{ Authorization:`Bearer ${token}` } }
    )
    setMessage("Course and quiz created successfully!")
    setMessageType("success")
  }catch(err){
    console.log(err.response?.data || err.message)
    setMessage("Error creating course")
    setMessageType("error")
  }
}

useEffect(()=>{
  const loadData = async()=>{
    try{
      if(!token) return
      const [coursesRes, quizzesRes, meRes] = await Promise.all([
        axios.get("http://localhost:5000/api/courses/mine", { headers:{ Authorization:`Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/quizzes/mine", { headers:{ Authorization:`Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/auth/me", { headers:{ Authorization:`Bearer ${token}` } })
      ])
      setMyCourses(coursesRes.data || [])
      setMyQuizzes(quizzesRes.data || [])
      setProfile({
        username: meRes.data?.username || '',
        email: meRes.data?.email || '',
        phone: meRes.data?.phone || '',
        avatarUrl: meRes.data?.avatarUrl || ''
      })
    }catch(err){
      console.error("Failed to load dashboard data", err.response?.data || err.message)
    }
  }
  loadData()
},[])

return(
<>
  <style>{STYLES}</style>
  <Navbar/>

  <div className="id-page-wrap">
    <div className="id-inner">

      {/* ── Left column ── */}
      <div>
        <p className="id-page-tag">Instructor Portal</p>
        <h1 className="id-page-title">Create a <span>New Course</span></h1>

        {/* Course basics */}
        <div className="id-card id-fade-up">
          <div className="id-card-header">
            <span className="id-card-title">Course Details</span>
          </div>
          <div className="id-card-body">
            <div className="id-form-grid">
              <div className="id-field-group">
                <label className="id-field-label">Course Title</label>
                <input className="id-field-input" placeholder="e.g. Advanced React Patterns" value={title} onChange={(e)=>setTitle(e.target.value)} />
              </div>
              <div className="id-field-group">
                <label className="id-field-label">Instructor Name</label>
                <input className="id-field-input" placeholder="Your name" value={instructor} onChange={(e)=>setInstructor(e.target.value)} />
              </div>
            </div>
            <div className="id-field-group">
              <label className="id-field-label">Description</label>
              <input className="id-field-input" placeholder="Brief course description…" value={description} onChange={(e)=>setDescription(e.target.value)} />
            </div>
            <div className="id-field-group" style={{maxWidth:'200px'}}>
              <label className="id-field-label">Price (USD)</label>
              <input className="id-field-input" placeholder="49.99" type="number" min="0" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="id-card id-fade-up id-delay-1">
          <div className="id-card-header">
            <span className="id-card-title">Videos <span style={{color:'var(--muted)', fontWeight:400, fontSize:'13px', fontFamily:'DM Sans'}}>— add course content</span></span>
            <span className="id-count-badge">{videos.length}</span>
          </div>
          <div className="id-card-body">
            <div className="id-form-grid">
              <div className="id-field-group">
                <label className="id-field-label">Video Title</label>
                <input className="id-field-input" placeholder="Lesson title" value={videoTitle} onChange={(e)=>setVideoTitle(e.target.value)} />
              </div>
              <div className="id-field-group">
                <label className="id-field-label">Video URL</label>
                <input className="id-field-input" placeholder="https://…" value={videoUrl} onChange={(e)=>setVideoUrl(e.target.value)} />
              </div>
            </div>
            <button className="id-btn-primary" onClick={addVideo}>+ Add Video</button>

            {videos.length > 0 && (
              <>
                <div className="id-section-label" style={{marginTop:'22px'}}>Added Videos</div>
                <ul className="id-list">
                  {videos.map((v, idx) => (
                    <li key={idx} className="id-list-item">
                      <div>
                        <div className="id-list-title">{v.title}</div>
                        <div className="id-list-sub">{v.url}</div>
                      </div>
                      <button className="id-btn-danger" onClick={()=>removeVideo(idx)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {videos.length === 0 && <p className="id-empty">No videos added yet.</p>}
          </div>
        </div>

        {/* Quiz */}
        <div className="id-card id-fade-up id-delay-2">
          <div className="id-card-header">
            <span className="id-card-title">Quiz Questions</span>
            <span className="id-count-badge">{quiz.length}</span>
          </div>
          <div className="id-card-body">
            <div className="id-field-group">
              <label className="id-field-label">Question</label>
              <input className="id-field-input" placeholder="Enter question…" value={question} onChange={(e)=>setQuestion(e.target.value)} />
            </div>
            <div className="id-form-grid">
              {[[option1,setOption1,'Option 1'],[option2,setOption2,'Option 2'],[option3,setOption3,'Option 3'],[option4,setOption4,'Option 4']].map(([val,setter,label],i)=>(
                <div key={i} className="id-field-group">
                  <label className="id-field-label">{label}</label>
                  <input className="id-field-input" placeholder={label} value={val} onChange={(e)=>setter(e.target.value)} />
                </div>
              ))}
            </div>
            <div className="id-field-group" style={{maxWidth:'280px'}}>
              <label className="id-field-label">Correct Answer</label>
              <input className="id-field-input" placeholder="Exact text of correct option" value={correct} onChange={(e)=>setCorrect(e.target.value)} />
            </div>
            <button className="id-btn-primary" onClick={addQuiz}>+ Add Question</button>

            {quiz.length > 0 && (
              <>
                <div className="id-section-label" style={{marginTop:'22px'}}>Added Questions</div>
                <ul className="id-list">
                  {quiz.map((q, idx)=> (
                    <li key={idx} className="id-list-item">
                      <div>
                        <div className="id-list-title">Q{idx+1}: {q.question}</div>
                        <div className="id-list-sub">{q.options?.join(" · ")}</div>
                        <div className="id-list-answer">✓ {q.correctAnswer}</div>
                      </div>
                      <button className="id-btn-danger" onClick={()=>removeQuiz(idx)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {quiz.length === 0 && <p className="id-empty">No questions added yet.</p>}
          </div>
        </div>

        <div style={{marginBottom:'12px'}}>
          <button className="id-btn-primary" style={{fontSize:'15px', padding:'13px 32px'}} onClick={createCourse}>
            🚀 Publish Course
          </button>
          {message && <div className={`id-message ${messageType}`}>{message}</div>}
        </div>

        <hr className="id-hr"/>

        {/* My Courses */}
        <div className="id-section-label">My Courses</div>
        {myCourses.length === 0 ? (
          <p className="id-empty">No courses yet.</p>
        ) : (
          myCourses.map(course => (
            <div key={course._id} className="id-course-item">
              {editingCourseId === course._id ? (
                <div>
                  <div className="id-form-grid">
                    <div className="id-field-group">
                      <label className="id-field-label">Title</label>
                      <input className="id-field-input" value={editCourseData.title} onChange={e=>setEditCourseData({...editCourseData, title:e.target.value})} />
                    </div>
                    <div className="id-field-group">
                      <label className="id-field-label">Price</label>
                      <input className="id-field-input" type="number" min="0" step="0.01" value={editCourseData.price} onChange={e=>setEditCourseData({...editCourseData, price:e.target.value})} />
                    </div>
                  </div>
                  <div className="id-field-group">
                    <label className="id-field-label">Description</label>
                    <input className="id-field-input" value={editCourseData.description} onChange={e=>setEditCourseData({...editCourseData, description:e.target.value})} />
                  </div>
                  <div className="id-btn-row">
                    <button className="id-btn-save" onClick={async()=>{
                      try{
                        await axios.put(`http://localhost:5000/api/courses/${course._id}`, {
                          title: editCourseData.title, description: editCourseData.description,
                          price: Number(editCourseData.price)||0, videos: editCourseData.videos
                        }, { headers:{ Authorization:`Bearer ${token}` } })
                        const refreshed = await axios.get("http://localhost:5000/api/courses/mine", { headers:{ Authorization:`Bearer ${token}` } })
                        setMyCourses(refreshed.data || [])
                        setEditingCourseId(null)
                      }catch(err){ console.error("Update course failed", err.response?.data || err.message) }
                    }}>Save</button>
                    <button className="id-btn-ghost" style={{padding:'7px 14px', fontSize:'12px'}} onClick={()=>setEditingCourseId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <div>
                      <div className="id-list-title" style={{fontSize:'15px'}}>
                        {course.title}
                        <span className="id-course-price">${course.price}</span>
                      </div>
                      <div className="id-list-sub" style={{marginTop:'4px'}}>{course.description}</div>
                    </div>
                    <div style={{display:'flex', gap:'8px', flexShrink:0}}>
                      <button className="id-btn-edit" onClick={()=>{ setEditingCourseId(course._id); setEditCourseData({ title:course.title, description:course.description, price:course.price, videos:course.videos||[] }) }}>Edit</button>
                      <button className="id-btn-danger" onClick={async()=>{
                        try{
                          await axios.delete(`http://localhost:5000/api/courses/${course._id}`, { headers:{ Authorization:`Bearer ${token}` } })
                          setMyCourses(myCourses.filter(c=>c._id!==course._id))
                        }catch(err){ console.error("Delete course failed", err.response?.data || err.message) }
                      }}>Delete</button>
                    </div>
                  </div>
                  {Array.isArray(course.videos) && course.videos.length>0 && (
                    <ul className="id-list" style={{marginTop:'10px'}}>
                      {course.videos.map((v, idx)=> (
                        <li key={idx} className="id-list-item">
                          <div>
                            <div className="id-list-title">{v.title}</div>
                            <div className="id-list-sub">{v.url}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* My Quizzes */}
        <div className="id-section-label" style={{marginTop:'32px'}}>My Quizzes</div>
        {myQuizzes.length === 0 ? (
          <p className="id-empty">No quizzes yet.</p>
        ) : (
          myQuizzes.map(q => (
            <div key={q._id} className="id-course-item">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div className="id-list-title">Course: <span style={{color:'var(--sky)'}}>{q.courseId}</span></div>
                  <div className="id-list-sub">{q.questions?.length || 0} question{q.questions?.length !== 1 ? 's' : ''}</div>
                </div>
                <div style={{display:'flex', gap:'8px'}}>
                  {editingQuizId === q._id ? (
                    <>
                      <button className="id-btn-save" onClick={async()=>{
                        try{
                          await axios.put(`http://localhost:5000/api/quizzes/${q._id}`, { questions: editQuizQuestions }, { headers:{ Authorization:`Bearer ${token}` } })
                          const refreshed = await axios.get("http://localhost:5000/api/quizzes/mine", { headers:{ Authorization:`Bearer ${token}` } })
                          setMyQuizzes(refreshed.data || [])
                          setEditingQuizId(null); setEditQuizQuestions([])
                        }catch(err){ console.error("Update quiz failed", err.response?.data || err.message) }
                      }}>Save</button>
                      <button className="id-btn-ghost" style={{padding:'7px 14px', fontSize:'12px'}} onClick={()=>{ setEditingQuizId(null); setEditQuizQuestions([]) }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="id-btn-edit" onClick={()=>{ setEditingQuizId(q._id); setEditQuizQuestions(q.questions ? q.questions.map(qq=>({...qq})) : []) }}>Edit</button>
                      <button className="id-btn-danger" onClick={async()=>{
                        try{
                          await axios.delete(`http://localhost:5000/api/quizzes/${q._id}`, { headers:{ Authorization:`Bearer ${token}` } })
                          setMyQuizzes(myQuizzes.filter(x=>x._id!==q._id))
                        }catch(err){ console.error("Delete quiz failed", err.response?.data || err.message) }
                      }}>Delete</button>
                    </>
                  )}
                </div>
              </div>

              {editingQuizId === q._id ? (
                <div style={{marginTop:'14px'}}>
                  {(editQuizQuestions||[]).map((qq, qi)=> (
                    <div key={qi} className="id-course-item" style={{marginBottom:'12px'}}>
                      <div className="id-field-group">
                        <label className="id-field-label">Question {qi+1}</label>
                        <input className="id-field-input" value={qq.question || ''} onChange={e=>{ const c=[...editQuizQuestions]; c[qi]={...(c[qi]||{}), question:e.target.value}; setEditQuizQuestions(c); }} />
                      </div>
                      {(qq.options||[]).map((opt, oi)=> (
                        <div key={oi} style={{display:'flex', gap:'8px', marginBottom:'8px', alignItems:'center'}}>
                          <input className="id-field-input" placeholder={`Option ${oi+1}`} value={opt} onChange={e=>{ const c=[...editQuizQuestions]; const opts=[...(c[qi]?.options||[])]; opts[oi]=e.target.value; c[qi]={...(c[qi]||{}), options:opts}; setEditQuizQuestions(c); }} />
                          <button className="id-btn-danger" style={{whiteSpace:'nowrap'}} onClick={()=>{ const c=[...editQuizQuestions]; const opts=[...(c[qi]?.options||[])]; opts.splice(oi,1); c[qi]={...(c[qi]||{}), options:opts}; setEditQuizQuestions(c); }}>✕</button>
                        </div>
                      ))}
                      <button className="id-btn-ghost" style={{padding:'6px 12px', fontSize:'12px', marginBottom:'8px'}} onClick={()=>{ const c=[...editQuizQuestions]; const opts=[...(c[qi]?.options||[])]; opts.push(''); c[qi]={...(c[qi]||{}), options:opts}; setEditQuizQuestions(c); }}>+ Option</button>
                      <div className="id-field-group">
                        <label className="id-field-label">Correct Answer</label>
                        <input className="id-field-input" value={qq.correctAnswer||''} onChange={e=>{ const c=[...editQuizQuestions]; c[qi]={...(c[qi]||{}), correctAnswer:e.target.value}; setEditQuizQuestions(c); }} />
                      </div>
                      <button className="id-btn-danger" onClick={()=>{ const c=[...editQuizQuestions]; c.splice(qi,1); setEditQuizQuestions(c); }}>Remove Question</button>
                    </div>
                  ))}
                  <button className="id-btn-primary" onClick={()=>setEditQuizQuestions([...(editQuizQuestions||[]), {question:'', options:[], correctAnswer:''}])}>+ Add Question</button>
                </div>
              ) : (
                <ul className="id-list" style={{marginTop:'10px'}}>
                  {q.questions?.map((qq, idx)=> (
                    <li key={idx} className="id-list-item">
                      <div>
                        <div className="id-list-title">Q{idx+1}: {qq.question}</div>
                        <div className="id-list-sub">{qq.options?.join(' · ')}</div>
                        <div className="id-list-answer">✓ {qq.correctAnswer}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Right column: profile ── */}
      <div>
        <div className="id-card id-fade-up" style={{position:'sticky', top:'104px'}}>
          <div className="id-card-header">
            <span className="id-card-title">My <span>Profile</span></span>
          </div>
          <div className="id-card-body">
            <div className="id-profile-row">
              <img
                src={profile.avatarUrl
                  ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:5000${profile.avatarUrl}`)
                  : 'https://via.placeholder.com/80'}
                alt="avatar"
                className="id-profile-avatar"
              />
              <div>
                <div className="id-profile-name">{profile.username || 'Unnamed'}</div>
                <div className="id-profile-meta">{profile.email || ''}</div>
                <div className="id-profile-meta">📞 {profile.phone || '—'}</div>
              </div>
            </div>

            {editingProfile ? (
              <div>
                <div className="id-field-group">
                  <label className="id-field-label">Name</label>
                  <input className="id-field-input" placeholder="Name" value={profile.username} onChange={e=>setProfile({...profile, username: e.target.value})} />
                </div>
                <div className="id-field-group">
                  <label className="id-field-label">Phone</label>
                  <input className="id-field-input" placeholder="Phone" value={profile.phone} onChange={e=>setProfile({...profile, phone: e.target.value})} />
                </div>
                <div className="id-field-group">
                  <label className="id-field-label">Avatar</label>
                  <input className="id-field-input" type="file" accept="image/*" onChange={async (e)=>{
                    const file = e.target.files?.[0]
                    if(!file) return
                    const reader = new FileReader()
                    reader.onload = ()=>{ setAvatarFile(reader.result) }
                    reader.readAsDataURL(file)
                  }} />
                </div>
                <div className="id-btn-row">
                  <button className="id-btn-primary" onClick={async()=>{
                    try{
                      await axios.put('http://localhost:5000/api/auth/me', {
                        username: profile.username, phone: profile.phone, avatarFile: avatarFile || null
                      }, { headers:{ Authorization:`Bearer ${token}` } })
                      setEditingProfile(false)
                    }catch(err){ console.error('Profile update failed', err.response?.data || err.message) }
                  }}>Save</button>
                  <button className="id-btn-ghost" onClick={()=>setEditingProfile(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="id-btn-primary" style={{width:'100%', justifyContent:'center'}} onClick={()=>setEditingProfile(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>

    </div>
  </div>
</>
)

}

export default InstructorDashboard