const axios = require('axios');

const URL = process.env.REACT_APP_TARTAN_HOST  || 'http://localhost:5000'

// Make a request for a user with a given ID

export const generateTartan = async (data) => {
    try {
        const res = await axios.post(URL, data)
        return res.data
    } catch (error) {
        console.error(error);
    }
}

