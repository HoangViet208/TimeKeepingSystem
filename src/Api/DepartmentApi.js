import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const GetDepartmentApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/Department`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetDepartmentWithoutApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/Department/get-department-without-manager`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetDepartmentByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/Department/get-all-employee-in-department-id?departmentId=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PostDepartmentApi = async (body) => {
    try {
        const response = await axios.post(`${API_URL}/Department`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutDepartmentApi = async (body) => {
    try {
        const response = await axios.put(`${API_URL}/Department`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeleteDepartmentApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Department/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const GetALLEmployeeInDepartmentApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/Department/get-department-info-by-employee-id?employeeId=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const UpdateTeamMemberApi = async (body) => {
    try {
        const response = await axios.put(`${API_URL}/Department/update-teammember-role-info-of-department`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export default GetDepartmentApi
