import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const GetAccountApi = async (name, status) => {
    try {
        const response = await axios.get(
            `${API_URL}/RequestWorkTime/get-all-work-time-request?nameSearch=${name}&status=${status}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}
export const LoginApi = async (body) => {
    try {
        const response = await axios.post(`${API_URL}/Account/Login`, body)
        return response.data
    } catch (error) {
        throw error
    }
}
export const getRoleApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/Role`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetAccountByIdApi = async (id) => {
    try {
        const response = await axios.get(
            `${API_URL}/RequestWorkTime/get-workslot-lack-time-of-employee?employeeId=${id}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetWorkDateSettingByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/RequestLeave/get-work-date-setting-of-employee?employeeId=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetAccountTypeApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/LeaveType/get-all-leave-type`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PostAccountApi = async (body) => {
    try {
        const response = await axios.post(`${API_URL}/Account`, body)
        return response.data
    } catch (error) {
        console.log("err api", error)
        throw error
    }
}

export const PutAccountApi = async (body, token) => {
    try {
        const response = await axios.put(`${API_URL}/Account/ChangePassword`, body, {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm header Authorization với giá trị Bearer + token
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeleteAccountApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Accounts/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export default GetAccountApi
