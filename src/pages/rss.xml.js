import rss from '@astrojs/rss';
import { excerpt, getPosts } from '../lib/posts';

export async function GET(context) {
	const posts = await getPosts();
	return rss({
		title: 'Proverbial Entropy',
		description: 'Internal musings on modern chaos and the preservation of the soul.',
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: excerpt(post, 60),
			author: post.data.author,
			categories: post.data.categories ? [post.data.categories] : undefined,
			link: `/dispatches/${post.id}/`,
		})),
	});
}
