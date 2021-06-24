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

type ErrorMessage = {
    id: string,
    message: string
}

type SessionState = {
    user: undefined | User
    token: string,
    status: 'idle' | 'loading' | 'failed' | 'success',
    error: ErrorMessage[]
}

export type LoginInput = { identifier: string, password: string }

export type RegisterInput = { username: string, email: string, password: string }

export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials: LoginInput, { rejectWithValue }) => {
        try {
            const res = await loginService.login(credentials);
            const normalizedData = normalize(res.user, userEntity) as unknown as NormalizedSchema<{
                post: { [key: string]: Post },
                user: { [key: string]: User }
            }, any>
            return { jwt: res.jwt, logged: normalizedData }
        } catch (error) {
            return rejectWithValue(error.response.data.message[0].messages)
        }
    }
);

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (id: number, { rejectWithValue }) => {
        try {
            await loginService.logout(id);
            return 
        } catch (error) {
            return rejectWithValue(error.response.data.message[0].messages)
        }
    }
);

export const registerAsync = createAsyncThunk(
    'auth/register',
    async (credentials: RegisterInput, { rejectWithValue }) => {
        try {
            const res = await loginService.register(credentials);
            const normalizedData = normalize(res.user, userEntity) as unknown as NormalizedSchema<{
                post: { [key: string]: Post },
                user: { [key: string]: User }
            }, any>
            return { jwt: res.jwt, logged: normalizedData }

        } catch (error) {
            return rejectWithValue(error.response.data.message[0].messages)
        }
    }
);

const initialState: SessionState = {
    user: undefined,
    token: '',
    status: 'idle',
    error: []
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
        clearErrorMessage: (state) => {
            state.error = []
        },
        setLogin: (state, { payload }) => {
            state.user = payload.user
            state.token = payload.jwt
            state.status = 'idle'
            window.localStorage.setItem(
                'loggedRandomTartanUser', JSON.stringify({ jwt: state.token, user: state.user })
            )
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginAsync.fulfilled, (state, { payload }) => {
                state.user = payload.logged.entities.user[payload.logged.result]
                state.status = 'success';
                state.token = payload.jwt
                state.error = []
                window.localStorage.setItem(
                    'loggedRandomTartanUser', JSON.stringify({ jwt: state.token, user: state.user })
                )
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.status = 'success';
                state.user = undefined
                state.token = ''
                state.status = 'idle'
                window.localStorage.removeItem('loggedRandomTartanUser')
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.status = 'failed';
                console.log(action.payload);
                state.error = action.payload as ErrorMessage[]
            })
            .addCase(registerAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerAsync.fulfilled, (state, { payload }) => {
                state.user = payload.logged.entities.user[payload.logged.result]
                state.status = 'success';
                state.token = payload.jwt
                state.error = []
                window.localStorage.setItem(
                    'loggedRandomTartanUser', JSON.stringify({ jwt: state.token, user: state.user })
                )
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as ErrorMessage[]
            });
    },
});

export const { getloggedUser, loggout, clearErrorMessage, setLogin } = sessionSlice.actions;
export const selectLoggedUser = (state: RootState) => state.session.user;
export const selectError = (state: RootState) => state.session.error;
export const selectToken = (state: RootState) => state.session.token;

export default sessionSlice.reducer;

