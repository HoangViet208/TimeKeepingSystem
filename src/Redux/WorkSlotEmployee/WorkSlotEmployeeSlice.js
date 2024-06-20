import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    GetWorkedSlotByIdDepartmentApi,
    GetWorkedSlotByIdEmployeeApi,
    GetWorkedSlotExcelApi,
    GetWorkedSlotForPersonalApi,
    GetWorkedSlotForTeamApi,
} from '../../Api/WorkSlotEmployeeApi'

const initialState = {
    loading: false,
    WorkSlotByEmployee: [],
    WorkSlotByDepartment: [],
    WorkslotForPersonal: [],
    WorkslotForTeam: [],
    currentRequestId: undefined,
}

const authSlice = createSlice({
    name: 'WorkSlotEmployeeed',
    initialState,
    reducers: {
        clearWorkSlotEmployeeed: (state, action) => {
            state.WorkSlotByEmployee = []
            state.WorkSlotByDepartment = []
        },
        ChangeTab: (state, action) => {
            state.valueTabs = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWorkSlotEmployeeedAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getWorkSlotEmployeeedAsyncApi.fulfilled, (state, action) => {
                state.WorkSlotByEmployee = action.payload
                state.loading = false
            })
            .addCase(getWorkSlotEmployeeedAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkedSlotByIdDepartmentAsyncApi.pending, (state, action) => {

                state.loading = true
            })
            .addCase(GetWorkedSlotByIdDepartmentAsyncApi.fulfilled, (state, action) => {
                state.loading = false
                state.WorkSlotByDepartment = action.payload
            })
            .addCase(GetWorkedSlotByIdDepartmentAsyncApi.rejected, (state, action) => {
                state.loading = false
                state.currentRequestId = undefined
            })
        builder
            .addCase(GetWorkedSlotExcelAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetWorkedSlotExcelAsyncApi.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(GetWorkedSlotExcelAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkedSlotForTeamAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetWorkedSlotForTeamAsyncApi.fulfilled, (state, action) => {
                state.loading = false
                state.WorkslotForTeam = action.payload
            })
            .addCase(GetWorkedSlotForTeamAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkedSlotForPersonalAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetWorkedSlotForPersonalAsyncApi.fulfilled, (state, action) => {
                state.loading = false
                state.WorkslotForPersonal = action.payload
            })
            .addCase(GetWorkedSlotForPersonalAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
    },
})

export default authSlice.reducer
export const WorkSlotEmployeeedAction = authSlice.actions

export const getWorkSlotEmployeeedAsyncApi = createAsyncThunk(
    'WorkSlotEmployeeedReducer/getAsyncApi',
    async ({ id, month }) => {
        try {
            const response = await GetWorkedSlotByIdEmployeeApi(id, month)
            return response
        } catch (error) {
            throw error.response.data
        }
    }
)

export const GetWorkedSlotByIdDepartmentAsyncApi = createAsyncThunk(
    'WorkSlotEmployeeedReducer/GetWorkedSlotByIdDepartmentApi',
    async ({ id, startTime, endTime }) => {
        try {
            const response = await GetWorkedSlotByIdDepartmentApi(id, startTime, endTime)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
export const GetWorkedSlotExcelAsyncApi = createAsyncThunk(
    'WorkSlotEmployeeedReducer/GetWorkedSlotExcelApi',
    async (id) => {
        try {
            const response = await GetWorkedSlotExcelApi(id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)

export const GetWorkedSlotForPersonalAsyncApi = createAsyncThunk(
    'WorkSlotEmployeeedReducer/GetWorkedSlotForPersonalApi',
    async ({ id, month }) => {
        try {
            const response = await GetWorkedSlotForPersonalApi(id, month)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)

export const GetWorkedSlotForTeamAsyncApi = createAsyncThunk(
    'WorkSlotEmployeeedReducer/GetWorkedSlotForTeamApi',
    async ({ teamId, month, employeeId }) => {
        try {
            const response = await GetWorkedSlotForTeamApi(teamId, month, employeeId)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw error.response.datas[0].errorMessage
        }
    }
)
