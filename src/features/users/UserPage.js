import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from './usersSlice'
import { selectPostsByUser } from '../posts/postsSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => selectUserById(state, userId))

  // старая редакция процесса получения постов для пользователя
  // const postsForUser = useSelector((state) => {
  //   const allPosts = selectAllPosts(state)
  //   // вот здесь интересный момент:
  //   // useSelector запускается каждый раз, когда в приложении диспатчится любое действие и этот хук запускает
  //   // выполнение функции-селектора. Если возвращаемое функцией значение отличается от предыдущего, то произойдёт перерисовка компонента.
  //   // Прикол в том, что мы в функции-селекторе используем метод массива filter, который является немутирующим и всегда возвращает
  //   // новый массив. Это приводит к тому, что при любом задиспатченном в приложении действии компонент UserPage будет перерисован, что ПЛОХО.
  //   // При этом мы всё-таки хотели бы использовать методы массивов. Как быть? Мемоизация!
  //   return allPosts.filter((post) => post.user === userId)
  // })

  // новая редакция получения постов пользователя с использованием мемоизированного селектора selectPostsByUser.
  // до его использования у нас происходила перерисовка компонента UserPage при нажатии кнопки Refresh Notifications,
  // что было неправильно, так как всё, что перерисовывалось это добавление бейджа / наклейки с количеством новых уведомлений
  // на пункт Notifications в компоненте Navbar
  // теперь в Redux Profiler'е отображается только перерисовка компонента Navbar как и положено! =)
  const postsForUser = useSelector((state) => selectPostsByUser(state, userId))

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
