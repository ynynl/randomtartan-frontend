import axios from 'axios';
import { User } from '../users/usersSlice';
import { LoginInput, RegisterInput } from './sessionSlice';


const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337'
// const frontend = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'
const provider = 'auth0'
const login = async (credentials: LoginInput) => {
    try {
        const { data } = await axios.post(`${baseUrl}/auth/local`, credentials);
        return data
    } catch (error) {
        throw error
    }
}

const logout = async (id: number) => {
    try {
        await axios.get(`${baseUrl}/connect/${provider}/logout?client_id=${id}`);
        return 
    } catch (error) {
        throw error
    }
}
// const login = async (credentials: LoginInput) => {
//     try {
//         const { data } = await axios.post(`${baseUrl}/auth/local`, credentials);
//         return data
//     } catch (error) {
//         throw error
//     }
// }

const register = async (credentials: RegisterInput) => {
    try {
        const { data } = await axios.post(`${baseUrl}/auth/local/register`, credentials);
        return data
    } catch (error) {
        throw error
    }
}

const update = async (id: number, data: { [key: string]: any }, jwt: string): Promise<User> => {
    try {
        const res = await axios.put(`${URL}/users/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${jwt}`,
            },
        })
        return res.data
    } catch (error) {
        throw error
    }
}
// eslint-disable-next-line
export default { login, register, update, logout }