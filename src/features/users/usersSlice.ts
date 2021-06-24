import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { createPostsAsync, fetchPostsAsync } from '../gallery/postsSlice'


export interface User {
  id: number,
  username: string,
  email: string,
  liked: number[],
  posts: number[]
}

const usersAdapter = createEntityAdapter<User>();


export const userSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPostsAsync.fulfilled, (state, action) => {
        if (action.payload.user) {
          usersAdapter.upsertMany(state, action.payload.user);
        }
      })
      .addCase(createPostsAsync.fulfilled, (state, { payload }) => {
        if (payload.entities.post && payload.entities.user) {
          const post = payload.entities.post[payload.result]
          usersAdapter.upsertOne(state, payload.entities.user[post.user])
        }
        // state.status = 'success';
      })
      // .addCase(updatePostyAsync.fulfilled, (state, action) => {
      //   if (action.payload) {
      //     usersAdapter.updateOne(state, action.payload)
      //   }
      // })
  }
});

export default userSlice.reducer;

export const {
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectTotalUsers
} = usersAdapter.getSelectors<RootState>(state => state.users);