import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ticket } from 'lucide-react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { Field } from '../../components/Input'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const loggedUser = await login(email, password)
      toast.success('Logged in successfully!')
      if (loggedUser.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-paper">
      <div className="hidden md:flex flex-col justify-between p-12 bg-ink text-paper">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="w-7 h-7 rounded-md bg-paper text-ink flex items-center justify-center">
            <Ticket size={15} />
          </span>
          EventFlow
        </Link>
        <div>
          <p className="font-display text-3xl font-medium leading-snug mb-4">
            "Registered for three workshops this semester without touching a single spreadsheet."
          </p>
          <p className="text-paper/60 text-sm">— A participant, Computer Engineering</p>
        </div>
        <p className="text-xs font-mono text-paper/40">© 2026 EventFlow</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-medium text-ink mb-2">Welcome back</h1>
          <p className="text-sm text-ink-soft mb-8">Log in to manage your registrations.</p>



          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field label="Email">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <p className="text-sm text-ink-soft mt-8 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-cobalt-600 hover:text-cobalt-700 font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
