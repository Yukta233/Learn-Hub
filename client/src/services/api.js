import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

API.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getMyProgress = () => API.get('/api/progress/me').then(r=>r.data)
export const markVideoComplete = (courseId, videoId) => API.put(`/api/progress/course/${courseId}/video`, { videoId }).then(r=>r.data)
export const recordQuizAttempt = (courseId, quizId, score, total) => API.post(`/api/progress/course/${courseId}/quiz`, { quizId, score, total }).then(r=>r.data)

export default API;