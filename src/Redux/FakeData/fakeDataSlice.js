import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PostGenerationDataCheckInApi, PostGenerationDataEmployeeApi } from '../../Api/FakeDataApi'

const initialState = {
    fakedataList: [],
    fakedataDetail: {},
}

const authSlice = createSlice({
    name: 'fakedata',
    initialState,
    reducers: {
        clearfakedata: (state, action) => {
            state.fakedataDetail = {}
            state.fakedataList = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(PostGenerationDataEmployeeAsyncApi.pending, (state) => {})
            .addCase(PostGenerationDataEmployeeAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostGenerationDataEmployeeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostGenerationDataCheckInAsyncApi.pending, (state) => {})
            .addCase(PostGenerationDataCheckInAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostGenerationDataCheckInAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const fakedataAction = authSlice.actions

export const PostGenerationDataEmployeeAsyncApi = createAsyncThunk('fakedataReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostGenerationDataEmployeeApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const PostGenerationDataCheckInAsyncApi = createAsyncThunk(
    'fakedataReducer/postAsyncApi',
    async ({ id, std, end }) => {
        try {
            const response = await PostGenerationDataCheckInApi(id, std, end)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
