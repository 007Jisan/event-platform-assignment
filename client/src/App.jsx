import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from './store';
import { Calendar, MapPin, Trash2, LogOut, PlusCircle, Search, User } from 'lucide-react';

const API_URL = "http://localhost:5000/api"; 

// --- ন্যাপবার ---
const Navbar = () => {
  const { user, logout } = useStore();
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EventHub
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition">All Events</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition">Dashboard</Link>
                <button onClick={logout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- হোম পেজ ---
const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/events`)
      .then(res => { setEvents(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Discover Amazing <span className="text-indigo-300">Local Events</span></h1>
          <p className="text-xl text-indigo-100 mb-8">Join the community, find your passion, and make memories.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-indigo-600 pl-4">Upcoming Events</h2>
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading awesome events...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(ev => (
              <div key={ev._id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 border border-gray-100 flex flex-col">
                <div className={`h-48 flex items-center justify-center text-white text-2xl font-bold ${getGradient(ev.category)}`}>
                  {ev.category || 'Event'}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{ev.category || 'General'}</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">{ev.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{ev.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{ev.description}</p>
                  <div className="flex items-center text-gray-500 text-sm gap-2 mt-auto pt-4 border-t border-gray-100">
                    <MapPin size={16} className="text-red-500" /> {ev.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- ড্যাশবোর্ড (FIXED TEXT COLOR) ---
const Dashboard = () => {
  const { user } = useStore();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '', category: 'Tech' });

  const fetchEvents = () => {
    axios.get(`${API_URL}/events`).then(res => setEvents(res.data));
  };

  useEffect(() => fetchEvents(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.title) return alert("Title required");
    await axios.post(`${API_URL}/events`, form);
    fetchEvents();
    setForm({ title: '', date: '', location: '', description: '', category: 'Tech' });
    alert("Event Created Successfully!");
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    await axios.delete(`${API_URL}/events/${id}`);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-600 p-3 rounded-full text-white"><User size={24}/></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Hello, {user?.name || 'User'}!</h2>
            <p className="text-gray-500">Manage your events here.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* ফর্ম সেকশন */}
          <div className="lg:col-span-4 h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600">
                <PlusCircle size={20}/> Create Event
              </h3>
              
              {/* --- ফর্ম --- */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Title Input */}
                <input 
                  placeholder="Event Title" 
                  className="w-full bg-white text-gray-900 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder-gray-400" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                />
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Date Input */}
                  <input 
                    type="date" 
                    className="w-full bg-white text-gray-900 border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={form.date} 
                    onChange={e => setForm({...form, date: e.target.value})} 
                  />
                  
                  {/* Category Select */}
                  <select 
                    className="w-full bg-white text-gray-900 border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})}
                  >
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="Art">Art</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                {/* Location Input */}
                <input 
                  placeholder="Location" 
                  className="w-full bg-white text-gray-900 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" 
                  value={form.location} 
                  onChange={e => setForm({...form, location: e.target.value})} 
                />

                {/* Description Textarea */}
                <textarea 
                  rows="3" 
                  placeholder="Description..." 
                  className="w-full bg-white text-gray-900 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />

                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition">Publish Event</button>
              </form>
            </div>
          </div>

          {/* ইভেন্ট লিস্ট */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-700">Your Published Events</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {events.length === 0 ? <p className="p-10 text-center text-gray-400">You haven't posted any events yet.</p> : events.map(ev => (
                  <div key={ev._id} className="p-6 hover:bg-gray-50 transition flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{ev.title}</h4>
                      <div className="text-sm text-gray-500 mt-1 flex gap-3">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {ev.date}</span>
                        <span className="flex items-center gap-1 text-indigo-500"><MapPin size={14}/> {ev.location}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(ev._id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- লগইন পেজ ---
const Login = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login({ name: email.split('@')[0], email }); 
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Please sign in to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input className="w-full bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input className="w-full bg-white text-gray-900 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" type="password" placeholder="••••••••" required />
          </div>
          <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Sign In</button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Just enter any email to test (Assignment Mode)</p>
      </div>
    </div>
  );
};

const getGradient = (category) => {
  switch(category) {
    case 'Tech': return 'bg-gradient-to-r from-blue-400 to-blue-600';
    case 'Music': return 'bg-gradient-to-r from-pink-400 to-rose-600';
    case 'Art': return 'bg-gradient-to-r from-purple-400 to-purple-600';
    default: return 'bg-gradient-to-r from-emerald-400 to-teal-600';
  }
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;