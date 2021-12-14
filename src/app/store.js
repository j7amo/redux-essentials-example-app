import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postsSlice'
import usersReducer from '../features/users/usersSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'

export default configureStore({
  // функция configureStore ожидает в качестве аргумента объект с полем reducer (видимо, такое соглашение),
  // а значением этого поля в свою очередь является другой объект, в котором мы:
  // 1) Объявляем поля, которые мы хотим видеть в стейте (в нашем случае это пока одно поле "posts", что формирует
  // цепочку state.posts в сторе) в виде ключей объекта. Обычно "один слайс = одно такое поле здесь".
  // 2) Значениями этих полей являются объекты, в которых расположены редьюсеры отдельных слайсов.
  // Эти редьюсеры генерируются с помощью функции createSlice при создании каждого слайса.
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
})
