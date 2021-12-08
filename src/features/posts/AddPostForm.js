import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'

import { postAdded } from './postsSlice'

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

  // получаем dispatch
  const dispatch = useDispatch()

  // коллбэки для обработки событий onChange инпутов
  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)

  // коллбэк для обработки клика по кнопке сабмита формы
  const onSavePostClick = () => {
    // небольшая валидация
    if (title && content) {
      dispatch(
        // то, что мы передаём в качестве аргумента в экшен-криэйтор записывается в action.payload судя по всему
        postAdded({
          // генерируем ID
          id: nanoid(),
          title: title,
          content: content,
        })
      )
    }

    // не забываем сбросить значения полей ввода
    setTitle('');
    setContent('');
  }

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClick}>
          Save Post
        </button>
      </form>
    </section>
  )
}
