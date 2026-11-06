import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Flame, Award, Users, Send, ThumbsUp, Sparkles,
  HelpCircle, BookOpen, Clock, AlertCircle, CheckCircle2, User, GraduationCap, Filter
} from 'lucide-react';

export default function CollaborativeStudySpace({
  currentUser,
  authToken,
  onOpenLogin,
  topics = []
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // Topics list dynamically synced with database
  const topicsList = topics && topics.length > 0
    ? [...topics.map(t => `Chủ đề ${t.order_index || t.id}: ${t.title}`), 'Thảo luận chung & Phương pháp ôn thi']
    : [
        'Chủ đề 1: Lịch sử và Sử học',
        'Chủ đề 2: Vai trò của Sử học',
        'Chủ đề 3: Một số nền văn minh thời cổ - trung đại',
        'Chủ đề 4: Các cuộc cách mạng công nghiệp',
        'Chủ đề 5: Văn minh Đông Nam Á thời cổ - trung đại',
        'Chủ đề 6: Một số nền văn minh trên đất nước Việt Nam',
        'Chủ đề 7: Cộng đồng các dân tộc Việt Nam',
        'Thảo luận chung & Phương pháp ôn thi'
      ];

  // Form State
  const [newMessage, setNewMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(() => topicsList[0] || 'Thảo luận chung & Phương pháp ôn thi');
  const [submitting, setSubmitting] = useState(false);
  const [filterTopic, setFilterTopic] = useState('all');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/study-space/messages?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Lỗi nạp tin nhắn không gian học tập:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const res = await fetch(`/api/students/streak-leaderboard?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Lỗi nạp bảng xếp hạng streak:', err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchLeaderboard();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenLogin?.();
      return;
    }
    if (!newMessage.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/study-space/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          topic_title: selectedTopic,
          message: newMessage.trim()
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi gửi tin nhắn');
      }

      const data = await res.json();
      setMessages((prev) => [data.message, ...prev]);
      setNewMessage('');
    } catch (err) {
      alert('Không thể đăng tin: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeMessage = async (id) => {
    try {
      const res = await fetch(`/api/study-space/messages/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, likes: data.likes } : m))
        );
      }
    } catch (err) {
      console.error('Lỗi thích tin:', err);
    }
  };

  const filteredMessages = filterTopic === 'all'
    ? messages
    : messages.filter((m) => m.topic_title === filterTopic);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy via-slate-900 to-navy text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-gold/20 text-gold border border-gold/40">
            <Users className="w-3.5 h-3.5 text-gold" />
            <span>Phòng Học Trực Tuyến & Tương Tác Đồng Đẳng</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Không Gian Học Tập Chung & Bảng Vàng Streak
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Nơi học sinh và thầy cô cùng trao đổi bài học, giải đáp câu hỏi khó môn Lịch Sử 10, chia sẻ mẹo ghi nhớ niên đại và duy trì chuỗi ngày đăng nhập học tập liên tục.
          </p>

          {/* Current User Streak Status */}
          {currentUser && (
            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-amber-200">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                <span>Chuỗi học tập của bạn: <strong>{currentUser.streak_count || 1} ngày</strong></span>
              </div>
              <span className="text-xs text-slate-400">
                • Vai trò: <strong className="text-white uppercase">{currentUser.role === 'teacher' ? 'Giáo viên' : currentUser.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Discussion Feed on Left (8 cols) & Streak Leaderboard on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Discussion & Questions Feed */}
        <div className="lg:col-span-8 space-y-5">
          {/* Post New Question Box */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-navy" />
                Đặt câu hỏi hoặc chia sẻ góc nhìn học tập
              </span>
              <span className="text-[11px] text-slate-400">
                {currentUser ? `Đang đăng bài: ${currentUser.full_name || currentUser.username}` : 'Đăng nhập để thảo luận'}
              </span>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy sm:w-64"
                >
                  {topicsList.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      currentUser
                        ? 'Nhập câu hỏi, phát hiện hay thắc mắc về chủ đề lịch sử...'
                        : 'Vui lòng đăng nhập để gửi câu hỏi thảo luận...'
                    }
                    disabled={!currentUser || submitting}
                    className="w-full pl-3.5 pr-24 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy disabled:bg-slate-100"
                  />
                  <button
                    type="submit"
                    disabled={!currentUser || submitting || !newMessage.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-navy hover:bg-navy-light text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-40 cursor-pointer active:scale-95"
                  >
                    <span>Gửi</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Topic Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Lọc theo:
            </span>
            <button
              onClick={() => setFilterTopic('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
                filterTopic === 'all'
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tất cả chủ đề ({messages.length})
            </button>
            {topicsList.slice(0, 5).map((t, idx) => (
              <button
                key={idx}
                onClick={() => setFilterTopic(t)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 truncate max-w-[200px] ${
                  filterTopic === t
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          {loading ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Đang tải thảo luận học tập...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Chưa có câu hỏi nào trong chủ đề này. Hãy là người đầu tiên đặt câu hỏi!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        msg.user_role === 'teacher'
                          ? 'bg-blue-600 text-white'
                          : msg.user_role === 'admin'
                          ? 'bg-amber-600 text-white'
                          : 'bg-navy text-white'
                      }`}>
                        {msg.user_role === 'teacher' ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900">{msg.user_name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            msg.user_role === 'teacher'
                              ? 'bg-blue-100 text-blue-800'
                              : msg.user_role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {msg.user_role === 'teacher' ? 'Giáo viên' : msg.user_role === 'admin' ? 'Admin' : 'Học sinh'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.created_at).toLocaleString('vi-VN', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 shrink-0 truncate max-w-[200px]">
                      {msg.topic_title}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal pl-1">
                    {msg.message}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <button
                      onClick={() => handleLikeMessage(msg.id)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-navy transition px-2.5 py-1 rounded-lg hover:bg-slate-100 font-semibold cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                      <span>Hữu ích ({msg.likes || 0})</span>
                    </button>
                    <span className="text-[11px] text-slate-400">Trao đổi học tập</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Streak Leaderboard (Bảng Vàng Chuỗi Học Tập) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    Bảng Vàng Chuỗi Streak
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Top học sinh chăm chỉ nhất</span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                Liên tục 🔥
              </span>
            </div>

            {loadingLeaderboard ? (
              <div className="text-center py-6 text-xs text-slate-400">Đang nạp bảng xếp hạng...</div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">Chưa có dữ liệu xếp hạng</div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((student, idx) => {
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;

                  return (
                    <div
                      key={student.id}
                      className={`p-2.5 rounded-2xl flex items-center justify-between gap-2.5 border transition ${
                        isTop1
                          ? 'bg-amber-50/70 border-amber-200'
                          : isTop2
                          ? 'bg-slate-50 border-slate-200'
                          : isTop3
                          ? 'bg-orange-50/50 border-orange-200'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Rank Badge */}
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[11px] shrink-0 ${
                          isTop1
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : isTop2
                            ? 'bg-slate-300 text-slate-800'
                            : isTop3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Student Name */}
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 truncate">
                            {student.full_name || student.username}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            @{student.username}
                          </span>
                        </div>
                      </div>

                      {/* Streak Flame Badge */}
                      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0">
                        <Flame className={`w-3.5 h-3.5 ${
                          isTop1 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-amber-500 fill-amber-500'
                        }`} />
                        <span className="font-black text-xs text-slate-900">
                          {student.streak_count || 1}d
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block mb-0.5">💡 Quy tắc tính chuỗi Streak:</strong>
              Mỗi ngày đăng nhập vào Sử Ký Số học bài hoặc làm đề trắc nghiệm sẽ tăng thêm 1 ngày chuỗi Streak. Nếu bỏ lỡ 1 ngày, chuỗi sẽ bắt đầu lại từ ngày 1!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

