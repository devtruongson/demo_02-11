# TÀI LIỆU YÊU CẦU CUNG CẤP TÀI NGUYÊN KỸ THUẬT
## HỆ THỐNG HỌC LIỆU SỐ & MÔ PHỎNG 3D — SỬ KÝ SỐ (LỊCH SỬ 10)

Kính gửi: **Quý Khách Hàng / Ban Quản Trị Dự Án**,

Để đội ngũ kỹ thuật hoàn tất việc kết nối chính thức tính năng **Đăng nhập bằng Google (Gmail) & Facebook** và tùy biến nội dung theo đúng nhận diện của Quý đơn vị, kính đề nghị Quý khách hàng cung cấp các thông tin và tài nguyên kỹ thuật theo danh mục hướng dẫn chi tiết dưới đây.

---

### PHẦN 1: TÀI NGUYÊN KẾT NỐI ĐĂNG NHẬP GOOGLE (GMAIL OAUTH 2.0)

Đăng nhập bằng Google giúp học sinh và giáo viên sử dụng chính tài khoản Gmail cá nhân hoặc Email trường học (Google Workspace for Education dạng `@thpt...edu.vn`) để đăng nhập 1-chạm mà không cần nhớ thêm mật khẩu mới.

#### 📌 Thông tin Quý khách cần gửi lại:
1. **Google Client ID** (Định dạng mẫu: `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`)
2. *(Tùy chọn)* **Google Client Secret** (Khóa bí mật)

---

#### 🛠️ Hướng dẫn các bước tự tạo Google Client ID (Mất khoảng 3 - 5 phút):

