import {BrowserRouter,Routes,Route} from "react-router-dom"

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
import ProtectedRoute from "./components/ProtectedRoute"

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
    <ProtectedRoute allowedRole="instructor">
      <InstructorDashboard/>
    </ProtectedRoute>
  }
/>
<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute allowedRole="student">
      <StudentDashboard/>
    </ProtectedRoute>
  }
/>

<Route path="/quiz" element={<Quizzes/>}/>
<Route path="/quiz/:courseId" element={<Quizzes/>}/>
<Route
  path="/progress"
  element={
    <ProtectedRoute allowedRole="student">
      <Progress/>
    </ProtectedRoute>
  }
/>

</Routes>

</BrowserRouter>

)

}

export default App