const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
require('dotenv').config({path: 'variables.env'});
const Recipe = require('./models/Recipe');
const User = require('./models/User');
const {typeDefs} = require('./schema');
const {resolvers} = require('./resolver');
const { graphiqlExpress, graphqlExpress} = require('apollo-server-express');
const { makeExecutableSchema} = require('graphql-tools');
var cors = require('cors')
const jwt = require('jsonwebtoken');
// console.log("tokenn from man::::::::::::", jwt)


const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})


// const corsOptions = {
//     origin : 'http://localhost:3000/',
//     credentials: true,
// };
const app = express();
app.use(cors('*'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) =>{
    const token = req.headers['authorization'];
    console.log('token::::::::::1st ' + token);
    const token1 = req.headers.jwt;
    console.log('token: ' + token1);
   if(token !== 'null'){
       try{
        const currentUser = await jwt.verify(token, process.env.SECRET);
        req.currentUser= currentUser;
       }catch(error){
           console.log(error)
       }
   }
    next();
});
//app.use('/graphiql', graphiqlExpress({ endpointURL:'/graphql'}))
 
//connext schema to graphql
app.use('/graphql', bodyParser(),
    graphqlExpress(({ currentUser }) => ({
    schema,
    context:{
        Recipe,
        User,
        currentUser
    }  
}))
);
//connects to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch(err => console.error(err));


if(process.env.NODE_ENV === " production"){
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        req.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
const PORT = process.env.PORT || 4444;


app.listen(PORT, () =>{
    console.log(`Server listening on port ${PORT}`)
});