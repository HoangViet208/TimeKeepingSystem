import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetDepartmentApi, {
    GetDepartmentByIdApi,
    DeleteDepartmentApi,
    PostDepartmentApi,
    PutDepartmentApi,
    GetDepartmentWithoutApi,
    GetALLEmployeeInDepartmentApi,
    UpdateTeamMemberApi,
} from '../../Api/DepartmentApi'

const initialState = {
    isLoading: false,
    DepartmentList: [],
    DepartmentWithoutList: [],
    DepartmentDetail: [],
    AllEmployeeInDepartment: {},
}

const authSlice = createSlice({
    name: 'Department',
    initialState,
    reducers: {
        clearDepartment: (state, action) => {
            state.DepartmentDetail = []
            state.DepartmentList = []
            state.DepartmentWithoutList = []
            state.AllEmployeeInDepartment = {}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDepartmentAsyncApi.pending, (state) => {})
            .addCase(getDepartmentAsyncApi.fulfilled, (state, action) => {
                const userId = localStorage.getItem('employeeId')
                const IdUser = JSON.parse(userId)
                const userRole = localStorage.getItem('role')
                const RoleUser = JSON.parse(userRole)
                if (RoleUser == 'Admin' || IdUser == 'aa57b5fe-2ae8-4fcf-a16b-cb0597d92397') {
                    state.DepartmentList = action.payload
                } else {
                    const filteredDepartmentList = action.payload.filter((department) => department.name !== 'Team HR')
                    state.DepartmentList = filteredDepartmentList
                }
            })
            .addCase(getDepartmentAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(GetALLEmployeeInDepartmentAsyncApi.pending, (state) => {
                state.isLoading = true
            })
            .addCase(GetALLEmployeeInDepartmentAsyncApi.fulfilled, (state, action) => {
                state.AllEmployeeInDepartment = action.payload
                state.isLoading = false
            })
            .addCase(GetALLEmployeeInDepartmentAsyncApi.rejected, (state, action) => {
                state.isLoading = false
            })
        builder
            .addCase(GetDepartmentWithoutAsyncApi.pending, (state) => {})
            .addCase(GetDepartmentWithoutAsyncApi.fulfilled, (state, action) => {
                state.DepartmentWithoutList = action.payload
            })
            .addCase(GetDepartmentWithoutAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getDepartmentByIdAsyncApi.pending, (state) => {})
            .addCase(getDepartmentByIdAsyncApi.fulfilled, (state, action) => {
                state.DepartmentDetail = action.payload
            })
            .addCase(getDepartmentByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostDepartmentAsyncApi.pending, (state) => {})
            .addCase(PostDepartmentAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostDepartmentAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutDepartmentAsyncApi.pending, (state) => {})
            .addCase(PutDepartmentAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutDepartmentAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutTeamMemberAsyncApi.pending, (state) => {})
            .addCase(PutTeamMemberAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutTeamMemberAsyncApi.rejected, (state, action) => {})

        builder
            .addCase(DeleteDepartmentAsyncApi.pending, (state) => {})
            .addCase(DeleteDepartmentAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteDepartmentAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const DepartmentAction = authSlice.actions

export const getDepartmentAsyncApi = createAsyncThunk('DepartmentReducer/getAsyncApi', async () => {
    try {
        const response = await GetDepartmentApi()
        return response.data
    } catch (error) {
        throw error.response.data
    }
})
export const GetDepartmentWithoutAsyncApi = createAsyncThunk('DepartmentReducer/GetDepartmentWithoutApi', async () => {
    try {
        const response = await GetDepartmentWithoutApi()
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const getDepartmentByIdAsyncApi = createAsyncThunk('DepartmentReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetDepartmentByIdApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PostDepartmentAsyncApi = createAsyncThunk('DepartmentReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostDepartmentApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PutDepartmentAsyncApi = createAsyncThunk('DepartmentReducer/putAsyncApi', async (body) => {
    try {
        const response = await PutDepartmentApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})
export const PutTeamMemberAsyncApi = createAsyncThunk('DepartmentReducer/putTeamMemberApi', async (body) => {
    try {
        const response = await UpdateTeamMemberApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})
export const DeleteDepartmentAsyncApi = createAsyncThunk('DepartmentReducer/deleteAsyncApi', async (body) => {
    try {
        const response = await DeleteDepartmentApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const GetALLEmployeeInDepartmentAsyncApi = createAsyncThunk(
    'DepartmentReducer/getALLEmployeeInDepartmentApi',
    async (id) => {
        try {
            const response = await GetALLEmployeeInDepartmentApi(id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
