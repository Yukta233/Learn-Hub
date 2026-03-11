import { useState, useEffect } from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import Navbar from "../components/Navbar"

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

// For managing existing items
const [myCourses, setMyCourses] = useState([])
const [myQuizzes, setMyQuizzes] = useState([])
const [editingCourseId, setEditingCourseId] = useState(null)
const [editCourseData, setEditCourseData] = useState({ title:"", description:"", price:0, videos:[] })
const [editingQuizId, setEditingQuizId] = useState(null)
const [editQuizQuestions, setEditQuizQuestions] = useState([])

// Profile panel
const [profile, setProfile] = useState({ username:'', email:'', phone:'', avatarUrl:'' })
const [editingProfile, setEditingProfile] = useState(false)
const [avatarFile, setAvatarFile] = useState(null)

const token = localStorage.getItem("token")


// Add video to list

const addVideo = ()=>{

const newVideo = {
title:videoTitle,
url:videoUrl
}

setVideos([...videos,newVideo])

setVideoTitle("")
setVideoUrl("")

}


// Add quiz question

const addQuiz = ()=>{

const newQuiz = {
question,
options:[option1,option2,option3,option4],
correctAnswer:correct
}

setQuiz([...quiz,newQuiz])

setQuestion("")
setOption1("")
setOption2("")
setOption3("")
setOption4("")
setCorrect("")

}


// Create course

const createCourse = async ()=>{

try{

const res = await axios.post(
 "http://localhost:5000/api/courses/create",
 {
  title,
  description,
  price: Number(price) || 0,
  videos
 },
 {
  headers:{
   Authorization:`Bearer ${token}`
  }
 }
)

const courseId = res.data.course._id

// Save quiz
await axios.post(
 "http://localhost:5000/api/quizzes/create",
 {
  courseId,
  questions:quiz
 },
 {
  headers:{
   Authorization:`Bearer ${token}`
  }
 }
)

setMessage("Course and quiz created successfully!")

}catch(err){

console.log(err.response?.data || err.message)

setMessage("Error creating course")

}

}

// Load my courses and quizzes
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

const container={
padding:"40px 8%",
color:"white"
}

const input={
display:"block",
margin:"10px 0",
padding:"10px",
width:"300px"
}

const button={
marginTop:"15px",
padding:"10px 20px",
background:"#38bdf8",
border:"none",
cursor:"pointer"
}

const listBox={
 marginTop:"15px",
 padding:"12px",
 background:"#0b1220",
 border:"1px solid #1f2937",
 borderRadius:"8px"
}

const ulStyle={ listStyle:"none", padding:0, margin:0 }

const liStyle={
 display:"flex",
 alignItems:"center",
 justifyContent:"space-between",
 padding:"8px 0",
 borderBottom:"1px solid #1f2937"
}

const smallButton={
 padding:"6px 10px",
 background:"#ef4444",
 border:"none",
 borderRadius:"4px",
 color:"#fff",
 cursor:"pointer"
}

