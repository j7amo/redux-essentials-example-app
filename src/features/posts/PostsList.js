import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const PostsList = () => {
  // используем хук useSelector, который позволяет нам извлекать любые "кусочки" глобального стейта, передавая
  // в него (в хук) в качестве коллбэка заранее определённый либо тут же инлайново написанный селектор
  const posts = useSelector((state) => state.posts)

  // дальше код, который генерирует JSX, в детали которого я сильно не вдаюсь
  const renderedPosts = posts.map((post) => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
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
