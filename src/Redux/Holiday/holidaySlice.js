import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetHolidayApi, { GetHolidayByIdApi, DeleteHolidayApi, PostHolidayApi, PutHolidayApi } from '../../Api/HolidayApi'

const initialState = {
    HolidayList: [],
    HolidayDetail: {},
    loading: false,
}

const authSlice = createSlice({
    name: 'Holiday',
    initialState,
    reducers: {
        clearHoliday: (state, action) => {
            state.HolidayDetail = {}
            state.HolidayList = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHolidayAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getHolidayAsyncApi.fulfilled, (state, action) => {
                state.HolidayList = action.payload
                state.loading = false
            })
            .addCase(getHolidayAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(getHolidayByIdAsyncApi.pending, (state) => {})
            .addCase(getHolidayByIdAsyncApi.fulfilled, (state, action) => {
                state.HolidayDetail = action.payload
            })
            .addCase(getHolidayByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostHolidayAsyncApi.pending, (state) => {})
            .addCase(PostHolidayAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostHolidayAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutHolidayAsyncApi.pending, (state) => {})
            .addCase(PutHolidayAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutHolidayAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteHolidayAsyncApi.pending, (state) => {})
            .addCase(DeleteHolidayAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteHolidayAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const HolidayAction = authSlice.actions

export const getHolidayAsyncApi = createAsyncThunk('HolidayReducer/getAsyncApi', async () => {
    try {
        const response = await GetHolidayApi()
        return response.data
    } catch (error) {
        throw error.response.data
    }
})
export const getHolidayByIdAsyncApi = createAsyncThunk('HolidayReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetHolidayByIdApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PostHolidayAsyncApi = createAsyncThunk('HolidayReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostHolidayApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PutHolidayAsyncApi = createAsyncThunk('HolidayReducer/putAsyncApi', async (body) => {
    try {
        const response = await PutHolidayApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})
export const DeleteHolidayAsyncApi = createAsyncThunk('HolidayReducer/deleteAsyncApi', async (id) => {
    try {
        const response = await DeleteHolidayApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
