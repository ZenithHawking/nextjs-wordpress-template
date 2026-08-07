#!/usr/bin/env python3
"""
Vạn Sao - Auto Post Directus
Chạy mỗi ngày lúc 8h sáng qua cron job
"""

import os
import re
import json
import random
import requests
import unicodedata
from datetime import datetime
from dotenv import load_dotenv
import anthropic

load_dotenv()

# ─── CONFIG ───────────────────────────────────────────────
DIRECTUS_URL     = os.getenv("DIRECTUS_URL", "https://api.vansao.com")
DIRECTUS_TOKEN   = os.getenv("DIRECTUS_TOKEN", "")
SITE_URL         = os.getenv("SITE_URL", "https://vansao.com")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
PEXELS_API_KEY  = os.getenv("PEXELS_API_KEY", "")
TAVILY_API_KEY  = os.getenv("TAVILY_API_KEY", "")

HISTORY_FILE = os.path.join(os.path.dirname(__file__), "history.json")

# ─── CATEGORY THẬT TRÊN DIRECTUS ─────────────────────────
# 1 = Chia sẻ kinh nghiệm, 2 = Dịch vụ khách hàng, 3 = Tin doanh nghiệp, 4 = Uncategorized
CAT_CHIA_SE   = 1
CAT_DICH_VU   = 2
CAT_TIN       = 3
CAT_UNCATEGORIZED = 4

# ─── GÓC ĐỘ VIẾT NGẪU NHIÊN ──────────────────────────────
WRITING_ANGLES = [
    "Viết dạng hướng dẫn từng bước (How-to guide)",
    "Viết dạng top 5 / top 7 lợi ích hoặc tính năng",
    "Viết dạng so sánh: trước và sau khi dùng dịch vụ",
    "Viết dạng giải đáp câu hỏi thường gặp (FAQ)",
    "Viết dạng case study: doanh nghiệp đã thành công nhờ dịch vụ",
    "Viết dạng phân tích xu hướng thị trường liên quan đến chủ đề",
    "Viết dạng checklist: những điều cần biết trước khi chọn dịch vụ",
    "Viết dạng câu chuyện: vấn đề gặp phải → giải pháp → kết quả",
    "Viết dạng so sánh ưu nhược điểm giữa các giải pháp",
    "Viết dạng giới thiệu công nghệ mới nhất trong lĩnh vực",
]

# ─── LỊCH THEO THỨ ────────────────────────────────────────
SCHEDULE = {
    0: {  # Thứ 2
        "type": "fixed",
        "service": "Data Migration - Chuyển đổi dữ liệu",
        "keywords": ["chuyển đổi dữ liệu", "data migration", "di chuyển dữ liệu doanh nghiệp", "migrate database"],
        "pexels_queries": ["data migration server", "database transfer technology", "cloud data migration", "server infrastructure"],
        "category_id": CAT_DICH_VU,
    },
    1: {  # Thứ 3 - xoay vòng sản phẩm
        "type": "rotating",
        "services": [
            {
                "service": "Face Matching - Nhận diện khuôn mặt",
                "keywords": ["nhận diện khuôn mặt", "check-in khuôn mặt", "face recognition AI", "chấm công khuôn mặt"],
                "pexels_queries": ["face recognition biometric", "facial scan security", "AI face detection", "biometric attendance"],
            },
            {
                "service": "Smart Album - Tìm ảnh thông minh",
                "keywords": ["tìm ảnh bằng AI", "smart album", "quản lý ảnh sự kiện", "photo search AI"],
                "pexels_queries": ["smart photo album AI", "photo management technology", "event photography digital", "AI image search"],
            },
            {
                "service": "Smart Translate - Dịch thuật AI",
                "keywords": ["dịch thuật AI", "phần mềm dịch thuật tự động", "dịch đa ngôn ngữ", "AI translation"],
                "pexels_queries": ["translation technology multilingual", "AI language translation", "global communication", "multilingual business"],
            },
        ],
        "category_id": CAT_DICH_VU,
    },
    2: {  # Thứ 4
        "type": "fixed",
        "service": "Thiết kế website chuyên nghiệp",
        "keywords": ["thiết kế website chuyên nghiệp", "làm website doanh nghiệp", "web design chuẩn SEO", "tạo website đẹp"],
        "pexels_queries": ["web design workspace", "website development laptop", "UI UX design modern", "professional website mockup"],
        "category_id": CAT_DICH_VU,
    },
    3: {  # Thứ 5
        "type": "tavily",
        "search_query": "AI technology trends Vietnam business 2026",
        "context": "Triển khai AI doanh nghiệp - xu hướng và ứng dụng thực tế",
        "keywords_base": ["AI doanh nghiệp", "trí tuệ nhân tạo 2026", "công nghệ AI Việt Nam"],
        "pexels_queries": ["artificial intelligence technology", "AI robot business", "machine learning data", "tech innovation"],
        "category_id": CAT_TIN,
    },
    4: {  # Thứ 6
        "type": "tavily",
        "search_query": "technology tips business productivity tools 2026",
        "context": "Chia sẻ kinh nghiệm và mẹo công nghệ hữu ích cho doanh nghiệp",
        "keywords_base": ["kinh nghiệm công nghệ", "mẹo năng suất công việc", "công cụ doanh nghiệp"],
        "pexels_queries": ["business productivity technology", "office technology tips", "digital workspace", "tech business solution"],
        "category_id": CAT_CHIA_SE,
    },
    5: {  # Thứ 7
        "type": "tavily",
        "search_query": "trending tech VPS cloud hosting AI tools news 2026",
        "context": "Chia sẻ kinh nghiệm VPS, cloud, hosting và công cụ AI đang hot",
        "keywords_base": ["VPS cloud hosting", "công cụ AI hot 2026", "xu hướng công nghệ"],
        "pexels_queries": ["cloud server technology", "VPS hosting datacenter", "cloud computing", "server room"],
        "category_id": CAT_CHIA_SE,
    },
    6: {  # Chủ nhật
        "type": "tavily",
        "search_query": "digital transformation small business Vietnam technology 2026",
        "context": "Chia sẻ kinh nghiệm chuyển đổi số cho doanh nghiệp vừa và nhỏ",
        "keywords_base": ["chuyển đổi số doanh nghiệp", "công nghệ SME", "digital transformation Việt Nam"],
        "pexels_queries": ["digital transformation office", "small business technology", "startup tech workspace", "entrepreneur digital"],
        "category_id": CAT_CHIA_SE,
    },
}


