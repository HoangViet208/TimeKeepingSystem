import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const GetApplyLeaveApi = async (name, status, id) => {
    try {
        const response = await axios.get(
            `${API_URL}/RequestLeave/get-all-request-leave-of-all-employee?nameSearch=${name}&status=${status}&employeeId=${id}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const GetApplyLeaveByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/RequestLeave/get-request-leave-of-employee?employeeId=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetApplyLeaveByRequestIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/RequestLeave/get-request-leave-by-request-id?requestId=${id}`)
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
export const GetApplyLeaveTypeApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/LeaveType/get-all-leave-type`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetLeaveTypeInfoApi = async (employeeId , LeaveTypeId) => {
    try {

        const response = await axios.get(`${API_URL}/RequestLeave/get-leave-type-info-of-employee-by-id?employeeId=${employeeId}&leaveTypeId=${LeaveTypeId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const PostApplyLeaveApi = async (id, body) => {
    try {
        const response = await axios.post(
            `${API_URL}/RequestLeave/create-request-leave-of-employee?employeeId=${id}`,
            body
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutApplyLeaveApi = async (id, body) => {
    try {
        const response = await axios.patch(
            `${API_URL}/RequestLeave/edit-request-leave-of-employee?employeeId=${id}`,
            body
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutCancelApprovedLeaveForHRApi = async (body) => {
    try {
        const response = await axios.patch(
            `${API_URL}/RequestLeave/cancel-approved-leave-request-for-hr`, body
            
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutRejectLeaveApi = async (body) => {
    try {
        const response = await axios.patch(
            `${API_URL}/RequestLeave/reject-leave-request`, body
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutApproveApplyLeaveApi = async (id, empId) => {
    try {
        const response = await axios.patch(`${API_URL}/RequestLeave/approve-leave-request?requestId=${id}&employeeIdDecider=${empId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeleteApplyLeaveApi = async (id,empId) => {
    try {
        const response = await axios.delete(`${API_URL}/RequestLeave/delete-nonapproved-leave-request-for-employee?requestId=${id}&employeeIdDecider=${empId}`)
        return response.data
    } catch (error) {
        throw error
    }
}


export default GetApplyLeaveApi
