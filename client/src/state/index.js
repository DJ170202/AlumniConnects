//slice matlb Redux state ko managable pieces me todna. createSlice ek redux toolkit ka function h jo ye karta h.
import { createSlice } from "@reduxjs/toolkit";
//this state will be accessible in out entire application where-ever we want.
//initialState ke states global honge.
const initialState = {
  mode: "light",
  user: null,  
  token: null,
  posts: [],
};
//auth ke purpose se token globally store kar rhe h.
//authSlice means slicing Redux state for auth purpose.
export const authSlice = createSlice({
  name: "auth",
  initialState,
  //this defines our actions.
  //these are functions which modify global state.
  reducers: {
    //action includes all the args.
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      //.payload property allows us to send specific details or payload to the action which is used by reducers to update state.
      //jaise hi login hoga, user aur token ko currently logged in user ki details milengi.
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state, action) => {
      //null ka matlb logout button dabate hi hum user aur token ko null kardenge.
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      //if check ka matlb h ki user already exist karta h to friends ki info state me update kardo.
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.log("user ka friend exist nhi karta");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      //we are mapping through all the posts and when we find the post with id which we have as args, then we return it's post, else we return the post unchange
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post_id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});
//ye sab redux toolkit ka part h.
export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
