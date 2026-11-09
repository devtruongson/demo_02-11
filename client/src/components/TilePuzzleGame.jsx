import React, { useState, useEffect } from 'react';
import {
  Sparkles, RotateCcw, CheckCircle2, XCircle, HelpCircle,
  Eye, Check, ChevronRight, Lock, Unlock, Play, Flame, X
} from 'lucide-react';

// Fallback high-quality curriculum-accurate questions for all 7 topics
const TOPIC_FALLBACK_QUIZZES = {
  1: [
    {
      id: 101,
      tile_number: 1,
      tile_label: '01',
      question: 'Nền văn minh phương Đông cổ đại hình thành sớm nhất gắn liền với lưu vực các dòng sông nào?',
      options: [
        'Sông Nin, Lưỡng Hà, Hoàng Hà, Trường Giang',
        'Sông Đa-nuýp, Von-ga, Rai-nơ',
        'Sông Mê Kông, Chao Phraya, Hồng',
        'Sông A-ma-dôn, Mi-xi-xi-pi'
      ],
      correct_index: 0,
      explanation: 'Chính xác! Các nền văn minh Ai Cập, Lưỡng Hà, Trung Hoa và Ấn Độ đều khởi nguồn bên các lưu vực sông lớn màu mỡ.'
    },
    {
      id: 102,
      tile_number: 2,
      tile_label: '02',
      question: 'Kim tự tháp Kê-ốp là kỳ quan kiến trúc vĩ đại của nền văn minh cổ đại nào?',
      options: ['Ai Cập cổ đại', 'Lưỡng Hà cổ đại', 'Hy Lạp cổ đại', 'Ấn Độ cổ đại'],
      correct_index: 0,
      explanation: 'Chính xác! Kim tự tháp Kê-ốp được xây dựng tại Giza, là lăng mộ khổng lồ của pharaon Ai Cập cổ đại.'
    },
    {
      id: 103,
      tile_number: 3,
      tile_label: '03',
      question: 'Chữ viết đầu tiên của cư dân Lưỡng Hà cổ đại khắc trên đất sét ướt được gọi là gì?',
      options: ['Chữ hình nêm (tiết hình)', 'Chữ tượng hình Ai Cập', 'Chữ La-tinh cổ', 'Chữ Phạn Sanskrit'],
      correct_index: 0,
      explanation: 'Chính xác! Người Sumer đã sáng tạo ra chữ hình nêm bằng cách dùng que sậy ấn vào phiến đất sét ướt rồi nung khô.'
    },
    {
      id: 104,
      tile_number: 4,
      tile_label: '04',
      question: 'Chế độ dân chủ chủ nô thời cổ đại phát triển đạt đến đỉnh cao tại thành bang nào của Hy Lạp?',
      options: ['A-ten (Athens)', 'Xpác-ta (Sparta)', 'Cô-ranh (Corinth)', 'Tê-bơ (Thebes)'],
      correct_index: 0,
      explanation: 'Chính xác! Thành bang A-ten là đỉnh cao của nền dân chủ cổ đại với quyền công dân và Đại hội nhân dân.'
    }
  ],
  2: [
    {
      id: 201,
      tile_number: 1,
      tile_label: '01',
      question: 'Sự ra đời của các thành thị trung đại ở Tây Âu thời phong kiến chủ yếu do nguyên nhân nào?',
      options: [
        'Sự phát triển mạnh mẽ của thủ công nghiệp và thương nghiệp',
        'Các cuộc viễn chinh của Thập tự quân',
        'Lãnh chúa phong kiến di dân lập ấp',
        'Giáo hội Thiên Chúa giáo ra chỉ dụ'
      ],
      correct_index: 0,
      explanation: 'Chính xác! Thủ công nghiệp tách rời nông nghiệp, thương nhân lập chợ buôn bán đã làm xuất hiện các thành thị tự do.'
    },
    {
      id: 202,
      tile_number: 2,
      tile_label: '02',
      question: 'Phong trào Văn hóa Phục hưng thế kỷ XV - XVII khởi nguồn đầu tiên từ quốc gia nào?',
      options: ['I-ta-li-a (Ý)', 'Vương quốc Pháp', 'Nước Anh', 'Đức'],
      correct_index: 0,
      explanation: 'Chính xác! Nước Ý (Florence, Venice) là cái nôi rực rỡ khởi đầu phong trào Văn hóa Phục hưng với chủ nghĩa nhân văn.'
    },
    {
      id: 203,
      tile_number: 3,
      tile_label: '03',
      question: 'Kiệt tác bích họa "Bữa ăn tối cuối cùng" và bức họa Mona Lisa là tác phẩm của danh họa nào?',
      options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'],
      correct_index: 0,
      explanation: 'Chính xác! Leonardo da Vinci là thiên tài toàn năng tiêu biểu bậc nhất của thời kỳ Phục hưng.'
    },
    {
      id: 204,
      tile_number: 4,
      tile_label: '04',
      question: 'Sự kiện mang tính đột phá nào vào cuối thế kỷ XV đã kết nối trực tiếp các châu lục?',
      options: [
        'Các cuộc phát kiến địa lý lớn (Colombo, Magellan...)',
        'Phong trào Cải cách tôn giáo',
        'Sự ra đời của máy in ấn Gutenberg',
        'Chiến tranh Ba mươi năm ở châu Âu'
      ],
      correct_index: 0,
      explanation: 'Chính xác! Các cuộc phát kiến địa lý đã mở ra các tuyến hải trình giao thương xuyên đại dương đầu tiên trên thế giới.'
    }
  ],
  3: [
    {
      id: 301,
      tile_number: 1,
      tile_label: '01',
      question: 'Nền văn minh Ấn Độ cổ đại được khai sinh bên lưu vực hai con sông vĩ đại nào?',
      options: ['Sông Ấn và sông Hằng', 'Sông Hoàng Hà và Trường Giang', 'Sông Ơ-phrát và Ti-grơ', 'Sông Mê Kông và Chao Phraya'],
      correct_index: 0,
      explanation: 'Chính xác! Nền văn minh sông Ấn (Harappa - Mohenjo Daro) và sông Hằng là hai chiếc nôi của Ấn Độ cổ đại.'
    },
    {
      id: 302,
      tile_number: 2,
      tile_label: '02',
      question: 'Hai tôn giáo lớn của nhân loại có nguồn gốc khởi phát từ đất nước Ấn Độ cổ đại là:',
      options: ['Phật giáo và Ấn Độ giáo (Bà La Môn)', 'Hồi giáo và Thiên Chúa giáo', 'Đạo giáo và Nho giáo', 'Ki-tô giáo và Do Thái giáo'],
      correct_index: 0,
      explanation: 'Chính xác! Cả đạo Phật (Thích Ca Mâu Ni) và đạo Hindu (Ấn Độ giáo) đều ra đời tại Ấn Độ cổ đại.'
    },
    {
      id: 303,
      tile_number: 3,
      tile_label: '03',
      question: 'Hệ tư tưởng triết học giữ vị trí độc tôn và là trụ cột văn hóa suốt thời phong kiến Trung Hoa là:',
      options: ['Nho giáo (Khổng Tử sáng lập)', 'Đạo giáo (Lão Tử)', 'Pháp gia (Hàn Phi Tử)', 'Mặc gia (Mặc Tử)'],
      correct_index: 0,
      explanation: 'Chính xác! Nho giáo từ thời Hán Vũ Đế đã trở thành hệ tư tưởng chính thống của chế độ phong kiến phương Đông.'
    },
    {
      id: 304,
      tile_number: 4,
      tile_label: '04',
      question: 'Bốn phát minh kỹ thuật vĩ đại ("Tứ đại phát minh") của nền văn minh Trung Hoa cổ - trung đại là:',
      options: ['Kỹ thuật làm giấy, nghề in, la bàn, thuốc súng', 'Bánh xe, đồ đồng, lụa tơ tằm, cày sắt', 'Máy hơi nước, điện tín, giấy, thủy tinh', 'Đồng hồ nước, lịch pháp, thiên văn, gốm sứ'],
      correct_index: 0,
      explanation: 'Chính xác! Tứ đại phát minh gồm Giấy, In, La bàn và Thuốc súng đã làm thay đổi tiến trình lịch sử nhân loại.'
    }
  ],
  4: [
    {
      id: 401,
      tile_number: 1,
      tile_label: '01',
      question: 'Nền văn hóa đồ đồng rực rỡ đỉnh cao mở đầu cho thời đại dựng nước Văn Lang - Âu Lạc tại Việt Nam là:',
      options: ['Văn hóa Đông Sơn (Trống đồng Ngọc Lũ)', 'Văn hóa Sa Huỳnh', 'Văn hóa Óc Eo', 'Văn hóa Hòa Bình'],
      correct_index: 0,
      explanation: 'Chính xác! Văn hóa Đông Sơn (TK VII TCN) là nền tảng văn hóa - vật chất tạo nên nhà nước đầu tiên của người Việt cổ.'
    },
    {
      id: 402,
      tile_number: 2,
      tile_label: '02',
      question: 'Quần thể đền tháp Phật giáo lớn nhất thế giới được xây dựng vào thế kỷ VIII - IX tại Indonesia là:',
      options: ['Đền Borobudur (Trung Java)', 'Đền Angkor Wat', 'Quần thể tháp Bánh Ít', 'Chùa Shwedagon'],
      correct_index: 0,
      explanation: 'Chính xác! Borobudur là kiệt tác kiến trúc Phật giáo Đại thừa gồm 9 tầng nền kỳ vĩ trên đảo Java, Indonesia.'
    },
    {
      id: 403,
      tile_number: 3,
      tile_label: '03',
      question: 'Loại cây lương thực chủ đạo tạo nên nền tảng kinh tế và lối sống định cư của cư dân Đông Nam Á là:',
      options: ['Lúa nước (Oryza sativa)', 'Lúa mì', 'Ngô lai', 'Lúa mạch'],
      correct_index: 0,
      explanation: 'Chính xác! Nền văn minh lúa nước là mẫu số chung của các cộng đồng cư dân nông nghiệp Đông Nam Á.'
    },
    {
      id: 404,
      tile_number: 4,
      tile_label: '04',
      question: 'Quần thể kiến trúc đền tháp Chăm-pa nổi tiếng tại Quảng Nam được UNESCO công nhận là di sản văn hóa thế giới:',
      options: ['Thánh địa Mỹ Sơn', 'Tháp Po Klong Garai', 'Tháp Nhạn Tuy Hòa', 'Tháp Cánh Tiên'],
      correct_index: 0,
      explanation: 'Chính xác! Thánh địa Mỹ Sơn là trung tâm tôn giáo, tín ngưỡng Ấn Độ giáo thiêng liêng nhất của vương quốc Chăm-pa cổ.'
    }
  ],
  5: [
    {
      id: 501,
      tile_number: 1,
      tile_label: '01',
      question: 'Phát minh quan trọng nào có ý nghĩa quyết định mở đầu cho Cách mạng công nghiệp lần thứ nhất ở Anh?',
      options: ['Máy hơi nước của James Watt (1784)', 'Động cơ đốt trong', 'Bóng đèn điện của Edison', 'Máy kéo sợi Jenny'],
      correct_index: 0,
      explanation: 'Chính xác! Máy hơi nước của James Watt đã giải phóng sức lao động cơ bắp, mở ra kỷ nguyên cơ khí hóa sản xuất.'
    },
    {
      id: 502,
      tile_number: 2,
      tile_label: '02',
      question: 'Nguồn năng lượng chủ đạo thúc đẩy sản xuất bứt phá trong Cách mạng công nghiệp lần thứ hai (cuối TK XIX) là:',
      options: ['Điện năng và dầu mỏ', 'Than đá và than bùn', 'Năng lượng hạt nhân', 'Sức nước và gió'],
      correct_index: 0,
      explanation: 'Chính xác! Sự ra đời của máy phát điện và động cơ đốt trong chạy xăng/dầu đã định hình Cách mạng công nghiệp lần 2.'
    },
    {
      id: 503,
      tile_number: 3,
      tile_label: '03',
      question: 'Cuộc Cách mạng công nghiệp lần thứ ba (nửa sau thế kỷ XX) gắn liền với sự bùng nổ của thành tựu nào?',
      options: ['Máy tính điện tử, Internet và tự động hóa', 'Động cơ phản lực', 'Năng lượng sinh học', 'Công nghệ đóng tàu sắt'],
      correct_index: 0,
      explanation: 'Chính xác! Cuộc cách mạng khoa học - công nghệ lần 3 đã đưa nhân loại bước vào kỷ nguyên thông tin và số hóa.'
    },
    {
      id: 504,
      tile_number: 4,
      tile_label: '04',
      question: 'Cuộc Cách mạng công nghiệp lần thứ tư (Cách mạng 4.0) hiện nay phát triển dựa trên nền tảng cốt lõi nào?',
      options: ['Trí tuệ nhân tạo (AI), IoT và Dữ liệu lớn (Big Data)', 'Máy hơi nước và đường sắt', 'Hóa dầu và năng lượng nhiệt điện', 'Kỹ thuật cơ khí chính xác'],
      correct_index: 0,
      explanation: 'Chính xác! AI, vạn vật kết nối (IoT) và dữ liệu lớn là 3 trụ cột cốt lõi của làn sóng Cách mạng công nghiệp 4.0.'
    }
  ],
  6: [
    {
      id: 601,
      tile_number: 1,
      tile_label: '01',
      question: 'Tổ chức quốc tế lớn nhất hành tinh được thành lập vào năm 1945 nhằm duy trì hòa bình và an ninh thế giới là:',
      options: ['Liên Hợp Quốc (UN)', 'Hiệp hội các quốc gia Đông Nam Á (ASEAN)', 'Liên minh châu Âu (EU)', 'Tổ chức Thương mại Thế giới (WTO)'],
      correct_index: 0,
      explanation: 'Chính xác! Liên Hợp Quốc được thành lập vào tháng 10/1945 sau thảm họa Chiến tranh thế giới thứ hai.'
    },
    {
      id: 602,
      tile_number: 2,
      tile_label: '02',
      question: 'Xu thế khách quan nổi bật chi phối nền kinh tế toàn cầu từ những thập niên cuối thế kỷ XX đến nay là:',
      options: ['Toàn cầu hóa và hội nhập kinh tế quốc tế', 'Chiến tranh lạnh và đối đầu quân sự', 'Khủng hoảng năng lượng cục bộ', 'Đóng cửa nền kinh tế tự cấp tự túc'],
      correct_index: 0,
      explanation: 'Chính xác! Toàn cầu hóa là xu thế tất yếu gắn kết nền kinh tế, thị trường và thông tin của mọi quốc gia.'
    },
    {
      id: 603,
      tile_number: 3,
      tile_label: '03',
      question: 'Ngày Môi trường Thế giới (World Environment Day) hằng năm được Liên Hợp Quốc chọn vào ngày nào?',
      options: ['Ngày 5 tháng 6', 'Ngày 22 tháng 4', 'Ngày 8 tháng 3', 'Ngày 2 tháng 9'],
      correct_index: 0,
      explanation: 'Chính xác! Ngày 5 tháng 6 hằng năm là dịp toàn cầu nâng cao nhận thức bảo vệ hành tinh xanh của chúng ta.'
    },
    {
      id: 604,
      tile_number: 4,
      tile_label: '04',
      question: 'Sứ mệnh và nguyên tắc hoạt động cốt lõi của tổ chức UNESCO (Liên Hợp Quốc) là gì?',
      options: ['Xây dựng hòa bình thông qua hợp tác về Giáo dục, Khoa học và Văn hóa', 'Viện trợ tài chính và cho vay tín dụng ưu đãi', 'Kiểm soát hàng hải quốc tế', 'Quy định biểu thuế xuất nhập khẩu'],
      correct_index: 0,
      explanation: 'Chính xác! "Chiến tranh bắt đầu từ tâm trí con người, hòa bình cũng phải được xây dựng từ tâm trí con người" - Tuyên ngôn UNESCO.'
    }
  ],
  7: [
    {
      id: 701,
      tile_number: 1,
      tile_label: '01',
      question: 'Nền văn minh đầu tiên của dân tộc Việt Nam thời kỳ dựng nước mở đầu thời đại Hùng Vương là:',
      options: ['Văn minh Văn Lang - Âu Lạc', 'Văn minh Đại Việt thời Lý - Trần', 'Văn minh Chăm-pa', 'Văn minh Phù Nam'],
      correct_index: 0,
      explanation: 'Chính xác! Nền văn minh Văn Lang - Âu Lạc với truyền thuyết Hùng Vương dựng nước là cội nguồn của dân tộc Việt Nam.'
    },
    {
      id: 702,
      tile_number: 2,
      tile_label: '02',
      question: 'Chiến thắng lịch sử oanh liệt trên sông Bạch Đằng năm 938 của người anh hùng Ngô Quyền đã mang lại ý nghĩa gì?',
      options: [
        'Chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập tự chủ lâu dài',
        'Đánh bại hoàn toàn đế quốc Mông - Nguyên',
        'Thống nhất giang sơn đất nước thời Tây Sơn',
        'Khai sinh ra triều đại phong kiến nhà Lý'
      ],
      correct_index: 0,
      explanation: 'Chính xác! Chiến thắng Bạch Đằng năm 938 là mốc son chói lọi khép lại thời kỳ Bắc thuộc tăm tối.'
    },
    {
      id: 703,
      tile_number: 3,
      tile_label: '03',
      question: 'Tác phẩm được xem là bản Tuyên ngôn Độc lập thứ hai của dân tộc Việt Nam do Nguyễn Trãi soạn thảo năm 1428 là:',
      options: ['Bình Ngô đại cáo', 'Nam quốc sơn hà', 'Hịch tướng sĩ', 'Tuyên ngôn Độc lập (1945)'],
      correct_index: 0,
      explanation: 'Chính xác! "Bình Ngô đại cáo" là áng thiên cổ hùng văn khẳng định vững chắc nền văn hiến và chủ quyền quốc gia Đại Việt.'
    },
    {
      id: 704,
      tile_number: 4,
      tile_label: '04',
      question: 'Lời căn dặn thiêng liêng: "Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước" được Bác Hồ căn dặn tại đâu?',
      options: ['Đền Hùng (Phú Thọ) năm 1954', 'Chiến khu Việt Bắc năm 1947', 'Quảng trường Ba Đình năm 1945', 'Hang Pác Bó (Cao Bằng) năm 1941'],
      correct_index: 0,
      explanation: 'Chính xác! Ngày 19/9/1954 tại Đền Giếng (Khu di tích Đền Hùng), Bác Hồ đã nói lời dặn dò lịch sử này với Đại đoàn Quân Tiên phong.'
    }
  ]
};

