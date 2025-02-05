import React, { useState,useContext } from 'react'
import {Link} from "react-router-dom"
import logo from '../assets/logo.png'
import { IoMenu } from "react-icons/io5";
import {AiOutlineClose} from "react-icons/ai"

import { UserContext } from '../context/userContext';

const Header = () => {
  const [isNavShowing,setIsNavShowing]=useState(window.innerWidth > 800 ? true : false);
  const {currentUser}=useContext(UserContext)

  const closeNaveHandler=() => {
    if(window.innerWidth < 800){
      setIsNavShowing(false);
    }else{
      setIsNavShowing(true)
    }
  }

  return (
    <div>
      <nav>
        <div className="container nav-container">
          <Link to="/" className='nav-logo' onClick={closeNaveHandler}>
             <img src={logo} alt="navbar-logo" />
          </Link>
          {currentUser?.id &&  isNavShowing && <ul className="nav-menu">
            <li><Link to={`/profile/${currentUser.id}`} onClick={closeNaveHandler}>{currentUser?.name}</Link></li>
            <li><Link to="/create" onClick={closeNaveHandler}>Create Post</Link></li>
            <li><Link to="/authers" onClick={closeNaveHandler}>Authers</Link></li>
            <li><Link to="/logout" onClick={closeNaveHandler}>Logout</Link></li>
          </ul>}
          {!currentUser?.id &&  isNavShowing && <ul className="nav-menu">
            <li><Link to="/authers" onClick={closeNaveHandler}>Authors</Link></li>
            <li><Link to="/login" onClick={closeNaveHandler}>Login</Link></li>
          </ul>}
          <button className="nav-toggle-button" onClick={() => setIsNavShowing(!isNavShowing)}>
            {isNavShowing ? <AiOutlineClose/> : <IoMenu />}
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Header
