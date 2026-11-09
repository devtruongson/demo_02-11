# 🏛️ SỬ KÝ SỐ — KHO TƯ LIỆU LỊCH SỬ 10 & STUDIO 3D

> Ứng dụng số hóa học liệu lịch sử bám sát Chương trình GDPT 2018 và tài liệu Nghiệp vụ Sư phạm **"Chủ đề 5: Văn minh Đông Nam Á thời cổ – trung đại"**.

---

## 🚀 Công Nghệ Tích Hợp

* **Frontend**: React 18, Vite, Tailwind CSS, Three.js (WebGL 3D Studio), Lucide React.
* **Backend**: Node.js, Express RESTful API, CORS, Dotenv, mysql2.
* **Cơ sở dữ liệu**: MySQL Server (Database 17: `tinkerai4016_db_test_17` tại `103.200.23.80:3306`).
* **Đồ họa 3D**:
  - **Studio Cổ Vật 3D**: Xoay 360°, phóng to, đổi chế độ khung dây, đổi 3 chế độ ánh sáng (Bảo tàng cổ điển, Ánh sáng mặt trời, Huyền ảo cổ đại).
  - **Quả Cầu Hải Trình 3D**: Tái hiện con đường tơ lụa và hương liệu trên biển Đông Nam Á, định vị các vương quốc cổ (Phù Nam - Óc Eo, Champa, Angkor, Srivijaya, Pagan, Đại Việt...).

---

## 📦 Hướng Dẫn Khởi Chạy

### 1. Khởi chạy Backend (Node.js Express + MySQL)
```bash
cd d:\duan\server
npm run dev
# Máy chủ backend chạy tại http://localhost:4999
```

### 2. Khởi chạy Frontend (React + Vite)
```bash
cd d:\duan\client
npm run dev
# Mở trình duyệt tại http://localhost:3000
```

---

## 🗄️ Cấu Trúc Cơ Sở Dữ Liệu MySQL (DB 17)
- **`topics`**: 7 chủ đề Lịch sử 10 theo chương trình GDPT 2018.
- **`resources`**: 32+ tư liệu lịch sử được trích xuất kỹ lưỡng từ `index (1).html` và đề tài NVSP `Ý TƯỞNG NVSP.pdf` (gồm bối cảnh, niên đại, địa danh, nguồn trích dẫn, ảnh/video và gợi ý khai thác sư phạm).
- **`artifacts_3d`**: 5 bảo vật 3D tương tác (Trống đồng Ngọc Lũ, Đền Borobudur, Đài thờ Linga - Yoni, Bia đá Võ Cạnh, Đại tháp Thạt Luổng).

---

## 📡 Danh Mục REST API Backend
* `GET /api/health`: Kiểm tra kết nối cơ sở dữ liệu MySQL
* `GET /api/stats`: Thống kê số lượng chủ đề, tư liệu, mô hình 3D
* `GET /api/topics`: Lấy danh sách 7 chủ đề kèm số lượng tư liệu
* `GET /api/resources`: Lấy danh sách tư liệu (hỗ trợ tìm kiếm `q`, lọc theo `topic_id`, lọc theo `type`)
* `GET /api/resources/:id`: Xem chi tiết 1 tư liệu
* `POST /api/resources`: Thêm mới tư liệu vào MySQL
* `PUT /api/resources/:id`: Cập nhật thông tin tư liệu
* `DELETE /api/resources/:id`: Xóa tư liệu
* `GET /api/3d-artifacts`: Danh sách các cổ vật 3D

