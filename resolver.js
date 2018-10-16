const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const createToken = (user, secret, expiresIn) =>{
    const { username, email, password } = user;
    return jwt.sign({ username, email, password }, secret, { expiresIn})
}





exports.resolvers = {
    Query:{
        getAllRecipes: async(root, args, { Recipe }) =>{
            const allRecipes = await Recipe.find().sort({createdDate:'desc'});
            return allRecipes;
        },

        searcheRecipes : async (root, { searchTerm }, { Recipe }) =>{
            if(searchTerm){
                const serachresults = await Recipe.find({
                    $text: { $search: searchTerm }
                },{
                    score: { $meta: 'textScore' }
                }).sort({
                    score: { $meta: 'textScore' }
                });
                return serachresults;
            }else{
                const recipes = await Recipe.find().sort({ likes:'desc', createdDate:'desc'});
                return recipes;
            }
        },
        getRecipe: async (root, { _id }, { Recipe }) => {
            const recipe = await Recipe.findOne({ _id });
            return recipe;
        },
        getUserRecipes:async (root, { username }, { Recipe }) => {
            const userRecipes = await Recipe.find({ username }).sort({
                createdDate:'desc'
            });
            return userRecipes;
        },
        getcurrentUser:async(root, args, { currentUser, User }) =>{
            if(!currentUser){
                return null;
            }
        const user = await User.findOne({ username: currentUser.username })
        .populate({
            path:'favorites',
            model:'Recipe'
        });
        return user;
        }
    },
    Mutation:{
        addRecipe: async (root, { name, description, category, instructions, username}, { Recipe })=>{
            const newRecipe = await new Recipe({
                name,
                description,
                category,
                instructions,
                username
            }).save();
             return newRecipe;
        },
        likeRecipe: async (root, { _id, username }, { Recipe , User}) =>{
            const recipe = await Recipe.findOneAndUpdate({ _id }, { $inc: { likes: 1 }});
            const user = await User.findOneAndUpdate({ username }, { $addToSet: {
                favorites: _id
            }});
            return recipe;
        },
        unlikeRecipe: async (root, { _id, username }, { Recipe , User}) =>{
            const recipe = await Recipe.findOneAndUpdate({ _id }, { $inc: { likes: -1 }});
            const user = await User.findOneAndUpdate({ username }, { $pull: {
                favorites: _id
            }});
            return recipe;
        },
        deleteUserRecipe: async (root, { _id }, { Recipe }) => {
            const recipe = await Recipe.findOneAndRemove({ _id });
            return  recipe;
        },
        signinUser: async(root, { username, password }, { User }) =>{
            const user = await User.findOne({ username });
            if(!user){
                throw new Error('User not exists');
            }
            const inValidPassword = await bcrypt.compare(password, user.password);
            if(!inValidPassword){
                throw new Error('Invalid Password');
            }
            return { token: createToken(user, process.env.SECRET,"100days")}
        },
        signupUser: async (root, { username, email, password }, { User })=>{
            const user = await User.findOne({ username });
            if(user){
                throw new Error('User already exists');

            }
            const newUser = await new User({
                username,
                email,
                password
            }).save();
            return { token: createToken(newUser, process.env.SECRET,"100days")}
        }
    }
};