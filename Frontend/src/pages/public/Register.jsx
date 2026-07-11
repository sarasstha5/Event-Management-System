import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ticket } from 'lucide-react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { Field } from '../../components/Input'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function Register() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.')
      setSubmitting(false)
      return
    }

    try {
      await register(fullname, email, phone, password)
      toast.success('Account created successfully! Redirecting...')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.')
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
            Six categories of events. One account to reach all of them.
          </p>
          <p className="text-paper/60 text-sm">Seminars · Workshops · Hackathons · Conferences · Sports · Culture</p>
        </div>
        <p className="text-xs font-mono text-paper/40">© 2026 EventFlow</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-medium text-ink mb-2">Create your account</h1>
          <p className="text-sm text-ink-soft mb-8">Takes less than a minute.</p>



          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field label="Full name">
              <Input
                placeholder="Priya Nair"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Phone">
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Field>
            <Field label="Password" hint="At least 8 characters.">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-sm text-ink-soft mt-8 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-cobalt-600 hover:text-cobalt-700 font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
