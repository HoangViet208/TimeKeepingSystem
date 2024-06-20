import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    GetDateSettingByIdApi,
    GetLeaveSettingByIdApi,
    GetRiskSettingByIdApi,
    GetTimeSettingByIdApi,
    PutDateSettingByIdApi,
    PutLeaveSettingByIdApi,
    PutRiskSettingByIdApi,
    PutTimeSettingByIdApi,
} from '../../Api/SettingApi'

const initialState = {
    dateSetting: {},
    timeSetting: {},
    leaveSetting: {},
    riskSetting: {},
}

const authSlice = createSlice({
    name: 'Setting',
    initialState,
    reducers: {
        clearSetting: (state, action) => {
            state.dateSetting = {}
            state.timeSetting = {}
            state.leaveSetting = {}
            state.riskSetting = {}
        },
        ChangeTab: (state, action) => {
            state.valueTabs = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDateSettingAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getDateSettingAsyncApi.fulfilled, (state, action) => {
                state.dateSetting = action.payload
                state.loading = false
            })
            .addCase(getDateSettingAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(getTimeSettingAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getTimeSettingAsyncApi.fulfilled, (state, action) => {
                state.timeSetting = action.payload
                state.loading = false
            })
            .addCase(getTimeSettingAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(getLeaveSettingAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getLeaveSettingAsyncApi.fulfilled, (state, action) => {
                state.leaveSetting = action.payload
                state.loading = false
            })
            .addCase(getLeaveSettingAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(getRiskSettingAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getRiskSettingAsyncApi.fulfilled, (state, action) => {
                state.riskSetting = action.payload
                state.loading = false
            })
            .addCase(getRiskSettingAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(putDateSettingAsyncApi.pending, (state) => {})
            .addCase(putDateSettingAsyncApi.fulfilled, (state, action) => {})
            .addCase(putDateSettingAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(putTimeSettingAsyncApi.pending, (state) => {})
            .addCase(putTimeSettingAsyncApi.fulfilled, (state, action) => {})
            .addCase(putTimeSettingAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(putLeaveSettingAsyncApi.pending, (state) => {})
            .addCase(putLeaveSettingAsyncApi.fulfilled, (state, action) => {})
            .addCase(putLeaveSettingAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(putRiskSettingAsyncApi.pending, (state) => {})
            .addCase(putRiskSettingAsyncApi.fulfilled, (state, action) => {})
            .addCase(putRiskSettingAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const SettingAction = authSlice.actions

export const getDateSettingAsyncApi = createAsyncThunk('SettingReducer/getDateSettingAsyncApi', async (id) => {
    try {
        const response = await GetDateSettingByIdApi(id)
        return response.data
    } catch (error) {
        throw error.response.data
    }
})

export const getTimeSettingAsyncApi = createAsyncThunk('SettingReducer/getTimeSettingAsyncApi', async (id) => {
    try {
        const response = await GetTimeSettingByIdApi(id)
        return response.data
    } catch (error) {
        throw error.response.data
    }
})
export const getLeaveSettingAsyncApi = createAsyncThunk('SettingReducer/getLeaveSettingAsyncApi', async (id) => {
    try {
        const response = await GetLeaveSettingByIdApi(id)
        return response.data
    } catch (error) {
        throw error.response.data
    }
})
export const getRiskSettingAsyncApi = createAsyncThunk('SettingReducer/getRiskSettingAsyncApi', async (id) => {
    try {
        const response = await GetRiskSettingByIdApi(id)
        return response.data
    } catch (error) {
        throw error.response.data
    }
})

export const putDateSettingAsyncApi = createAsyncThunk('SettingReducer/putDateSettingAsyncApi', async (body) => {
    try {
        const response = await PutDateSettingByIdApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const putTimeSettingAsyncApi = createAsyncThunk('SettingReducer/putTimeSettingAsyncApi', async (body) => {
    try {
        const response = await PutTimeSettingByIdApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const putLeaveSettingAsyncApi = createAsyncThunk('SettingReducer/putLeaveSettingAsyncApi', async (body) => {
    try {
        const response = await PutLeaveSettingByIdApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const putRiskSettingAsyncApi = createAsyncThunk('SettingReducer/putRiskSettingAsyncApi', async (body) => {
    try {
        const response = await PutRiskSettingByIdApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
