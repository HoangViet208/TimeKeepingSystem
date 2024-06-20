import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetTimeEntrieApi, {
    GetTimeEntrieByIdApi,
    DeleteTimeEntrieApi,
    PostTimeEntrieApi,
    PutTimeEntrieApi,
} from '../../Api/TimeEntriesApi'

const initialState = {
    TimeEntrieList: [],
    TimeEntriesDetail: [],
}

const authSlice = createSlice({
    name: 'TimeEntrie',
    initialState,
    reducers: {
        clearTimeEntrie: (state, action) => {
            state.TimeEntrieDetail = []
            state.TimeEntriesList = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTimeEntrieAsyncApi.pending, (state) => {})
            .addCase(getTimeEntrieAsyncApi.fulfilled, (state, action) => {
                state.TimeEntrieList = action.payload
            })
            .addCase(getTimeEntrieAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getTimeEntrieByIdAsyncApi.pending, (state) => {})
            .addCase(getTimeEntrieByIdAsyncApi.fulfilled, (state, action) => {
                state.TimeEntriesDetail = action.payload
            })
            .addCase(getTimeEntrieByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostTimeEntrieAsyncApi.pending, (state) => {})
            .addCase(PostTimeEntrieAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostTimeEntrieAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutTimeEntrieAsyncApi.pending, (state) => {})
            .addCase(PutTimeEntrieAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutTimeEntrieAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteTimeEntrieAsyncApi.pending, (state) => {})
            .addCase(DeleteTimeEntrieAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteTimeEntrieAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const TimeEntrieAction = authSlice.actions

export const getTimeEntrieAsyncApi = createAsyncThunk('TimeEntrieReducer/getAsyncApi', async () => {
    try {
        const response = await GetTimeEntrieApi()
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const getTimeEntrieByIdAsyncApi = createAsyncThunk('TimeEntrieReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetTimeEntrieByIdApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PostTimeEntrieAsyncApi = createAsyncThunk('TimeEntrieReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostTimeEntrieApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PutTimeEntrieAsyncApi = createAsyncThunk('TimeEntrieReducer/putAsyncApi', async (body) => {
    try {
        const response = await PutTimeEntrieApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})
export const DeleteTimeEntrieAsyncApi = createAsyncThunk('TimeEntrieReducer/deleteAsyncApi', async (body) => {
    try {
        const response = await DeleteTimeEntrieApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
