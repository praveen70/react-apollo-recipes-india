import React from 'react';
import { Link } from 'react-router-dom';
import { from } from 'apollo-link';


const RecipeiItem =({  _id,name, category })=>(
    <li >
     <Link to={`/Recipe/${_id}`}> <h4>{name}</h4></Link>
      <p><strong>{category}</strong></p>
      </li>
)

export default RecipeiItem;