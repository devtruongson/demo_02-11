import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Hero from './components/Hero.jsx';
import TopicCard from './components/TopicCard.jsx';
import ResourceCard from './components/ResourceCard.jsx';
import ResourceDetailView from './components/ResourceDetailView.jsx';
import ResourceEditorModal from './components/ResourceEditorModal.jsx';
import LoginModal from './components/LoginModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import BannerManagerModal from './components/BannerManagerModal.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Studio3DView from './components/Studio3DView.jsx';
import TeachersView from './components/TeachersView.jsx';
import StudentsView from './components/StudentsView.jsx';
import AboutView from './components/AboutView.jsx';
import ContactView from './components/ContactView.jsx';
import TopicEditorModal from './components/TopicEditorModal.jsx';
import Footer from './components/Footer.jsx';
import CoreFeaturesShowcase from './components/CoreFeaturesShowcase.jsx';
import AuthenticatedHomeSection from './components/AuthenticatedHomeSection.jsx';
import WhyChooseUsSection from './components/WhyChooseUsSection.jsx';
import CollaborativeStudySpace from './components/CollaborativeStudySpace.jsx';
import AuthPage from './components/AuthPage.jsx';
import { createResourceSlug } from './utils/slugify.js';
import { Filter, Layers, Box, Search, RotateCcw, ArrowRight, BookOpen, Sparkles, AlertCircle, LayoutDashboard, Globe, ShieldCheck, Users, X, PlusCircle, Edit3 } from 'lucide-react';

const API_BASE = '/api';

