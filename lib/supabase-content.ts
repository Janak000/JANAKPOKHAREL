import type { SiteContent } from "@/data/site-content";

import { defaultSiteContent } from "@/data/site-content";
import { createSupabaseReadClient, createSupabaseWriteClient, hasSupabaseReadEnv, hasSupabaseWriteEnv } from "@/lib/supabase";

type CmsStatus = {
  readEnabled: boolean;
  writeEnabled: boolean;
  hasAdminSecret: boolean;
  providerLabel: string;
};

type SaveResult = {
  content: SiteContent;
};

function getAdminSecret() {
  return process.env.CMS_ADMIN_SECRET?.trim() ?? "";
}

function asErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

function ensureAdminSecret(secret: string) {
  const adminSecret = getAdminSecret();

  if (!adminSecret) {
    throw new Error("CMS_ADMIN_SECRET is missing.");
  }

  if (secret !== adminSecret) {
    throw new Error("Invalid admin secret.");
  }
}

export function getCmsStatus(): CmsStatus {
  return {
    readEnabled: hasSupabaseReadEnv(),
    writeEnabled: hasSupabaseWriteEnv(),
    hasAdminSecret: Boolean(getAdminSecret()),
    providerLabel: hasSupabaseReadEnv() ? "Supabase" : "Bundled fallback content"
  };
}

