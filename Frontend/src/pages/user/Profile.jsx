import { useRef, useState, useEffect } from 'react'
import { Camera, AlertCircle } from 'lucide-react'
import UserLayout from '../../layouts/UserLayout'
import Button from '../../components/Button'
import Input, { Field } from '../../components/Input'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

export default function Profile() {
  const { user, refreshProfile } = useAuth()
  const fileInputRef = useRef(null)

  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [updating, setUpdating] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const handleSaveDetails = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setUpdating(true)
    try {
      await api.updateProfile(fullname, phone)
      await refreshProfile()
      setSuccess('Profile details updated successfully.')
    } catch (err) {
      console.error('Error saving profile details:', err)
      setError(err.message || 'Failed to update profile details.')
    } finally {
      setUpdating(false)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError(null)
    setSuccess(null)
    setImageUploading(true)

    const formData = new FormData()
    formData.append('profile_image', file)

    try {
      await api.uploadProfileImage(formData)
      await refreshProfile()
      setSuccess('Profile picture updated successfully.')
    } catch (err) {
      console.error('Error uploading profile image:', err)
      setError(err.message || 'Failed to upload profile picture.')
    } finally {
      setImageUploading(false)
    }
  }

  // Fallback initials
  const initials = user?.fullname
    ? user.fullname.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const profileImageUrl = user?.profile_image ? api.getAssetUrl(user.profile_image) : null

  return (
    <UserLayout title="Profile">
      <div className="max-w-2xl">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/25 text-danger flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-success/10 border border-success/25 text-success text-sm">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-line p-8 mb-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {profileImageUrl ? (
                <img 
                  src={profileImageUrl} 
                  alt={user?.fullname} 
                  className={`w-20 h-20 rounded-full object-cover border border-line ${imageUploading ? 'opacity-50' : ''}`}
                />
              ) : (
                <div className={`w-20 h-20 rounded-full bg-ink text-paper flex items-center justify-center font-display text-2xl font-medium ${imageUploading ? 'opacity-50' : ''}`}>
                  {initials}
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={handleCameraClick}
                disabled={imageUploading}
                type="button"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-line flex items-center justify-center text-ink-soft hover:text-ink focus-ring"
                title="Upload profile image"
              >
                <Camera size={13} />
              </button>
            </div>
            <div>
              <p className="font-display text-xl font-medium text-ink">{user?.fullname}</p>
              <p className="text-sm text-ink-faint capitalize">{user?.role} account</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-line p-8">
          <h2 className="font-display text-lg font-medium text-ink mb-6">Account details</h2>
          <form onSubmit={handleSaveDetails}>
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <Field label="Full name">
                <Input 
                  value={fullname} 
                  onChange={(e) => setFullname(e.target.value)} 
                  required
                />
              </Field>
              <Field label="Email">
                <Input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-black/[0.02] text-ink-faint" 
                />
              </Field>
              <Field label="Phone">
                <Input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Field>
              <Field label="Role">
                <Input 
                  value={user?.role || ''} 
                  disabled 
                  className="capitalize bg-black/[0.02] text-ink-faint" 
                />
              </Field>
            </div>
            <Button type="submit" disabled={updating}>
              {updating ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </div>
      </div>
    </UserLayout>
  )
}
