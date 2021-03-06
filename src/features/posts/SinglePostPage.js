import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectPostById } from './postsSlice'

// здесь нужно обратить внимание на то, что мы деструктурируем пропы и "достаём" из них объект match,
// который нам заботливо передаёт React Router
export const SinglePostPage = ({ match }) => {
  // в объекте match мы имеем доступ к нескольким полям:
  // 1) params - это объект, в котором у нас распарсенные пары "ключ - значение" из url (имеется в виду динамическая
  // часть URL'а - параметры)
  // 2) isExact - флаг, который говорит нам о полном совпадении URL при "переходе" на текущую страницу
  // 3) path - строковый паттерн, который использовался для определения того, на какую страницу "переходить"
  // 4) url - строка, которая представляет собой ту часть URL'а, которая совпала с паттерном при "переходе" на страницу

  // так как нам нужно отобразить вполне конкретный пост(а мы помним, что посты хранятся у нас в Redux'е),
  // то нам нужно сначала понять, какой именно пост хочет увидеть пользователь
  // это можно сделать с помощью поля params объекта match
  // так как мы при написании роутинга после двоеточия написали в строке postId, то это стало ключом и мы можем его достать
  const { postId } = match.params

  // теперь когда мы определили ID нужного нам поста, мы можем обратиться к Redux'у с помощью хука useSelector
  // и "достать" нужные нам для отрисовки данные
  const post = useSelector((state) => selectPostById(state, postId))

  // ВНИМАНИЕ! Интересный момент: никогда раньше не задумывался, но return'ов может быть сколько угодно, оказывается
  // главное, чтобы одновременно отрабатывал только один
  // поэтому напишем тут return некой разметки с текстом, что пост не найден
  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  // ну и напишем разметку на случай, если пост найден
  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        {/* добавим компонент Link для воздействия на адресную строку и как следствие срабатывания роутинга */}
        <Link to={`/editpost/${post.id}`}>Edit post</Link>
      </article>
    </section>
  )
}