// Route Guard: When not logged in, users can ONLY view the home page
function ProtectedRoute({ currentUser, onOpenLogin, children }) {
  useEffect(() => {
    if (!currentUser) {
      onOpenLogin();
    }
  }, [currentUser, onOpenLogin]);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [topics, setTopics] = useState([]);
  const [resources, setResources] = useState([]);
  const [artifacts3d, setArtifacts3d] = useState([]);
  const [bannerSlides, setBannerSlides] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sukyso_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('sukyso_token') || '');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalRole, setLoginModalRole] = useState('student');
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  // Filters read from Search Params for /kho-tu-lieu
  const searchQuery = searchParams.get('q') || '';
  const selectedTopicId = searchParams.get('topic') || 'all';
  const selectedType = searchParams.get('type') || 'all';

  const [inputSearch, setInputSearch] = useState(searchQuery);

  // Sync inputSearch with searchParams
  useEffect(() => {
    setInputSearch(searchQuery);
  }, [searchQuery]);

  // Modals
  const [editorResource, setEditorResource] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0);

  // Topic Management State for Admin
  const [editingTopic, setEditingTopic] = useState(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  // Is this the full-width detail page or full-screen dashboard?
  const isHomePage = location.pathname === '/';
  const isDetailPage = location.pathname.startsWith('/tu-lieu/');
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Collapsible Sidebar state (Feedback requirement)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sukyso_sidebar_collapsed') === 'true';
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sukyso_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Handle Login Success
  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('sukyso_user', JSON.stringify(user));
    localStorage.setItem('sukyso_token', token);
    if (user.role === 'admin') {
      navigate('/dashboard');
    }
  };

  // Handle Profile Update Success
  const handleProfileUpdated = (updatedUser, newToken) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('sukyso_user', JSON.stringify(updatedUser));
    if (newToken) {
      setAuthToken(newToken);
      localStorage.setItem('sukyso_token', newToken);
    }
    setDashboardRefreshTrigger((prev) => prev + 1);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    localStorage.removeItem('sukyso_user');
    localStorage.removeItem('sukyso_token');
    navigate('/');
  };

  // Initial Fetch Data from Backend
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const ts = Date.now();
      const [topicsRes, resRes, artRes, statsRes, bannerRes] = await Promise.all([
        fetch(`${API_BASE}/topics?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/resources?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/3d-artifacts?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/stats?_t=${ts}`).then((r) => (r.ok ? r.json() : null)),
        fetch(`${API_BASE}/banner-slides?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
      ]);

      setTopics(topicsRes);
      setResources(resRes);
      setArtifacts3d(artRes);
      setStats(statsRes);
      setBannerSlides(bannerRes);
    } catch (err) {
      console.error('Lỗi nạp dữ liệu từ backend:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Resources whenever searchParams change
  const fetchFilteredResources = async () => {
    try {
      const params = new URLSearchParams();
      params.append('_t', Date.now());
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (selectedTopicId !== 'all') params.append('topic_id', selectedTopicId);
      if (selectedType !== 'all') params.append('type', selectedType);

      const res = await fetch(`${API_BASE}/resources?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error('Lỗi lọc dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchFilteredResources();
  }, [searchQuery, selectedTopicId, selectedType]);

  const updateFilters = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Clean empty or default values
    Object.keys(merged).forEach((k) => {
      if (!merged[k] || merged[k] === 'all' || (typeof merged[k] === 'string' && merged[k].trim() === '')) {
        delete merged[k];
      }
    });

    const params = new URLSearchParams(merged);
    const queryString = params.toString();
    navigate(`/kho-tu-lieu${queryString ? `?${queryString}` : ''}`);
  };

  const handleSearchSubmit = (queryOverride) => {
    const targetQuery = (queryOverride !== undefined ? queryOverride : inputSearch).trim();
    updateFilters({ q: targetQuery });
  };

  // Navigate to Detail page with clean SEO Slug
  const handleSelectResource = (resource) => {
    const slug = createResourceSlug(resource.id, resource.title);
    navigate(`/tu-lieu/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Analytics increment view count
    fetch(`${API_BASE}/resources/${resource.id}/view`, {
      method: 'POST',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      }
    }).then(r => r.json()).then(data => {
      if (data.resource) {
        setResources(prev => prev.map(item => item.id === resource.id ? { ...item, view_count: data.resource.view_count } : item));
      }
    }).catch(() => {});
  };

  // CRUD Operations (Protected with real Admin JWT)
  const handleSaveResource = async (formData, id) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      throw new Error('Chỉ Quản trị viên (Admin) mới có quyền lưu hoặc sửa đổi tư liệu.');
    }

    const url = id ? `${API_BASE}/resources/${id}` : `${API_BASE}/resources`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu tư liệu');
    }

    const savedData = await res.json();
    await Promise.all([fetchInitialData(), fetchFilteredResources()]);
    setDashboardRefreshTrigger((prev) => prev + 1);
    return savedData;
  };

  const handleDeleteResource = async (id) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      alert('Chỉ Quản trị viên (Admin) mới có quyền xóa tư liệu.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/resources/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        await Promise.all([fetchInitialData(), fetchFilteredResources()]);
        setDashboardRefreshTrigger((prev) => prev + 1);
        if (!location.pathname.startsWith('/dashboard')) {
          navigate('/kho-tu-lieu');
        }
      } else {
        const err = await res.json();
        alert('Lỗi xóa tư liệu: ' + (err.error || 'Thao tác không thành công'));
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ: ' + err.message);
    }
  };

  const handleOpenNewResource = () => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      return;
    }
    setEditorResource(null);
    setIsEditorOpen(true);
  };

  // Handlers for Topics CRUD from App.jsx
  const handleOpenEditTopic = (topic) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingTopic(topic);
    setIsTopicModalOpen(true);
  };

  const handleOpenNewTopic = () => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingTopic(null);
    setIsTopicModalOpen(true);
  };

  const handleSaveTopic = async (formData, id) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      throw new Error('Chỉ Quản trị viên (Admin) mới có quyền đổi tên hoặc thêm chủ đề.');
    }
    const url = id ? `${API_BASE}/topics/${id}` : `${API_BASE}/topics`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Lỗi lưu chủ đề');
    }
    await fetchInitialData();
    setDashboardRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteTopic = async (topic) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setIsLoginModalOpen(true);
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chủ đề "${topic.title}"?\nLưu ý: Không thể xóa nếu chủ đề đang có tư liệu đính kèm.`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/topics/${topic.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi xóa chủ đề');
      }
      await fetchInitialData();
      setDashboardRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert('Không thể xóa chủ đề: ' + err.message);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[#850b10] selection:text-[#fff8ee] font-sans ${isDashboard ? 'bg-slate-950 text-slate-100' : isHomePage ? 'bg-[#850B10]' : 'bg-[#FFF7E8] text-[#2D1B08]'}`}>
      {/* Top Navbar: Hidden on Admin Dashboard */}
      {!isDashboard && (
        <Navbar
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />
      )}

      {/* Main Container Wrapper */}
      <div className={
        isDashboard
          ? 'min-h-screen bg-slate-950 flex-1 flex flex-col px-3 sm:px-8 lg:px-12 py-3 sm:py-4'
          : isHomePage
          ? 'w-full flex-1 flex flex-col'
          : 'container mx-auto px-3 sm:px-6 lg:px-8 flex-1 flex my-2 sm:my-4 gap-4 sm:gap-6'
      }>
        {/* Left Sidebar: HIDDEN on home page, detail view, and on dashboard */}
        {!isHomePage && !isDetailPage && !isDashboard && (
          <Sidebar
            stats={stats}
            currentUser={currentUser}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
          />
        )}

        {/* Dynamic Main Workspace Content */}
        <main className={`flex-1 min-w-0 ${isHomePage || isDetailPage || isDashboard ? 'w-full' : ''} ${!isDashboard ? 'pb-12' : ''}`}>
          <Routes>
            {/* ================= ROUTE: HOME ================= */}
            <Route
              path="/"
              element={
                <div className="w-full animate-fade-in">
                  {/* Full-screen Edge-to-Edge Hero Banner */}
                  <Hero
                    searchQuery={inputSearch}
                    setSearchQuery={setInputSearch}
                    onSearchSubmit={handleSearchSubmit}
                    onOpenStudio3D={() => {
                      if (!currentUser) {
                        setIsLoginModalOpen(true);
                      } else {
                        navigate('/studio-3d');
                      }
                    }}
                    bannerSlides={bannerSlides}
                    onOpenBannerConfig={() => setIsBannerModalOpen(true)}
                    isAdmin={currentUser?.role === 'admin'}
                  />

                  {/* Main Homepage Sections - Nền /home-assets/bg.png - Căn Đều 2 Bên */}
                  <div
                    className="w-full bg-[#FAF5EB] bg-repeat py-10 sm:py-16 shadow-inner"
                    style={{ backgroundImage: "url('/home-assets/bg.png')" }}
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      {!currentUser ? (
                        /* Giao diện khi chưa đăng nhập: CÁC CHỨC NĂNG CHÍNH CỦA TRANG WEB trước, sau đó là TẠI SAO CHỌN SỬ HỌC SỐ */
                        <div className="space-y-16 sm:space-y-20">
                          {/* 1. Các chức năng chính của trang web (image copy 2.png) */}
                          <CoreFeaturesShowcase
                            topics={topics}
                            artifacts3d={artifacts3d}
                            currentUser={currentUser}
                            onOpenLogin={() => setIsLoginModalOpen(true)}
                          />

                          {/* 2. Tại sao chọn Sử Học Số (image copy.png) đặt bên dưới */}
                          <WhyChooseUsSection
                            onOpenLogin={() => setIsLoginModalOpen(true)}
                            currentUser={currentUser}
                          />
                        </div>
                      ) : (
                        /* Giao diện sau khi đăng nhập: Giáo viên (image copy 3.png) hoặc Học sinh (image copy 4.png) */
                        <AuthenticatedHomeSection
                          currentUser={currentUser}
                          topics={topics}
                          artifacts3d={artifacts3d}
                        />
                      )}
                    </div>
                  </div>
                </div>
              }
            />

            {/* ================= ROUTE: TOPICS ================= */}
            <Route
              path="/chu-de"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          {topics.length} Chủ Đề Học Tập Môn Lịch Sử 10
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Được xây dựng theo mạch nội dung chuẩn của Chương trình GDPT 2018
                        </p>
                      </div>

                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={handleOpenNewTopic}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95 shrink-0"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Thêm chủ đề mới</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {topics.map((t) => (
                        <TopicCard
                          key={t.id}
                          topic={t}
                          isAdmin={currentUser?.role === 'admin'}
                          onEdit={handleOpenEditTopic}
                          onDelete={handleDeleteTopic}
                          onSelect={(topic) => {
                            navigate(`/kho-tu-lieu?topic=${topic.id}`);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* ================= ROUTE: LIBRARY WITH URL SLUG PARAMS ================= */}
            <Route
              path="/kho-tu-lieu"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <div className="space-y-6 animate-fade-in">
                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Search Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateFilters({ q: inputSearch.trim() });
                        }}
                        className="relative flex-1 w-full flex items-center gap-2"
                      >
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                            placeholder="Tìm kiếm tư liệu, bảo vật, địa danh, di tích..."
                            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy"
                          />
                          {inputSearch && (
                            <button
                              type="button"
                              onClick={() => {
                                setInputSearch('');
                                updateFilters({ q: '' });
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                              title="Xóa từ khóa tìm kiếm"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition active:scale-95 shrink-0 cursor-pointer shadow-2xs"
                        >
                          Tìm kiếm
                        </button>
                      </form>

                      {/* Topic Filter */}
                      <select
                        value={selectedTopicId}
                        onChange={(e) => updateFilters({ topic: e.target.value })}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy"
                      >
                        <option value="all">Tất cả các chủ đề (7)</option>
                        {topics.map((t) => (
                          <option key={t.id} value={t.id}>
                            Chủ đề {t.id}: {t.title}
                          </option>
                        ))}
                      </select>

                      {/* Format Filter */}
                      <select
                        value={selectedType}
                        onChange={(e) => updateFilters({ type: e.target.value })}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy"
                      >
                        <option value="all">Tất cả định dạng</option>
                        <option value="3d">Mô hình 3D tương tác</option>
                        <option value="image">Hình ảnh khảo cổ</option>
                        <option value="video">Video bài học</option>
                        <option value="text">Văn bản / Bia ký</option>
                      </select>

                      {/* Reset Button */}
                      {(searchQuery || selectedTopicId !== 'all' || selectedType !== 'all') && (
                        <button
                          type="button"
                          onClick={() => {
                            setInputSearch('');
                            navigate('/kho-tu-lieu');
                          }}
                          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                          title="Đặt lại bộ lọc"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Active search pill indicator */}
                    {searchQuery && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs text-slate-500 font-medium">Từ khóa tìm kiếm:</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-2xs">
                          <span>"{searchQuery}"</span>
                          <button
                            type="button"
                            onClick={() => {
                              setInputSearch('');
                              updateFilters({ q: '' });
                            }}
                            className="p-0.5 hover:bg-white/20 rounded-full cursor-pointer transition"
                            title="Xóa tìm kiếm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      </div>
                    )}

                    {/* Results Count & Quick Format Pills */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>
                        Hiển thị <strong>{resources.length}</strong> tư liệu học tập
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateFilters({ type: selectedType === '3d' ? 'all' : '3d' })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            selectedType === '3d'
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Box className="w-3.5 h-3.5" /> 3D Models
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Resource Cards Grid */}
                  {resources.length === 0 ? (
                    <div className="p-10 sm:p-14 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                      <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <h4 className="font-bold text-sm text-slate-800">
                        {searchQuery
                          ? `Không tìm thấy tư liệu nào khớp với từ khóa "${searchQuery}"`
                          : 'Không tìm thấy tư liệu phù hợp với bộ lọc'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                        Hãy thử tìm kiếm với các từ khóa lịch sử phổ biến như: <em>Trống đồng, Đông Sơn, Angkor, Phù Nam, Bia Võ Cạnh, Champa</em> hoặc bấm nút bên dưới để xem toàn bộ kho học liệu.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setInputSearch('');
                          navigate('/kho-tu-lieu');
                        }}
                        className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
                      >
                        Xem tất cả tư liệu
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {resources.map((res) => (
                        <ResourceCard
                          key={res.id}
                          resource={res}
                          onSelect={handleSelectResource}
                          onOpen3D={(code) => navigate(`/studio-3d/co-vat/${code}`)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                </ProtectedRoute>
              }
            />

            {/* ================= ROUTE: FULL DETAIL VIEW WITH SLUG (NO SIDEBAR) ================= */}
            <Route
              path="/tu-lieu/:slug"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <ResourceDetailView
                    allResources={resources}
                    currentUser={currentUser}
                    authToken={authToken}
                    onEdit={(res) => {
                      setEditorResource(res);
                      setIsEditorOpen(true);
                    }}
                    onDelete={handleDeleteResource}
                  />
                </ProtectedRoute>
              }
            />

            {/* ================= ROUTE: STUDIO 3D ================= */}
            <Route
              path="/studio-3d"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <Studio3DView
                    artifacts3d={artifacts3d}
                    currentUser={currentUser}
                    authToken={authToken}
                    onArtifacts3DChange={fetchInitialData}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/studio-3d/:mode"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <Studio3DView
                    artifacts3d={artifacts3d}
                    currentUser={currentUser}
                    authToken={authToken}
                    onArtifacts3DChange={fetchInitialData}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/studio-3d/:mode/:artifactCode"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <Studio3DView
                    artifacts3d={artifacts3d}
                    currentUser={currentUser}
                    authToken={authToken}
                    onArtifacts3DChange={fetchInitialData}
                  />
                </ProtectedRoute>
              }
            />

            {/* ================= ROUTE: TEACHERS WITH REAL SLUGS ================= */}
            <Route
              path="/giao-vien"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <Navigate to="/giao-vien/cam-nang" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/giao-vien/:tab"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <TeachersView currentUser={currentUser} authToken={authToken} />
                </ProtectedRoute>
              }
            />

            {/* ================= ROUTE: STUDENTS WITH REAL SLUGS ================= */}
            <Route
              path="/hoc-sinh"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <Navigate to="/hoc-sinh/nhiem-vu" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hoc-sinh/:tab"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <StudentsView currentUser={currentUser} authToken={authToken} topics={topics} />
                </ProtectedRoute>
              }
            />

            {/* ================= ROUTE: ABOUT ================= */}
            <Route path="/gioi-thieu" element={<AboutView />} />

            {/* ================= ROUTE: CONTACT & FEEDBACK ================= */}
            <Route path="/lien-he" element={<ContactView />} />

            {/* ================= ROUTE: COLLABORATIVE STUDY SPACE ================= */}
            <Route
              path="/khong-gian-chung"
              element={
                <ProtectedRoute currentUser={currentUser} onOpenLogin={() => setIsLoginModalOpen(true)}>
                  <CollaborativeStudySpace
                    currentUser={currentUser}
                    authToken={authToken}
                    onOpenLogin={() => setIsLoginModalOpen(true)}
                    topics={topics}
                  />
                </ProtectedRoute>
              }
            />

            {/* ================= ROUTES: DEDICATED AUTH PAGES (HỌC SINH & GIÁO VIÊN) ================= */}
            <Route path="/dang-nhap" element={<Navigate to="/dang-nhap/hoc-sinh" replace />} />
            <Route
              path="/dang-nhap/:roleParam"
              element={
                <AuthPage
                  currentUser={currentUser}
                  onLoginSuccess={handleLoginSuccess}
                />
              }
            />

            {/* ================= ROUTE: ADMIN DASHBOARD ================= */}
            <Route
              path="/dashboard"
              element={
                currentUser?.role === 'admin' ? (
                  <AdminDashboard
                    currentUser={currentUser}
                    authToken={authToken}
                    onNewResource={handleOpenNewResource}
                    onEditResource={(res) => {
                      setEditorResource(res);
                      setIsEditorOpen(true);
                    }}
                    onDeleteResource={handleDeleteResource}
                    refreshTrigger={dashboardRefreshTrigger}
                    onLogout={handleLogout}
                    artifacts3d={artifacts3d}
                    onArtifacts3DChange={fetchInitialData}
                    onOpenBannerConfig={() => setIsBannerModalOpen(true)}
                    topics={topics}
                    onTopicsChange={fetchInitialData}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* ================= ALIAS ROUTES: SEARCH ================= */}
            <Route path="/tim-kiem" element={<Navigate to={`/kho-tu-lieu${location.search}`} replace />} />
            <Route path="/search" element={<Navigate to={`/kho-tu-lieu${location.search}`} replace />} />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Cultural Heritage Footer (Feedback requirement) */}
      {!isDashboard && <Footer />}

      {/* Resource Editor Modal (Create / Edit) */}
      {isEditorOpen && (
        <ResourceEditorModal
          resource={editorResource}
          topics={topics}
          onClose={() => {
            setIsEditorOpen(false);
            setEditorResource(null);
          }}
          onSave={handleSaveResource}
        />
      )}

      {/* Real Auth Login / Register Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={loginModalRole}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        authToken={authToken}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Banner Carousel Manager Modal */}
      {isBannerModalOpen && (
        <BannerManagerModal
          isOpen={isBannerModalOpen}
          onClose={() => setIsBannerModalOpen(false)}
          authToken={authToken}
          onSlidesUpdated={fetchInitialData}
        />
      )}

      {/* Topic Editor / Rename Modal for Public /chu-de View */}
      <TopicEditorModal
        isOpen={isTopicModalOpen}
        topic={editingTopic}
        onClose={() => {
          setIsTopicModalOpen(false);
          setEditingTopic(null);
        }}
        onSave={handleSaveTopic}
        authToken={authToken}
      />
    </div>
  );
}
