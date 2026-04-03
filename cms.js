/**
 * cms.js — Dynamic Content Management System
 * Loads content.json and populates the page.
 * Works on GitHub Pages + Cloudflare (fully static).
 */

(function () {
  'use strict';

  const CONTENT_URL = '/content.json';

  // ─── Utility ────────────────────────────────────────────────────────────────

  function set(id, html, attr) {
    const el = document.getElementById(id);
    if (!el) return;
    if (attr) { el.setAttribute(attr.name, attr.value); return; }
    el.innerHTML = html;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setAttr(id, attr, value) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, value);
  }

  // ─── Inject GTM ─────────────────────────────────────────────────────────────

  function injectGTM(id) {
    if (!id) return;
    const s = document.createElement('script');
    s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;
    document.head.insertBefore(s, document.head.firstChild);

    const ns = document.createElement('noscript');
    ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(ns, document.body.firstChild);
  }

  // ─── Inject GA4 ─────────────────────────────────────────────────────────────

  function injectGA(id) {
    if (!id) return;
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s1);

    const s2 = document.createElement('script');
    s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`;
    document.head.appendChild(s2);
  }

  // ─── Populate INDEX page ─────────────────────────────────────────────────────

  function populateIndex(d) {
    const page = detectPage();
    if (page !== 'index') return;

    const { site, hero, about, services, experience, education, certifications, projects, blog_posts, footer } = d;

    // Meta
    document.title = `${site.name} | Global SEO & Ads Manager`;
    set('meta-description', '', { name: 'content', value: site.description });
    set('og-title', '', { name: 'content', value: `${site.name} | Global SEO & Ads Expert` });
    set('og-description', '', { name: 'content', value: site.description });

    // JSON-LD
    const jsonld = document.getElementById('jsonld-person');
    if (jsonld) {
      jsonld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": site.name,
        "url": site.canonical,
        "sameAs": [site.facebook, site.linkedin],
        "jobTitle": site.tagline,
        "description": site.description
      });
    }

    // Hero
    set('hero-badge', hero.badge);
    set('hero-eyebrow', hero.eyebrow);
    set('hero-headline', hero.headline);
    set('hero-description', hero.description);
    set('hero-cta-primary', `${hero.cta_primary} <i data-lucide="arrow-right" width="20"></i>`);
    setText('hero-cta-secondary', hero.cta_secondary);
    setText('hero-stat-value', hero.stat_value);
    setText('hero-stat-label', hero.stat_label);
    setAttr('hero-img', 'src', hero.image);
    setAttr('hero-img', 'alt', hero.image_alt);

    // About
    set('about-headline', about.headline);
    setAttr('about-img', 'src', about.image);
    set('about-lead', about.lead);
    set('about-body', about.body);

    // About stats
    const statsEl = document.getElementById('about-stats');
    if (statsEl && about.stats) {
      statsEl.innerHTML = about.stats.map(s => `
        <div class="card about-card-bg flex-center" style="flex-direction:column; text-align:center; padding:1.5rem;">
          <span class="stat-number">${s.value}</span>
          <span class="stat-label">${s.label}</span>
        </div>
      `).join('');
    }

    // Experience
    const expEl = document.getElementById('experience-list');
    if (expEl && experience) {
      expEl.innerHTML = experience.map(e => `
        <div class="compact-card">
          <h4>${e.title}</h4>
          <p class="role-company">${e.company} | ${e.period}</p>
          <ul class="experience-desc">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      `).join('');
    }

    // Education
    const eduEl = document.getElementById('education-list');
    if (eduEl && education) {
      eduEl.innerHTML = education.map(e => `
        <div class="compact-card">
          <h4>${e.degree}</h4>
          <p class="role-company">${e.school} | ${e.period}</p>
          <ul class="experience-desc">${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      `).join('');
    }

    // Certifications
    const certEl = document.getElementById('certifications-list');
    if (certEl && certifications) {
      certEl.innerHTML = certifications.map(c => `
        <div class="compact-card">
          <h4>${c.title}</h4>
          <p class="role-company">${c.issuer}</p>
          <ul class="experience-desc">${c.points.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      `).join('');
    }

    // Services
    const servicesEl = document.getElementById('services-grid');
    if (servicesEl && services) {
      servicesEl.innerHTML = services.map(s => `
        <div class="card">
          <div class="service-icon"><i data-lucide="${s.icon}" width="24" height="24"></i></div>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
          <div style="margin-top:1rem; display:flex; flex-wrap:wrap; gap:0.5rem;">
            ${s.tags.map(t => `<span class="btn-outline tag-sm">${t}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // Projects
    const projectsEl = document.getElementById('projects-grid');
    if (projectsEl && projects) {
      projectsEl.innerHTML = projects.map(p => `
        <div class="card project-card">
          <div class="project-content">
            ${p.locked ? `
              <div class="locked-overlay">
                <i data-lucide="lock" class="lock-icon" width="64" height="64"></i>
                <h3>${p.title}</h3>
                <p>${p.description}</p>
              </div>
            ` : `
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <h3>${p.title}</h3>
                <span class="btn-outline tag-sm" style="color:var(--primary-color); border-color:var(--primary-color);">${p.result}</span>
              </div>
              <p>${p.description}</p>
              <div style="margin-top:1rem; display:flex; flex-wrap:wrap; gap:0.5rem;">
                ${p.tags.map(t => `<span class="btn-outline tag-sm">${t}</span>`).join('')}
              </div>
            `}
          </div>
        </div>
      `).join('');
    }

    // Blog preview (show first 3)
    const blogPreviewEl = document.getElementById('blog-preview-grid');
    if (blogPreviewEl && blog_posts) {
      blogPreviewEl.innerHTML = blog_posts.slice(0, 3).map(post => `
        <a href="${post.link}" class="card blog-preview-card flex-column">
          <div>
            <div class="blog-date">${post.date}</div>
            <h3 class="blog-title">${post.title}</h3>
            <p>${post.excerpt}</p>
            ${post.bullets ? `<ul class="article-card-list">${post.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
          </div>
          <div class="card-footer">
            <span class="btn-outline tag-sm">${post.tag}</span>
          </div>
        </a>
      `).join('');
    }

    // Contact
    const emailLink = `mailto:${site.email}`;
    const phoneLink = `tel:${site.phone.replace(/[^+\d]/g, '')}`;

    set('contact-email', site.email);
    setAttr('contact-email', 'href', emailLink);
    set('contact-phone', site.phone);
    setAttr('contact-phone', 'href', phoneLink);
    setText('contact-location', site.location);
    setAttr('whatsapp-btn', 'href', `https://wa.me/${site.whatsapp}`);
    setText('whatsapp-number', site.phone);

    // Footer
    setAttr('social-facebook', 'href', site.facebook);
    setAttr('social-linkedin', 'href', site.linkedin);
    setAttr('social-whatsapp', 'href', `https://wa.me/${site.whatsapp}`);
    set('footer-tagline', footer.tagline);
    set('footer-email', site.email);
    setAttr('footer-email', 'href', emailLink);
    set('footer-phone', site.phone);
    setAttr('footer-phone', 'href', phoneLink);
    setText('footer-location', site.location);
    set('footer-copyright', `&copy; ${site.copyright}`);
  }

  // ─── Populate BLOG LIST page ─────────────────────────────────────────────────

  function populateBlog(d) {
    const page = detectPage();
    if (page !== 'blog') return;

    const { site, blog_page, blog_posts, footer } = d;

    document.title = `Blog - ${site.name} | SEO freelancer for Small business`;
    set('blog-headline', blog_page.headline);
    set('blog-subheadline', blog_page.subheadline);

    const gridEl = document.getElementById('blog-grid');
    if (gridEl && blog_posts) {
      gridEl.innerHTML = blog_posts.map(post => `
        <a href="${post.link}" class="card blog-preview-card flex-column">
          <div>
            <div class="blog-date">${post.date}</div>
            <h3 class="blog-title">${post.title}</h3>
            <p>${post.excerpt}</p>
            ${post.bullets ? `<ul class="article-card-list">${post.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
          </div>
          <div class="card-footer">
            <span class="btn-outline tag-sm">${post.tag}</span>
          </div>
        </a>
      `).join('');
    }

    populateFooter(d);
  }

  // ─── Populate ARTICLE page ───────────────────────────────────────────────────

  function populateArticle(d) {
    const page = detectPage();
    if (page !== 'article') return;

    const { site, blog_posts } = d;

    // Find which post this is by matching slug in URL or data attribute
    const bodySlug = document.body.getAttribute('data-slug');
    if (!bodySlug) return;

    const post = blog_posts.find(p => p.slug === bodySlug);
    if (!post) return;

    document.title = `${post.title} | ${site.name}`;

    // Meta
    const metaDesc = document.getElementById('meta-description');
    if (metaDesc) metaDesc.setAttribute('content', post.meta_description);

    // Article header
    set('article-category', post.category);
    set('article-title', post.title);
    set('article-date', post.date);

    // Article body
    if (post.content) {
      const { intro, sections, faqs, cta_text, cta_button } = post.content;

      let html = `<p>${intro}</p>`;

      if (sections) {
        sections.forEach(s => {
          html += `<h2>${s.heading}</h2><p>${s.body}</p>`;
        });
      }

      // FAQ section
      if (faqs && faqs.length) {
        html += `<div class="faq-box"><h3 class="faq-title">Frequently Asked Questions</h3>`;
        faqs.forEach(f => {
          html += `
            <div style="margin-bottom:1.5rem;">
              <p class="faq-question">${f.q}</p>
              <p class="faq-answer">${f.a}</p>
            </div>`;
        });
        html += `</div>`;
      }

      // CTA box
      if (cta_text) {
        html += `
          <div class="cta-box">
            <h3 class="cta-box-title">${cta_text}</h3>
            <a href="/index.html#contact" class="cta-btn-large">${cta_button || 'Get In Touch'}</a>
          </div>`;
      }

      set('article-body', html);
    }

    populateFooter(d);
  }

  // ─── Populate footer (shared) ────────────────────────────────────────────────

  function populateFooter(d) {
    const { site, footer } = d;

    const emailLink = `mailto:${site.email}`;
    const phoneLink = `tel:${site.phone.replace(/[^+\d]/g, '')}`;

    setAttr('social-facebook', 'href', site.facebook);
    setAttr('social-linkedin', 'href', site.linkedin);
    setAttr('social-whatsapp', 'href', `https://wa.me/${site.whatsapp}`);
    set('footer-tagline', footer.tagline);
    set('footer-email', site.email);
    setAttr('footer-email', 'href', emailLink);
    set('footer-phone', site.phone);
    setAttr('footer-phone', 'href', phoneLink);
    setText('footer-location', site.location);
    set('footer-copyright', `&copy; ${site.copyright}`);
  }

  // ─── Page Detection ──────────────────────────────────────────────────────────

  function detectPage() {
    const body = document.body;
    if (body.hasAttribute('data-page')) return body.getAttribute('data-page');

    const path = window.location.pathname;
    if (path === '/' || path.endsWith('index.html') || path === '') return 'index';
    if (path.endsWith('blog.html')) return 'blog';
    if (body.hasAttribute('data-slug')) return 'article';
    return 'index';
  }

  // ─── Boot ────────────────────────────────────────────────────────────────────

  function init() {
    // Determine root path (handles subdirectories like /hire-seo-ads-manager/)
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '/';
    const contentUrl = prefix + 'content.json';

    fetch(contentUrl)
      .then(r => {
        if (!r.ok) throw new Error('content.json not found');
        return r.json();
      })
      .then(data => {
        // Inject tracking
        injectGTM(data.site.gtmId);
        injectGA(data.site.gaId);

        // Populate based on page
        populateIndex(data);
        populateBlog(data);
        populateArticle(data);

        // Re-init Lucide icons after DOM update
        if (window.lucide) lucide.createIcons();
      })
      .catch(err => {
        console.warn('CMS: Could not load content.json —', err.message);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
