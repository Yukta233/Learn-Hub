import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .auth-page {
    min-height: 100vh;
    background: #040d18;
    display: flex; align-items: center; justify-content: center;
    padding: 100px 20px 40px;
    font-family: 'DM Sans', sans-serif;
    position: relative; overflow: hidden;
  }

  .auth-page::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 50%, rgba(56,189,248,0.07) 0%, transparent 65%),
      radial-gradient(ellipse 50% 60% at 80% 30%, rgba(129,140,248,0.07) 0%, transparent 65%);
  }

  /* Grid lines background */
  .auth-page::after {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: rgba(7, 18, 32, 0.85);
    border: 1px solid rgba(56,189,248,0.14);
    border-radius: 20px;
    padding: 44px 40px 40px;
    backdrop-filter: blur(24px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(56,189,248,0.05) inset;
    animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .auth-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2));
    border: 1px solid rgba(56,189,248,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 22px;
  }

  .auth-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px; font-weight: 800;
    color: #e2eaf5; margin-bottom: 6px;
    letter-spacing: -0.02em;
  }

  .auth-subtitle {
    font-size: 14px; color: #5a7a99;
    margin-bottom: 32px;
    line-height: 1.5;
  }

  .auth-message {
    padding: 10px 14px; border-radius: 8px; margin-bottom: 20px;
    font-size: 13px; font-weight: 500; text-align: center;
  }
  .auth-message.success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #4ade80; }
  .auth-message.error   { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2); color: #f87171; }

  .field-group { margin-bottom: 16px; }

  .field-label {
    display: block; font-size: 12px; font-weight: 600;
    letter-spacing: 0.07em; text-transform: uppercase;
    color: #4a6a88; margin-bottom: 7px;
  }

  .field-input {
    width: 100%; padding: 12px 16px;
    background: rgba(14, 28, 46, 0.8);
    border: 1px solid rgba(56,189,248,0.12);
    border-radius: 10px; color: #e2eaf5;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .field-input::placeholder { color: #2e4a66; }
  .field-input:focus {
    border-color: rgba(56,189,248,0.4);
    box-shadow: 0 0 0 3px rgba(56,189,248,0.08);
    background: rgba(14, 28, 46, 1);
  }

  .auth-submit {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #38bdf8, #818cf8);
    border: none; border-radius: 10px;
    color: #fff; font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-top: 8px;
    box-shadow: 0 4px 20px rgba(56,189,248,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 0.01em;
  }
  .auth-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(56,189,248,0.4); }
  .auth-submit:active { transform: translateY(0); }

  .auth-footer {
    text-align: center; margin-top: 24px;
    font-size: 13px; color: #4a6a88;
  }
  .auth-footer a { color: #38bdf8; text-decoration: none; font-weight: 600; }
  .auth-footer a:hover { text-decoration: underline; }

  .divider {
    height: 1px; background: rgba(56,189,248,0.1);
    margin: 28px 0 24px;
  }
`

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("username", res.data.user?.username || "")
      localStorage.setItem("role", res.data.user?.role || "")
      localStorage.setItem("userId", res.data.user?.id || "")
      localStorage.setItem("email", res.data.user?.email || "")
      setIsError(false)
      setMessage("Login successful! Redirecting…")
      setTimeout(() => {
        const role = res.data.user?.role
        if (role === "student") navigate("/student-dashboard")
        else if (role === "instructor") navigate("/instructor-dashboard")
        else navigate("/")
      }, 1000)
    } catch (err) {
      setIsError(true)
      setMessage("Invalid email or password")
    }
  }

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">🔑</div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue your learning journey.</p>

          {message && (
            <div className={`auth-message ${isError ? "error" : "success"}`}>{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-submit">Sign In</button>
          </form>

          <div className="divider" />
          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Login