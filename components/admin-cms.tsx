"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { BlogFaq, BlogPost, ResumeItem, SiteContent } from "@/data/site-content";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { getCmsStatus } from "@/lib/supabase-content";

type AdminCmsProps = {
  initialContent: SiteContent;
  status: ReturnType<typeof getCmsStatus>;
};

type ApiResponse = {
  error?: string;
  message?: string;
  content?: SiteContent;
};

type CmsTab = "site" | "hero" | "about" | "services" | "projects" | "resume" | "blog" | "contact";

function cloneContent(content: SiteContent) {
  return structuredClone(content);
}

function FormField({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      {multiline ? (
        <textarea className="admin-input admin-textarea" onChange={(event) => onChange(event.target.value)} value={value} />
      ) : (
        <input className="admin-input" onChange={(event) => onChange(event.target.value)} value={value} />
      )}
    </label>
  );
}

function SectionCard({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="panel admin-section-card">
      <div className="admin-section-heading">
        <h2>{title}</h2>
        {description ? <p className="section-copy admin-help">{description}</p> : null}
      </div>
      {children}
    </article>
  );
}

function RepeaterCardList<T>({
  items,
  renderItem,
  onAdd,
  onRemove,
  addLabel
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onAdd: () => void;
  onRemove: (index: number) => void;
  addLabel: string;
}) {
  return (
    <div className="admin-repeater-list">
      {items.map((item, index) => (
        <div key={index} className="admin-repeater-card">
          {renderItem(item, index)}
          <button className="button button-secondary" onClick={() => onRemove(index)} type="button">
            Remove
          </button>
        </div>
      ))}

      <button className="button button-secondary" onClick={onAdd} type="button">
        {addLabel}
      </button>
    </div>
  );
}

function BlogPostEditor({
  post,
  onChange
}: {
  post: BlogPost;
  onChange: (nextPost: BlogPost) => void;
}) {
  function updateFaq(index: number, nextFaq: BlogFaq) {
    const nextPost = structuredClone(post);
    nextPost.faqs[index] = nextFaq;
    onChange(nextPost);
  }

  return (
    <div className="admin-blog-post">
      <div className="admin-form-grid">
        <FormField label="Slug" onChange={(value) => onChange({ ...post, slug: value })} value={post.slug} />
        <FormField label="Title" onChange={(value) => onChange({ ...post, title: value })} value={post.title} />
        <FormField label="Display date" onChange={(value) => onChange({ ...post, date: value })} value={post.date} />
        <FormField label="Category" onChange={(value) => onChange({ ...post, category: value })} value={post.category} />
        <FormField label="Read time" onChange={(value) => onChange({ ...post, readTime: value })} value={post.readTime} />
        <FormField label="CTA title" onChange={(value) => onChange({ ...post, cta: { ...post.cta, title: value } })} value={post.cta.title} />
        <FormField label="CTA button label" onChange={(value) => onChange({ ...post, cta: { ...post.cta, buttonLabel: value } })} value={post.cta.buttonLabel} />
        <FormField label="CTA button href" onChange={(value) => onChange({ ...post, cta: { ...post.cta, buttonHref: value } })} value={post.cta.buttonHref} />
      </div>

      <FormField label="Excerpt" multiline onChange={(value) => onChange({ ...post, excerpt: value })} value={post.excerpt} />
      <FormField label="Meta description" multiline onChange={(value) => onChange({ ...post, metaDescription: value })} value={post.metaDescription} />
      <FormField label="Hero intro" multiline onChange={(value) => onChange({ ...post, heroIntro: value })} value={post.heroIntro} />

      <div className="admin-field">
        <span className="admin-label">Blog content</span>
        <RichTextEditor onChange={(value) => onChange({ ...post, contentHtml: value })} value={post.contentHtml} />
      </div>

      <div className="admin-field">
        <span className="admin-label">FAQs</span>
        <div className="admin-repeater-list">
          {post.faqs.map((faq, index) => (
            <div key={`${faq.question}-${index}`} className="admin-repeater-card">
              <div className="admin-form-grid">
                <FormField label="Question" onChange={(value) => updateFaq(index, { ...faq, question: value })} value={faq.question} />
                <FormField label="Answer" multiline onChange={(value) => updateFaq(index, { ...faq, answer: value })} value={faq.answer} />
              </div>
              <button
                className="button button-secondary"
                onClick={() => {
                  const nextPost = structuredClone(post);
                  nextPost.faqs.splice(index, 1);
                  onChange(nextPost);
                }}
                type="button"
              >
                Remove FAQ
              </button>
            </div>
          ))}
          <button
            className="button button-secondary"
            onClick={() => {
              const nextPost = structuredClone(post);
              nextPost.faqs.push({ question: "New question", answer: "New answer" });
              onChange(nextPost);
            }}
            type="button"
          >
            Add FAQ
          </button>
        </div>
      </div>
    </div>
  );
}