def slugify(text: str) -> str:
    text = text.replace("đ", "d").replace("Đ", "D")
    text = unicodedata.normalize("NFD", text)
    text = re.sub(r"[\u0300-\u036f]", "", text)
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def load_history() -> list:
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_history(title: str):
    history = load_history()
    history.append({"title": title, "date": datetime.now().strftime("%Y-%m-%d")})
    history = history[-60:]
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def tavily_search(query: str) -> str:
    try:
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query": query,
                "search_depth": "basic",
                "max_results": 5,
                "include_answer": True,
            },
            timeout=15
        )
        data = response.json()
        answer = data.get("answer", "")
        results = data.get("results", [])
        summaries = [r.get("content", "")[:300] for r in results[:3]]
        return answer + "\n\n" + "\n\n".join(summaries)
    except Exception as e:
        print(f"Tavily error: {e}")
        return ""


def get_today_schedule() -> dict:
    weekday = datetime.now().weekday()
    schedule = SCHEDULE[weekday].copy()

    if schedule["type"] == "rotating":
        week = datetime.now().isocalendar()[1]
        idx = week % len(schedule["services"])
        service = schedule["services"][idx].copy()
        service["category_id"] = schedule["category_id"]
        service["type"] = "fixed"
        return service

    return schedule


def generate_article(schedule: dict, trend_context: str = "") -> dict:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    history = load_history()
    recent_titles = [h["title"] for h in history[-20:]]
    history_str = "\n".join(f"- {t}" for t in recent_titles) if recent_titles else "Chưa có"

    angle = random.choice(WRITING_ANGLES)

    keywords = schedule.get("keywords") or schedule.get("keywords_base", [])
    keyword_main = keywords[0] if keywords else ""
    keywords_all = ", ".join(keywords)

    trend_section = ""
    if trend_context:
        trend_section = f"\nThông tin xu hướng thị trường hiện tại:\n{trend_context[:800]}\n"

    prompt = f"""Bạn là chuyên gia viết content SEO tiếng Việt cho công ty Vạn Sao.

Vạn Sao cung cấp: Thiết kế website, Face Matching, Smart Album, Smart Translate, Data Migration, Triển khai AI.

Thông tin liên hệ (dùng trong CTA):
- Hotline: 08 666 31679
- Email: vansao.contact@gmail.com
- Địa chỉ: TP.HCM

Chủ đề bài hôm nay: **{schedule.get("service") or schedule.get("context", "")}**
Năm hiện tại: {datetime.now().year} — bắt buộc dùng đúng năm này, KHÔNG dùng năm khác.
Từ khóa chính: {keyword_main}
Từ khóa phụ: {keywords_all}
Góc độ viết bắt buộc: {angle}
{trend_section}
QUAN TRỌNG - Các tiêu đề đã đăng gần đây (KHÔNG được viết tương tự, phải khác hoàn toàn về cách diễn đạt và cấu trúc):
{history_str}

Yêu cầu bài viết:
- Độ dài: 1200–2000 chữ
- H2, H3 rõ ràng, cấu trúc logic theo góc độ viết đã chọn
- Tự nhiên, không spam keyword
- CTA cuối bài liên hệ Vạn Sao
- Hướng chuyển đổi, thuyết phục khách hàng

Trả về JSON (chỉ JSON, không markdown, không giải thích):
{{
  "title": "Tiêu đề hoàn toàn mới, độc đáo, hấp dẫn, chứa keyword chính",
  "excerpt": "Tóm tắt 150-160 ký tự, dùng làm mô tả SEO và đoạn preview bài viết",
  "content": "Nội dung HTML đầy đủ với H2, H3, p, ul, li. Không có H1.",
  "pexels_search": "2-4 từ tiếng Anh để tìm ảnh Pexels phù hợp nội dung"
}}"""

    message = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=8000,
        messages=[{"role": "user", "content": prompt}]
    )

    text_block = next(b for b in message.content if b.type == "text")
    raw = text_block.text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip().rstrip("```").strip()

    return json.loads(raw, strict=False)


