import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = date =>{
    const newDate = new Date(date).toLocaleDateString('en-Us');
    const newTime = new Date(date).toLocaleTimeString('en-India');
    return `${newDate} at ${newTime}`;
}
const UserInfo =({ session }) => (
    
    <div>
        <h3>User Info</h3>
        <p>Username: {session.getcurrentUser.username}</p>
        <p>Email: {session.getcurrentUser.email}</p>
        <p>Join Date: {formatDate(session.getcurrentUser.joinDate)}</p>
        <ul>
        <h3>Username: {session.getcurrentUser.username}' s Favorites</h3>
        {session.getcurrentUser.favorites.map(favorite =>(
            <li key={favorite._id}>
           <Link to={`/Recipe/${favorite._id}`}><p>{favorite.name}</p></Link> 

            </li>
        
            ))}
            {!session.getcurrentUser.favorites.length && (
                <strong><p>you have no favorites currently. go add sone!</p></strong>)}
        </ul>
    </div>

)


export default UserInfo;