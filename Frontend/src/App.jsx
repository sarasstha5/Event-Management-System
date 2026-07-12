import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

import Home from './pages/public/Home'
import About from './pages/public/About'
import UpcomingEvents from './pages/public/UpcomingEvents'
import EventDetails from './pages/public/EventDetails'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Contact from './pages/public/Contact'

import UserDashboard from './pages/user/Dashboard'
import BrowseEvents from './pages/user/BrowseEvents'
import MyRegistrations from './pages/user/MyRegistrations'
import Profile from './pages/user/Profile'

import AdminDashboard from './pages/admin/Dashboard'
import EventManagement from './pages/admin/EventManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import ParticipantManagement from './pages/admin/ParticipantManagement'
import RegistrationManagement from './pages/admin/RegistrationManagement'

// Route guards
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 rounded-full border-4 border-cobalt-200 border-t-cobalt-600 animate-spin" />
      </div>
    )
  }

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/events",
    element: <UpcomingEvents />
  },
  {
    path: "/events/:id",
    element: <EventDetails />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/login",
    element: <GuestRoute><Login /></GuestRoute>
  },
  {
    path: "/register",
    element: <GuestRoute><Register /></GuestRoute>
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><UserDashboard /></ProtectedRoute>
  },
  {
    path: "/dashboard/browse",
    element: <ProtectedRoute><BrowseEvents /></ProtectedRoute>
  },
  {
    path: "/dashboard/registrations",
    element: <ProtectedRoute><MyRegistrations /></ProtectedRoute>
  },
  {
    path: "/dashboard/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminDashboard /></AdminRoute>
  },
  {
    path: "/admin/events",
    element: <AdminRoute><EventManagement /></AdminRoute>
  },
  {
    path: "/admin/categories",
    element: <AdminRoute><CategoryManagement /></AdminRoute>
  },
  {
    path: "/admin/participants",
    element: <AdminRoute><ParticipantManagement /></AdminRoute>
  },
  {
    path: "/admin/registrations",
    element: <AdminRoute><RegistrationManagement /></AdminRoute>
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
])

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'font-sans text-sm font-medium',
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  )
}
