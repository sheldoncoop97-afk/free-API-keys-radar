import React, { useState, useEffect, useMemo } from 'react';
import { RADAR_APIS } from './data/radarApis';
import { FreeApiItem, ApiCategory, RadarNotification } from './types/radar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CategoryList } from './components/CategoryList';
import { ApiCard } from './components/ApiCard';
import { ApiDetailsModal } from './components/ApiDetailsModal';
import { SplashScreen } from './components/SplashScreen';
import { SidebarDrawer } from './components/SidebarDrawer';
import { NotificationCenter } from './components/NotificationCenter';
import { AdultSpaceAgeGate } from './components/AdultSpaceAgeGate';
import { AnimatedIconShowcase } from './components/AnimatedIconShowcase';
import { ImageToVideoStudio } from './components/ImageToVideoStudio';
import { MusicStudio } from './components/MusicStudio';
import { SearchGroundingStudio } from './components/SearchGroundingStudio';
import { DownloadApkModal } from './components/DownloadApkModal';
import { SettingsModal } from './components/SettingsModal';
import { UmbrellaLogo } from './components/UmbrellaLogo';
import { playUiBeep, playSubBassStart } from './audio/umbrellaSound';
import {
  Search,
  ChevronRight,
  Filter,
  Sparkles,
  ShieldAlert,
  Film,
  FolderArchive,
  Star,
  Clock,
  Radio,
  ExternalLink,
  Flame,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Active space: false = Public Space, true = Second Space (Adult 18+ Classified)
  const [isAdultSpace, setIsAdultSpace] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    return localStorage.getItem('umbrella_age_verified') === 'true';
  });

  // Navigation tabs: 'home' | 'search' | 'favorites' | 'history' | 'settings' | 'about' | 'adult'
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'favorites' | 'history' | 'settings' | 'about' | 'adult'>('home');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ApiCategory | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Selected API for Details View Modal (Section 3)
  const [selectedApi, setSelectedApi] = useState<FreeApiItem | null>(null);

  // Favorites & History (persisted in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('umbrella_favorites');
      return saved ? JSON.parse(saved) : ['openai-free-tier', 'veo-video-ai', 'google-gemini-api'];
    } catch {
      return ['openai-free-tier', 'veo-video-ai', 'google-gemini-api'];
    }
  });

  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('umbrella_history');
      return saved ? JSON.parse(saved) : ['openai-free-tier', 'veo-video-ai'];
    } catch {
      return ['openai-free-tier', 'veo-video-ai'];
    }
  });

  // Notifications state matching Section 4
  const [notifications, setNotifications] = useState<RadarNotification[]>([
    {
      id: 'notif-1',
      title: 'Free API Radar',
      message: 'New free API available! OpenAI (Free Tier) has been added to the database.',
      timeAgo: '5 min temu',
      timestamp: Date.now() - 5 * 60 * 1000,
      read: false,
      apiId: 'openai-free-tier'
    },
    {
      id: 'notif-2',
      title: 'Free API Radar',
      message: 'New Image-to-Video API added: Google Veo 3.1 Fast Generate Preview with 16:9 and 9:16 support.',
      timeAgo: '12 min temu',
      timestamp: Date.now() - 12 * 60 * 1000,
      read: false,
      apiId: 'veo-video-ai'
    },
    {
      id: 'notif-3',
      title: 'Umbrella Bio-Radar',
      message: 'Rate limit updated: Groq Cloud now offers 30 RPM / 14,400 requests/day for Llama 3 models.',
      timeAgo: '1 godz. temu',
      timestamp: Date.now() - 60 * 60 * 1000,
      read: true,
      apiId: 'groq-cloud'
    }
  ]);

  // Modal visibility states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [iconShowcaseOpen, setIconShowcaseOpen] = useState(false);
  const [videoStudioOpen, setVideoStudioOpen] = useState(false);
  const [musicStudioOpen, setMusicStudioOpen] = useState(false);
  const [searchGroundingOpen, setSearchGroundingOpen] = useState(false);
  const [downloadApkOpen, setDownloadApkOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync favorites & history to localStorage
  useEffect(() => {
    localStorage.setItem('umbrella_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('umbrella_history', JSON.stringify(history));
  }, [history]);

  // Toggle Adult Space with Age Gate check
  const handleToggleAdultSpace = () => {
    if (isAdultSpace) {
      setIsAdultSpace(false);
      setSelectedCategory('all');
      setSelectedTag(null);
      setSearchQuery('');
      setActiveTab('home');
      playUiBeep(1000, 0.03);
    } else {
      if (isAgeVerified) {
        setIsAdultSpace(true);
        setSelectedCategory('adult-uncensored');
        setSelectedTag(null);
        setSearchQuery('');
        setActiveTab('adult');
        playUiBeep(1400, 0.04);
      } else {
        setShowAgeGate(true);
      }
    }
  };

  const handleConfirmAgeGate = () => {
    setIsAgeVerified(true);
    localStorage.setItem('umbrella_age_verified', 'true');
    setShowAgeGate(false);
    setIsAdultSpace(true);
    setSelectedCategory('adult-uncensored');
    setSelectedTag(null);
    setSearchQuery('');
    setActiveTab('adult');
  };

  const handleSelectApi = (api: FreeApiItem) => {
    setSelectedApi(api);
    setHistory((prev) => [api.id, ...prev.filter((id) => id !== api.id)].slice(0, 30));
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered APIs based on active space, category, search query, and tags
  const filteredApis = useMemo(() => {
    return RADAR_APIS.filter((api) => {
      if (isAdultSpace ? !api.isAdult : api.isAdult) return false;

      // Category filter
      if (selectedCategory !== 'all' && api.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && !api.tags.includes(selectedTag)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = api.name.toLowerCase().includes(query);
        const matchesProvider = api.provider.toLowerCase().includes(query);
        const matchesDesc = api.shortDescription.toLowerCase().includes(query);
        const matchesTags = api.tags.some((t) => t.toLowerCase().includes(query));
        const matchesCategory = api.category.toLowerCase().includes(query);
        const matchesAcquisitionLinks = [api.websiteUrl, api.docsUrl, api.endpointUrl, ...api.keySteps]
          .some((value) => value.toLowerCase().includes(query));
        return matchesName || matchesProvider || matchesDesc || matchesTags || matchesCategory || matchesAcquisitionLinks;
      }

      return true;
    });
  }, [isAdultSpace, selectedCategory, selectedTag, searchQuery]);

  // Favorite APIs list
  const favoriteApis = useMemo(() => {
    return RADAR_APIS.filter((api) => favorites.includes(api.id) && Boolean(api.isAdult) === isAdultSpace);
  }, [favorites, isAdultSpace]);

  // History APIs list
  const historyApis = useMemo(() => {
    return history
      .map((id) => RADAR_APIS.find((api) => api.id === id))
      .filter((api): api is FreeApiItem => api !== undefined && Boolean(api.isAdult) === isAdultSpace);
  }, [history, isAdultSpace]);

  // Unread notifications count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Available tags in current view
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    RADAR_APIS.filter((api) => (isAdultSpace ? true : !api.isAdult)).forEach((api) => {
      api.tags.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [isAdultSpace]);

  // If Splash Screen active
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className={`min-h-screen text-zinc-100 flex flex-col font-['Rajdhani'] selection:bg-red-600 selection:text-white ${isAdultSpace ? 'bg-[#080203]' : 'bg-[#08090c]'}`}>
      {/* Background Graphic & Cyber Ambient Glow (Section 5) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center z-0 mix-blend-screen scale-102"
        style={{ backgroundImage: `url('/assets/umbrella/background.png')` }}
      />
      <div className="fixed inset-0 pointer-events-none bg-radial from-transparent via-black/70 to-black z-0" />
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${isAdultSpace ? 'bg-red-950/20' : 'bg-red-950/5'}`} />

      {/* Main App Header (Section 3) */}
      <Header
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadNotificationsCount={unreadCount}
        isAdultSpace={isAdultSpace}
        onToggleAdultSpace={handleToggleAdultSpace}
        onOpenDownloadApk={() => setDownloadApkOpen(true)}
        onOpenVideoStudio={() => setVideoStudioOpen(true)}
        onOpenIconShowcase={() => setIconShowcaseOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 z-10 relative">
        {/* Banner: Space Warning or Announcement */}
        {isAdultSpace ? (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-950 via-red-900/60 to-black border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-[0_0_15px_#dc2626]">
                <ShieldAlert size={24} />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black tracking-wider text-white flex items-center gap-2">
                  <span>DRUGA PRZESTRZEŃ: SKLASYFIKOWANA STREFA DLA DOROSŁYCH (18+)</span>
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block" />
                </div>
                <div className="text-xs text-red-200/90 font-mono mt-0.5">
                  Osobna strefa API 18+, dostępna po potwierdzeniu pełnoletności.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playUiBeep(1000, 0.03);
                setIsAdultSpace(false);
                setSelectedCategory('all');
                setSelectedTag(null);
                setSearchQuery('');
                setActiveTab('home');
              }}
              className="px-4 py-2 rounded-xl bg-black/60 hover:bg-black text-red-300 hover:text-white border border-red-500/50 text-xs font-mono font-bold tracking-wider uppercase transition-all shrink-0"
            >
              Powrót do Standardu
            </button>
          </div>
        ) : (
          /* Feature Quick Jump Bar */
          <div className="mb-6 flex items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <UmbrellaLogo size={22} animationState="pulse" showGlow={true} />
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest hidden sm:inline">
                Szybki dostęp:
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Image to video button (User requested!) */}
              <button
                onClick={() => {
                  playUiBeep(1100, 0.03);
                  setVideoStudioOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Film size={14} className="text-amber-400" />
                <span>Image to Video (Veo 3.1)</span>
              </button>

              {/* Second tab / Adult space button */}
              <button
                onClick={() => {
                  playUiBeep(1200, 0.04);
                  handleToggleAdultSpace();
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <ShieldAlert size={14} className="text-red-500" />
                <span>Druga Przestrzeń (18+)</span>
              </button>

              {/* Download source archive */}
              <button
                onClick={() => {
                  playUiBeep(1100, 0.03);
                  setDownloadApkOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
              >
                <FolderArchive size={14} className="text-emerald-400" />
                <span>Pobierz kod źródłowy (ZIP)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: HOME TAB */}
        {(activeTab === 'home' || activeTab === 'adult') && (
          <div className="space-y-8">
            {activeTab === 'adult' && (
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-600/50">
                <h2 className="text-xl font-black tracking-wider text-white">DRUGA PRZESTRZEŃ • API 18+</h2>
                <p className="mt-1 text-sm text-red-200/80">Oddzielna, pełnoletnia strefa. Wyszukuj API i oficjalne strony dostawców.</p>
              </div>
            )}
            {/* SEARCH BAR (Direct Match to Section 3 Left Screen) */}
            <div className="relative">
              <div className="relative flex items-center w-full rounded-2xl bg-zinc-950/90 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)] focus-within:border-red-500 focus-within:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all overflow-hidden">
                <div className="pl-4 pr-2 text-red-500">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj API, strony klucza lub konsoli (np. console.groq.com)..."
                  className="w-full py-4 pr-12 bg-transparent text-sm md:text-base text-white placeholder-zinc-500 focus:outline-hidden font-sans"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-zinc-400 hover:text-white mr-2"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <div className="pr-4 text-zinc-500">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>

              {/* Tag filtering chips */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs font-mono">
                <button
                  onClick={() => {
                    playUiBeep(850, 0.02);
                    setSelectedTag(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                    selectedTag === null
                      ? 'bg-red-600 text-white border-red-400 font-bold'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  Wszystkie tagi
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      playUiBeep(850, 0.02);
                      setSelectedTag(selectedTag === tag ? null : tag);
                    }}
                    className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                      selectedTag === tag
                        ? 'bg-red-600 text-white border-red-400 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout: Two Column on Desktop, Mobile Stack */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Category Cards (Direct Match to Section 3) */}
              <div className="lg:col-span-5 space-y-4">
                <CategoryList
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  isAdultSpace={isAdultSpace}
                  onOpenVideoStudio={() => setVideoStudioOpen(true)}
                />
              </div>

              {/* Right Column: API Grid & Details preview */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                      Wykryte darmowe API ({filteredApis.length})
                    </span>
                    {selectedCategory !== 'all' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-700">
                        {selectedCategory}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                    <span>Skanowanie aktywne</span>
                  </span>
                </div>

                {filteredApis.length === 0 ? (
                  <div className="p-12 rounded-2xl bg-zinc-950/70 border border-zinc-900 text-center space-y-3">
                    <UmbrellaLogo size={48} animationState="idle" className="mx-auto opacity-50" />
                    <h4 className="text-base font-bold text-white">Brak wyników dla podanego filtra</h4>
                    <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto">
                      Spróbuj zresetować kategorię lub zmienić frazę wyszukiwania w radarze.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedTag(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-mono text-xs font-bold"
                    >
                      Resetuj filtry
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredApis.map((api) => (
                      <ApiCard
                        key={api.id}
                        api={api}
                        onSelect={handleSelectApi}
                        isFavorite={favorites.includes(api.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <UmbrellaLogo size={32} animationState="rotate" />
              <div>
                <h2 className="text-2xl font-bold tracking-wider text-white">
                  GLOBALNY RADAR WYSZUKIWANIA
                </h2>
                <p className="text-xs font-mono text-zinc-400">
                  Przeszukuj API oraz oficjalne strony konsol, dokumentacji i rejestracji kluczy
                </p>
              </div>
            </div>

            <div className="relative flex items-center w-full rounded-2xl bg-zinc-950/90 border border-red-500/50 p-2">
              <Search className="ml-3 text-red-500" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj API lub strony uzyskania klucza (np. console.groq.com)..."
                className="w-full py-2.5 px-3 bg-transparent text-sm text-white focus:outline-hidden font-sans"
                autoFocus
              />
              <button
                onClick={() => setSearchGroundingOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-1.5 shrink-0"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>Google Search Live</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredApis.map((api) => (
                <ApiCard
                  key={api.id}
                  api={api}
                  onSelect={handleSelectApi}
                  isFavorite={favorites.includes(api.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-yellow-400">
                  <Star size={22} className="fill-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-wider text-white">
                    ULUBIONE DARMOWE API ({favoriteApis.length})
                  </h2>
                  <p className="text-xs font-mono text-zinc-400">
                    Twoja prywatna lista najczęściej używanych kluczy API
                  </p>
                </div>
              </div>

              {favorites.length > 0 && (
                <button
                  onClick={() => setFavorites([])}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
                >
                  Wyczyść listę
                </button>
              )}
            </div>

            {favoriteApis.length === 0 ? (
              <div className="p-12 rounded-2xl bg-zinc-950/70 border border-zinc-900 text-center space-y-3">
                <Star size={36} className="mx-auto text-zinc-600" />
                <h4 className="text-base font-bold text-white">Brak zapisanych ulubionych API</h4>
                <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto">
                  Kliknij gwiazdkę przy dowolnym API na liście lub w oknie szczegółów, aby dodać je do ulubionych.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteApis.map((api) => (
                  <ApiCard
                    key={api.id}
                    api={api}
                    onSelect={handleSelectApi}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-red-500/40 text-red-400">
                  <Clock size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-wider text-white">
                    HISTORIA PRZEGLĄDANIA ({historyApis.length})
                  </h2>
                  <p className="text-xs font-mono text-zinc-400">
                    Ostatnio otwierane i testowane klucze API w terminalu
                  </p>
                </div>
              </div>

              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
                >
                  Wyczyść historię
                </button>
              )}
            </div>

            {historyApis.length === 0 ? (
              <div className="p-12 rounded-2xl bg-zinc-950/70 border border-zinc-900 text-center space-y-3">
                <Clock size={36} className="mx-auto text-zinc-600" />
                <h4 className="text-base font-bold text-white">Brak historii przeglądania</h4>
                <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto">
                  Otwórz szczegóły dowolnego API, aby pojawiło się ono w historii.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {historyApis.map((api) => (
                  <ApiCard
                    key={api.id}
                    api={api}
                    onSelect={handleSelectApi}
                    isFavorite={favorites.includes(api.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <UmbrellaLogo size={32} animationState="ready" />
              <div>
                <h2 className="text-2xl font-bold tracking-wider text-white">
                  CENTRUM KONTROLI RADARU
                </h2>
                <p className="text-xs font-mono text-zinc-400">
                  Zarządzaj ustawieniami, pobierz kod źródłowy lub przetestuj animacje
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Druga Przestrzeń: API dla dorosłych (18+)</div>
                  <div className="text-xs text-zinc-400 font-sans">
                    Potwierdzenie ukończenia 18 lat: {isAgeVerified ? 'zapisane na tym urządzeniu' : 'brak potwierdzenia'}
                  </div>
                </div>
                <button
                  onClick={handleToggleAdultSpace}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    isAdultSpace
                      ? 'bg-red-600 text-white border-red-400 shadow'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
                  }`}
                >
                  {isAdultSpace ? 'Wyłącz 18+' : 'Włącz 18+'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Animacja Startowa (Splash Screen)</div>
                  <div className="text-xs text-zinc-400 font-sans">
                    Odtwórz pełną 4-fazową sekwencję z lektorem i dźwiękiem mechanicznym
                  </div>
                </div>
                <button
                  onClick={() => setShowSplash(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-red-950 border border-red-500/50 text-red-300 hover:text-white text-xs font-mono"
                >
                  Odtwórz Intro
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">6. Animowana Ikona Aplikacji</div>
                  <div className="text-xs text-zinc-400 font-sans">
                    Przetestuj 5 stanów animacji (Spoczynek, Pulsowanie, Obrót, Blask, Gotowa)
                  </div>
                </div>
                <button
                  onClick={() => setIconShowcaseOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono"
                >
                  Otwórz Podgląd
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-900/60 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Źródła aplikacji + GitHub Actions</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-600">
                      BUILD WEB
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 font-sans">
                    Pobierz kod aplikacji. GitHub Actions buduje webową dystrybucję; nie tworzy pliku APK.
                  </div>
                </div>
                <button
                  onClick={() => setDownloadApkOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow"
                >
                  Pobierz ZIP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="space-y-6 max-w-2xl mx-auto p-6 rounded-2xl bg-zinc-950/80 border border-red-950 shadow-2xl">
            <div className="text-center space-y-3">
              <UmbrellaLogo size={64} animationState="ready" className="mx-auto" />
              <h2 className="text-3xl font-black tracking-widest text-white">
                FREE API RADAR
              </h2>
              <p className="text-xs font-mono font-bold tracking-[0.3em] text-red-500 uppercase">
                UMBRELLA CORPORATION • OUR BUSINESS IS LIFE ITSELF
              </p>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-zinc-300 font-sans leading-relaxed border-t border-zinc-900 pt-4">
              <p>
                Aplikacja <strong>Free API Radar</strong> powstała w oparciu o specyfikację koncepcyjną korporacji Umbrella.
                Stanowi centralną bazę darmowych kluczy API, narzędzi sztucznej inteligencji, silników generowania wideo oraz bezpieczną drugą przestrzeń (18+).
              </p>

              <div className="p-3.5 rounded-xl bg-black/60 border border-red-950/60 font-mono text-xs space-y-1.5">
                <div className="text-red-400 font-bold">SPECYFIKACJA TECHNICZNA Z PLANSZY KONCEPCYJNEJ:</div>
                <div className="text-zinc-400">1. Ikony w rozmiarach: 512, 192, 72, 48, 36, 24 px</div>
                <div className="text-zinc-400">2. 4-etapowa animacja startowa z sub-bassem i lektorem</div>
                <div className="text-zinc-400">3. Pełny UI: Szukajka, Kategorie, Szczegóły, Rate Limit, Auth, Response Example</div>
                <div className="text-zinc-400">4. System powiadomień satelitarnych</div>
                <div className="text-zinc-400">5. Cybernetyczne tło Raccoon City Umbrella Tower</div>
                <div className="text-zinc-400">6. Animowana ikona (5 stanów: Spoczynek, Pulsowanie, Obrót 3D, Blask, Gotowa)</div>
                <div className="text-zinc-400">7. Kompletny zestaw grafik: logo.png (1024x1024), splash_bg.png, notification_icon.png</div>
                <div className="text-emerald-400 font-bold">Druga Przestrzeń: osobna strefa API dla dorosłych (18+)</div>
                <div className="text-amber-400 font-bold">Wyszukiwarka & silnik Image to Video (Google Veo 3.1 Fast Preview)</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar (Section 3) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab: any) => setActiveTab(tab)}
        favoritesCount={favorites.length}
        historyCount={history.length}
        isAdultSpace={isAdultSpace}
        onToggleAdultSpace={handleToggleAdultSpace}
      />

      {/* Modals & Overlays */}
      <SidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab: any) => setActiveTab(tab)}
        favoritesCount={favorites.length}
        historyCount={history.length}
        isAdultSpace={isAdultSpace}
        onToggleAdultSpace={handleToggleAdultSpace}
        onOpenVideoStudio={() => setVideoStudioOpen(true)}
        onOpenMusicStudio={() => setMusicStudioOpen(true)}
        onOpenSearchGrounding={() => setSearchGroundingOpen(true)}
        onOpenDownloadApk={() => setDownloadApkOpen(true)}
        onOpenIconShowcase={() => setIconShowcaseOpen(true)}
        onReplaySplash={() => setShowSplash(true)}
      />

      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
        onSelectApi={(apiId) => {
          const found = RADAR_APIS.find((a) => a.id === apiId);
          if (found) handleSelectApi(found);
        }}
      />

      <ApiDetailsModal
        api={selectedApi}
        isOpen={!!selectedApi}
        onClose={() => setSelectedApi(null)}
        isFavorite={selectedApi ? favorites.includes(selectedApi.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <AdultSpaceAgeGate
        isOpen={showAgeGate}
        onConfirm={handleConfirmAgeGate}
        onCancel={() => setShowAgeGate(false)}
      />

      <AnimatedIconShowcase
        isOpen={iconShowcaseOpen}
        onClose={() => setIconShowcaseOpen(false)}
      />

      <ImageToVideoStudio
        isOpen={videoStudioOpen}
        onClose={() => setVideoStudioOpen(false)}
      />

      <MusicStudio
        isOpen={musicStudioOpen}
        onClose={() => setMusicStudioOpen(false)}
      />

      <SearchGroundingStudio
        isOpen={searchGroundingOpen}
        onClose={() => setSearchGroundingOpen(false)}
      />

      <DownloadApkModal
        isOpen={downloadApkOpen}
        onClose={() => setDownloadApkOpen(false)}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReplaySplash={() => setShowSplash(true)}
        onOpenIconShowcase={() => setIconShowcaseOpen(true)}
        onOpenDownloadApk={() => setDownloadApkOpen(true)}
        isAdultSpace={isAdultSpace}
        onToggleAdultSpace={handleToggleAdultSpace}
        onClearHistory={() => setHistory([])}
        onClearFavorites={() => setFavorites([])}
      />
    </div>
  );
}
