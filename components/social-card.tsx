import { parseSocialUrl } from "@/lib/social-embed";
import { SocialEmbedFrame } from "@/components/social-embed-frame";

/** One embedded Instagram / YouTube / Facebook post (or a plain link card). Shared by /social and the homepage. */
export function SocialCard({ url, title }: { url: string; title?: string }) {
  const e = parseSocialUrl(url);
  return (
    <article className="social-card">
      {e?.kind === "embed" ? (
        <div className="social-frame" style={e.aspect ? { aspectRatio: e.aspect } : { height: e.height }}>
          <SocialEmbedFrame
            src={e.src}
            platform={e.platform}
            label={e.label}
            title={title || e.label}
            thumb={e.thumb}
          />
        </div>
      ) : null}
      <div className="social-meta">
        {title && <h3>{title}</h3>}
        <a href={e?.href ?? url} target="_blank" rel="noopener noreferrer">
          {e ? (e.kind === "embed" ? `Open ${e.label} ↗` : `Open on ${e.label} ↗`) : "Open link ↗"}
        </a>
      </div>
    </article>
  );
}
