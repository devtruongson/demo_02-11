import {
    Activity,
    AlertCircle,
    ArrowUpDown,
    Award,
    BarChart3,
    BookOpen, Box,
    CheckCircle,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock, Compass,
    Edit3,
    ExternalLink,
    Eye,
    EyeOff,
    FileText,
    Film,
    FolderKanban,
    GraduationCap,
    GripVertical,
    HelpCircle,
    Image,
    KeyRound,
    Landmark,
    LayoutGrid,
    LayoutList,
    LogOut,
    Mail, Phone,
    PlusCircle,
    RefreshCw,
    Search,
    ShieldCheck,
    Sliders,
    SlidersHorizontal,
    Sparkles,
    Trash2,
    TrendingUp,
    UserCheck,
    Users,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatYouTubeEmbedUrl } from '../utils/slugify.js';
import Artifact3DEditorModal from './Artifact3DEditorModal.jsx';
import ExamAssignmentModal from './ExamAssignmentModal.jsx';
import ExamSubmissionsViewerModal from './ExamSubmissionsViewerModal.jsx';
import ExamTakingModal from './ExamTakingModal.jsx';
import QuizEditorModal from './QuizEditorModal.jsx';
import TeacherGuideEditorModal from './TeacherGuideEditorModal.jsx';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';
import TopicEditorModal from './TopicEditorModal.jsx';

