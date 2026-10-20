"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Copy,
  Search,
  Share2,
  X,
} from "lucide-react";
import { ContentSections } from "@/components/sections/shared";
import {
  Badge,
  EmptyState,
  Section,
  SectionHeader,
  TechnologyTags,
} from "@/components/ui/primitives";
import {
  copyToClipboard,
  calculateReadingTime,
  formatDate,
  slugify,
} from "@/lib/formatting";
import { site } from "@/data/site";
import type { BlogPost } from "@/types/content";

export function BlogExplorer({
  posts,
  categories,
  initialCategory = "",
  initialTag = "",
  heading = "Ideas for thoughtful technology decisions",
  description = "Choose a topic or search the collection to find a practical perspective.",
}: {
  posts: BlogPost[];
  categories: string[];
  initialCategory?: string;
  initialTag?: string;
  heading?: string;
  description?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const selectedPost = posts.find((post) => post.slug === selectedSlug);
  const normalizedQuery = query.trim().toLowerCase();
  const availableTags = [
    ...new Set(
      posts
        .filter((post) => !activeCategory || post.category === activeCategory)
        .flatMap((post) => post.tags),
    ),
  ].sort();
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !activeCategory || post.category === activeCategory;
    const matchesTag = !activeTag || post.tags.includes(activeTag);
    const searchableText = [
      post.title,
      post.summary,
      post.category,
      ...post.tags,
    ]
      .join(" ")
      .toLowerCase();
    return (
      matchesCategory && matchesTag && searchableText.includes(normalizedQuery)
    );
  });

  useEffect(() => {
    const syncPostFromUrl = () => {
      const slug = new URLSearchParams(window.location.search).get("post");
      setSelectedSlug(posts.some((post) => post.slug === slug) ? slug : null);
    };
    syncPostFromUrl();
    window.addEventListener("popstate", syncPostFromUrl);
    return () => window.removeEventListener("popstate", syncPostFromUrl);
  }, [posts]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedPost && !dialog.open) dialog.showModal();
    if (!selectedPost && dialog.open) dialog.close();
  }, [selectedPost]);

  function openPost(post: BlogPost) {
    const articleUrl = new URL(window.location.href);
    articleUrl.searchParams.set("post", post.slug);
    window.history.pushState(
      { ...window.history.state, blogPost: post.slug },
      "",
      `${articleUrl.pathname}${articleUrl.search}${articleUrl.hash}`,
    );
    setCopyMessage("");
    setSelectedSlug(post.slug);
  }

  function clearPostFromUrl() {
    setSelectedSlug(null);
    const currentUrl = new URL(window.location.href);
    const currentSlug = currentUrl.searchParams.get("post");
    if (!currentSlug) return;
    if (window.history.state?.blogPost === currentSlug) {
      window.history.back();
      return;
    }
    currentUrl.searchParams.delete("post");
    window.history.replaceState(
      window.history.state,
      "",
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    );
  }

  async function copyShareLink() {
    if (!selectedPost) return;
    const shareUrl = new URL("/blog", window.location.origin);
    shareUrl.searchParams.set("post", selectedPost.slug);
    try {
      await copyToClipboard(shareUrl.toString());
      setCopyMessage("Link copied.");
    } catch (error) {
      setCopyMessage(
        error instanceof Error
          ? error.message
          : "Could not copy the link. Please copy it from your browser address bar.",
      );
    }
  }

  return (
    <Section className="blog-explorer-section">
      <SectionHeader
        eyebrow="Browse the journal"
        title={heading}
        description={description}
      />
      <nav className="blog-category-list" aria-label="Filter by blog category">
        <button
          className={!activeCategory ? "active" : ""}
          type="button"
          aria-pressed={!activeCategory}
          onClick={() => {
            setActiveCategory("");
            setActiveTag("");
          }}
        >
          All articles
        </button>
        {categories.map((category) => (
          <button
            className={activeCategory === category ? "active" : ""}
            type="button"
            aria-pressed={activeCategory === category}
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setActiveTag("");
            }}
          >
            {category}
          </button>
        ))}
      </nav>
      {activeCategory && (
        <nav
          className="blog-topic-list"
          aria-label={`${activeCategory} topics`}
        >
          {availableTags.map((tag) => (
            <Link
              className={activeTag === tag ? "active" : ""}
              href={`/blog/category/${slugify(activeCategory)}/topic/${slugify(tag)}`}
              aria-current={activeTag === tag ? "page" : undefined}
              key={tag}
            >
              {tag}
            </Link>
          ))}
        </nav>
      )}
      <div className="blog-search-field">
        <label htmlFor="blog-search">Search articles</label>
        <div>
          <Search size={18} aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            placeholder="Search by title, topic, or keyword"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="blog-tag-filter">
        <label htmlFor="blog-tag-filter">Filter by topic</label>
        <select
          id="blog-tag-filter"
          value={activeTag}
          onChange={(event) => setActiveTag(event.target.value)}
        >
          <option value="">All topics</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <p className="result-count" role="status" aria-live="polite">
        {filteredPosts.length}{" "}
        {filteredPosts.length === 1 ? "article" : "articles"}
        {activeCategory ? ` in ${activeCategory}` : ""}
      </p>
      {filteredPosts.length ? (
        <div className="blog-card-grid">
          {filteredPosts.map((post) => (
            <button
              className="blog-card"
              type="button"
              key={post.slug}
              aria-haspopup="dialog"
              onClick={() => openPost(post)}
            >
              <span className="blog-card-image">
                <Image
                  src={post.image}
                  alt=""
                  width={1200}
                  height={720}
                  sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                />
              </span>
              <span className="blog-card-body">
                <span className="blog-card-category">{post.category}</span>
                <span className="blog-card-title">{post.title}</span>
                <span className="blog-card-summary">{post.summary}</span>
                <span className="blog-card-meta">
                  <span>
                    <CalendarDays size={15} aria-hidden="true" />
                    {formatDate(post.published)}
                  </span>
                  <span>
                    <Clock3 size={15} aria-hidden="true" />
                    {calculateReadingTime(post.sections)} min read
                  </span>
                </span>
                <span className="blog-card-footer">
                  <span className="blog-card-tags">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                  <span className="blog-card-open">
                    Read article <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching articles"
          description="Try a different search or choose another category."
        >
          <button
            className="text-link"
            type="button"
            onClick={() => {
              setActiveCategory("");
              setActiveTag("");
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </EmptyState>
      )}

      <dialog
        ref={dialogRef}
        className="blog-article-dialog"
        aria-labelledby="blog-article-title"
        onCancel={(event) => {
          event.preventDefault();
          dialogRef.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            dialogRef.current?.close();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialogRef.current?.close();
          }
        }}
        onClose={clearPostFromUrl}
      >
        {selectedPost && (
          <article className="blog-article-modal">
            <header className="blog-article-modal-header">
              <div>
                <Badge>{selectedPost.category}</Badge>
                <h2 id="blog-article-title">{selectedPost.title}</h2>
                <p className="muted">{selectedPost.summary}</p>
              </div>
              <button
                className="icon-button blog-modal-close"
                type="button"
                aria-label="Close article"
                onClick={() => dialogRef.current?.close()}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </header>
            <Image
              className="blog-article-image"
              src={selectedPost.image}
              alt={selectedPost.imageAlt}
              width={1200}
              height={720}
              priority
            />
            <div className="detail-meta blog-article-meta">
              <span>By {selectedPost.author}</span>
              <span>Published {formatDate(selectedPost.published)}</span>
              <span>
                {calculateReadingTime(selectedPost.sections)} min read
              </span>
              <TechnologyTags tags={selectedPost.tags} />
            </div>
            <ContentSections sections={selectedPost.sections} />
            <footer className="blog-article-share">
              <div>
                <h3>
                  <Share2 size={18} aria-hidden="true" />
                  Share this article
                </h3>
                <p className="muted">
                  Copy a link that opens this article directly.
                </p>
              </div>
              <button
                className="button button-secondary"
                type="button"
                onClick={copyShareLink}
              >
                <Copy size={16} aria-hidden="true" />
                Copy link
              </button>
              <a
                className="text-link"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${site.url}/blog?post=${selectedPost.slug}`)}`}
                target="_blank"
                rel="noreferrer"
              >
                Share on LinkedIn
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <p className="blog-copy-message" aria-live="polite">
                {copyMessage}
              </p>
            </footer>
          </article>
        )}
      </dialog>
    </Section>
  );
}
