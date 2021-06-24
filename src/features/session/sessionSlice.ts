import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit';
import { normalize, NormalizedSchema } from 'normalizr';
import {
    RootState
} from '../../app/store';
import { Post, userEntity } from '../gallery/postsSlice';
import { User } from '../users/usersSlice';
import loginService from './sessionAPI';

type SessionState = {
    user: undefined | User
    token: string,
    status: 'idle' | 'loading' | 'failed' | 'success',
}

export const callbackAsync = createAsyncThunk(
    'auth/callback',
    async (info: { provider: string, query: string }, { rejectWithValue }) => {
        try {
            const res = await loginService.callback(info.provider, info.query);
            const normalizedData = normalize(res.user, userEntity) as unknown as NormalizedSchema<{
                post: { [key: string]: Post },
                user: { [key: string]: User }
            }, any>
            return { jwt: res.jwt, logged: normalizedData }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (id: number, { rejectWithValue }) => {
        try {
            return await loginService.logout(id);
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

const initialState: SessionState = {
    user: undefined,
    token: '',
    status: 'idle',
}

export const sessionSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getloggedUser: (state) => {
            const loggedUserString = window.localStorage.getItem('loggedRandomTartanUser')
            if (loggedUserString) {
                const loggedUserJSON = JSON.parse(loggedUserString)
                state.token = loggedUserJSON.jwt
                state.user = loggedUserJSON.user
            }
        },
        loggout: (state) => {
            state.user = undefined
            state.token = ''
            state.status = 'idle'
            window.localStorage.removeItem('loggedRandomTartanUser')
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(callbackAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(callbackAsync.fulfilled, (state, { payload }) => {
                state.user = payload.logged.entities.user[payload.logged.result]
                state.status = 'success';
                state.token = payload.jwt
                window.localStorage.setItem(
                    'loggedRandomTartanUser', JSON.stringify({ jwt: state.token, user: state.user })
                )
            })
            .addCase(callbackAsync.rejected, (state, action) => {
                state.status = 'failed';
                console.log(action.payload);
            })
            .addCase(logoutAsync.pending, (state) => {
                state.status = 'loading';
                state.user = undefined
                state.token = ''
                state.status = 'idle'
                window.localStorage.removeItem('loggedRandomTartanUser')
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(logoutAsync.rejected, (state, { payload }) => {
                state.status = 'failed';
                console.log(payload);
            })
    },
});

export const { getloggedUser } = sessionSlice.actions;
export const selectLoggedUser = (state: RootState) => state.session.user;
export const selectToken = (state: RootState) => state.session.token;

export default sessionSlice.reducer;

