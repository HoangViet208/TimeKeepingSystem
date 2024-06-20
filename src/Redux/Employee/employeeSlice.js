import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetEmployeeApi, {
    GetEmployeeByIdApi,
    DeleteEmployeeApi,
    PostEmployeeApi,
    PutEmployeeApi,
    GetALLEmployeeNotIncludeInAnyTeamApi,
} from '../../Api/EmployeeApi'

const initialState = {
    EmployeeList: [],
    EmployeeDetail: {},
    EmployeeNotTeam: [],
}

const authSlice = createSlice({
    name: 'Employee',
    initialState,
    reducers: {
        clearEmployee: (state, action) => {
            state.EmployeeDetail = {}
            state.EmployeeList = []
            state.EmployeeNotIncludeInAnyTeam = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEmployeeAsyncApi.pending, (state) => {})
            .addCase(getEmployeeAsyncApi.fulfilled, (state, action) => {
                state.EmployeeList = action.payload
                const userId = localStorage.getItem('role')
                const RoleUser = JSON.parse(userId)
                if (RoleUser == 'Admin') {
                    state.EmployeeList = action.payload
                } else {
                    const filteredEmployeeList = action.payload.filter((hr) => hr.id !== 'aa57b5fe-2ae8-4fcf-a16b-cb0597d92397')
                    state.EmployeeList = filteredEmployeeList
                }
            })
            .addCase(getEmployeeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(GetALLEmployeeNotIncludeInAnyTeamAsyncApi.pending, (state) => {})
            .addCase(GetALLEmployeeNotIncludeInAnyTeamAsyncApi.fulfilled, (state, action) => {
                state.EmployeeNotTeam = action.payload
            })
            .addCase(GetALLEmployeeNotIncludeInAnyTeamAsyncApi.rejected, (state, action) => {})

        builder
            .addCase(getEmployeeByIdAsyncApi.pending, (state) => {})
            .addCase(getEmployeeByIdAsyncApi.fulfilled, (state, action) => {
                state.EmployeeDetail = action.payload
            })
            .addCase(getEmployeeByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostEmployeeAsyncApi.pending, (state) => {})
            .addCase(PostEmployeeAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostEmployeeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutEmployeeAsyncApi.pending, (state) => {})
            .addCase(PutEmployeeAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutEmployeeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteEmployeeAsyncApi.pending, (state) => {})
            .addCase(DeleteEmployeeAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteEmployeeAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const EmployeeAction = authSlice.actions

export const getEmployeeAsyncApi = createAsyncThunk(
    'EmployeeReducer/getAsyncApi',
    async ({ roleId, departmentId, name }) => {
        try {
            const response = await GetEmployeeApi(roleId, departmentId, name)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
export const getEmployeeByIdAsyncApi = createAsyncThunk('EmployeeReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetEmployeeByIdApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const GetALLEmployeeNotIncludeInAnyTeamAsyncApi = createAsyncThunk(
    'EmployeeReducer/getALLEmployeeNotIncludeInAnyTeamApi',
    async () => {
        try {
            const response = await GetALLEmployeeNotIncludeInAnyTeamApi()
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
export const PostEmployeeAsyncApi = createAsyncThunk('EmployeeReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostEmployeeApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PutEmployeeAsyncApi = createAsyncThunk('EmployeeReducer/putAsyncApi', async (body) => {
    try {
        const response = await PutEmployeeApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})
export const DeleteEmployeeAsyncApi = createAsyncThunk('EmployeeReducer/deleteAsyncApi', async (body) => {
    try {
        const response = await DeleteEmployeeApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
