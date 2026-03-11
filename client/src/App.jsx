import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Courses from "./pages/Courses"
import Coursedetails from "./pages/Coursedetails"
// import Studentdashboard from "./pages/Studentdashboard"
import InstructorDashboard from "./pages/Instructordashboard"
import Quizzes from "./pages/quizzes"
import StudentDashboard from "./pages/Studentdashboard"
import Progress from "./pages/progress"

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/signup" element={<Signup/>}/>

<Route path="/courses" element={<Courses/>}/>
<Route path="/course/:id" element={<Coursedetails/>}/>
<Route
  path="/instructor-dashboard"
  element={
    localStorage.getItem("token") && localStorage.getItem('role') === 'instructor' ? (
      <InstructorDashboard/>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
<Route
  path="/student-dashboard"
  element={
    localStorage.getItem("token") && localStorage.getItem('role') === 'student' ? (
      <StudentDashboard/>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

<Route path="/quiz" element={<Quizzes/>}/>
<Route path="/quiz/:courseId" element={<Quizzes/>}/>
<Route
  path="/progress"
  element={
    localStorage.getItem("token") && localStorage.getItem('role') === 'student' ? (
      <Progress/>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

</Routes>

</BrowserRouter>

)

}

export default App