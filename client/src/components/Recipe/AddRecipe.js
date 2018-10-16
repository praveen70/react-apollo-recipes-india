import React from 'react';
import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES ,GET_USER_RECIPES } from '../../query';
import  Error  from '../Error';
import { withRouter } from 'react-router-dom';
import withAuth from '../withAuth';


const initialState ={
    name:'',
    instructions:'',
    category:'Brakfast',
    description:'',
    username:''
};
class  AddRecipe extends React.Component{

    state={...initialState};

    clearState =()=>{
        this.setState({ ...initialState });
    }

    componentDidMount= () =>{
        this.setState({ username: this.props.session.getcurrentUser.username})
    }

    handleChange =event =>{
        const { name, value } = event.target;
        this.setState({[name]: value});
    }
    validateForm =() =>{
        const { name,  instructions, category, description } = this.state;
        const inInvalid = !name || !instructions || !category || !description ;
        return inInvalid;
    }
    handleSubmit =(event, addRecipe) => {
        event.preventDefault();
        addRecipe().then(({ data }) =>{
           // console.log(data);
            this.clearState();
            this.props.history.push('/')
        });

    }
    updateCache =(cache, {data : { addRecipe }}) =>{
        const { getAllRecipes } = cache.readQuery({ query : GET_ALL_RECIPES})
        cache.writeQuery({
            query: GET_ALL_RECIPES,
            data :{
                getAllRecipes: [addRecipe, ...getAllRecipes]
            }
        });
    };
    render() { 
        const { name,  instructions, category, description, username,} = this.state;
        return (
        
        <Mutation  mutation={ADD_RECIPE} variables={{  name,  instructions, category, description, username }} update={this.updateCache}
        refetchQueries={() => [
            { query: GET_USER_RECIPES, variables: { username } }
        ]}
        >
        {(addRecipe, { data, loading, error }) => {

        return(
            <div className='App' style={{display:'relative'}}>
       <h2 className='App'>Add Recipe</h2>
       <form className='App' onSubmit={event => this.handleSubmit(event, addRecipe)}>
       <div>
           <input type='text' name='name' value={name} placeholder='Recipe Name' onChange={ this.handleChange } />
           </div>
           <div>
           <select type='text' name='category' value={category} onChange={this.handleChange}>
           
                <option value='Breakfast'>Breakfast</option>
                <option value='Lunch'>Lunch</option>
                <option value='Dinner'>Dinner</option>
                <option value='Snacks'>Snacks</option>
           </select>
           </div>
           <div>
           <input type='text' name='description'  placeholder='Add description' value={description} onChange={this.handleChange} />
           </div>
           <div>
           <textarea name='instructions'  placeholder='Add instructions' value={instructions} onChange={this.handleChange} />
           </div>
           <button type='submit' disabled={loading || this.validateForm()} className='button-primary'>Submit</button>
           {error && <Error error={error} />}
       </form>
   </div>
    );
        }}
    </Mutation>
    );
    }
};

export default withAuth(session => session && 
    session.getcurrentUser)(
        withRouter(AddRecipe)
    );