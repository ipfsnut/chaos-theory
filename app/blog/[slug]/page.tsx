import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS } from '../posts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return POSTS.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS.find(p => p.slug === slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = POSTS.find(p => p.slug === slug)
  if (!post) notFound()

  return (
    <>
      <div className="section-header">
        <Link href="/blog" style={{ color: 'var(--accent)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>
          &larr; All posts
        </Link>
        <div className="blog-date" style={{ marginTop: 'var(--spacing-md)' }}>{post.date}</div>
        <h2>{post.title}</h2>
      </div>

      <article className="blog-card">
        <div className="blog-excerpt">{post.excerpt}</div>
        <div style={{ marginTop: 'var(--spacing-lg)', whiteSpace: 'pre-line', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          {post.content}
        </div>
      </article>
    </>
  )
}
