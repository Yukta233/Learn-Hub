import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 7%;
    height: 68px;
    background: rgba(4, 13, 24, 0.7);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(56,189,248,0.1);
    transition: background 0.3s, box-shadow 0.3s;
    font-family: 'DM Sans', sans-serif;
  }
  .navbar.scrolled {
    background: rgba(4, 13, 24, 0.92);
    box-shadow: 0 4px 32px rgba(0,0,0,0.4);
  }

  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-size: 21px; font-weight: 800;
    color: #e2eaf5; text-decoration: none;
    letter-spacing: -0.01em;
  }
  .nav-logo span { color: #38bdf8; }

  .nav-links {
    display: flex; gap: 4px; align-items: center;
  }

  .nav-link {
    color: #94a3b8; text-decoration: none;
    font-size: 14px; font-weight: 500;
    padding: 7px 14px; border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    letter-spacing: 0.01em;
  }
  .nav-link:hover { color: #e2eaf5; background: rgba(56,189,248,0.08); }

  .nav-btn {
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    color: #fff; font-size: 14px; font-weight: 600;
    padding: 8px 20px; border-radius: 8px;
    text-decoration: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 12px rgba(56,189,248,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 0.01em;
  }
  .nav-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(56,189,248,0.4); }

  .nav-logout {
    background: transparent;
    color: #94a3b8; font-size: 14px; font-weight: 500;
    padding: 7px 14px; border-radius: 8px;
    border: 1px solid rgba(56,189,248,0.2); cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .nav-logout:hover { color: #f87171; border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.06); }
`

function Navbar() {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem("token")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    localStorage.removeItem("userId")
    localStorage.removeItem("email")
    navigate("/login")
  }

  return (
    <>
      <style>{navStyles}</style>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <Link to="/" className="nav-logo">Learn<span>Hub</span></Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/courses" className="nav-link">Courses</Link>
          <Link to="/quiz" className="nav-link">Quiz</Link>

          {isAuthenticated && localStorage.getItem("role") === "student" && (
            <Link to="/progress" className="nav-link">Progress</Link>
          )}

          {isAuthenticated && (
            localStorage.getItem("role") === "student" ? (
              <Link to="/student-dashboard" className="nav-link">Dashboard</Link>
            ) : (
              <Link to="/instructor-dashboard" className="nav-link">Dashboard</Link>
            )
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-btn">Sign up</Link>
            </>
          )}

          {isAuthenticated && (
            <button onClick={handleLogout} className="nav-logout">Logout</button>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar