import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CEURRENT_USER } from '../../query';
import { Link } from 'react-router-dom'


const handleDelete =deleteUserRecipe =>{
    const confirmDelete = window.confirm('Are you sure want to delete this recipe?');
    if(confirmDelete){
        deleteUserRecipe().then(({ data }) =>{
           // console.log(data);
        })
    }
}


const UserRecipes = ({ username }) =>(
    <Query query={GET_USER_RECIPES} variables={{ username  }}>
    {({ data, loading, error }) => {
        if(loading) return <div>loading</div>
        if(error) return <div> error</div>
        //console.log(data);
        return (
            <ul>
            <h3>YourRecipe</h3>

            {!data.getUserRecipes.length && (<strong><p>You have not added any recipes yet</p></strong>)}
            
            {data.getUserRecipes.map(recipe => (

                <li key={recipe._id}>
                    <Link to={`/Recipe/${recipe._id}`}><p>{recipe.name}</p></Link>
                    <p style={{ marginBottom:'0' }}>{recipe.likes}</p>
                    <Mutation mutation={DELETE_USER_RECIPE} variables={{_id: recipe._id}}
                    refetchQueries={() => [
                        {query: GET_ALL_RECIPES },
                        { query : GET_CEURRENT_USER }
                    ]}
                    update={(cache, { data: { deleteUserRecipe }}) =>{
                      const { getUserRecipes } = cache.readQuery({
                          query: GET_USER_RECIPES,
                          variables: { username }
                      });
                      cache.writeQuery({
                          query: GET_USER_RECIPES,
                          variables: { username },
                          data:{
                            getUserRecipes: getUserRecipes.filter(recipe => recipe._id!== deleteUserRecipe._id) 
                          }

                      })
                    }}
                    >
                    {(deleteUserRecipe, attrs = {}) =>(

                        <p 
                        className='delte-button'
                        onClick={() => handleDelete(deleteUserRecipe)}
                        >{attrs.loading ? 'deleting...': "Delete"}</p>
                      
                     )
                    }
                    </Mutation>
                </li>
            ))}
            </ul>

     )
    }}
    

    </Query>
);

export default UserRecipes;