export default function AdminDashboard({
  currentUser,
  authToken,
  onNewResource,
  onEditResource,
  onDeleteResource,
  onLogout,
  refreshTrigger,
  artifacts3d = [],
  onArtifacts3DChange = null,
  onOpenBannerConfig = null,
  topics: externalTopics = [],
  onTopicsChange = null
}) {
  const [analytics, setAnalytics] = useState(null);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [artifacts3dList, setArtifacts3dList] = useState(artifacts3d || []);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'resources' | 'artifacts3d' | 'users' | 'teachers' | 'quizzes' | 'topics' | 'contacts'
  const [resourceSearch, setResourceSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Dedicated Admin Internal Preview (Not using client detail page)
  const [previewResource, setPreviewResource] = useState(null);
  const [previewActiveTab, setPreviewActiveTab] = useState('gallery'); // 'gallery' | 'video' | '3d'
  const [previewPhotoIdx, setPreviewPhotoIdx] = useState(0);

  // 3D Artifact Management State
  const [editingArtifact3D, setEditingArtifact3D] = useState(null);
  const [isArtifactModalOpen, setIsArtifactModalOpen] = useState(false);
  const [artifactSearch, setArtifactSearch] = useState('');

  // Teacher Materials Management State
  const [teacherMaterials, setTeacherMaterials] = useState([]);
  const [teacherCategoryFilter, setTeacherCategoryFilter] = useState('all');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [editingTeacherMaterial, setEditingTeacherMaterial] = useState(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // Quizzes Management State
  const [quizzesList, setQuizzesList] = useState([]);
  const [quizLessonFilter, setQuizLessonFilter] = useState('all');
  const [quizSearch, setQuizSearch] = useState('');
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Topics Management State
  const [topicsList, setTopicsList] = useState(externalTopics || []);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');

  // Contacts / Feedback Submissions State
  const [contactsList, setContactsList] = useState([]);
  const [unreadContactsCount, setUnreadContactsCount] = useState(0);
  const [contactStatusFilter, setContactStatusFilter] = useState('all'); // 'all' | 'new' | 'replied'
  const [contactSearch, setContactSearch] = useState('');
  const [viewingContact, setViewingContact] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Exam Assignments Management State
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [viewingSubmissionsAssignment, setViewingSubmissionsAssignment] = useState(null);
  const [reviewingStudentExam, setReviewingStudentExam] = useState(null);

  // User Management State (Edit name, role, change password)
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    full_name: '',
    role: 'student',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userSaving, setUserSaving] = useState(false);
  const [userMsg, setUserMsg] = useState({ type: '', text: '' });

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setUserFormData({
      full_name: u.full_name || '',
      role: u.role || 'student',
      email: u.email || '',
      password: ''
    });
    setShowPassword(false);
    setUserMsg({ type: '', text: '' });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!userFormData.full_name.trim()) {
      setUserMsg({ type: 'error', text: 'Vui lòng nhập họ và tên người dùng.' });
      return;
    }
    if (userFormData.password && userFormData.password.length < 6) {
      setUserMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }

    setUserSaving(true);
    setUserMsg({ type: '', text: '' });
    try {
      const payload = {
        full_name: userFormData.full_name.trim(),
        role: userFormData.role,
        email: userFormData.email.trim()
      };
      if (userFormData.password) {
        payload.password = userFormData.password;
      }

      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi cập nhật tài khoản');
      }

      setUsers((prev) =>
        prev.map((item) => (item.id === editingUser.id ? { ...item, ...data.user } : item))
      );

      if (currentUser && currentUser.id === editingUser.id) {
        const updatedCurrent = { ...currentUser, ...data.user };
        localStorage.setItem('sukyso_user', JSON.stringify(updatedCurrent));
      }

      setUserMsg({ type: 'success', text: 'Cập nhật tài khoản người dùng thành công!' });
      setTimeout(() => {
        setEditingUser(null);
        fetchDashboardData();
      }, 700);
    } catch (err) {
      setUserMsg({ type: 'error', text: err.message });
    } finally {
      setUserSaving(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const ts = Date.now();
      const [analyticsRes, resRes, usersRes, artRes, teacherRes, quizRes, topicsRes, contactsRes, unreadRes, assignmentsRes] = await Promise.all([
        fetch(`/api/analytics/overview?_t=${ts}`).then((r) => r.json()),
        fetch(`/api/resources?_t=${ts}`).then((r) => r.json()),
        fetch(`/api/users?_t=${ts}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).then((r) => (r.ok ? r.json() : [])),
        fetch(`/api/3d-artifacts?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`/api/teacher-materials?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`/api/quizzes?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`/api/topics?_t=${ts}`).then((r) => (r.ok ? r.json() : [])),
        fetch(`/api/contacts?_t=${ts}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).then((r) => (r.ok ? r.json() : [])),
        fetch(`/api/contacts/unread-count?_t=${ts}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).then((r) => (r.ok ? r.json() : { unread: 0 })),
        fetch(`/api/exam-assignments?_t=${ts}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).then((r) => (r.ok ? r.json() : []))
      ]);

      setAnalytics(analyticsRes);
      setResources(resRes);
      setUsers(usersRes);
      setArtifacts3dList(artRes);
      setTeacherMaterials(teacherRes);
      setQuizzesList(quizRes);
      setTopicsList(topicsRes);
      setContactsList(contactsRes);
      setUnreadContactsCount(unreadRes?.unread || 0);
      setAssignmentsList(assignmentsRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (artifacts3d && artifacts3d.length > 0) {
      setArtifacts3dList(artifacts3d);
    }
  }, [artifacts3d]);

  useEffect(() => {
    if (externalTopics && externalTopics.length > 0) {
      setTopicsList(externalTopics);
    }
  }, [externalTopics]);

  // Handlers for Topics CRUD
  const handleOpenNewTopic = () => {
    setEditingTopic(null);
    setIsTopicModalOpen(true);
  };

  const handleOpenEditTopic = (topic) => {
    setEditingTopic(topic);
    setIsTopicModalOpen(true);
  };

  const handleSaveTopic = async (formData, id) => {
    const url = id ? `/api/topics/${id}` : '/api/topics';
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
      throw new Error(data.error || 'Lỗi khi lưu chủ đề');
    }
    await fetchDashboardData();
    if (onTopicsChange) await onTopicsChange();
  };

  const handleDeleteTopic = async (topic) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chủ đề "${topic.title}"?\nLưu ý: Không thể xóa nếu chủ đề đang có tư liệu đính kèm.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/topics/${topic.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi xóa chủ đề');
      }
      await fetchDashboardData();
      if (onTopicsChange) await onTopicsChange();
    } catch (err) {
      alert('Không thể xóa chủ đề: ' + err.message);
    }
  };

  // Topic Drag-and-Drop & Reorder State
  const [reorderingTopics, setReorderingTopics] = useState(false);
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState('');
  const [draggedTopicIndex, setDraggedTopicIndex] = useState(null);
  const [dragOverTopicIndex, setDragOverTopicIndex] = useState(null);
  const [topicsViewMode, setTopicsViewMode] = useState('grid'); // 'grid' | 'list'

  const handleDragStartTopic = (e, index) => {
    setDraggedTopicIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragEnterTopic = (e, index) => {
    e.preventDefault();
    if (draggedTopicIndex === null || draggedTopicIndex === index) return;
    setDragOverTopicIndex(index);
  };

  const handleDragOverTopic = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropTopic = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedTopicIndex === null || draggedTopicIndex === targetIndex) {
      setDraggedTopicIndex(null);
      setDragOverTopicIndex(null);
      return;
    }

    const updated = [...topicsList];
    const [moved] = updated.splice(draggedTopicIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setTopicsList(updated);
    setDraggedTopicIndex(null);
    setDragOverTopicIndex(null);

    await saveNewTopicsOrder(updated);
  };

  const handleDragEndTopic = () => {
    setDraggedTopicIndex(null);
    setDragOverTopicIndex(null);
  };

  const handleMoveTopicStep = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= topicsList.length) return;

    const updated = [...topicsList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setTopicsList(updated);
    await saveNewTopicsOrder(updated);
  };

  const saveNewTopicsOrder = async (orderedList) => {
    try {
      setReorderingTopics(true);
      const orderedIds = orderedList.map((t) => t.id);
      const res = await fetch('/api/topics/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ ordered_ids: orderedIds })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi lưu thứ tự chủ đề');
      }

      setReorderSuccessMsg('✓ Đã cập nhật và lưu thứ tự sắp xếp chủ đề thành công!');
      setTimeout(() => setReorderSuccessMsg(''), 3500);

      if (onTopicsChange) await onTopicsChange();
    } catch (err) {
      console.error('Reorder error:', err);
      alert('Không thể lưu thứ tự: ' + err.message);
      await fetchDashboardData();
    } finally {
      setReorderingTopics(false);
    }
  };

  // Handlers for Contacts
  const handleUpdateContactStatus = async (id, newStatus, note = null) => {
    try {
      const res = await fetch(`/api/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          status: newStatus,
          admin_note: note !== null ? note : (viewingContact?.admin_note || '')
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi cập nhật trạng thái');
      }
      setContactsList((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus, admin_note: note !== null ? note : c.admin_note } : c))
      );
      if (viewingContact && viewingContact.id === id) {
        setViewingContact((prev) => ({
          ...prev,
          status: newStatus,
          admin_note: note !== null ? note : prev.admin_note
        }));
      }
      const countRes = await fetch(`/api/contacts/unread-count?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((r) => (r.ok ? r.json() : { unread: 0 }));
      setUnreadContactsCount(countRes?.unread || 0);
    } catch (err) {
      alert('Cập nhật thất bại: ' + err.message);
    }
  };

  const handleSaveContactNote = async (id) => {
    setSavingNote(true);
    try {
      const res = await fetch(`/api/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          status: viewingContact.status,
          admin_note: adminNoteInput
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi lưu ghi chú');
      }
      setContactsList((prev) =>
        prev.map((c) => (c.id === id ? { ...c, admin_note: adminNoteInput } : c))
      );
      if (viewingContact && viewingContact.id === id) {
        setViewingContact((prev) => ({ ...prev, admin_note: adminNoteInput }));
      }
      alert('Đã lưu ghi chú xử lý thành công!');
    } catch (err) {
      alert('Lỗi lưu ghi chú: ' + err.message);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin nhắn liên hệ này?')) {
      return;
    }
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi xóa');
      }
      setContactsList((prev) => prev.filter((c) => c.id !== id));
      if (viewingContact && viewingContact.id === id) {
        setViewingContact(null);
      }
      const countRes = await fetch(`/api/contacts/unread-count?_t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((r) => (r.ok ? r.json() : { unread: 0 }));
      setUnreadContactsCount(countRes?.unread || 0);
    } catch (err) {
      alert('Xóa liên hệ thất bại: ' + err.message);
    }
  };

  const handleOpenContactDetail = (contact) => {
    setViewingContact(contact);
    setAdminNoteInput(contact.admin_note || '');
  };

  // Handlers for 3D Artifacts
  const handleOpenNewArtifact3D = () => {
    setEditingArtifact3D(null);
    setIsArtifactModalOpen(true);
  };

  const handleOpenEditArtifact3D = (art) => {
    setEditingArtifact3D(art);
    setIsArtifactModalOpen(true);
  };

  const handleSaveArtifact3D = async (formData, id) => {
    const url = id ? `/api/3d-artifacts/${id}` : '/api/3d-artifacts';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu bảo vật 3D');
    }
    await fetchDashboardData();
    if (onArtifacts3DChange) await onArtifacts3DChange();
  };

  const handleDeleteArtifact3D = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bảo vật 3D "${name}" khỏi cơ sở dữ liệu?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/3d-artifacts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi xóa bảo vật');
      }
      await fetchDashboardData();
      if (onArtifacts3DChange) await onArtifacts3DChange();
    } catch (err) {
      alert('Xóa bảo vật thất bại: ' + err.message);
    }
  };

  // Handlers for Teacher Materials
  const handleOpenNewTeacherMaterial = () => {
    setEditingTeacherMaterial(null);
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacherMaterial = (item) => {
    setEditingTeacherMaterial(item);
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacherMaterial = async (formData, id) => {
    const url = id ? `/api/teacher-materials/${id}` : '/api/teacher-materials';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu tài liệu giáo viên');
    }
    await fetchDashboardData();
  };

  const handleDeleteTeacherMaterial = async (id, title) => {
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
      await fetchDashboardData();
    } catch (err) {
      alert('Xóa tài liệu thất bại: ' + err.message);
    }
  };

  // Filter Teacher Materials
  const filteredTeacherMaterials = teacherMaterials.filter((m) => {
    const matchCategory = teacherCategoryFilter === 'all' || m.category === teacherCategoryFilter;
    if (!matchCategory) return false;
    if (!teacherSearch.trim()) return true;
    const q = teacherSearch.toLowerCase();
    return (
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.subtitle && m.subtitle.toLowerCase().includes(q)) ||
      (m.content && m.content.toLowerCase().includes(q)) ||
      (m.badge && m.badge.toLowerCase().includes(q))
    );
  });

  // Handlers for Quizzes
  const handleOpenNewQuiz = () => {
    setEditingQuiz(null);
    setIsQuizModalOpen(true);
  };

  const handleOpenEditQuiz = (q) => {
    setEditingQuiz(q);
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = async (formData, id) => {
    const url = id ? `/api/quizzes/${id}` : '/api/quizzes';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu câu hỏi trắc nghiệm');
    }
    await fetchDashboardData();
  };

  const handleDeleteQuiz = async (id, question) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa câu hỏi "${question}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi xóa câu hỏi');
      }
      await fetchDashboardData();
    } catch (err) {
      alert('Xóa câu hỏi thất bại: ' + err.message);
    }
  };

  // Handlers for Exam Assignments
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
      throw new Error(err.error || 'Lỗi khi lưu bài thi');
    }

    await fetchDashboardData();
  };

  const handleDeleteAssignment = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài kiểm tra "${title}"? Mọi kết quả bài làm của học sinh cho bài này cũng sẽ bị xóa vĩnh viễn.`)) {
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

      await fetchDashboardData();
    } catch (err) {
      alert('Xóa bài thi thất bại: ' + err.message);
    }
  };

  // Filter exam assignments
  const filteredAssignments = assignmentsList.filter((item) => {
    if (!assignmentSearch.trim()) return true;
    const q = assignmentSearch.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  // Filter quizzes
  const filteredQuizzes = quizzesList.filter((q) => {
    const matchLesson = quizLessonFilter === 'all' || q.lesson === quizLessonFilter;
    if (!matchLesson) return false;
    if (!quizSearch.trim()) return true;
    const query = quizSearch.toLowerCase();
    const matchQ = q.question && q.question.toLowerCase().includes(query);
    const matchL = q.lesson && q.lesson.toLowerCase().includes(query);
    const matchExp = q.explanation && q.explanation.toLowerCase().includes(query);
    return matchQ || matchL || matchExp;
  });

  // Unique lessons list for filter dropdown
  const uniqueLessons = Array.from(new Set(quizzesList.map((q) => q.lesson))).filter(Boolean);

  // Filter 3D artifacts
  const filteredArtifacts = artifacts3dList.filter((art) => {
    if (!artifactSearch.trim()) return true;
    const q = artifactSearch.toLowerCase();
    return (
      (art.name && art.name.toLowerCase().includes(q)) ||
      (art.code && art.code.toLowerCase().includes(q)) ||
      (art.culture && art.culture.toLowerCase().includes(q)) ||
      (art.period && art.period.toLowerCase().includes(q)) ||
      (art.location && art.location.toLowerCase().includes(q))
    );
  });

  // Filter resources
  const filteredResources = resources.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      r.lesson.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      r.place.toLowerCase().includes(resourceSearch.toLowerCase());
    const matchTopic = topicFilter === 'all' || r.topic_id === Number(topicFilter);
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    return matchSearch && matchTopic && matchType;
  });

  const handleOpenAdminPreview = (res) => {
    setPreviewResource(res);
    setPreviewActiveTab('gallery');
    setPreviewPhotoIdx(0);
  };

  // Extract gallery photos for preview
  const getPreviewPhotos = (res) => {
    if (!res) return [];
    const raw = res.gallery;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (typeof raw === 'string') {
      try {
        const norm = raw.replace(/'/g, '"');
        const parsed = JSON.parse(norm);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return raw.split('\n').filter(Boolean);
      }
    }
    return res.img ? [res.img] : [];
  };

  // Filter Topics
  const filteredTopics = topicsList.filter((t) => {
    if (!topicSearch.trim()) return true;
    const q = topicSearch.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      String(t.id).includes(q)
    );
  });

  // Filter Contacts
  const filteredContacts = contactsList.filter((c) => {
    const matchStatus = contactStatusFilter === 'all' || c.status === contactStatusFilter;
    if (!matchStatus) return false;
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    return (
      (c.full_name && c.full_name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.content && c.content.toLowerCase().includes(q))
    );
  });

  const previewPhotos = previewResource ? getPreviewPhotos(previewResource) : [];
  const previewYoutubeUrl = previewResource ? formatYouTubeEmbedUrl(previewResource.video_url) : null;

  // Modern Admin Tabs Configuration
  const adminTabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3, count: null },
    { id: 'resources', label: 'Kho tư liệu', icon: BookOpen, count: resources.length },
    { id: 'artifacts3d', label: 'Bảo vật 3D', icon: Box, count: artifacts3dList.length },
    { id: 'topics', label: 'Quản lý Chủ đề', icon: FolderKanban, count: topicsList.length },
    { id: 'teachers', label: 'Sư phạm 5512', icon: GraduationCap, count: teacherMaterials.length },
    { id: 'quizzes', label: 'Ngân hàng câu hỏi', icon: HelpCircle, count: quizzesList.length },
    { id: 'assignments', label: 'Giao bài & Đề thi', icon: Award, count: assignmentsList.length },
    { id: 'users', label: 'Người dùng', icon: Users, count: users.length },
    {
      id: 'contacts',
      label: 'Hộp thư liên hệ',
      icon: Mail,
      count: contactsList.length,
      unreadBadge: unreadContactsCount
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* ================= DEDICATED ADMIN TOPBAR (NO CLIENT MENU ITEMS) ================= */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 text-white -mx-4 sm:-mx-8 lg:-mx-12 -mt-4 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-navy to-navy-light text-white flex items-center justify-center font-black text-sm border border-white/20 shadow-sm">
            <Landmark className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block leading-tight">
              Sử Ký Số • Trung Tâm Quản Trị Hệ Thống
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Hệ thống vận hành trực tuyến • Phiên làm việc Quản trị viên
            </span>
          </div>
        </div>

        {/* Action Controls & Admin Profile */}
        <div className="flex items-center gap-3">
          {onOpenBannerConfig && (
            <button
              onClick={onOpenBannerConfig}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 cursor-pointer shadow-xs active:scale-95"
              title="Cấu hình Banner trang chủ (Carousel)"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              <span>Banner Carousel</span>
            </button>
          )}
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-800"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNewResource}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm tư liệu mới</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="w-6 h-6 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">
              {currentUser?.full_name || currentUser?.username}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Đăng xuất khỏi hệ thống"
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition border border-slate-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ================= DASHBOARD COCKPIT HEADER ================= */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-dark to-navy text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gold/20 text-gold border border-gold/40">
              <ShieldCheck className="w-3.5 h-3.5" /> Bảng Điều Khiển Quản Trị
            </span>
            <span className="text-xs text-slate-400 font-medium">• Chế độ độc lập không tái sử dụng giao diện Client</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Xin chào, <span className="text-gold">{currentUser?.full_name || 'Quản trị viên'}</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Theo dõi lưu lượng truy cập, tương tác 3D học tập và quản lý cơ sở dữ liệu học liệu Lịch sử 10.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenBannerConfig && (
            <button
              onClick={onOpenBannerConfig}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 cursor-pointer shadow-xs active:scale-95"
              title="Cấu hình Banner trang chủ (Carousel)"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              <span>Banner Carousel</span>
            </button>
          )}
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15"
            title="Làm mới số liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Cập nhật</span>
          </button>
          <button
            onClick={onNewResource}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-bold transition shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm tư liệu mới</span>
          </button>
        </div>
      </div>

      {/* ================= ADMIN TABS SWITCHER ================= */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800/80 p-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-xs border border-slate-700/80 ring-1 ring-white/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-500'
                  }`}
                />
                <span>{tab.label}</span>

                {tab.unreadBadge !== undefined && tab.unreadBadge > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white leading-none shadow-xs animate-pulse">
                    {tab.unreadBadge} mới
                  </span>
                ) : tab.count !== null && tab.count !== undefined ? (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-mono leading-none border transition-colors ${
                      isActive
                        ? 'bg-amber-400/15 text-amber-300 border-amber-400/30 font-bold'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}

          {onOpenBannerConfig && (
            <div className="ml-auto pl-2 border-l border-slate-800/80 flex items-center shrink-0">
              <button
                onClick={onOpenBannerConfig}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition cursor-pointer whitespace-nowrap shadow-xs active:scale-95"
                title="Cấu hình Banner trang chủ (Carousel)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Banner Carousel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tổng lượt xem
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {analytics?.kpis?.total_views?.toLocaleString() || '12,480'}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  <TrendingUp className="w-3 h-3" /> +18.4%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Đo lường thời gian thực từ hệ thống</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tư liệu khảo cổ
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {analytics?.kpis?.total_resources || resources.length}
                </span>
                <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                  {topicsList.length} Chủ đề
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Chuẩn hóa GDPT 2018</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Học sinh & GV
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-800">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {analytics?.kpis?.total_users || users.length || 2}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800">
                  Đã xác thực
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Tài khoản bảo mật cao cấp</span>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mô hình 3D tương tác
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                  <Box className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {analytics?.kpis?.total_3d || 5}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  71.2% tương tác
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Xoay 360°, đổi ánh sáng</span>
            </div>

            <div
              onClick={() => setActiveTab('contacts')}
              className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer hover:border-gold/40 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-gold transition">
                  Hộp thư liên hệ
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">
                  {contactsList.length}
                </span>
                {unreadContactsCount > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800 animate-pulse">
                    {unreadContactsCount} mới
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    Đã xử lý
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-1">Từ trang Liên hệ người dùng</span>
            </div>
          </div>

          {/* Top Most Viewed & Live Activity Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Top Most Viewed Resources */}
            <div className="lg:col-span-7 bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Top 6 Tư Liệu Được Xem Nhiều Nhất
                  </h3>
                  <p className="text-xs text-slate-400">Bấm vào bất kỳ dòng nào để mở bảng kiểm tra Admin trực tiếp</p>
                </div>
                <span className="text-xs font-bold text-gold flex items-center gap-1">
                  <Award className="w-4 h-4 text-gold" /> Xếp hạng
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {analytics?.top_resources?.map((res, index) => (
                  <div
                    key={res.id}
                    onClick={() => handleOpenAdminPreview(res)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/80 px-3 rounded-2xl transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          index === 0
                            ? 'bg-amber-500 text-slate-950'
                            : index === 1
                            ? 'bg-slate-300 text-slate-900'
                            : index === 2
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <img
                        src={res.img}
                        alt={res.title}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 bg-slate-800 border border-slate-700 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-100 group-hover:text-gold transition truncate">
                          {res.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {res.place} • {res.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <span className="text-xs font-black text-gold flex items-center gap-1 justify-end">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {res.view_count?.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500">lượt xem</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-gold transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Activity Logs Audit Trail */}
            <div className="lg:col-span-5 bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Nhật Ký Hoạt Động Thời Gian Thực
                    </h3>
                    <p className="text-xs text-slate-400">Lịch sử truy cập và thao tác dữ liệu</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
                  {analytics?.recent_activities?.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gold flex items-center gap-1">
                          <Activity className="w-3 h-3 text-gold" />
                          {log.username}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.created_at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-tight">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
                <span>Nhật ký bảo mật hệ thống</span>
                <span className="text-emerald-400 font-semibold">Tự động đồng bộ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: DEDICATED ADMIN LIST VIEW (KHÔNG TẬN DỤNG VIEW CLIENT) ================= */}
      {activeTab === 'resources' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-sm overflow-hidden animate-fade-in space-y-4 p-5 sm:p-6">
          {/* Header & Filter Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">
                  Danh Sách Quản Trị Tư Liệu Di Tích
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-gold border border-slate-700">
                  {filteredResources.length} / {resources.length} tư liệu
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Giao diện quản lý độc quyền: xem nhanh chi tiết, hỗ trợ mở bộ biên soạn toàn màn hình và xóa an toàn.
              </p>
            </div>

            {/* Filter inputs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder="Tìm kiếm tư liệu..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Topic Filter */}
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">Tất cả chủ đề</option>
                <option value="1">Chủ đề 1</option>
                <option value="2">Chủ đề 2</option>
                <option value="3">Chủ đề 3</option>
                <option value="4">Chủ đề 4 (Đông Nam Á)</option>
                <option value="5">Chủ đề 5</option>
                <option value="6">Chủ đề 6</option>
                <option value="7">Chủ đề 7</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">Tất cả định dạng</option>
                <option value="3d">Mô hình 3D</option>
                <option value="image">Hình ảnh</option>
                <option value="video">Video</option>
                <option value="text">Văn bản</option>
              </select>

              <button
                onClick={onNewResource}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 font-black text-xs transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm tư liệu</span>
              </button>
            </div>
          </div>

          {/* High-Density Admin List View */}
          <div className="divide-y divide-slate-800 overflow-hidden">
            {filteredResources.map((res) => {
              const photos = getPreviewPhotos(res);
              const hasVideo = !!res.video_url;
              const has3D = !!res.model_3d;

              return (
                <div
                  key={res.id}
                  className="py-4 px-3 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/60 rounded-2xl transition group"
                >
                  {/* Left: Thumbnail & Main Info */}
                  <div
                    onClick={() => handleOpenAdminPreview(res)}
                    className="flex items-start sm:items-center gap-4 min-w-0 flex-1 cursor-pointer"
                  >
                    {/* Thumbnail with gallery indicator */}
                    <div className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-slate-700">
                      <img
                        src={res.img}
                        alt={res.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {photos.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-black text-gold px-1 rounded border border-white/20">
                          +{photos.length} ảnh
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          #{res.id}
                        </span>
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                          Chủ đề {res.topic_id}
                        </span>
                        {has3D && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Hiện vật 3D
                          </span>
                        )}
                        {hasVideo && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Video 4K
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-sm text-white group-hover:text-gold transition truncate">
                        {res.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        {res.lesson} • <span className="text-slate-300">{res.place}</span> ({res.period || 'Cổ đại'})
                      </p>
                    </div>
                  </div>

                  {/* Right: Metrics & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-left md:text-right">
                      <span className="text-xs font-black text-white flex items-center md:justify-end gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {(res.view_count || 1).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block">lượt tham quan</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenAdminPreview(res)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                        title="Xem trước nội dung hồ sơ (Admin Inspector)"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold" />
                        <span>Xem</span>
                      </button>

                      <button
                        onClick={() => onEditResource(res)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-gold hover:text-slate-950 text-slate-200 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                        title="Mở trình biên tập toàn màn hình"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa tư liệu #${res.id}: ${res.title}?`)) {
                            onDeleteResource(res.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition border border-rose-800"
                        title="Xóa tư liệu vĩnh viễn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: USER MANAGEMENT TABLE ================= */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-sm overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-slate-800">
            <h3 className="font-extrabold text-base text-white">
              Danh Sách Tài Khoản Trong Hệ Thống
            </h3>
            <p className="text-xs text-slate-400">
              Mật khẩu tài khoản được bảo vệ bằng cơ chế mã hóa chuẩn an toàn cao cấp.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Tên đăng nhập</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Vai trò (Role)</th>
                  <th className="py-3 px-4">Thời gian tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">#{u.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{u.full_name}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{u.username}</td>
                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          u.role === 'admin'
                            ? 'bg-gold/20 text-gold border border-gold/40'
                            : u.role === 'teacher'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role === 'admin' ? 'Quản trị viên' : u.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEditUser(u)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-gold hover:text-slate-950 text-slate-200 text-xs font-bold transition border border-slate-700 shadow-2xs group"
                        title="Chỉnh sửa họ tên, vai trò và đổi mật khẩu"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gold group-hover:text-slate-950 transition-colors" />
                        <span>Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: 3D ARTIFACTS MANAGEMENT ================= */}
      {activeTab === 'artifacts3d' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-sm overflow-hidden animate-fade-in space-y-4 p-5 sm:p-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-gold" />
                <span>Quản Lý Danh Mục Bảo Vật Studio 3D</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chỉnh sửa thông tin học thuật, niên đại và gắn mã nhúng HTML Sketchfab 3D tương tác xoay 360°.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={artifactSearch}
                  onChange={(e) => setArtifactSearch(e.target.value)}
                  placeholder="Tìm theo tên bảo vật, văn hóa..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-gold w-48 sm:w-60"
                />
              </div>

              <button
                onClick={handleOpenNewArtifact3D}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition active:scale-95 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Thêm bảo vật 3D</span>
              </button>
            </div>
          </div>

          {/* Artifacts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Mã Code</th>
                  <th className="py-3 px-4">Tên Bảo Vật / Hiện Vật</th>
                  <th className="py-3 px-4">Nền Văn Hóa & Niên Đại</th>
                  <th className="py-3 px-4">Nơi Lưu Giữ / Khảo Cổ</th>
                  <th className="py-3 px-4">Định Dạng 3D</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredArtifacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Không tìm thấy bảo vật 3D nào phù hợp với từ khóa tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredArtifacts.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-800/50 transition group">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-gold">
                          {art.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-white font-bold block text-sm group-hover:text-gold transition">
                          {art.name}
                        </strong>
                        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-md">
                          {art.description}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-200 font-semibold block">{art.culture}</span>
                        <span className="text-[11px] text-slate-400">{art.period}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="line-clamp-1 max-w-xs">{art.location || '—'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {art.embed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Mã nhúng Sketchfab</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
                            <Box className="w-3 h-3 text-amber-400" />
                            <span>Mô hình WebGL tích hợp</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/studio-3d/co-vat/${art.code}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Mở xem trực tiếp tại Studio 3D"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditArtifact3D(art)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-gold hover:text-slate-950 text-slate-200 transition text-xs font-bold"
                            title="Chỉnh sửa bảo vật 3D"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => handleDeleteArtifact3D(art.id, art.name)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition"
                            title="Xóa bảo vật"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: TEACHER MATERIALS MANAGEMENT ================= */}
      {activeTab === 'teachers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Controls */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
                  <GraduationCap className="w-3.5 h-3.5" /> Nghiệp Vụ Sư Phạm GDPT 2018
                </span>
                <span className="text-xs text-slate-400">({filteredTeacherMaterials.length} mục)</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Quản Lý Tài Liệu & Nghiệp Vụ Sư Phạm Cho Giáo Viên
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chỉnh sửa toàn diện nội dung Cẩm nang sư phạm, Khung bài dạy 5512 và Ngân hàng câu hỏi trắc nghiệm đánh giá năng lực.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/giao-vien"
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gold" />
                <span>Xem giao diện Giáo viên (Live)</span>
              </Link>
              <button
                onClick={handleOpenNewTeacherMaterial}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-md active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm nội dung sư phạm</span>
              </button>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setTeacherCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  teacherCategoryFilter === 'all'
                    ? 'bg-gold text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tất cả ({teacherMaterials.length})
              </button>
              <button
                onClick={() => setTeacherCategoryFilter('cam_nang')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  teacherCategoryFilter === 'cam_nang'
                    ? 'bg-blue-600 text-white font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                📖 Cẩm nang ({teacherMaterials.filter((m) => m.category === 'cam_nang').length})
              </button>
              <button
                onClick={() => setTeacherCategoryFilter('ke_hoach_5512')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  teacherCategoryFilter === 'ke_hoach_5512'
                    ? 'bg-emerald-600 text-white font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                📑 Kế hoạch 5512 ({teacherMaterials.filter((m) => m.category === 'ke_hoach_5512').length})
              </button>
              <button
                onClick={() => setTeacherCategoryFilter('ngan_hang_cau_hoi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  teacherCategoryFilter === 'ngan_hang_cau_hoi'
                    ? 'bg-amber-600 text-white font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                ❓ Ngân hàng câu hỏi ({teacherMaterials.filter((m) => m.category === 'ngan_hang_cau_hoi').length})
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder="Tìm nội dung, hoạt động, câu hỏi..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {teacherSearch && (
                <button
                  onClick={() => setTeacherSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table of Materials */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Chuyên mục</th>
                  <th className="py-3 px-4">Huy hiệu / STT</th>
                  <th className="py-3 px-4">Tiêu đề & Chuyên đề</th>
                  <th className="py-3 px-4">Nội dung chi tiết</th>
                  <th className="py-3 px-4">Thông tin bổ sung</th>
                  <th className="py-3 px-4 text-center">Thứ tự</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTeacherMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                      Không tìm thấy nội dung sư phạm nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredTeacherMaterials.map((item) => {
                    let extra = {};
                    if (item.extra_data) {
                      try {
                        const parsed = typeof item.extra_data === 'string' ? JSON.parse(item.extra_data) : item.extra_data;
                        if (parsed && typeof parsed === 'object') {
                          extra = parsed;
                        }
                      } catch (e) {
                        extra = {};
                      }
                    }
                    if (!extra || typeof extra !== 'object') {
                      extra = {};
                    }

                    const categoryBadge = () => {
                      switch (item.category) {
                        case 'cam_nang':
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                              <BookOpen className="w-3 h-3" /> Cẩm nang
                            </span>
                          );
                        case 'ke_hoach_5512':
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              <FileText className="w-3 h-3" /> Kế hoạch 5512
                            </span>
                          );
                        case 'ngan_hang_cau_hoi':
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                              <HelpCircle className="w-3 h-3" /> Câu hỏi
                            </span>
                          );
                        default:
                          return <span className="text-slate-400">{item.category}</span>;
                      }
                    };

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition group">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {categoryBadge()}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-gold">
                            {item.badge || item.order_index}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-white font-bold block text-sm group-hover:text-gold transition">
                            {item.title}
                          </strong>
                          {item.subtitle && (
                            <span className="text-[11px] text-gold-light line-clamp-1">
                              {item.subtitle}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-slate-300 text-xs line-clamp-2 max-w-sm font-normal">
                            {item.content}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-[11px]">
                          {extra?.technique && (
                            <span className="block text-slate-300 line-clamp-1 font-medium">
                              🛠️ {extra.technique}
                            </span>
                          )}
                          {extra?.answer && (
                            <span className="block text-emerald-400 line-clamp-1 font-bold">
                              ✓ {extra.answer}
                            </span>
                          )}
                          {extra?.topic_url && (
                            <span className="block text-slate-400 font-mono text-[10px]">
                              🔗 {extra.topic_url}
                            </span>
                          )}
                          {!extra?.technique && !extra?.answer && !extra?.topic_url && (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                          {item.order_index}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditTeacherMaterial(item)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-gold hover:text-slate-950 text-slate-200 transition text-xs font-bold"
                              title="Chỉnh sửa nội dung này"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTeacherMaterial(item.id, item.title)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition"
                              title="Xóa nội dung này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: QUIZZES MANAGEMENT ================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Controls */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
                  <Award className="w-3.5 h-3.5" /> Khảo Thí & Đánh Giá Năng Lực
                </span>
                <span className="text-xs text-slate-400">({filteredQuizzes.length} câu hỏi)</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Ngân Hàng Trắc Nghiệm Theo Từng Bài Học Lịch Sử 10
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Quản lý các câu hỏi trắc nghiệm tương tác cho từng chuyên đề, phục vụ ôn tập trực tiếp trên trang chi tiết và góc học tập của học sinh.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/hoc-sinh/luyen-tap-trac-nghiem"
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gold" />
                <span>Xem thử thách Học sinh (Live)</span>
              </Link>
              <button
                onClick={handleOpenNewQuiz}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-md active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm câu hỏi mới</span>
              </button>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Lesson Filter Dropdown / Pills */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 shrink-0">Lọc theo bài:</span>
              <select
                value={quizLessonFilter}
                onChange={(e) => setQuizLessonFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">Tất cả các bài ({quizzesList.length} câu)</option>
                {uniqueLessons.map((les) => {
                  const count = quizzesList.filter((q) => q.lesson === les).length;
                  return (
                    <option key={les} value={les}>
                      {les} ({count} câu)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quizSearch}
                onChange={(e) => setQuizSearch(e.target.value)}
                placeholder="Tìm nội dung câu hỏi, bài học..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {quizSearch && (
                <button
                  onClick={() => setQuizSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table of Quizzes */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Bài học</th>
                  <th className="py-3 px-4">Cấp độ</th>
                  <th className="py-3 px-4">Nội dung câu hỏi</th>
                  <th className="py-3 px-4">4 Phương án & Đáp án</th>
                  <th className="py-3 px-4">Giải thích sử liệu</th>
                  <th className="py-3 px-4 text-center">Thứ tự</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                      Không tìm thấy câu hỏi trắc nghiệm nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredQuizzes.map((q) => {
                    const opts = Array.isArray(q.options)
                      ? q.options
                      : (typeof q.options === 'string' ? JSON.parse(q.options || '[]') : []);

                    const getDiffPill = (diff) => {
                      switch (diff) {
                        case 'nhan_biet':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">Nhận biết</span>;
                        case 'thong_hieu':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">Thông hiểu</span>;
                        case 'van_dung':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">Vận dụng</span>;
                        case 'van_dung_cao':
                          return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-400 border border-purple-800">Vận dụng cao</span>;
                        default:
                          return <span className="text-slate-400">{diff}</span>;
                      }
                    };

                    return (
                      <tr key={q.id} className="hover:bg-slate-800/50 transition group">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-200 block max-w-xs truncate">
                            {q.lesson}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Chủ đề {q.topic_id} {q.resource_id ? `• Hiện vật #${q.resource_id}` : ''}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getDiffPill(q.difficulty)}
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-white font-bold block text-sm group-hover:text-gold transition">
                            {q.question}
                          </strong>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 text-[11px] max-w-xs">
                            {opts.map((opt, i) => (
                              <div
                                key={i}
                                className={`flex items-start gap-1.5 px-2 py-0.5 rounded ${
                                  q.correct_index === i
                                    ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/80'
                                    : 'text-slate-400'
                                }`}
                              >
                                <span className="font-mono">{String.fromCharCode(65 + i)}.</span>
                                <span className="truncate">{opt}</span>
                                {q.correct_index === i && <span className="ml-auto text-[10px] text-emerald-400 shrink-0">✓ Đúng</span>}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-slate-400 text-xs line-clamp-2 max-w-xs font-normal">
                            {q.explanation || '—'}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                          {q.order_index}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditQuiz(q)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-gold hover:text-slate-950 text-slate-200 transition text-xs font-bold"
                              title="Chỉnh sửa câu hỏi này"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={() => handleDeleteQuiz(q.id, q.question)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition"
                              title="Xóa câu hỏi này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB: EXAM ASSIGNMENTS (GIAO BÀI & ĐỀ THI) ================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Controls */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
                  <Award className="w-3.5 h-3.5" /> Quản Lý Đề Thi & Khảo Thí
                </span>
                <span className="text-xs text-slate-400">({filteredAssignments.length} bài kiểm tra)</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Khởi Tạo Bài Kiểm Tra & Giao Cho Học Sinh
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tạo bài thi từ ngân hàng trắc nghiệm GDPT 2018, chọn danh sách học sinh cần làm và theo dõi bảng điểm tự động.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm đề thi..."
                  value={assignmentSearch}
                  onChange={(e) => setAssignmentSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold w-48 sm:w-60"
                />
              </div>

              {/* Add Assignment Button */}
              <button
                onClick={handleOpenNewAssignment}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Tạo Đề Thi & Giao Bài</span>
              </button>
            </div>
          </div>

          {/* Table of Assignments */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4">Tên Bài Kiểm Tra</th>
                    <th className="py-4 px-4 text-center">Thời Lượng</th>
                    <th className="py-4 px-4 text-center">Số Câu Hỏi</th>
                    <th className="py-4 px-4">Hạn Nộp</th>
                    <th className="py-4 px-4">Đối Tượng Giao</th>
                    <th className="py-4 px-4 text-center">Đã Nộp</th>
                    <th className="py-4 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-500">
                        Chưa có đề thi nào trong danh sách. Bấm <strong>"+ Tạo Đề Thi & Giao Bài"</strong> để khởi tạo bài thi đầu tiên.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((item) => {
                      const questionCount = Array.isArray(item.question_ids) ? item.question_ids.length : 0;
                      const studentIds = item.assigned_student_ids || ['all'];
                      const isAll = Array.isArray(studentIds) && studentIds.includes('all');
                      const submissionCount = item.submission_count || 0;
                      const isExpired = item.due_date && new Date(item.due_date) < new Date();

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/50 transition group">
                          <td className="py-3.5 px-4">
                            <strong className="text-white font-bold block text-sm group-hover:text-gold transition">
                              {item.title}
                            </strong>
                            {item.description && (
                              <p className="text-slate-400 text-[11px] line-clamp-1 max-w-sm mt-0.5 font-normal">
                                {item.description}
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-950 text-slate-300 border border-slate-700">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.duration_minutes || 15} phút
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                              {questionCount} câu
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                            {item.due_date ? (
                              <div className="space-y-0.5">
                                <span className={isExpired ? 'text-rose-400 font-bold' : 'text-slate-300 font-medium'}>
                                  {new Date(item.due_date).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </span>
                                {isExpired && (
                                  <span className="block text-[10px] text-rose-500 font-bold uppercase">
                                    Đã kết thúc
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Không thời hạn</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isAll ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                👥 Toàn bộ học sinh
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-950 text-slate-300 border border-slate-700">
                                🎯 {studentIds.length} học sinh
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {submissionCount} bài
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingSubmissionsAssignment(item)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/80 transition text-xs font-bold"
                                title="Xem bảng điểm & danh sách nộp bài"
                              >
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Bảng điểm</span>
                              </button>
                              <button
                                onClick={() => handleOpenEditAssignment(item)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-gold hover:text-slate-950 text-slate-200 transition text-xs font-bold"
                                title="Chỉnh sửa bài thi & giao bài"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => handleDeleteAssignment(item.id, item.title)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition"
                                title="Xóa đề thi này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: TOPICS MANAGEMENT (CHỦ ĐỀ) ================= */}
      {activeTab === 'topics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                  GDPT 2018 Lịch Sử 10
                </span>
                <span className="text-xs text-slate-400">• Tổng số: {topicsList.length} chủ đề</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-gold" />
                  Kéo thả sắp xếp
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Quản Lý & Sắp Xếp Thứ Tự Chủ Đề</h3>
              <p className="text-xs text-slate-400 mt-1">
                Kéo thả (Drag & Drop) thẻ hoặc bấm nút ↑ ↓ để thay đổi thứ tự ưu tiên hiển thị trên Trang chủ, Kho tư liệu và Menu.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTopicsViewMode('grid')}
                  className={`p-2 rounded-lg transition text-xs font-bold flex items-center gap-1.5 ${
                    topicsViewMode === 'grid'
                      ? 'bg-slate-800 text-gold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Chế độ xem dạng Thẻ Lưới (Grid)"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Lưới</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTopicsViewMode('list')}
                  className={`p-2 rounded-lg transition text-xs font-bold flex items-center gap-1.5 ${
                    topicsViewMode === 'list'
                      ? 'bg-slate-800 text-gold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Chế độ xem dạng Danh Sách (List)"
                >
                  <LayoutList className="w-4 h-4" />
                  <span className="hidden sm:inline">Danh sách</span>
                </button>
              </div>

              <button
                onClick={handleOpenNewTopic}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-sm active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm Chủ Đề Mới</span>
              </button>
            </div>
          </div>

          {/* Alert banners for saving state */}
          {reorderingTopics && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-gold" />
              <span>Đang lưu và đồng bộ thứ tự chủ đề mới lên máy chủ...</span>
            </div>
          )}

          {reorderSuccessMsg && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{reorderSuccessMsg}</span>
            </div>
          )}

          {/* Reorder Guidance & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="Tìm chủ đề theo tên hoặc nội dung..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {topicSearch && (
                <button
                  type="button"
                  onClick={() => setTopicSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800/80 shrink-0">
              <GripVertical className="w-3.5 h-3.5 text-gold" />
              <span>
                {topicSearch.trim() ? (
                  <span className="text-amber-400 font-semibold">⚠️ Xóa tìm kiếm để kéo thả sắp xếp</span>
                ) : (
                  <span>Kéo tay cầm <strong className="text-white">⠿</strong> hoặc bấm <strong className="text-white">↑ ↓</strong> để đổi vị trí</span>
                )}
              </span>
            </div>
          </div>

          {/* Topics Grid or List */}
          {filteredTopics.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-semibold">Không tìm thấy chủ đề nào phù hợp</p>
              {topicSearch && (
                <button
                  onClick={() => setTopicSearch('')}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold transition"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              )}
            </div>
          ) : topicsViewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTopics.map((topic, index) => {
                const count = resources.filter((r) => r.topic_id === topic.id).length;
                const canReorder = !topicSearch.trim();
                const isDragging = draggedTopicIndex === index;
                const isDragOver = dragOverTopicIndex === index;

                return (
                  <div
                    key={topic.id}
                    draggable={canReorder}
                    onDragStart={(e) => handleDragStartTopic(e, index)}
                    onDragEnter={(e) => handleDragEnterTopic(e, index)}
                    onDragOver={handleDragOverTopic}
                    onDrop={(e) => handleDropTopic(e, index)}
                    onDragEnd={handleDragEndTopic}
                    className={`bg-slate-900/90 rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-sm ${
                      isDragging
                        ? 'opacity-40 border-gold scale-95 ring-2 ring-gold/40'
                        : isDragOver
                        ? 'border-amber-400 ring-2 ring-amber-400/60 bg-amber-400/5 translate-y-[-2px]'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Drag Handle & Reorder Controls Topbar */}
                      <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-2 select-none">
                        <div
                          className={`flex items-center gap-1.5 ${
                            canReorder
                              ? 'cursor-grab active:cursor-grabbing text-gold hover:text-amber-300'
                              : 'text-slate-500 cursor-not-allowed'
                          } transition`}
                          title={canReorder ? 'Nhấn giữ và kéo thả để di chuyển vị trí' : 'Xóa tìm kiếm để kích hoạt kéo thả'}
                        >
                          <GripVertical className="w-4 h-4 text-gold shrink-0" />
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                            Vị trí #{index + 1}
                          </span>
                        </div>

                        {/* Step Movement Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveTopicStep(index, -1);
                            }}
                            disabled={!canReorder || index === 0}
                            className="p-1 rounded-lg bg-slate-800/90 hover:bg-gold/20 text-slate-300 hover:text-gold disabled:opacity-25 disabled:cursor-not-allowed transition"
                            title="Di chuyển lên trên"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveTopicStep(index, 1);
                            }}
                            disabled={!canReorder || index === filteredTopics.length - 1}
                            className="p-1 rounded-lg bg-slate-800/90 hover:bg-gold/20 text-slate-300 hover:text-gold disabled:opacity-25 disabled:cursor-not-allowed transition"
                            title="Di chuyển xuống dưới"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Topic Cover Image */}
                      <div className="relative h-40 bg-slate-950 overflow-hidden">
                        <img
                          src={topic.img || 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80'}
                          alt={topic.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-gold text-xs font-black px-2.5 py-1 rounded-lg border border-gold/30 shadow-sm flex items-center gap-1.5">
                          <Compass className="w-3 h-3 text-gold" />
                          <span>Chủ đề #{index + 1}</span>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 shadow-sm">
                          <BookOpen className="w-3 h-3 text-gold" />
                          <span>{count} tư liệu</span>
                        </div>
                      </div>

                      {/* Topic Info */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-extrabold text-sm text-white group-hover:text-gold transition">
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {topic.description || 'Chưa có tóm tắt nội dung chủ đề.'}
                        </p>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-3.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-mono">ID: {topic.id}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditTopic(topic)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 hover:bg-gold text-amber-300 hover:text-slate-950 text-xs font-bold transition cursor-pointer"
                          title="Đổi tên & cấu hình trò chơi lật ô cho chủ đề này"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Cấu hình Game & Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic)}
                          className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition cursor-pointer"
                          title="Xóa chủ đề này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View Mode */
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="divide-y divide-slate-800/80">
                {filteredTopics.map((topic, index) => {
                  const count = resources.filter((r) => r.topic_id === topic.id).length;
                  const canReorder = !topicSearch.trim();
                  const isDragging = draggedTopicIndex === index;
                  const isDragOver = dragOverTopicIndex === index;

                  return (
                    <div
                      key={topic.id}
                      draggable={canReorder}
                      onDragStart={(e) => handleDragStartTopic(e, index)}
                      onDragEnter={(e) => handleDragEnterTopic(e, index)}
                      onDragOver={handleDragOverTopic}
                      onDrop={(e) => handleDropTopic(e, index)}
                      onDragEnd={handleDragEndTopic}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 group ${
                        isDragging
                          ? 'opacity-40 bg-gold/10'
                          : isDragOver
                          ? 'bg-amber-400/10 border-l-4 border-amber-400'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Drag Handle */}
                        <div
                          className={`p-1.5 rounded-lg ${
                            canReorder
                              ? 'cursor-grab active:cursor-grabbing text-gold hover:bg-gold/20'
                              : 'text-slate-600 cursor-not-allowed'
                          } transition shrink-0`}
                          title={canReorder ? 'Nhấn giữ và kéo thả để di chuyển thứ tự' : 'Xóa tìm kiếm để kích hoạt kéo thả'}
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Order Number Badge */}
                        <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-black text-xs text-amber-300 shrink-0">
                          #{index + 1}
                        </div>

                        {/* Up/Down buttons */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveTopicStep(index, -1)}
                            disabled={!canReorder || index === 0}
                            className="p-1 rounded bg-slate-950 hover:bg-gold/20 text-slate-400 hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition"
                            title="Lên trên 1 nấc"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveTopicStep(index, 1)}
                            disabled={!canReorder || index === filteredTopics.length - 1}
                            className="p-1 rounded bg-slate-950 hover:bg-gold/20 text-slate-400 hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition"
                            title="Xuống dưới 1 nấc"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Thumbnail */}
                        <div className="w-16 h-12 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                          <img
                            src={topic.img || 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80'}
                            alt={topic.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Title & Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-white group-hover:text-gold transition truncate">
                              {topic.title}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">ID: {topic.id}</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {topic.description || 'Chưa có tóm tắt nội dung chủ đề.'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Badges & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-gold text-xs font-bold border border-slate-800 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-gold" />
                          <span>{count} tư liệu</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditTopic(topic)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 hover:bg-gold text-amber-300 hover:text-slate-950 text-xs font-bold transition cursor-pointer"
                            title="Đổi tên & cấu hình trò chơi lật ô cho chủ đề này"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Cấu hình Game & Sửa</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic)}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition cursor-pointer"
                            title="Xóa chủ đề này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: CONTACTS & FEEDBACK MANAGEMENT ================= */}
      {activeTab === 'contacts' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                  Hộp Thư Tiếp Nhận
                </span>
                {unreadContactsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse">
                    {unreadContactsCount} tin nhắn mới
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-white">Hộp Thư Liên Hệ & Đóng Góp Ý Kiến</h3>
              <p className="text-xs text-slate-400 mt-1">
                Danh sách liên hệ, câu chuyện đóng góp và yêu cầu hỗ trợ gửi từ trang Liên hệ của Sử Ký Số.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Làm mới hộp thư</span>
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
              <button
                onClick={() => setContactStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  contactStatusFilter === 'all'
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả ({contactsList.length})
              </button>
              <button
                onClick={() => setContactStatusFilter('new')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                  contactStatusFilter === 'new'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800 shadow-sm'
                    : 'text-slate-400 hover:text-rose-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Chưa xử lý ({contactsList.filter((c) => c.status === 'new').length})</span>
              </button>
              <button
                onClick={() => setContactStatusFilter('replied')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 ${
                  contactStatusFilter === 'replied'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Đã phản hồi ({contactsList.filter((c) => c.status === 'replied').length})</span>
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Tìm theo họ tên, SĐT, email, nội dung..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Người gửi & Liên hệ</th>
                    <th className="py-3 px-4">Nội dung tin nhắn</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Ghi chú xử lý</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                        Không có tin nhắn liên hệ nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className={`hover:bg-slate-800/50 transition ${
                          contact.status === 'new' ? 'bg-amber-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          {contact.status === 'new' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-950/80 text-rose-300 border border-rose-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                              Chưa xử lý
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              Đã phản hồi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-white text-xs">{contact.full_name}</div>
                          <div className="text-[11px] text-amber-300 font-mono mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{contact.phone}</span>
                          </div>
                          {contact.email && (
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="line-clamp-2 text-slate-200 leading-relaxed">
                            {contact.content}
                          </p>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-400 font-mono">
                          {new Date(contact.created_at).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3 px-4 max-w-[180px]">
                          {contact.admin_note ? (
                            <span className="text-[11px] text-slate-300 line-clamp-1 italic bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 block">
                              📝 {contact.admin_note}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-600 italic">Chưa có ghi chú</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenContactDetail(contact)}
                              className="px-2.5 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-amber-300 hover:text-slate-950 text-xs font-bold transition flex items-center gap-1"
                              title="Xem chi tiết tin nhắn"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Chi tiết</span>
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateContactStatus(
                                  contact.id,
                                  contact.status === 'new' ? 'replied' : 'new'
                                )
                              }
                              className={`p-1.5 rounded-lg transition ${
                                contact.status === 'new'
                                  ? 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                              }`}
                              title={
                                contact.status === 'new'
                                  ? 'Đánh dấu đã phản hồi'
                                  : 'Đổi về chưa xử lý'
                              }
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition"
                              title="Xóa tin nhắn này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONTACT MESSAGE DETAIL & ADMIN ACTION ================= */}
      {viewingContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Chi Tiết Liên Hệ #{viewingContact.id}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Gửi lúc {new Date(viewingContact.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingContact(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Sender Details Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block font-bold mb-0.5">Họ và tên người gửi:</span>
                  <span className="font-black text-white text-sm">{viewingContact.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold mb-0.5">Trạng thái:</span>
                  {viewingContact.status === 'new' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-800">
                      Chưa xử lý
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Đã phản hồi
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block font-bold mb-0.5">Số điện thoại:</span>
                  <a
                    href={`tel:${viewingContact.phone}`}
                    className="font-bold text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{viewingContact.phone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold mb-0.5">Email liên hệ:</span>
                  {viewingContact.email ? (
                    <a
                      href={`mailto:${viewingContact.email}`}
                      className="font-bold text-blue-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{viewingContact.email}</span>
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">Không cung cấp</span>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Nội dung tin nhắn / câu chuyện gửi về:
                </label>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {viewingContact.content}
                </div>
              </div>

              {/* Admin Internal Note */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Ghi chú xử lý của Quản trị viên:
                  </label>
                  <span className="text-[11px] text-slate-500">Nội bộ (không gửi cho khách)</span>
                </div>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Ví dụ: Đã gọi điện trao đổi tư liệu Trống đồng; Giáo viên trường THPT Chu Văn An..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={savingNote}
                    onClick={() => handleSaveContactNote(viewingContact.id)}
                    className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 active:scale-95 disabled:opacity-50"
                  >
                    {savingNote ? 'Đang lưu...' : 'Lưu ghi chú'}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleDeleteContact(viewingContact.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold transition border border-rose-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa liên hệ</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateContactStatus(
                      viewingContact.id,
                      viewingContact.status === 'new' ? 'replied' : 'new',
                      adminNoteInput
                    )
                  }
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    viewingContact.status === 'new'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>
                    {viewingContact.status === 'new'
                      ? 'Đánh dấu Đã phản hồi'
                      : 'Đổi về Chưa xử lý'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingContact(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT USER (HỌ TÊN, ROLE & CHANGE PASSWORD) ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-100"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Chỉnh Sửa Tài Khoản #{editingUser.id}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cập nhật họ tên, vai trò và đặt lại mật khẩu cho tài khoản.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              {userMsg.text && (
                <div
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    userMsg.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                  }`}
                >
                  {userMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{userMsg.text}</span>
                </div>
              )}

              {/* Username (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Tên đăng nhập (Định danh tài khoản)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingUser.username}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 text-xs font-mono font-bold cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Họ và tên người dùng *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.full_name}
                  onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                  placeholder="Ví dụ: Thầy Nguyễn Văn An / Lê Minh Khôi"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Địa chỉ Email liên hệ
                </label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="email@sukyso.edu.vn"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Vai trò & Phân quyền (Role) *
                </label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
                >
                  <option value="admin">Quản trị viên (Toàn quyền quản trị hệ thống & biên soạn)</option>
                  <option value="teacher">Giáo viên (Khai thác tư liệu & nghiệp vụ sư phạm)</option>
                  <option value="student">Học sinh (Khám phá tư liệu & tham quan 3D)</option>
                </select>
              </div>

              {/* Change Password */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-gold" />
                    <span>Đổi mật khẩu mới (Change Password)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Tùy chọn</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Để trống nếu giữ nguyên mật khẩu cũ..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold shadow-sm placeholder:text-slate-500 placeholder:font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Nhập tối thiểu 6 ký tự nếu bạn muốn cấp lại mật khẩu mới cho tài khoản này.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={userSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition shadow-md active:scale-95 disabled:opacity-50"
                >
                  {userSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Lưu Thay Đổi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DEDICATED ADMIN INSPECTOR DRAWER / MODAL (VIEW KHÁC CLIENT) ================= */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
          >
            {/* Top Bar of Inspector */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-gold text-slate-950 font-black text-xs font-mono">
                  #{previewResource.id}
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-white truncate max-w-lg">
                    {previewResource.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Bảng kiểm tra tư liệu nội bộ Quản trị viên
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = previewResource;
                    setPreviewResource(null);
                    onEditResource(toEdit);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold hover:bg-gold-dark text-slate-950 text-xs font-black transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa toàn màn hình</span>
                </button>
                <button
                  onClick={() => setPreviewResource(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Media Switcher: Gallery vs Video 4K vs 3D */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewActiveTab('gallery')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      previewActiveTab === 'gallery'
                        ? 'bg-white text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Image className="w-3.5 h-3.5" />
                    <span>Bộ ảnh ({previewPhotos.length})</span>
                  </button>

                  {previewYoutubeUrl && (
                    <button
                      onClick={() => setPreviewActiveTab('video')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        previewActiveTab === 'video'
                          ? 'bg-rose-600 text-white font-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Video YouTube 4K</span>
                    </button>
                  )}

                  {previewResource.model_3d && (
                    <button
                      onClick={() => setPreviewActiveTab('3d')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        previewActiveTab === '3d'
                          ? 'bg-gold text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Mô hình 3D tương tác</span>
                    </button>
                  )}
                </div>

                {/* Display Frame */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                  {previewActiveTab === 'video' && previewYoutubeUrl ? (
                    <iframe
                      src={`${previewYoutubeUrl}?rel=0`}
                      title={previewResource.title}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  ) : previewActiveTab === '3d' && previewResource.model_3d ? (
                    <div className="w-full h-full">
                      <ThreeArtifactViewer
                        modelCode={previewResource.model_3d}
                        artifactInfo={{ name: previewResource.title }}
                        height="100%"
                        showControls={true}
                      />
                    </div>
                  ) : (
                    <img
                      src={previewPhotos[previewPhotoIdx] || previewResource.img}
                      alt={previewResource.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Thumbnail filmstrip */}
                {previewActiveTab === 'gallery' && previewPhotos.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {previewPhotos.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPreviewPhotoIdx(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                          previewPhotoIdx === idx ? 'border-gold scale-105' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dossier Meta Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Chủ đề</span>
                  <strong className="text-white">Chủ đề {previewResource.topic_id}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Niên đại</span>
                  <strong className="text-white">{previewResource.period || 'Chưa rõ'}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Địa danh</span>
                  <strong className="text-white">{previewResource.place}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Lượt xem</span>
                  <strong className="text-gold">{(previewResource.view_count || 1).toLocaleString()}</strong>
                </div>
              </div>

              {/* Description body */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Nội dung mô tả học thuật:
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {previewResource.description}
                </p>
              </div>

              {/* Pedagogical tip */}
              {previewResource.tip && (
                <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-900/50 space-y-1 text-xs">
                  <strong className="text-amber-400 block font-bold">💡 Gợi ý khai thác sư phạm:</strong>
                  <p className="text-amber-200/90 leading-relaxed">{previewResource.tip}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500 font-mono">
                Cơ quan lưu giữ: {previewResource.source || 'Bảo tàng & UNESCO'}
              </span>
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3D ARTIFACT EDITOR MODAL ================= */}
      <Artifact3DEditorModal
        artifact={editingArtifact3D}
        isOpen={isArtifactModalOpen}
        onClose={() => {
          setIsArtifactModalOpen(false);
          setEditingArtifact3D(null);
        }}
        onSave={handleSaveArtifact3D}
        authToken={authToken}
      />

      {/* ================= TEACHER GUIDE EDITOR MODAL ================= */}
      <TeacherGuideEditorModal
        material={editingTeacherMaterial}
        isOpen={isTeacherModalOpen}
        onClose={() => {
          setIsTeacherModalOpen(false);
          setEditingTeacherMaterial(null);
        }}
        onSave={handleSaveTeacherMaterial}
        defaultCategory={teacherCategoryFilter !== 'all' ? teacherCategoryFilter : 'cam_nang'}
      />

      {/* ================= QUIZ EDITOR MODAL ================= */}
      <QuizEditorModal
        quiz={editingQuiz}
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false);
          setEditingQuiz(null);
        }}
        onSave={handleSaveQuiz}
        defaultLesson={quizLessonFilter !== 'all' ? quizLessonFilter : ''}
        allResources={resources}
      />

      {/* ================= TOPIC EDITOR / RENAME MODAL ================= */}
      <TopicEditorModal
        topic={editingTopic}
        isOpen={isTopicModalOpen}
        onClose={() => {
          setIsTopicModalOpen(false);
          setEditingTopic(null);
        }}
        onSave={handleSaveTopic}
        authToken={authToken}
      />

      {/* ================= EXAM ASSIGNMENT MODAL (CREATE & EDIT) ================= */}
      <ExamAssignmentModal
        isOpen={isAssignmentModalOpen}
        assignment={editingAssignment}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSave={handleSaveAssignment}
        authToken={authToken}
      />

      {/* ================= SUBMISSIONS VIEWER MODAL ================= */}
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

      {/* ================= REVIEW STUDENT EXAM MODAL ================= */}
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
