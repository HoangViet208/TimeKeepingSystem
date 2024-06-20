import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

//date-picker-range
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import { addDays, startOfDay } from 'date-fns'
//Firebase
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../Config/FirebaseConfig'

//Mui
import { styled } from '@mui/system'
import {
    Popover,
    InputAdornment,
    TextField,
    OutlinedInput,
    Select,
    Button,
    FormControl,
    MenuItem,
    DialogActions,
    Tooltip,
    IconButton,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
//Icon
import EventNoteIcon from '@mui/icons-material/EventNote'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

//Component
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import PopupData from '../../../Components/Popup'
import PopupConfirm from '../../../Components/PopupConfirm'
import Navbar from '../Navbar'

//hooks
import {
    calculateDays,
    calculateTime,
    formatDate,
    formatTimeToDate,
    formattedDate,
    getDateRangeArray,
    getDayOfWeek,
} from '../../../Hook/useFormatDate'
import { useDispatch, useSelector } from 'react-redux'
import {
    GetRequestWorkOfEmployeeAsyncApi,
    GetWorkingByRequestIdAsyncApi,
    PostWorkedAsyncApi,
    PutWorkedAsyncApi,
    WorkedAction,
    getWorkedAsyncApi,
    getWorkedByIdAsyncApi,
} from '../../../Redux/Worked/WorkedSlice'
import { useSnackbar } from '../../../Hook/useSnackbar'
import TableLoadData from '../../../Components/TableLoad'
import UpdateIsSeenToTrueForManager, { UpdateIsSeenToTrueForEmployee } from '../../../Hook/useFirebase'
import TabsData from '../../../Components/Tabs'

const CustomSelect = styled(Select)`
    color: #60a5fa; // Đổi màu chữ thành xanh
    & select:focus {
        background-color: transparent; // Loại bỏ màu nền khi focus
    }
    & svg {
        color: #60a5fa; // Đổi màu biểu tượng mũi tên thành xanh
    }
    & fieldset {
        border: none; // Loại bỏ viền xung quanh
    }
`

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'date', label: 'Date', minWidth: 150, align: 'center' },
    { id: 'timeComeLate', label: 'Come Late', maxWidth: 200, align: 'center' },
    { id: 'timeLeaveEarly', label: 'Leave Early', maxWidth: 200, align: 'center' },
    { id: 'checkInTime', label: 'Check In Time', maxWidth: 200, align: 'center' },
    { id: 'checkOutTime', label: 'Check Out Time', maxWidth: 200, align: 'center' },
    { id: 'slotStart', label: 'Slot Start', maxWidth: 150, align: 'center' },
    { id: 'slotEnd', label: 'Slot End', maxWidth: 150, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 100, align: 'center' },
]

