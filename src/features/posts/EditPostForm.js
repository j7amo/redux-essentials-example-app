import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postUpdated } from './postsSlice'
import { useHistory } from 'react-router-dom'

export const EditPostForm = ({ match }) => {
  // снова достаём из объекта match и его подобъекта params нужный нам postId
  const { postId } = match.params
  // с помощью хука useSelector и postId достаём из глобального стейта нужный нам объект поста
  const post = useSelector((state) =>
    state.posts.find((post) => post.id === postId)
  )

  // используем значения его полей для того, чтобы задать начальные значения соответствующих инпутов нашей формы
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const dispatch = useDispatch()
  // для разнообразия воспользуемся history API, для этого "достанем" объект history с помощью хука useHistory
  const history = useHistory()

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)

  const onSavePostClick = () => {
    if (title && content) {
      dispatch(
        postUpdated({
          id: postId,
          title: title,
          content: content,
        })
      )
      // теперь вызываем метод push на объекте history и передаём туда URL, на который хотим перейти
      history.push(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit post</h2>
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
