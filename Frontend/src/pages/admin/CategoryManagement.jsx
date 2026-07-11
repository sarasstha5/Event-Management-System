import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Tag, AlertCircle } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import Button from '../../components/Button'
import Input, { Field } from '../../components/Input'
import Modal from '../../components/Modal'
import { api } from '../../utils/api'

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [modal, setModal] = useState(null) // 'add' | 'edit' | 'delete' | null
  const [active, setActive] = useState(null)
  const [categoryNameInput, setCategoryNameInput] = useState('')

  const fetchCategoriesAndEvents = async () => {
    try {
      const [cats, evs] = await Promise.all([
        api.getCategories(),
        api.getEvents()
      ])
      setCategories(cats)
      setEvents(evs)
    } catch (err) {
      console.error('Failed to load categories/events:', err)
      setError(err.message || 'Failed to load category data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoriesAndEvents()
  }, [])

  const eventCount = (id) => events.filter((e) => e.category_id === id).length

  const openAdd = () => {
    setActive(null)
    setCategoryNameInput('')
    setModal('add')
  }

  const openEdit = (c) => {
    setActive(c)
    setCategoryNameInput(c.category_name)
    setModal('edit')
  }

  const openDelete = (c) => {
    setActive(c)
    setModal('delete')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryNameInput.trim()) return

    setError(null)
    setSubmitting(true)
    try {
      if (modal === 'add') {
        await api.addCategory(categoryNameInput.trim())
      } else if (modal === 'edit') {
        await api.editCategory(active.id, categoryNameInput.trim())
      }
      await fetchCategoriesAndEvents()
      setModal(null)
    } catch (err) {
      console.error('Error saving category:', err)
      setError(err.message || 'Failed to save category.')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!active) return

    setError(null)
    setSubmitting(true)
    try {
      await api.deleteCategory(active.id)
      await fetchCategoriesAndEvents()
      setModal(null)
    } catch (err) {
      console.error('Error deleting category:', err)
      setError(err.message || 'Failed to delete category.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Category management">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Category management">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/25 text-danger flex items-start gap-3 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end mb-6">
        <Button onClick={openAdd}>
          <Plus size={16} /> Add category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center text-ink-soft">
          No categories found. Click Add Category to create one.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-line p-5 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cobalt-50 text-cobalt-600 flex items-center justify-center shrink-0">
                  <Tag size={15} />
                </div>
                <div>
                  <p className="font-medium text-ink">{c.category_name}</p>
                  <p className="text-xs text-ink-faint mt-0.5">{eventCount(c.id)} events</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-black/[0.04] focus-ring">
                  <Pencil size={14} />
                </button>
                <button onClick={() => openDelete(c)} className="p-1.5 rounded-lg text-ink-soft hover:text-danger hover:bg-danger/5 focus-ring">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal === 'add' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit category' : 'Add category'}>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Category name">
            <Input 
              value={categoryNameInput} 
              onChange={(e) => setCategoryNameInput(e.target.value)}
              placeholder="e.g. Workshop" 
              autoFocus 
              required
            />
          </Field>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(null)} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : modal === 'edit' ? 'Save changes' : 'Add category'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete category">
        <p className="text-sm text-ink-soft mb-6">
          Delete <span className="font-medium text-ink">{active?.category_name}</span>? Events using this category will need to be reassigned or will be deleted.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setModal(null)} disabled={submitting}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Delete'}</Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}