const getTopicFallbackQuizzes = (tId) => {
  const num = Number(tId) || 1;
  return TOPIC_FALLBACK_QUIZZES[num] || TOPIC_FALLBACK_QUIZZES[1];
};

export default function TilePuzzleGame({
  topicId = null,
  topicTitle = '',
  topicImg = '',
  resourceId = null,
  resourceImg = '',
  resourceTitle = '',
  initialQuizzes = [],
  onClose = null
}) {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [unlockedTiles, setUnlockedTiles] = useState([false, false, false, false]);
  const [activeTileIndex, setActiveTileIndex] = useState(null); // 0, 1, 2, 3 or null
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerResult, setAnswerResult] = useState(null); // 'correct' | 'wrong' | null
  const [streakCount, setStreakCount] = useState(0);

  const targetId = topicId || resourceId;
  const targetImg = topicImg || resourceImg;
  const targetTitle = topicTitle || resourceTitle;
  const isTopicMode = !!topicId;

  // Load game quizzes for this topic or resource
  useEffect(() => {
    setLoading(true);
    setUnlockedTiles([false, false, false, false]);
    setActiveTileIndex(null);
    setSelectedOption(null);
    setAnswerResult(null);

    const fallbackQuizzes = getTopicFallbackQuizzes(topicId || 1);
    const fallbackImage = targetImg || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85';

    if (!targetId) {
      setGameData({
        title: targetTitle || 'Lịch Sử 10',
        game_image: fallbackImage,
        quizzes: fallbackQuizzes
      });
      setLoading(false);
      return;
    }

    const endpoint = isTopicMode
      ? `/api/topics/${topicId}/game-quizzes`
      : `/api/resources/${resourceId}/game-quizzes`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error('Không tải được câu hỏi trò chơi');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.quizzes) && data.quizzes.length >= 4) {
          setGameData(data);
        } else {
          // Use fallback questions if less than 4 in response
          setGameData({
            title: data?.title || targetTitle,
            game_image: data?.game_image || fallbackImage,
            quizzes: fallbackQuizzes
          });
        }
      })
      .catch((err) => {
        console.warn('Fallback to local quizzes for game:', err);
        setGameData({
          title: targetTitle || 'Lịch Sử 10',
          game_image: fallbackImage,
          quizzes: fallbackQuizzes
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [topicId, resourceId, targetId, targetImg, targetTitle, isTopicMode]);

  const quizzes = gameData?.quizzes || getTopicFallbackQuizzes(topicId || 1);
  const secretImage = gameData?.game_image || targetImg || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85';

  const totalTiles = 4;
  const openedCount = unlockedTiles.filter(Boolean).length;
  const isGameWon = openedCount === totalTiles;

  // Open question modal for a tile
  const handleTileClick = (index) => {
    if (unlockedTiles[index]) return; // already opened
    if (!quizzes[index]) return;

    setActiveTileIndex(index);
    setSelectedOption(null);
    setAnswerResult(null);
  };

  // Submit answer
  const handleSelectOption = (optIdx) => {
    if (answerResult === 'correct') return;

    setSelectedOption(optIdx);
    const activeQuiz = quizzes[activeTileIndex];
    if (!activeQuiz) return;

    if (optIdx === activeQuiz.correct_index) {
      setAnswerResult('correct');
      setStreakCount((prev) => prev + 1);

      // Play short delay then unlock tile
      setTimeout(() => {
        setUnlockedTiles((prev) => {
          const next = [...prev];
          next[activeTileIndex] = true;
          return next;
        });
        setActiveTileIndex(null);
        setSelectedOption(null);
        setAnswerResult(null);
      }, 1000);
    } else {
      setAnswerResult('wrong');
    }
  };

  // Restart game
  const handleResetGame = () => {
    setUnlockedTiles([false, false, false, false]);
    setActiveTileIndex(null);
    setSelectedOption(null);
    setAnswerResult(null);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-[#850B10] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Đang chuẩn bị trò chơi lật ô...</span>
        </div>
      </div>
    );
  }

  const activeQuiz = activeTileIndex !== null ? quizzes[activeTileIndex] : null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 relative">
      {/* Optional Close Button if rendered as modal */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer z-10"
          title="Đóng trò chơi"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#850B10] text-[#FFFDF8] shadow-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Trò Chơi Tương Tác Học Tập</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-royal uppercase tracking-tight">
          Lật Ô Chữ — Khám Phá Bức Tranh Bí Ẩn
        </h3>

        {targetTitle && (
          <p className="text-xs sm:text-sm font-bold text-[#850B10]">
            Chủ đề: {targetTitle}
          </p>
        )}

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Người chơi trả lời các câu hỏi mà ô chữ đặt ra nhằm tìm ra bức hình ẩn sau các ô chữ.
        </p>

        {/* Progress & Reset Bar */}
        <div className="pt-2 flex items-center justify-center gap-4 text-xs">
          <span
            className={`font-bold px-3.5 py-1.5 rounded-full border transition-all ${
              isGameWon
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isGameWon ? (
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã giải mã thành công toàn bộ bức tranh ({openedCount}/{totalTiles} ô)</span>
              </span>
            ) : (
              <span>
                Tiến độ: <strong className="text-[#EE6C52]">{openedCount}</strong> / {totalTiles} ô
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={handleResetGame}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="Chơi lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Chơi lại</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PUZZLE BOARD (2x2 Grid covering the Secret Image)             */}
      {/* ============================================================== */}
      <div className="relative mx-auto max-w-xl aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300/60 bg-slate-900 select-none">
        {/* Layer 1: The Secret Image Behind */}
        <img
          src={secretImage}
          alt="Bức tranh bí ẩn"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85';
          }}
        />

        {/* Layer 2: The 4 Quadrant Covering Tiles (2x2 Grid) */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-2 sm:p-3.5 gap-2 sm:gap-3.5 pointer-events-none">
          {quizzes.slice(0, 4).map((quiz, idx) => {
            const isUnlocked = unlockedTiles[idx];
            const tileLabel = `0${idx + 1}`;

            return (
              <div
                key={quiz.id || idx}
                onClick={() => handleTileClick(idx)}
                className={`relative rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-700 transform-gpu ${
                  isUnlocked
                    ? 'opacity-0 scale-90 pointer-events-none rotate-6'
                    : 'opacity-100 scale-100 pointer-events-auto cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95'
                }`}
                style={{
                  backgroundColor: '#EE6C52', // Exact coral-salmon tone
                  boxShadow: isUnlocked ? 'none' : '0 10px 25px -5px rgba(238, 108, 82, 0.4)'
                }}
              >
                {/* Tile Content */}
                {!isUnlocked && (
                  <div className="flex flex-col items-center justify-center text-center p-2 select-none group">
                    <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                      {tileLabel}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Nhấn để mở ô
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Celebration caption below board when all tiles are revealed */}
      {isGameWon && (
        <div className="text-center pt-2 animate-fade-in space-y-1">
          <p className="text-base sm:text-lg font-black text-[#850B10] font-serif-royal">
            🎉 Chúc mừng bạn đã mở khóa trọn vẹn bức tranh bí ẩn!
          </p>
          {targetTitle && (
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Chủ đề học tập: {targetTitle}
            </p>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* INTERACTIVE QUESTION MODAL (When clicking an unopened tile)     */}
      {/* ============================================================== */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-amber-200/80 space-y-5 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#EE6C52] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {`0${activeTileIndex + 1}`}
                </span>
                <div>
                  <h4 className="font-black text-base text-slate-900">
                    Câu hỏi mở ô chữ số 0{activeTileIndex + 1}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Chọn đáp án đúng để lật mở góc tranh bí ẩn
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTileIndex(null);
                  setSelectedOption(null);
                  setAnswerResult(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
              <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                {activeQuiz.question}
              </p>
            </div>

            {/* Multiple Choice Options (A, B, C, D) */}
            <div className="space-y-2.5">
              {activeQuiz.options?.map((option, optIdx) => {
                const label = ['A', 'B', 'C', 'D'][optIdx] || `${optIdx + 1}`;
                const isSelected = selectedOption === optIdx;
                const isCorrect = answerResult === 'correct' && isSelected;
                const isWrong = answerResult === 'wrong' && isSelected;

                let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-500/30';
                } else if (isWrong) {
                  btnStyle = 'bg-rose-50 text-rose-900 border-rose-500 ring-2 ring-rose-500/30 animate-shake';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={answerResult === 'correct'}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-center gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrong
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}>
                      {label}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {isWrong && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {answerResult === 'correct' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-bounce-short">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>🎉 Chính xác! Ô chữ số 0{activeTileIndex + 1} đang được lật mở...</span>
              </div>
            )}
            {answerResult === 'wrong' && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Rất tiếc chưa chính xác. Bạn hãy thử chọn đáp án khác nhé!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
