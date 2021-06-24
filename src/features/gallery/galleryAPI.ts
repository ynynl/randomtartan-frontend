import { Post } from "./postsSlice";

const axios = require('axios');

const URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337'
// Make a request for a user with a given ID

const get = async (page: number, limit: number): Promise<Post[] | undefined> => {
    try {
        const { data } = await axios.get(`${URL}/posts?_sort=published_at:DESC&_start=${page * limit}&_limit=${limit}`)
        return data
    } catch (error) {
        throw error
    }
}

const getById = async (id: number): Promise<Post> => {
    try {
        const res = await axios.get(`${URL}/posts/${id}`)
        return res.data
    } catch (error) {
        throw error
    }
}

const updateById = async (id: number, data: { [key: string]: any }, jwt: string): Promise<Post> => {
    try {
        const res = await axios.put(`${URL}/posts/${id}`, data, {
            headers: {
                Authorization:
                    `Bearer ${jwt}`,
            }
        })
        return res.data
    } catch (error) {
        throw error
    }
}

const deleteById = async (id: number, jwt: string): Promise<Post> => {
    try {
        const res = await axios.delete(`${URL}/posts/${id}`, {
            headers: {
                Authorization:
                    `Bearer ${jwt}`,
            }
        })
        return res.data
    } catch (error) {
        throw error
    }
}

const create = async (data: FormData, jwt: string): Promise<Post> => {
    try {
        const res = await axios.post(`${URL}/posts`, data, {
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

const count = async (): Promise<number> => {
    try {
        const res = await axios.get(`${URL}/posts/count`)
        return res.data
    } catch (error) {
        throw error
    }
}

// eslint-disable-next-line
export default { get, getById, updateById, create, count, deleteById }


