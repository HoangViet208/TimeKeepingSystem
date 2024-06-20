import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetwifiApi, { GetwifiByIdApi, DeletewifiApi, PostwifiApi, PutwifiApi } from '../../Api/WifiApi'

const initialState = {
    wifiList: [],
    wifiDetail: {},
}

const authSlice = createSlice({
    name: 'wifi',
    initialState,
    reducers: {
        clearwifi: (state, action) => {
            state.wifiDetail = {}
            state.wifiList = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getwifiAsyncApi.pending, (state) => {})
            .addCase(getwifiAsyncApi.fulfilled, (state, action) => {
                state.wifiList = action.payload
            })
            .addCase(getwifiAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getwifiByIdAsyncApi.pending, (state) => {})
            .addCase(getwifiByIdAsyncApi.fulfilled, (state, action) => {
                state.wifiDetail = action.payload
            })
            .addCase(getwifiByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostwifiAsyncApi.pending, (state) => {})
            .addCase(PostwifiAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostwifiAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutwifiAsyncApi.pending, (state) => {})
            .addCase(PutwifiAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutwifiAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeletewifiAsyncApi.pending, (state) => {})
            .addCase(DeletewifiAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeletewifiAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const wifiAction = authSlice.actions

export const getwifiAsyncApi = createAsyncThunk('wifiReducer/getAsyncApi', async () => {
    try {
        const response = await GetwifiApi()
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const getwifiByIdAsyncApi = createAsyncThunk('wifiReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetwifiByIdApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PostwifiAsyncApi = createAsyncThunk('wifiReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostwifiApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PutwifiAsyncApi = createAsyncThunk('wifiReducer/putAsyncApi', async (body) => {
    try {
        const response = await PutwifiApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})
export const DeletewifiAsyncApi = createAsyncThunk('wifiReducer/deleteAsyncApi', async (body) => {
    try {
        const response = await DeletewifiApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