export async function readSupabaseSiteContent(): Promise<SiteContent | null> {
  if (!hasSupabaseReadEnv()) {
    return null;
  }

  try {
    const supabase = createSupabaseReadClient();

    const [
      siteSettingsResult,
      navigationLinksResult,
      heroSectionResult,
      aboutSectionResult,
      aboutStatsResult,
      highlightCardsResult,
      organizationsResult,
      servicesSectionResult,
      servicesResult,
      projectsSectionResult,
      projectsResult,
      projectTagsResult,
      resumeSectionResult,
      resumeEntriesResult,
      resumePointsResult,
      blogSettingsResult,
      blogPostsResult,
      blogFaqsResult,
      contactSectionResult
    ] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase.from("navigation_links").select("*").order("sort_order"),
      supabase.from("hero_sections").select("*").limit(1).maybeSingle(),
      supabase.from("about_sections").select("*").limit(1).maybeSingle(),
      supabase.from("about_stats").select("*").order("sort_order"),
      supabase.from("highlight_cards").select("*").order("sort_order"),
      supabase.from("organizations").select("*").order("sort_order"),
      supabase.from("services_sections").select("*").limit(1).maybeSingle(),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("projects_sections").select("*").limit(1).maybeSingle(),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("project_tags").select("*").order("sort_order"),
      supabase.from("resume_sections").select("*").limit(1).maybeSingle(),
      supabase.from("resume_entries").select("*").order("sort_order"),
      supabase.from("resume_entry_points").select("*").order("sort_order"),
      supabase.from("blog_settings").select("*").limit(1).maybeSingle(),
      supabase.from("blog_posts").select("*").eq("is_published", true).order("sort_order"),
      supabase.from("blog_post_faqs").select("*").order("sort_order"),
      supabase.from("contact_sections").select("*").limit(1).maybeSingle()
    ]);

    const errors = [
      siteSettingsResult.error,
      navigationLinksResult.error,
      heroSectionResult.error,
      aboutSectionResult.error,
      aboutStatsResult.error,
      highlightCardsResult.error,
      organizationsResult.error,
      servicesSectionResult.error,
      servicesResult.error,
      projectsSectionResult.error,
      projectsResult.error,
      projectTagsResult.error,
      resumeSectionResult.error,
      resumeEntriesResult.error,
      resumePointsResult.error,
      blogSettingsResult.error,
      blogPostsResult.error,
      blogFaqsResult.error,
      contactSectionResult.error
    ].filter(Boolean);

    if (errors.length > 0 || !siteSettingsResult.data || !heroSectionResult.data || !aboutSectionResult.data || !servicesSectionResult.data || !projectsSectionResult.data || !resumeSectionResult.data || !blogSettingsResult.data || !contactSectionResult.data) {
      console.warn("Supabase content read failed. Falling back to bundled content.", errors.map(asErrorMessage));
      return null;
    }

    const projectTagsByProject = new Map<string, string[]>();
    for (const tag of projectTagsResult.data ?? []) {
      const tags = projectTagsByProject.get(tag.project_id) ?? [];
      tags.push(tag.tag);
      projectTagsByProject.set(tag.project_id, tags);
    }

    const resumePointsByEntry = new Map<string, string[]>();
    for (const point of resumePointsResult.data ?? []) {
      const points = resumePointsByEntry.get(point.resume_entry_id) ?? [];
      points.push(point.point);
      resumePointsByEntry.set(point.resume_entry_id, points);
    }

    const faqByPost = new Map<string, Array<{ question: string; answer: string }>>();
    for (const faq of blogFaqsResult.data ?? []) {
      const faqs = faqByPost.get(faq.blog_post_id) ?? [];
      faqs.push({
        question: faq.question,
        answer: faq.answer
      });
      faqByPost.set(faq.blog_post_id, faqs);
    }

    const mapResumeEntries = (kind: "experience" | "education" | "certification") =>
      (resumeEntriesResult.data ?? [])
        .filter((entry) => entry.kind === kind)
        .map((entry) => ({
          title: entry.title,
          subtitle: entry.subtitle,
          href: entry.href ?? undefined,
          points: resumePointsByEntry.get(entry.id) ?? []
        }));

    return {
      site: {
        name: siteSettingsResult.data.name,
        shortName: siteSettingsResult.data.short_name,
        role: siteSettingsResult.data.role,
        tagline: siteSettingsResult.data.tagline,
        description: siteSettingsResult.data.description,
        url: siteSettingsResult.data.url,
        email: siteSettingsResult.data.email,
        phone: siteSettingsResult.data.phone,
        whatsapp: siteSettingsResult.data.whatsapp,
        location: siteSettingsResult.data.location,
        facebook: siteSettingsResult.data.facebook_url ?? "",
        linkedin: siteSettingsResult.data.linkedin_url ?? "",
        gtmId: siteSettingsResult.data.gtm_id ?? "",
        gaId: siteSettingsResult.data.ga_id ?? "",
        ogImage: siteSettingsResult.data.og_image_url ?? "/image/janakOG.webp",
        keywords: siteSettingsResult.data.keywords ?? defaultSiteContent.site.keywords,
        navigationCta: {
          label: siteSettingsResult.data.navigation_cta_label,
          href: siteSettingsResult.data.navigation_cta_href
        },
        footer: {
          exploreTitle: siteSettingsResult.data.footer_explore_title,
          contactTitle: siteSettingsResult.data.footer_contact_title,
          copyrightText: siteSettingsResult.data.footer_copyright_text
        }
      },
      navigation: (navigationLinksResult.data ?? []).map((item) => ({
        label: item.label,
        href: item.href
      })),
      hero: {
        availability: heroSectionResult.data.availability,
        eyebrow: heroSectionResult.data.eyebrow,
        headline: heroSectionResult.data.headline,
        description: heroSectionResult.data.description,
        primaryCta: {
          label: heroSectionResult.data.primary_cta_label,
          href: heroSectionResult.data.primary_cta_href
        },
        secondaryCta: {
          label: heroSectionResult.data.secondary_cta_label,
          href: heroSectionResult.data.secondary_cta_href
        },
        image: {
          src: heroSectionResult.data.image_src,
          alt: heroSectionResult.data.image_alt
        },
        stat: {
          value: heroSectionResult.data.stat_value,
          label: heroSectionResult.data.stat_label
        }
      },
      about: {
        kicker: aboutSectionResult.data.kicker,
        title: aboutSectionResult.data.title,
        intro: aboutSectionResult.data.intro,
        body: aboutSectionResult.data.body,
        stats: (aboutStatsResult.data ?? []).map((item) => ({
          label: item.label,
          value: item.value
        })),
        highlightCards: (highlightCardsResult.data ?? []).map((item) => ({
          icon: item.icon,
          title: item.title,
          description: item.description
        })),
        organizationsKicker: aboutSectionResult.data.organizations_kicker,
        organizationsTitle: aboutSectionResult.data.organizations_title,
        organizations: (organizationsResult.data ?? []).map((item) => ({
          name: item.name,
          logo: item.logo_url,
          alt: item.alt,
          href: item.href ?? undefined
        }))
      },
      services: {
        kicker: servicesSectionResult.data.kicker,
        title: servicesSectionResult.data.title,
        items: (servicesResult.data ?? []).map((item) => ({
          icon: item.icon,
          title: item.title,
          description: item.description
        }))
      },
      projects: {
        kicker: projectsSectionResult.data.kicker,
        title: projectsSectionResult.data.title,
        intro: projectsSectionResult.data.intro,
        lockedTitle: projectsSectionResult.data.locked_title,
        lockedDescription: projectsSectionResult.data.locked_description,
        lockedCtaLabel: projectsSectionResult.data.locked_cta_label,
        lockedCtaHref: projectsSectionResult.data.locked_cta_href,
        items: (projectsResult.data ?? []).map((item) => ({
          title: item.title,
          category: item.category,
          description: item.description,
          tags: projectTagsByProject.get(item.id) ?? [],
          image: {
            src: item.image_src,
            alt: item.image_alt
          },
          result: item.result ?? undefined,
          href: item.href ?? undefined,
          ctaLabel: item.cta_label ?? undefined,
          locked: item.is_locked
        }))
      },
      resume: {
        kicker: resumeSectionResult.data.kicker,
        experienceTitle: resumeSectionResult.data.experience_title,
        educationTitle: resumeSectionResult.data.education_title,
        certificationsTitle: resumeSectionResult.data.certifications_title,
        experience: mapResumeEntries("experience"),
        education: mapResumeEntries("education"),
        certifications: mapResumeEntries("certification")
      },
      blog: {
        kicker: blogSettingsResult.data.kicker,
        title: blogSettingsResult.data.title,
        listingTitle: blogSettingsResult.data.listing_title,
        description: blogSettingsResult.data.description,
        viewAllLabel: blogSettingsResult.data.view_all_label,
        readMoreLabel: blogSettingsResult.data.read_more_label,
        openPostLabel: blogSettingsResult.data.open_post_label,
        backToBlogLabel: blogSettingsResult.data.back_to_blog_label,
        faqTitle: blogSettingsResult.data.faq_title,
        posts: (blogPostsResult.data ?? []).map((post) => ({
          slug: post.slug,
          title: post.title,
          date: post.display_date,
          category: post.category,
          excerpt: post.excerpt,
          metaDescription: post.meta_description,
          readTime: post.read_time,
          heroIntro: post.hero_intro,
          contentHtml: post.content_html,
          faqs: faqByPost.get(post.id) ?? [],
          cta: {
            title: post.cta_title,
            buttonLabel: post.cta_button_label,
            buttonHref: post.cta_button_href
          }
        }))
      },
      contact: {
        kicker: contactSectionResult.data.kicker,
        title: contactSectionResult.data.title,
        intro: contactSectionResult.data.intro,
        whatsappTitle: contactSectionResult.data.whatsapp_title,
        whatsappDescription: contactSectionResult.data.whatsapp_description,
        whatsappButtonLabel: contactSectionResult.data.whatsapp_button_label,
        footerNote: contactSectionResult.data.footer_note
      }
    };
  } catch (error) {
    console.warn("Supabase content read failed. Falling back to bundled content.", error);
    return null;
  }
}

