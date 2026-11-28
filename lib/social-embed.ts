/**
 * Turns a pasted Instagram / YouTube / Facebook link into a safe iframe source.
 * Only these hosts and strictly validated IDs are ever emitted, so a bad row in
 * the CMS can never inject anything else into the page.
 */
export type SocialEmbed =
  | {
      kind: "embed";
      platform: "instagram" | "youtube" | "facebook";
      label: string;
      src: string;
      /** CSS aspect-ratio for the frame, or a fixed height for tall embeds. */
      aspect?: string;
      height?: number;
      /** Small preview image shown before the player loads (YouTube only). */
      thumb?: string;
      href: string;
    }
  | { kind: "link"; label: string; href: string };

const ID = /^[A-Za-z0-9_-]{5,40}$/;

function parse(raw: string): URL | null {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u : null;
  } catch {
    return null;
  }
}

export function parseSocialUrl(raw: string): SocialEmbed | null {
  const u = parse(raw);
  if (!u) return null;
  const host = u.hostname.replace(/^www\.|^m\./, "").toLowerCase();
  const parts = u.pathname.split("/").filter(Boolean);
  const href = u.toString();

  // ---- YouTube (watch, youtu.be, shorts, live, embed)
  if (host === "youtu.be" && parts[0] && ID.test(parts[0])) {
    return yt(parts[0], false, href);
  }
  if (host === "youtube.com" || host === "music.youtube.com") {
    if (parts[0] === "watch") {
      const v = u.searchParams.get("v") ?? "";
      if (ID.test(v)) return yt(v, false, href);
    }
    if (["shorts", "live", "embed"].includes(parts[0]) && parts[1] && ID.test(parts[1])) {
      return yt(parts[1], parts[0] === "shorts", href);
    }
  }

  // ---- Instagram (post, reel, IGTV)
  if (host === "instagram.com") {
    // /username/reel/CODE/ is also valid, so look at the last two segments.
    const i = parts.findIndex((p) => ["p", "reel", "reels", "tv"].includes(p));
    const code = i >= 0 ? parts[i + 1] : undefined;
    if (code && ID.test(code)) {
      const type = parts[i] === "p" ? "p" : "reel";
      return {
        kind: "embed",
        platform: "instagram",
        label: type === "p" ? "Instagram post" : "Instagram reel",
        src: `https://www.instagram.com/${type}/${code}/embed/`,
        height: 640,
        href,
      };
    }
  }

  // ---- Facebook (posts, photos, videos, reels, watch, fb.watch)
  if (host === "facebook.com" || host === "fb.com" || host === "fb.watch") {
    const clean = `https://${host === "fb.watch" ? "fb.watch" : "www.facebook.com"}${u.pathname}${
      u.pathname.startsWith("/watch") ? u.search : ""
    }`;
    const isVideo =
      host === "fb.watch" || /\/(videos|reel|reels|watch)\b/.test(u.pathname) || u.pathname.startsWith("/watch");
    const enc = encodeURIComponent(clean);
    if (isVideo) {
      return {
        kind: "embed",
        platform: "facebook",
        label: "Facebook video",
        src: `https://www.facebook.com/plugins/video.php?href=${enc}&show_text=false&width=500`,
        aspect: "16 / 9",
        href,
      };
    }
    return {
      kind: "embed",
      platform: "facebook",
      label: "Facebook post",
      src: `https://www.facebook.com/plugins/post.php?href=${enc}&show_text=true&width=500`,
      height: 560,
      href,
    };
  }

  // Anything else (TikTok, X, a blog) is shown as a plain link card.
  return { kind: "link", label: host, href };
}

function yt(id: string, short: boolean, href: string): SocialEmbed {
  return {
    kind: "embed",
    platform: "youtube",
    label: short ? "YouTube short" : "YouTube video",
    src: `https://www.youtube-nocookie.com/embed/${id}`,
    thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    aspect: short ? "9 / 16" : "16 / 9",
    href,
  };
}

/** Icon name (see components/icon.tsx) for a footer social link, by its URL. */
export function socialIconFor(url: string): string {
  const host = (parse(url)?.hostname ?? "").replace(/^www\./, "").toLowerCase();
  if (host.includes("instagram")) return "instagram";
  if (host.includes("youtube") || host === "youtu.be") return "youtube";
  if (host.includes("facebook") || host === "fb.com" || host === "fb.watch") return "facebook";
  if (host.includes("linkedin")) return "linkedin";
  if (host.startsWith("wa.me") || host.includes("whatsapp")) return "message-circle";
  return "arrow-up-right";
}