def get_pexels_images(queries: list, count: int = 3) -> list:
    headers = {"Authorization": PEXELS_API_KEY}
    all_photos = []

    for query in queries:
        page = random.randint(1, 8)
        params = {"query": query, "per_page": count, "orientation": "landscape", "page": page}
        try:
            response = requests.get(
                "https://api.pexels.com/v1/search",
                headers=headers, params=params, timeout=10
            )
            if response.status_code == 200:
                photos = response.json().get("photos", [])
                all_photos.extend(photos)
                if len(all_photos) >= count:
                    break
        except Exception as e:
            print(f"Pexels error ({query}): {e}")

    random.shuffle(all_photos)
    return [
        {"url": p["src"]["large"], "alt": p["alt"] or queries[0], "photographer": p["photographer"]}
        for p in all_photos[:count]
    ]


def inject_inline_images(content: str, images: list) -> str:
    if len(images) < 2:
        return content

    result = content
    search_from = 0

    for img in images[1:3]:
        pos = result.find("</h2>", search_from)
        if pos == -1:
            break
        insert_pos = pos + len("</h2>")
        img_html = (
            f'\n<figure>'
            f'<img src="{img["url"]}" alt="{img["alt"]}" />'
            f'<figcaption>Ảnh: {img["photographer"]} / Pexels</figcaption>'
            f'</figure>\n'
        )
        result = result[:insert_pos] + img_html + result[insert_pos:]
        search_from = insert_pos + len(img_html) + 200

    return result


def create_directus_post(article: dict, featured_image: str | None, content: str, category_id: int) -> dict:
    headers = {
        "Authorization": f"Bearer {DIRECTUS_TOKEN}",
        "Content-Type": "application/json",
    }

    post_data = {
        "title": article["title"],
        "slug": slugify(article["title"]),
        "content": content,
        "excerpt": article.get("excerpt", ""),
        "status": "publish",
        "date_created": datetime.now().isoformat(),
    }
    if featured_image:
        post_data["featured_image"] = featured_image

    response = requests.post(
        f"{DIRECTUS_URL}/items/posts",
        headers=headers,
        json=post_data,
        timeout=30
    )
    result = response.json()
    post = result.get("data")
    if not post:
        print(f"Lỗi tạo bài viết: {result}")
        return {}

    if category_id:
        link = requests.post(
            f"{DIRECTUS_URL}/items/posts_categories",
            headers=headers,
            json={"posts_id": post["id"], "categories_id": category_id},
            timeout=15
        )
        if not link.ok:
            print(f"Lỗi gắn category: {link.status_code} {link.text}")

    return post


def main():
    print(f"[{datetime.now()}] Bắt đầu auto post...")

    schedule = get_today_schedule()
    print(f"Chủ đề: {schedule.get('service') or schedule.get('context', '')}")

    trend_context = ""
    if schedule.get("type") == "tavily":
        print("Đang search trend với Tavily...")
        trend_context = tavily_search(schedule["search_query"])
        print(f"Trend: {len(trend_context)} ký tự")

    print("Đang sinh nội dung với Claude AI...")
    article = generate_article(schedule, trend_context)
    print(f"Title: {article['title']}")

    print("Đang lấy ảnh từ Pexels...")
    pexels_queries = [article.get("pexels_search", "")] + schedule.get("pexels_queries", [])
    pexels_queries = [q for q in pexels_queries if q]
    images = get_pexels_images(pexels_queries, count=3)
    print(f"Lấy được {len(images)} ảnh")

    featured_image = images[0]["url"] if images else None
    content_final = inject_inline_images(article["content"], images)

    print("Đang đăng bài lên Directus...")
    result = create_directus_post(article, featured_image, content_final, schedule.get("category_id", CAT_UNCATEGORIZED))

    if result.get("id"):
        save_history(article["title"])
        print(f"✅ Đăng bài thành công! ID: {result['id']}")
        print(f"   Link: {SITE_URL}/blog/{result.get('slug', '')}")
    else:
        print(f"❌ Lỗi đăng bài: {result}")


if __name__ == "__main__":
    main()
