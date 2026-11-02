import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Link } from 'react-router-dom';
import {
  GraduationCap, CheckCircle2, FileText, Sparkles, Layers, BookOpen,
  ExternalLink, Lightbulb, HelpCircle, Award, PlusCircle, Edit3, Trash2,
  ShieldCheck, RefreshCw, AlertCircle
} from 'lucide-react';
import TeacherGuideEditorModal from './TeacherGuideEditorModal.jsx';

export default function TeachersView({ currentUser, authToken }) {
  const { tab = 'cam-nang' } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const isAdmin = currentUser?.role === 'admin';

  const teacherTabs = [
    { to: '/giao-vien/cam-nang', id: 'cam-nang', category: 'cam_nang', label: 'Cẩm Nang Sư Phạm', icon: BookOpen },
    { to: '/giao-vien/ke-hoach-5512', id: 'ke-hoach-5512', category: 'ke_hoach_5512', label: 'Kế Hoạch Bài Dạy 5512', icon: FileText },
    { to: '/giao-vien/ngan-hang-cau-hoi', id: 'ngan-hang-cau-hoi', category: 'ngan_hang_cau_hoi', label: 'Ngân Hàng Câu Hỏi & Đề Kiểm Tra', icon: HelpCircle }
  ];

  const currentTabObj = teacherTabs.find((t) => t.id === tab) || teacherTabs[0];
  const currentCategory = currentTabObj.category;

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/teacher-materials?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải tài liệu sư phạm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveMaterial = async (payload, id) => {
    const url = id ? `/api/teacher-materials/${id}` : '/api/teacher-materials';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu tài liệu');
    }

    await fetchMaterials();
  };

  const handleDeleteMaterial = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mục "${title}" khỏi hệ thống?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/teacher-materials/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi xóa tài liệu');
      }

      await fetchMaterials();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    }
  };

  // Filter materials for current tab
  const tabMaterials = materials.filter((m) => m.category === currentCategory);

  // Helper colors for Cam Nang cards
  const getPillarColorClass = (idx) => {
    const colors = [
      { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
      { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
      { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
      { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' }
    ];
    return colors[idx % colors.length];
  };

  // Helper colors for question cards
  const getQuestionStyle = (idx) => {
    const styles = [
      { bg: 'bg-blue-50/70', border: 'border-blue-200/70', text: 'text-blue-700' },
      { bg: 'bg-emerald-50/70', border: 'border-emerald-200/70', text: 'text-emerald-700' },
      { bg: 'bg-amber-50/70', border: 'border-amber-200/70', text: 'text-amber-700' }
    ];
    return styles[idx % styles.length];
  };

  // Parse extra_data safely
  const parseExtra = (extra) => {
    if (!extra) return {};
    if (typeof extra === 'object') return extra;
    try {
      return JSON.parse(extra);
    } catch {
      return {};
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy to-navy-light text-white p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold/20 text-gold-light border border-gold/30 mb-3">
          <GraduationCap className="w-4 h-4" /> Không Gian Sư Phạm Lịch Sử 10
        </div>
        <h2 className="text-3xl font-black tracking-tight">
          Cẩm Nang Khai Thác Tư Liệu Cho Giáo Viên
        </h2>
        <p className="mt-2 text-slate-200 text-sm leading-relaxed max-w-3xl">
          Định hướng tổ chức dạy học phát triển năng lực môn Lịch sử theo Chương trình GDPT 2018. Khai thác hiệu quả các nguồn sử liệu hình ảnh, bia ký và mô hình 3D trong bài dạy.
        </p>

        {/* Sub-Tab Navigation with Real Slugs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/15">
          {teacherTabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <NavLink
                key={t.to}
                to={t.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-gold text-slate-950 shadow-md font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Admin Quick Action Bar */}
      {isAdmin && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40">
          <div className="flex items-center gap-2 text-xs text-amber-900 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Chế độ Quản trị viên: Bạn có thể trực tiếp sửa, xóa hoặc bổ sung tài liệu sư phạm cho tab này.</span>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Thêm mục mới</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && tabMaterials.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-gold" />
          <span>Đang nạp dữ liệu sư phạm...</span>
        </div>
      )}

      {/* ================= TAB 1: CẨM NANG SƯ PHẠM ================= */}
      {tab === 'cam-nang' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tabMaterials.map((item, idx) => {
              const color = getPillarColorClass(idx);
              return (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 relative group transition hover:shadow-md"
                >
                  {/* Admin Edit/Delete Controls */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Chỉnh sửa nội dung này"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-gold/30 text-slate-700 hover:text-slate-950 transition border border-slate-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(item.id, item.title)}
                        title="Xóa mục này"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition border border-slate-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center font-black`}>
                    {item.badge || idx + 1}
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800 pr-12">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-[11px] font-bold text-gold-dark">
                      {item.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: KẾ HOẠCH BÀI DẠY 5512 ================= */}
      {tab === 'ke-hoach-5512' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                Khung kế hoạch bài dạy mẫu (Phụ lục IV Công văn 5512/BGDĐT)
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Chuyên đề: Văn minh Đông Nam Á thời cổ – trung đại
              </h3>
            </div>
            <Link
              to="/kho-tu-lieu?topic=4"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-navy text-white hover:bg-navy-light transition shadow text-center inline-block"
            >
              Mở kho tư liệu Chủ đề 4
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            {tabMaterials.map((act) => {
              const extra = parseExtra(act.extra_data);
              return (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 relative group transition hover:border-slate-300 hover:bg-slate-50/80"
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(act)}
                        title="Chỉnh sửa hoạt động này"
                        className="p-1.5 rounded-lg bg-white hover:bg-gold/30 text-slate-700 hover:text-slate-950 transition border border-slate-200 shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(act.id, act.title)}
                        title="Xóa hoạt động này"
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition border border-slate-200 shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <h4 className="font-bold text-sm text-navy mb-1.5 flex items-center gap-2 pr-14">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{act.title}</span>
                  </h4>

                  {extra.technique && (
                    <div className="mb-2 text-slate-700 font-bold bg-white p-2.5 rounded-xl border border-slate-200/80">
                      {extra.technique}
                    </div>
                  )}

                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {act.content}
                  </p>

                  {extra.topic_url && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60">
                      <Link
                        to={extra.topic_url}
                        className="inline-flex items-center gap-1 font-bold text-navy hover:text-gold-dark transition text-[11px]"
                      >
                        <span>Mở tư liệu tham khảo liên kết</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM ================= */}
      {tab === 'ngan-hang-cau-hoi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Ngân Hàng Câu Hỏi Trắc Nghiệm Đánh Giá Theo Mức Độ
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Phân theo 4 cấp độ nhận thức: Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {tabMaterials.map((q, idx) => {
              const qStyle = getQuestionStyle(idx);
              const extra = parseExtra(q.extra_data);
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl ${qStyle.bg} border ${qStyle.border} space-y-2 relative group transition`}
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(q)}
                        title="Chỉnh sửa câu hỏi này"
                        className="p-1.5 rounded-lg bg-white hover:bg-gold/30 text-slate-700 hover:text-slate-950 transition border border-slate-200 shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(q.id, q.title)}
                        title="Xóa câu hỏi này"
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition border border-slate-200 shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className={`font-bold ${qStyle.text} uppercase tracking-wider text-[10px]`}>
                    {q.badge || q.subtitle || `Câu hỏi ${idx + 1}`}
                  </span>
                  <p className="font-bold text-slate-800 pr-14">
                    {q.title}
                  </p>
                  <div className="text-slate-600 pl-3 leading-relaxed whitespace-pre-line">
                    {q.content}
                  </div>
                  {extra.answer && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 p-2 rounded-xl border border-emerald-200">
                      ✓ Đáp án: {extra.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Editor Modal for Admin */}
      <TeacherGuideEditorModal
        isOpen={isModalOpen}
        material={editingItem}
        defaultCategory={currentCategory}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMaterial}
      />
    </div>
  );
}
