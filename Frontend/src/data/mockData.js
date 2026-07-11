// Mock data shaped to match the MySQL schema in the project spec.
// Replace with real API calls to the existing backend endpoints
// (GET /events, GET /categories, GET /registrations, etc.)

export const categories = [
  { id: 1, category_name: 'Seminar' },
  { id: 2, category_name: 'Workshop' },
  { id: 3, category_name: 'Hackathon' },
  { id: 4, category_name: 'Conference' },
  { id: 5, category_name: 'Sports' },
  { id: 6, category_name: 'Cultural Program' },
]

export const events = [
  {
    id: 1,
    event_name: 'Frontend Systems Workshop',
    category_id: 2,
    organizer: 'Dept. of Computer Engineering',
    event_date: '2026-07-22',
    event_time: '10:00',
    venue: 'Lab Block, Room 204',
    registration_fee: 0,
    max_participants: 60,
    registered_count: 42,
    description: 'A hands-on session covering component architecture, design tokens, and building accessible interfaces from scratch.',
    banner: 'workshop',
  },
  {
    id: 2,
    event_name: 'National Hackathon 2026',
    category_id: 3,
    organizer: 'Innovation Cell',
    event_date: '2026-08-03',
    event_time: '09:00',
    venue: 'Main Auditorium',
    registration_fee: 500,
    max_participants: 200,
    registered_count: 178,
    description: '24-hour build sprint for student teams. Mentors, prizes, and a demo night with industry judges.',
    banner: 'hackathon',
  },
  {
    id: 3,
    event_name: 'Annual Tech Conference',
    category_id: 4,
    organizer: 'Alumni Association',
    event_date: '2026-08-15',
    event_time: '11:30',
    venue: 'Convention Hall A',
    registration_fee: 1200,
    max_participants: 400,
    registered_count: 261,
    description: 'Talks and panels on systems, infrastructure, and product from engineers building at scale.',
    banner: 'conference',
  },
  {
    id: 4,
    event_name: 'Inter-College Cricket Meet',
    category_id: 5,
    organizer: 'Sports Committee',
    event_date: '2026-07-28',
    event_time: '08:00',
    venue: 'Sports Ground',
    registration_fee: 100,
    max_participants: 120,
    registered_count: 96,
    description: 'Round-robin cricket tournament between eight participating colleges. Team registration only.',
    banner: 'sports',
  },
  {
    id: 5,
    event_name: 'Design Thinking Seminar',
    category_id: 1,
    organizer: 'Dept. of Management Studies',
    event_date: '2026-07-18',
    event_time: '14:00',
    venue: 'Seminar Hall 2',
    registration_fee: 0,
    max_participants: 80,
    registered_count: 33,
    description: 'An introduction to design thinking frameworks with case studies from regional startups.',
    banner: 'seminar',
  },
  {
    id: 6,
    event_name: 'Cultural Fest — Rangotsav',
    category_id: 6,
    organizer: 'Student Council',
    event_date: '2026-09-05',
    event_time: '17:00',
    venue: 'Open Air Theatre',
    registration_fee: 50,
    max_participants: 500,
    registered_count: 210,
    description: 'An evening of music, dance, and street-food stalls to close out the semester.',
    banner: 'cultural',
  },
]

export const users = [
  { id: 1, fullname: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98765 43210', role: 'admin', profile_image: null },
  { id: 2, fullname: 'Priya Nair', email: 'priya@example.com', phone: '+91 91234 56780', role: 'user', profile_image: null },
  { id: 3, fullname: 'Rohan Gupta', email: 'rohan@example.com', phone: '+91 99887 76655', role: 'user', profile_image: null },
  { id: 4, fullname: 'Sneha Iyer', email: 'sneha@example.com', phone: '+91 90011 22334', role: 'user', profile_image: null },
  { id: 5, fullname: 'Kabir Singh', email: 'kabir@example.com', phone: '+91 98080 12345', role: 'user', profile_image: null },
]

export const registrations = [
  { id: 1, user_id: 2, event_id: 1, registration_date: '2026-06-30', status: 'approved' },
  { id: 2, user_id: 3, event_id: 2, registration_date: '2026-07-01', status: 'pending' },
  { id: 3, user_id: 4, event_id: 3, registration_date: '2026-07-02', status: 'approved' },
  { id: 4, user_id: 5, event_id: 1, registration_date: '2026-07-03', status: 'cancelled' },
  { id: 5, user_id: 2, event_id: 4, registration_date: '2026-07-04', status: 'approved' },
]

export const currentUser = users[1] // demo: logged in as Priya Nair (participant)
export const currentAdmin = users[0] // demo: logged in as Aarav Sharma (admin)

export const categoryName = (id) => categories.find((c) => c.id === id)?.category_name ?? 'Uncategorized'
export const eventById = (id) => events.find((e) => e.id === Number(id))

export const formatDate = (isoDate) => {
  if (!isoDate) return ''
  try {
    const dateStr = typeof isoDate === 'string' ? isoDate.substring(0, 10) : new Date(isoDate).toISOString().substring(0, 10)
    const dateObj = new Date(dateStr + 'T00:00:00')
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }
    return dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch (e) {
    return 'Invalid Date'
  }
}

export const formatTime = (t) => {
  if (!t) return ''
  try {
    const parts = t.split(':')
    if (parts.length < 2) return t
    const [h, m] = parts.map(Number)
    if (isNaN(h) || isNaN(m)) return t
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 === 0 ? 12 : h % 12
    return `${hour}:${String(m).padStart(2, '0')} ${period}`
  } catch (e) {
    return t
  }
}
