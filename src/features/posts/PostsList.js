import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

export const PostsList = () => {
  // используем хук useSelector, который позволяет нам извлекать любые "кусочки" глобального стейта, передавая
  // в него (в хук) в качестве коллбэка заранее определённый либо тут же инлайново написанный селектор
  const posts = useSelector((state) => state.posts)

  // обычно более свежие посты в приложениях находятся выше, чем более старые, поэтому нам надо отсортировать
  // по дате. Метод sort согласно документации сортирует массив "in place", то есть мутирует, чего делать не надо.
  // Поэтому мы заботливо перед сортировкой воспользуемся методом slice() БЕЗ аргументов, что вернёт копию массива.
  const sortedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.data))

  // дальше код, который генерирует JSX, в детали которого я сильно не вдаюсь
  const renderedPosts = sortedPosts.map((post) => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
      {/*Прикрутим к каждому посту ссылку для просмотра полной версии поста на случай, если он объёмный.
      Для этого воспользуемся компонентом Link, который рендерится в обычный <a> и укажем относительный путь*/}
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
