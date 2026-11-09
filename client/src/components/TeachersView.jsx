import React, { useState, useEffect } from 'react';
import { useParams, NavLink, Link, Navigate } from 'react-router-dom';
import {
  GraduationCap, CheckCircle2, FileText, Sparkles, Layers, BookOpen,
  ExternalLink, Lightbulb, HelpCircle, Award, PlusCircle, Edit3, Trash2,
  ShieldCheck, RefreshCw, AlertCircle, Clock, Calendar, Users, Eye, UserPlus, Search, X, Flame
} from 'lucide-react';
import TeacherGuideEditorModal from './TeacherGuideEditorModal.jsx';
import ExamAssignmentModal from './ExamAssignmentModal.jsx';
import ExamSubmissionsViewerModal from './ExamSubmissionsViewerModal.jsx';
import ExamTakingModal from './ExamTakingModal.jsx';

export default function TeachersView({ currentUser, authToken }) {
  const { tab = 'ke-hoach-5512' } = useParams();

  // Tạm ẩn phân hệ "Cẩm nang sư phạm" theo yêu cầu -> tự động chuyển hướng sang tab Kế hoạch bài dạy 5512
  if (tab === 'cam-nang') {
    return <Navigate to="/giao-vien/ke-hoach-5512" replace />;
  }

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

  // Class Management State (Feedback requirement)
  const [classesList, setClassesList] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [loadingClassStudents, setLoadingClassStudents] = useState(false);
  const [studentsPool, setStudentsPool] = useState([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  const isAdmin = currentUser?.role === 'admin';
  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const teacherTabs = [
    // { to: '/giao-vien/cam-nang', id: 'cam-nang', category: 'cam_nang', label: 'Cẩm Nang Sư Phạm', icon: BookOpen }, // Tạm ẩn theo yêu cầu
    { to: '/giao-vien/ke-hoach-5512', id: 'ke-hoach-5512', category: 'ke_hoach_5512', label: 'Kế Hoạch Bài Dạy 5512', icon: FileText },
    { to: '/giao-vien/ngan-hang-cau-hoi', id: 'ngan-hang-cau-hoi', category: 'ngan_hang_cau_hoi', label: 'Ngân Hàng Câu Hỏi & Đề Kiểm Tra', icon: HelpCircle },
    { to: '/giao-vien/giao-bai-tap', id: 'giao-bai-tap', category: 'giao_bai_tap', label: 'Giao Bài Tập & Đề Thi', icon: Award },
    { to: '/giao-vien/lop-hoc', id: 'lop-hoc', category: 'lop_hoc', label: 'Lớp Học Của Tôi & Thêm Học Sinh', icon: Users }
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
    if (authToken) {
      fetchClasses();
      fetchStudentsPool();
    }
  }, [authToken]);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const res = await fetch(`/api/teacher/classes?_t=${Date.now()}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setClassesList(data);
        if (data.length > 0 && !selectedClass) {
          setSelectedClass(data[0]);
          fetchClassStudents(data[0].id);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách lớp học:', err);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchClassStudents = async (classId) => {
    try {
      setLoadingClassStudents(true);
      const res = await fetch(`/api/teacher/classes/${classId}/students?_t=${Date.now()}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setClassStudents(data);
      }
    } catch (err) {
      console.error('Lỗi nạp học sinh của lớp:', err);
    } finally {
      setLoadingClassStudents(false);
    }
  };

  const fetchStudentsPool = async () => {
    try {
      const res = await fetch(`/api/teacher/students-pool?_t=${Date.now()}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setStudentsPool(data);
      }
    } catch (err) {
      console.error('Lỗi nạp danh sách học sinh:', err);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      const res = await fetch('/api/teacher/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: newClassName.trim(),
          description: newClassDesc.trim(),
          grade: 'Lớp 10'
        })
      });
      if (!res.ok) throw new Error('Lỗi tạo lớp học');
      const data = await res.json();
      setClassesList((prev) => [data.classItem, ...prev]);
      setSelectedClass(data.classItem);
      setClassStudents([]);
      setIsNewClassModalOpen(false);
      setNewClassName('');
      setNewClassDesc('');
      alert('Tạo lớp học mới thành công!');
    } catch (err) {
      alert('Lỗi tạo lớp: ' + err.message);
    }
  };

  const handleAddStudentToClass = async (studentId) => {
    if (!selectedClass) return;
    try {
      const res = await fetch(`/api/teacher/classes/${selectedClass.id}/add-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ student_id: studentId })
      });
      if (!res.ok) throw new Error('Không thể thêm học sinh');
      await fetchClassStudents(selectedClass.id);
      await fetchClasses();
      alert('Đã thêm học sinh vào lớp học thành công!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveStudentFromClass = async (studentId, studentName) => {
    if (!selectedClass) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${studentName}" khỏi lớp ${selectedClass.name}?`)) return;
    try {
      const res = await fetch(`/api/teacher/classes/${selectedClass.id}/students/${studentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error('Lỗi khi xóa học sinh khỏi lớp');
      setClassStudents((prev) => prev.filter((s) => s.id !== studentId));
      await fetchClasses();
    } catch (err) {
      alert(err.message);
    }
  };

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
      <div className="bg-gradient-to-r from-[#70070B] via-[#850B10] to-[#9E0D14] text-white p-6 sm:p-8 rounded-3xl border border-amber-300/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-[#FDE2A7] border border-amber-300/40 mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-[#FDE2A7]" />
          <span>Không Gian Sư Phạm Lịch Sử 10</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif-royal">
          Không Gian Lớp Học & Giao Bài Dành Cho Giáo Viên
        </h2>
        <p className="mt-2 text-[#FFF7E8]/90 text-xs sm:text-sm leading-relaxed max-w-3xl font-normal">
          Định hướng tổ chức dạy học phát triển năng lực môn Lịch sử theo Chương trình GDPT 2018. Khai thác hiệu quả các nguồn sử liệu hình ảnh, bia ký và mô hình 3D trong bài dạy.
        </p>

        {/* Sub-Tab Navigation with Real Slugs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/15">
          {teacherTabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <NavLink
                key={t.to}
                to={t.to}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#FFFDF5] text-[#850B10] shadow-md font-bold'
                    : 'bg-black/25 hover:bg-black/40 text-white/90 border border-white/15'
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF5] border border-[#EBDBC5] gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#2D1B08] font-medium">
            <Award className="w-4 h-4 text-[#850B10] shrink-0" />
            <span>
              {isTeacherOrAdmin
                ? 'Khu vực quản lý Đề thi & Giao bài: Tạo bài trắc nghiệm từ ngân hàng câu hỏi, chọn học sinh và theo dõi bảng điểm.'
                : 'Danh sách bài kiểm tra & đề thi môn Lịch sử 10. Đăng nhập học sinh để làm bài qua mục Profile.'}
            </span>
          </div>

          {isTeacherOrAdmin && (
            <button
              onClick={handleOpenNewAssignment}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FDE2A7]" />
              <span>+ Tạo Đề Thi & Giao Bài</span>
            </button>
          )}
        </div>
      ) : (
        isAdmin && (
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF5] border border-[#EBDBC5] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-[#2D1B08] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#850B10] shrink-0" />
              <span>Chế độ Quản trị viên: Bạn có thể trực tiếp sửa, xóa hoặc bổ sung tài liệu sư phạm cho tab này.</span>
            </div>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-md active:scale-95 shrink-0 cursor-pointer"
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
                className="bg-[#FFFDF5] p-5 sm:p-6 rounded-3xl border border-[#EBDBC5] shadow-xs space-y-3 relative group transition hover:border-amber-300 hover:shadow-md"
              >
                {/* Admin Edit/Delete Controls */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Chỉnh sửa nội dung này"
                      className="p-1.5 rounded-lg bg-[#FAF5EB] hover:bg-amber-100 text-[#850B10] transition border border-[#EBDBC5]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(item.id, item.title)}
                      title="Xóa mục này"
                      className="p-1.5 rounded-lg bg-[#FAF5EB] hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition border border-[#EBDBC5]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="w-9 h-9 rounded-xl bg-amber-100/90 border border-amber-300/60 text-[#850B10] flex items-center justify-center font-bold text-sm">
                  {item.badge || idx + 1}
                </div>
                <h3 className="font-bold text-base text-[#1A120B] group-hover:text-[#850B10] transition-colors pr-12 leading-snug">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs font-semibold text-[#850B10]/80">
                    {item.subtitle}
                  </p>
                )}
                <p className="text-xs text-[#3A2A1A] leading-relaxed font-normal whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: KẾ HOẠCH BÀI DẠY 5512 ================= */}
      {tab === 'ke-hoach-5512' && (
        <div className="bg-[#FFFDF5] rounded-3xl p-5 sm:p-7 border border-[#EBDBC5] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBDBC5] gap-4">
            <div>
              <span className="text-xs font-bold text-[#850B10] uppercase tracking-wider">
                Khung kế hoạch bài dạy mẫu (Phụ lục IV Công văn 5512/BGDĐT)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#1A120B] font-serif-royal mt-1">
                Chuyên đề: Văn minh Đông Nam Á thời cổ – trung đại
              </h3>
            </div>
            <Link
              to="/kho-tu-lieu?topic=4"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#850B10] text-white hover:bg-[#68070B] transition shadow-xs text-center inline-block shrink-0"
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
                  className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#EBDBC5] relative group transition hover:border-amber-300"
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(act)}
                        title="Chỉnh sửa hoạt động này"
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition border border-[#EBDBC5] shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(act.id, act.title)}
                        title="Xóa hoạt động này"
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition border border-[#EBDBC5] shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <h4 className="font-bold text-sm text-[#1A120B] mb-1.5 flex items-center gap-2 pr-14">
                    <CheckCircle2 className="w-4 h-4 text-[#850B10] shrink-0" />
                    <span>{act.title}</span>
                  </h4>

                  {extra.technique && (
                    <div className="mb-2 text-[#2D1B08] font-medium bg-[#FFFDF5] p-2.5 rounded-xl border border-[#EBDBC5]">
                      {extra.technique}
                    </div>
                  )}

                  <p className="text-[#3A2A1A] leading-relaxed whitespace-pre-line font-normal">
                    {act.content}
                  </p>

                  {extra.topic_url && (
                    <div className="mt-2 pt-2 border-t border-[#EBDBC5]">
                      <Link
                        to={extra.topic_url}
                        className="inline-flex items-center gap-1 font-bold text-[#850B10] hover:underline transition text-[11px]"
                      >
                        <span>Mở tư liệu tham khảo liên kết</span>
                        <ExternalLink className="w-3 h-3 text-[#850B10]" />
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
        <div className="bg-[#FFFDF5] rounded-3xl p-5 sm:p-7 border border-[#EBDBC5] shadow-xs space-y-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#850B10] font-serif-royal">
              Ngân Hàng Câu Hỏi Trắc Nghiệm Đánh Giá Theo Mức Độ
            </h3>
            <p className="text-xs text-[#5C4A3A] mt-1">
              Phân theo 4 cấp độ nhận thức: Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao.
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            {tabMaterials.map((q, idx) => {
              const extra = parseExtra(q.extra_data);
              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EB] border border-[#EBDBC5] space-y-2 relative group transition hover:border-amber-300"
                >
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(q)}
                        title="Chỉnh sửa câu hỏi này"
                        className="p-1.5 rounded-lg bg-white hover:bg-amber-100 text-[#850B10] transition border border-[#EBDBC5] shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(q.id, q.title)}
                        title="Xóa câu hỏi này"
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition border border-[#EBDBC5] shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#850B10] bg-amber-100/80 border border-amber-300/50 px-2.5 py-0.5 rounded-md text-[11px]">
                      {q.badge || q.subtitle || `Câu hỏi ${idx + 1}`}
                    </span>
                  </div>
                  <p className="font-bold text-[#1A120B] pr-14 leading-snug">
                    {q.title}
                  </p>
                  <div className="text-[#3A2A1A] pl-2.5 border-l-2 border-[#850B10]/40 leading-relaxed whitespace-pre-line font-normal">
                    {q.content}
                  </div>
                  {extra.answer && (
                    <div className="mt-2 text-xs font-semibold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
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
            <div className="p-12 text-center text-[#8C7A6B] text-xs font-medium flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#850B10]" />
              <span>Đang tải danh sách bài tập & đề thi...</span>
            </div>
          ) : assignments.length === 0 ? (
            <div className="bg-[#FFFDF5] rounded-3xl p-8 border border-[#EBDBC5] text-center space-y-3">
              <Award className="w-10 h-10 text-amber-600/50 mx-auto" />
              <h3 className="text-base font-bold text-[#1A120B]">Chưa có bài kiểm tra hoặc bài tập nào</h3>
              <p className="text-xs text-[#5C4A3A] max-w-md mx-auto">
                Giáo viên và Admin có thể tạo bài kiểm tra từ ngân hàng câu hỏi trắc nghiệm đã có và giao cho học sinh.
              </p>
              {isTeacherOrAdmin && (
                <button
                  onClick={handleOpenNewAssignment}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-md"
                >
                  <PlusCircle className="w-4 h-4 text-[#FDE2A7]" />
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
                    className="bg-[#FFFDF5] p-5 sm:p-6 rounded-3xl border border-[#EBDBC5] shadow-xs flex flex-col justify-between relative group transition hover:border-amber-300 hover:shadow-md"
                  >
                    <div>
                      {/* Admin/Teacher Edit & Delete */}
                      {isTeacherOrAdmin && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleOpenEditAssignment(item)}
                            title="Chỉnh sửa bài thi & giao học sinh"
                            className="p-1.5 rounded-lg bg-[#FAF5EB] hover:bg-amber-100 text-[#850B10] transition border border-[#EBDBC5]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(item.id, item.title)}
                            title="Xóa bài thi này"
                            className="p-1.5 rounded-lg bg-[#FAF5EB] hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition border border-[#EBDBC5]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-[#850B10] border border-amber-300/60 text-[11px] font-bold">
                          Đề kiểm tra
                        </span>
                        {item.due_date && new Date(item.due_date) < new Date() && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                            Đã hết hạn
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-[#1A120B] group-hover:text-[#850B10] transition-colors pr-14 leading-snug">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-[#5C4A3A] mt-1.5 leading-relaxed font-normal line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Metadata Chips */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#EBDBC5] text-xs text-[#5C4A3A]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#850B10] shrink-0" />
                          <span>Thời lượng: <strong className="text-[#1A120B]">{item.duration_minutes || 15} phút</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-[#850B10] shrink-0" />
                          <span>Số câu hỏi: <strong className="text-[#1A120B]">{questionCount} câu</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <Calendar className="w-3.5 h-3.5 text-[#850B10] shrink-0" />
                          <span>
                            Hạn nộp:{' '}
                            <strong className="text-[#1A120B]">
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
                          <Users className="w-3.5 h-3.5 text-[#850B10] shrink-0" />
                          <span>
                            Đối tượng giao:{' '}
                            <strong className="text-[#1A120B]">
                              {isAllStudents ? 'Toàn bộ học sinh' : `${studentIds.length} học sinh cụ thể`}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 pt-3 border-t border-[#EBDBC5] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-[#2D1B08] font-medium">
                          <strong>{submissionCount}</strong> học sinh đã nộp bài
                        </span>
                      </div>

                      <button
                        onClick={() => setViewingSubmissionsAssignment(item)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FDE2A7]" />
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

      {/* ================= TAB 5: MY CLASSES & ADD STUDENTS ================= */}
      {tab === 'lop-hoc' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDF5] p-5 rounded-3xl border border-[#EBDBC5] shadow-xs">
            <div>
              <h2 className="text-lg font-black text-[#1A120B] font-serif-royal tracking-tight">
                Quản Lý Lớp Học & Học Sinh Của Riêng Tôi
              </h2>
              <p className="text-xs text-[#5C4A3A] mt-0.5">
                Tạo lớp học, thêm học sinh vào lớp và theo dõi tiến độ hoàn thành bài kiểm tra, điểm trung bình.
              </p>
            </div>

            {isTeacherOrAdmin && (
              <button
                onClick={() => setIsNewClassModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-md active:scale-95 shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#FDE2A7]" />
                <span>Tạo Lớp Học Mới</span>
              </button>
            )}
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classesList.map((cls) => {
              const isCurrent = selectedClass?.id === cls.id;
              return (
                <div
                  key={cls.id}
                  onClick={() => {
                    setSelectedClass(cls);
                    fetchClassStudents(cls.id);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#850B10] text-white border-[#850B10] shadow-md ring-2 ring-[#850B10]/30'
                      : 'bg-[#FFFDF5] hover:bg-[#FAF5EB] text-[#2D1B08] border-[#EBDBC5]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isCurrent ? 'bg-amber-100 text-[#850B10]' : 'bg-[#FAF5EB] text-[#850B10] border border-[#EBDBC5]'
                      }`}>
                        Mã lớp: {cls.code}
                      </span>
                      <span className={`text-xs font-bold ${isCurrent ? 'text-amber-200' : 'text-[#8C7A6B]'}`}>
                        {cls.student_count || 0} học sinh
                      </span>
                    </div>

                    <h3 className={`font-black text-sm leading-tight ${isCurrent ? 'text-white' : 'text-[#1A120B]'}`}>
                      {cls.name}
                    </h3>

                    {cls.description && (
                      <p className={`text-xs mt-1 line-clamp-2 ${isCurrent ? 'text-white/80' : 'text-[#5C4A3A]'}`}>
                        {cls.description}
                      </p>
                    )}
                  </div>

                  <div className={`mt-3 pt-2 text-[11px] font-bold border-t flex items-center justify-between ${
                    isCurrent ? 'border-white/20 text-[#FDE2A7]' : 'border-[#EBDBC5] text-[#850B10]'
                  }`}>
                    <span>{isCurrent ? '✓ Đang xem danh sách' : 'Bấm để quản lý'}</span>
                    <span>{cls.grade || 'Lớp 10'} →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Class Students Management Panel */}
          {selectedClass && (
            <div className="bg-[#FFFDF5] rounded-3xl p-5 sm:p-6 border border-[#EBDBC5] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBDBC5]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-[#1A120B]">
                      Danh Sách Học Sinh: {selectedClass.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#850B10] text-white">
                      {classStudents.length} em
                    </span>
                  </div>
                  <p className="text-xs text-[#5C4A3A] mt-0.5">
                    Mã mời tham gia: <strong className="font-mono text-[#850B10]">{selectedClass.code}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-xs active:scale-95 shrink-0 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#FDE2A7]" />
                  <span>+ Thêm Học Sinh Vào Lớp</span>
                </button>
              </div>

              {/* Students List Table */}
              {loadingClassStudents ? (
                <div className="py-8 text-center text-xs text-[#8C7A6B]">Đang tải danh sách học sinh...</div>
              ) : classStudents.length === 0 ? (
                <div className="py-12 text-center bg-[#FAF5EB] rounded-2xl border border-dashed border-[#EBDBC5]">
                  <Users className="w-8 h-8 text-[#8C7A6B] mx-auto mb-2" />
                  <p className="text-xs text-[#5C4A3A] font-semibold">Lớp này chưa có học sinh nào.</p>
                  <button
                    onClick={() => setIsAddStudentModalOpen(true)}
                    className="mt-2 text-xs font-bold text-[#850B10] hover:underline cursor-pointer"
                  >
                    Bấm vào đây để thêm học sinh đầu tiên
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EBDBC5] text-[#8C7A6B] uppercase text-[10px] font-black">
                        <th className="py-2.5 px-3">Học sinh</th>
                        <th className="py-2.5 px-3">Tài khoản & Email</th>
                        <th className="py-2.5 px-3 text-center">Chuỗi Streak</th>
                        <th className="py-2.5 px-3 text-center">Bài đã nộp</th>
                        <th className="py-2.5 px-3 text-center">Điểm TB</th>
                        <th className="py-2.5 px-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBDBC5]/60">
                      {classStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-[#FAF5EB] transition">
                          <td className="py-3 px-3 font-bold text-[#1A120B]">
                            {st.full_name}
                          </td>
                          <td className="py-3 px-3 text-[#5C4A3A] font-mono text-[11px]">
                            @{st.username} • {st.email}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-black text-[11px] border border-amber-200">
                              <Flame className="w-3 h-3 fill-amber-600 text-amber-600" />
                              <span>{st.streak_count || 1}d</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-[#2D1B08]">
                            {st.exams_completed || 0} bài
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-extrabold text-[#850B10]">
                              {st.avg_score !== null ? `${st.avg_score} đ` : 'Chưa có'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleRemoveStudentFromClass(st.id, st.full_name)}
                              className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition cursor-pointer"
                              title="Xóa học sinh khỏi lớp"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD STUDENT TO CLASS */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF5] rounded-3xl w-full max-w-lg shadow-2xl border border-[#EBDBC5] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-gradient-to-r from-[#70070B] to-[#850B10] text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Thêm Học Sinh Vào Lớp: {selectedClass?.name}</h4>
                <p className="text-[11px] text-[#FDE2A7]">Chọn từ danh sách học sinh đã đăng ký hệ thống</p>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-[#EBDBC5]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Tìm học sinh theo tên, tài khoản hoặc email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#EBDBC5] text-xs focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-[#EBDBC5]/60 flex-1 space-y-2">
              {studentsPool
                .filter((st) => {
                  if (!studentSearch.trim()) return true;
                  const q = studentSearch.toLowerCase();
                  return (
                    st.full_name?.toLowerCase().includes(q) ||
                    st.username?.toLowerCase().includes(q) ||
                    st.email?.toLowerCase().includes(q)
                  );
                })
                .map((st) => {
                  const isAlreadyIn = classStudents.some((cs) => cs.id === st.id);
                  return (
                    <div key={st.id} className="pt-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-xs text-[#1A120B]">{st.full_name}</p>
                        <p className="text-[10px] text-[#5C4A3A] font-mono">@{st.username} • {st.email}</p>
                      </div>

                      {isAlreadyIn ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          ✓ Đã trong lớp
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddStudentToClass(st.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                        >
                          + Thêm
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW CLASS */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF5] rounded-3xl w-full max-w-md shadow-2xl border border-[#EBDBC5] overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-[#70070B] to-[#850B10] text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">Tạo Lớp Học Mới</h4>
              <button
                onClick={() => setIsNewClassModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1A120B] mb-1">
                  Tên lớp học *
                </label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Ví dụ: Lớp 10A2 - Lịch Sử Chuyên Sâu"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#EBDBC5] text-xs focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A120B] mb-1">
                  Mô tả / Ghi chú lớp học
                </label>
                <textarea
                  rows={3}
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  placeholder="Nhập thông tin mục tiêu, giáo viên chủ nhiệm..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5EB] border border-[#EBDBC5] text-xs focus:outline-none focus:ring-2 focus:ring-[#850B10]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EBDBC5]">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C4A3A] hover:bg-[#FAF5EB] transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#850B10] hover:bg-[#68070B] text-white text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Tạo Lớp Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
