import React from 'react';
import withSession from '../withSession';
import { Mutation } from 'react-apollo';
import { LIKE_RECIPE , GET_RECIPE , UNLIKE_RECIPE} from '../../query';

class LikeRecipe extends React.Component {

    state = {
        username:'',
        liked: false,
    }

    handleClick = (likeRecipe, unlikeRecipe) => {
        this.setState(prevState => ({
            likes: !prevState.liked
        }),
        () => this.handleLike(likeRecipe, unlikeRecipe)
        
        );
    }

    handleLike = (likeRecipe, unlikeRecipe) => {
    if(this.state.liked){
        likeRecipe().then(async ({data}) => {
           // console.log(data);
            await this.props.refetch();
        });
    }else{
        console.log("unlike ");
        unlikeRecipe().then(async ({data}) => {
           // console.log(data);
            await this.props.refetch();
        });
    }
}
updateLike =(cache, {data: { likeRecipe }}) =>{
    const { _id } = this.props;
    const { getRecipe } = cache.readQuery({ query: GET_RECIPE , variables: { _id }})
    cache.writeQuery({
        query: GET_RECIPE, 
        variables: { _id },
        data:{
            getRecipe: {...getRecipe, likes:likeRecipe.likes +1 }
        }
    });
}
updateUnLike =(cache, {data: { unlikeRecipe }}) =>{
    const { _id } = this.props;
    const { getRecipe } = cache.readQuery({ query: GET_RECIPE , variables: { _id }})
    cache.writeQuery({
        query: GET_RECIPE, 
        variables: { _id },
        data:{
            getRecipe: {...getRecipe, likes:unlikeRecipe.likes -1 }
        }
    });
}


    componentDidMount(){
        
        if(this.props.session.getcurrentUser){
            const { username, favorites } = this.props.session.getcurrentUser;
            const{ _id } = this.props;
            //console.log("username",favorites);
            const prevLiked = favorites.findIndex(favorite => favorite._id === _id) > -1;
            this.setState({ 
                username:username,
                liked: prevLiked,
                
            });
        }
    }
    render(){
        const { liked, username } = this.state;
        const { _id } = this.props;
        return(
        <Mutation 
        mutation={UNLIKE_RECIPE} 
        variables={{_id, username }}
        update={this.updateUnLike}
        >
        {unlikeRecipe  =>(

        <Mutation 
        mutation={ LIKE_RECIPE } 
        variables={{ _id, username }}
        update={this.updateLike}
        >
        {likeRecipe => 
          username && (
          <button onClick={()=> this.handleClick(likeRecipe, unlikeRecipe)}
            >
            { liked ? 'Unlike': "like"}
            </button>
            )
            }
            </Mutation>
           
        )}
        </Mutation> 
        );
    }
}

export default withSession(LikeRecipe);