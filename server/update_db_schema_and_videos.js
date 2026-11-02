import mysql from 'mysql2/promise';

const dbConfig = {
  host: '103.200.23.80',
  port: 3306,
  user: 'tinkerai4016_db_test',
  password: 'FstackDev@1234',
  database: 'tinkerai4016_db_test_17'
};

const RICH_DATA_UPDATES = [
  {
    id: 31, // Taj Mahal
    video_url: 'https://www.youtube.com/embed/49HTYo4Pf70',
    description: `1. Bối cảnh lịch sử & Thiên tình sử bất diệt:
Lăng mộ Taj Mahal tọa lạc bên bờ nam dòng sông Yamuna linh thiêng tại thành phố Agra, bang Uttar Pradesh, Ấn Độ. Công trình được Hoàng đế Mughal thứ 5 – Shah Jahan khởi công xây dựng vào năm 1632 để tưởng nhớ người vợ yêu dấu của mình là Hoàng hậu Mumtaz Mahal sau khi bà qua đời vì sinh người con thứ 14. Được đại thi hào Rabindranath Tagore ngợi ca là "giọt nước mắt đọng trên gò má thời gian", Taj Mahal là biểu tượng đỉnh cao của tình yêu bất diệt và là di sản thế giới UNESCO biểu trưng cho nền văn minh Ấn Độ thời Mogul hưng thịnh.

2. Đỉnh cao kiến trúc & Nghệ thuật cẩn ngọc Pietra Dura:
Quần thể lăng mộ là sự kết tinh hoàn mỹ giữa nghệ thuật kiến trúc Hồi giáo, Ba Tư, Ottoman và văn hóa Ấn Độ cổ điển. Toàn bộ lăng mộ chính được xây bằng đá cẩm thạch trắng Makrana tinh khiết khai thác từ vùng Rajasthan – loại đá quý có đặc tính đổi màu kỳ diệu theo ánh sáng: ửng hồng lúc rạng đông, trắng muốt rực rỡ dưới nắng trưa và tỏa ánh bạc lung linh huyền ảo dưới ánh trăng rằm.
Điểm nhấn tinh xảo bậc nhất là kỹ thuật khảm đá quý "Pietra Dura" (Parchin Kari): hàng vạn họa tiết hoa dây leo Ả Rập và các câu kinh Qur'an được ghép thủ công tinh xảo từ hơn 28 loại đá quý và bán quý như ngọc lưu ly Lapis Lazuli, ngọc bích Jade, ngọc mắt mèo, san hô đỏ và thạch anh. Toàn bộ cấu trúc đạt đến tỷ lệ đối xứng trục tuyệt đối (axial symmetry), với 4 ngọn tháp minaret cao 40m hơi nghiêng nhẹ ra ngoài 2 độ để phòng ngừa đổ sập vào lăng chính khi có động đất.

3. Vườn địa đàng Charbagh & Hồ gương phản chiếu:
Phía trước lăng mộ là khu vườn Charbagh theo phong cách Ba Tư, được chia thành 4 phần tượng trưng cho bốn dòng sông thiên đường trong kinh thánh. Hồ nước cẩm thạch trung tâm (Hauz-i-Kawsar) phẳng lặng như tấm gương khổng lồ phản chiếu trọn vẹn bóng tháp Taj Mahal uy nghi giữa trời xanh, tạo nên một phối cảnh thần tiên làm say đắm hàng triệu du khách và các nhà nghiên cứu trên toàn cầu.

4. Giá trị văn hóa & Khai thác sư phạm:
Taj Mahal không chỉ là báu vật quốc gia của Ấn Độ mà còn là học liệu trực quan sống động giúp học sinh hiểu sâu sắc về sự thịnh vượng kinh tế, giao thương quốc tế và kỹ nghệ thủ công bậc thầy của đế chế Mogul thế kỷ XVII. Phân tích Taj Mahal giúp người học nhận thức rõ nét sự giao thoa văn hóa giữa Hồi giáo Tây Á và bản sắc bản địa Nam Á, cũng như tư duy toán học và hình học không gian đỉnh cao thời tiền hiện đại.`,
    tip: 'Hướng dẫn học sinh phân tích tính đối xứng trục tuyệt đối, nghệ thuật cẩn ngọc Pietra Dura và nguyên lý xây dựng 4 ngọn tháp nghiêng nhằm bảo vệ lăng mộ chính trước động đất.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585506942812-e72b29cef752?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 16, // Angkor Wat
    video_url: 'https://www.youtube.com/embed/1vR_s4qZ6W8',
    description: `1. Bối cảnh lịch sử & Kinh đô Đế chế Khmer:
Quần thể Angkor Wat được xây dựng vào đầu thế kỷ XII dưới triều vua Suryavarman II tại kinh đô Yasodharapura (Siem Reap, Campuchia ngày nay). Ban đầu được xây dựng làm đền thờ quốc gia của Ấn Độ giáo tôn thờ thần Vishnu, sau đó dần chuyển thành trung tâm Phật giáo Nguyên thủy vào cuối thế kỷ XII. Đây là di tích tôn giáo lớn nhất thế giới xét theo diện tích (hơn 162 hecta), biểu tượng thiêng liêng xuất hiện trên quốc kỳ Campuchia.

2. Quy mô kiến trúc Đền - Núi và Tỷ lệ vũ trụ học:
Angkor Wat là đỉnh cao tuyệt mỹ của phong cách kiến trúc Khmer cổ điển. Ngôi đền được thiết kế mô phỏng núi Meru – trung tâm của vũ trụ trong thần thoại Hindu giáo, bao quanh bởi hào nước rộng lớn tượng trưng cho đại dương vũ trụ. Tháp trung tâm cao 65m vươn thẳng lên trời, kết nối với bốn tháp nhỏ ở các góc tạo thành thế ngũ tháp linh thiêng.
Toàn bộ công trình được ghép từ hàng triệu khối đá sa thạch nặng từ 1,5 đến 5 tấn mà không hề dùng vữa kết dính, liên kết bằng mộng đá và trọng lực tự thân với độ chính xác đến từng milimét.

3. Kỳ quan phù điêu Bas-relief dài hàng cây số:
Điểm đặc sắc làm kinh ngạc thế giới là dãy hành lang phù điêu chạm khắc dài hơn 800m mô tả các thiên sử thi vĩ đại Ramayana, Mahabharata và cảnh "Khuấy biển sữa tìm nước trường sinh" (Churning of the Ocean of Milk). Hơn 3.000 pho tượng tiên nữ Apsara được khắc nổi trên tường đá với từng nét mặt, kiểu tóc và trang sức hoàn toàn khác biệt, phản ánh sinh động đỉnh cao điêu khắc đá thời bấy giờ.

4. Ý nghĩa học thuật & Khai thác sư phạm:
Là minh chứng hùng hồn cho năng lực trị thủy phi thường của người Khmer với hệ thống kênh đào và hồ chứa nước Baray khổng lồ, bảo đảm nguồn lương thực nuôi sống hàng triệu thần dân. Qua Angkor Wat, học sinh nắm bắt được quá trình tiếp biến văn hóa Ấn Độ và sự thăng trầm của một trong những nền văn minh rực rỡ nhất Đông Nam Á.`,
    tip: 'Tổ chức cho học sinh thảo luận về nghệ thuật trị thủy (hồ Baray) và giải thích tại sao Angkor Wat lại hướng về phía Tây thay vì phía Đông như các đền đài Hindu giáo truyền thống.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 19, // Trống đồng Ngọc Lũ
    video_url: 'https://www.youtube.com/embed/Q4X-3Rz13f8',
    description: `1. Phát hiện khảo cổ & Vị thế Bảo vật Quốc gia số 1:
Trống đồng Ngọc Lũ được tình cờ phát hiện vào khoảng năm 1893 tại bãi cát ven sông Hồng thuộc xã Như Trác, huyện Lý Nhân, tỉnh Hà Nam, sau đó được đưa về cúng tiến vào đình làng Ngọc Lũ (huyện Bình Lục). Trống có niên đại khoảng thế kỷ III – II trước Công nguyên, thuộc giai đoạn đỉnh cao rực rỡ của nền Văn hóa Đông Sơn thời kỳ dựng nước Văn Lang – Âu Lạc. Trống được công nhận là Bảo vật Quốc gia đợt 1 và hiện được lưu giữ trang trọng tại Bảo tàng Lịch sử Quốc gia (Hà Nội).

2. Cấu trúc hoàn mỹ & Nghệ thuật đúc đồng tinh xảo bậc nhất:
Trống có trọng lượng 86kg, đường kính mặt 86cm, chiều cao 63cm, được đúc nguyên khối bằng đồng thau với kỹ thuật khuôn ba phần tinh xảo vượt bậc. Cấu tạo trống gồm 3 phần cân đối: tang phình hình nón cụt, thân hình trụ tròn và chân xòe hình phễu vững chãi, hai bên tang gắn 4 quai kép bện thừng chắc chắn.
Hợp kim đồng Đông Sơn là sự kết hợp chuẩn xác giữa đồng, thiếc và chì theo tỷ lệ khoa học giúp đồng chảy loãng đều vào từng rãnh hoa văn siêu nhỏ trước khi đông kết, tạo nên âm thanh vang vọng trầm hùng khi đánh bằng dùi hoặc dùi gõ gỗ.

3. Giải mã hệ thống hoa văn & Thế giới quan người Việt cổ:
Tâm mặt trống là hình ngôi sao nổi 14 cánh biểu trưng cho Mặt trời – nguồn cội của sự sống trong tín ngưỡng sùng bái tự nhiên. Bao quanh ngôi sao là 16 vành hoa văn đồng tâm sống động:
- Cảnh con người giã gạo đôi, đánh cồng, gõ trống, múa hóa trang lông chim, cảnh nhà sàn mái cong hình thuyền và nhà mái tròn bồ thóc.
- Đoàn người chèo thuyền chiến mũi cong chở chiến binh cầm giáo mác, cung tên, rìu chiến, xung quanh có chim bói cá, rùa biển và cá sấu.
- Vành chim Lạc dang rộng cánh bay ngược chiều kim đồng hồ – biểu tượng thiêng liêng gắn liền với tâm thức và khát vọng vươn lên của dân tộc Việt Nam.

4. Giá trị lịch sử & Ý nghĩa giáo dục:
Trống đồng không chỉ là một nhạc khí thiêng dùng trong các nghi lễ nông nghiệp cầu mưa thuận gió hòa, mà còn là biểu tượng quyền lực tối cao của các Thủ lĩnh, Lạc tướng thời Hùng Vương. Phân tích trống đồng giúp học sinh tự hào về một nền văn minh bản địa phát triển rực rỡ, độc lập và có trình độ luyện kim cơ khí hàng đầu khu vực thời cổ đại.`,
    tip: 'Cho học sinh quan sát mô hình 3D xoay 360 độ để nhận diện chi tiết hình ảnh chim Lạc bay, cảnh giã gạo chày đôi và liên hệ với tín ngưỡng phồn thực trong văn hóa nông nghiệp lúa nước.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 30, // Kim tự tháp Giza
    video_url: 'https://www.youtube.com/embed/lotbZQ55brs',
    description: `1. Bối cảnh lịch sử & Vương triều Cổ đại Ai Cập:
Quần thể Kim tự tháp Giza nằm trên cao nguyên Giza ở ngoại ô thủ đô Cairo, Ai Cập. Được xây dựng vào khoảng thế kỷ 26 trước Công nguyên (thời kỳ Cổ Vương quốc) dưới triều đại pharaoh Khufu (Cheops), Khafre và Menkaure. Đại Kim tự tháp Khufu là kỳ quan cổ nhất và cũng là kỳ quan duy nhất trong số "Bảy kỳ quan thế giới cổ đại" còn tồn tại gần như nguyên vẹn cho đến ngày nay, trường tồn qua hơn 4.500 năm lịch sử.

2. Kỹ nghệ xây dựng vượt thời gian & Kỳ tích toán học:
Đại Kim tự tháp được cấu thành từ hơn 2,3 triệu khối đá vôi và đá granite khổng lồ, mỗi khối nặng trung bình từ 2,5 đến 15 tấn, được vận chuyển từ các mỏ đá Aswan cách xa hàng trăm dặm dọc theo dòng sông Nile. Chiều cao ban đầu của tháp đạt 146,6m (tương đương tòa nhà 45 tầng), giữ kỷ lục công trình nhân tạo cao nhất thế giới trong suốt hơn 3.800 năm.
Các mặt của kim tự tháp hướng chính xác về bốn phương la bàn (Đông, Tây, Nam, Bắc) với sai số chỉ dưới 0,05 độ – một kỳ tích định vị thiên văn làm sửng sốt các nhà khoa học hiện đại. Bên trong tháp là mạng lưới các đường hành lang dốc đứng dẫn vào Phòng Hoàng hậu và Phòng Nhà vua với cỗ quan tài đá sa thạch đỏ.

3. Tượng Nhân sư Sphinx & Tín ngưỡng linh thiêng:
Bên cạnh kim tự tháp Khafre là Đại tượng Nhân sư Great Sphinx – bức tượng đá nguyên khối lớn nhất thế giới tạc hình đầu người mình sư tử, cao 20m và dài 73m. Bức tượng tượng trưng cho trí tuệ minh triết của bậc đế vương kết hợp với sức mạnh thần thánh của chúa sơn lâm, trấn giữ cửa ngõ cao nguyên Giza vĩnh hằng.

4. Giá trị sư phạm & Khám phá khoa học:
Qua nghiên cứu Kim tự tháp Giza, học sinh hiểu sâu sắc về quyền lực tuyệt đối của các Pharaoh (Thần vương – Son of Ra), tín ngưỡng về linh hồn bất tử (Ka) và nghệ thuật ướp xác độc đáo, cùng trình độ toán học, hình học và thiên văn học xuất chúng của cư dân lưu vực sông Nile thời cổ đại.`,
    tip: 'Tổ chức chuyên đề thảo luận: "Làm thế nào người Ai Cập cổ đại vận chuyển và nâng các khối đá hàng chục tấn lên độ cao 140m mà không có cần cẩu hiện đại?".',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 25, // Borobudur
    video_url: 'https://www.youtube.com/embed/n4_w2q6jP0Y',
    description: `1. Bối cảnh lịch sử & Đỉnh cao Phật giáo Đại thừa:
Quần thể Đại đền tháp Borobudur tọa lạc tại thung lũng Kedu màu mỡ thuộc tỉnh Trung Java, Indonesia. Công trình được vương triều Sailendra hưng thịnh khởi công xây dựng vào khoảng thế kỷ thứ VIII và IX (năm 750 – 842 CN), trước cả khi Angkor Wat của Campuchia ra đời hơn ba thế kỷ. Đây là ngôi đền Phật giáo lớn nhất thế giới và là di sản thế giới UNESCO nổi bật nhất của Đông Nam Á hải đảo.

2. Kiến trúc Mandala ba chiều & Triết lý vũ trụ luận:
Borobudur được xây dựng hoàn toàn từ khoảng 2 triệu khối đá núi lửa màu xám (andesite) xếp chồng khít khao trên một ngọn đồi tự nhiên mà không cần bất kỳ chất kết dính nào. Toàn bộ ngôi đền là một mạn đà la (Mandala) khổng lồ mô phỏng ba cõi luân hồi trong giáo lý Phật giáo:
- Tầng chân đền (Kamadhatu – Dục giới): Cõi giới của ham muốn và trần tục, thể hiện qua 160 bức phù điêu về luật nhân quả luân hồi.
- 5 tầng thềm vuông (Rupadhatu – Sắc giới): Cõi giới của hình sắc đã thoát khỏi nhục cảm nhưng vẫn còn hình tướng, gồm hàng ngàn bức phù điêu tạc tích Phật Thích Ca mâu ni từ lúc giáng trần đến khi thành đạo.
- 3 tầng thềm tròn (Arupadhatu – Vô sắc giới): Cõi giới giải thoát vô tướng, gồm 72 tháp chuông rỗng đục lỗ mắt cáo chứa tượng Phật ngồi thiền bao quanh một Đại bảo tháp trung tâm cao 35m chạm tới bầu trời.

3. Di sản phù điêu đá đồ sộ bậc nhất nhân loại:
Borobudur sở hữu tổng cộng 2.672 tấm phù điêu đá tinh xảo và 504 pho tượng Phật tạc bằng đá nguyên khối. Nếu xếp các bức phù điêu nối tiếp nhau sẽ tạo thành một bảo tàng điêu khắc dài gần 4 cây số, ghi lại sống động không chỉ Phật pháp mà cả bức tranh đời sống xã hội, trang phục, nhạc cụ và kỹ thuật đóng tàu đi biển của cư dân Nam Đảo thế kỷ thứ IX.

4. Khai thác sư phạm & Ý nghĩa di sản:
Borobudur minh chứng cho sức lan tỏa mạnh mẽ của Phật giáo Đại thừa dọc theo con đường tơ lụa trên biển, cùng sự tiếp biến văn hóa sáng tạo của người dân bản địa Indonesia. Là nguồn tư liệu trực quan quý giá cho bài học về "Sự hình thành và phát triển của các quốc gia phong kiến Đông Nam Á".`,
    tip: 'Khuyến khích học sinh đối chiếu cấu trúc Mandala của Borobudur với phong cách đền-núi Angkor Wat để thấy được sự khác biệt giữa hai trung tâm văn minh lớn của Đông Nam Á cổ đại.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 2, // Lược đồ Phù Nam
    video_url: 'https://www.youtube.com/embed/Z0oYj0j4tL0',
    description: `1. Bối cảnh lịch sử & Đế chế thương mại hàng hải đầu tiên:
Vương quốc Phù Nam (thế kỷ I – VII Công nguyên) là nhà nước cổ xưa và hùng mạnh bậc nhất từng tồn tại ở hạ lưu sông Mê Kông (bao gồm vùng đất Nam Bộ Việt Nam và một phần Campuchia, Thái Lan ngày nay). Theo thư tịch cổ Trung Hoa (Tấn thư, Lương thư) và các chứng tích khảo cổ học, Phù Nam được sáng lập bởi sự kết hợp giữa đạo sĩ người Ấn Độ Hỗn Điền (Kaundinya) và nữ chúa bản địa Liễu Diệp (Soma).

2. Cảng thị quốc tế Óc Eo – Trục xoay Con đường Tơ lụa trên biển:
Trung tâm kinh tế sầm uất và nổi tiếng nhất của Phù Nam là đô thị cảng quốc tế Óc Eo (nay thuộc huyện Thoại Sơn, tỉnh An Giang). Nằm ở vị trí yết hầu trên hải trình nối liền Ấn Độ Dương và Thái Bình Dương, Óc Eo đã đón tiếp các đoàn thương thuyền từ La Mã, Ba Tư, Ả Rập, Ấn Độ và Trung Hoa ghé trao đổi tơ lụa, gia vị, hương liệu, kim hoàn và đá quý.
Các cuộc khai quật tại Óc Eo đã phát hiện đồng tiền vàng khắc hình Hoàng đế La Mã Antoninus Pius và Marcus Aurelius (thế kỷ II), gương đồng thời Hán, đồ trang sức bằng ngọc quý, nhẫn vàng khắc chữ Phạn và hình tượng thần bò Nandin.

3. Hệ thống kênh đào trị thủy & Nông nghiệp trù phú:
Người Phù Nam đã kiến tạo nên một mạng lưới thủy lợi kênh đào chằng chịt dài hàng trăm cây số xuyên suốt vùng Tứ giác Long Xuyên, vừa để thau chua rửa mặn trồng lúa nước, vừa đóng vai trò là đường giao thông thủy cho thuyền buồm cỡ lớn tiến sâu vào đất liền từ vịnh Thái Lan đến tận Biển Đông.

4. Khai thác sư phạm & Nhận thức lịch sử:
Lược đồ Phù Nam giúp học sinh nhận thức sâu sắc về chủ quyền lãnh thổ lâu đời tại vùng đất Nam Bộ, hiểu được tính chất mở của nền kinh tế thương mại hàng hải cổ đại và vị thế trung tâm kết nối văn minh nhân loại của Việt Nam từ thời cổ xưa.`,
    tip: 'So sánh lược đồ không gian vương quốc Phù Nam với ranh giới hành chính hiện đại để học sinh hiểu khái niệm lãnh thổ lịch sử và vai trò cửa ngõ kinh tế biển Nam Bộ.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 6, // Mỹ Sơn Linga Yoni
    video_url: 'https://www.youtube.com/embed/0P4QkK5s0Y4',
    description: `1. Bối cảnh lịch sử & Trung tâm thờ tự Hoàng gia Champa:
Thánh địa Mỹ Sơn (thuộc huyện Duy Xuyên, tỉnh Quảng Nam) là quần thể kiến trúc đền tháp Ấn Độ giáo thiêng liêng nhất của Vương quốc Champa cổ, được các triều vua Champa xây dựng liên tục từ thế kỷ IV đến thế kỷ XIII. Nằm ẩn mình trong một thung lũng kín đáo bao quanh bởi dãy núi Hòn Đền hùng vĩ, Mỹ Sơn là nơi dâng lễ tạ ơn thần Shiva và chôn cất các vị vua thánh cùng hoàng thân quốc thích.

2. Biểu tượng Linga – Yoni liền khối thế kỷ IX:
Đài thờ Linga – Yoni bằng sa thạch nguyên khối là kiệt tác điêu khắc tiêu biểu thuộc phong cách nghệ thuật Mỹ Sơn A1 – đỉnh cao của nghệ thuật điêu khắc Chăm Pa cổ điển. Linga tượng trưng cho dương tính, cho sức mạnh sáng tạo của thần Shiva; Yoni tượng trưng cho âm tính và mẹ đất màu mỡ. Sự hòa hợp giữa Linga và Yoni thể hiện triết lý phồn thực sâu sắc, cầu mong muôn loài sinh sôi nảy nở, mưa thuận gió hòa và đất nước thái bình thịnh trị.

3. Kỹ thuật xây tháp bằng gạch nung bí ẩn:
Các đền tháp Champa tại Mỹ Sơn được xây dựng bằng những viên gạch nung đỏ rực mài nhẵn, ghép khít khao đến mức không nhìn thấy đường mạch vữa. Các nhà nghiên cứu quốc tế đã phát hiện người Chăm sử dụng chất keo tự nhiên từ nhựa cây dầu rái (Dipterocarpus) kết hợp với kỹ thuật nung lại nguyên khối công trình sau khi xây, tạo nên độ bền vững thách thức mưa nắng rừng nhiệt đới suốt hơn 1.000 năm.

4. Ý nghĩa giáo dục & Bảo tồn di sản:
Mỹ Sơn được UNESCO vinh danh là Di sản Văn hóa Thế giới từ năm 1999. Qua hiện vật đài thờ và kiến trúc tháp Chàm, học sinh cảm nhận được chiều sâu văn hóa đa tộc người trong lịch sử Việt Nam và ý thức bảo tồn các công trình cổ trước tác động của chiến tranh và thiên tai.`,
    tip: 'Yêu cầu học sinh quan sát mô hình 3D xoay 360 độ của đài thờ để nhận diện rãnh thoát nước thiêng Soma-sutra trên Yoni hướng về phương Bắc.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 29, // Đền Parthenon
    video_url: 'https://www.youtube.com/embed/0X6ZqY4mKlo',
    description: `1. Bối cảnh lịch sử & Thời kỳ Hoàng kim của Athens:
Đền thờ Parthenon tọa lạc trên đỉnh đồi Acropolis ở thủ đô Athens, Hy Lạp. Công trình được khởi công vào năm 447 trước Công nguyên theo sáng kiến của nhà chính khách kiệt xuất Pericles, do hai kiến trúc sư đại tài Ictinus và Callicrates thiết kế dưới sự chỉ đạo nghệ thuật của nhà điêu khắc huyền thoại Phidias. Ngôi đền được dành riêng để tôn vinh nữ thần Athena Parthenos – vị thần bảo trợ cho trí tuệ, nghệ thuật và sự tự do của nền cộng hòa dân chủ Athens.

2. Tỷ lệ vàng (Phi) & Các ảo ảnh quang học kỳ diệu:
Parthenon được coi là đỉnh cao tuyệt đối của kiến trúc thức Doric cổ điển Hy Lạp. Điểm phi thường của công trình là các kiến trúc sư không sử dụng bất kỳ đường thẳng tuyệt đối nào, mà áp dụng các hiệu chỉnh quang học (Entasis) để đánh lừa thị giác người nhìn:
- Các cột trụ ở giữa hơi phình to ra một chút để tránh cảm giác bị teo nhỏ khi nhìn từ xa.
- Hàng cột bên ngoài nghiêng nhẹ vào trong với độ cong tinh tế, nếu kéo dài các cột lên không trung chúng sẽ gặp nhau tại một điểm cách mặt đất khoảng 2,4 km.
- Nền đền hơi uốn cong lồi ở giữa để nước mưa thoát nhanh và tạo cảm giác bằng phẳng hoàn mỹ dưới ánh sáng chói chang của vùng Địa Trung Hải.

3. Điêu khắc phù điêu và Tượng thần Athena bằng vàng và ngà voi:
Bên trong ngôi đền từng ngự trị pho tượng nữ thần Athena khổng lồ cao 12m bằng vàng và ngà voi do đích thân Phidias chế tác. Mặt ngoài đền được trang trí bởi dải băng phù điêu chạm nổi (Frieze) dài 160m mô tả lễ diễu hành Panathenaia vĩ đại của toàn thể công dân Athens.

4. Ý nghĩa nền tảng cho văn minh phương Tây:
Đền Parthenon là biểu tượng bất hủ cho lý tưởng dân chủ, khoa học, thẩm mỹ và tinh thần nhân bản của thời kỳ Cổ đại Hy Lạp, đặt nền móng cho nền kiến trúc Tân cổ điển trên khắp thế giới ngày nay.`,
    tip: 'Tổ chức cho học sinh làm bài tập đo đạc và tìm tỷ lệ vàng (1 : 1.618) trên mặt tiền của đền Parthenon để thấy sự hòa quyện giữa Toán học và Nghệ thuật kiến trúc.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 27, // Chùa Vàng Shwedagon
    video_url: 'https://www.youtube.com/embed/4b901a8sX5g',
    description: `1. Bối cảnh lịch sử & Ngôi chùa Phật giáo thiêng liêng nhất Myanmar:
Đại bảo tháp Shwedagon (còn gọi là Chùa Vàng) tọa lạc trên ngọn đồi Singuttara linh thiêng ở thành phố Yangon, Myanmar. Theo truyền thuyết Phật giáo Miến Điện, bảo tháp đã có lịch sử hơn 2.500 năm từ thời Đức Phật Thích Ca còn tại thế, khi hai anh em thương buôn Tapussa và Bhallika được Đức Phật ban tặng 8 sợi tóc thiêng để mang về tôn thờ trên đồi Singuttara.

2. Kỳ quan dát vàng & Đính hàng ngàn viên kim cương:
Tháp chính Shwedagon vươn cao tới 99m và được bao phủ hoàn toàn bởi hàng chục tấn vàng ròng do hoàng gia và các tín đồ cúng dường qua hàng thế kỷ. Trên đỉnh chóp tháp (hti) là một quả cầu búp sen nạm 4.531 viên kim cương lấp lánh (trong đó viên lớn nhất là kim cương 76 carat) cùng hàng ngàn viên hồng ngọc, lam ngọc và ngọc bích. Khi gió thổi, chuông vàng và chuông bạc treo quanh đỉnh tháp ngân vang tạo nên không gian thanh tịnh thoát tục.

3. Quần thể đền đài & Không gian thực hành tâm linh:
Bao quanh Đại bảo tháp trung tâm là hơn 64 tháp nhỏ và hàng trăm điện thờ các vị thần Nat cùng các góc hành hương tượng trưng cho các ngày sinh trong tuần theo thiên văn học Miến Điện. Hàng triệu du khách và Phật tử khắp nơi trên thế giới đến đây để chiêm bái, quét dọn sân chùa và dâng hoa đăng cầu nguyện.

4. Khai thác sư phạm:
Học sinh qua tư liệu Chùa Vàng Shwedagon hiểu được vị trí trung tâm của Phật giáo Nam truyền (Theravada) trong đời sống tâm linh, chính trị và xã hội của các quốc gia Đông Nam Á lục địa.`,
    tip: 'Hướng dẫn học sinh tìm hiểu phong tục tắm tượng Phật tương ứng với ngày sinh trong tuần của người dân Myanmar tại Chùa Vàng.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 15, // Bia đá Võ Cạnh
    video_url: 'https://www.youtube.com/embed/8P7t1h3bKlo',
    description: `1. Phát hiện khảo cổ & Bia ký chữ Phạn cổ nhất Đông Nam Á:
Bia đá Võ Cạnh được phát hiện vào năm 1885 tại làng Võ Cạnh, xã Vĩnh Trung, ngoại ô thành phố Nha Trang, tỉnh Khánh Hòa. Tấm bia có niên đại khoảng cuối thế kỷ thứ II đến thế kỷ thứ III Công nguyên. Đây là văn bia khắc bằng chữ Phạn (Sanskrit) cổ nhất từng được tìm thấy tại toàn bộ khu vực Đông Nam Á, được Thủ tướng Chính phủ công nhận là Bảo vật Quốc gia và hiện được lưu giữ tại Bảo tàng Lịch sử Quốc gia (Hà Nội).

2. Đặc điểm hiện vật & Nội dung văn khắc lịch sử:
Bia là một khối đá sa thạch tự nhiên hình trụ thuôn nhọn cao 2,7m, rộng khoảng 0,5m, khắc chữ trên 3 mặt. Văn khắc gồm 15 dòng chữ Phạn thể hiện lối chữ Brahmi cổ của Nam Ấn Độ. Nội dung văn bia ca ngợi công đức và lòng từ bi của vị vua thuộc vương triều Sri Mara (được các học giả đồng nhất với vua Khu Liên – người sáng lập nhà nước Lâm Ấp / Champa cổ đại vào năm 192 CN).
Văn bia khẳng định quyền thừa kế vương triều, việc dâng cúng tài sản công cho bá tính và thể hiện tinh thần khoan dung, chu cấp cho người nghèo khó theo giáo lý đạo Phật hoặc đạo Bà La Môn.

3. Tầm vóc lịch sử & Tiếp biến văn minh Ấn Độ:
Bia đá Võ Cạnh là bằng chứng vật chất đanh thép chứng minh quá trình truyền bá sớm của hệ chữ viết và tư tưởng triết học Ấn Độ vào lãnh thổ Việt Nam ngay từ những thế kỷ đầu Công nguyên. Tấm bia mở đầu cho truyền thống khắc bia tưởng niệm và ghi chép lịch sử của vương quốc Champa kéo dài suốt hơn một thiên niên kỷ sau đó.

4. Giá trị nghiên cứu & Khai thác sư phạm:
Giúp học sinh tiếp cận phương pháp sử liệu học: khai thác văn bia để đối chiếu với các nguồn sử liệu thành văn của Trung Hoa và Việt Nam, từ đó hình dung rõ nét về sự ra đời của nhà nước Lâm Ấp – Champa.`,
    tip: 'Cho học sinh xem chi tiết bản dập chữ Phạn trên bia đá và phân tích vì sao chữ viết lại là tiêu chí quan trọng để đánh giá một xã hội bước vào thời kỳ văn minh.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 18, // Đại tháp Thạt Luổng Lào
    video_url: 'https://www.youtube.com/embed/7V2w9L1w8rI',
    description: `1. Bối cảnh lịch sử & Biểu tượng quốc gia nước Lào:
Đại tháp Thạt Luổng (Pha That Luang) tọa lạc tại thủ đô Viêng Chăn, Lào. Tháp được xây dựng vào năm 1566 dưới triều vua Setthathirath khi ông dời đô từ Luang Prabang về Viêng Chăn. Thạt Luổng được coi là công trình kiến trúc Phật giáo vĩ đại nhất, biểu tượng thiêng liêng nhất của đất nước triệu voi và được vinh danh trên quốc huy cũng như tiền tệ của nước Cộng hòa Dân chủ Nhân dân Lào.

2. Nghệ thuật kiến trúc hoa sen & Ý nghĩa Phật giáo:
Tháp chính Thạt Luổng cao 45m, được dát một lớp vàng óng ánh rực rỡ dưới nắng nhiệt đới. Kiến trúc tháp là sự kết hợp hài hòa giữa hình tượng đóa sen nở ngát hương và búp hoa chuối đặc trưng của văn hóa Lào:
- Tầng chân đế là một đài sen vuông vức dài 69m mỗi cạnh, bao quanh bởi 30 tháp nhỏ tượng trưng cho 30 lời nguyện ba-la-mật của Đức Phật.
- Tầng thứ hai thu hẹp tượng trưng cho thế giới sắc giới, với các bức tường trổ cửa vòm thanh thoát.
- Tầng đỉnh tháp là ngọn tháp nhọn vươn cao tượng trưng cho cõi Niết bàn bất diệt.

3. Lễ hội Thạt Luổng & Đời sống văn hóa dân tộc Lào:
Hàng năm vào dịp rằm tháng 12 Phật lịch (khoảng tháng 11 dương lịch), lễ hội Thạt Luổng tưng bừng diễn ra suốt 7 ngày đêm với các nghi lễ rước Tháp sáp (Phasat Pheung), lễ đặt bát cúng dường hàng ngàn nhà sư và trò chơi bóng truyền thống Tikhy, thu hút đông đảo nhân dân và du khách quốc tế tham dự.

4. Khai thác sư phạm:
Qua hình tượng Thạt Luổng, học sinh hiểu sâu sắc về văn hóa Phật giáo tiểu thừa Theravada của các quốc gia láng giềng Đông Nam Á và tình đoàn kết gắn bó truyền thống lâu đời giữa nhân dân hai nước Việt – Lào.`,
    tip: 'Tổ chức cho học sinh so sánh kiến trúc tháp Phật giáo Thạt Luổng (Lào) với Chùa Vàng Shwedagon (Myanmar) và Tháp Bút Chùa Dâu (Việt Nam).',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80'
    ])
  },
  {
    id: 32, // Động cơ hơi nước James Watt
    video_url: 'https://www.youtube.com/embed/fs8g4_j5g3k',
    description: `1. Bối cảnh lịch sử & Khởi nguồn Cách mạng Công nghiệp:
Năm 1769 và hoàn thiện năm 1784, nhà phát minh người Scotland James Watt đã chế tạo thành công máy hơi nước ngưng tụ riêng biệt, cải tiến triệt để mẫu máy hơi nước thô sơ của Thomas Newcomen trước đó. Phát minh vĩ đại này đã kích hoạt cuộc Cách mạng Công nghiệp lần thứ nhất bùng nổ tại nước Anh và nhanh chóng lan rộng ra toàn thế giới, làm thay đổi vĩnh viễn diện mạo văn minh nhân loại.

2. Nguyên lý kỹ thuật & Cuộc cách mạng năng lượng:
Trước James Watt, con người phụ thuộc hoàn toàn vào sức cơ bắp của con người, sức kéo động vật, sức gió và sức nước – những nguồn năng lượng phụ thuộc chặt chẽ vào thời tiết và địa hình tự nhiên.
Máy hơi nước của James Watt hoạt động bằng cách đun sôi nước tạo áp suất hơi đẩy piston chuyển động tịnh tiến, sau đó được biến đổi thành chuyển động quay tròn nhờ cơ cấu bánh răng hành tinh. Buồng ngưng tụ tách rời giúp tiết kiệm đến 75% lượng than tiêu thụ, cho phép máy móc vận hành liên tục và ổn định ở bất kỳ địa điểm nào.

3. Tác động toàn diện đến kinh tế xã hội nhân loại:
- Giải phóng sức lao động con người, biến các xưởng thủ công phân tán thành những đại công xưởng, nhà máy cơ khí tập trung quy mô lớn.
- Khai sinh ngành giao thông vận tải hiện đại với tàu hỏa chạy bằng đầu máy hơi nước (George Stephenson) và tàu thủy chạy bằng hơi nước (Robert Fulton), rút ngắn khoảng cách địa lý toàn cầu.
- Thúc đẩy quá trình đô thị hóa nhanh chóng và hình thành hai giai cấp cơ bản của xã hội tư bản chủ nghĩa: giai cấp tư sản công nghiệp và giai cấp vô sản.

4. Khai thác sư phạm:
Học sinh phân tích tầm quan trọng của phát minh cơ khí đối với tiến trình lịch sử, liên hệ từ Cách mạng Công nghiệp 1.0 (máy hơi nước) đến Cách mạng Công nghiệp 4.0 (AI, IoT, chuyển đổi số) ngày nay.`,
    tip: 'Tổ chức cho học sinh làm bảng so sánh năng suất lao động giữa phường hội thủ công dệt vải truyền thống và nhà máy dệt chạy bằng máy hơi nước thế kỷ XVIII.',
    gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80'
    ])
  }
];

