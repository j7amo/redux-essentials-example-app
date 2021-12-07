import React from 'react';
import { useSelector } from 'react-redux';

export const PostsList = () => {
	// используем хук useSelector, который позволяет нам извлекать любые "кусочки" глобального стейта, передавая
	// в него (в хук) в качестве коллбэка заранее определённый либо тут же инлайново написанный селектор
	const posts = useSelector(state => state.posts);

	// дальше код, который генерирует JSX, в детали которого я сильно не вдаюсь
	const renderedPosts = posts.map(post => (
			<article className="post-excerpt" key={post.id}>
				<h3>{post.title}</h3>
				<p className="post-content">{post.content.substring(0, 100)}</p>
			</article>
	))

	return (
			<section className="posts-list">
				<h2>Posts</h2>
				{renderedPosts}
			</section>
	)
};