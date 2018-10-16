import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom'
import { GET_CEURRENT_USER } from '../query';


const withAuth = condtitionFunc => Component => props =>(

    <Query query={GET_CEURRENT_USER}>
        {({ data, loading }) =>{
            if(loading) return null;
            
            return condtitionFunc(data) ? (<Component {...props} />):(<Redirect to='/' />)

            
        }}
    </Query>
   
);


export default withAuth;