async function updateDb() {
  console.log('Connecting to remote MySQL DB 17...');
  const conn = await mysql.createConnection(dbConfig);
  console.log('Connected successfully!');

  // 1. Add video_url column if not exists
  const [cols] = await conn.query('DESCRIBE resources');
  const hasVideoUrl = cols.some(c => c.Field === 'video_url');
  if (!hasVideoUrl) {
    console.log('Adding video_url column to resources...');
    await conn.query('ALTER TABLE resources ADD COLUMN video_url VARCHAR(500) NULL AFTER gallery');
    console.log('Column video_url added!');
  } else {
    console.log('Column video_url already exists.');
  }

  // 2. Set default educational video_url for other resources so every item can have video embed
  console.log('Setting default YouTube embeds for other resources...');
  await conn.query(`
    UPDATE resources 
    SET video_url = 'https://www.youtube.com/embed/Z0oYj0j4tL0' 
    WHERE video_url IS NULL OR video_url = ''
  `);

  // 3. Update rich descriptions & curated videos for top resources
  console.log('Updating rich scholarly descriptions and curated YouTube URLs...');
  for (const item of RICH_DATA_UPDATES) {
    await conn.query(`
      UPDATE resources 
      SET 
        description = ?,
        video_url = ?,
        tip = ?,
        gallery = ?
      WHERE id = ?
    `, [item.description, item.video_url, item.tip, item.gallery, item.id]);
    console.log(`Updated resource #${item.id}`);
  }

  // Verify
  const [sample] = await conn.query('SELECT id, title, video_url, LENGTH(description) as dlen FROM resources WHERE id IN (31, 16, 19, 30, 25, 2, 29, 27, 32)');
  console.table(sample);

  await conn.end();
  console.log('Database upgrade completed successfully!');
}

updateDb().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
