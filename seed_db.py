import os
import pymysql
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv('DB_HOST', '103.200.23.80')
DB_USER = os.getenv('DB_USER', 'tinkerai4016_db_test')
DB_PASS = os.getenv('DB_PASS', 'FstackDev@1234')
DB_NAME = os.getenv('DB_NAME', 'tinkerai4016_db_test_17')
DB_PORT = int(os.getenv('DB_PORT', '3306'))

conn = pymysql.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASS,
    database=DB_NAME,
    port=DB_PORT,
    charset='utf8mb4'
)
cursor = conn.cursor()

# Clear existing rows
cursor.execute("DELETE FROM artifacts_3d;")
cursor.execute("DELETE FROM resources;")
cursor.execute("DELETE FROM topics;")

topics_data = [
    (1, "Thế giới cổ đại", "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=800&q=80", "Những nền văn minh đầu tiên và di sản rực rỡ của thế giới cổ đại."),
    (2, "Thế giới trung đại", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", "Các xã hội phong kiến, nhà nước và thành tựu văn hóa tiêu biểu thời trung đại."),
    (3, "Một số nền văn minh châu Á", "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80", "Khám phá những cái nôi văn minh lớn: Ấn Độ, Trung Hoa, Ả Rập."),
    (4, "Văn minh Đông Nam Á", "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80", "Di sản, giao lưu hàng hải và thành tựu rực rỡ của các nền văn minh Đông Nam Á thời cổ – trung đại."),
    (5, "Các cuộc cách mạng công nghiệp", "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800&q=80", "Những bước nhảy vọt về khoa học, công nghệ, kinh tế và biến đổi xã hội nhân loại."),
    (6, "Thế giới hiện đại", "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80", "Các tiến trình biến đổi, toàn cầu hóa và các vấn đề thời đại của thế giới ngày nay."),
    (7, "Việt Nam trong lịch sử thế giới", "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80", "Vị thế và những đóng góp của Việt Nam trong dòng chảy văn minh nhân loại.")
]

cursor.executemany("INSERT INTO topics (id, title, img, description) VALUES (%s, %s, %s, %s)", topics_data)

resources_data = [
    # Topic 4: Van minh Dong Nam A
    (
        4, "Bối cảnh địa lí và các tuyến giao lưu văn minh Đông Nam Á", "image",
        "Bản đồ địa lí tự nhiên khu vực Đông Nam Á", "Cổ – trung đại", "Khu vực Đông Nam Á",
        "Đông Nam Á nằm ở vị trí ngã tư đường hàng hải huyết mạch nối liền Ấn Độ Dương và Thái Bình Dương, sở hữu hệ thống châu thổ phì nhiêu và tài nguyên biển phong phú, hình thành các trung tâm nông nghiệp lúa nước và thương mại cảng thị sớm.",
        "Cổng thông tin Địa lý Quốc gia & Bản đồ", "https://maisonoffice.vn/tin-tuc/ban-do-dong-nam-a/",
        "https://images.unsplash.com/photo-1524666041070-9a876833e706?auto=format&fit=crop&w=1200&q=85",
        "Hướng dẫn học sinh chỉ ra vị trí các eo biển huyết mạch (Malacca, Sunda) và các lưu vực sông lớn (sông Hồng, sông Mê Kông, Chao Phraya), giải thích mối liên hệ giữa địa lý với sự hình thành thương cảng cổ.",
        None
    ),
    (
        4, "Sự hình thành và phát triển các vương quốc cổ Đông Nam Á", "image",
        "Lược đồ Vương quốc Phù Nam (Năm 200 Công nguyên)", "Thế kỷ I – VII", "Hạ lưu sông Mê Kông (Nam Bộ Việt Nam & Campuchia)",
        "Bản đồ mô tả địa bàn và không gian ảnh hưởng của Vương quốc cổ Phù Nam. Đây là nhà nước thương mại hàng hải hùng mạnh bậc nhất Đông Nam Á cổ đại với trung tâm cảng thị quốc tế Óc Eo tiếp nhận tàu buôn từ La Mã, Ba Tư, Ấn Độ và Trung Hoa.",
        "Bách khoa toàn thư Britannica & Viện Nghiên cứu", "https://ordi.vn/phu-nam-tu-mot-goc-nhin-moi-ky-1.html",
        "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1200&q=85",
        "So sánh bản đồ Phù Nam với đường biên giới hiện đại để học sinh hiểu khái niệm không gian lịch sử và tính mở của các cảng thị cổ đại.",
        None
    ),
    (
        4, "Các vương quốc cổ đại Đông Nam Á", "image",
        "Lược đồ Các thị quốc Pyu (Myanmar)", "Thế kỷ II TCN – Thế kỷ IX", "Lưu vực sông Ayeyarwady (Myanmar)",
        "Tập hợp các thành thị – quốc gia của người Pyu như Sri Ksetra, Halin, Beikthano dọc theo lưu vực sông Ayeyarwady, nơi tiếp nhận chữ viết gốc Ấn Độ và Phật giáo Thượng tọa bộ sớm nhất khu vực.",
        "UNESCO World Heritage & Wikimedia Commons", "https://vi.wikipedia.org/wiki/C%C3%A1c_th%E1%BB%8B_qu%E1%BB%91c_Pyu",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
        "Yêu cầu học sinh phân tích đặc điểm quy hoạch thành quách hình bầu dục đặc trưng của người Pyu phục vụ mục đích trị thủy nông nghiệp và phòng thủ.",
        None
    ),
    (
        4, "Văn hóa Óc Eo và Vương quốc Phù Nam", "3d",
        "Nhẫn vàng hình bò thần Nandin & Di tích khảo cổ Óc Eo – Ba Thê", "Thế kỷ I – VII (Bảo vật Quốc gia)", "Ba Thê, Thoại Sơn, An Giang",
        "Nhẫn vàng chạm khắc nổi hình tượng bò thần Nandin trong Ấn Độ giáo cùng hàng ngàn hiện vật ngói trang trí, trang sức quý tại khu di tích Óc Eo – Ba Thê khẳng định sự giao thoa văn hóa Ấn Độ và trình độ luyện kim, kim hoàn bậc thầy.",
        "Bảo tàng Lịch sử Quốc gia & Viện Nghiên cứu Kinh thành", "https://baotanglichsu.vn/vi/Articles/3127/69410/khu-di-tich-ba-the-oc-eo-an-giang-va-van-dje-bao-ton-di-tich-van-hoa-oc-eo-hien-nay.html",
        "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=85",
        "Tổ chức cho học sinh xoay mô hình 3D, phân tích hình tượng bò Nandin để chỉ ra quá trình tiếp biến văn hóa Shiva giáo vào đời sống vương triều Phù Nam.",
        "dong_son_drum"
    ),
    (
        4, "Tín ngưỡng bản địa Đông Nam Á", "image",
        "Tượng Nữ thần Lúa gạo Dewi Sri (Nyi Pohaci)", "Cổ – trung đại", "Đảo Bali và Java (Indonesia)",
        "Nữ thần Dewi Sri là hiện thân của hạt lúa, sự sinh sôi và no ấm trong tín ngưỡng nông nghiệp lâu đời của cư dân quần đảo Indonesia, minh chứng cho sức sống bền bỉ của tín ngưỡng bản địa trước sự du nhập của Hindu giáo và Hồi giáo.",
        "Bảo tàng Dân tộc học & Văn hóa Indonesia", "https://en.wikipedia.org/wiki/Dewi_Sri",
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
        "Liên hệ tín ngưỡng thờ Mẹ Lúa, thần Lúa ở Việt Nam và các nước Đông Nam Á lục địa với thần Dewi Sri để làm nổi bật nét tương đồng về văn minh lúa nước.",
        None
    ),
    (
        4, "Tôn giáo và Điêu khắc Champa", "3d",
        "Đài thờ Linga – Yoni liền khối thế kỷ IX tại Thánh địa Mỹ Sơn", "Thế kỷ IX (Bảo vật Quốc gia)", "Thánh địa Mỹ Sơn, Quảng Nam",
        "Khối điêu khắc sa thạch nguyên khối thể hiện Linga và Yoni lớn nhất Việt Nam, biểu trưng cho sự sáng tạo vô biên của vũ trụ, hòa quyện giữa giáo lý Ấn Độ giáo với tín ngưỡng phồn thực nguyên thủy của cư dân Champa.",
        "Ban Quản lý Di sản Văn hóa Mỹ Sơn & Báo VietNamNet", "https://vietnamnet.vn/khai-quat-duoc-linga-yoni-lien-khoi-the-ky-9-lon-nhat-viet-nam-tai-my-son-645397.html",
        "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=85",
        "Sử dụng công cụ xem 3D để học sinh quan sát các đường rãnh thoát nước thiêng (somasutra) và kỹ thuật đục đẽo sa thạch không cần nối ghép của nghệ nhân Chăm.",
        "linga_yoni"
    ),
    (
        4, "Đời sống tinh thần và lễ hội truyền thống", "image",
        "Lễ hội thả đèn hoa đăng Loy Krathong", "Thế kỷ XIII – nay", "Thái Lan, Lào, Myanmar",
        "Lễ hội truyền thống bắt nguồn từ thời Sukhothai mang ý nghĩa tri ân Nữ thần Nước Phra Mae Khongkha và cầu may mắn, phản ánh mối quan hệ thiêng liêng giữa con người và nguồn nước trong văn hóa nông nghiệp Đông Nam Á.",
        "Tổng cục Du lịch Thái Lan (TAT)", "https://www.klook.com/vi/blog/loy-krathong/",
        "https://images.unsplash.com/photo-1512553353684-82ab39e3b689?auto=format&fit=crop&w=1200&q=85",
        "So sánh lễ Loy Krathong với phong tục thả đèn hoa đăng trong các lễ hội truyền thống của người Việt, người Khmer để thấy sự giao thoa văn hóa khu vực.",
        None
    ),
    (
        4, "Phật giáo Đông Nam Á", "image",
        "Đại tượng Phật Laykyun Sekkya và Phật nằm Monywa", "Mỹ thuật Phật giáo Theravada", "Monywa, Vùng Sagaing, Myanmar",
        "Tượng Phật đứng cao 129m (thuộc hàng cao nhất thế giới) bên cạnh pho tượng Phật nhập niết bàn Monywa khổng lồ, minh chứng cho sức ảnh hưởng bao trùm và sâu rộng của Phật giáo Thượng tọa bộ trong văn hóa và đời sống Myanmar.",
        "Tư liệu Nhiếp ảnh Di sản Phật giáo Myanmar", "https://en.wikipedia.org/wiki/Laykyun_Sekka",
        "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=85",
        "Học sinh khai thác hình ảnh để nêu bật vai trò của các tự viện và tượng Phật giáo như trung tâm sinh hoạt tâm linh và cộng đồng ở Đông Nam Á lục địa.",
        None
    ),
    (
        4, "Nghệ thuật đúc tượng và Phật giáo Thái Lan", "image",
        "Đại tượng Phật chùa Wat Muang (Thái Lan)", "Mỹ thuật Phật giáo Thái Lan", "Tỉnh Ang Thong, Thái Lan",
        "Pho tượng Phật ngồi mạ vàng uy nghiêm cao 92m, rộng 63m, thể hiện tư thế Xúc địa ấn (Bhumisparsha Mudra) chiến thắng ma vương, tượng trưng cho nền Phật giáo Quốc giáo của vương quốc Thái Lan.",
        "The Culture Trip / TAT", "https://theculturetrip.com/asia/thailand/articles/wat-muang-ang-thong/",
        "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=85",
        "Phân tích ý nghĩa cử chỉ tay (Mudra) trong nghệ thuật điêu khắc tượng Phật để rèn luyện kỹ năng đọc hiểu biểu tượng lịch sử.",
        None
    ),
    (
        4, "Phật giáo Đại thừa tại Việt Nam", "image",
        "Đại tượng Phật A Di Đà chùa Khai Nguyên", "Phật giáo Đại thừa", "Sơn Tây, Hà Nội, Việt Nam",
        "Đại tượng Phật A Di Đà vì hòa bình thế giới cao 72m, khẳng định truyền thống lâu đời của dòng Phật giáo Đại thừa (Bắc tông) tại Việt Nam trong bức tranh đa sắc của Phật giáo Đông Nam Á.",
        "Báo Dân Trí", "https://dantri.com.vn/thoi-su/chiem-nguong-dai-tuong-phat-lon-nhat-dong-nam-a-o-ha-noi-20240219005718937.htm",
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=85",
        "So sánh nét khác biệt cơ bản giữa hệ phái Phật giáo Bắc tông (Đại thừa) ở Việt Nam và hệ phái Nam tông (Theravada) ở Thái Lan, Campuchia, Lào, Myanmar.",
        None
    ),
    (
        4, "Quá trình du nhập và phát triển của Hồi giáo", "image",
        "Thánh đường Hồi giáo Baiturrahman (Banda Aceh, Indonesia)", "Thế kỷ XVII – nay", "Banda Aceh, Sumatra, Indonesia",
        "Biểu tượng kiến trúc Hồi giáo lịch sử của vương quốc Hồi giáo Aceh với 7 mái vòm đen tuyền và 8 tháp cao tráng lệ, thể hiện sự tiếp nhận sâu sắc của Hồi giáo tại Đông Nam Á hải đảo thông qua thương mại hàng hải.",
        "Thông tấn xã Việt Nam TTXVN", "https://en.wikipedia.org/wiki/Baiturrahman_Grand_Mosque",
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=85",
        "Cho học sinh tìm hiểu vai trò của thương thuyền Ả Rập và Ấn Độ trong việc truyền bá Hồi giáo một cách hòa bình vào Đông Nam Á từ thế kỷ XIII.",
        None
    ),
    (
        4, "Văn hóa Hồi giáo tại Đông Nam Á hải đảo", "image",
        "Thánh đường Hồi giáo Hoàng gia Omar Ali Saifuddien", "Kiến trúc Hồi giáo hiện đại", "Bandar Seri Begawan, Brunei",
        "Một trong những thánh đường Hồi giáo nguy nga nhất thế giới với mái vòm chính mạ vàng 24K rực rỡ và mô hình thuyền hoàng gia Mahligai thế kỷ XVI, biểu tượng cho sự hòa hợp giữa Hồi giáo và vương triều Mã Lai.",
        "Vietravel Du lịch & Di sản", "https://www.vietravel.com/vn/am-thuc-kham-pha/du-lich-brunei-thanh-duong-hoi-giao-o-brunei-darussalam-v16065.aspx",
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=85",
        "Quan sát các chi tiết kiến trúc mái vòm vút cao và các đường cong Ả Rập để thấy dấu ấn mỹ thuật Hồi giáo toàn cầu.",
        None
    ),
    (
        4, "Dấu ấn Công giáo phương Tây tại Philippines", "image",
        "Vương cung thánh đường Taal (Taal Basilica)", "Thế kỷ XVI – XIX", "Batangas, Philippines",
        "Nhà thờ Công giáo lớn nhất Đông Nam Á mang phong cách Tân cổ điển kết hợp Baroque thích ứng động đất (Earthquake Baroque), phản ánh lịch sử giao lưu và thuộc địa Tây Ban Nha tại quần đảo Philippines.",
        "Tổ chức Kỷ lục Đông Nam Á & Báo Di sản", "https://kyluc.vn/tin-tuc/top-best/best-asean-taal-basilica-philippines-nha-tho-cong-giao-lon-nhat-dong-nam-a",
        "https://images.unsplash.com/photo-1548625361-195fe5787e98?auto=format&fit=crop&w=1200&q=85",
        "Hướng dẫn học sinh thảo luận lý do vì sao Philippines là quốc gia Đông Nam Á duy nhất có đa số cư dân theo Công giáo La Mã.",
        None
    ),
    (
        4, "Sự hình thành chữ viết dân tộc ở Đông Nam Á", "image",
        "Bản văn bia đá Ramkhamhaeng (Chữ Thái cổ Sukhothai)", "Năm 1292", "Bảo tàng Quốc gia Bangkok, Thái Lan",
        "Văn bia đá khắc bằng chữ viết Thái cổ đầu tiên do vua Ramkhamhaeng sáng tạo từ chữ Khmer cổ và Môn cổ, đánh dấu sự ra đời của nền văn học và quốc gia Sukhothai độc lập, được UNESCO công nhận là Di sản Ký ức Thế giới.",
        "Bảo tàng Quốc gia Bangkok / UNESCO", "https://luhanhvietnam.com.vn/du-lich/bao-tang-quoc-gia-bangkok-thai-lan.html",
        "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85",
        "Giúp học sinh phân tích con đường sáng tạo chữ viết của các dân tộc Đông Nam Á: tiếp thu hệ mẫu tự Brahmi của Ấn Độ nhưng cải biến để phù hợp với ngữ âm bản địa.",
        None
    ),
    (
        4, "Chữ viết và văn hóa sơ kỳ Đông Nam Á", "3d",
        "Bia đá Võ Cạnh – Bia khắc chữ Phạn cổ nhất Đông Nam Á", "Thế kỷ II – III (Bảo vật Quốc gia)", "Nha Trang, Khánh Hòa (Lưu tại BTLSQG)",
        "Tấm bia đá bazan nguyên khối 3 cạnh cao 2,7m được khắc chữ Phạn (Sanskrit) có niên đại sớm nhất được tìm thấy ở Đông Nam Á, phản ánh quá trình tiếp nhận chữ viết Ấn Độ và cấu trúc quyền lực sơ khai ở Nam Trung Bộ.",
        "Bảo tàng Lịch sử Quốc gia Việt Nam", "https://baotanglichsu.vn/vi/Articles/3091/18029/bia-vo-canh.html",
        "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=85",
        "Khai thác chế độ xoay 3D để quan sát các mặt khắc chữ cổ, làm sáng tỏ ý nghĩa tư liệu thành văn sơ kỳ trong nghiên cứu lịch sử cổ đại.",
        "vo_canh_stele"
    ),
    (
        4, "Nghệ thuật kiến trúc đền núi thời Angkor", "3d",
        "Quần thể Đền tháp Angkor Wat (Campuchia)", "Thế kỷ XII (Di sản UNESCO)", "Siem Reap, Campuchia",
        "Kỳ quan kiến trúc đền núi lớn nhất thế giới, đỉnh cao nghệ thuật Khmer xây dựng dưới thời vua Suryavarman II, tái hiện ngọn núi thiêng Meru với 5 ngọn tháp búp sen hùng vĩ, hệ thống hào nước và các bức phù điêu sử thi hoành tráng.",
        "UNESCO World Heritage Centre & Báo Dân tộc", "https://whc.unesco.org/en/list/668/",
        "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1200&q=85",
        "Xem mô hình 3D toàn cảnh đền núi, hướng dẫn học sinh nhận xét về nghệ thuật đối xứng tuyệt đối và kỹ thuật xếp đá sa thạch không cần vữa gắn kết.",
        "borobudur_stupa"
    ),
    (
        4, "Đỉnh cao kiến trúc Phật giáo thời vua Jayavarman VII", "image",
        "Kinh đô Angkor Thom và Đền Bayon kỳ bí", "Cuối thế kỷ XII – đầu thế kỷ XIII", "Siem Reap, Campuchia",
        "Kinh đô cuối cùng và đồ sộ nhất của Đế quốc Khmer rộng 9 km² với đền trung tâm Bayon gồm 54 tòa tháp đá tạc 216 khuôn mặt Phật Quán Thế Âm với nụ cười bí ẩn bao dung hướng ra bốn phương trời.",
        "Báo Dân tộc và Phát triển", "https://baodantoc.vn/kham-pha-angkor-thom-1647414995431.htm",
        "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85",
        "Học sinh giải thích thông điệp từ bi của Phật giáo Đại thừa hòa quyện với uy quyền quân vương qua 'Nụ cười Bayon'.",
        None
    ),
    (
        4, "Kiến trúc Phật giáo Vương quốc Lan Xang", "3d",
        "Đại tháp Thạt Luổng (Pha That Luang, Lào)", "Thế kỷ XVI (Bảo tháp Quốc gia)", "Thủ đô Viêng Chăn, Lào",
        "Bảo tháp dát vàng linh thiêng cao 45m hình nậm rượu độc đáo tọa lạc giữa thủ đô Viêng Chăn, biểu tượng quốc gia trên quốc huy Lào, đại diện cho sự thịnh trị của Phật giáo thời vương triều Setthathirath.",
        "Tạp chí Lào – Việt điện tử", "https://laovietmag.vn/that-luong-bieu-tuong-van-hoa-va-ton-giao-cua-nuoc-lao-trieu-voi/",
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85",
        "Tương tác mô hình 3D tháp Thạt Luổng, tìm hiểu cấu trúc 3 tầng tháp tương ứng với ba cõi Dục giới, Sắc giới và Vô sắc giới.",
        "that_luang"
    ),
    (
        4, "Đỉnh cao kỹ nghệ đúc đồng và văn minh Đông Sơn", "3d",
        "Trống đồng Ngọc Lũ – Tuyệt tác Văn hóa Đông Sơn", "Thế kỷ III – II TCN (Bảo vật Quốc gia)", "Bình Lục, Hà Nam (Lưu tại BTLSQG)",
        "Đỉnh cao tuyệt mỹ của nghệ thuật đúc đồng Đông Sơn thời đại Văn Lang – Âu Lạc. Mặt trống chạm hình ngôi sao 14 cánh, các vòng chim Lạc bay ngược chiều kim đồng hồ, cảnh giã gạo chày đôi, nhà sàn mái cong và người múa lễ hội.",
        "Bảo tàng Lịch sử Quốc gia & Báo Dân Trí", "https://baotanglichsu.vn/vi/Articles/3091/18012/trong-dong-ngoc-lu.html",
        "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=85",
        "Mở Studio 3D để phóng to quan sát từng chi tiết chim Lạc, người hóa trang lông chim, rèn luyện kỹ năng phân tích hiện vật khảo cổ học.",
        "dong_son_drum"
    ),
    (
        4, "Kỹ nghệ luyện kim đồ đồng Đông Nam Á", "video",
        "Trống đồng Hoàng Hạ & Nghệ thuật đúc đồng Đông Sơn", "Thế kỷ III – II TCN (Bảo vật Quốc gia)", "Phú Xuyên, Hà Nội",
        "Trống đồng loại I Heger còn nguyên vẹn tuyệt đẹp, thân trống chạm hình các chiến binh tay cầm giáo mác vũ trang trang phục lông chim trên thuyền chiến vượt sóng lớn.",
        "Báo Dân Trí & BTLSQG", "https://dantri.com.vn/van-hoa/ngam-trong-dong-dong-son-lon-nhat-tu-truoc-den-nay-dang-trung-bay-o-ha-noi-20231216041942629.htm",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
        "Học sinh xem phóng sự truyền hình, liệt kê các công đoạn đúc đồng cổ truyền: tạo khuôn đất sét nhiều mang, nấu đồng hợp kim chì – thiếc và rót kim loại.",
        None
    ),
    (
        4, "Nghệ thuật tạo hình và đời sống tâm linh Đông Sơn", "image",
        "Cây đèn đồng hình người quỳ (Thế kỷ II TCN – Thế kỷ I CN)", "Thế kỷ II – I TCN (Bảo vật Quốc gia)", "Mộ cổ Lạch Trường, Thanh Hóa (BTLSQG)",
        "Pho tượng đồng độc nhất vô nhị thể hiện một dũng sĩ mình trần đóng khố hai tay dâng đĩa đèn, trên lưng gắn chùm cành đèn có tượng nhạc công tí hon, minh chứng cho kỹ thuật đúc tượng tròn và đời sống tâm linh tinh tế.",
        "Bảo tàng Lịch sử Quốc gia", "https://baotanglichsu.vn/vi/Articles/3091/18013/cay-den-hinh-nguoi-quy.html",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
        "Phân tích đặc điểm nhân chủng học và trang phục của bức tượng người quỳ để so sánh với các cư dân Đông Nam Á cùng thời kỳ.",
        None
    ),
    (
        4, "Đồ đựng tế khí kim khí Văn hóa Đông Sơn", "image",
        "Thạp đồng Đào Xá (Phú Thọ) – Bảo vật Quốc gia", "Thế kỷ III TCN (Bảo vật Quốc gia)", "Đào Xá, Thanh Thủy, Phú Thọ",
        "Chiếc thạp đồng dáng quả nhót kinh điển với nắp đậy đúc 4 tượng chim bồ nông, thân thạp chạm khắc hoa văn người nhảy múa hóa trang lông chim, chim bồ nông mỏ dài và hoa văn răng cưa sóng nước.",
        "Bảo tàng Hùng Vương & Báo Dân Trí", "https://baotanglichsu.vn",
        "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1200&q=85",
        "Học sinh so sánh công dụng của Thạp đồng (dùng đựng lúa giống tế lễ hoặc tro cốt quý tộc) với Trống đồng để thấy sự phân hóa xã hội thời dựng nước.",
        None
    ),
    (
        4, "Kỹ nghệ gốm tiền sử Đông Nam Á", "image",
        "Bình gốm văn hóa Bản Chiềng (Ban Chiang, Thái Lan)", "2100 TCN – 200 CN (Di sản UNESCO)", "Ban Chiang, Udon Thani, Thái Lan",
        "Hiện vật gốm đất nung cổ với họa tiết xoắn ốc uốn lượn màu đỏ son kỳ ảo nổi tiếng khắp thế giới, minh chứng cư dân Đông Nam Á cổ đã phát triển độc lập nền nông nghiệp và đồ gốm từ hàng ngàn năm trước Công nguyên.",
        "UNESCO World Heritage & BTLSQG", "https://whc.unesco.org/en/list/575/",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
        "Đối chiếu hoa văn gốm Bản Chiềng với hoa văn gốm Phùng Nguyên, Hoa Lộc ở Việt Nam để chứng minh sự tương đồng trong tư duy mỹ thuật thời tiền sử Đông Nam Á.",
        None
    ),
    (
        4, "Nghệ thuật điêu khắc sa thạch Champa", "3d",
        "Đài thờ Mỹ Sơn E1 và Đài thờ Mỹ Sơn A10", "Thế kỷ VII – VIII & IX – X", "Bảo tàng Điêu khắc Chăm Đà Nẵng",
        "Hai bảo vật quốc gia kiệt xuất của nghệ thuật Champa: Đài thờ E1 với 16 khối đá chạm khắc núi Meru và tu sĩ Ấn Độ chịu ảnh hưởng nghệ thuật Dvaravati (Thái Lan); Đài thờ A10 là bộ đài thờ nguyên vị độc bản tiêu biểu cho phong cách Đồng Dương huyền bí.",
        "Bảo tàng Điêu khắc Chăm Đà Nẵng & Di sản Mỹ Sơn", "https://disanvanhoamyson.vn/tin-tuc/bao-vat-quoc-gia-dai-tho-my-son-a10.html",
        "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=85",
        "Quan sát 3D các chi tiết nhân vật đang tấu nhạc cụ, tu sĩ khổ hạnh trong hốc đá để phân tích chiều sâu giao lưu tư tưởng tôn giáo thời cổ.",
        "linga_yoni"
    ),
    (
        4, "Đỉnh cao kiến trúc điêu khắc Phật giáo thế giới", "3d",
        "Quần thể Đại đền tháp Borobudur (Java, Indonesia)", "Thế kỷ VIII – IX (Vương triều Sailendra)", "Magelang, Trung Java, Indonesia",
        "Kỳ quan Phật giáo vĩ đại nhất thế giới gồm 9 tầng bằng đá núi lửa andesit tượng trưng cho cõi Niết Bàn, quy tụ 504 pho tượng Phật và hơn 2.670 bức phù điêu chạm khắc kinh Bản sinh kéo dài hàng cây số.",
        "UNESCO World Heritage Centre", "https://whc.unesco.org/en/list/592/",
        "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85",
        "Sử dụng mô hình 3D để giải thích cấu trúc Mandala vũ trụ hình kim tự tháp bậc thang và ý nghĩa hành hương tâm linh của Phật tử.",
        "borobudur_stupa"
    ),
    (
        4, "Nghệ thuật kiến trúc Phật giáo Rattanakosin", "image",
        "Chùa Phật Ngọc (Wat Phra Kaew, Bangkok, Thái Lan)", "Năm 1782 (Vua Rama I)", "Hoàng cung Bangkok, Thái Lan",
        "Ngôi chùa thiêng lưu giữ pho tượng Phật Ngọc bích nguyên khối Phra Kaew Morakot – quốc bảo tối cao của Thái Lan, nổi bật với các tòa tháp bọc vàng lộng lẫy và dãy hành lang bích họa dài 1km vẽ sử thi Ramakien.",
        "Tourism Authority of Thailand (TAT)", "https://www.royalgrandpalace.th",
        "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=85",
        "Học sinh khai thác bức ảnh để phân tích sự tiếp biến từ sử thi thi ca Ấn Độ (Ramayana) thành tác phẩm nghệ thuật cung đình bản địa (Ramakien).",
        None
    ),
    (
        4, "Kiến trúc bảo tháp Phật giáo Myanmar", "3d",
        "Chùa Vàng Shwedagon – Kỳ quan Phật giáo Myanmar", "Thế kỷ VI – nay", "Yangon, Myanmar",
        "Ngọn bảo tháp dát vàng rực rỡ cao 99m trên đồi Singuttara, lưu giữ xá lợi tóc của Đức Phật Thích Ca, đỉnh tháp nạm hơn 7.000 viên kim cương và đá quý, là trái tim tín ngưỡng linh thiêng bậc nhất của người dân Myanmar.",
        "Mekong ASEAN & Amazing Places", "https://mekongasean.vn/chua-shwedagon-di-tich-phat-giao-linh-thieng-bac-nhat-the-gioi-tai-myanmar-27476.html",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
        "Xem mô hình 3D bảo tháp và tìm hiểu nét văn hóa chiêm tinh học Phật giáo theo ngày sinh trong tuần của người Myanmar.",
        "that_luang"
    ),
    (
        4, "Kỹ thuật xây tháp gạch và bảo tồn di sản Champa", "image",
        "Quần thể Đền tháp Mỹ Sơn – Nhóm tháp A sau trùng tu", "Thế kỷ IV – XIII (Di sản UNESCO)", "Duy Xuyên, Quảng Nam",
        "Thung lũng thánh địa thiêng liêng của các vương triều Champa dưới chân núi Chúa Maha Parvata, minh chứng cho kỹ thuật mài chập gạch nung không dùng mạch vữa kỳ diệu và sự chung tay phục dựng di sản sau chiến tranh.",
        "Báo Lao Động & Ban QL Di sản Mỹ Sơn", "https://disanvanhoamyson.vn",
        "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=85",
        "Thảo luận về tầm quan trọng của việc ứng dụng khoa học công nghệ số trong việc bảo tồn, số hóa di sản văn hóa trước biến đổi khí hậu và thời gian.",
        None
    ),

    # Other Topics
    (
        1, "Văn minh Hy Lạp – La Mã cổ đại", "image",
        "Kiến trúc Đền thờ Parthenon và nghệ thuật cổ điển Hy Lạp", "Thời Cổ đại", "Athens, Hy Lạp",
        "Kiệt tác kiến trúc bằng đá cẩm thạch trắng thờ nữ thần Athena trên đồi Acropolis, biểu tượng chuẩn mực của trật tự thức cột Doric và nền dân chủ chủ nô Athens.",
        "UNESCO & Bộ Văn hóa Hy Lạp", "https://whc.unesco.org/en/list/404",
        "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=1200&q=85",
        "Quan sát tỷ lệ vàng trong kiến trúc Hy Lạp cổ đại, liên hệ đến những đóng góp to lớn của Hy Lạp đối với nghệ thuật phương Tây.",
        None
    ),
    (
        1, "Văn minh Ai Cập cổ đại", "image",
        "Đại Kim tự tháp Giza và tượng Nhân sư Sphinx", "Khoảng 2560 TCN", "Giza, Ai Cập",
        "Công trình lăng mộ kỳ vĩ bằng đá vôi nguyên khối của Pharaoh Khufu, một trong bảy kỳ quan của thế giới cổ đại còn tồn tại đến ngày nay.",
        "Bảo tàng Ai Cập Cairo", "https://egymonuments.gov.eg",
        "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=85",
        "Tìm hiểu về kỹ thuật đo đạc thiên văn, toán học và tổ chức lao động xã hội của cư dân Ai Cập cổ đại hai bên bờ sông Nin.",
        None
    ),
    (
        3, "Văn minh Ấn Độ thời cổ – trung đại", "image",
        "Lăng mộ Taj Mahal – Tuyệt tác cẩm thạch Mogul", "Thế kỷ XVII", "Agra, Ấn Độ",
        "Kiệt tác kiến trúc Hồi giáo Ấn Độ do hoàng đế Shah Jahan xây dựng để tưởng nhớ hoàng hậu Mumtaz Mahal, được mệnh danh là 'bài thơ tình tạc vào đá'.",
        "UNESCO World Heritage", "https://whc.unesco.org/en/list/252",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85",
        "Phân tích tính đối xứng hoàn hảo và nghệ thuật cẩn ngọc Pietra Dura trên đá cẩm thạch trắng.",
        None
    ),
    (
        5, "Cuộc cách mạng công nghiệp lần thứ nhất", "image",
        "Động cơ hơi nước James Watt và sự ra đời của nhà máy cơ khí", "Cuối thế kỷ XVIII", "Nước Anh",
        "Phát minh máy hơi nước cải tiến của James Watt năm 1784 đã mở ra kỷ nguyên cơ giới hóa, thay thế sức người và sức kéo động vật bằng năng lượng hơi nước.",
        "Science Museum London", "https://www.sciencemuseum.org.uk",
        "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=85",
        "Hướng dẫn học sinh đánh giá tác động kép của động cơ hơi nước đối với năng suất sản xuất và sự hình thành hai giai cấp tư sản – vô sản.",
        None
    )
]

cursor.executemany("""
    INSERT INTO resources (
        topic_id, lesson, type, title, period, place, description, source, url, img, tip, model_3d
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
""", resources_data)

artifacts_data = [
    (
        "dong_son_drum",
        "Trống đồng Ngọc Lũ (Đông Sơn)",
        "Văn hóa Đông Sơn (Việt Nam)",
        "Thế kỷ III – II TCN",
        "Hà Nam, Việt Nam (Hiện vật BTLSQG)",
        "Được mệnh danh là 'Vua của các loại trống đồng cổ', trống Ngọc Lũ sở hữu hoa văn đúc nổi tinh xảo với mặt trống gắn hình ngôi sao 14 cánh, các vòng tròn đồng tâm miêu tả sinh động vũ hội, chim Lạc bay, chèo thuyền chiến đấu và giã cối đôi.",
        "Đồng thau cổ hợp kim chì - thiếc",
        "Đường kính 86 cm, Chiều cao 63 cm, Nặng 86 kg",
        "Bảo vật quốc gia số 1, minh chứng cho sự thăng hoa tột bực của kỹ nghệ luyện kim đúc đồng và bản sắc văn minh nông nghiệp lúa nước thời đại Hùng Vương.",
        "museum",
        "#8c6d3b"
    ),
    (
        "borobudur_stupa",
        "Bảo tháp Đền Tháp Borobudur",
        "Văn minh Phật giáo Sailendra (Indonesia)",
        "Thế kỷ VIII – IX",
        "Magelang, Trung Java, Indonesia",
        "Quần thể đền tháp Phật giáo kỳ vĩ nhất thế giới hình kim tự tháp bậc thang với 9 tầng, trong đó 3 tầng tròn trên cùng mang 72 bảo tháp nhỏ đục lỗ mắt cáo chứa tượng Phật Thích Ca ngồi tĩnh tọa xung quanh bảo tháp trung tâm tối thượng.",
        "Đá núi lửa Andesit xám tự nhiên",
        "Đáy rộng 118m x 118m, Cao 42m",
        "Kỳ quan kiến trúc Phật giáo nhân loại, biểu hiện cụ thể của vũ trụ quan Mandala và các chặng đường giác ngộ Niết bàn.",
        "golden",
        "#5c5a53"
    ),
    (
        "linga_yoni",
        "Đài thờ Linga – Yoni Champa",
        "Văn minh Champa (Việt Nam)",
        "Thế kỷ IX",
        "Thánh địa Mỹ Sơn, Quảng Nam",
        "Khối điêu khắc đá sa thạch nguyên khối thể hiện bộ ngẫu tượng Linga (dương vật thần Shiva) cắm trên Yoni (âm vật nữ thần Shakti) lớn nhất Đông Nam Á, thể hiện triết lý sinh sôi nảy nở của vũ trụ hòa quyện với tín ngưỡng phồn thực bản địa.",
        "Sa thạch xám nguyên khối",
        "Cao 1.8m, rộng đế 1.4m",
        "Bảo vật quốc gia, đỉnh cao nghệ thuật điêu khắc Champa thế kỷ IX thời kỳ phong cách Đồng Dương.",
        "champa",
        "#7d6756"
    ),
    (
        "vo_canh_stele",
        "Bia ký đá Võ Cạnh",
        "Văn minh Lâm Ấp / Sơ kỳ Phù Nam",
        "Thế kỷ II – III CN",
        "Nha Trang, Khánh Hòa",
        "Khối đá bazan tự nhiên có 3 mặt phẳng được khắc chữ Phạn (Sanskrit) cổ, ghi lại chiếu chỉ của một vị vương tôn thuộc dòng họ Sri Mara, là tư liệu thành văn bằng chữ viết sớm nhất trong toàn bộ lịch sử Đông Nam Á.",
        "Đá bazan nguyên khối",
        "Cao 2.7m, rộng đáy 0.9m",
        "Bảo vật quốc gia, tư liệu lịch sử vô giá chứng minh nguồn gốc chữ viết và sự du nhập của văn hóa Ấn Độ vào duyên hải Việt Nam.",
        "monolith",
        "#4a4a48"
    ),
    (
        "that_luang",
        "Đại bảo tháp Thạt Luổng",
        "Vương quốc Lan Xang (Lào)",
        "Thế kỷ XVI",
        "Thủ đô Viêng Chăn, Lào",
        "Bảo tháp Phật giáo trung tâm của nước Lào, hình nậm rượu thon thả vút lên không trung tượng trưng cho đóa sen ngát hương, toàn bộ phần thân tháp được bọc những lớp vàng lá óng ánh tỏa rạng dưới ánh bình minh.",
        "Gạch cổ dát vàng lá 24K",
        "Cao 45m, rộng đế 69m",
        "Biểu tượng thiêng liêng trên quốc huy nước Lào, di sản tâm linh tối cao quy tụ Phật tử trong mùa lễ hội Bun That Luang.",
        "golden",
        "#d4af37"
    )
]

cursor.executemany("""
    INSERT INTO artifacts_3d (
        code, name, culture, period, location, description, material, dimensions, significance, lighting_preset, color_base
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
""", artifacts_data)

conn.commit()

cursor.execute("SELECT COUNT(*) FROM topics;")
topics_count = cursor.fetchone()[0]
cursor.execute("SELECT COUNT(*) FROM resources;")
res_count = cursor.fetchone()[0]
cursor.execute("SELECT COUNT(*) FROM artifacts_3d;")
art_count = cursor.fetchone()[0]

print(f"SUCCESS: Seeded {topics_count} topics, {res_count} resources, {art_count} 3D artifacts into MySQL db 17!")
conn.close()
