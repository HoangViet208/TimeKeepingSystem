import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const GetDateSettingByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/WorkSetting/GetDateSetting?Id=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetTimeSettingByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/WorkSetting/GetTimeSetting?Id=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetLeaveSettingByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/WorkSetting/GetLeaveSetting?Id=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetRiskSettingByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/WorkSetting/GetRiskSetting?Id=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutDateSettingByIdApi = async (body) => {
    try {
        const response = await axios.patch(`${API_URL}/WorkDateSetting`, body)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PutTimeSettingByIdApi = async (body) => {
    try {
        const response = await axios.put(`${API_URL}/WorkSetting/UpdateTimeSetting`, body)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PutLeaveSettingByIdApi = async (body) => {
    try {
        const response = await axios.patch(`${API_URL}/LeaveSetting`, body)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PutRiskSettingByIdApi = async (body) => {
    try {
        const response = await axios.put(`${API_URL}/WorkSetting/updateRiskSetting`, body)
        return response.data
    } catch (error) {
        throw error
    }
}
