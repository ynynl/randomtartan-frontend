import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter/counterSlice';
import tartanReducer from "../features/home/tartanSlice";
import postsReducer from "../features/gallery/postsSlice";
import usersReducer from '../features/users/usersSlice'
import authReducer from '../features/session/sessionSlice';

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    tartan: tartanReducer,
    session: authReducer,
    posts: postsReducer,
    users: usersReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
