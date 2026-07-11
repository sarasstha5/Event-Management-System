import { Mail, Phone, MapPin } from 'lucide-react'
import PublicLayout from '../../layouts/PublicLayout'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { Field, Textarea } from '../../components/Input'

export default function Contact() {
  return (
    <PublicLayout>
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <p className="text-xs font-mono uppercase tracking-widest text-cobalt-500 mb-3">Get in touch</p>
          <h1 className="font-display text-4xl font-medium text-ink mb-6">Contact us</h1>
          <p className="text-ink-soft leading-relaxed mb-8">
            Questions about an event, a registration, or setting up EventFlow for your own
            organization? Send a note and the events team will get back to you.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-ink-soft">
              <Mail size={16} className="text-ink-faint" /> events@eventflow.app
            </div>
            <div className="flex items-center gap-3 text-sm text-ink-soft">
              <Phone size={16} className="text-ink-faint" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-3 text-sm text-ink-soft">
              <MapPin size={16} className="text-ink-faint" /> Manglabare,MBMAN COLLEGE
            </div>
          </div>
        </div>

        <form className="md:col-span-3 bg-white border border-line rounded-2xl p-7 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name">
              <Input placeholder="Your name" />
            </Field>
            <Field label="Email">
              <Input type="email" placeholder="you@example.com" />
            </Field>
          </div>
          <Field label="Subject">
            <Input placeholder="What's this about?" />
          </Field>
          <Field label="Message">
            <Textarea rows={5} placeholder="Tell us a bit more…" />
          </Field>
          <Button type="submit" className="w-full sm:w-auto">Send message</Button>
        </form>
      </section>
    </PublicLayout>
  )
}
