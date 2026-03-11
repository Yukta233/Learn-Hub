import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import { getMyProgress } from "../services/api"

function StudentDashboard(){
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  const [profile, setProfile] = useState({ username:'', email:'', phone:'', avatarUrl:'' })
  const [editingProfile, setEditingProfile] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)

  const [savedCourses, setSavedCourses] = useState([]) // array of course objects
  const [quizAttempts, setQuizAttempts] = useState([]) // [{ courseId, courseTitle, quizId, score, total, ts }]
  const [progress, setProgress] = useState(null) // backend progress doc

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
      }catch(err){
        console.error("Failed to load profile", err.response?.data || err.message)
      }

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

  const container={ padding:"40px 8%", color:"white", display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }
  const box={ background:'#020617', padding:'16px', borderRadius:'10px' }
  const input={ display:'block', margin:'10px 0', padding:'10px', width:'300px' }
  const button={ marginTop:'10px', padding:'10px 16px', background:'#38bdf8', border:'none', borderRadius:'6px', cursor:'pointer' }
  const listBox={ marginTop:'12px', padding:'12px', background:'#0b1220', border:'1px solid #1f2937', borderRadius:'8px' }
  const ulStyle={ listStyle:'none', padding:0, margin:0 }
  const liStyle={ display:'flex', justifyContent:'space-between', alignItems:'start', gap:'12px', padding:'8px 0', borderBottom:'1px solid #1f2937' }

  
  return (
    <>
      <Navbar/>
      <div style={container}>
        {/* Profile panel */}
        <div style={box}>
          <h2>My Profile</h2>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginTop:'8px'}}>
            <img src={profile.avatarUrl ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `http://localhost:5000${profile.avatarUrl}`) : 'https://via.placeholder.com/80'} alt="avatar" style={{width:'80px', height:'80px', borderRadius:'50%', objectFit:'cover', border:'1px solid #1f2937'}} />
            <div>
              <div><strong>{profile.username || 'Unnamed'}</strong></div>
              <div style={{fontSize:'12px', color:'#93c5fd'}}>{profile.email || ''}</div>
              <div style={{fontSize:'12px', color:'#93c5fd'}}>Phone: {profile.phone || '-'}</div>
            </div>
          </div>

          {editingProfile ? (
            <div style={{marginTop:'12px'}}>
              <input style={input} placeholder="Name" value={profile.username} onChange={e=>setProfile({...profile, username: e.target.value})} />
              <input style={input} placeholder="Phone" value={profile.phone} onChange={e=>setProfile({...profile, phone: e.target.value})} />
              <input style={input} type="file" accept="image/*" onChange={async (e)=>{
                const file = e.target.files?.[0]
                if(!file) return
                const reader = new FileReader()
                reader.onload = ()=>{ setAvatarFile(reader.result) }
                reader.readAsDataURL(file)
              }} />
              <button style={{...button, marginRight:'8px'}} onClick={async()=>{
                try{
                  await axios.put('http://localhost:5000/api/auth/me', {
                    username: profile.username,
                    phone: profile.phone,
                    avatarFile: avatarFile || null
                  }, { headers:{ Authorization:`Bearer ${token}` } })
                  setEditingProfile(false)
                }catch(err){
                  console.error('Profile update failed', err.response?.data || err.message)
                }
              }}>Save</button>
              <button style={{...button, background:'#6b7280'}} onClick={()=>setEditingProfile(false)}>Cancel</button>
            </div>
          ) : (
            <div style={{marginTop:'12px'}}>
              <button style={button} onClick={()=>setEditingProfile(true)}>Edit Profile</button>
            </div>
          )}
        </div>

        {/* Saved courses simple list */}
        <div style={box}>
          <h2>Saved Courses</h2>
          <div style={listBox}>
            {savedCourses.length === 0 ? (
              <p>No saved courses.</p>
            ) : (
              <ul style={ulStyle}>
                {savedCourses.map((c)=> (
                  <li key={c._id} style={liStyle}>
                    <div>
                      <div style={{fontWeight:600}}>{c.title}</div>
                      <div style={{fontSize:'12px', color:'#93c5fd'}}>{c.description}</div>
                    </div>
                    <a href={`/course/${c._id}`} style={{color:'#38bdf8'}}>View</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Completed quizzes list only */}
        <div style={{gridColumn:'1 / span 2'}}>
          <div style={box}>
            <h2>Completed Quizzes</h2>
            <div style={listBox}>
              {Array.isArray(progress?.courses) && progress.courses.some(c=> (c.quizAttempts||[]).length>0) ? (
                <ul style={ulStyle}>
                  {progress.courses.flatMap((c)=> (c.quizAttempts||[]).map((qa)=>({ cid:String(c.courseId), qa }))).slice().reverse().map((row, idx)=> (
                    <li key={idx} style={{...liStyle, display:'flex', justifyContent:'space-between'}}>
                      <div>
                        <div style={{fontWeight:600}}>Course {row.cid.slice(-6)}</div>
                        <div style={{fontSize:'12px', color:'#93c5fd'}}>Score: {row.qa.score} / {row.qa.total}</div>
                        <div style={{fontSize:'12px', color:'#64748b'}}>On: {new Date(row.qa.ts).toLocaleString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No quiz attempts yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentDashboard
