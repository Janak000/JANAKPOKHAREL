"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

type Props = {
  src: string;
  platform: "instagram" | "youtube" | "facebook";
  label: string;
  title: string;
  thumb?: string;
};

/**
 * Click-to-load embed. Third-party players (YouTube alone is about 1 MB of
 * script) used to load as soon as the page did, which dragged down the mobile
 * speed score on every page that showed a post. Now only a light placeholder
 * is rendered, and the real player loads when the visitor taps it.
 */
export function SocialEmbedFrame({ src, platform, label, title, thumb }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={platform === "youtube" ? `${src}?autoplay=1&rel=0` : src}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <button
      type="button"
      className={`social-facade social-facade-${platform}`}
      onClick={() => setLoaded(true)}
      aria-label={`${platform === "youtube" ? "Play" : "Load"} ${label}: ${title}`}
    >
      {thumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" width={480} height={360} loading="lazy" decoding="async" />
      )}
      <span className="social-facade-play">
        <Icon name={platform} size={26} />
      </span>
      <span className="social-facade-label">
        {platform === "youtube" ? "Play video" : `Tap to load ${label.toLowerCase()}`}
      </span>
    </button>
  );
}
