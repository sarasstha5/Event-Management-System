import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}
