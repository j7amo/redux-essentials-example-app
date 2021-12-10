import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { addNewPost } from './postsSlice'

export const AddPostForm = () => {
  // возвращаем JSX, в детали которого я особо не вдаюсь
  // Единственное на что нужно обратить внимание это на то, что мы делаем контролируемую форму:
  // 1) Источником истины (единственным местом хранения состояния) будет стейт компонента (в Redux нет смысла засовывать).
  // 2) Попадать в стейт компонента данные будут при каждом изменении соответствующего контрола (инпута).
  // Итоговый флоу данных в форме такой:
  // 1) Пользователь вводит символ.
  // 2) Наступает событие change.
  // 3) Срабатывает подписка onChange, что приводит к вызову переданного туда коллбэка.
  // 4) Коллбэк обновляет стейт компонента.
  // 5) Компонент как следствие перерисовывается и в value инпута из стейта подставляется значение.
  // То есть идея в том, что пользователь напрямую не задаёт значение инпутам. Это делает Реакт.

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  // получаем из стейта доступных пользователей (теперь в стейте появилось новое поле state.users, где будут храниться
  // актуальные данные всех пользователей
  const users = useSelector((state) => state.users)

  // получаем dispatch
  const dispatch = useDispatch()

  // коллбэки для обработки событий onChange инпутов
  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  // добавим флаг, на основе которого мы будем принимать решение об активности кнопки
  const canSave =
      [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  // коллбэк для обработки клика по кнопке сабмита формы
  // const onSavePostClick = () => {
  //   // небольшая валидация
  //   if (title && content) {
  //     dispatch(
  //       // то, что мы передаём в качестве аргумента в экшен-криэйтор записывается в action.payload согласно документации RTK
  //       // здесь нужно обратить внимание на то, что в первой редакции кода мы в экшен-криэйтор передавали вполне конкретный объект,
  //       // что приводило к тому, что наш React-компонент был вынужден ЗНАТЬ, как именно должен выглядеть этот объект, что
  //       // вообще говоря - не очень. По-хорошему React-компонент НЕ должен знать о деталях реализации стейта в Redux.
  //       // postAdded({
  //       //           // генерируем ID
  //       //           id: nanoid(),
  //       //           title: title,
  //       //           content: content,
  //       //         }
  //       // ==============================
  //       // Теперь же во 2-ой редакции мы передаём нужные данные, но в произвольной форме - в виде обычного списка аргументов,
  //       // правильный объект теперь будет формироваться в Redux-слое в конкретном слайсе postsSlice с помощью коллбэка prepare
  //       postAdded(title, content, userId)
  //     )
  //   }
  //
  //   // не забываем сбросить значения полей ввода
  //   setTitle('')
  //   setContent('')
  // }

  // далее очень интересно... первый раз с таким сталкиваюсь, но:
  // делаем коллбэк, который отработает по нажатию кнопки добавления поста АСИНХРОННЫМ
  const onSavePostClicked = async () => {
    if (canSave) {
      // а где async + await, там конечно же и try + catch
      try {
        setAddRequestStatus('pending')
        // если посмотреть на код onSavePostClicked, то можно увидеть, что только в этой строке у нас происходит асинхронное действие
        // поэтому, чтобы сохранить порядок выполнения кода ( а мы хотим убедиться в том, что запрос на сервер прошёл и ответ пришёл
        // и теперь мы можем спокойно занулить соотв. поля для ввода) используем оператор await.
        // Но это не вся магия: addNewPost был получен с помощью createAsyncThunk, который в свою очередь обрабатывает ошибки ВНУТРИ себя и
        // затем просто возвращает последний задиспатченный экшен. То есть наружу ошибки он не выдаёт.
        // А нам прямо здесь в компоненте нужно как-то понять, что произошло и предпринять
        // какие-то действия в случае успеха и в случае неудачи. Для этих целей в RTK есть функция unwrap. Она позволяет получить промис,
        // который либо зарезолвился с payload'ом, либо зареджектился с ошибкой. А так как вся эта история у нас завёрнута в try + catch,
        // то мы можем разветвить логику на основании этих кейсов (такой импровизированный if - else)
        await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        // сделали unwrap, ничего не "сломалось" (значит, промис зарезолвился) и мы остались в блоке try и выполнили инструкции ниже (обнулили поля)
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        // сделали unwrap, всё "сломалось", попали в блок catch и решили в консоль выкинуть сообщение с ошибкой
        // если бы мы не сделали unwrap, то createAsyncThunk все ошибки бы проглотил
        console.error('Failed to save the post: ', err)
      } finally {
        // и пользуемся тем, что в конструкции try - catch - finally последний блок выполняется по-любому и переключаем статус обратно
        setAddRequestStatus('idle')
      }
    }
  }

  // генерируем элементы <option>
  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""/>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}
