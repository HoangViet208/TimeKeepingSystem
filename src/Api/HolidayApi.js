import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const GetHolidayApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/Holiday`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetHolidayByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/Holiday/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PostHolidayApi = async (body) => {
    try {
        const response = await axios.post(`${API_URL}/Holiday`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutHolidayApi = async (body) => {
    try {
        const response = await axios.put(`${API_URL}/Holiday`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeleteHolidayApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Holiday?id=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export default GetHolidayApi
