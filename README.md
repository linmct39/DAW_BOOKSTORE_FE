<<<<<<< HEAD
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f7823c75-ec9d-478d-8657-b88694890374

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
=======
# DAW_BOOKSTORE_FE

Git Workflow (Quy trình làm việc)
Chúng ta sử dụng chiến lược Feature Branch Workflow để tránh conflict code.
Cấu trúc nhánh (Branch Structure)
main: Nơi chứa code ổn định nhất (Production stable). Chỉ merge khi đã review kỹ.
dev: Nhánh phát triển chính (Development branch). Mọi tính năng mới sẽ được merge vào đây trước.
feature/*: Nhánh dành cho từng chức năng cụ thể

Quy trình tạo nhánh và code
Tuyệt đối KHÔNG code trực tiếp trên nhánh main hoặc dev.
- Khi bắt đầu một task mới (Ví dụ: làm tính năng Giỏ hàng), hãy làm theo các bước sau:
  + Chuyển sang nhánh dev:
git checkout dev
  +Cập nhật code mới nhất từ nhóm:
git pull origin dev
  +Tạo nhánh mới từ dev để làm việc:
git checkout -b feature/ten-chuc-nang-cua-ban
  +Sau khi code xong: git add . -> git commit -m "mô tả rõ bạn vừa làm gì" -> git push origin feature/ten-chuc-nang-cua-ban.
  +Lên GitHub tạo Pull Request (PR) vào nhánh dev và chờ mọi người review.

Quy định cấu trúc thư mục (Folder Structure)
Để đảm bảo code clean và dễ bảo trì, mọi người tuân thủ cách đặt file như sau:
/src/pages: Chỉ chứa các file giao diện tổng (UI). Tuyệt đối không viết fetch/axios gọi API trực tiếp ở đây.
/src/services: Nơi chứa MỌI hàm gọi API. Mọi người viết API theo từng module (vd: userService.js, bookService.js).
/src/config/axiosClient.js: Đã cấu hình sẵn, tự động đính kèm Token khi gọi API. Chú ý sử dụng file này thay vì import axios thuần.
/src/components: Chứa các component dùng chung (Nút bấm, thẻ sách, Input,...).
Lưu ý: Nếu có file bị lỗi hoặc conflict, hãy nhắn ngay lên group để cùng xử lý, không tự ý force push (git push -f).
>>>>>>> 156c5038acb97a9a2884893b832afc0454ed22cb
