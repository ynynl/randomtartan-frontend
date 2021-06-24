import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState, } from '../../app/store';
import PostService from './galleryAPI';
import { normalize, NormalizedSchema, schema } from 'normalizr'
import { User } from '../users/usersSlice';

export interface Post {
  id: number,
  name: string;
  description: string;
  // src: string;
  like: number[];
  user: number,
  published_at: string;
  tartan: {
    url: string
  }
}

export const userEntity = new schema.Entity<User>('user')

export const postEntity = new schema.Entity<Post>('post', {
  user: userEntity,
  like: [userEntity]
});

userEntity.define({
  liked: [postEntity],
  posts: [postEntity]
})


export const fetchPostsAsync = createAsyncThunk(
  'gallery/fetchPosts',
  async ({ page, limit }: { page: number, limit: number }, { rejectWithValue }) => {
    try {
      const res = await PostService.get(page, limit);
      const normalizedData = normalize(res, [postEntity])
      return normalizedData.entities as unknown as { post: { [key: string]: Post }, user: { [key: string]: User } }
    } catch (error) {
      return rejectWithValue(error)
    }
  });

export const createPostsAsync = createAsyncThunk(
  'gallery/createPost',
  async ({ data, jwt }: { data: FormData, jwt: string }, { rejectWithValue }) => {
    try {
      const res = await PostService.create(data, jwt);
      const normalizedData = normalize(res, postEntity)

      return normalizedData as unknown as NormalizedSchema<{
        post: { [key: string]: Post },
        user: { [key: string]: User }
      }, any>

    } catch (error) {
      return rejectWithValue(error)
    }
  });

export const updatePostyAsync = createAsyncThunk(
  'gallery/updatePost',
  async ({ id, data, jwt }: { id: number, data: { [key: string]: any }, jwt: string }, { rejectWithValue }) => {
    try {
      const res = await PostService.updateById(id, data, jwt)
      const normalizedData = normalize(res, postEntity)

      return normalizedData as unknown as NormalizedSchema<{
        post: { [key: string]: Post },
        user: { [key: string]: User }
      }, any>

    } catch (error) {
      return rejectWithValue(error)
    }
  });

export const deletePostyAsync = createAsyncThunk(
  'gallery/deletePost',
  async ({ id, jwt }: { id: number, jwt: string }, { rejectWithValue }) => {
    try {
      await PostService.deleteById(id, jwt)
      return id
    } catch (error) {
      return rejectWithValue(error)
    }
  });

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => Date.parse(b.published_at) - (Date.parse(a.published_at))
});

export const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    status: 'idle',
    errorMessage: '',
    total: 0
  }),
  reducers: {
    setTotal: (state, { payload }) => {
      state.total = payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPostsAsync.fulfilled, (state, { payload }) => {
        if (payload.post) {
          postsAdapter.upsertMany(state, payload.post)
        }
        state.status = 'idle'
      })
      .addCase(fetchPostsAsync.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(updatePostyAsync.fulfilled, (state, { payload }) => {
        if (payload.entities.post) {
          postsAdapter.updateOne(state, {
            id: payload.result,
            changes: payload.entities.post[payload.result]
          })
        }
      })
      .addCase(deletePostyAsync.fulfilled, (state, { payload }) => {
        postsAdapter.removeOne(state, payload)
        state.total -= 1
      })
      .addCase(createPostsAsync.fulfilled, (state, { payload }) => {
        if (payload.entities.post) {
          postsAdapter.upsertOne(state, payload.entities.post[payload.result])
          state.total += 1
        }
        state.status = 'success';
      })
      .addCase(createPostsAsync.rejected, (state) => {
        state.status = 'failed';
      })
  },
});

export const {
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectAll: selectAllPosts,
  selectEntities: selectPostEntities,
  selectTotal: selectTotalPosts
} = postsAdapter.getSelectors<RootState>(state => state.posts);

export const { setTotal } = postsSlice.actions
export const selectGalleryStatus = (state: RootState) => state.posts.status
export const selectTotal = (state: RootState) => state.posts.total

export default postsSlice.reducer;
