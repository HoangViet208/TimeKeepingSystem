import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const GetwifiApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/Wifi`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetwifiByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/Wifi`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PostwifiApi = async (body) => {
    try {
        const response = await axios.post(`${API_URL}/Wifi`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutwifiApi = async (body) => {
    try {
        const response = await axios.put(`${API_URL}/Wifi`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeletewifiApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Wifi/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export default GetwifiApi
