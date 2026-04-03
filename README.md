# Janak Pokharel — Dynamic Portfolio CMS

A fully static portfolio website with a built-in content management system.
**No server required.** Works 100% on GitHub Pages + Cloudflare.

---

## How It Works

All your website content lives in one file: **`content.json`**

The website JavaScript (`cms.js`) loads this file when a visitor opens any page and populates every section automatically. To update anything on your site — text, blog posts, services, contact info — you edit it in the Admin Panel and download a new `content.json`.

---

## File Structure

```
your-repo/
├── index.html          ← Homepage (dynamic, powered by cms.js)
├── blog.html           ← Blog listing page (dynamic)
├── admin.html          ← 🔐 Content editor (password protected)
├── content.json        ← ✏️  ALL your editable content lives here
├── cms.js              ← JavaScript that reads content.json and populates pages
├── style.css           ← Your existing CSS (unchanged)
├── script.js           ← Your existing JS (unchanged)
├── article-template.html ← Copy this to create new article pages
├── robots.txt
├── sitemap.xml
├── CNAME
│
├── blog/               ← Dynamic article pages (using article-template.html)
│   └── seo-vs-meta-ads.html
│
├── hire-seo-ads-manager/  ← Existing article pages (keep as-is)
│   ├── hire-ads-SEO-manager.html
│   └── seo-service.html
│
└── image/              ← Your images
```

---

## Editing Content (No Code Required)

### 1. Open the Admin Panel
Go to: `https://janakpokharel.com.np/admin.html`

**Default password:** `janak2025admin`

> ⚠️ Change the password! Open `admin.html`, find `const PASS = 'janak2025admin';` and replace it with your own.

### 2. Edit Anything
- **Site Settings** — name, email, phone, social links, Google Analytics
- **Hero** — badge, headline, description, CTA buttons
- **About** — bio, stats, profile image
- **Services** — add, edit, remove service cards
- **Experience / Education / Certifications** — your background
- **Projects** — portfolio items
- **Blog Posts** — add new articles, edit existing ones

### 3. Download & Deploy
1. Click **"Download content.json"**
2. Replace the `content.json` in your GitHub repo
3. Commit and push — Cloudflare / GitHub Pages will update automatically

---

## Adding a New Blog Post

### Option A: Through Admin Panel (recommended)
1. Go to `admin.html` → **New Post**
2. Fill in all fields
3. Download `content.json` and push to GitHub

The blog post will appear on `blog.html` automatically.

### Option B: Create a full article page
If you want a dedicated article page (like the existing ones):

1. Copy `article-template.html` to `blog/your-slug.html`
2. Change `data-slug="REPLACE_SLUG_HERE"` to match your post's slug in `content.json`
3. In `content.json`, set the post's `link` to `blog/your-slug.html`
4. Push both files to GitHub

---

## Existing Article Pages

Your existing pages (`hire-seo-ads-manager/hire-ads-SEO-manager.html`, etc.) work exactly as before. They are **not affected** by the CMS.

To make them dynamic too, add `data-slug="your-slug"` to their `<body>` tag and add `<script src="../cms.js"></script>` before `</body>`.

---

## Changing the Admin Password

Open `admin.html` and find line:
```js
const PASS = 'janak2025admin';
```
Replace with a strong password. This is client-side only — do not use for sensitive data.

---

## Deploying to GitHub Pages + Cloudflare

1. Push all files to your GitHub repo (root of the `main` branch)
2. Enable GitHub Pages: Settings → Pages → Source: `main` branch, `/ (root)`
3. Your `CNAME` file points Cloudflare to GitHub Pages
4. Content updates: just replace `content.json` and push

---

## SEO Notes

- Each page already has proper `<title>`, `<meta description>`, Open Graph tags
- The homepage JSON-LD structured data is generated from `content.json`
- `robots.txt` and `sitemap.xml` are included
- `cms.js` injects GTM and GA4 dynamically from your `content.json` settings

---

*Built for janakpokharel.com.np — static CMS powered by content.json*
