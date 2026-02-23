import type { Metadata } from 'next'
import Link from 'next/link'
import { POSTS } from './posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'ChaosTheory announcements and updates.',
}

export default function BlogPage() {
  return (
    <>
      <div className="section-header">
        <h2>Blog</h2>
        <p className="section-desc">Announcements and updates from the ChaosTheory Foundation.</p>
      </div>

      <div className="blog-list">
        {POSTS.map(post => (
          <article key={post.slug} className="blog-card" id={post.slug}>
            <div className="blog-date">{post.date}</div>
            <h3 className="blog-title">
              <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {post.title}
              </Link>
            </h3>
            <div className="blog-excerpt">{post.excerpt}</div>
            <Link href={`/blog/${post.slug}`} style={{ display: 'inline-block', marginTop: 'var(--spacing-md)', color: 'var(--accent)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
              Read more &rarr;
            </Link>
          </article>
        ))}
      </div>
    </>
  )
}
