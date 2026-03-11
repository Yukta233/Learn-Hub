import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { recordQuizAttempt } from '../services/api'
import { THEME } from './theme'

const pageStyles = `
  ${THEME}

  .quiz-list { display: flex; flex-direction: column; gap: 24px; }

  .quiz-card {
    background: rgba(7,18,32,0.8); border: 1px solid var(--border);
    border-radius: 18px; overflow: hidden;
    transition: border-color 0.25s;
  }
  .quiz-card:hover { border-color: var(--border-hover); }

  .quiz-card-header {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  }
  .quiz-course-title {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;
  }
  .quiz-course-desc { font-size: 13px; color: var(--muted); margin-top: 4px; }

  .quiz-questions { padding: 20px 24px; display: flex; flex-direction: column; gap: 22px; }

  .question-block { }
  .question-text {
    font-size: 15px; font-weight: 600; color: var(--text);
    margin-bottom: 12px; line-height: 1.5;
  }
  .question-num { color: var(--sky); font-family: 'Syne', sans-serif; }

  .option-btn {
    display: flex; align-items: center; gap: 10px;
    width: 100%; text-align: left; padding: 11px 16px;
    border-radius: 10px; border: 1px solid var(--border);
    background: rgba(14,28,46,0.7); color: var(--text);
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-bottom: 7px;
    transition: border-color 0.15s, background 0.15s;
  }
  .option-btn:hover:not(:disabled) { border-color: var(--border-hover); background: rgba(56,189,248,0.06); }
  .option-btn:disabled { cursor: default; }

  .option-btn.selected { border-color: rgba(56,189,248,0.4); background: rgba(56,189,248,0.08); }
  .option-btn.correct  { border-color: rgba(52,211,153,0.5); background: rgba(52,211,153,0.10); color: var(--emerald); }
  .option-btn.wrong    { border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.08); color: var(--rose); }

  .option-indicator {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
  }

  .quiz-footer {
    padding: 16px 24px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }

  .score-display {
    display: flex; align-items: center; gap: 14px;
  }
  .score-big {
    font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
  }
  .score-label { font-size: 13px; color: var(--muted); }
  .score-bar-wrap { width: 140px; }

  .quiz-progress-wrap {
    display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted);
  }
`

function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState({})
  const [scores, setScores] = useState({})
  const token = localStorage.getItem('token')

  useEffect(() => {
    const load = async () => {
      try {
        const coursesRes = await axios.get('http://localhost:5000/api/courses')
        const courses = coursesRes.data || []
        const quizPromises = courses.map(c =>
          axios.get(`http://localhost:5000/api/quizzes/${c._id}`,
            token ? { headers: { Authorization: `Bearer ${token}` } } : {}
          ).then(r => ({ course: c, quiz: r.data })).catch(() => ({ course: c, quiz: null }))
        )
        const results = await Promise.all(quizPromises)
        const list = results.filter(r => r.quiz && Array.isArray(r.quiz.questions) && r.quiz.questions.length > 0)
        setQuizzes(list)
      } catch (err) {
        console.error('Failed to load quizzes', err.response?.data || err.message)
      }
    }
    load()
  }, [])

  const selectAnswer = (quizId, qIdx, optionIdx) => {
    setAnswers(prev => ({ ...prev, [quizId]: { ...(prev[quizId] || {}), [qIdx]: optionIdx } }))
  }

  const submitQuiz = (quiz) => {
    const sel = answers[quiz.quiz._id] || {}
    let score = 0
    quiz.quiz.questions.forEach((q, i) => {
      const selected = q.options?.[sel[i]]
      if (selected && selected === q.correctAnswer) score += 1
    })
    setScores(prev => ({ ...prev, [quiz.quiz._id]: score }))
    setSubmitted(prev => ({ ...prev, [quiz.quiz._id]: true }))
    recordQuizAttempt(quiz.course._id, quiz.quiz._id, score, quiz.quiz.questions.length).catch(() => {})
  }

  return (
    <>
      <style>{pageStyles}</style>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner">
          <div className="page-header fade-up">
            <div className="page-tag">Test Your Knowledge</div>
            <h1 className="page-title">Course <span>Quizzes</span></h1>
          </div>

          {quizzes.length === 0 ? (
            <div className="state-screen">
              <div className="spinner" />
              <span>Loading quizzes…</span>
            </div>
          ) : (
            <div className="quiz-list">
              {quizzes.map(({ course, quiz }, ci) => {
                const qid = quiz._id
                const done = submitted[qid]
                const score = scores[qid] || 0
                const total = quiz.questions.length
                const selected = answers[qid] || {}
                const answered = Object.keys(selected).length

                return (
                  <div key={qid} className="quiz-card fade-up" style={{ animationDelay: `${ci * 0.08}s` }}>
                    <div className="quiz-card-header">
                      <div>
                        <div className="quiz-course-title">{course.title}</div>
                        <div className="quiz-course-desc">{course.description}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <span className="badge badge-sky">{total} Questions</span>
                        {!done && (
                          <div className="quiz-progress-wrap">
                            {answered}/{total} answered
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="quiz-questions">
                      {quiz.questions.map((q, qi) => {
                        const selectedIdx = selected[qi]
                        const isCorrect = idx => q.options?.[idx] === q.correctAnswer
                        return (
                          <div key={qi} className="question-block">
                            <div className="question-text">
                              <span className="question-num">Q{qi + 1}. </span>{q.question}
                            </div>
                            {(q.options || []).map((opt, oi) => {
                              const active = selectedIdx === oi
                              const show = !!done
                              const correct = show && isCorrect(oi)
                              const wrong = show && active && !correct
                              let cls = "option-btn"
                              if (correct) cls += " correct"
                              else if (wrong) cls += " wrong"
                              else if (active && !show) cls += " selected"

                              return (
                                <button key={oi} className={cls} disabled={done}
                                  onClick={() => selectAnswer(qid, qi, oi)}>
                                  <div className="option-indicator">
                                    {correct ? "✓" : wrong ? "✗" : String.fromCharCode(65 + oi)}
                                  </div>
                                  {opt}
                                </button>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>

                    <div className="quiz-footer">
                      {done ? (
                        <div className="score-display">
                          <div>
                            <div className="score-big" style={{ color: score / total >= 0.7 ? "var(--emerald)" : score / total >= 0.4 ? "var(--amber)" : "var(--rose)" }}>
                              {score} / {total}
                            </div>
                            <div className="score-label">{Math.round((score / total) * 100)}% — {score / total >= 0.7 ? "Great work! 🎉" : score / total >= 0.4 ? "Good effort 👍" : "Keep practicing 📖"}</div>
                          </div>
                          <div className="score-bar-wrap">
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${Math.round((score / total) * 100)}%` }} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <button className="btn-primary" onClick={() => submitQuiz({ course, quiz })}>
                            Submit Quiz
                          </button>
                          <span style={{ fontSize: 13, color: "var(--dim)" }}>{answered} of {total} answered</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default QuizzesPage