import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetApplyLeaveApi, {
    GetApplyLeaveByIdApi,
    DeleteApplyLeaveApi,
    PostApplyLeaveApi,
    PutApplyLeaveApi,
    GetApplyLeaveTypeApi,
    GetWorkDateSettingByIdApi,
    PutApproveApplyLeaveApi,
    GetApplyLeaveByRequestIdApi,
    PutCancelApprovedLeaveForHRApi,
    PutRejectLeaveApi,
    GetLeaveTypeInfoApi,
} from '../../Api/ApplyLeaveApi'
import { GetAllRequestApi } from '../../Api/RequestApi'

const initialState = {
    loading: false,
    valueTabs: 0,
    ApplyLeaveList: [],
    ApplyLeaveTypeList: ['Casual Leave', 'Sick Leave'],
    ApplyLeaveByEmployee: [],
    WorkSetting: [],
    AllRequestInEmployee: {},
    RequestIdNoti: 0,
    LeaveTypeInfo: {},
}

const authSlice = createSlice({
    name: 'ApplyLeave',
    initialState,
    reducers: {
        clearApplyLeave: (state, action) => {
            state.ApplyLeaveByEmployee = []
            state.ApplyLeaveList = []
            state.ApplyLeaveTypeList = ['Casual Leave', 'Sick Leave']
            state.WorkSetting = []
            state.AllRequestInEmployee = {}
            state.RequestIdNoti = 0
            state.LeaveTypeInfo = {}
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
            .addCase(getApplyLeaveAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getApplyLeaveAsyncApi.fulfilled, (state, action) => {
                state.loading = false
                state.ApplyLeaveList = action.payload
            })
            .addCase(getApplyLeaveAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetAllRequestAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetAllRequestAsyncApi.fulfilled, (state, action) => {
                state.loading = false
                state.AllRequestInEmployee = action.payload
            })
            .addCase(GetAllRequestAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetApplyLeaveByRequestIdAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetApplyLeaveByRequestIdAsyncApi.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(GetApplyLeaveByRequestIdAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkDateSettingByIdAsyncApi.pending, (state) => {})
            .addCase(GetWorkDateSettingByIdAsyncApi.fulfilled, (state, action) => {
                state.WorkSetting = action.payload
            })
            .addCase(GetWorkDateSettingByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getApplyLeaveByIdAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getApplyLeaveByIdAsyncApi.fulfilled, (state, action) => {
                state.loading = false
                state.ApplyLeaveByEmployee = action.payload
            })
            .addCase(getApplyLeaveByIdAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetApplyLeaveTypeAsyncApi.pending, (state) => {})
            .addCase(GetApplyLeaveTypeAsyncApi.fulfilled, (state, action) => {
                state.ApplyLeaveTypeList = action.payload
            })
            .addCase(GetApplyLeaveTypeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(GetLeaveTypeInfoAsyncApi.pending, (state) => {})
            .addCase(GetLeaveTypeInfoAsyncApi.fulfilled, (state, action) => {
                state.LeaveTypeInfo = action.payload
            })
            .addCase(GetLeaveTypeInfoAsyncApi.rejected, (state, action) => {})

        builder
            .addCase(PostApplyLeaveAsyncApi.pending, (state) => {})
            .addCase(PostApplyLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostApplyLeaveAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutApplyLeaveAsyncApi.pending, (state) => {})
            .addCase(PutApplyLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutApplyLeaveAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutCancelApprovedLeaveForHRAsyncApi.pending, (state) => {})
            .addCase(PutCancelApprovedLeaveForHRAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutCancelApprovedLeaveForHRAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutRejectLeaveAsyncApi.pending, (state) => {})
            .addCase(PutRejectLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutRejectLeaveAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutApproveApplyLeaveAsyncApi.pending, (state) => {})
            .addCase(PutApproveApplyLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutApproveApplyLeaveAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteApplyLeaveAsyncApi.pending, (state) => {})
            .addCase(DeleteApplyLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteApplyLeaveAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const ApplyLeaveAction = authSlice.actions

export const getApplyLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/getAsyncApi', async ({ name, status, id }) => {
    try {
        const response = await GetApplyLeaveApi(name, status, id)
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const GetWorkDateSettingByIdAsyncApi = createAsyncThunk(
    'ApplyLeaveReducer/GetWorkDateSettingByIdApi',
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
export const GetApplyLeaveTypeAsyncApi = createAsyncThunk('ApplyLeaveReducer/GetApplyLeaveTypeApi', async (id) => {
    try {
        const response = await GetApplyLeaveTypeApi()
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const GetLeaveTypeInfoAsyncApi = createAsyncThunk(
    'ApplyLeaveReducer/GetLeaveTypeInfoApi',
    async ({employeeId, LeaveTypeId}) => {
        try {
            const response = await GetLeaveTypeInfoApi(employeeId, LeaveTypeId)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)

export const getApplyLeaveByIdAsyncApi = createAsyncThunk('ApplyLeaveReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetApplyLeaveByIdApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const GetApplyLeaveByRequestIdAsyncApi = createAsyncThunk(
    'ApplyLeaveReducer/GetApplyLeaveByRequestIdApi',
    async (id) => {
        try {
            const response = await GetApplyLeaveByRequestIdApi(id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)

export const GetAllRequestAsyncApi = createAsyncThunk('ApplyLeaveReducer/GetAllRequestApi', async ({id,date}) => {
    try {
        const response = await GetAllRequestApi(id, date)
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const PostApplyLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/postAsyncApi', async ({ id, body }) => {
    try {
        const response = await PostApplyLeaveApi(id, body)
        return response
    } catch (error) {
        throw error.response.data
   
    }
})
export const PutApplyLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/putAsyncApi', async ({ id, body }) => {
    try {
        const response = await PutApplyLeaveApi(id, body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})

export const PutCancelApprovedLeaveForHRAsyncApi = createAsyncThunk(
    'ApplyLeaveReducer/PutCancelApprovedLeaveForHRApi',
    async (body) => {
        try {
            const response = await PutCancelApprovedLeaveForHRApi(body)
            return response.data // Trả về dữ liệu từ response nếu thành công
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)

export const PutRejectLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/PutRejectLeaveApi', async (body) => {
    try {
        const response = await PutRejectLeaveApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})

export const PutApproveApplyLeaveAsyncApi = createAsyncThunk(
    'ApplyLeaveReducer/PutApproveApplyLeaveApi',
    async (data) => {
        try {
            const response = await PutApproveApplyLeaveApi(data.requestId, data.UserParseId)
            return response.data // Trả về dữ liệu từ response nếu thành công
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
export const DeleteApplyLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/deleteAsyncApi', async (data) => {
    try {
        const response = await DeleteApplyLeaveApi(data.idDelete, data.UserParseId)
        return response
    } catch (error) {
        throw error.response.data
    }
})
