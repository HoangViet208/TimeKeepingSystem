import React, { useEffect, useState } from 'react'

//mui
import {
    Select,
    MenuItem,
    FormControl,
    Autocomplete,
    TextField,
    InputLabel,
    FormControlLabel,
    Button,
    Tooltip,
    IconButton,
} from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { addDays, startOfDay, parse, set, setDay } from 'date-fns'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
//icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import DeleteIcon from '@mui/icons-material/Delete'
//component
import IconBreadcrumbs from '../../../Components/Breadcrumbs'

import { Checkbox } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getDepartmentAsyncApi } from '../../../Redux/Department/DepartmentSlice'
import {
    getDateSettingAsyncApi,
    getLeaveSettingAsyncApi,
    getRiskSettingAsyncApi,
    getTimeSettingAsyncApi,
    putDateSettingAsyncApi,
    putRiskSettingAsyncApi,
    putTimeSettingAsyncApi,
} from '../../../Redux/Setting/SettingSlice'
import { FormatDateToTime, formatTimeToDate } from '../../../Hook/useFormatDate'
import { useSnackbar } from '../../../Hook/useSnackbar'
import PopupData from '../../../Components/Popup'
import TableData from '../../../Components/Table'
import NavbarHR from '../../Manager/NavbarHR'
import Navbar from '../../Manager/Navbar'
const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'leaveTypeName', label: 'Type Name', minWidth: 200, align: 'left' },
    { id: 'maxDateLeave', label: 'Date Leave', minWidth: 200, align: 'left' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'center' },
]
const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Track Settings', icon: <BadgeIcon />, url: '/Employee', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function TrackSettings() {
    const showSnackbar = useSnackbar()
    const initialDateStatus = {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
    }
    const Permissions = [
        "Hide the admin's tracking data from the team head view",
        'Allow the employee to see their screen capture',
        'Allow the employee to delete their screen capture',
        "Allow heads to delete their team member's screenshot",
        'Allow the employee to see their timesheet',
        'Allow the employee to see their time-lapse video',
        'Allow heads to review apps & sites',
        'Allow the employee to access website',
    ]
    const [checkedItems, setCheckedItems] = useState({})
    const [dateStatus, setDateStatus] = useState(initialDateStatus)
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        
        // Count the number of currently checked items
        const checkedCount = Object.values(dateStatus).filter(Boolean).length;

        // If unchecking or if less than 5 items are checked, allow the change
        if (!checked || checkedCount < 5) {
            setDateStatus((prevDateStatus) => ({
                ...prevDateStatus,
                [name]: checked,
            }));
        } else {
            // If trying to check more than 5 items, do nothing or show an alert
            showSnackbar({
                severity: 'error',
                children: 'You can select up to 5 days only.',
            })

        }
    };
    const [selectedStartTimeMorning, setSelectedStartTimeMorning] = useState(new Date())
    const handleChangeStartTimeMorning = (newTime) => {
        setSelectedStartTimeMorning(newTime)
    }
    const [selectedEndTimeMorning, setSelectedEndTimeMorning] = useState(new Date())
    const handleChangeEndTimeMorning = (newTime) => {
        setSelectedEndTimeMorning(newTime)
    }
    const [selectedStartTimeAfternoon, setSelectedStartTimeAfternoon] = useState(new Date())
    const handleChangeStartTimeAfternoon = (newTime) => {
        setSelectedStartTimeAfternoon(newTime)
    }
    const [selectedEndTimeAfternoon, setSelectedEndTimeAfternoon] = useState(new Date())
    const handleChangeEndTimeAfternoon = (newTime) => {
        setSelectedEndTimeAfternoon(newTime)
    }
    const [days, setDays] = useState()

    const handleChangeDays = (event, value, reason) => {
        if (reason === 'selectOption') {
            setDays(value)
        }
    }
    const [hours, setHours] = useState()

    const handleChangeHours = (event, value, reason) => {
        if (reason === 'selectOption') {
            // Sử dụng giá trị được chọn hoặc xóa để cập nhật days
            setHours(value)
        }
    }
    const [dayLeave, setDayLeave] = useState()

    const handleChangeLeave = (event) => {
        setDayLeave(event.target.value)
    }
    const listDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    const [listHours, setListHours] = useState([])
    const [listDayLeave, setListDayLeave] = useState([])

    const [Department, setDepartment] = useState('')

    const handleChangeDepartment = (event) => {
        setDepartment(event.target.value)
    }
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const handleChangePage = (newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const { DepartmentList } = useSelector((state) => state.department)
    const { dateSetting, timeSetting, leaveSetting, riskSetting } = useSelector((state) => state.setting)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getDepartmentAsyncApi()).then((res) => {
            dispatch(getDateSettingAsyncApi(res.payload[0].id)).then((resDate) => {
                setDateStatus(resDate.payload.dateStatus)
            })
            dispatch(getTimeSettingAsyncApi(res.payload[0].id)).then((resTime) => {
                const startTimeMorning = formatTimeToDate(resTime.payload.fromHourMorning)
                const endTimeMorning = formatTimeToDate(resTime.payload.toHourMorning)
                const startTimeAfternoon = formatTimeToDate(resTime.payload.fromHourAfternoon)
                const endTimeAfternoon = formatTimeToDate(resTime.payload.toHourAfternoon)

                setSelectedStartTimeMorning(startTimeMorning)
                setSelectedEndTimeMorning(endTimeMorning)
                setSelectedStartTimeAfternoon(startTimeAfternoon)
                setSelectedEndTimeAfternoon(endTimeAfternoon)
            })
            dispatch(getLeaveSettingAsyncApi(res.payload[0].id))
            dispatch(getRiskSettingAsyncApi(res.payload[0].id)).then((resRisk) => {
                setDays(resRisk.payload.days)
                setHours(resRisk.payload.hours)
            })
            setDepartment(res.payload[0].id)
        })
        const numbersArray = []
        for (let i = 1; i <= 150; i++) {
            numbersArray.push(i)
        }
        const numbersLeaveArray = []
        for (let i = 1; i <= 30; i++) {
            numbersLeaveArray.push(i)
        }
        setListDayLeave(numbersLeaveArray)
        setListHours(numbersArray)
    }, [])
    useEffect(() => {
        {
            Department &&
                dispatch(getDepartmentAsyncApi()).then((res) => {
                    dispatch(getDateSettingAsyncApi(Department)).then((resDate) => {
                        setDateStatus(resDate.payload.dateStatus)
                    })
                    dispatch(getTimeSettingAsyncApi(Department)).then((resTime) => {
                        const startTimeMorning = formatTimeToDate(resTime.payload.fromHourMorning)
                        const endTimeMorning = formatTimeToDate(resTime.payload.toHourMorning)
                        const startTimeAfternoon = formatTimeToDate(resTime.payload.fromHourAfternoon)
                        const endTimeAfternoon = formatTimeToDate(resTime.payload.toHourAfternoon)

                        setSelectedStartTimeMorning(startTimeMorning)
                        setSelectedEndTimeMorning(endTimeMorning)
                        setSelectedStartTimeAfternoon(startTimeAfternoon)
                        setSelectedEndTimeAfternoon(endTimeAfternoon)
                    })
                    dispatch(getLeaveSettingAsyncApi(Department))
                    dispatch(getRiskSettingAsyncApi(Department)).then((resRisk) => {
                        setDays(resRisk.payload.days)
                        setHours(resRisk.payload.hours)
                    })
                })
        }

        return () => {}
    }, [Department])

    const handleClickChangeDate = () => {
        const body = {
            id: dateSetting.id,
            dateStatus: dateStatus,
            isDeleted: dateSetting.isDeleted,
        }
        dispatch(putDateSettingAsyncApi(body)).then((res) => {
            if (res.meta.requestStatus == 'fulfilled') {
                showSnackbar({
                    severity: 'success',
                    children: 'Change Date Setting successfully',
                })

                dispatch(getDateSettingAsyncApi(Department)).then((resDate) => {
                    setDateStatus(resDate.payload.dateStatus)
                })
            }
        })
    }
    const handleClickChangeRisk = () => {
        const body = {
            id: riskSetting.id,
            hours: hours,
            days: days,
            dateSet: riskSetting.dateSet,
            isDeleted: riskSetting.isDeleted,
        }
        dispatch(putRiskSettingAsyncApi(body)).then((res) => {
            if (res.meta.requestStatus == 'fulfilled') {
                showSnackbar({
                    severity: 'success',
                    children: 'Change Risk Setting successfully',
                })

                dispatch(getRiskSettingAsyncApi(Department)).then((resRisk) => {
                    setDays(resRisk.payload.days)
                    setHours(resRisk.payload.hours)
                })
            }
        })
    }
    function convertTimeToHours(time) {
        const [hours, minutes] = time.split(':')
        return parseInt(hours) + parseInt(minutes) / 60
    }

    const handleClickChangeTime = () => {
        const timeDifferenceMilliseconds =
    (selectedEndTimeMorning - selectedStartTimeMorning) + (selectedEndTimeAfternoon - selectedStartTimeAfternoon);

const maxWorkingTimeMilliseconds = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

const valid = timeDifferenceMilliseconds <= maxWorkingTimeMilliseconds;

        const newvalid = Math.floor(valid / (1000 * 60 * 60))
        const hours = Math.floor(timeDifferenceMilliseconds / (1000 * 60 * 60))
        const minutes = Math.floor((timeDifferenceMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeDifferenceMilliseconds % (1000 * 60)) / 1000)
        const body = {
            id: timeSetting.id,
            fromHourMorning: FormatDateToTime(selectedStartTimeMorning),
            toHourMorning: FormatDateToTime(selectedEndTimeMorning),
            fromHourAfternoon: FormatDateToTime(selectedStartTimeAfternoon),
            toHourAfternoon: FormatDateToTime(selectedEndTimeAfternoon),
        }
        console.log("valid", maxWorkingTimeMilliseconds, timeDifferenceMilliseconds, valid)
        if (valid ) {
            dispatch(putTimeSettingAsyncApi(body)).then((res) => {
                if (res.meta.requestStatus == 'fulfilled') {
                    showSnackbar({
                        severity: 'success',
                        children: 'Change Date Setting successfully',
                    })

                    dispatch(getDateSettingAsyncApi(Department)).then((resDate) => {
                        setDateStatus(resDate.payload.dateStatus)
                    })
                }
            })
        } else {
            showSnackbar({
                severity: 'error',
                children: 'Total Working Time greater Than 8',
            })
        }
    }
    const handleClickDelete = () => {}
    // const createRows = () => {
    //     return leaveSetting
    //         ? leaveSetting.map((item, index) => ({
    //               ...item,

    //               action: (
    //                   <div className="flex gap-2 justify-center">
    //                       <Tooltip onClick={() => handleClickDelete(item.employeeId)} title="Delete">
    //                           <IconButton>
    //                               <DeleteIcon />
    //                           </IconButton>
    //                       </Tooltip>
    //                   </div>
    //               ),
    //           }))
    //         : []
    // }
    // const rows = createRows()
    const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role')
        const userObject = JSON.parse(userString)
        return userObject || 'defaultRole' // Provide a default role if undefined
    })
    return (
        <div>
            {userRole === 'HR' ? <NavbarHR /> : <Navbar />}
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 ">
                    <h2 className="font-bold text-3xl mb-4 pt-6">Track Settings</h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <FormControl sx={{ width: 300, marginBottom: 4 }}>
                        <InputLabel size="small" id="demo-simple-select-label">
                            Team
                        </InputLabel>
                        <Select
                            size="small"
                            className="bg-white"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={Department}
                            label="Team"
                            onChange={handleChangeDepartment}
                        >
                            {DepartmentList.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <div className="sm:grid grid-cols-2 gap-5 sm:pb-0 pb-24">
                        <div className="bg-white col-span-1 p-4 sm:mb-0 mb-10 flex flex-col">
                            <h2 className="text-lg">Work Day Settings</h2>
                            <h2 className="text-gray-600 mb-5">Choose work days</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {dateSetting.dateStatus &&
                                    Object.entries(dateStatus).map(([day, checked]) => (
                                        <FormControlLabel
                                            key={day}
                                            control={
                                                <Checkbox
                                                    name={day}
                                                    checked={checked}
                                                    onChange={handleCheckboxChange}
                                                />
                                            }
                                            label={day}
                                        />
                                    ))}
                            </div>
                            <div className="mt-auto">
                                <Button onClick={handleClickChangeDate} className="float-right" variant="contained">
                                    Save Change
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white col-span-1 p-4 sm:mb-0 mb-10 flex flex-col">
                            <h2 className="text-lg">Risk Setting</h2>
                            <div className="my-2">Avg Work hour is less than </div>
                            <FormControl fullWidth>
                                <Autocomplete
                                    key={days} // Thêm key ở đây
                                    size="small"
                                    options={listDays}
                                    onChange={handleChangeDays}
                                    value={days}
                                    renderInput={(params) => <TextField {...params} />}
                                    getOptionLabel={(option) => option.toString()}
                                />
                            </FormControl>
                            <div className=" my-2 "> hour in last </div>
                            <FormControl fullWidth>
                                <Autocomplete
                                    key={hours} // Thêm key ở đây
                                    size="small"
                                    options={listHours}
                                    onChange={handleChangeHours}
                                    value={hours}
                                    renderInput={(params) => <TextField {...params} />}
                                    getOptionLabel={(option) => option.toString()}
                                />
                            </FormControl>
                            <div className=" my-2 "> days </div>
                            <div className="mt-auto">
                                <Button onClick={handleClickChangeRisk} className="float-right" variant="contained">
                                    Save Change
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white p-4 sm:mb-0 mb-10 flex flex-col">
                            <h2 className="text-lg">Work Time Settings</h2>
                            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 mb-2">
                                <div>
                                    <h2 className="text-gray-600 mt-2">Start Time Morning</h2>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DemoContainer components={['TimePicker']}>
                                            <TimePicker
                                                slotProps={{ textField: { size: 'small' } }}
                                                value={selectedStartTimeMorning}
                                                onChange={handleChangeStartTimeMorning}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                                <div>
                                    {' '}
                                    <h2 className="text-gray-600 mt-2">End Time Morning</h2>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DemoContainer components={['TimePicker']}>
                                            <TimePicker
                                                slotProps={{ textField: { size: 'small' } }}
                                                value={selectedEndTimeMorning}
                                                onChange={handleChangeEndTimeMorning}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                                <div>
                                    {' '}
                                    <h2 className="text-gray-600 mt-2">Start Time Afternoon</h2>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DemoContainer components={['TimePicker']}>
                                            <TimePicker
                                                slotProps={{ textField: { size: 'small' } }}
                                                value={selectedStartTimeAfternoon}
                                                onChange={handleChangeStartTimeAfternoon}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                                <div>
                                    {' '}
                                    <h2 className="text-gray-600 mt-2">End Time Afternoon</h2>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DemoContainer components={['TimePicker']}>
                                            <TimePicker
                                                slotProps={{ textField: { size: 'small' } }}
                                                value={selectedEndTimeAfternoon}
                                                onChange={handleChangeEndTimeAfternoon}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <Button onClick={handleClickChangeTime} className="float-right" variant="contained">
                                    Save Change
                                </Button>
                            </div>
                        </div>
                        {/* <div className="bg-white col-span-1 p-4 sm:mb-0 mb-10 flex flex-col ">
                            <h2 className="text-lg">Leave Setting</h2>
                           <div className="my-2">This Department is entitled to a maximum of </div>
                            <FormControl fullWidth>
                                <Autocomplete
                                    size="small"
                                    options={listDayLeave}
                                    onChange={(e) => handleChangeLeave(e)}
                                    value={dayLeave}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </FormControl>
                            <div className=" my-2 "> days off per year</div>
                            <div className="mt-auto">
                                <Button className="float-right" variant="contained">
                                    Save Change
                                </Button>
                            </div> 
                            <TableData
                                tableHeight={200}
                                rows={rows}
                                columns={columns}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
