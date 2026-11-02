import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink, Link } from 'react-router-dom';
import { Box, Sparkles, Compass, ShieldCheck, Layers, Info, CheckCircle2, Award, Edit3, PlusCircle } from 'lucide-react';
import ThreeArtifactViewer from './ThreeArtifactViewer.jsx';
import GlobeViewer3D from './GlobeViewer3D.jsx';
import Artifact3DEditorModal from './Artifact3DEditorModal.jsx';

export default function Studio3DView({
  artifacts3d = [],
  currentUser = null,
  authToken = null,
  onArtifacts3DChange = null,
  onExploreResource = null
}) {
  const { mode, artifactCode } = useParams();
  const navigate = useNavigate();

  // If on /studio-3d or /studio-3d/co-vat without artifactCode, redirect or default
  const isGlobeMode = mode === 'hai-trinh-bien';
  const selectedCode = artifactCode || 'dong_son_drum';

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorArtifact, setEditorArtifact] = useState(null);

  const isAdmin = currentUser?.role === 'admin';

  const currentArtifact = artifacts3d.find((a) => a.code === selectedCode) || artifacts3d[0];

  useEffect(() => {
    setAnswered(null);
    setActiveQuestion(0);
  }, [selectedCode]);

  const handleOpenEdit = (art) => {
    setEditorArtifact(art || currentArtifact);
    setIsEditorOpen(true);
  };

  const handleOpenNew = () => {
    setEditorArtifact(null);
    setIsEditorOpen(true);
  };

  const handleSaveArtifact = async (formData, id) => {
    const url = id ? `/api/3d-artifacts/${id}` : '/api/3d-artifacts';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken ? `Bearer ${authToken}` : ''
      },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi lưu bảo vật 3D');
    }
    if (onArtifacts3DChange) {
      await onArtifacts3DChange();
    }
    setIsEditorOpen(false);
    if (formData.code && formData.code !== selectedCode) {
      navigate(`/studio-3d/co-vat/${formData.code}`);
    }
  };

  // Pedagogical Observation Quizzes for 3D Artifacts
  const observationQuestions = {
    dong_son_drum: [
      {
        q: 'Quan sát mặt trên cùng của trống đồng: có bao nhiêu cánh của ngôi sao trung tâm?',
        options: ['12 cánh', '14 cánh', '16 cánh', '10 cánh'],
        correct: 1,
        explain: 'Mặt trống đồng Ngọc Lũ chuẩn mực đúc ngôi sao 14 cánh biểu trưng cho Mặt trời – nguồn năng lượng tối thượng của cư dân nông nghiệp lúa nước.'
      },
      {
        q: 'Quan sát vòng hoa văn chim Lạc: hướng bay của bầy chim là gì?',
        options: ['Bay thuận chiều kim đồng hồ', 'Bay ngược chiều kim đồng hồ', 'Bay tản ra ngoài', 'Bay hướng tâm'],
        correct: 1,
        explain: 'Bầy chim Lạc và các đoàn người múa hóa trang đều chuyển động ngược chiều kim đồng hồ – chiều vận hành của tự nhiên theo tư duy triết học phương Đông.'
      }
    ],
    borobudur_stupa: [
      {
        q: 'Cấu trúc 9 tầng của đền Borobudur được phân chia như thế nào?',
        options: ['6 tầng vuông bên dưới và 3 tầng tròn bên trên', '3 tầng vuông và 6 tầng tròn', '9 tầng vuông đều nhau', '9 tầng tròn đồng tâm'],
        correct: 0,
        explain: '6 tầng vuông tượng trưng cho cõi Dục giới (Kamadhatu) và cõi Sắc giới (Rupadhatu), còn 3 tầng tròn phía trên tượng trưng cho cõi Vô sắc giới (Arupadhatu) thanh tịnh.'
      }
    ],
    linga_yoni: [
      {
        q: 'Phần rãnh kéo dài vươn ra khỏi phiến đá Yoni có công dụng gì trong nghi lễ?',
        options: ['Để người hành hương bước lên', 'Là rãnh Somasutra dẫn nước thiêng sau khi tưới tắm Linga', 'Dùng để cắm cờ lễ hội', 'Khóa cố định đài thờ'],
        correct: 1,
        explain: 'Rãnh Somasutra hướng về phía Bắc là đường dẫn dòng nước thánh (sữa hoặc nước thơm) sau nghi thức tắm tượng Linga (Abhisheka) để tín đồ hứng lấy phước lành.'
      }
    ],
    vo_canh_stele: [
      {
        q: 'Bia đá Võ Cạnh được tạc trên chất liệu đá gì và có bao nhiêu mặt khắc chữ?',
        options: ['Đá cẩm thạch trắng 4 mặt', 'Đá sa thạch vàng 2 mặt', 'Đá bazan tự nhiên 3 mặt', 'Đá hoa cương 1 mặt'],
        correct: 2,
        explain: 'Bia được làm từ trụ đá bazan nguyên khối tự nhiên có 3 mặt mài phẳng khắc các dòng chữ Phạn Sanskrit cổ nhất Đông Nam Á.'
      }
    ],
    that_luang: [
      {
        q: 'Hình dáng phần thân chính tháp Thạt Luổng mô phỏng biểu tượng gì?',
        options: ['Búp măng tre', 'Quả nậm rượu hoặc đóa hoa sen úp', 'Chiếc bình gốm', 'Ngọn đuốc'],
        correct: 1,
        explain: 'Thân tháp thon thả hình nậm rượu đặc trưng uốn cong như cánh sen bao bọc xá lợi, biểu tượng của sự thuần khiết giải thoát.'
      }
    ]
  };

  const currentQuestions = observationQuestions[selectedCode] || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-slate-900 to-navy-dark text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-gold/20 text-gold border border-gold/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Studio Di Sản 3D Tương Tác
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bảo Tàng Cổ Vật & <span className="text-gold">Hải Trình Số 3D</span>
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Mô phỏng không gian 3D tương tác các bảo vật quốc gia và hải trình thương mại Đông Nam Á. Học sinh có thể xoay 360 độ, phóng to, đổi ánh sáng và thực hiện bài tập quan sát hiện vật.
          </p>
        </div>

        {/* Tab Switcher with Real Slugs */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
          <NavLink
            to={`/studio-3d/co-vat/${selectedCode}`}
            className={() =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                !isGlobeMode
                  ? 'bg-gold text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Box className="w-4 h-4" />
            <span>Studio Cổ Vật 3D</span>
          </NavLink>
          <NavLink
            to="/studio-3d/hai-trinh-bien"
            className={() =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isGlobeMode
                  ? 'bg-gold text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Compass className="w-4 h-4" />
            <span>Quả Cầu Hải Trình 3D</span>
          </NavLink>
        </div>
      </div>

      {/* Main Content View */}
      {isGlobeMode ? (
        <div className="space-y-6">
          <GlobeViewer3D height="560px" />
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm text-xs text-slate-600 leading-relaxed">
            <h4 className="font-bold text-sm text-slate-900 mb-2">
              💡 Hướng dẫn khai thác sư phạm bản đồ 3D:
            </h4>
            <p>
              Học sinh quan sát vị trí địa lý của Vương quốc Phù Nam (Cảng Óc Eo), Champa, Angkor và Srivijaya. 
              Các đường cong ánh sáng vàng thể hiện hải trình giao lưu hàng hải thương mại quốc tế giữa Ấn Độ Dương và Thái Bình Dương. 
              Thảo luận câu hỏi: <em>"Vì sao các vương quốc cổ Đông Nam Á sớm tiếp nhận các tôn giáo lớn (Ấn Độ giáo, Phật giáo, Hồi giáo)?"</em>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Artifact Selector List with Real NavLinks */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Danh mục bảo vật 3D ({artifacts3d.length})
              </span>
              {isAdmin && (
                <button
                  onClick={handleOpenNew}
                  className="flex items-center gap-1 text-[11px] font-bold text-navy hover:text-navy-light px-2.5 py-1 rounded-xl bg-navy/5 hover:bg-navy/10 transition border border-navy/15 shadow-2xs"
                  title="Thêm bảo vật 3D mới"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-navy" />
                  <span>Thêm mới</span>
                </button>
              )}
            </div>
            <div className="space-y-2.5">
              {artifacts3d.map((art) => {
                const isSelected = selectedCode === art.code;
                return (
                  <NavLink
                    key={art.code}
                    to={`/studio-3d/co-vat/${art.code}`}
                    className={`block p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? 'bg-white border-gold shadow-lg ring-2 ring-gold/30'
                        : 'bg-white/80 hover:bg-white border-slate-200/80 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-light">{art.culture}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {art.period}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                        {art.name}
                      </h4>
                      {art.embed && (
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          3D Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {art.description}
                    </p>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* 3D Viewport & Interactive Specs */}
          <div className="lg:col-span-8 space-y-6">
            {/* 3D Canvas */}
            <div className="h-[480px] lg:h-[520px] w-full relative">
              <ThreeArtifactViewer
                modelCode={currentArtifact?.embed || selectedCode}
                artifactInfo={currentArtifact}
                height="100%"
                showControls={true}
              />
            </div>

            {/* Artifact Historical Dossier & Observation Challenge */}
            {currentArtifact && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-gold/15 text-gold-dark border border-gold/30">
                        Bảo vật Quốc gia / Di sản Thế giới
                      </span>
                      <span className="text-xs text-slate-500 font-medium">• {currentArtifact.location}</span>
                      {currentArtifact?.embed ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Mã nhúng Sketchfab Live
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Mô hình WebGL tích hợp
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      {currentArtifact.name}
                    </h3>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleOpenEdit(currentArtifact)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm active:scale-95 shrink-0 border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gold" />
                      <span>Chỉnh sửa bảo vật này (Admin)</span>
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {currentArtifact.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-400 font-bold block mb-1">Chất liệu đúc/tạc:</span>
                    <strong className="text-slate-800">{currentArtifact.material}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-400 font-bold block mb-1">Kích thước khảo cổ:</span>
                    <strong className="text-slate-800">{currentArtifact.dimensions}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 font-bold block mb-1">Niên đại lịch sử:</span>
                    <strong className="text-slate-800">{currentArtifact.period}</strong>
                  </div>
                </div>

                {/* Significance */}
                <div className="p-4 rounded-2xl bg-navy-soft/60 border border-navy/10 text-xs leading-relaxed text-navy">
                  <strong className="font-extrabold text-navy-dark block mb-1">
                    💎 Giá trị biểu tượng & lịch sử:
                  </strong>
                  {currentArtifact.significance}
                </div>

                {/* Interactive Observation Challenge */}
                {currentQuestions.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-900 mb-3">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Thử thách quan sát cổ vật 3D (Dành cho học sinh):</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                      <p className="font-bold text-xs text-slate-800">
                        {currentQuestions[activeQuestion]?.q}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentQuestions[activeQuestion]?.options.map((opt, idx) => {
                          const isCorrect = idx === currentQuestions[activeQuestion].correct;
                          const isSelected = answered === idx;
                          let btnStyle = 'bg-white hover:bg-amber-100 text-slate-700 border-amber-200';
                          if (answered !== null) {
                            if (isCorrect) btnStyle = 'bg-emerald-500 text-white font-bold border-emerald-500';
                            else if (isSelected) btnStyle = 'bg-rose-500 text-white font-bold border-rose-500';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => setAnswered(idx)}
                              className={`p-2.5 rounded-xl text-xs text-left border transition ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {answered !== null && (
                        <div className="p-3 rounded-xl bg-white border border-amber-200 text-xs text-slate-700 animate-fade-in leading-relaxed">
                          <strong>💡 Lời giải đáp: </strong>
                          {currentQuestions[activeQuestion]?.explain}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin 3D Artifact Editor Modal */}
      <Artifact3DEditorModal
        artifact={editorArtifact}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveArtifact}
        authToken={authToken}
      />
    </div>
  );
}
