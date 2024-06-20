import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const GetTimeEntrieApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/TimeEntries`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetTimeEntrieByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/TimeEntries/employee/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PostTimeEntrieApi = async (body) => {
    try {
        const response = await axios.post(`${API_URL}/TimeEntries`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutTimeEntrieApi = async (body) => {
    try {
        const response = await axios.put(`${API_URL}/TimeEntries`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeleteTimeEntrieApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/TimeEntries/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export default GetTimeEntrieApi
