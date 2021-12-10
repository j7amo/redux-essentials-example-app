import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import {
  selectAllPosts,
  selectPostStatus,
  selectPostError,
  fetchPosts,
} from './postsSlice'
import { Spinner } from '../../components/Spinner'

// подготовим и инкапсулируем логику формирования разметки каждого отдельного поста (можно было бы сделать это отдельным компонентом,
// но можно и так)
const PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  // используем хук useSelector, который позволяет нам извлекать любые "кусочки" глобального стейта, передавая
  // в него (в хук) в качестве коллбэка заранее определённый либо тут же инлайново написанный селектор
  const posts = useSelector(selectAllPosts)
  const postStatus = useSelector(selectPostStatus)
  const error = useSelector(selectPostError)

  const dispatch = useDispatch()

  // обычно более свежие посты в приложениях находятся выше, чем более старые, поэтому нам надо отсортировать
  // по дате. Метод sort согласно документации сортирует массив "in place", то есть мутирует, чего делать не надо.
  // Поэтому мы заботливо перед сортировкой воспользуемся методом slice() БЕЗ аргументов, что вернёт копию массива.
  // const sortedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.data))

  // используем хук useEffect для того, чтобы задать поведение приложения после рендера
  useEffect(() => {
    // мы решили, что будем фетчить посты только тогда когда у нас статус "idle" - то есть ещё не было получения постов в принципе
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch]) // и хук будет срабатывать только если изменился postStatus и более того postStatus === 'idle'

  // теперь давайте отдельно опишем логику определения того, что мы в итоге будем рендерить, основываясь на том,
  // в какой стадии работа с сервером
  let content

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
