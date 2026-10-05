import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All published dispatches, newest first. Drafts show in `astro dev` only. */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date, style: 'long' | 'short' = 'long'): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: style === 'long' ? 'long' : 'short',
		day: 'numeric',
		timeZone: 'UTC',
	});
}

/** Rough plain text from the markdown body. */
function plainText(body = ''): string {
	return body
		.replace(/&nbsp;/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/[#>*_`~]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

export function readingTime(post: Post): string {
	const words = plainText(post.body).split(' ').filter(Boolean).length;
	return `${Math.max(1, Math.round(words / 230))} min read`;
}

/**
 * The card blurb. Uses the description when it says something the title
 * doesn't; otherwise falls back to the opening lines of the piece.
 */
export function excerpt(post: Post, words = 38): string {
	const desc = (post.data.description ?? '').trim();
	const title = post.data.title.toLowerCase();
	const descIsUseful = desc.length >= 60 && !title.includes(desc.toLowerCase());
	if (descIsUseful) return desc;
	const text = plainText(post.body).split(' ');
	return text.slice(0, words).join(' ') + (text.length > words ? '…' : '');
}

/** Pages CMS stores tags as one string, e.g. "Literature. Politics." */
export function splitList(value?: string): string[] {
	if (!value) return [];
	return value
		.split(/[.,;|]+/)
		.map((t) => t.trim())
		.filter(Boolean);
}
