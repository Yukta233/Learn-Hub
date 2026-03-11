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
      radial-gradient(ellipse 60% 50% at 80% 50%, rgba(56,189,248,0.07) 0%, transparent 65%),
      radial-gradient(ellipse 50% 60% at 20% 30%, rgba(192,132,252,0.07) 0%, transparent 65%);
  }

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
    background: linear-gradient(135deg, rgba(192,132,252,0.2), rgba(56,189,248,0.2));
    border: 1px solid rgba(192,132,252,0.2);
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
    margin-bottom: 32px; line-height: 1.5;
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

  .field-input, .field-select {
    width: 100%; padding: 12px 16px;
    background: rgba(14, 28, 46, 0.8);
    border: 1px solid rgba(56,189,248,0.12);
    border-radius: 10px; color: #e2eaf5;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
    appearance: none; -webkit-appearance: none;
  }
  .field-input::placeholder { color: #2e4a66; }
  .field-input:focus, .field-select:focus {
    border-color: rgba(192,132,252,0.4);
    box-shadow: 0 0 0 3px rgba(192,132,252,0.08);
    background: rgba(14, 28, 46, 1);
  }

  .select-wrap { position: relative; }
  .select-wrap::after {
    content: '▾'; position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%); color: #4a6a88; pointer-events: none; font-size: 12px;
  }

  .role-pills {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .role-pill {
    flex: 1; min-width: 80px; padding: 10px 8px; border-radius: 9px;
    border: 1px solid rgba(56,189,248,0.12);
    background: rgba(14,28,46,0.8);
    color: #5a7a99; font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; text-align: center;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .role-pill.active {
    border-color: rgba(192,132,252,0.5);
    background: rgba(192,132,252,0.1);
    color: #c084fc;
  }
  .role-pill:hover:not(.active) { border-color: rgba(56,189,248,0.25); color: #94a3b8; }

  .auth-submit {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #c084fc, #818cf8, #38bdf8);
    border: none; border-radius: 10px;
    color: #fff; font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-top: 8px;
    box-shadow: 0 4px 20px rgba(192,132,252,0.2);
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 0.01em;
  }
  .auth-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(192,132,252,0.35); }
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

const ROLES = [
  { value: "student", label: "🎓 Student" },
  { value: "instructor", label: "🧑‍🏫 Instructor" },
  { value: "admin", label: "🛡️ Admin" },
]

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "student" })
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const setRole = (role) => {
    setForm({ ...form, role })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:5000/api/auth/register", form)
      setIsError(false)
      setMessage("Account created! Redirecting to login…")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setIsError(true)
      setMessage("Signup failed. Please try again.")
    }
  }

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon">🚀</div>
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Start your learning journey today. It's free.</p>

          {message && (
            <div className={`auth-message ${isError ? "error" : "success"}`}>{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Username</label>
              <input
                className="field-input"
                name="username"
                placeholder="yourname"
                onChange={handleChange}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className="field-input"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
            <div className="field-group">
              <label className="field-label">I am a…</label>
              <div className="role-pills">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    className={`role-pill${form.role === r.value ? " active" : ""}`}
                    onClick={() => setRole(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="auth-submit">Create Account</button>
          </form>

          <div className="divider" />
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Signup