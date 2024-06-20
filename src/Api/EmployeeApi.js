import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const GetEmployeeApi = async (roleId, DepartmentId, name) => {
    try {
        const response = await axios.get(
            `${API_URL}/Employee?roleId=${roleId}&DepartmentID=${DepartmentId}&Searchname=${name}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetEmployeeByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/Employee/get-employee-by-id?employeeId=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PostEmployeeApi = async (body) => {
    try {
        const response = await axios.post(`${API_URL}/Employees`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutEmployeeApi = async (body) => {
    try {
        const response = await axios.patch(`${API_URL}/Employee/edit-employee-by-id`, body)
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeleteEmployeeApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Employee/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const GetALLEmployeeNotIncludeInAnyTeamApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/Employee/get-employee-not-include-in-any-team`)
        return response.data
    } catch (error) {
        throw error
    }
}

export default GetEmployeeApi
