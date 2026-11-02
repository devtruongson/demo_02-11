import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

async function enrichDescriptions() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '103.200.23.80',
    user: process.env.DB_USER || 'tinkerai4016_db_test',
    password: process.env.DB_PASS || 'FstackDev@1234',
    database: process.env.DB_NAME || 'tinkerai4016_db_test_17',
    port: Number(process.env.DB_PORT) || 3306,
    charset: 'utf8mb4'
  });

  const detailedDescriptions = {
    'Taj Mahal': `1. Bối cảnh lịch sử & Hoàn cảnh khởi dựng:
Lăng mộ Taj Mahal tọa lạc bên bờ sông Yamuna thơ mộng tại thành phố Agra (Ấn Độ), được hoàng đế Shah Jahan của Đế chế Mogul xây dựng từ năm 1632 đến năm 1653 nhằm tưởng nhớ người vợ yêu quý – hoàng hậu Mumtaz Mahal sau khi bà qua đời. Công trình được đại thi hào Rabindranath Tagore ca ngợi là "giọt nước mắt đọng trên gò má của thời gian", biểu tượng bất diệt cho tình yêu son sắt và đỉnh cao mỹ thuật Hồi giáo Ấn Độ.

2. Quy mô kiến trúc & Tính đối xứng hoàn mỹ:
Toàn bộ lăng mộ được xây dựng trên một nền bệ đá hoa cương kiên cố, ốp hoàn toàn bằng đá cẩm thạch trắng Makrana (bang Rajasthan) có khả năng đổi màu kỳ diệu theo từng thời khắc: phớt hồng lúc rạng đông, trắng muốt rạng ngời lúc ban trưa và ánh vàng huyền ảo dưới ánh trăng rằm. Taj Mahal tuân thủ nghiêm ngặt nguyên lý đối xứng hoàn hảo dọc theo trục chính Bắc – Nam: từ cổng lớn tráng lệ (Darwaza), khu vườn Charbagh bốn phần đối xứng, đài phun nước trung tâm cho đến 4 ngọn tháp minaret cao 40m ở 4 góc (được thiết kế hơi nghiêng ra ngoài để bảo vệ gian phòng chính khi có động đất).

3. Kỹ thuật cẩn ngọc Pietra Dura bậc thầy & Ý nghĩa văn hóa:
Hơn 20.000 nghệ nhân từ Ba Tư, Thổ Nhĩ Kỳ và châu Âu đã cùng các thợ thủ công Ấn Độ chạm khắc và cẩn ghép hàng vạn viên ngọc bích, đá cẩm thạch màu, ngọc lưu ly và xà cừ tạo thành những dải hoa dây mềm mại và các đoạn thư pháp kinh Quran tinh tế. Taj Mahal được UNESCO công nhận là Di sản Thế giới năm 1983 và là một trong 7 kỳ quan thế giới hiện đại.`,

    'Angkor Wat': `1. Bối cảnh lịch sử & Hoàn cảnh khởi dựng:
Quần thể đền Angkor Wat được xây dựng vào nửa đầu thế kỷ XII dưới triều đại vua Suryavarman II – thời kỳ cường thịnh bậc nhất của Đế quốc Khmer. Ngôi đền được dành để thờ thần Vishnu (vị thần bảo hộ trong Ấn Độ giáo) và được thiết kế quay mặt về hướng Tây – hướng mặt trời lặn tượng trưng cho cõi vĩnh hằng và sự tái sinh của nhà vua.

2. Đỉnh cao kiến trúc đền núi (Temple-Mountain):
Công trình là sự kết hợp kỳ vĩ giữa bình đồ kiến trúc đền núi và hệ thống hành lang bao quanh đồng tâm. Năm ngọn tháp trung tâm hình búp sen vút cao mô phỏng năm đỉnh núi thiêng Meru – trung tâm của vũ trụ trong thần thoại Hindu giáo, trong đó đỉnh tháp chính cao tới 65m. Bao bọc xung quanh toàn bộ khu đền là một con hào nhân tạo khổng lồ dài 1,5km, rộng 190m, vừa có chức năng phân định ranh giới thiêng liêng, vừa là kỳ tích trị thủy giữ ổn định mực nước ngầm giúp nền cát không bị sụt lún dưới sức nặng hàng triệu tấn đá sa thạch.

3. Di sản phù điêu chạm khắc đá vô giá:
Bao quanh tầng 1 là dãy hành lang dài hàng cây số với hơn 1.200m² phù điêu chạm khắc sa thạch tinh vi, tái hiện sống động các thiên sử thi Mahabharata, Ramayana, cảnh khuấy Biển Sữa tìm thuốc trường sinh (Samudra Manthan) và đoàn chiến binh khải hoàn của vua Suryavarman II. Hơn 3.000 bức tượng tiên nữ Apsara với nụ cười bí ẩn và hàng trăm kiểu tóc, trang sức khác nhau đã biến Angkor Wat thành kiệt tác kiến trúc và mỹ thuật tôn giáo vĩ đại bậc nhất của nhân loại.`,

    'Borobudur': `1. Vị thế và nguồn gốc lịch sử:
Đại đền tháp Borobudur được khởi dựng từ khoảng cuối thế kỷ VIII đến đầu thế kỷ IX dưới triều đại hoàng kim của Vương triều Sailendra – những người sùng mộ Phật giáo Đại thừa trên đảo Java (Indonesia). Ẩn mình giữa vùng đồng bằng phì nhiêu Kedu và được bao quanh bởi các ngọn núi lửa uy nghiêm, Borobudur là công trình kiến trúc Phật giáo đơn lẻ có quy mô đồ sộ và lâu đời nhất thế giới.

2. Cấu trúc Mandala vũ trụ & 3 cõi giới Phật giáo:
Được xếp từ khoảng 2 triệu khối đá núi lửa andesit xám gọt đẽo khít khao mà không dùng vữa gắn, Borobudur được thiết kế như một kim tự tháp bậc thang 9 tầng mô phỏng cõi Mạn-đà-la (Mandala) vũ trụ:
- 6 tầng vuông bên dưới tượng trưng cho Dục giới (Kamadhatu) và Sắc giới (Rupadhatu) – nơi con người còn vướng bận trần tục và dục vọng.
- 3 tầng tròn đồng tâm phía trên cùng tượng trưng cho Vô sắc giới (Arupadhatu) – cảnh giới thanh tịnh của sự giải thoát tuyệt đối. Tại đây, 72 pho tượng Phật được an tọa trang nghiêm bên trong các bảo tháp đục lỗ mắt cáo hình quả chuông, hướng về bảo tháp trung tâm tối thượng cao 42m.

3. Thiên sử thi bằng đá chạm khắc:
Borobudur sở hữu hệ thống phù điêu lớn nhất thế giới với 2.672 bức chạm nổi công phu, trải dài tổng cộng hơn 4km. Toàn bộ cuộc đời Đức Thích Ca Mâu Ni từ khi đản sinh, xuất gia, đắc đạo đến các câu chuyện tiền kiếp trong kinh Bản sinh (Jataka) và kinh Bản sự (Avadana) được khắc họa chân thực, đưa người hành hương qua một lộ trình giáo hóa tâm linh từ phàm tục đến giác ngộ.`,

    'Trống đồng Ngọc Lũ': `1. Vị thế Bảo vật Quốc gia số 1:
Được phát hiện tại làng Ngọc Lũ (Bình Lục, Hà Nam) vào cuối thế kỷ XIX, Trống đồng Ngọc Lũ được giới khảo cổ học quốc tế suy tôn là "Vua của các loại trống đồng" và là bảo vật tiêu biểu nhất của nền Văn hóa Đông Sơn (thế kỷ III – II TCN), gắn liền với thời đại các Vua Hùng dựng nước Văn Lang – Âu Lạc.

2. Kỹ nghệ luyện kim đúc đồng bậc thầy:
Trống có trọng lượng 86kg, đường kính mặt 86cm và chiều cao 63cm. Để đúc được một chiếc trống đồng cỡ lớn với thành đồng mỏng đều, âm vang trầm hùng và hoa văn dày đặc sắc nét như vậy, người thợ đúc đồng Việt cổ đã phải nắm vững công nghệ hợp kim đồng - chì - thiếc, kết hợp kỹ thuật làm khuôn đất sét ba mang (khuôn ngoài, khuôn trong và khuôn mặt) đạt độ chính xác phi thường.

3. Bản thông điệp văn hóa và nhân sinh quan thời dựng nước:
- Chính giữa mặt trống là hình tượng ngôi sao 14 cánh biểu trưng cho Thần Mặt Trời – nguồn ánh sáng và sinh khí nuôi dưỡng nền nông nghiệp lúa nước.
- 16 vòng hoa văn đồng tâm miêu tả sinh động bức tranh xã hội nguyên thủy: đoàn chim Lạc sải cánh bay ngược chiều kim đồng hồ, cảnh người giã gạo chày đôi rộn ràng, lễ hội múa hóa trang lông chim, cảnh đua thuyền chiến trên sông nước và những ngôi nhà sàn mái cong hình thuyền. Trống đồng Ngọc Lũ không chỉ là một nhạc khí thiêng mà còn là biểu tượng quyền uy tối thượng của các Lạc hầu, Lạc tướng.`,

    'Mỹ Sơn': `1. Trung tâm tâm linh thiêng liêng của Vương quốc Champa:
Nằm ẩn mình trong một thung lũng lòng chảo khép kín được che chắn bởi ngọn núi Chúa thiêng liêng (Maha Parvata) tại xã Duy Phú, huyện Duy Xuyên, tỉnh Quảng Nam, Thánh địa Mỹ Sơn là quần thể kiến trúc đền tháp Ấn Độ giáo lớn nhất Việt Nam, được khởi dựng từ thế kỷ IV dưới triều vua Bhadravarman và duy trì liên tục qua nhiều thế kỷ.

2. Bí ẩn kỹ thuật mài chập gạch nung:
Các ngọn tháp Chàm tại Mỹ Sơn được xây dựng bằng những viên gạch nung đỏ thắm, được liên kết với nhau bằng kỹ thuật mài chập không hề để lộ mạch vữa. Sau khi dựng xong khối tháp thô, các nghệ nhân mới trực tiếp chạm khắc các bức phù điêu hình tu sĩ khổ hạnh, hoa lá, tiên nữ Apsara và thần Shiva ngay trên bề mặt gạch – một kỹ thuật xây dựng độc nhất vô nhị trên thế giới đến nay vẫn còn nhiều điều kỳ bí.

3. Đài thờ Linga - Yoni & Dấu ấn Đồng Dương:
Mỹ Sơn lưu giữ những bảo vật quốc gia kiệt xuất như Đài thờ sa thạch Mỹ Sơn E1 (phong cách Dvaravati - tiền Angkor) và Đài thờ Mỹ Sơn A10 (phong cách Đồng Dương thế kỷ IX-X). Hình tượng Linga và Yoni liền khối thể hiện sự dung hợp sâu sắc giữa triết lý năng lượng sáng tạo vũ trụ của thần Shiva với tín ngưỡng phồn thực thờ cúng tổ tiên của cư dân bản địa Champa.`,

    'Thạt Luổng': `1. Biểu tượng tối cao của Phật giáo và Quốc gia Lào:
Đại bảo tháp Thạt Luổng (Pha That Luang) tọa lạc tại thủ đô Viêng Chăn, được khởi dựng từ thế kỷ XVI (năm 1566) dưới triều vua Setthathirath khi ông dời đô từ Luang Prabang về Viêng Chăn. Công trình được in trang trọng trên quốc huy của nước Cộng hòa Dân chủ Nhân dân Lào, là biểu tượng trường tồn của sự hòa hợp dân tộc và niềm tin tôn giáo.

2. Cấu trúc tam giới bọc vàng lộng lẫy:
Bảo tháp vươn cao 45m trên một bệ tháp hình vuông 4 tầng rộng 69m. Cấu trúc tháp phản ánh vũ trụ quan Phật giáo với 3 tầng biểu trưng cho 3 cảnh giới: Dục giới, Sắc giới và Vô sắc giới. Thân tháp chính thon thả hình nậm rượu độc đáo mô phỏng đóa hoa sen ngát hương vươn thẳng lên bầu trời, xung quanh được bao bọc bởi 30 ngọn tháp nhỏ tượng trưng cho 30 lời răn của Đức Phật Thích Ca.

3. Lễ hội tâm linh Bun That Luang:
Vào rằm tháng 12 Phật lịch hàng năm, Thạt Luổng trở thành tâm điểm của Lễ hội Bun That Luang – lễ hội Phật giáo lớn nhất đất nước Lào. Hàng vạn tăng ni và Phật tử từ khắp các tỉnh thành và kiều bào tụ hội về đây thực hiện nghi thức rước tháp, dâng hoa đăng và cầu nguyện cho quốc thái dân an, mùa màng bội thu.`,

    'Phù Nam': `1. Thương cảng quốc tế cổ đại sầm uất bậc nhất:
Vương quốc cổ Phù Nam (thế kỷ I – VII) từng là một đế chế thương mại hàng hải hùng mạnh bao trùm lưu vực hạ lưu sông Mê Kông, vùng đất Nam Bộ Việt Nam và bán đảo Mã Lai. Trung tâm kinh tế của vương quốc là đô thị cảng thị Óc Eo – Ba Thê (tỉnh An Giang ngày nay) – nơi tiếp nhận tàu buôn từ Đế quốc La Mã, Ba Tư, Ấn Độ và Trung Hoa trên "Con đường tơ lụa trên biển".

2. Dấu ấn khảo cổ học Óc Eo:
Các cuộc khai quật khảo cổ học tại Óc Eo đã phát hiện hàng ngàn hiện vật kim hoàn bằng vàng, đồng tiền La Mã thời hoàng đế Antoninus Pius (thế kỷ II), nhẫn vàng chạm hình bò thần Nandin, gương đồng thời Hán, các hạt chuỗi thủy tinh, đá ngọc quý cùng hệ thống kênh đào nhân tạo chằng chịt dẫn nước từ biển sâu vào nội địa phục vụ tàu thuyền neo đậu và trao đổi hàng hóa.

3. Nền tảng văn hóa tiếp biến:
Phù Nam là một trong những trung tâm tiếp nhận chữ viết Phạn (Sanskrit) và các tôn giáo lớn (Ấn Độ giáo, Phật giáo) sớm nhất ở Đông Nam Á. Sự thịnh vượng của Phù Nam đã đặt nền móng vững chắc cho sự ra đời của các nhà nước cổ đại tiếp theo ở bán đảo Đông Dương.`
  };

  const [allRows] = await conn.query('SELECT id, title, description FROM resources');

  for (const row of allRows) {
    let matched = null;
    for (const [key, text] of Object.entries(detailedDescriptions)) {
      if (row.title.includes(key)) {
        matched = text;
        break;
      }
    }

    if (matched) {
      await conn.query('UPDATE resources SET description = ? WHERE id = ?', [matched, row.id]);
    } else if (row.description.length < 200) {
      const expanded = `1. Bối cảnh lịch sử và xuất xứ:
${row.description}

2. Giá trị khảo cổ học & Nghệ thuật tạo hình:
Hiện vật và di tích này phản ánh trình độ kỹ thuật thủ công tinh xảo, thể hiện tư duy thẩm mỹ và thế giới quan sâu sắc của cư dân thời kỳ cổ – trung đại. Qua các đường nét tạo hình, hoa văn và chất liệu chế tác, chúng ta nhận thấy sự kết hợp hài hòa giữa bản sắc văn hóa bản địa với quá trình giao lưu văn hóa khu vực.

3. Ý nghĩa học thuật và nghiên cứu:
Tư liệu cung cấp bằng chứng vật chất quan trọng phục vụ công tác dạy học Lịch sử 10, giúp giáo viên và học sinh tái hiện bức tranh sinh động về đời sống kinh tế, văn hóa và xã hội của các thời kỳ lịch sử đã qua.`;
      await conn.query('UPDATE resources SET description = ? WHERE id = ?', [expanded, row.id]);
    }
  }

  console.log('✅ Successfully enriched detailed historical descriptions for all resources in MySQL.');
  await conn.end();
}

enrichDescriptions().catch(console.error);