* **Bước 1:** Đăng nhập vào trang quản trị Google Cloud: [https://console.cloud.google.com](https://console.cloud.google.com) bằng tài khoản Gmail của Quý đơn vị.
* **Bước 2:** Bấm vào danh sách dự án ở thanh tiêu đề trên cùng ➔ Chọn **New Project (Tạo dự án mới)**.
  * Tên dự án (Project Name): Nhập `Su Ky So - Lich Su 10` ➔ Bấm **Create**.
* **Bước 3: Cấu hình màn hình đồng ý (OAuth consent screen):**
  * Vào menu bên trái: Chọn **APIs & Services** ➔ Chọn **OAuth consent screen**.
  * Chọn loại User Type: **External** (Người dùng ngoài) ➔ Bấm **Create**.
  * Nhập thông tin cơ bản:
    * **App name (Tên ứng dụng):** `Sử Ký Số - Lịch Sử 10`
    * **User support email (Email hỗ trợ):** Chọn email của Quý khách.
    * **Developer contact information:** Nhập email kỹ thuật của Quý khách.
  * Bấm **Save and Continue** qua các bước Scopes (Phạm vi) đến khi hoàn tất.
* **Bước 4: Tạo mã xác thực Client ID:**
  * Tại menu bên trái, chọn mục **Credentials (Thông tin xác thực)**.
  * Bấm nút **+ CREATE CREDENTIALS** ở phía trên ➔ Chọn **OAuth client ID**.
  * Chọn **Application type:** `Web application`.
  * Đặt tên: `Sử Ký Số Web Client`.
  * Tại mục **Authorized JavaScript origins (Nguồn gốc JavaScript được ủy quyền)**, bấm **+ ADD URI** và nhập 2 địa chỉ:
    * `https://kysu.fstack.asia` (Địa chỉ web chính thức khi chạy online)
    * `http://localhost:3000` (Địa chỉ test nội bộ khi duyệt bài)
  * Tại mục **Authorized redirect URIs (URI chuyển hướng)**, bấm **+ ADD URI** và nhập:
    * `https://kysu.fstack.asia`
    * `http://localhost:3000`
  * Bấm **Create**.
* **Bước 5:** Một cửa sổ xuất hiện chứa **Your Client ID** ➔ Quý khách vui lòng sao chép toàn bộ chuỗi này và gửi lại cho chúng tôi.

---

### PHẦN 2: TÀI NGUYÊN KẾT NỐI ĐĂNG NHẬP FACEBOOK (FACEBOOK LOGIN)

Dành cho học sinh muốn liên kết tài khoản mạng xã hội Facebook để học bài và chia sẻ kết quả bảng vàng Streak.

#### 📌 Thông tin Quý khách cần gửi lại:
1. **Facebook App ID (Mã ứng dụng)** (Chuỗi gồm khoảng 15-16 chữ số)
2. **App Secret (Khóa bí mật ứng dụng)**

---

#### 🛠️ Hướng dẫn các bước lấy Facebook App ID:

* **Bước 1:** Truy cập [https://developers.facebook.com](https://developers.facebook.com) và đăng nhập bằng tài khoản Facebook của quản trị viên.
* **Bước 2:** Bấm vào **My Apps (Ứng dụng của tôi)** ở góc trên bên phải ➔ Bấm **Create App (Tạo ứng dụng)**.
* **Bước 3:** Chọn mục đích sử dụng: Chọn **Authenticate and request data from users with Facebook Login (Đăng nhập bằng Facebook)** ➔ Bấm **Next**.
* **Bước 4:** Chọn loại ứng dụng: **Website** ➔ Đặt tên hiển thị ứng dụng: `Sử Ký Số` ➔ Nhập email liên hệ ➔ Bấm **Create App**.
* **Bước 5: Cài đặt miền hợp lệ:**
  * Vào menu **App Settings (Cài đặt ứng dụng)** ➔ **Basic (Cơ bản)**.
  * Nhập mục **App Domains (Miền ứng dụng):** `kysu.fstack.asia`
  * Nhập mục **Privacy Policy URL (Chính sách quyền riêng tư):** `https://kysu.fstack.asia/lien-he`
  * Bấm **Save changes (Lưu thay đổi)**.
* **Bước 6:** Trên cùng trang này, Quý khách sẽ thấy mục **App ID (Mã ứng dụng)** ➔ Sao chép mã này gửi lại cho chúng tôi.

---

### PHẦN 3: CÁC TÀI NGUYÊN NỘI DUNG & THƯƠNG HIỆU BỔ SUNG (NẾU CÓ)

Để trang web hoàn thiện mang dấu ấn thương hiệu và nghiệp vụ riêng của Nhà trường / Tổ bộ môn Lịch sử, Quý khách có thể gửi kèm các tài nguyên sau:

1. **Logo & Nhận diện đơn vị:**
   * File ảnh Logo trường hoặc tổ bộ môn (định dạng `.png` nền trong suốt hoặc `.svg`).
2. **Danh sách tài khoản Giáo viên khởi tạo sẵn:**
   * Danh sách gồm: Họ và tên Giáo viên, Email tiếp nhận, Tên lớp phụ trách (ví dụ: *Thầy Nguyễn Văn A - Lớp 10A1, 10A2*). Đội ngũ sẽ tạo sẵn tài khoản có đầy đủ quyền quản lý lớp và giao đề thi.
3. **Bộ câu hỏi trắc nghiệm & Đề kiểm tra bổ sung (File Word / Excel):**
   * Nếu tổ bộ môn có sẵn ngân hàng câu hỏi phân hóa (Nhận biết, Thông hiểu, Vận dụng) cho các bài học cụ thể, có thể gửi file để đội ngũ import đồng loạt lên hệ thống.
4. **Video bài giảng & Tư liệu thực địa của Nhà trường:**
   * Link YouTube các video bài giảng thao giảng, video chuyên đề ngoại khóa lịch sử hoặc hình ảnh di tích địa phương để gắn vào từng chủ đề tương ứng.
5. **Mô hình 3D cổ vật mới (Nếu có):**
   * Định dạng file 3D `.glb`, `.gltf` hoặc đường link mô hình trên Sketchfab nếu đơn vị có phối hợp số hóa thêm hiện vật mới.

---

### 📞 KÊNH TIẾP NHẬN & HỖ TRỢ KỸ THUẬT
Quý khách hàng sau khi lấy được thông tin có thể gửi trực tiếp qua:
* **Zalo / Email phụ trách kỹ thuật dự án.**
* Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ trực tiếp (Ultraviewer / Teamviewer / Google Meet) nếu Quý khách cần người thao tác cài đặt giúp trên Google Cloud Console.

*Trân trọng cảm ơn sự phối hợp của Quý Khách Hàng!*

