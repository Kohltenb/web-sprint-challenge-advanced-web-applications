import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { AuthRoute } from '../axios'
import axios from 'axios'
import { ApiGet } from './ApiGet'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState() // () => () => console.log('HERE') DOES NOT WORK AS INTENDED
  const [spinnerOn, setSpinnerOn] = useState(false)
  
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ navigate('/') }
  const redirectToArticles = () => { /* ✨ implement */ navigate('/articles') }


  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.clear()
    setMessage('Goodbye!')
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    const loginInfo = {username, password}
    axios
    .post(loginUrl, loginInfo)
    .then(res => {
      localStorage.setItem('token', res.data.token)
      setMessage(res.data.message)
      navigate('/articles')
      setSpinnerOn(false)
    })
    .catch(err => {
      redirectToLogin()
      setMessage(err.message)
      setSpinnerOn(false)
    })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    ApiGet().get('/articles') 
    .then((res) => {
      setArticles(res.data.articles)
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch(err => {
      redirectToLogin()
      setMessage(err.message)
      setSpinnerOn(false)
    })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    // const newArt = { title, text, topic }
    setMessage('')
    setSpinnerOn(true)
    ApiGet().post('/articles', article)
    .then(res => {
      setMessage(res.data.message)
      ApiGet().get('/articles')
      .then(res => {
        setArticles(res.data.articles)
        setSpinnerOn(false)
      })
    })
    .catch(err => {
      console.log({err})
      setMessage(err.message)
      setSpinnerOn(false)
    })
  }

  const updateArticle = (article) => {
    // ✨ implement
    // You got this!
    console.log(article)
    // const updatedArt = { title: article.title, text: article.text, topic }
    setMessage('')
    setSpinnerOn(true)
    ApiGet().put(`/articles/${article.article_id}`, article)
    .then(res => {
      console.log(res)
      setArticles(articles.map(art => {
        if(art.article_id === res.data.article.article_id) {
          return res.data.article
        } else {
          return art
        }
      }))
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch(err => {
      console.log({err})
      setMessage(err.message)
      setSpinnerOn(false)
    })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)
    ApiGet().delete(`/articles/${article_id}`)
    .then(res => {
      setMessage(res.data.message)
      ApiGet().get('/articles')
      .then(res => {
        setArticles(res.data.articles)
        setSpinnerOn(false)
    })
  })
    .catch(err =>{
      redirectToArticles()
      console.log({err})
      setMessage(err.message)
      setSpinnerOn(false)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="/articles" element={
            <AuthRoute >
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} article={articles} currentArticle={articles.find(a => a.article_id === currentArticleId)}/>
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} />
            </AuthRoute >
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
