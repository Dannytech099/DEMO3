import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export function Newsletter() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Enter a valid email address, like name@example.com')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setDone(true)
      toast('Subscribed. This is a demo, no email was stored.')
    }, 900)
  }

  return (
    <section className="container-x py-16 sm:py-24">
      <div className="card grid items-center gap-8 p-8 sm:p-14 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl sm:text-5xl">Get 10% off your first order</h2>
          <p className="mt-4 max-w-md text-muted">Join the list for new arrivals and restocks. Use code WELCOME10 at checkout, no sign-up needed.</p>
        </div>
        {done ? (
          <p className="flex items-center gap-3 text-lg" role="status">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-ink"><Check size={18} /></span>
            You are on the list. Check your inbox for the welcome note.
          </p>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" aria-label="Email address" aria-invalid={!!error}
                className={`input flex-1 rounded-full px-5 ${error ? 'input-error' : ''}`}
              />
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? <span className="spinner" /> : 'Subscribe'}
              </button>
            </div>
            {error && <p role="alert" className="mt-2 text-xs text-sale">{error}</p>}
          </form>
        )}
      </div>
    </section>
  )
}
