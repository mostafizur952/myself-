import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Globe, User as UserIcon, Shield, Download, Play, Share2, Wallet, MessageCircle, LogOut, Menu, X, Search, Plus } from 'lucide-react';
import { useAuth } from './AuthContext';
import { MOCK_VIDEOS, CATEGORIES, Video } from './types';

// --- API Configuration ---
const API_BASE_URL = ''; // Use relative path for local backend

// --- Components ---

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }: any) => {
  const base = "px-6 py-3 rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50";
  const variants: any = {
    primary: "bg-[#22C55E] text-white shadow-lg shadow-green-200 hover:bg-[#16a34a]",
    secondary: "bg-white text-gray-800 border border-gray-100 shadow-sm hover:bg-gray-50",
    outline: "border-2 border-[#22C55E] text-[#22C55E] hover:bg-green-50"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- Screens ---

const HomeScreen = ({ onSelectVideo, adUrl }: { onSelectVideo: (v: Video) => void, adUrl: string }) => {
  const [activeTab, setActiveTab] = useState('All');
  const filteredVideos = activeTab === 'All' ? MOCK_VIDEOS : MOCK_VIDEOS.filter(v => v.category === activeTab);

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Admin Notice */}
      <Card className="bg-green-50 border-green-100 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-green-900 text-sm">Admin Notice</h3>
            <p className="text-green-700 text-xs">New update: Earn 5 coins per hour of watching!</p>
          </div>
        </div>
      </Card>

      {/* Ad Banner */}
      <a 
        href={adUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="bg-gradient-to-r from-green-600 to-green-400 h-24 flex flex-col items-center justify-center relative group overflow-hidden">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          <span className="text-white text-lg font-black italic tracking-tighter drop-shadow-md">DOWNLOAD HIGH SPEED</span>
          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Click to Start Download</span>
          <div className="absolute top-2 right-2 bg-white/20 px-2 py-0.5 rounded text-[10px] text-white backdrop-blur-sm">Ad</div>
        </Card>
      </a>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === cat ? 'bg-[#22C55E] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video List */}
      <div className="grid gap-4">
        {filteredVideos.map(video => (
          <Card key={video.id} className="group cursor-pointer" onClick={() => onSelectVideo(video)}>
            <div className="relative aspect-video">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                {video.duration}
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{video.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{video.category} • 2.4M views</p>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-lg">
                <Menu className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#22C55E] rounded-2xl shadow-xl shadow-green-200 flex items-center justify-center text-white active:scale-95 transition-transform z-50">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

const BrowserScreen = () => (
  <div className="h-full flex flex-col">
    <div className="p-4 bg-white border-b border-gray-100 flex gap-2">
      <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2 flex items-center gap-2">
        <Globe className="w-4 h-4 text-gray-400" />
        <input type="text" value="https://youtube.com" readOnly className="bg-transparent text-sm text-gray-600 outline-none w-full" />
      </div>
      <button className="p-2 bg-gray-100 rounded-xl"><Search className="w-5 h-5 text-gray-500" /></button>
    </div>
    <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 text-center">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto">
          <Globe className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">In-App Browser</h2>
        <p className="text-gray-500 text-sm max-w-xs">YouTube is automatically loaded. Browse and select any video to download.</p>
        <div className="aspect-video bg-white rounded-2xl shadow-inner flex items-center justify-center border-2 border-dashed border-gray-200">
           <span className="text-gray-400 text-xs">WebView Placeholder</span>
        </div>
      </div>
    </div>
  </div>
);

const PlayerScreen = ({ video, onBack, adUrl }: { video: Video, onBack: () => void, adUrl: string }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Download started via Python Backend API!');
    }, 2000);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-6 h-6" /></button>
        <h2 className="font-bold text-lg truncate">{video.title}</h2>
      </div>
      <div className="aspect-video bg-black relative">
        <img src={video.thumbnail} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 flex items-center justify-center">
           <Play className="w-16 h-16 text-white fill-white opacity-80" />
        </div>
      </div>
      <div className="p-6 space-y-6 flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{video.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{video.category} • {video.duration}</p>
          </div>
          <button className="p-3 bg-gray-100 rounded-2xl text-gray-600"><Share2 className="w-6 h-6" /></button>
        </div>

        <Button onClick={handleDownload} disabled={downloading} className="w-full py-4 text-lg">
          <Download className={`w-6 h-6 ${downloading ? 'animate-bounce' : ''}`} />
          {downloading ? 'Processing...' : 'Download Video'}
        </Button>

        {/* Adsterra Banner */}
        <a 
          href={adUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 h-20 flex flex-col items-center justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5 group-hover:bg-transparent transition-colors" />
            <span className="text-green-400 text-sm font-black tracking-widest uppercase">Premium Server Download</span>
            <span className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.2em]">Click to Unlock High Speed</span>
            <div className="absolute top-2 right-2 bg-white/5 px-2 py-0.5 rounded text-[8px] text-white/50">Ad</div>
          </Card>
        </a>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">More in {video.category}</h3>
          {MOCK_VIDEOS.filter(v => v.category === video.category && v.id !== video.id).map(v => (
            <div key={v.id} className="flex gap-3 group cursor-pointer" onClick={() => onBack()}>
              <div className="relative w-24 h-16 flex-shrink-0">
                <img src={v.thumbnail} className="w-full h-full rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-[8px] text-white font-mono">
                  {v.duration}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold line-clamp-2 text-gray-800 group-hover:text-green-600 transition-colors">{v.title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">2.4M views • {v.duration}</p>
              </div>
            </div>
          ))}
          {MOCK_VIDEOS.filter(v => v.category === video.category && v.id !== video.id).length === 0 && (
            <p className="text-xs text-gray-400 italic">No other videos in this category yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const handleSellCoins = () => {
    const message = encodeURIComponent(`Hello Admin, I want to sell my ${user.coins} gold coins. My User ID is ${user.id}.`);
    window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <UserIcon className="w-12 h-12 text-green-600" />
          </div>
          <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 bg-green-50 border-green-100">
          <Wallet className="w-6 h-6 text-green-600 mb-2" />
          <p className="text-xs text-green-700 font-medium uppercase tracking-wider">Balance</p>
          <h3 className="text-2xl font-bold text-green-900">{user.coins} <span className="text-sm font-normal">Coins</span></h3>
        </Card>
        <Card className="p-5 bg-blue-50 border-blue-100">
          <Share2 className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-xs text-blue-700 font-medium uppercase tracking-wider">Referrals</p>
          <h3 className="text-2xl font-bold text-blue-900">12 <span className="text-sm font-normal">Users</span></h3>
        </Card>
      </div>

      <Card className="p-4 space-y-3">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Your Referral Link</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-600 font-mono truncate">
            fastyt.app/ref/{user.referral_code}
          </div>
          <button className="p-2 bg-gray-100 rounded-xl text-gray-500 active:scale-90 transition-transform"><Share2 className="w-5 h-5" /></button>
        </div>
      </Card>

      <div className="space-y-3">
        <Button variant="secondary" className="w-full justify-start">Update Profile</Button>
        <Button onClick={handleSellCoins} className="w-full bg-[#25D366] hover:bg-[#128C7E] shadow-green-100">
          <MessageCircle className="w-5 h-5" />
          Sell Coins via WhatsApp
        </Button>
        <Button onClick={logout} variant="secondary" className="w-full justify-start text-red-500 border-red-50 border">
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

const AdminScreen = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [newAdUrl, setNewAdUrl] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(setUsers);

    fetch(`${API_BASE_URL}/api/settings/ad-url`)
      .then(res => res.json())
      .then(data => setNewAdUrl(data.ad_url));
  }, [token]);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleUpdateAdUrl = async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/update-ad-url`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ adUrl: newAdUrl })
    });
    if (res.ok) {
      alert('Ad URL updated successfully! Refresh the app to see changes.');
    } else {
      alert('Failed to update Ad URL');
    }
  };

  const handleUpdateCoins = async (userId: number, currentCoins: number) => {
    const newCoins = prompt(`Enter new coin balance for user:`, currentCoins.toString());
    if (newCoins !== null) {
      const res = await fetch(`${API_BASE_URL}/api/admin/update-user-coins`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ userId, coins: parseInt(newCoins) })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, coins: parseInt(newCoins) } : u));
        alert('User coins updated successfully!');
      } else {
        alert('Failed to update coins');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      
      {/* Ad Management Section */}
      <Card className="p-4 space-y-4 border-green-100 bg-green-50/30">
        <div className="flex items-center gap-2 text-green-700">
          <Globe className="w-5 h-5" />
          <h3 className="font-bold">Manage Ad Banner URL</h3>
        </div>
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Enter Adsterra/Direct Link URL" 
            value={newAdUrl}
            onChange={e => setNewAdUrl(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-green-500 text-sm" 
          />
          <Button onClick={handleUpdateAdUrl} className="w-full py-2 text-sm">Update Ad URL</Button>
        </div>
      </Card>

      <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search users..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full text-sm" 
        />
      </div>
      <div className="space-y-4">
        {filteredUsers.map(u => (
          <Card key={u.id} className="p-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-gray-900">{u.name}</h4>
              <p className="text-xs text-gray-500">{u.email}</p>
              <p className="text-xs font-bold text-green-600 mt-1">{u.coins} Coins</p>
            </div>
            <button 
              onClick={() => handleUpdateCoins(u.id, u.coins)}
              className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              Edit
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [refCode, setRefCode] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/signup`;
    const body = isLogin ? { email, password } : { email, password, name, referralCode: refCode };
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (res.ok) {
      const data = await res.json();
      login(data.token, data.user);
    } else {
      alert('Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center">
      <div className="space-y-8 max-w-sm mx-auto w-full">
        <div className="text-center space-y-2">
          <img src="/logo.png" className="w-32 h-32 object-contain mx-auto mb-4 drop-shadow-2xl" alt="Logo" />
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fast YT</h1>
          <p className="text-gray-500">Sign in to start earning coins</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-green-500 transition-colors" 
            />
          )}
          <input 
            type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-green-500 transition-colors" 
          />
          <input 
            type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-green-500 transition-colors" 
          />
          {!isLogin && (
            <input 
              type="text" placeholder="Referral Code (Optional)" value={refCode} onChange={e => setRefCode(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-green-500 transition-colors" 
            />
          )}
          <Button className="w-full py-4 text-lg mt-4">{isLogin ? 'Login' : 'Create Account'}</Button>
        </form>

        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-500 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-green-600 font-bold underline">
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </button>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or continue with</span></div>
        </div>

        <Button variant="secondary" className="w-full py-4">
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Login with Google
        </Button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { user, isLoading, token } = useAuth();
  const [activeScreen, setActiveScreen] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [secondsActive, setSecondsActive] = useState(0);
  const [adUrl, setAdUrl] = useState('https://www.effectivegatecpm.com/kcb07k9mh?key=c15467c9cd495f026d96803fae10177a');

  // Fetch Ad URL
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings/ad-url`)
      .then(res => res.json())
      .then(data => {
        if (data.ad_url) setAdUrl(data.ad_url);
      })
      .catch(err => console.error('Failed to fetch ad URL', err));
  }, []);

  // Track usage time
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      setSecondsActive(prev => {
        const next = prev + 10;
        if (next >= 60) { // Sync every minute
          fetch(`${API_BASE_URL}/api/user/update-coins`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ seconds: next })
          });
          return 0;
        }
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [token]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo.png" className="w-20 h-20 animate-pulse" alt="Logo" />
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (!user && activeScreen !== 'home' && activeScreen !== 'browser') {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="w-10 h-10 object-contain" alt="Logo" />
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none">Fast YT</h1>
              <p className="text-[8px] font-bold text-green-600 uppercase tracking-widest">Downloader</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-2 border border-green-100">
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">{user.coins}</span>
              </div>
            )}
            <button className="p-2 bg-gray-100 rounded-xl text-gray-500 active:scale-90 transition-transform">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedVideo ? (
              <motion.div
                key="player"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="h-full"
              >
                <PlayerScreen video={selectedVideo} onBack={() => setSelectedVideo(null)} adUrl={adUrl} />
              </motion.div>
            ) : (
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
                {activeScreen === 'home' && <HomeScreen onSelectVideo={setSelectedVideo} adUrl={adUrl} />}
                {activeScreen === 'browser' && <BrowserScreen />}
                {activeScreen === 'profile' && <ProfileScreen />}
                {activeScreen === 'admin' && <AdminScreen />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Nav */}
        {!selectedVideo && (
          <nav className="bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 pb-8 flex justify-around items-center sticky bottom-0 z-40">
            <NavButton active={activeScreen === 'home'} icon={Home} label="Home" onClick={() => setActiveScreen('home')} />
            <NavButton active={activeScreen === 'browser'} icon={Globe} label="Browser" onClick={() => setActiveScreen('browser')} />
            <NavButton active={activeScreen === 'profile'} icon={UserIcon} label="Profile" onClick={() => setActiveScreen('profile')} />
            {user?.is_admin && (
              <NavButton active={activeScreen === 'admin'} icon={Shield} label="Admin" onClick={() => setActiveScreen('admin')} />
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

const NavButton = ({ active, icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`p-2 rounded-2xl transition-all ${active ? 'bg-green-50 shadow-sm' : ''}`}>
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);
