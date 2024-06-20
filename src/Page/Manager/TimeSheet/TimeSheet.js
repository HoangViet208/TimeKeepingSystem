import React, { Fragment, useEffect, useState } from 'react'

//date-picker-range
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import dayjs from 'dayjs'
//mui
import {
    Button,
    Stack,
    Avatar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Popover,
    FormControlLabel,
    Checkbox,
    CircularProgress,
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
//icon
import FilterListIcon from '@mui/icons-material/FilterList'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

//component
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import Navbar from '../Navbar'
import PopupData from '../../../Components/Popup'
import { formatDateExact, formattedDate, getDateToMonth, getDayOfWeek } from '../../../Hook/useFormatDate'

//style
import './Style.css'
import { useDispatch, useSelector } from 'react-redux'
import {
    GetWorkedSlotByIdDepartmentAsyncApi,
    GetWorkedSlotExcelAsyncApi,
} from '../../../Redux/WorkSlotEmployee/WorkSlotEmployeeSlice'
import { getEmployeeAsyncApi, getEmployeeByIdAsyncApi } from '../../../Redux/Employee/employeeSlice'
import { formatDate } from '@fullcalendar/core'
import axios from 'axios'
import NavbarHR from '../NavbarHR'
import { getDepartmentAsyncApi } from '../../../Redux/Department/DepartmentSlice'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Time Sheet', icon: <BadgeIcon />, url: '/Employee', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function TimeSheet() {
    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    const openPopover = Boolean(anchorEl)
    const id = openPopover ? 'simple-popover' : undefined
    const [open, setOpen] = useState()
    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const [Department, setDepartment] = useState('AllTeam')
    //setting redux
    const { DepartmentList } = useSelector((state) => state.department)
    const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role')
        const userObject = JSON.parse(userString)
        return userObject || 'defaultRole'
    })

    useEffect(() => {
        const handleStorageChange = () => {
            const userString = localStorage.getItem('role')
            const userObject = JSON.parse(userString)
            setUserRole(userObject || 'defaultRole')
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])
    const [selectedDate, setSelectedDate] = useState(dayjs())
    //setting redux
    const { WorkSlotByDepartment, loading } = useSelector((state) => state.WorkSlotEmployee)
    const { EmployeeList } = useSelector((state) => state.employee)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getDepartmentAsyncApi())
        return () => {}
    }, [])
    useEffect(() => {
        const { format, parse } = require('date-fns')
        const userStringEmployeeName = localStorage.getItem('employeeId')
        const employeeId = JSON.parse(userStringEmployeeName)

        userRole === 'Manager'
            ? Department &&
              dispatch(getEmployeeByIdAsyncApi(employeeId)).then((response) => {
                  if (response.meta.requestStatus == 'fulfilled') {
                      dispatch(
                          GetWorkedSlotByIdDepartmentAsyncApi({
                              id: response.payload.departmentId,
                              //  id: '4752ec79-a7e7-427e-9eb4-c8e96744278f',
                              startTime: format(selectedDateRange.startDate, 'yyyy/MM/dd'),
                              endTime: format(selectedDateRange.endDate, 'yyyy/MM/dd'),
                          })
                      )
                  }
              })
            : Department &&
              dispatch(
                  GetWorkedSlotByIdDepartmentAsyncApi({
                      id: Department == 'AllTeam' ? `` : Department,
                      //  id: '4752ec79-a7e7-427e-9eb4-c8e96744278f',
                      startTime: format(selectedDateRange.startDate, 'yyyy/MM/dd'),
                      endTime: format(selectedDateRange.endDate, 'yyyy/MM/dd'),
                  })
              )

        return () => {}
    }, [selectedDateRange, Department])

    const handleChangeDepartment = (event) => {
        setDepartment(event.target.value)
    }
    const handleDateRangeChange = (ranges) => {
        setSelectedDateRange(ranges.selection)
    }
    function base64ToArrayBuffer(data) {
        var binaryString = window.atob(data)
        var binaryLen = binaryString.length
        var bytes = new Uint8Array(binaryLen)
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i)
            bytes[i] = ascii
        }
        return bytes
    }

    async function handleDownloadExcelTemplate() {
        // const userStringEmployeeName = localStorage.getItem('employeeId')
        // const employeeId = JSON.parse(userStringEmployeeName)
        // const response = await dispatch(getEmployeeByIdAsyncApi(employeeId))
        const { format } = require('date-fns')
        try {
            const downloadResponse = await axios.get(
                `https://timekeepingsystem.azurewebsites.net/api/WorkSlotEmployee/export-excel-file?departmentId=${
                    Department == 'AllTeam' ? `00000000-0000-0000-0000-000000000000` : Department
                }&month=${format(selectedDateRange.startDate, 'yyyy/MM/dd')}`,
                {
                    responseType: 'blob', // Set the response type to blob
                }
            )

            if (downloadResponse.status === 200) {
                const blob = new Blob([downloadResponse.data], { type: downloadResponse.headers['content-type'] })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'WorkSlotEmployeeReport.xlsx' // Specify the desired file name
                link.click()
                window.URL.revokeObjectURL(url)
            } else {
                console.error('Failed to download file')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }
    const clickOpenFalse = (event) => {
        setOpen(false)
        setSelectedDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        })
    }
    const initialViewStatus = {
        isIn: true,
        isOut: true,
        isWork: true,
        isOvertime: true,
    }
    const labels = {
        isIn: 'Check In',
        isOut: 'Check Out',
        isWork: 'Active',
        isOvertime: 'Overtime',
    }

    const [viewStatus, setViewStatus] = useState(initialViewStatus)
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target
        setViewStatus((prevDateStatus) => ({
            ...prevDateStatus,
            [name]: checked,
        }))
    }
    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClickSave = () => {
        setOpen(false)
    }
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate)
    }
    const topName = ['khoa', 'việt', 'tài']
    const viewModalContent = <DateRangePicker ranges={[selectedDateRange]} onChange={handleDateRangeChange} />
    const viewModalAction = (
        <Button autoFocus onClick={handleClickSave}>
            Save changes
        </Button>
    )

    return (
        <div>
            <PopupData
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle="Pick Date"
                viewContent={viewModalContent}
                viewAction={viewModalAction}
            />
            {userRole === 'Manager' ? <Navbar /> : <NavbarHR />}
            <div className="sm:ml-64 h-screen pt-12 bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Time Sheet List </h2>
                    <div className="mb-8 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <div className="bg-white p-4">
                        <div className="mb-5 md:flex items-center">
                            <Stack direction="row" spacing={2}>
                                <Button
                                    onClick={handleClickOpen}
                                    variant="outlined"
                                    sx={{
                                        color: 'black',
                                        borderColor: '#f3f4f6',
                                        borderRadius: '200px',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            color: '#2196f3',
                                        },
                                    }}
                                    startIcon={<EventAvailableIcon />}
                                >
                                    {selectedDateRange.startDate.getTime() == selectedDateRange.endDate.getTime()
                                        ? formattedDate(selectedDateRange.startDate)
                                        : formattedDate(selectedDateRange.startDate) +
                                          ' - ' +
                                          formattedDate(selectedDateRange.endDate)}
                                </Button>
                            </Stack>
                            <div className="ml-auto my-4 md:my-0 flex items-center gap-4 mr-4">
                                <Button
                                    onClick={handleDownloadExcelTemplate}
                                    variant="contained"
                                    size="small"
                                    startIcon={<FileDownloadIcon />}
                                >
                                    Export
                                </Button>
                                <FilterListIcon aria-describedby={id} onClick={handleClick} className="" />
                                <Popover
                                    id={id}
                                    open={openPopover}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <div className="flex flex-col py-3 px-4">
                                        {Object.entries(viewStatus).map(([day, checked]) => (
                                            <FormControlLabel
                                                key={day}
                                                control={
                                                    <Checkbox
                                                        name={day}
                                                        checked={checked}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                }
                                                label={labels[day]}
                                            />
                                        ))}
                                    </div>
                                </Popover>
                            </div>
                        </div>
                        {userRole === 'Manager' ? (
                            ``
                        ) : userRole === 'HR' ? (
                            <div className="">
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
                                        disabled={loading}
                                    >
                                        <MenuItem value={'AllTeam'}>All Team</MenuItem>
                                        {DepartmentList.map((item, index) => {
                                            return (
                                                <MenuItem key={index} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </div>
                        ) : (
                            ``
                        )}

                        {/* <div className="my-4 flex gap-5">
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={EmployeeList}
                                size="small"
                                sx={{ width: 250 }}
                                renderInput={(params) => <TextField {...params} label="Search Employee" />}
                            />
                        </div> */}
                        <div className="overflow-x-auto ">
                            <table className="w-full table-fixed">
                                <thead>
                                    <tr className="border-b-2 text-gray-400">
                                        <th className="font-normal pb-5 px-2 border-r-2 uppercase w-[200px] text-left">
                                            Employee
                                        </th>
                                        <th className="font-normal pb-5 border-r-2 uppercase w-[700px]">
                                            {/* Content for the middle column header */}
                                            {selectedDateRange.startDate.getTime() ===
                                            selectedDateRange.endDate.getTime()
                                                ? formattedDate(selectedDateRange.startDate)
                                                : formattedDate(selectedDateRange.startDate) +
                                                  ' - ' +
                                                  formattedDate(selectedDateRange.endDate)}
                                        </th>
                                        <th className="font-normal pb-5 px-2 uppercase w-[200px] text-left">
                                            TOTAL WORK SUMMARY
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading == true ? (
                                        <tr className="">
                                            <td></td>
                                            <td className="h-[450px] w-full flex items-center justify-center">
                                                <CircularProgress size={80} />
                                            </td>
                                            <td></td>
                                        </tr>
                                    ) : (
                                        WorkSlotByDepartment.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="py-5 border-r-2 px-2">
                                                        <div className="flex flex-col gap-2 items-center ">
                                                            <Avatar
                                                                src={item.avatar}
                                                                alt={item.name}
                                                                sx={{ width: 40, height: 40 }}
                                                            />
                                                            <p className="text-center">
                                                                {item.name} ({item.teamName})
                                                            </p>
                                                            <p>{item.employeeNumber} </p>
                                                        </div>
                                                    </td>
                                                    <td id="scroll" className="py-5 px-2 border-r-2">
                                                        <div className="scrollbar pb-5 overflow-x-auto">
                                                            <div className="flex gap-5">
                                                                {item.working.map((working, index) => {
                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            id="cha"
                                                                            className="min-w-[190px] border-[2px] border-red-300 border-dashed truncate"
                                                                        >
                                                                            <div className="mx-2 font-bold text-center mt-[1px] font-serif">
                                                                                <div>
                                                                                    {working.isOvertime == true
                                                                                        ? 'Overtime'
                                                                                        : 'Working'}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex  mx-2">
                                                                                <div>{getDayOfWeek(working.date)}</div>
                                                                                <div className="text-gray-400 ml-auto">
                                                                                    {getDateToMonth(working.date)}
                                                                                </div>
                                                                            </div>

                                                                            <div className="transition ease-in-out hover:scale-110 m-2 delay-150 py-1 px-2 bg-red-100">
                                                                                {viewStatus.isIn == true ? (
                                                                                    <div className="flex items-center">
                                                                                        <div className="text-gray-400 font-medium">
                                                                                            {working.in}
                                                                                        </div>
                                                                                        <div
                                                                                            id="in"
                                                                                            className="uppercase text-xs text-gray-400 ml-auto"
                                                                                        >
                                                                                            in
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                                {viewStatus.isOut == true ? (
                                                                                    <div className="flex items-center">
                                                                                        <div className="text-gray-400 font-medium">
                                                                                            {working.out}
                                                                                        </div>
                                                                                        <div
                                                                                            id="out"
                                                                                            className="uppercase text-xs text-gray-400 ml-auto"
                                                                                        >
                                                                                            out
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                                {viewStatus.isWork == true ? (
                                                                                    <div className="flex items-center">
                                                                                        <div className="text-gray-400 font-medium">
                                                                                            {working.duration}
                                                                                        </div>
                                                                                        <div
                                                                                            id="work"
                                                                                            className="uppercase text-xs text-gray-400 ml-auto"
                                                                                        >
                                                                                            Work
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                                {/* {viewStatus.isCoefficient == true ? (
                                                                                <div className="flex items-center">
                                                                                <div className="text-gray-400 font-medium">
                                                                                    x1
                                                                                </div>
                                                                                <div
                                                                                    id="Coefficients"
                                                                                    className="uppercase text-xs text-gray-400 ml-auto"
                                                                                >
                                                                                    Coefficients
                                                                                </div>
                                                                            </div>
                                                                            ) : (
                                                                                ''
                                                                            )} */}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-2 min-w-[300px]">
                                                        <div
                                                            id="total"
                                                            className="transition ease-in-out hover:scale-110 m-2 w-[200px] delay-150 py-1 px-2 bg-yellow-100"
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="text-gray-400 font-medium">
                                                                    {item.totalWorkedHours}
                                                                </div>
                                                                <div
                                                                    id="out"
                                                                    className="uppercase text-xs text-gray-400 ml-auto"
                                                                >
                                                                    Worked hour
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <div className="text-gray-400 font-medium">
                                                                    {item.totalOvertime}
                                                                </div>
                                                                <div
                                                                    id="in"
                                                                    className="uppercase text-xs text-gray-400 ml-auto"
                                                                >
                                                                    Over time
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