function ResumeGroup({
  title,
  items,
  onChange,
  onAdd,
  onRemove
}: {
  title: string;
  items: ResumeItem[];
  onChange: (index: number, nextItem: ResumeItem) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <SectionCard title={title}>
      <RepeaterCardList
        addLabel={`Add ${title.toLowerCase().slice(0, -1)}`}
        items={items}
        onAdd={onAdd}
        onRemove={onRemove}
        renderItem={(item, index) => (
          <div className="admin-form-grid">
            <FormField label="Title" onChange={(value) => onChange(index, { ...item, title: value })} value={item.title} />
            <FormField label="Subtitle" onChange={(value) => onChange(index, { ...item, subtitle: value })} value={item.subtitle} />
            <FormField label="Link" onChange={(value) => onChange(index, { ...item, href: value })} value={item.href ?? ""} />
            <FormField
              label="Points (one per line)"
              multiline
              onChange={(value) =>
                onChange(index, {
                  ...item,
                  points: value
                    .split("\n")
                    .map((point) => point.trim())
                    .filter(Boolean)
                })
              }
              value={item.points.join("\n")}
            />
          </div>
        )}
      />
    </SectionCard>
  );
}

export function AdminCms({ initialContent, status }: AdminCmsProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialContent);
  const [adminSecret, setAdminSecret] = useState("");
  const [feedback, setFeedback] = useState("");
  const [activeTab, setActiveTab] = useState<CmsTab>("site");
  const [isPending, startTransition] = useTransition();

  const tabs: Array<{ id: CmsTab; label: string }> = [
    { id: "site", label: "Site" },
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "resume", label: "Resume" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" }
  ];

  function updateDraft(mutator: (nextContent: SiteContent) => void) {
    setDraft((current) => {
      const nextContent = cloneContent(current);
      mutator(nextContent);
      return nextContent;
    });
  }

  async function refreshLatestContent() {
    setFeedback("Loading latest content...");

    const response = await fetch("/api/content", { cache: "no-store" });
    const payload = (await response.json()) as ApiResponse;

    if (!response.ok || !payload.content) {
      setFeedback(payload.error || "Unable to load the latest content.");
      return;
    }

    setDraft(payload.content);
    setFeedback("Editor refreshed with the latest saved content.");
    router.refresh();
  }

  function saveContent() {
    startTransition(async () => {
      setFeedback("");

      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft, secret: adminSecret })
      });

      const payload = (await response.json()) as ApiResponse;

      if (!response.ok || !payload.content) {
        setFeedback(payload.error || "Saving failed.");
        return;
      }

      setDraft(payload.content);
      setFeedback(payload.message || "Content saved successfully.");
      router.refresh();
    });
  }

  function renderSiteTab() {
    return (
      <div className="admin-stack">
        <SectionCard title="Brand & SEO" description="Core profile, metadata, CTA labels, and footer copy.">
          <div className="admin-form-grid">
            <FormField label="Full name" onChange={(value) => updateDraft((next) => void (next.site.name = value))} value={draft.site.name} />
            <FormField label="Short name" onChange={(value) => updateDraft((next) => void (next.site.shortName = value))} value={draft.site.shortName} />
            <FormField label="Role" onChange={(value) => updateDraft((next) => void (next.site.role = value))} value={draft.site.role} />
            <FormField label="Tagline" onChange={(value) => updateDraft((next) => void (next.site.tagline = value))} value={draft.site.tagline} />
            <FormField label="Website URL" onChange={(value) => updateDraft((next) => void (next.site.url = value))} value={draft.site.url} />
            <FormField label="OG image path" onChange={(value) => updateDraft((next) => void (next.site.ogImage = value))} value={draft.site.ogImage} />
          </div>
          <FormField label="Site description" multiline onChange={(value) => updateDraft((next) => void (next.site.description = value))} value={draft.site.description} />
          <FormField
            label="SEO keywords (comma separated)"
            onChange={(value) =>
              updateDraft((next) => {
                next.site.keywords = value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean);
              })
            }
            value={draft.site.keywords.join(", ")}
          />
        </SectionCard>

        <SectionCard title="Contact & Navigation">
          <div className="admin-form-grid">
            <FormField label="Email" onChange={(value) => updateDraft((next) => void (next.site.email = value))} value={draft.site.email} />
            <FormField label="Phone" onChange={(value) => updateDraft((next) => void (next.site.phone = value))} value={draft.site.phone} />
            <FormField label="WhatsApp number" onChange={(value) => updateDraft((next) => void (next.site.whatsapp = value))} value={draft.site.whatsapp} />
            <FormField label="Location" onChange={(value) => updateDraft((next) => void (next.site.location = value))} value={draft.site.location} />
            <FormField label="Facebook URL" onChange={(value) => updateDraft((next) => void (next.site.facebook = value))} value={draft.site.facebook} />
            <FormField label="LinkedIn URL" onChange={(value) => updateDraft((next) => void (next.site.linkedin = value))} value={draft.site.linkedin} />
            <FormField label="Header CTA label" onChange={(value) => updateDraft((next) => void (next.site.navigationCta.label = value))} value={draft.site.navigationCta.label} />
            <FormField label="Header CTA href" onChange={(value) => updateDraft((next) => void (next.site.navigationCta.href = value))} value={draft.site.navigationCta.href} />
            <FormField label="Footer Explore title" onChange={(value) => updateDraft((next) => void (next.site.footer.exploreTitle = value))} value={draft.site.footer.exploreTitle} />
            <FormField label="Footer Contact title" onChange={(value) => updateDraft((next) => void (next.site.footer.contactTitle = value))} value={draft.site.footer.contactTitle} />
          </div>
          <FormField
            label="Footer copyright"
            onChange={(value) => updateDraft((next) => void (next.site.footer.copyrightText = value))}
            value={draft.site.footer.copyrightText}
          />
        </SectionCard>
      </div>
    );
  }

  function renderHeroTab() {
    return (
      <SectionCard title="Hero Section">
        <div className="admin-form-grid">
          <FormField label="Availability badge" onChange={(value) => updateDraft((next) => void (next.hero.availability = value))} value={draft.hero.availability} />
          <FormField label="Eyebrow" onChange={(value) => updateDraft((next) => void (next.hero.eyebrow = value))} value={draft.hero.eyebrow} />
          <FormField label="Primary CTA label" onChange={(value) => updateDraft((next) => void (next.hero.primaryCta.label = value))} value={draft.hero.primaryCta.label} />
          <FormField label="Primary CTA href" onChange={(value) => updateDraft((next) => void (next.hero.primaryCta.href = value))} value={draft.hero.primaryCta.href} />
          <FormField label="Secondary CTA label" onChange={(value) => updateDraft((next) => void (next.hero.secondaryCta.label = value))} value={draft.hero.secondaryCta.label} />
          <FormField label="Secondary CTA href" onChange={(value) => updateDraft((next) => void (next.hero.secondaryCta.href = value))} value={draft.hero.secondaryCta.href} />
          <FormField label="Hero image path" onChange={(value) => updateDraft((next) => void (next.hero.image.src = value))} value={draft.hero.image.src} />
          <FormField label="Hero image alt" onChange={(value) => updateDraft((next) => void (next.hero.image.alt = value))} value={draft.hero.image.alt} />
          <FormField label="Hero stat value" onChange={(value) => updateDraft((next) => void (next.hero.stat.value = value))} value={draft.hero.stat.value} />
          <FormField label="Hero stat label" onChange={(value) => updateDraft((next) => void (next.hero.stat.label = value))} value={draft.hero.stat.label} />
        </div>
        <FormField label="Headline" multiline onChange={(value) => updateDraft((next) => void (next.hero.headline = value))} value={draft.hero.headline} />
        <FormField label="Description" multiline onChange={(value) => updateDraft((next) => void (next.hero.description = value))} value={draft.hero.description} />
      </SectionCard>
    );
  }

  function renderAboutTab() {
    return (
      <div className="admin-stack">
        <SectionCard title="About Copy">
          <div className="admin-form-grid">
            <FormField label="Section kicker" onChange={(value) => updateDraft((next) => void (next.about.kicker = value))} value={draft.about.kicker} />
            <FormField label="Brands kicker" onChange={(value) => updateDraft((next) => void (next.about.organizationsKicker = value))} value={draft.about.organizationsKicker} />
            <FormField label="About title" onChange={(value) => updateDraft((next) => void (next.about.title = value))} value={draft.about.title} />
            <FormField label="Organizations title" onChange={(value) => updateDraft((next) => void (next.about.organizationsTitle = value))} value={draft.about.organizationsTitle} />
          </div>
          <FormField label="Intro" multiline onChange={(value) => updateDraft((next) => void (next.about.intro = value))} value={draft.about.intro} />
          <FormField label="Body" multiline onChange={(value) => updateDraft((next) => void (next.about.body = value))} value={draft.about.body} />
        </SectionCard>

        <SectionCard title="Stats">
          <RepeaterCardList
            addLabel="Add stat"
            items={draft.about.stats}
            onAdd={() => updateDraft((next) => void next.about.stats.push({ value: "0+", label: "New stat" }))}
            onRemove={(index) =>
              updateDraft((next) => {
                next.about.stats.splice(index, 1);
              })
            }
            renderItem={(item, index) => (
              <div className="admin-form-grid">
                <FormField
                  label="Value"
                  onChange={(value) => updateDraft((next) => void (next.about.stats[index].value = value))}
                  value={item.value}
                />
                <FormField
                  label="Label"
                  onChange={(value) => updateDraft((next) => void (next.about.stats[index].label = value))}
                  value={item.label}
                />
              </div>
            )}
          />
        </SectionCard>

        <SectionCard title="Highlight Cards">
          <RepeaterCardList
            addLabel="Add highlight card"
            items={draft.about.highlightCards}
            onAdd={() =>
              updateDraft((next) => {
                next.about.highlightCards.push({ icon: "users", title: "New highlight", description: "Describe this highlight." });
              })
            }
            onRemove={(index) => updateDraft((next) => void next.about.highlightCards.splice(index, 1))}
            renderItem={(item, index) => (
              <div className="admin-form-grid">
                <FormField
                  label="Icon"
                  onChange={(value) => updateDraft((next) => void (next.about.highlightCards[index].icon = value))}
                  value={item.icon}
                />
                <FormField
                  label="Title"
                  onChange={(value) => updateDraft((next) => void (next.about.highlightCards[index].title = value))}
                  value={item.title}
                />
                <FormField
                  label="Description"
                  multiline
                  onChange={(value) => updateDraft((next) => void (next.about.highlightCards[index].description = value))}
                  value={item.description}
                />
              </div>
            )}
          />
        </SectionCard>

        <SectionCard title="Organizations">
          <RepeaterCardList
            addLabel="Add organization"
            items={draft.about.organizations}
            onAdd={() =>
              updateDraft((next) => {
                next.about.organizations.push({ name: "New organization", logo: "/image/logo.webp", alt: "Organization logo", href: "" });
              })
            }
            onRemove={(index) => updateDraft((next) => void next.about.organizations.splice(index, 1))}
            renderItem={(item, index) => (
              <div className="admin-form-grid">
                <FormField
                  label="Name"
                  onChange={(value) => updateDraft((next) => void (next.about.organizations[index].name = value))}
                  value={item.name}
                />
                <FormField
                  label="Logo path"
                  onChange={(value) => updateDraft((next) => void (next.about.organizations[index].logo = value))}
                  value={item.logo}
                />
                <FormField
                  label="Alt text"
                  onChange={(value) => updateDraft((next) => void (next.about.organizations[index].alt = value))}
                  value={item.alt}
                />
                <FormField
                  label="Link"
                  onChange={(value) => updateDraft((next) => void (next.about.organizations[index].href = value))}
                  value={item.href ?? ""}
                />
              </div>
            )}
          />
        </SectionCard>
      </div>
    );
  }

  function renderServicesTab() {
    return (
      <SectionCard title="Services">
        <div className="admin-form-grid">
          <FormField label="Section kicker" onChange={(value) => updateDraft((next) => void (next.services.kicker = value))} value={draft.services.kicker} />
          <FormField label="Section title" onChange={(value) => updateDraft((next) => void (next.services.title = value))} value={draft.services.title} />
        </div>

        <RepeaterCardList
          addLabel="Add service"
          items={draft.services.items}
          onAdd={() =>
            updateDraft((next) => {
              next.services.items.push({ icon: "search", title: "New service", description: "Describe this service." });
            })
          }
          onRemove={(index) => updateDraft((next) => void next.services.items.splice(index, 1))}
          renderItem={(item, index) => (
            <div className="admin-form-grid">
              <FormField
                label="Icon"
                onChange={(value) => updateDraft((next) => void (next.services.items[index].icon = value))}
                value={item.icon}
              />
              <FormField
                label="Title"
                onChange={(value) => updateDraft((next) => void (next.services.items[index].title = value))}
                value={item.title}
              />
              <FormField
                label="Description"
                multiline
                onChange={(value) => updateDraft((next) => void (next.services.items[index].description = value))}
                value={item.description}
              />
            </div>
          )}
        />
      </SectionCard>
    );
  }

  function renderProjectsTab() {
    return (
      <div className="admin-stack">
        <SectionCard title="Projects Section">
          <div className="admin-form-grid">
            <FormField label="Section kicker" onChange={(value) => updateDraft((next) => void (next.projects.kicker = value))} value={draft.projects.kicker} />
            <FormField label="Section title" onChange={(value) => updateDraft((next) => void (next.projects.title = value))} value={draft.projects.title} />
            <FormField label="Locked title" onChange={(value) => updateDraft((next) => void (next.projects.lockedTitle = value))} value={draft.projects.lockedTitle} />
            <FormField label="Locked CTA label" onChange={(value) => updateDraft((next) => void (next.projects.lockedCtaLabel = value))} value={draft.projects.lockedCtaLabel} />
            <FormField label="Locked CTA href" onChange={(value) => updateDraft((next) => void (next.projects.lockedCtaHref = value))} value={draft.projects.lockedCtaHref} />
          </div>
          <FormField label="Intro" multiline onChange={(value) => updateDraft((next) => void (next.projects.intro = value))} value={draft.projects.intro} />
          <FormField label="Locked description" multiline onChange={(value) => updateDraft((next) => void (next.projects.lockedDescription = value))} value={draft.projects.lockedDescription} />
        </SectionCard>

        <SectionCard title="Project Cards">
          <RepeaterCardList
            addLabel="Add project"
            items={draft.projects.items}
            onAdd={() =>
              updateDraft((next) => {
                next.projects.items.push({
                  title: "New project",
                  category: "Category",
                  description: "Add a project summary.",
                  tags: ["Tag"],
                  image: { src: "/image/logo.webp", alt: "Project logo" },
                  href: "/#contact",
                  ctaLabel: "View project"
                });
              })
            }
            onRemove={(index) => updateDraft((next) => void next.projects.items.splice(index, 1))}
            renderItem={(item, index) => (
              <>
                <div className="admin-form-grid">
                  <FormField label="Title" onChange={(value) => updateDraft((next) => void (next.projects.items[index].title = value))} value={item.title} />
                  <FormField label="Category" onChange={(value) => updateDraft((next) => void (next.projects.items[index].category = value))} value={item.category} />
                  <FormField label="Image path" onChange={(value) => updateDraft((next) => void (next.projects.items[index].image.src = value))} value={item.image.src} />
                  <FormField label="Image alt" onChange={(value) => updateDraft((next) => void (next.projects.items[index].image.alt = value))} value={item.image.alt} />
                  <FormField label="Result" onChange={(value) => updateDraft((next) => void (next.projects.items[index].result = value))} value={item.result ?? ""} />
                  <FormField label="Link" onChange={(value) => updateDraft((next) => void (next.projects.items[index].href = value))} value={item.href ?? ""} />
                  <FormField label="CTA label" onChange={(value) => updateDraft((next) => void (next.projects.items[index].ctaLabel = value))} value={item.ctaLabel ?? ""} />
                  <FormField
                    label="Tags (comma separated)"
                    onChange={(value) =>
                      updateDraft((next) => {
                        next.projects.items[index].tags = value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean);
                      })
                    }
                    value={item.tags.join(", ")}
                  />
                </div>
                <FormField
                  label="Description"
                  multiline
                  onChange={(value) => updateDraft((next) => void (next.projects.items[index].description = value))}
                  value={item.description}
                />
              </>
            )}
          />
        </SectionCard>
      </div>
    );
  }

  function renderResumeTab() {
    return (
      <div className="admin-stack">
        <SectionCard title="Resume Labels">
          <div className="admin-form-grid">
            <FormField label="Resume kicker" onChange={(value) => updateDraft((next) => void (next.resume.kicker = value))} value={draft.resume.kicker} />
            <FormField label="Experience title" onChange={(value) => updateDraft((next) => void (next.resume.experienceTitle = value))} value={draft.resume.experienceTitle} />
            <FormField label="Education title" onChange={(value) => updateDraft((next) => void (next.resume.educationTitle = value))} value={draft.resume.educationTitle} />
            <FormField label="Certifications title" onChange={(value) => updateDraft((next) => void (next.resume.certificationsTitle = value))} value={draft.resume.certificationsTitle} />
          </div>
        </SectionCard>

        <ResumeGroup
          items={draft.resume.experience}
          onAdd={() => updateDraft((next) => void next.resume.experience.push({ title: "New role", subtitle: "Company | Dates", points: ["Achievement or responsibility"] }))}
          onChange={(index, nextItem) => updateDraft((next) => void (next.resume.experience[index] = nextItem))}
          onRemove={(index) => updateDraft((next) => void next.resume.experience.splice(index, 1))}
          title="Experience"
        />

        <ResumeGroup
          items={draft.resume.education}
          onAdd={() => updateDraft((next) => void next.resume.education.push({ title: "Institution", subtitle: "Program | Dates", points: ["Key detail"] }))}
          onChange={(index, nextItem) => updateDraft((next) => void (next.resume.education[index] = nextItem))}
          onRemove={(index) => updateDraft((next) => void next.resume.education.splice(index, 1))}
          title="Education"
        />

        <ResumeGroup
          items={draft.resume.certifications}
          onAdd={() => updateDraft((next) => void next.resume.certifications.push({ title: "Certification", subtitle: "Issuer", points: ["Key learning"] }))}
          onChange={(index, nextItem) => updateDraft((next) => void (next.resume.certifications[index] = nextItem))}
          onRemove={(index) => updateDraft((next) => void next.resume.certifications.splice(index, 1))}
          title="Certifications"
        />
      </div>
    );
  }

  function renderBlogTab() {
    return (
      <div className="admin-stack">
        <SectionCard title="Blog Listing">
          <div className="admin-form-grid">
            <FormField label="Section kicker" onChange={(value) => updateDraft((next) => void (next.blog.kicker = value))} value={draft.blog.kicker} />
            <FormField label="Blog page title" onChange={(value) => updateDraft((next) => void (next.blog.title = value))} value={draft.blog.title} />
            <FormField label="Homepage listing title" onChange={(value) => updateDraft((next) => void (next.blog.listingTitle = value))} value={draft.blog.listingTitle} />
            <FormField label="View all label" onChange={(value) => updateDraft((next) => void (next.blog.viewAllLabel = value))} value={draft.blog.viewAllLabel} />
            <FormField label="Read more label" onChange={(value) => updateDraft((next) => void (next.blog.readMoreLabel = value))} value={draft.blog.readMoreLabel} />
            <FormField label="Open post label" onChange={(value) => updateDraft((next) => void (next.blog.openPostLabel = value))} value={draft.blog.openPostLabel} />
            <FormField label="Back label" onChange={(value) => updateDraft((next) => void (next.blog.backToBlogLabel = value))} value={draft.blog.backToBlogLabel} />
            <FormField label="FAQ heading" onChange={(value) => updateDraft((next) => void (next.blog.faqTitle = value))} value={draft.blog.faqTitle} />
          </div>
          <FormField label="Blog description" multiline onChange={(value) => updateDraft((next) => void (next.blog.description = value))} value={draft.blog.description} />
        </SectionCard>

        <SectionCard title="Blog Posts" description="Each post now uses a rich text body instead of raw JSON sections.">
          <RepeaterCardList
            addLabel="Add blog post"
            items={draft.blog.posts}
            onAdd={() =>
              updateDraft((next) => {
                next.blog.posts.unshift({
                  slug: "new-post",
                  title: "New post title",
                  date: "April 3, 2026",
                  category: "Insights",
                  excerpt: "Short summary for the listing cards.",
                  metaDescription: "SEO meta description for the post.",
                  readTime: "4 min read",
                  heroIntro: "Open with a clear introduction for the article.",
                  contentHtml: "<p>Start writing here.</p>",
                  faqs: [],
                  cta: { title: "Need help with this topic?", buttonLabel: "Get in touch", buttonHref: "/#contact" }
                });
              })
            }
            onRemove={(index) => updateDraft((next) => void next.blog.posts.splice(index, 1))}
            renderItem={(item, index) => (
              <BlogPostEditor
                onChange={(nextPost) => updateDraft((next) => void (next.blog.posts[index] = nextPost))}
                post={item}
              />
            )}
          />
        </SectionCard>
      </div>
    );
  }

  function renderContactTab() {
    return (
      <SectionCard title="Contact Section">
        <div className="admin-form-grid">
          <FormField label="Section kicker" onChange={(value) => updateDraft((next) => void (next.contact.kicker = value))} value={draft.contact.kicker} />
          <FormField label="Title" onChange={(value) => updateDraft((next) => void (next.contact.title = value))} value={draft.contact.title} />
          <FormField label="WhatsApp title" onChange={(value) => updateDraft((next) => void (next.contact.whatsappTitle = value))} value={draft.contact.whatsappTitle} />
          <FormField label="WhatsApp button label" onChange={(value) => updateDraft((next) => void (next.contact.whatsappButtonLabel = value))} value={draft.contact.whatsappButtonLabel} />
        </div>
        <FormField label="Intro" multiline onChange={(value) => updateDraft((next) => void (next.contact.intro = value))} value={draft.contact.intro} />
        <FormField label="WhatsApp description" multiline onChange={(value) => updateDraft((next) => void (next.contact.whatsappDescription = value))} value={draft.contact.whatsappDescription} />
        <FormField label="Footer note" multiline onChange={(value) => updateDraft((next) => void (next.contact.footerNote = value))} value={draft.contact.footerNote} />
      </SectionCard>
    );
  }

  function renderTabContent() {
    switch (activeTab) {
      case "site":
        return renderSiteTab();
      case "hero":
        return renderHeroTab();
      case "about":
        return renderAboutTab();
      case "services":
        return renderServicesTab();
      case "projects":
        return renderProjectsTab();
      case "resume":
        return renderResumeTab();
      case "blog":
        return renderBlogTab();
      case "contact":
        return renderContactTab();
      default:
        return null;
    }
  }

  return (
    <div className="admin-stack">
      <div className="admin-grid">
        <article className="panel">
          <h2>CMS Status</h2>
          <ul className="admin-list">
            <li>Provider: {status.providerLabel}</li>
            <li>Read access: {status.readEnabled ? "Enabled" : "Using bundled fallback content"}</li>
            <li>Write access: {status.writeEnabled ? "Ready" : "Needs Supabase service role key"}</li>
            <li>Admin protection: {status.hasAdminSecret ? "Enabled" : "Needs CMS_ADMIN_SECRET"}</li>
          </ul>
        </article>

        <article className="panel">
          <h2>What is editable?</h2>
          <div className="admin-chip-row">
            {tabs.map((tab) => (
              <span key={tab.id} className="admin-chip">
                {tab.label}
              </span>
            ))}
          </div>
          <p className="section-copy admin-help">
            The public site now reads the same content model the CMS edits, including metadata, homepage sections,
            organization marquee, blog posts, and contact details.
          </p>
        </article>
      </div>

      <article className="panel admin-editor-panel">
        <div className="admin-toolbar">
          <div>
            <h2>Supabase CMS</h2>
            <p className="section-copy admin-help">Edit by section instead of touching raw JSON. Blog posts support rich text.</p>
          </div>

          <div className="admin-actions">
            <button className="button button-secondary" onClick={refreshLatestContent} type="button">
              Reload Latest
            </button>
          </div>
        </div>

        <label className="admin-label" htmlFor="cms-secret">
          Admin Secret
        </label>
        <input
          className="admin-input"
          id="cms-secret"
          onChange={(event) => setAdminSecret(event.target.value)}
          placeholder="Enter CMS_ADMIN_SECRET"
          type="password"
          value={adminSecret}
        />

        <div aria-label="CMS sections" className="admin-tabs" role="tablist">
          {tabs.map((tab) => (
            <button key={tab.id} className={`admin-tab${activeTab === tab.id ? " is-active" : ""}`} onClick={() => setActiveTab(tab.id)} type="button">
              {tab.label}
            </button>
          ))}
        </div>

        {renderTabContent()}

        <div className="admin-save-row">
          <button className="button button-primary" disabled={isPending || !status.writeEnabled || !status.hasAdminSecret} onClick={saveContent} type="button">
            {isPending ? "Saving..." : "Save to Supabase"}
          </button>

          {feedback ? <p className="admin-feedback">{feedback}</p> : null}
        </div>
      </article>
    </div>
  );
}
