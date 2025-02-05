import React, { useContext, useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { UserContext } from '../context/userContext';
import axios from 'axios';

const UserProfile = () => {
  const [avatar,setAvatar]=useState('')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [currentPassword,setCurrentPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [confirmNewPassword,setConfirmNewPassword]=useState('')
  const [error,setError]=useState('')

  const [isAvatarTouched,isSetAvatarTouched]=useState(false)
  const navigate=useNavigate();
  const {currentUser}=useContext(UserContext)
  const token=currentUser?.token;
  const userId = currentUser?.id;


  useEffect(() => {
    if(!token){
      navigate('/login')
    }
  },[navigate,token]);

  useEffect(() => {
    const getUser=async () => {
      const response=await axios.get(`${process.env.REACT}/users/${userId}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      const {name,email,avatar}=response.data;
      setName(name);
      setEmail(email)
      setAvatar(avatar);
    }
    getUser();
  },[])


  const changeAvatarHandler=async() => {
    isSetAvatarTouched(false);
    try {
      const postData=new FormData();
      postData.set('avatat',avatar);
      const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`,postData,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      setAvatar(response?.data.avatar)
    } catch (error) {
      console.log(error);
      
    }
  }


  const updateUserDetail= async(e) =>{
    e.preventDefault();
    try {
      const userData=new FormData();
      userData.set('name',name);
      userData.set('email',email);
      userData.set('currentPassword',currentPassword);
      userData.set('newPassword',newPassword);
      userData.set('confirmNewPassword',confirmNewPassword);
  
      const response=await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`,userData,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      if(response.status ==200){
        navigate('/logout');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }




  return (
    <section className="profile">
      <div className="container profile-container">
        <Link to={`/myposts/${currentUser.id}`} className='btn'>My Posts</Link>

        <div className="profile-details">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              <img src={`${process.env.REACT_APP_BASE_URL}/uploads/${avatar}`} alt="" />
            </div>
            <form className="avatar-form">
              <input type="file" name="avatar" id="avatar" onChange={e=>setAvatar(e.target.files[0])} 
              accept='png, jpg, jpeg'/>
              <label htmlFor="avatar" onClick={()=>isSetAvatarTouched(true)}><FaEdit/></label>
            </form>
            {isAvatarTouched && <button className='profile-avatar-btn' onClick={changeAvatarHandler}><FaCheck /></button>}
          </div>

          <h1>{currentUser.name}</h1>

          <form className="form profile-form" onSubmit={updateUserDetail}>
            {error && <p className='form-error-message'>{error}</p>}
            <input type="text" placeholder='Full Name' value={name} onChange={e => setName(e.target.value)}/>
            <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder='Curren Password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/>
            <input type="password" placeholder='New Password' value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
            <input type="password" placeholder='Confirm New Password' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}/> 
            <button type="submit" className='btn primary'>Update Details</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserProfile
