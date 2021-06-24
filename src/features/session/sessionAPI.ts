import axios from 'axios';
import { User } from '../users/usersSlice';

const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337'
const provider = 'auth0'
const callback = async (provider: string, query: string): Promise<{ jwt: string, user: User }> => {
    try {
        const res = await axios.get(`${baseUrl}/auth/${provider}/callback${query}`)
        return res.data
    } catch (error) {
        throw error
    }
}

const logout = async (id: number) => {
    try {
        return await axios.get(`${baseUrl}/connect/${provider}/logout?client_id=${id}`);
    } catch (error) {
        throw error
    }
}

// eslint-disable-next-line
export default { callback, logout }