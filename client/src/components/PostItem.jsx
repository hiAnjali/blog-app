import React from 'react'
import {Link} from "react-router-dom"
import PostAuthor from './PostAuthor'

const PostItem = ({postID,category,title,description,authorID,thumbnail,createdAt}) => {
  const shortDescription=description.length>145?description.substr(0,145)+'....':description;
  const shortPostTitle=title.length>30?description.substr(0,30)+'...':title;
  return (
    <div>
      <article className="post">
        <div className="post-thumbnail">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
        </div>
        <div className="post-content">
            <Link to={`/posts/${postID}`}>
            <h3>{shortPostTitle}</h3>
            </Link>
            <p dangerouslySetInnerHTML={{__html: shortDescription}}/>
            <div className="post-footer">
                <PostAuthor authorID={authorID} createdAt={createdAt}/>
                <Link to={`/posts/categories/${category}`} className='btn category'>
                {category}
                </Link>
            </div>
        </div>
      </article>
    </div>
  )
}

export default PostItem
