import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Register from './pages/Register';
import PostDetails from './pages/PostDetails';
import Login from './pages/Login';
import Authers from './pages/Authers';
import EditPosts from './pages/EditPosts';
import UserProfile from './pages/UserProfile';
import AutherPosts from './pages/AutherPosts';
import CategoryPosts from './pages/CategoryPosts';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';
import CreatePost from './pages/CreatePost';
import DeletePosts from './pages/DeletePosts';
import UserProvider from './context/userContext';

const router=createBrowserRouter([
  {
    path:"/",
    element:<UserProvider><Layout/></UserProvider>,
    errorElement:<ErrorPage/>,
    children:[
      {
        index: true,
        element:<Home/>
      },
      {
        path:"posts/:id",
        element:<PostDetails/>
      },
      {
        path:"register",
        element:<Register/>
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"profile/:id",
        element:<UserProfile/>
      },
      {
        path:"authers",
        element:<Authers/>
      },
      {
        path:"create",
        element:<CreatePost/>
      },
      {
        path:"posts/categories/:category",
        element:<CategoryPosts/>
      },
      {
        path:"posts/users/:id",
        element:<AutherPosts/>
      },
      {
        path:"myposts/:id",
        element:<Dashboard/>
      },
      {
        path:"posts/:id/edit",
        element:<EditPosts/>
      },
      {
        path:"posts/:id/delete",
        element:<DeletePosts/>
      },
      {
        path:"logout",
        element:<Logout/>
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
