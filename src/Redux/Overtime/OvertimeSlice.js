import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetOvertimeApi, {
    GetOvertimeByIdApi,
    DeleteOvertimeApi,
    PostOvertimeApi,
    PutOvertimeApi,
    GetOvertimeTypeApi,
    GetWorkDateSettingByIdApi,
    CancelOvertimeApi,
    GetTotalTimeOvertimeApi,
    RejectOvertimeApi,
    GetOvertimeByRequestIdApi,
} from '../../Api/OvertimeApi'

const initialState = {
    loading: false,
    valueTabs: 0,
    OvertimeList: [],
    OvertimeTypeList: [],
    OvertimeByEmployee: [],
    WorkSetting: [],
    totalOverTime: {},
    RequestIdNoti: 0,
}

const authSlice = createSlice({
    name: 'Overtime',
    initialState,
    reducers: {
        clearOvertime: (state, action) => {
            state.OvertimeByEmployee = []
            state.OvertimeList = []
            state.OvertimeTypeList = []
            state.WorkSetting = []
            state.totalOverTime = {}
        },
        ChangeTab: (state, action) => {
            state.valueTabs = action.payload
        },
        changeRequestId: (state, action) => {
            state.RequestIdNoti = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOvertimeAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getOvertimeAsyncApi.fulfilled, (state, action) => {
                state.OvertimeList = action.payload
                state.loading = false
            })
            .addCase(getOvertimeAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkDateSettingByIdAsyncApi.pending, (state) => {})
            .addCase(GetWorkDateSettingByIdAsyncApi.fulfilled, (state, action) => {
                state.WorkSetting = action.payload
            })
            .addCase(GetWorkDateSettingByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getOvertimeByIdAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getOvertimeByIdAsyncApi.fulfilled, (state, action) => {
                state.OvertimeByEmployee = action.payload
                state.loading = false
            })
            .addCase(getOvertimeByIdAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetOvertimeTypeAsyncApi.pending, (state) => {})
            .addCase(GetOvertimeTypeAsyncApi.fulfilled, (state, action) => {
                state.OvertimeTypeList = action.payload
            })
            .addCase(GetOvertimeTypeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(GetTotalTimeOvertimeAsyncApi.pending, (state) => {})
            .addCase(GetTotalTimeOvertimeAsyncApi.fulfilled, (state, action) => {
                state.totalOverTime = action.payload
            })
            .addCase(GetTotalTimeOvertimeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(GetOvertimeByRequestIdAsyncApi.pending, (state) => {})
            .addCase(GetOvertimeByRequestIdAsyncApi.fulfilled, (state, action) => {})
            .addCase(GetOvertimeByRequestIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostOvertimeAsyncApi.pending, (state) => {})
            .addCase(PostOvertimeAsyncApi.fulfilled, (state, action) => {
            })
            .addCase(PostOvertimeAsyncApi.rejected, (state, action) => {
            
            })
        builder
            .addCase(PutOvertimeAsyncApi.pending, (state) => {})
            .addCase(PutOvertimeAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutOvertimeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(CancelOvertimeAsyncApi.pending, (state) => {})
            .addCase(CancelOvertimeAsyncApi.fulfilled, (state, action) => {})
            .addCase(CancelOvertimeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(RejectOvertimeAsyncApi.pending, (state) => {})
            .addCase(RejectOvertimeAsyncApi.fulfilled, (state, action) => {})
            .addCase(RejectOvertimeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteOvertimeAsyncApi.pending, (state) => {})
            .addCase(DeleteOvertimeAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteOvertimeAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const OvertimeAction = authSlice.actions

export const getOvertimeAsyncApi = createAsyncThunk(
    'OvertimeReducer/getAsyncApi',
    async ({ name, status, date, id }) => {
        try {
            const response = await GetOvertimeApi(name, status, date, id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)

export const GetWorkDateSettingByIdAsyncApi = createAsyncThunk(
    'OvertimeReducer/GetWorkDateSettingByIdApi',
    async (id) => {
        try {
            const response = await GetWorkDateSettingByIdApi(id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
export const GetOvertimeTypeAsyncApi = createAsyncThunk('OvertimeReducer/GetOvertimeTypeApi', async (id) => {
    try {
        const response = await GetOvertimeTypeApi()
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const GetTotalTimeOvertimeAsyncApi = createAsyncThunk('OvertimeReducer/GetTotalTimeOvertimeApi', async (id) => {
    try {
        const response = await GetTotalTimeOvertimeApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const GetOvertimeByRequestIdAsyncApi = createAsyncThunk(
    'OvertimeReducer/GetOvertimeByRequestIdApi',
    async (id) => {
        try {
            const response = await GetOvertimeByRequestIdApi(id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
export const getOvertimeByIdAsyncApi = createAsyncThunk('OvertimeReducer/GetOvertimeByIdApi', async (id) => {
    try {
        const response = await GetOvertimeByIdApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PostOvertimeAsyncApi = createAsyncThunk('OvertimeReducer/postAsyncApi', async ({ id, body }) => {
    try {
        const response = await PostOvertimeApi(id, body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PutOvertimeAsyncApi = createAsyncThunk('OvertimeReducer/putAsyncApi', async ({ id, body }) => {
    try {
        const response = await PutOvertimeApi(id, body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})

export const CancelOvertimeAsyncApi = createAsyncThunk('OvertimeReducer/cancelAsyncApi', async (body) => {
    try {
        const response = await CancelOvertimeApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})

export const RejectOvertimeAsyncApi = createAsyncThunk('OvertimeReducer/RejectOvertimeApi', async (body) => {
    try {
        const response = await RejectOvertimeApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})

export const DeleteOvertimeAsyncApi = createAsyncThunk('OvertimeReducer/deleteAsyncApi', async (data) => {
    try {
        const response = await DeleteOvertimeApi(data.idDelete, data.employeeId)
        return response
    } catch (error) {
        throw error.response.data
    }
})
