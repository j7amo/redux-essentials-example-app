import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Navbar } from './app/Navbar'
import { PostsList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { EditPostForm } from './features/posts/EditPostForm'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
                <AddPostForm />
                <PostsList />
              </>
            )}
          />
          {/*ВНИМАНИЕ! то, что передаётся после двоеточия (в нашем случае это postId) становится КЛЮЧОМ в объекте match,
          а то, что находится по факту на этом месте в адресной строке браузера становится ЗНАЧЕНИЕМ в объекте match
          То есть при реальном запросе "/posts/123" в объекте match появится пара ключ-значение "postId: 123"
          и далее мы сможем работать с этой парой через объект match, который прокидывается React Router'ом в компонент*/}

          {/* А дальше становится ещё интереснее. Чтобы иметь возможность работать внутри компонента с объектом match
          у нас есть как минимум 2 варианта:
          1) использовать render-проп, но тогда нужно явным образом прокидывать объект match
          <Route
            exact
            path="/posts/:postId"
            render={({match}) => <SinglePostPage match={match}/>}
          />
          2) использовать проп component и просто передать в него наш компонент, тогда R.Router сделает эту работу за нас*/}
          <Route exact path="/posts/:postId" component={SinglePostPage} />
          <Route exact path="/editpost/:postId" component={EditPostForm} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
