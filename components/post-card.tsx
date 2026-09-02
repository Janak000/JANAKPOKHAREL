import Link from "next/link";
import type { Post } from "@/lib/types";
import { categorySlug, formatDate } from "@/lib/cms";
import { Icon } from "./icon";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article className={`post-card ${featured ? "post-card-featured" : ""}`}>
      <div className="post-card-meta">
        <Link
          href={`/blog/category/${categorySlug(post.category)}`}
          className="chip chip-accent"
        >
          {post.category}
        </Link>
        <span className="post-card-time">
          <Icon name="clock" size={14} /> {post.readTime}
        </span>
      </div>
      <h3 className="post-card-title">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="post-card-excerpt">{post.excerpt}</p>
      <div className="post-card-footer">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <Link href={`/blog/${post.slug}`} className="text-link">
          Read article <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </article>
  );
}
