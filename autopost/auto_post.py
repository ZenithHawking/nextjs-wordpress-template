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

# ─── ĐỊA BÀN PHỤC VỤ ─────────────────────────────────────
# Long An sáp nhập vào Tây Ninh từ 01/7/2025, huyện Đức Hòa giải thể thành 7 xã.
# Địa chỉ pháp lý là xã Mỹ Hạnh, tỉnh Tây Ninh; tên cũ vẫn là từ khóa chính.
BUSINESS_ADDRESS = "Xã Mỹ Hạnh, tỉnh Tây Ninh (Đức Hòa, Long An cũ)"
BUSINESS_HOURS   = "8h30 - 17h00, hỗ trợ 24/7"

# ─── LỊCH ĐĂNG BÀI ───────────────────────────────────────
# 3 bài/tuần: Thứ 2, Thứ 4, Thứ 6. Ngày khác không đăng.
#
# Lịch cũ chạy 7 ngày/tuần và 4 ngày trong đó sinh bài công nghệ chung chung
# (AI doanh nghiệp, chuyển đổi số, công cụ năng suất). Những bài đó không có
# ai tìm, không có ý định mua, và làm loãng chủ đề của cả site — Google xếp
# site vào nhóm nội dung giá trị thấp và không index bài nào.
#
# Lịch mới chỉ sinh bài bám 2 trục: dịch vụ Vạn Sao thật sự bán, và địa bàn
# Vạn Sao thật sự phục vụ.
SCHEDULE = {
    0: {  # Thứ 2 — dịch vụ cốt lõi
        "type": "rotating",
        "services": [
            {
                "service": "Thiết kế website chuẩn SEO cho doanh nghiệp nhỏ",
                "keywords": ["thiết kế website chuẩn SEO", "làm website doanh nghiệp nhỏ", "chi phí thiết kế website", "website bán hàng"],
                "pexels_queries": ["web design workspace", "website development laptop", "small business owner computer"],
            },
            {
                "service": "Chuyển dữ liệu website không mất thứ hạng SEO",
                "keywords": ["chuyển dữ liệu website", "chuyển web không mất SEO", "đổi hosting giữ SEO", "migrate website"],
                "pexels_queries": ["server data transfer", "database migration technology", "web hosting datacenter"],
            },
            {
                "service": "Tổ chức sự kiện và tiệc cưới trọn gói",
                "keywords": ["tổ chức sự kiện", "tiệc cưới trọn gói", "dịch vụ sự kiện doanh nghiệp", "check-in sự kiện QR"],
                "pexels_queries": ["wedding reception venue", "corporate event stage", "event checkin guests"],
            },
            {
                "service": "Bảng giá và quy trình làm website — giải đáp cho người mới",
                "keywords": ["giá thiết kế website", "làm website mất bao lâu", "quy trình thiết kế website", "nên thuê hay tự làm website"],
                "pexels_queries": ["business meeting consultation", "price planning desk", "web designer client"],
            },
        ],
        "category_id": CAT_DICH_VU,
    },
    2: {  # Thứ 4 — theo địa bàn
        "type": "rotating",
        "services": [
            {
                "service": "Thiết kế website tại Hậu Nghĩa (Đức Hòa cũ)",
                "keywords": ["thiết kế website Hậu Nghĩa", "làm web Hậu Nghĩa", "thiết kế website Đức Hòa", "web doanh nghiệp Tây Ninh"],
                "pexels_queries": ["local business storefront", "small town shop owner", "vietnam street business"],
            },
            {
                "service": "Thiết kế website tại Bến Lức",
                "keywords": ["thiết kế website Bến Lức", "làm web Bến Lức", "web doanh nghiệp Bến Lức", "thiết kế website Tây Ninh"],
                "pexels_queries": ["industrial park factory", "logistics warehouse", "business district vietnam"],
            },
            {
                "service": "Thiết kế website tại Củ Chi",
                "keywords": ["thiết kế website Củ Chi", "làm web Củ Chi", "web doanh nghiệp Củ Chi", "thiết kế website ngoại thành"],
                "pexels_queries": ["suburban business", "farm produce business", "local workshop"],
            },
            {
                "service": "Thiết kế website cho doanh nghiệp trong khu công nghiệp Đức Hòa",
                "keywords": ["website khu công nghiệp Đức Hòa", "web nhà máy Đức Hòa", "thiết kế website KCN Xuyên Á", "web B2B Đức Hòa"],
                "pexels_queries": ["factory production line", "industrial manufacturing", "warehouse logistics"],
            },
        ],
        "category_id": CAT_DICH_VU,
    },
    4: {  # Thứ 6 — theo ngành nghề khách hàng
        "type": "rotating",
        "services": [
            {
                "service": "Website cho xưởng cơ khí, gia công, sản xuất",
                "keywords": ["website xưởng cơ khí", "web công ty sản xuất", "website gia công", "web B2B nhà máy"],
                "pexels_queries": ["metal workshop machinery", "cnc machining factory", "welding manufacturing"],
            },
            {
                "service": "Website cho cửa hàng vật liệu xây dựng và nội thất",
                "keywords": ["website vật liệu xây dựng", "web cửa hàng nội thất", "website bán vật tư", "web bán hàng xây dựng"],
                "pexels_queries": ["building materials store", "furniture showroom", "construction supply"],
            },
            {
                "service": "Website cho nhà hàng, quán ăn và dịch vụ tiệc",
                "keywords": ["website nhà hàng", "web quán ăn", "website đặt tiệc", "menu online nhà hàng"],
                "pexels_queries": ["restaurant interior dining", "vietnamese food restaurant", "catering event food"],
            },
            {
                "service": "Website cho nhà trọ, phòng cho thuê công nhân",
                "keywords": ["website nhà trọ", "web cho thuê phòng trọ", "đăng tin phòng trọ online", "nhà trọ công nhân khu công nghiệp"],
                "pexels_queries": ["apartment rental building", "room for rent", "residential housing"],
            },
        ],
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


def get_today_schedule() -> dict | None:
    """Return today's topic, or None on a day we do not publish."""
    weekday = datetime.now().weekday()
    if weekday not in SCHEDULE:
        return None
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

Vạn Sao cung cấp: Thiết kế website chuẩn SEO, Tổ chức sự kiện - tiệc cưới, Chuyển dữ liệu web,
Face Matching, Smart Album, Smart Translate.

Thông tin liên hệ (dùng trong CTA, ghi ĐÚNG như dưới đây):
- Hotline / Zalo: 08 666 31679
- Email: vansao.contact@gmail.com
- Địa chỉ: {BUSINESS_ADDRESS}
- Giờ làm việc: {BUSINESS_HOURS}

BỐI CẢNH ĐỊA PHƯƠNG (bắt buộc nắm đúng, viết sai là mất uy tín):
- Từ 01/7/2025 tỉnh Long An đã sáp nhập vào tỉnh Tây Ninh.
- Huyện Đức Hòa không còn tồn tại, được sắp xếp lại thành 7 xã.
- Trụ sở Vạn Sao thuộc xã Mỹ Hạnh, tỉnh Tây Ninh.
- Người dân vẫn quen gọi "Đức Hòa" và "Long An" nên VẪN dùng các tên này làm
  từ khóa trong bài, nhưng khi nêu địa chỉ pháp lý thì phải ghi tên hiện hành.
- KHÔNG viết "huyện Đức Hòa, tỉnh Long An" như một địa danh đang tồn tại.

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
- Viết cho chủ doanh nghiệp nhỏ đọc, không viết cho dân kỹ thuật. Câu ngắn,
  cụ thể, có con số. Tránh từ sáo rỗng kiểu "đột phá", "cách mạng", "kỷ nguyên".
- Nêu con số và mốc thời gian thật khi có: giá 1–3 triệu (web cơ bản),
  4–8 triệu (web bán hàng), 8–15 triệu+ (web nâng cao); bàn giao 5–10 ngày;
  bảo hành 2 năm.
- BẮT BUỘC có một mục H2 đúng tiêu đề "Câu hỏi thường gặp", bên trong là 5–8
  cặp H3 (câu hỏi) + đoạn p (câu trả lời 2–4 câu). Website tự sinh FAQ schema
  từ mục này để lấy rich result trên Google, nên cấu trúc phải đúng.
- CTA cuối bài liên hệ Vạn Sao, kèm địa chỉ và hotline ở trên.
- Hướng chuyển đổi, thuyết phục khách hàng

Trả về JSON (chỉ JSON, không markdown, không giải thích):
{{
  "title": "Tiêu đề hoàn toàn mới, độc đáo, hấp dẫn, chứa keyword chính",
  "excerpt": "Mô tả SEO 140-158 ký tự. Phải là một câu hoàn chỉnh mời đọc, chứa từ khóa chính, KHÔNG chép lại câu đầu bài, KHÔNG kết thúc giữa chừng.",
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
    if schedule is None:
        print("Hôm nay không có lịch đăng bài. Thoát.")
        return

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
