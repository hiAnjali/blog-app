import React, {useContext, useState,useEffect } from 'react'
import { Link,useNavigate,useParams } from 'react-router-dom'
import {UserContext} from '../context/userContext'
import axios from 'axios'
import Loader from '../components/Loader'
import DeletePosts from './DeletePosts'


const Dashboard = () => {
  const navigate=useNavigate();
  const [posts,setPosts]=useState([])
  const [isLoading,setIsLoading]=useState(false);
  const {id}=useParams()

  const {currentUser}=useContext(UserContext)
  const token=currentUser?.token;

  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  },[])


  useEffect(() => {
    const fetchPosts=async () => {
      setIsLoading(true);
      try {
        const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
          {withCredentials:true,headers:{Authorization: `Bearer ${token}`}})
          setPosts(response.data)
      } catch (error) {
        console.log(error);
        
      }
      isLoading(false);
    }
    fetchPosts();
  },[id])

  if(isLoading){
    return <Loader/>
  }



  return (
    <section className="dashboard">
      {
        posts.length ? <div className="container dashboard-container">
          {
            posts.map(post=>{
              return <article key={post.id} className='dashboard-post'>
                <div className="dashboard-post-info">
                  <div className="dashboard-post-thumbnail">
                    <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard-post-actions">
                  <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                  <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                  <DeletePosts postId={post._id}/>
                </div>
              </article>
            })
          }
        </div> : <h2 className='center'>You have np posts yet.</h2>
      }
    </section>
  )
}

export default Dashboard