return(

<>
<Navbar/>

<div style={{...container, display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px'}}>

  {/* Left column: create/manage */}
  <div>

    <h2>Create Course</h2>

    <input
    style={input}
    placeholder="Course Title"
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
    />

    <input
    style={input}
    placeholder="Description"
    value={description}
    onChange={(e)=>setDescription(e.target.value)}
    />

    <input
    style={input}
    placeholder="Price (e.g. 49.99)"
    type="number"
    min="0"
    step="0.01"
    value={price}
    onChange={(e)=>setPrice(e.target.value)}
    />

    <input
    style={input}
    placeholder="Instructor Name"
    value={instructor}
    onChange={(e)=>setInstructor(e.target.value)}
    />


    <h3>Add Video</h3>

    <input
    style={input}
    placeholder="Video Title"
    value={videoTitle}
    onChange={(e)=>setVideoTitle(e.target.value)}
    />

    <input
    style={input}
    placeholder="Video URL"
    value={videoUrl}
    onChange={(e)=>setVideoUrl(e.target.value)}
    />

    <button style={button} onClick={addVideo}>
    Add Video
    </button>

    <div style={listBox}>
     <h4>Current Videos ({videos.length})</h4>
     {videos.length === 0 ? (
      <p>No videos added yet.</p>
     ) : (
      <ul style={ulStyle}>
       {videos.map((v, idx) => (
        <li key={idx} style={liStyle}>
         <div>
          <strong>{v.title}</strong>
          <div style={{fontSize:"12px", color:"#93c5fd"}}>{v.url}</div>
         </div>
         <button style={smallButton} onClick={()=>removeVideo(idx)}>Remove</button>
        </li>
       ))}
      </ul>
     )}
    </div>


    <h3>Add Quiz Question</h3>

    <input
    style={input}
    placeholder="Question"
    value={question}
    onChange={(e)=>setQuestion(e.target.value)}
    />

    <input
    style={input}
    placeholder="Option 1"
    value={option1}
    onChange={(e)=>setOption1(e.target.value)}
    />

    <input
    style={input}
    placeholder="Option 2"
    value={option2}
    onChange={(e)=>setOption2(e.target.value)}
    />

    <input
    style={input}
    placeholder="Option 3"
    value={option3}
    onChange={(e)=>setOption3(e.target.value)}
    />

    <input
    style={input}
    placeholder="Option 4"
    value={option4}
    onChange={(e)=>setOption4(e.target.value)}
    />

    <input
    style={input}
    placeholder="Correct Answer"
    value={correct}
    onChange={(e)=>setCorrect(e.target.value)}
    />

    <button style={button} onClick={addQuiz}>
    Add Question
    </button>

    <div style={listBox}>
     <h4>Current Quiz Questions ({quiz.length})</h4>
     {quiz.length === 0 ? (
      <p>No questions added yet.</p>
     ) : (
      <ul style={ulStyle}>
       {quiz.map((q, idx)=> (
        <li key={idx} style={liStyle}>
         <div>
          <strong>Q{idx+1}: {q.question}</strong>
          <div style={{fontSize:"12px", color:"#93c5fd"}}>{q.options?.join(" | ")}</div>
          <div style={{fontSize:"12px", color:"#34d399"}}>Answer: {q.correctAnswer}</div>
         </div>
         <button style={smallButton} onClick={()=>removeQuiz(idx)}>Remove</button>
        </li>
       ))}
      </ul>
     )}
    </div>


    <br/>

    <button style={button} onClick={createCourse}>
    Create Course
    </button>

    <p style={{marginTop:"20px"}}>{message}</p>

    <hr style={{margin:"30px 0", borderColor:"#1f2937"}}/>

    <h2>My Courses</h2>
    <div style={{marginTop:"10px"}}>
     {myCourses.length === 0 ? (
      <p>No courses yet.</p>
     ) : (
      myCourses.map(course => (
       <div key={course._id} style={{...listBox, marginBottom:"12px"}}>
        {editingCourseId === course._id ? (
         <div>
          <input style={input} value={editCourseData.title} onChange={e=>setEditCourseData({...editCourseData, title:e.target.value})} />
          <input style={input} value={editCourseData.description} onChange={e=>setEditCourseData({...editCourseData, description:e.target.value})} />
          <input style={input} type="number" min="0" step="0.01" value={editCourseData.price} onChange={e=>setEditCourseData({...editCourseData, price:e.target.value})} />
          <button style={button} onClick={async()=>{
            try{
              await axios.put(`http://localhost:5000/api/courses/${course._id}`, {
                title: editCourseData.title,
                description: editCourseData.description,
                price: Number(editCourseData.price)||0,
                videos: editCourseData.videos
              }, { headers:{ Authorization:`Bearer ${token}` } })
              const refreshed = await axios.get("http://localhost:5000/api/courses/mine", { headers:{ Authorization:`Bearer ${token}` } })
              setMyCourses(refreshed.data || [])
              setEditingCourseId(null)
            }catch(err){
              console.error("Update course failed", err.response?.data || err.message)
            }
          }}>Save</button>
          <button style={{...button, background:'#6b7280', marginLeft:'8px'}} onClick={()=>setEditingCourseId(null)}>Cancel</button>
         </div>
        ) : (
         <div>
          <div style={{display:'flex', justifyContent:'space-between'}}>
           <div>
            <strong>{course.title}</strong> - ${course.price}
            <div style={{fontSize:'12px', color:'#93c5fd'}}>{course.description}</div>
           </div>
           <div>
            <button style={{...smallButton, background:'#3b82f6', marginRight:'8px'}} onClick={()=>{ setEditingCourseId(course._id); setEditCourseData({ title:course.title, description:course.description, price:course.price, videos:course.videos||[] }) }}>Edit</button>
            <button style={smallButton} onClick={async()=>{
              try{
                await axios.delete(`http://localhost:5000/api/courses/${course._id}`, { headers:{ Authorization:`Bearer ${token}` } })
                setMyCourses(myCourses.filter(c=>c._id!==course._id))
              }catch(err){
                console.error("Delete course failed", err.response?.data || err.message)
              }
            }}>Delete</button>
           </div>
          </div>
          {Array.isArray(course.videos) && course.videos.length>0 && (
            <ul style={ulStyle}>
             {course.videos.map((v, idx)=> (
               <li key={idx} style={liStyle}>
                <div>
                 {v.title}
                 <div style={{fontSize:'12px', color:'#93c5fd'}}>{v.url}</div>
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
    </div>

    <h2 style={{marginTop:'20px'}}>My Quizzes</h2>
    <div style={{marginTop:"10px"}}>
     {myQuizzes.length === 0 ? (
      <p>No quizzes yet.</p>
     ) : (
      myQuizzes.map(q => (
       <div key={q._id} style={{...listBox, marginBottom:"12px"}}>
        <div style={{display:'flex', justifyContent:'space-between'}}>
         <strong>Course: {q.courseId}</strong>
         <div>
          {editingQuizId === q._id ? (
            <>
              <button style={{...smallButton, background:'#10b981', marginRight:'8px'}} onClick={async()=>{
                try{
                  await axios.put(`http://localhost:5000/api/quizzes/${q._id}`, { questions: editQuizQuestions }, { headers:{ Authorization:`Bearer ${token}` } })
                  const refreshed = await axios.get("http://localhost:5000/api/quizzes/mine", { headers:{ Authorization:`Bearer ${token}` } })
                  setMyQuizzes(refreshed.data || [])
                  setEditingQuizId(null)
                  setEditQuizQuestions([])
                }catch(err){
                  console.error("Update quiz failed", err.response?.data || err.message)
                }
              }}>Save</button>
              <button style={{...smallButton, background:'#6b7280'}} onClick={()=>{ setEditingQuizId(null); setEditQuizQuestions([]) }}>Cancel</button>
            </>
          ) : (
            <>
              <button style={{...smallButton, background:'#3b82f6', marginRight:'8px'}} onClick={()=>{
                setEditingQuizId(q._id);
                setEditQuizQuestions(q.questions ? q.questions.map(qq=>({ ...qq })) : [])
              }}>Edit</button>
              <button style={smallButton} onClick={async()=>{
                try{
                  await axios.delete(`http://localhost:5000/api/quizzes/${q._id}`, { headers:{ Authorization:`Bearer ${token}` } })
                  setMyQuizzes(myQuizzes.filter(x=>x._id!==q._id))
                }catch(err){
                  console.error("Delete quiz failed", err.response?.data || err.message)
                }
              }}>Delete</button>
            </>
          )}
         </div>
        </div>
        {editingQuizId === q._id ? (
          <div>
            {(editQuizQuestions||[]).map((qq, qi)=> (
              <div key={qi} style={{...listBox, marginTop:'10px'}}>
                <input
                  style={input}
                  placeholder={`Question ${qi+1}`}
                  value={qq.question || ''}
                  onChange={e=>{
                    const copy=[...editQuizQuestions];
                    copy[qi] = { ...(copy[qi]||{}), question: e.target.value };
                    setEditQuizQuestions(copy);
                  }}
                />
                <div>
                  {(qq.options || []).map((opt, oi)=> (
                    <div key={oi} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
                      <input
                        style={{...input, width:'240px', margin:'4px 0'}}
                        placeholder={`Option ${oi+1}`}
                        value={opt}
                        onChange={e=>{
                          const copy=[...editQuizQuestions];
                          const opts=[...((copy[qi]?.options)||[])];
                          opts[oi] = e.target.value;
                          copy[qi] = { ...(copy[qi]||{}), options: opts };
                          setEditQuizQuestions(copy);
                        }}
                      />
                      <button
                        style={smallButton}
                        onClick={()=>{
                          const copy=[...editQuizQuestions];
                          const opts=[...((copy[qi]?.options)||[])];
                          opts.splice(oi,1);
                          copy[qi] = { ...(copy[qi]||{}), options: opts };
                          setEditQuizQuestions(copy);
                        }}
                      >Remove</button>
                    </div>
                  ))}
                  <button
                    style={{...button, marginTop:'0'}}
                    onClick={()=>{
                      const copy=[...editQuizQuestions];
                      const opts=[...((copy[qi]?.options)||[])];
                      opts.push('');
                      copy[qi] = { ...(copy[qi]||{}), options: opts };
                      setEditQuizQuestions(copy);
                    }}
                  >Add Option</button>
                </div>
                <input
                  style={input}
                  placeholder="Correct Answer"
                  value={qq.correctAnswer || ''}
                  onChange={e=>{
                    const copy=[...editQuizQuestions];
                    copy[qi] = { ...(copy[qi]||{}), correctAnswer: e.target.value };
                    setEditQuizQuestions(copy);
                  }}
                />
                <button
                  style={smallButton}
                  onClick={()=>{
                    const copy=[...editQuizQuestions];
                    copy.splice(qi,1);
                    setEditQuizQuestions(copy);
                  }}
                >Remove Question</button>
              </div>
            ))}
            <button
              style={button}
              onClick={()=>{
                setEditQuizQuestions([...(editQuizQuestions||[]), { question:'', options:[], correctAnswer:'' }])
              }}
            >Add Question</button>
          </div>
        ) : (
          <ul style={ulStyle}>
           {q.questions?.map((qq, idx)=> (
            <li key={idx} style={liStyle}>
             <div>
              <strong>Q{idx+1}: {qq.question}</strong>
              <div style={{fontSize:'12px', color:'#93c5fd'}}>{qq.options?.join(' | ')}</div>
              <div style={{fontSize:'12px', color:'#34d399'}}>Answer: {qq.correctAnswer}</div>
             </div>
            </li>
           ))}
          </ul>
        )}
       </div>
      ))
     )}
    </div>

  </div>

  {/* Right column: profile panel */}
  <div>
    <div style={{...listBox}}>
      <h3>My Profile</h3>
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
            reader.onload = ()=>{
              setAvatarFile(reader.result)
            }
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
  </div>

</div>

</>
)

}

export default InstructorDashboard