const columnsRequest = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'date', label: 'Date', minWidth: 150, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 100, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Worked', icon: <BadgeIcon />, url: '/Employee/Worked', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function Worked() {
    const [loadingButton, setLoadingButton] = useState(false)
    //popover
    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const [anchorElFilter, setAnchorElFilter] = React.useState(null)

    const handleClickFilter = (event) => {
        setAnchorElFilter(event.currentTarget)
    }

    const [error, SetError] = useState()
    const [errorImport, seterrorImport] = useState(false)
    const [chosenFileName, setChosenFileName] = useState('Chosen file')
    const fileInputRef = useRef(null)
    const openPopover = Boolean(anchorEl)
    const openPopoverFilter = Boolean(anchorElFilter)
    const id = openPopover ? 'simple-popover' : undefined
    const idFilter = openPopover ? 'simple-popover' : undefined
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [isAction, setIsAction] = useState(0)
    const [search, setSearch] = useState('')
    const [selectedImage, setSelectedImage] = useState()
    const [click, SetClick] = useState(false)
    const [leaveDays, setLeaveDays] = useState(0)
    const [leaveDaysDate, setLeaveDaysDate] = useState([])
    const today = new Date()
    const [reason, setReason] = useState('')
    const threeDaysLater = addDays(today, 3)
    const [selectedStartTime, setSelectedStartTime] = useState(null)
    const [selectedEndTime, setSelectedEndTime] = useState(null)
    const [workslotEmployeeId, setworkslotEmployeeId] = useState()
    const [requestId, setrequestId] = useState()
    const userStringEmployeeName = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(userStringEmployeeName)
    const showSnackbar = useSnackbar()
    const initialViewStatus = {
        isWorkLate: false,
        isLeaveSoon: false,
        isNotCheckIn: false,
        isNotCheckOut: false,
    }
    const labels = {
        isWorkLate: 'Work Late',
        isLeaveSoon: 'Leave Soon',
        isNotCheckIn: 'Not Check In',
        isNotCheckOut: 'Not Check Out',
    }

    const [viewStatus, setViewStatus] = useState(initialViewStatus)
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target
        setViewStatus((prevDateStatus) => ({
            ...prevDateStatus,
            [name]: checked,
        }))
    }
    //setting redux
    const { WorkedByEmployee, loading, RequestIdNoti, RequestWorkedSlotOfEmployee } = useSelector((state) => state.worked)

    const dispatch = useDispatch()
    useEffect(() => {
        if (RequestIdNoti != 0) {
            dispatch(GetWorkingByRequestIdAsyncApi(RequestIdNoti)).then((data) => {
                if (data.meta.requestStatus == 'fulfilled') {
                    setOpen(true)
                    setDate(data.date)
                    setStartTime(data.slotStart)
                    setEndTime(data.slotEnd)
                    setCheckIn(data.checkInTime)
                    setCheckOut(data.checkOutTime)

                    setIsAction(3)
                    const startTime = formatTimeToDate(data.slotStart)
                    const endTime = formatTimeToDate(data.slotEnd)
                    setSelectedStartTime(startTime)
                    setSelectedEndTime(endTime)

                    setworkslotEmployeeId(data.workslotEmployeeId)
                    if (data.statusName != 'Lack Of Work Time') {
                        setReason(data.reason)
                        setrequestId(data.requestId)
                        setChosenFileName(data.linkFile)
                        seterrorImport(true)
                        setIsAction(2)
                    }
                }
            })
            setOpen(true)
        }
    }, [RequestIdNoti])
    useEffect(() => {
        dispatch(
            getWorkedByIdAsyncApi({
                id: employeeId,
                isWorkLate: viewStatus.isWorkLate,
                isLeaveSoon: viewStatus.isLeaveSoon,
                isNotCheckIn: viewStatus.isNotCheckIn,
                isNotCheckOut: viewStatus.isNotCheckOut,
            })
        )
        dispatch(GetRequestWorkOfEmployeeAsyncApi(employeeId))
        return () => {}
    }, [viewStatus])
    const handleCloseFilter = () => {
        setAnchorElFilter(null)
    }
    const handleClose = () => {
        setAnchorEl(null)
        setIsAction(0)
        setSelectedStartTime(null)
        setSelectedEndTime(null)
        setworkslotEmployeeId()
        setReason()
        seterrorImport(false)
        setChosenFileName('Chosen file')
    }
    const handleChangeStartTime = (newTime) => {
        setSelectedStartTime(newTime)
    }
    const handleChangeEndTime = (newTime) => {
        setSelectedEndTime(newTime)
    }
    const handleBrowseButtonClick = () => {
        fileInputRef.current.click()
    }
    const [dateRange, setDateRange] = useState([
        {
            startDate: threeDaysLater,
            endDate: threeDaysLater,
            key: 'selection',
        },
    ])
    const minDate = startOfDay(threeDaysLater)
    const dataLeaveType = ['Casual Leave', 'Sick Leave']

    const handleChangePage = (newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    const callbackSearch = (childData) => {
        setSearch(childData)
    }
    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0]
        seterrorImport(false)
        setSelectedImage(event.target.files[0])
        SetClick(true)
        SetError()
        if (selectedFile) {
            setChosenFileName(selectedFile.name)
            seterrorImport(true)
        }
    }
    const handleClickOpenAdd = () => {
        setOpen(true)
        setIsAction(1)
    }
    const [workslotEmployeeMorningId, setWorkslotEmployeeMorningId] = useState()
    const [date, setDate] = useState()
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    const [checkIn, setCheckIn] = useState()
    const [checkOut, setCheckOut] = useState()
    const [timeLeaveEarly , setTimeLeaveEarly] = useState()
    const [timeComeLate, setTimeComeLate] = useState()
    const [attendanceStatusAfternoonId , setAttendanceStatusAfternoonId] = useState()
    const [attendanceStatusMorningId, setAttendanceStatusMorningId] = useState()

    const handleClickOpenNew = (data, event) => {
        setDate(data.date)
        setStartTime(data.slotStart)
        setEndTime(data.slotEnd)
        setCheckIn(data.checkInTime)
        setCheckOut(data.checkOutTime)
        setAttendanceStatusMorningId(data.attendanceStatusMorningId)
        setAttendanceStatusAfternoonId(data.attendanceStatusAfternoonId)
        setIsAction(1)
        setOpen(true)
        setWorkslotEmployeeMorningId(data.workslotEmployeeMorningId)
        setworkslotEmployeeId(data.workslotEmployeeId)
        setTimeLeaveEarly(data.timeLeaveEarly)
        setTimeComeLate(data.timeComeLate)
    }

    const handleClickOpenUpdate = (data, event) => {
        UpdateIsSeenToTrueForEmployee(data)
        if (data.statusName == 'Pending') {
            setIsAction(1)
        } else {
            setIsAction(3)
        }
        setWorkslotEmployeeMorningId(data.workslotEmployeeMorningId)
        setReason(data.reason)
        setrequestId(data.requestId)
        setChosenFileName(data.linkFile)
        seterrorImport(true)
        setOpen(true)
        setDate(data.dateOfWorkTime)
        setStartTime(data.slotStart)
        setEndTime(data.slotEnd)
        setCheckIn(data.checkInTime)
        setCheckOut(data.checkOutTime)
        const startTime = formatTimeToDate(data.slotStart)
        const endTime = formatTimeToDate(data.slotEnd)
        setSelectedStartTime(startTime)
        setSelectedEndTime(endTime)
        setAttendanceStatusMorningId(data.attendanceStatusMorningId)
        setAttendanceStatusAfternoonId(data.attendanceStatusAfternoonId)
        setworkslotEmployeeId(data.workslotEmployeeId)
        setTimeLeaveEarly(data.timeLeaveEarly)
        setTimeComeLate(data.timeComeLate)
    }
    const clickOpenFalse = (event) => {
        setOpen(false)
        setIsAction(0)
        dispatch(WorkedAction.changeRequestId(0))
        setDateRange([
            {
                startDate: threeDaysLater,
                endDate: threeDaysLater,
                key: 'selection',
            },
        ])
        setLeaveDays(0)
        setLeaveDaysDate([])
    }
    const handleClickOpenConfirm = () => {
        setOpenConfirm(true)
    }
    const clickOpenFalseConfirm = (event) => {
        setOpenConfirm(false)
    }
    const handleClickSave = () => {
        setOpen(false)
    }
    const handleClickRequest = () => {
        setLoadingButton(true)
        const storageRef = ref(storage, `Package/${selectedImage.name}`)
        const uploadTask = uploadBytesResumable(storageRef, selectedImage)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },
            (error) => {
                alert(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const body = {
                        name: 'request work time',
                        workslotEmployeeId: workslotEmployeeId,
                        status: 0,
                        reason: reason,
                        linkFile: downloadURL,
                        workslotEmployeeMorningId: workslotEmployeeMorningId,
                        RealHourStart: checkIn,
                        RealHourEnd: checkOut,
                        NumberOfComeLateHour: timeComeLate,
                        NumberOfLeaveEarlyHour: timeLeaveEarly ,
                        attendanceStatusAfternoonId: attendanceStatusAfternoonId,
                        attendanceStatusMorningId: attendanceStatusMorningId,
                    }
                    dispatch(PostWorkedAsyncApi({ id: employeeId, body: body }))
                        .then((response) => {
                            setLoadingButton(false)
                            if (response.meta.requestStatus == 'fulfilled') {
                                setAnchorEl(null)
                                showSnackbar({
                                    severity: 'success',
                                    children: 'Request Successfully',
                                })
                                setChosenFileName('Chosen file')
                                setIsAction(0)
                                setSelectedStartTime()
                                setSelectedEndTime()
                                setworkslotEmployeeId()

                                seterrorImport(false)
                                setOpen(false)
                                setReason()
                                setSelectedImage()
                                dispatch(
                                    getWorkedByIdAsyncApi({
                                        id: employeeId,
                                        isWorkLate: viewStatus.isWorkLate,
                                        isLeaveSoon: viewStatus.isLeaveSoon,
                                        isNotCheckIn: viewStatus.isNotCheckIn,
                                        isNotCheckOut: viewStatus.isNotCheckOut,
                                    })
                                )
                                dispatch(GetRequestWorkOfEmployeeAsyncApi(employeeId))
                                SetClick(false)
                            }
                        })
                        .catch((err) => {
                            setLoadingButton(false)
                        })
                })
            }
        )
    }

    const handleClickRequestUpdate = () => {
        if (click == false) {
            const body = {
                id: requestId,
                name: 'request work time',
                workslotEmployeeId: workslotEmployeeId,
                status: 0,
                reason: reason,
                workslotEmployeeMorningId: workslotEmployeeMorningId,
               
            }
            dispatch(PutWorkedAsyncApi({ id: employeeId, body: body })).then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    setAnchorEl(null)
                    showSnackbar({
                        severity: 'success',
                        children: 'Request Successfully',
                    })
                    setChosenFileName('Chosen file')
                    setIsAction(0)
                    setSelectedStartTime()
                    setSelectedEndTime()
                    setOpen(false)
                    setReason()
                    setSelectedImage()
                    dispatch(getWorkedByIdAsyncApi(employeeId))
                    dispatch(GetRequestWorkOfEmployeeAsyncApi(employeeId))
                    SetClick(false)
                }
            })
        } else {
            const storageRef = ref(storage, `Package/${selectedImage.name}`)
            const uploadTask = uploadBytesResumable(storageRef, selectedImage)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                },
                (error) => {
                    alert(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        const body = {
                            id: requestId,
                            name: 'request work time',
                            workslotEmployeeId: workslotEmployeeId,
                            status: 0,
                            reason: reason,
                            linkFile: downloadURL,
                        }
                        dispatch(PutWorkedAsyncApi({ id: employeeId, body: body })).then((response) => {
                            if (response.meta.requestStatus == 'fulfilled') {
                                setAnchorEl(null)
                                showSnackbar({
                                    severity: 'success',
                                    children: 'Request Successfully',
                                })
                                dispatch(GetRequestWorkOfEmployeeAsyncApi(employeeId))
                                setChosenFileName('Chosen file')
                                setIsAction(0)
                                setSelectedStartTime()
                                setSelectedEndTime()
                                setOpen(false)
                                setReason()
                                setSelectedImage()
                                dispatch(getWorkedByIdAsyncApi(employeeId))
                                SetClick(false)
                            }
                        })
                    })
                }
            )
        }
    }

    const createRows = () => {
        return WorkedByEmployee.map((item, index) => ({
            ...item,
            date: <div className="text-blue-600 font-medium">{formatDate(item.date)}</div>,
            status: <button className="bg-orange-300  font-semibold py-1 px-5 rounded-xl">{item.statusName}</button>,
            number: index + 1,
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip onClick={(event) => handleClickOpenNew(item, event)} title="Add new request">
                        <IconButton>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }
    const rows = createRows()

    const createRowsRequest = () => {
        return RequestWorkedSlotOfEmployee.map((item, index) => ({
            ...item,
            date: <div className="text-blue-600 font-medium">{formatDate(item.dateOfWorkTime)}</div>,
            status: <button className="bg-orange-300  font-semibold py-1 px-5 rounded-xl">{item.statusName}</button>,
            number: index + 1,  
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip onClick={(event) => handleClickOpenUpdate(item, event)} title="Edit">
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }
    const rowsRequest = createRowsRequest()

    const tabsData = [
        {
            label: `Additional Worked`,
            view:
                loading == true ? (
                    <Fragment>
                        <div className="float-right my-2">
                            <FilterListIcon aria-describedby={idFilter} onClick={handleClickFilter} className="cursor-pointer" />
                        </div>
                        <TableLoadData columns={columns} tableHeight={400} />
                    </Fragment>
                ) : (
                    <Fragment>
                        <div className="float-right my-2">
                            <FilterListIcon aria-describedby={idFilter} onClick={handleClickFilter} className="cursor-pointer" />
                            <Popover
                                id={idFilter}
                                open={openPopoverFilter}
                                anchorEl={anchorElFilter}
                                onClose={handleCloseFilter}
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
                        <TableData
                            tableHeight={380}
                            rows={rows}
                            columns={columns}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Fragment>
                ),
        },
        {
            label: `Request Worked`,
            view:
                loading == true ? (
                    <TableLoadData columns={columnsRequest} tableHeight={400} />
                ) : (
                    <TableData
                        tableHeight={380}
                        rows={rowsRequest}
                        columns={columnsRequest}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                ),
        },
    ]
    return (
        <div>
            <Navbar />
            <PopupConfirm open={openConfirm} clickOpenFalse={clickOpenFalseConfirm} />
            {openPopover && (
                <Popover
                    id={id}
                    open={openPopover}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                ></Popover>
            )}
            <PopupData
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle={isAction == 1 ? 'Apply Worked' : isAction == 2 ? 'Edit Worked' : 'Worked'}
                viewContent={
                    <Fragment>
                        <div className="md:flex">
                            <div className="mx-2 flex flex-col items-center justify-center w-full">
                                <div className="">
                                    <TextField
                                        label="Date"
                                        size="small"
                                        disabled
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                                WebkitTextFillColor: '#000000',
                                            },
                                        }}
                                        className=" w-[400px] text-red-600"
                                        value={date && formatDate(date)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 w-[400px] mt-2 gap-2">
                                    <TextField
                                        label="Start Time"
                                        size="small"
                                        disabled
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                                WebkitTextFillColor: '#000000',
                                            },
                                        }}
                                        className=" "
                                        value={startTime}
                                    />
                                    <TextField
                                        label="End Time"
                                        size="small"
                                        disabled
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                                WebkitTextFillColor: '#000000',
                                            },
                                        }}
                                        className=" "
                                        value={endTime}
                                    />
                                </div>
                                <div className="grid grid-cols-2 w-[400px] mt-2 gap-2">
                                    <TextField
                                        label="Check In"
                                        size="small"
                                        disabled
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                                WebkitTextFillColor: '#000000',
                                            },
                                        }}
                                        className=" "
                                        value={checkIn}
                                    />
                                    <TextField
                                        label="Check Out"
                                        size="small"
                                        disabled
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled': {
                                                WebkitTextFillColor: '#000000',
                                            },
                                        }}
                                        className=" "
                                        value={checkOut}
                                    />
                                </div>
                                <div className="mb-2 mt-2 relative">
                                    <input
                                        className="hidden w-full" // Ẩn input mặc định
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileInputChange}
                                    />
                                    <button
                                        onClick={isAction == 3 ? undefined : handleBrowseButtonClick}
                                        className="border-[1px] cursor-pointer rounded-md h-10 bg-gray-300 px-4 absolute "
                                    >
                                        Browse
                                    </button>
                                    <div>
                                        <button
                                            onClick={isAction == 3 ? undefined : handleBrowseButtonClick}
                                            className="cursor-pointer  block rounded-md h-10 text-left w-[400px] pl-[90px] font-medium text-gray-600  border border-gray-300   bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                            variant="contained"
                                        >{chosenFileName.length > 16
                                            ? chosenFileName.slice(0, 16).concat('...')
                                            : chosenFileName}</button>
                                         
                                        {error && <div className="text-red-500 w-[260px]">{error}</div>}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <TextField
                                        onChange={(e) => setReason(e.target.value)}
                                        label="Reason"
                                        disabled={isAction == 3 ? true : false}
                                        multiline
                                        className="w-[400px]"
                                        rows={3}
                                        value={reason}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <hr />
                            <div className="my-2 float-right mr-4">
                                <LoadingButton
                                    startIcon={<AddIcon />}
                                    onClick={
                                        isAction == 1
                                            ? handleClickRequest
                                            : isAction == 2
                                            ? handleClickRequestUpdate
                                            : null
                                    }
                                    disabled={error || !errorImport}
                                    loading={loadingButton}
                                    loadingPosition="start"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                    autoFocus
                                >
                                    Save changes
                                </LoadingButton>
                            </div>
                        </div>
                    </Fragment>
                }
                size="sm"
            />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Worked List </h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                        <div className="ml-auto uppercase"></div>
                    </div>

                    <div className="bg-white p-4">
                        <div>
                            <TabsData data={tabsData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