async function replaceOrderedTable<T extends Record<string, unknown>>(
  table: string,
  rows: T[],
  deleteFilter: string = "sort_order"
) {
  const supabase = createSupabaseWriteClient();
  await supabase.from(table).delete().gte(deleteFilter, 0);

  if (rows.length > 0) {
    const { error } = await supabase.from(table).insert(rows);

    if (error) {
      throw new Error(`${table} save failed: ${error.message}`);
    }
  }
}

export async function writeSupabaseSiteContent(content: SiteContent, secret: string): Promise<SaveResult> {
  ensureAdminSecret(secret);

  if (!hasSupabaseWriteEnv()) {
    throw new Error("Supabase write environment variables are missing.");
  }

  const supabase = createSupabaseWriteClient();

  const { error: siteSettingsError } = await supabase.from("site_settings").upsert(
    {
      id: "00000000-0000-0000-0000-000000000001",
      name: content.site.name,
      short_name: content.site.shortName,
      role: content.site.role,
      tagline: content.site.tagline,
      description: content.site.description,
      url: content.site.url,
      email: content.site.email,
      phone: content.site.phone,
      whatsapp: content.site.whatsapp,
      location: content.site.location,
      facebook_url: content.site.facebook,
      linkedin_url: content.site.linkedin,
      gtm_id: content.site.gtmId,
      ga_id: content.site.gaId,
      og_image_url: content.site.ogImage,
      keywords: content.site.keywords,
      navigation_cta_label: content.site.navigationCta.label,
      navigation_cta_href: content.site.navigationCta.href,
      footer_explore_title: content.site.footer.exploreTitle,
      footer_contact_title: content.site.footer.contactTitle,
      footer_copyright_text: content.site.footer.copyrightText
    },
    {
      onConflict: "id"
    }
  );

  if (siteSettingsError) {
    throw new Error(`site_settings save failed: ${siteSettingsError.message}`);
  }

  const singletonUpserts = [
    supabase.from("hero_sections").upsert(
      {
        id: "00000000-0000-0000-0000-000000000001",
        availability: content.hero.availability,
        eyebrow: content.hero.eyebrow,
        headline: content.hero.headline,
        description: content.hero.description,
        primary_cta_label: content.hero.primaryCta.label,
        primary_cta_href: content.hero.primaryCta.href,
        secondary_cta_label: content.hero.secondaryCta.label,
        secondary_cta_href: content.hero.secondaryCta.href,
        image_src: content.hero.image.src,
        image_alt: content.hero.image.alt,
        stat_value: content.hero.stat.value,
        stat_label: content.hero.stat.label
      },
      { onConflict: "id" }
    ),
    supabase.from("about_sections").upsert(
      {
        id: "00000000-0000-0000-0000-000000000001",
        kicker: content.about.kicker,
        title: content.about.title,
        intro: content.about.intro,
        body: content.about.body,
        organizations_kicker: content.about.organizationsKicker,
        organizations_title: content.about.organizationsTitle
      },
      { onConflict: "id" }
    ),
    supabase.from("services_sections").upsert(
      {
        id: "00000000-0000-0000-0000-000000000001",
        kicker: content.services.kicker,
        title: content.services.title
      },
      { onConflict: "id" }
    ),
    supabase.from("projects_sections").upsert(
      {
        id: "00000000-0000-0000-0000-000000000001",
        kicker: content.projects.kicker,
        title: content.projects.title,
        intro: content.projects.intro,
        locked_title: content.projects.lockedTitle,
        locked_description: content.projects.lockedDescription,
        locked_cta_label: content.projects.lockedCtaLabel,
        locked_cta_href: content.projects.lockedCtaHref
      },
      { onConflict: "id" }
    ),
    supabase.from("resume_sections").upsert(
      {
        id: "00000000-0000-0000-0000-000000000001",
        kicker: content.resume.kicker,
        experience_title: content.resume.experienceTitle,
        education_title: content.resume.educationTitle,
        certifications_title: content.resume.certificationsTitle
      },
      { onConflict: "id" }
    ),
    supabase.from("blog_settings").upsert(
      {
        id: "00000000-0000-0000-0000-000000000001",
        kicker: content.blog.kicker,
        title: content.blog.title,
        listing_title: content.blog.listingTitle,
        description: content.blog.description,
        view_all_label: content.blog.viewAllLabel,
        read_more_label: content.blog.readMoreLabel,
        open_post_label: content.blog.openPostLabel,
        back_to_blog_label: content.blog.backToBlogLabel,
        faq_title: content.blog.faqTitle
      },
      { onConflict: "id" }
    ),
    supabase.from("contact_sections").upsert(
      {
        id: "00000000-0000-0000-0000-000000000001",
        kicker: content.contact.kicker,
        title: content.contact.title,
        intro: content.contact.intro,
        whatsapp_title: content.contact.whatsappTitle,
        whatsapp_description: content.contact.whatsappDescription,
        whatsapp_button_label: content.contact.whatsappButtonLabel,
        footer_note: content.contact.footerNote
      },
      { onConflict: "id" }
    )
  ];

  const singletonResults = await Promise.all(singletonUpserts);
  const singletonError = singletonResults.find((result) => result.error);
  if (singletonError?.error) {
    throw new Error(singletonError.error.message);
  }

  await replaceOrderedTable(
    "navigation_links",
    content.navigation.map((item, index) => ({
      label: item.label,
      href: item.href,
      sort_order: index
    }))
  );
  await replaceOrderedTable(
    "about_stats",
    content.about.stats.map((item, index) => ({
      label: item.label,
      value: item.value,
      sort_order: index
    }))
  );
  await replaceOrderedTable(
    "highlight_cards",
    content.about.highlightCards.map((item, index) => ({
      icon: item.icon,
      title: item.title,
      description: item.description,
      sort_order: index
    }))
  );
  await replaceOrderedTable(
    "organizations",
    content.about.organizations.map((item, index) => ({
      name: item.name,
      logo_url: item.logo,
      alt: item.alt,
      href: item.href ?? null,
      sort_order: index
    }))
  );
  await replaceOrderedTable(
    "services",
    content.services.items.map((item, index) => ({
      icon: item.icon,
      title: item.title,
      description: item.description,
      sort_order: index
    }))
  );

  await supabase.from("project_tags").delete().gte("sort_order", 0);
  await supabase.from("projects").delete().gte("sort_order", 0);

  if (content.projects.items.length > 0) {
    const { data: insertedProjects, error: projectsError } = await supabase
      .from("projects")
      .insert(
        content.projects.items.map((item, index) => ({
          title: item.title,
          category: item.category,
          description: item.description,
          image_src: item.image.src,
          image_alt: item.image.alt,
          result: item.result ?? null,
          href: item.href ?? null,
          cta_label: item.ctaLabel ?? null,
          is_locked: item.locked ?? false,
          sort_order: index
        }))
      )
      .select("id");

    if (projectsError || !insertedProjects) {
      throw new Error(`projects save failed: ${projectsError?.message ?? "Insert did not return rows."}`);
    }

    const projectTags = content.projects.items.flatMap((item, projectIndex) =>
      item.tags.map((tag, tagIndex) => ({
        project_id: insertedProjects[projectIndex]?.id,
        tag,
        sort_order: tagIndex
      }))
    );

    if (projectTags.length > 0) {
      const { error: projectTagsError } = await supabase.from("project_tags").insert(projectTags);

      if (projectTagsError) {
        throw new Error(`project_tags save failed: ${projectTagsError.message}`);
      }
    }
  }

  await supabase.from("resume_entry_points").delete().gte("sort_order", 0);
  await supabase.from("resume_entries").delete().gte("sort_order", 0);

  const resumeEntries = [
    ...content.resume.experience.map((item) => ({ ...item, kind: "experience" as const })),
    ...content.resume.education.map((item) => ({ ...item, kind: "education" as const })),
    ...content.resume.certifications.map((item) => ({ ...item, kind: "certification" as const }))
  ];

  if (resumeEntries.length > 0) {
    const { data: insertedResumeEntries, error: resumeEntriesError } = await supabase
      .from("resume_entries")
      .insert(
        resumeEntries.map((item, index) => ({
          kind: item.kind,
          title: item.title,
          subtitle: item.subtitle,
          href: item.href ?? null,
          sort_order: index
        }))
      )
      .select("id");

    if (resumeEntriesError || !insertedResumeEntries) {
      throw new Error(`resume_entries save failed: ${resumeEntriesError?.message ?? "Insert did not return rows."}`);
    }

    const resumePoints = resumeEntries.flatMap((item, entryIndex) =>
      item.points.map((point, pointIndex) => ({
        resume_entry_id: insertedResumeEntries[entryIndex]?.id,
        point,
        sort_order: pointIndex
      }))
    );

    if (resumePoints.length > 0) {
      const { error: resumePointsError } = await supabase.from("resume_entry_points").insert(resumePoints);

      if (resumePointsError) {
        throw new Error(`resume_entry_points save failed: ${resumePointsError.message}`);
      }
    }
  }

  await supabase.from("blog_post_faqs").delete().gte("sort_order", 0);
  await supabase.from("blog_posts").delete().gte("sort_order", 0);

  if (content.blog.posts.length > 0) {
    const { data: insertedPosts, error: blogPostsError } = await supabase
      .from("blog_posts")
      .insert(
        content.blog.posts.map((post, index) => ({
          slug: post.slug,
          title: post.title,
          display_date: post.date,
          category: post.category,
          excerpt: post.excerpt,
          meta_description: post.metaDescription,
          read_time: post.readTime,
          hero_intro: post.heroIntro,
          content_html: post.contentHtml,
          cta_title: post.cta.title,
          cta_button_label: post.cta.buttonLabel,
          cta_button_href: post.cta.buttonHref,
          sort_order: index,
          is_published: true
        }))
      )
      .select("id");

    if (blogPostsError || !insertedPosts) {
      throw new Error(`blog_posts save failed: ${blogPostsError?.message ?? "Insert did not return rows."}`);
    }

    const postFaqs = content.blog.posts.flatMap((post, postIndex) =>
      post.faqs.map((faq, faqIndex) => ({
        blog_post_id: insertedPosts[postIndex]?.id,
        question: faq.question,
        answer: faq.answer,
        sort_order: faqIndex
      }))
    );

    if (postFaqs.length > 0) {
      const { error: blogFaqsError } = await supabase.from("blog_post_faqs").insert(postFaqs);

      if (blogFaqsError) {
        throw new Error(`blog_post_faqs save failed: ${blogFaqsError.message}`);
      }
    }
  }

  return {
    content
  };
}
