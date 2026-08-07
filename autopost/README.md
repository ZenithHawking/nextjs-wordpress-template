# Hướng dẫn cài đặt - Vạn Sao Auto Post

## 1. Upload lên server

```bash
scp -r vansao-autopost/ user@your-server:/home/vansao/
```

## 2. Cài đặt trên server

```bash
cd /home/vansao/vansao-autopost
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 3. Tạo file .env

```bash
cp .env.example .env
nano .env
```

Điền thông tin thật vào:
```
DIRECTUS_URL=https://api.vansao.com
DIRECTUS_TOKEN=token có quyền create vào posts + posts_categories
SITE_URL=https://vansao.com
ANTHROPIC_API_KEY=sk-ant-xxx   ← key mới của bạn
PEXELS_API_KEY=...
TAVILY_API_KEY=...
```

`DIRECTUS_TOKEN` cần quyền **Create** trên 2 collection: `posts` và `posts_categories`
(bảng nối gắn category cho bài viết, vì M2M chưa cấu hình sẵn trong Directus).

## 4. Test thủ công

```bash
cd /home/vansao/vansao-autopost
source venv/bin/activate
python3 auto_post.py
```

Kiểm tra bài mới tại `https://api.vansao.com/items/posts` (Directus admin) hoặc trực tiếp
trên frontend `https://vansao.com/blog`.

## 5. Cài cron job (chạy 8h mỗi ngày)

```bash
crontab -e
```

Thêm dòng:
```
0 8 * * * /home/vansao/vansao-autopost/venv/bin/python3 /home/vansao/vansao-autopost/auto_post.py >> /home/vansao/vansao-autopost/auto_post.log 2>&1
```

## 6. Kiểm tra log

```bash
tail -f /home/vansao/vansao-autopost/auto_post.log
```
