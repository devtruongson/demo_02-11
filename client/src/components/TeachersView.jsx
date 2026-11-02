import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Link } from 'react-router-dom';
import {
  GraduationCap, CheckCircle2, FileText, Sparkles, Layers, BookOpen,
  ExternalLink, Lightbulb, HelpCircle, Award, PlusCircle, Edit3, Trash2,
  ShieldCheck, RefreshCw, AlertCircle, Clock, Calendar, Users, Eye
} from 'lucide-react';
import TeacherGuideEditorModal from './TeacherGuideEditorModal.jsx';
import ExamAssignmentModal from './ExamAssignmentModal.jsx';
import ExamSubmissionsViewerModal from './ExamSubmissionsViewerModal.jsx';
import ExamTakingModal from './ExamTakingModal.jsx';

export default function TeachersView({ currentUser, authToken }) {
  const { tab = 'cam-nang' } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Exam Assignments State
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewingSubmissionsAssignment, setViewingSubmissionsAssignment] = useState(null);
  const [reviewingStudentExam, setReviewingStudentExam] = useState(null);

  const isAdmin = currentUser?.role === 'admin';
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const teacherTabs = [
    { to: '/giao-vien/cam-nang', id: 'cam-nang', category: 'cam_nang', label: 'Cẩm Nang Sư Phạm', icon: BookOpen },
    { to: '/giao-vien/ke-hoach-5512', id: 'ke-hoach-5512', category: 'ke_hoach_5512', label: 'Kế Hoạch Bài Dạy 5512', icon: FileText },
    { to: '/giao-vien/ngan-hang-cau-hoi', id: 'ngan-hang-cau-hoi', category: 'ngan_hang_cau_hoi', label: 'Ngân Hàng Câu Hỏi & Đề Kiểm Tra', icon: HelpCircle },
    { to: '/giao-vien/giao-bai-tap', id: 'giao-bai-tap', category: 'giao_bai_tap', label: 'Giao Bài Tập & Đề Thi', icon: Award }
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

  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const res = await fetch(`/api/exam-assignments?_t=${Date.now()}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài tập:', err);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchAssignments();
  }, [authToken]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleOpenNewAssignment = () => {
    setEditingAssignment(null);
    setIsAssignmentModalOpen(true);
  };

  const handleOpenEditAssignment = (item) => {
    setEditingAssignment(item);
    setIsAssignmentModalOpen(true);
  };

  const handleSaveAssignment = async (payload, id) => {
    const url = id ? `/api/exam-assignments/${id}` : '/api/exam-assignments';
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
      throw new Error(err.error || 'Lỗi khi lưu bài tập');
    }

    await fetchAssignments();
  };

  const handleDeleteAssignment = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài kiểm tra "${title}"? Toàn bộ kết quả bài làm của học sinh cho bài này cũng sẽ bị xóa.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/exam-assignments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi xóa bài tập');
      }

      await fetchAssignments();
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    }
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#182338] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 text-slate-300 border border-white/10 mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
          <span>Không Gian Sư Phạm Lịch Sử 10</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Cẩm Nang Khai Thác Tư Liệu Cho Giáo Viên
        </h2>
        <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl font-normal">
          Định hướng tổ chức dạy học phát triển năng lực môn Lịch sử theo Chương trình GDPT 2018. Khai thác hiệu quả các nguồn sử liệu hình ảnh, bia ký và mô hình 3D trong bài dạy.
        </p>

        {/* Sub-Tab Navigation with Real Slugs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/10">
          {teacherTabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <NavLink
                key={t.to}
                to={t.to}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Action Bar for Tab */}
      {tab === 'giao-bai-tap' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isTeacherOrAdmin
                ? 'Khu vực quản lý Đề thi & Giao bài: Tạo bài trắc nghiệm từ ngân hàng câu hỏi, chọn học sinh và theo dõi bảng điểm.'
                : 'Danh sách bài kiểm tra & đề thi môn Lịch sử 10. Đăng nhập học sinh để làm bài qua mục Profile.'}
            </span>
          </div>

          {isTeacherOrAdmin && (
            <button
              onClick={handleOpenNewAssignment}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs active:scale-95 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Tạo Đề Thi & Giao Bài</span>
            </button>
          )}
        </div>
      ) : (
        isAdmin && (
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
              <span>Chế độ Quản trị viên: Bạn có thể trực tiếp sửa, xóa hoặc bổ sung tài liệu sư phạm cho tab này.</span>
            </div>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs active:scale-95 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm mục mới</span>
            </button>
          </div>
        )
      )}

      {/* Loading state */}
      {loading && tabMaterials.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
          <span>Đang nạp dữ liệu sư phạm...</span>
        </div>
      )}

      {/* ================= TAB 1: CẨM NANG SƯ PHẠM ================= */}
      {tab === 'cam-nang' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {tabMaterials.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group transition hover:border-slate-300 hover:shadow-sm"
              >
                {/* Admin Edit/Delete Controls */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Chỉnh sửa nội dung này"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition border border-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(item.id, item.title)}
                      title="Xóa mục này"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition border border-slate-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                  {item.badge || idx + 1}
                </div>
                <h3 className="font-bold text-base text-slate-900 pr-12 leading-snug">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs font-medium text-slate-500">
                    {item.subtitle}
                  </p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: KẾ HOẠCH BÀI DẠY 5512 ================= */}
      {tab === 'ke-hoach-5512' && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Khung kế hoạch bài dạy mẫu (Phụ lục IV Công văn 5512/BGDĐT)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Chuyên đề: Văn minh Đông Nam Á thời cổ – trung đại
              </h3>
            </div>
            <Link
              to="/kho-tu-lieu?topic=4"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs text-center inline-block shrink-0"
            >
              Mở kho tư liệu Chủ đề 4
            </Link>
          </div>

          <div className="space-y-3.5 text-xs">
            {tabMaterials.map((act) => {
              const extra = parseExtra(act.extra_data);
              return (
                <div
                  key={act.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative group transition hover:border-slate-300"
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(act)}
                        title="Chỉnh sửa hoạt động này"
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition border border-slate-200 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(act.id, act.title)}
                        title="Xóa hoạt động này"
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition border border-slate-200 shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-2 pr-14">
                    <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>{act.title}</span>
                  </h4>

                  {extra.technique && (
                    <div className="mb-2 text-slate-700 font-medium bg-white p-2.5 rounded-lg border border-slate-200">
                      {extra.technique}
                    </div>
                  )}

                  <p className="text-slate-600 leading-relaxed whitespace-pre-line font-normal">
                    {act.content}
                  </p>

                  {extra.topic_url && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60">
                      <Link
                        to={extra.topic_url}
                        className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-slate-700 transition text-[11px]"
                      >
                        <span>Mở tư liệu tham khảo liên kết</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
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
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Ngân Hàng Câu Hỏi Trắc Nghiệm Đánh Giá Theo Mức Độ
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Phân theo 4 cấp độ nhận thức: Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao.
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            {tabMaterials.map((q, idx) => {
              const extra = parseExtra(q.extra_data);
              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 relative group transition hover:border-slate-300"
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(q)}
                        title="Chỉnh sửa câu hỏi này"
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition border border-slate-200 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(q.id, q.title)}
                        title="Xóa câu hỏi này"
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition border border-slate-200 shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                      {q.badge || q.subtitle || `Câu hỏi ${idx + 1}`}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 pr-14 leading-snug">
                    {q.title}
                  </p>
                  <div className="text-slate-600 pl-2.5 border-l-2 border-slate-200 leading-relaxed whitespace-pre-line font-normal">
                    {q.content}
                  </div>
                  {extra.answer && (
                    <div className="mt-2 text-xs font-medium text-slate-800 bg-slate-100/90 p-2.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      <span className="text-emerald-700 font-bold">✓ Đáp án:</span>
                      <span>{extra.answer}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: GIAO BÀI TẬP & ĐỀ THI ================= */}
      {tab === 'giao-bai-tap' && (
        <div className="space-y-6">
          {loadingAssignments && assignments.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
              <span>Đang tải danh sách bài tập & đề thi...</span>
            </div>
          ) : assignments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Chưa có bài kiểm tra hoặc bài tập nào</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Giáo viên và Admin có thể tạo bài kiểm tra từ ngân hàng câu hỏi trắc nghiệm đã có và giao cho học sinh.
              </p>
              {isTeacherOrAdmin && (
                <button
                  onClick={handleOpenNewAssignment}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Tạo bài thi đầu tiên</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {assignments.map((item) => {
                const questionCount = Array.isArray(item.question_ids) ? item.question_ids.length : 0;
                const studentIds = item.assigned_student_ids || ['all'];
                const isAllStudents = Array.isArray(studentIds) && studentIds.includes('all');
                const submissionCount = item.submission_count || 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between relative group transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div>
                      {/* Admin/Teacher Edit & Delete */}
                      {isTeacherOrAdmin && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleOpenEditAssignment(item)}
                            title="Chỉnh sửa bài thi & giao học sinh"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition border border-slate-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(item.id, item.title)}
                            title="Xóa bài thi này"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition border border-slate-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold">
                          Đề kiểm tra
                        </span>
                        {item.due_date && new Date(item.due_date) < new Date() && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                            Đã hết hạn
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-slate-900 pr-14 leading-snug">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Metadata Chips */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Thời lượng: <strong>{item.duration_minutes || 15} phút</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Số câu hỏi: <strong>{questionCount} câu</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            Hạn nộp:{' '}
                            <strong>
                              {item.due_date
                                ? new Date(item.due_date).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })
                                : 'Không giới hạn thời hạn'}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            Đối tượng giao:{' '}
                            <strong className="text-slate-800">
                              {isAllStudents ? 'Toàn bộ học sinh' : `${studentIds.length} học sinh cụ thể`}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-slate-700 font-medium">
                          <strong>{submissionCount}</strong> học sinh đã nộp bài
                        </span>
                      </div>

                      <button
                        onClick={() => setViewingSubmissionsAssignment(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-300" />
                        <span>Xem bảng điểm</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

      {/* Exam Assignment Modal (Create & Edit) */}
      <ExamAssignmentModal
        isOpen={isAssignmentModalOpen}
        assignment={editingAssignment}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSave={handleSaveAssignment}
        authToken={authToken}
      />

      {/* Submissions Viewer Modal (Scores & Details) */}
      <ExamSubmissionsViewerModal
        isOpen={Boolean(viewingSubmissionsAssignment)}
        assignment={viewingSubmissionsAssignment}
        onClose={() => setViewingSubmissionsAssignment(null)}
        authToken={authToken}
        onViewStudentDetail={(subOrAssignId, maybeStudentId) => {
          let assignmentId = viewingSubmissionsAssignment?.id;
          let studentId = null;

          if (typeof subOrAssignId === 'number' && maybeStudentId !== undefined) {
            assignmentId = subOrAssignId;
            studentId = maybeStudentId;
          } else if (subOrAssignId && typeof subOrAssignId === 'object') {
            studentId = subOrAssignId.student_id;
            assignmentId = subOrAssignId.assignment_id || viewingSubmissionsAssignment?.id;
          } else {
            studentId = subOrAssignId;
          }

          setReviewingStudentExam({
            assignmentId,
            studentId
          });
        }}
      />

      {/* Review Student Exam Modal */}
      <ExamTakingModal
        isOpen={Boolean(reviewingStudentExam)}
        assignmentId={reviewingStudentExam?.assignmentId}
        mode="review"
        studentId={reviewingStudentExam?.studentId}
        onClose={() => setReviewingStudentExam(null)}
        authToken={authToken}
      />
    </div>
  );
}
