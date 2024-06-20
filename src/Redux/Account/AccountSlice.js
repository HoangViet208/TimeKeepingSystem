import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetAccountApi, {
    GetAccountByIdApi,
    DeleteAccountApi,
    PostAccountApi,
    PutAccountApi,
    GetAccountTypeApi,
    GetWorkDateSettingByIdApi,
    LoginApi,
    getRoleApi,
} from '../../Api/AccountApi'

const initialState = {
    valueTabs: 0,
    RoleList: [],
    AccountList: [],
    AccountTypeList: ['Casual Leave', 'Sick Leave'],
    AccountByEmployee: [],
    WorkSetting: [],
}

const authSlice = createSlice({
    name: 'Account',
    initialState,
    reducers: {
        clearAccount: (state, action) => {
            state.AccountByEmployee = []
            state.RoleList = []
            state.AccountList = []
            state.AccountTypeList = []
            state.WorkSetting = []
        },
        ChangeTab: (state, action) => {
            state.valueTabs = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRoleAsyncApi.pending, (state) => {})
            .addCase(getRoleAsyncApi.fulfilled, (state, action) => {
                state.RoleList = action.payload
            })
            .addCase(getRoleAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getAccountAsyncApi.pending, (state) => {})
            .addCase(getAccountAsyncApi.fulfilled, (state, action) => {
                state.AccountList = action.payload
            })
            .addCase(getAccountAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(loginAsyncApi.pending, (state) => {})
            .addCase(loginAsyncApi.fulfilled, (state, action) => {})
            .addCase(loginAsyncApi.rejected, (state, action) => {})

        builder
            .addCase(GetWorkDateSettingByIdAsyncApi.pending, (state) => {})
            .addCase(GetWorkDateSettingByIdAsyncApi.fulfilled, (state, action) => {
                state.WorkSetting = action.payload
            })
            .addCase(GetWorkDateSettingByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getAccountByIdAsyncApi.pending, (state) => {})
            .addCase(getAccountByIdAsyncApi.fulfilled, (state, action) => {
                state.AccountByEmployee = action.payload
            })
            .addCase(getAccountByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(GetAccountTypeAsyncApi.pending, (state) => {})
            .addCase(GetAccountTypeAsyncApi.fulfilled, (state, action) => {
                state.AccountTypeList = action.payload
            })
            .addCase(GetAccountTypeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostAccountAsyncApi.pending, (state) => {})
            .addCase(PostAccountAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostAccountAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutAccountAsyncApi.pending, (state) => {})
            .addCase(PutAccountAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutAccountAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteAccountAsyncApi.pending, (state) => {})
            .addCase(DeleteAccountAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteAccountAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const AccountAction = authSlice.actions

export const loginAsyncApi = createAsyncThunk('AccountReducer/loginAsyncApi', async (body) => {
    try {
        const response = await LoginApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const getAccountAsyncApi = createAsyncThunk('AccountReducer/getAsyncApi', async ({ name, status }) => {
    try {
        const response = await GetAccountApi(name, status)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const getRoleAsyncApi = createAsyncThunk('AccountReducer/getRoleAsyncApi', async () => {
    try {
        const response = await getRoleApi()
        return response
    } catch (error) {
        throw error.response.data
    }
})

export const GetWorkDateSettingByIdAsyncApi = createAsyncThunk(
    'AccountReducer/GetWorkDateSettingByIdApi',
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
export const GetAccountTypeAsyncApi = createAsyncThunk('AccountReducer/GetAccountTypeApi', async (id) => {
    try {
        const response = await GetAccountTypeApi()
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const getAccountByIdAsyncApi = createAsyncThunk('AccountReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetAccountByIdApi(id)
        return response
    } catch (error) {
        throw error.response.data
    }
})
export const PostAccountAsyncApi = createAsyncThunk('AccountReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostAccountApi(body)
        return response
    } catch (error) {
        console.log("er", error)
        throw error.response.data.message
    }
})
export const PutAccountAsyncApi = createAsyncThunk('AccountReducer/putAsyncApi', async ({ body, token }) => {
    try {
        const response = await PutAccountApi(body, token)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        throw error.response.data
    }
})
export const DeleteAccountAsyncApi = createAsyncThunk('AccountReducer/deleteAsyncApi', async (body) => {
    try {
        const response = await DeleteAccountApi(body)
        return response
    } catch (error) {
        throw error.response.data
    }
})
