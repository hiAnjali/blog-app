import React,{useContext,useEffect, useState} from 'react'
import { Link,useNavigate,useLocation  } from 'react-router-dom'
import { UserContext } from '../context/userContext';
import axios from 'axios'
import Loader from '../components/Loader';

const DeletePosts = ({postId:id}) => {

  const navigate=useNavigate();
  const {currentUser}=useContext(UserContext)
  const token=currentUser?.token;
  const location=useLocation()
  const [isLoading,setIsLoading]=useState(false);

  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  },[navigate,token])

  const removePost=async () =>{
    setIsLoading(true)
    try {
      const response=await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      if(response.status==200){
        if(location.pathname==`/myposts/${currentUser.id}`){
          navigate(0)
        }else{
          navigate('/')
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.log("couldnot delete post.");
      
    }
  }

if(isLoading){
  <Loader/>
}
  return (
      // <Link to={`/posts/werwer/delete`} className='btn sm danger'>Delete</Link>
    <Link className='btn sm danger' onClick={() => removePost(id)}>Delete</Link>

  )
}

export default DeletePosts
