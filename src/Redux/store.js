// store.js
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import employeeReducer from './Employee/employeeSlice'
import holidayReducer from './Holiday/holidaySlice'
import timeEntriesReducer from './TimeEntries/timeEntriesSlice'
import ApplyLeaveSlice from './ApplyLeave/ApplyLeaveSlice'
import OvertimeSlice from './Overtime/OvertimeSlice'
import DepartmentSlice from './Department/DepartmentSlice'
import WorkedSlice from './Worked/WorkedSlice'
import AccountSlice from './Account/AccountSlice'
import WorkSlotEmployeeSlice from './WorkSlotEmployee/WorkSlotEmployeeSlice'
import SettingSlice from './Setting/SettingSlice'
import wifiSlice from './Wifi/wifiSlice'

export const store = configureStore({
    reducer: {
        employee: employeeReducer,
        holiday: holidayReducer,
        timeEntries: timeEntriesReducer,
        applyLeave: ApplyLeaveSlice,
        overTime: OvertimeSlice,
        department: DepartmentSlice,
        worked: WorkedSlice,
        account: AccountSlice,
        WorkSlotEmployee: WorkSlotEmployeeSlice,
        setting: SettingSlice,
        wifi: wifiSlice,
    },
    middleware: [thunk],
})
