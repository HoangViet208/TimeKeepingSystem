import React, { Fragment, useEffect, useState } from 'react'
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
    InputLabel,
    Stack
} from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import dayjs from 'dayjs'
//Icon
//date-picker-range
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import { calculateTime, formatDate, formatDateExact, formattedDate, getDayOfWeek } from '../../../Hook/useFormatDate'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import PopupData from '../../../Components/Popup'
import { useDispatch, useSelector } from 'react-redux'
import TableData from '../../../Components/Table'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import {
    ApplyLeaveAction,
    GetAllRequestAsyncApi,
    GetApplyLeaveByRequestIdAsyncApi,
    GetApplyLeaveTypeAsyncApi,
    PutApplyLeaveAsyncApi,
    PutApproveApplyLeaveAsyncApi,
    getApplyLeaveAsyncApi,
} from '../../../Redux/ApplyLeave/ApplyLeaveSlice'
import AssessmentIcon from '@mui/icons-material/Assessment'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import TabsData from '../../../Components/Tabs'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EventNoteIcon from '@mui/icons-material/EventNote'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import { useFormik } from 'formik'
import { parse } from 'date-fns'
import { styled } from '@mui/system'
import DoneIcon from '@mui/icons-material/Done'
import PersonIcon from '@mui/icons-material/Person'
import { useSnackbar } from '../../../Hook/useSnackbar'
import { LoadingButton } from '@mui/lab'

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


const columnsLeave = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    //  { id: 'info', label: 'Employee Name', minWidth: 200, align: 'left' },
    { id: 'leavePeriod', label: 'Leave Period', minWidth: 250, align: 'left' },
    { id: 'days', label: 'Days', minWidth: 100, align: 'center' },

    { id: 'type', label: 'Type', minWidth: 100, align: 'left' },

    { id: 'status', label: 'Status', minWidth: 50, align: 'left' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

const columsOvertime = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 150, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 250, align: 'left' },
    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 50, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 50, align: 'left' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

const columsWorked = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 250, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 100, align: 'left' },

    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 50, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 50, align: 'left' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'actionAll', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

export default function AllRequest() {
    const [loadingRJButton, setLoadingRJButton] = useState(false)
    const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role')
        const userObject = JSON.parse(userString)
        return userObject || 'defaultRole' // Provide a default role if undefined
    })
    const showSnackbar = useSnackbar()
    const [loadingButton, setLoadingButton] = useState(false)
    
    const [openAccordionComponent, setOpenAccordionComponent] = useState(false)
    const [open, setOpen] = useState()
    const [leaveRequests, setLeaveRequests] = useState([])
    const [overtimeRequests, setOvertimeRequests] = useState([])
    const [selectedDate, setSelectedDate] = useState(dayjs())
  
    const param = useParams()
    const IdEmployee = param.id
    const { AllRequestInEmployee, ApplyLeaveList, ApplyLeaveTypeList, valueTabs  } = useSelector((state) => state.applyLeave)
    const { WorkedList } = useSelector((state) => state.worked)
    const dispatch = useDispatch()
    useEffect(() => {
        const newDate = formatDateExact(selectedDate)
        dispatch(GetAllRequestAsyncApi({id: IdEmployee,date: newDate }))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    setLeaveRequests(response.payload.leaveRequests)
                    setOvertimeRequests(response.payload.overTimeRequests)
                }
                if (response.meta.requestStatus == 'rejected') {
                }
            })
            .catch((error) => {})
        return () => {
            dispatch(ApplyLeaveAction.clearApplyLeave())
        }
    }, [selectedDate])
    useEffect(() => {
        const userStringEmployeeName = localStorage.getItem('employeeId')
        const employeeId = JSON.parse(userStringEmployeeName)

        return () => {}
    }, [])
    //action Leave
 
    const [pageLeave, setPageLeave] = useState(0)
    const [rowsPerPageLeave, setRowsPerPageLeave] = useState(10)
    const handleChangePageLeave = (newPage) => {
        setPageLeave(newPage)
    }
    const handleChangeRowsPerPageLeave = (event) => {
        setRowsPerPageLeave(+event.target.value)
        setPageLeave(0)
    }
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate)
    }
    const [openModal, setOpenModal] = useState(false)
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ])
    const [requestId, setRequestId] = useState()
    const [leaveDays, setLeaveDays] = useState(0)
    const [leaveDaysDate, setLeaveDaysDate] = useState([])
    const [chosenFileName, setChosenFileName] = useState('Chosen file')
    const initialValues = {
        leaveReason: '',
        leaveType: '',
        leaveDate: '',
    }
    const formik = useFormik({
        initialValues: initialValues,
    })
    const handleClickOpenUpdate = (data) => {
        dispatch(GetApplyLeaveByRequestIdAsyncApi(data.id)).then((res) => {
            if (res.meta.requestStatus == 'fulfilled') {
                const newDate = res.payload.dateRange.map((item, index) => ({
                    title: formatDate(item.title),
                    type: item.type,
                }))
                setLeaveDaysDate(newDate)
                setLeaveDays(res.payload.dateRange.length)
                setChosenFileName(res.payload.linkFile)
                setRequestId(res.payload.id)
                setDateRange([
                    {
                        startDate: parse(res.payload.startDate, 'yyyy/MM/dd', new Date()),
                        endDate: parse(res.payload.endDate, 'yyyy/MM/dd', new Date()),
                        key: 'selection',
                    },
                ])
                formik.setValues({
                    leaveReason: res.payload.reason,
                    leaveType: res.payload.leaveTypeId,
                    leaveDate: '',
                })
            }
        })
        setOpenModal(true)
    }
    const clickOpenFalseModal = (event) => {
        setOpenModal(false)
        setRequestId()
        setChosenFileName('Chosen file')
        formik.setValues({
            leaveReason: '',
            leaveType: '',
            leaveDate: '',
        })
        setDateRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
            },
        ])
        setLeaveDays(0)
        setLeaveDaysDate([])
    }
    const createRowsLeave = () => {
        return leaveRequests.map((item, index) => ({
            ...item,
            reason: (
                <Tooltip title={item.reason}>
                    <div>{item.reason.length > 5 ? item.reason.slice(0, 5) + '...' : item.reason}</div>
                </Tooltip>
            ),
            file: (
                <a className="mt-2 text-blue-400 underline" href={item.linkFile} target="_blank">
                    Link
                </a>
            ),
            days: item.numberOfLeaveDate,
            type: item.leaveType,
            leavePeriod: formatDate(item.startDate) + ' - ' + formatDate(item.endDate),
            applied: formatDate(item.submitDate),
            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.employeeName}</p>
                </div>
            ),
            number: index + 1,
            action: (
                <Tooltip title="Approve or Reject">
                    <div>
                        <IconButton onClick={() => handleClickOpenUpdate(item)}>
                            <VisibilityIcon />
                        </IconButton>
                    </div>
                </Tooltip>
            ),
            actionAll: (
                <Tooltip title="Delete">
                    <div>
                        <IconButton onClick={() => handleClickOpen(item.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </Tooltip>
            ),
            status:
                item.status == 1 ? (
                    <p className="text-green-500">Approved</p>
                ) : item.status == 2 ? (
                    <p className="text-red-500">Reject</p>
                ) : item.status == 3 ? (
                    <p className="text-orange-500">Cancel</p>
                ) : (
                    <p className="text-yellow-500">Pending</p>
                ),
        }))
    }
    const rowsLeave = createRowsLeave()

    const createRowsOvertime = () => {
        return overtimeRequests.map((item, index) => ({
            ...item,
            reason: (
                <Tooltip title={item.reason}>
                    <div>{item.reason.length > 5 ? item.reason.slice(0, 5) + '...' : item.reason}</div>
                </Tooltip>
            ),
            dayAndTime: formatDate(item.date) + ' , ' + item.timeStart + ' ~ ' + item.timeEnd,
            timeInMonth: item.timeInMonth + '/40 hours',
            timeInYear: item.timeInYear + '/200 hours',
            files: (
                <a className="mt-2 text-blue-400 underline" href={item.linkFile} target="_blank">
                    Link
                </a>
            ),
            applied: formatDate(item.submitDate),
            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.employeeName}</p>
                </div>
            ),
            number: index + 1,
            action: userRole === 'Manager' ? (
                <div className="flex gap-2">
                    <div className="border-[1px] border-green-500 text-green-500 px-4 py-1 rounded-3xl hover:bg-green-500 hover:text-white">
                        <LoadingButton
                            type="submit"
                            loading={loadingButton}
                            sx={{
                                textAlign: 'center',
                                color: 'rgb(34 197 94)',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                            autoFocus
                            onClick={() => handleClickApprove(item)}
                        >
                            Approve
                        </LoadingButton>
                    </div>
                    <div className="border-[1px] border-red-500 text-red-500 px-4 py-1 rounded-3xl hover:bg-red-500 hover:text-white">
                        <LoadingButton
                            type="submit"
                            loading={loadingRJButton}
                            sx={{
                                textAlign: 'center',
                                color: 'rgb(239 68 68)',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                            autoFocus
                            onClick={() => handleClickReject(item)}
                        >
                            Reject
                        </LoadingButton>
                    </div>
                </div>
            ) : '',
            
           
            status:   item.status == 'Approved' ? (
                <p className="text-green-500">{item.status}</p>
            ) : item.status == 'Rejected' ? (
                <p className="text-red-500">{item.status}</p>
            ) : (
                <p className="text-yellow-500">{item.status}</p>
            ) ,
               
        }))
    }

    const rowsOvertime = createRowsOvertime()

    const createRowsWorked = () => {

        return WorkedList.map((item, index) => ({
            ...item,
            reason: (
                <Tooltip title={item.reason}>
                    {item.reason.length > 5 ? item.reason.slice(0, 5) + '...' : item.reason}
                </Tooltip>
            ),

            dayAndTime: item.dateOfWorkTime == null ? '' : formatDate(item.dateOfWorkTime),
            time: item.Date,
            files: (
                <a className="mt-2 text-blue-400 underline" href={item.linkFile} target="_blank">
                    Link
                </a>
            ),
            timeInMonth: item.timeInMonth + '/3 Days',
            applied: formatDate(item.submitDate),
            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.employeeName}</p>
                </div>
            ),
            number: index + 1,
            action: (
                <div className="flex gap-2">
                    <div className="border-[1px] border-green-500 text-green-500 px-4 py-1 rounded-3xl hover:bg-green-500 hover:text-white">
                        <LoadingButton
                            type="submit"
                            loading={loadingButton}
                            sx={{
                                textAlign: 'center',
                                color: 'rgb(34 197 94)',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                            autoFocus
                            onClick={() => handleClickApprove(item)}
                        >
                            Approve
                        </LoadingButton>
                    </div>
                    <div className="border-[1px] border-red-500 text-red-500 px-4 py-1 rounded-3xl hover:bg-red-500 hover:text-white">
                        <LoadingButton
                            type="submit"
                            loading={loadingRJButton}
                            sx={{
                                textAlign: 'center',
                                color: 'rgb(239 68 68)',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                            autoFocus
                            onClick={() => handleClickReject(item)}
                        >
                            Reject
                        </LoadingButton>
                    </div>
                </div>
            ),
            actionAll: (
                <Tooltip onClick={handleClickOpen} title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ),
            status: (
                <Tooltip
                    title={
                        item.status == 'True'
                            ? `Approved by ${item.aprrovedBy}`
                            : item.status == 'False'
                            ? `Reject by ${item.rejectBy}`
                            : `Pending...`
                    }
                >
                    {item.status == 'True' ? (
                        <p className="text-green-500">{item.status}</p>
                    ) : item.status == 'False' ? (
                        <p className="text-red-500">{item.status}</p>
                    ) : (
                        <p className="text-yellow-500">{item.status}</p>
                    )}
                </Tooltip>
            ),
        }))
    }
    const rowsWorked = createRowsWorked()

    const handleClickOpen = () => {
        setOpen(true)
    }
    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const clickOpenFalse = (event) => {
        setOpen(false)
        setSelectedDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        })
    }
    const handleDateRangeChange = (ranges) => {
        setSelectedDateRange(ranges.selection)
    }
    const handleClickSave = () => {
        setOpen(false)
    }
    const viewModalContent = <DateRangePicker ranges={[selectedDateRange]} onChange={handleDateRangeChange} />
    const viewModalAction = (
        <Button autoFocus onClick={handleClickSave}>
            Save changes
        </Button>
    )
    const userId = localStorage.getItem('employeeId')
    const UserParseId = JSON.parse(userId)
    const handleClickApprove = () => {
        setLoadingButton(true)
        dispatch(PutApproveApplyLeaveAsyncApi(requestId, UserParseId))
            .then((response) => {
                setLoadingButton(false)
                if (response.meta.requestStatus == 'fulfilled') {
                    dispatch(getApplyLeaveAsyncApi({  status: -1 }))
                    showSnackbar({
                        severity: 'success',
                        children: 'Approved request',
                    })
                    setOpenModal(false)
                    setRequestId()
                    setChosenFileName('Chosen file')
                    formik.setValues({
                        leaveReason: '',
                        leaveType: '',
                        leaveDate: '',
                    })
                    setDateRange([
                        {
                            startDate: new Date(),
                            endDate: new Date(),
                            key: 'selection',
                        },
                    ])
                    setLeaveDays(0)
                    setLeaveDaysDate([])
                }
            })
            .catch((error) => {
                setLoadingButton(false)
            })
    }
    const handleClickReject = () => {
        setLoadingRJButton(true)
        const Updatedata = {
            id: requestId,
            status: 2,
        }
        dispatch(PutApplyLeaveAsyncApi({ id: param.id, body: Updatedata }))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    setLoadingRJButton(false)
                    dispatch(getApplyLeaveAsyncApi({ status: -1 }))
                    showSnackbar({
                        severity: 'success',
                        children: 'Reject request',
                    })
                    setOpenModal(false)
                    setRequestId()
                    setChosenFileName('Chosen file')
                    formik.setValues({
                        leaveReason: '',
                        leaveType: '',
                        leaveDate: '',
                    })
                    setDateRange([
                        {
                            startDate: new Date(),
                            endDate: new Date(),
                            key: 'selection',
                        },
                    ])
                    setLeaveDays(0)
                    setLeaveDaysDate([])
                }
            })
            .catch((error) => {
                setLoadingRJButton(false)
            })
    }
    const tabsData = [
        {
            label: 'Request Leave',
            icon: <InsertChartOutlinedIcon />,
            view: (
                <TableData
                    tableHeight={400}
                    rows={rowsLeave}
                    columns={columnsLeave}
                    page={pageLeave}
                    rowsPerPage={rowsPerPageLeave}
                    handleChangePage={handleChangePageLeave}
                    handleChangeRowsPerPage={handleChangeRowsPerPageLeave}
                />
            ),
        },
        {
            label: 'Request Overtime',
            icon: <AddToPhotosIcon />,
            view: <TableData
            tableHeight={400}
            rows={rowsOvertime}
            columns={columsOvertime}
            page={pageLeave}
            rowsPerPage={rowsPerPageLeave}
            handleChangePage={handleChangePageLeave}
            handleChangeRowsPerPage={handleChangeRowsPerPageLeave}
        />,
        },
        {
            label: 'Request Worked',
            icon: <CalendarMonthIcon />,
            view: <TableData
            tableHeight={400}
            rows={rowsWorked}
            columns={columsWorked}
            page={pageLeave}
            rowsPerPage={rowsPerPageLeave}
            handleChangePage={handleChangePageLeave}
            handleChangeRowsPerPage={handleChangeRowsPerPageLeave}
        />,
        },
    ]
    const viewModalContentRequest = (
        <Fragment>
            <form onSubmit={formik.handleSubmit}>
                <div className="grida md:grid-cols-2 gap-5 py-4 px-8 mb-5 lg:my-0">
                    <div>
                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Leave Type</strong> <i className="text-red-500">*</i>
                            </div>
                            <FormControl fullWidth>
                                <Select
                                    id="outlined-basic"
                                    size="small"
                                    type="date"
                                    error={formik.touched.leaveType && formik.errors.leaveType ? true : undefined}
                                    className="mt-2 w-full text-black"
                                    value={formik.values.leaveType}
                                    name="leaveType"
                                    variant="outlined"
                                    readOnly
                                >
                                    {ApplyLeaveTypeList.map((item, index) => {
                                        return (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="my-2">
                            <div className="mb-1">
                                <strong className=" text-gray-500">Leave Dates</strong>{' '}
                                <i className="text-red-500">*</i>
                            </div>
                            <div>
                                <OutlinedInput
                                    type="text"
                                    aria-describedby={'simple-popover'}
                                    placeholder="Select Date Range"
                                    size="small"
                                    fullWidth
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" edge="end">
                                                <EventNoteIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    value={
                                        formattedDate(dateRange[0].startDate) +
                                        ' - ' +
                                        formattedDate(dateRange[0].endDate)
                                    }
                                    readOnly
                                />
                            </div>

                            <div className="my-2 text-xs text-gray-400 ">
                                <h2>Leave regulations</h2>
                                <p>-Register 2 working days in advance if the leave application is less than 3 days</p>
                                <p>-Register 5 working days in advance if the leave application is from 3 to 7 days</p>
                                <p>-Register 10 working days in advance if the leave application is 7 days or more</p>
                            </div>
                            <div className="bg-blue-100 relative">
                                <h2 className="font-medium m-4 text-lg text-gray-500">Your Leave Details</h2>
                                <div className="h-[280px]  px-4  overflow-auto">
                                    {leaveDaysDate.length < 1 ? (
                                        <div className="text-center  text-gray-400">Yet to select dates</div>
                                    ) : (
                                        leaveDaysDate.map((item, index) => {
                                            return (
                                                <div key={index} className="flex mb-5  items-center">
                                                    <div className="font-bold">
                                                        {item.title}{' '}
                                                        <strong className="font-semibold text-gray-500">
                                                            ({getDayOfWeek(item.title)}){' '}
                                                        </strong>
                                                    </div>
                                                    <div className="flex gap-3 text-blue-400 font-bold ml-auto">
                                                        {item.type == 'nonWorkingDay' ? (
                                                            <strong className="font-semibold text-gray-500">
                                                                Non Working days
                                                            </strong>
                                                        ) : (
                                                            <CustomSelect
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                className="outline-none text-blue-400"
                                                                variant="standard"
                                                                value={item.type}
                                                                onChange={(e) => {
                                                                    const updatedDataList = [...leaveDaysDate]
                                                                    updatedDataList[index].type = e.target.value
                                                                    setLeaveDaysDate(updatedDataList)
                                                                }}
                                                            >
                                                                <MenuItem value={'Full Day'}>Full Day</MenuItem>
                                                                <MenuItem value={'Morning'}>Morning</MenuItem>
                                                                <MenuItem value={'Afternoon'}>Afternoon</MenuItem>
                                                            </CustomSelect>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            {/* <div className="absolute font-medium text-gray-500 bottom-0 p-4 text-lg  w-full flex ">
                            <div>Total Leave</div>
                            <div className="ml-auto">{leaveDays}</div>
                        </div> */}

                            <div className="my-2">
                                <Button
                                    startIcon={<VisibilityIcon />}
                                    type="submit"
                                    loadingPosition="start"
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <span>Manage Leave</span>
                                    <span></span>
                                </Button>
                                <div className={openAccordionComponent == false ? 'hidden' : 'h-full'}>
                                    <h2 className="text-center text-xl my-2">Leave Information</h2>
                                    <div className="grid grid-cols-2 text-center ">
                                        <div className="bg-yellow-500 ">Leave Type</div>
                                        {/* <div className="bg-red-500 ">{selectedLeaveTypeName}</div> */}
                                        <div className="bg-red-500 ">Sick Leave</div>
                                    </div>
                                    <div className="grid grid-cols-2 my-1 ">
                                        <div className="text-left ">Standard Leave Days of Current Year</div>
                                        <div className=" text-center ">365</div>
                                    </div>
                                    <div className="grid grid-cols-2 my-1 ">
                                        <div className=" text-left">
                                            Standard Leave Days Transferred from Previous Year
                                        </div>
                                        <div className=" text-center">0</div>
                                    </div>
                                    <div className="grid grid-cols-2 my-1 ">
                                        <div className=" text-left">Total Used Leave Days in Previous Year</div>
                                        <div className="text-center ">0</div>
                                    </div>
                                    <div className="grid grid-cols-2 my-1">
                                        <div className="text-left ">Remaining Unused Leave Days</div>
                                        <div className="text-center ">365</div>
                                    </div>
                                </div>
                            </div>

                            <div className="my-2">
                                <div className="mb-1">
                                    <strong className=" text-gray-500">Manager Approve</strong>{' '}
                                </div>
                                <FormControl fullWidth>
                                    <Button
                                        disabled
                                        endIcon={<DoneIcon color="success" />}
                                        variant="contained"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            textTransform: 'none',
                                            height: '40px',
                                            text: 'black',
                                        }}
                                    >
                                        <span className="text-black">Manage Leave</span>
                                        <span></span>
                                    </Button>
                                </FormControl>
                            </div>
                            <div className="my-2">
                                <div className="mb-1">
                                    <strong className=" text-gray-500">Total Leave</strong>{' '}
                                </div>
                                <FormControl fullWidth>
                                    <Button
                                        disabled
                                        endIcon={<DoneIcon color="success" />}
                                        variant="contained"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            textTransform: 'none',
                                            height: '40px',
                                            text: 'black',
                                        }}
                                    >
                                        <span className="text-black">{leaveDays}</span>
                                        <span></span>
                                    </Button>
                                </FormControl>
                            </div>

                            <div className="my-2">
                                <div className="mb-1">
                                    <strong className=" text-gray-500">Substitute support staff</strong>{' '}
                                </div>
                                <FormControl fullWidth>
                                    <Select
                                        id="outlined-basic"
                                        size="small"
                                        error={formik.touched.Substitute && formik.errors.Substitute ? true : undefined}
                                        onChange={formik.handleChange}
                                        className="mt-2 w-full"
                                        value={formik.values.Substitute}
                                        name="Substitute"
                                        variant="outlined"
                                        IconComponent={() => <PersonIcon className="mr-3" />}
                                        readOnly
                                    >
                                        {ApplyLeaveTypeList.map((item, index) => (
                                            <MenuItem key={index} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="my-2">
                                <div className="mb-1">
                                    <strong className=" text-gray-500">Leave Reason</strong>{' '}
                                    <i className="text-red-500">*</i>
                                </div>
                                <FormControl fullWidth>
                                    <TextField
                                        multiline
                                        rows={6}
                                        id="outlined-basic"
                                        size="small"
                                        error={
                                            formik.touched.leaveReason && formik.errors.leaveReason ? true : undefined
                                        }
                                        className="mt-2 w-full"
                                        value={formik.values.leaveReason}
                                        name="leaveReason"
                                        variant="outlined"
                                    />
                                </FormControl>
                            </div>
                            <div className="my-2 relative">
                                <div className="mb-1">
                                    <strong className=" text-gray-500">Chosen File</strong>{' '}
                                    <i className="text-red-500">*</i>
                                </div>

                                <a className="mt-2 2 text-blue-400 underline" href={chosenFileName} target="_blank">
                                    Link
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogActions>
                    <div className="flex gap-5">
                        <Button variant="contained" color="inherit" autoFocus onClick={clickOpenFalse}>
                            Cancel
                        </Button>
                        {userRole === 'Manager' ? (
                            <Fragment>
                                <LoadingButton
                                    onClick={handleClickReject}
                                    loading={loadingRJButton}
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                    autoFocus
                                >
                                    Reject
                                </LoadingButton>
                                <LoadingButton
                                    onClick={handleClickApprove}
                                    loading={loadingButton}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                    autoFocus
                                >
                                    Approve
                                </LoadingButton>
                            </Fragment>
                        ) : (
                            ``
                        )}
                    </div>
                </DialogActions>
            </form>
        </Fragment>
    )
    return (
        <div className="bg-white block gap-10 my-5 lg:my-0 ">
            <PopupData
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle="Pick Date"
                viewContent={viewModalContent}
                viewAction={viewModalAction}
            />
            <PopupData
                open={openModal}
                clickOpenFalse={clickOpenFalseModal}
                viewTitle={'Apply Leave Detail'}
                viewContent={viewModalContentRequest}
                size="md"
            />
            <div className="flex w-full">
                <div className="ml-auto">
                  {/* <Stack direction="row" spacing={2}>
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
                    </Stack> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Month"
                                size="small"
                                openTo="month"
                                views={['year', 'month']}
                                value={selectedDate}
                                onChange={handleDateChange}
                                inputFormat="DD/MM/YYYY "
                                // onChange={() => 1}
                                renderInput={(params) => (
                                    <TextField
                                        size="small"
                                        // error={
                                        //     formik.errors.rentFrom &&
                                        //         formik.touched.rentFrom
                                        //         ? true
                                        //         : undefined
                                        // }
                                        {...params}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                   
                </div>
            </div>
            <div className="mt-2 -ml-4">
                <TabsData data={tabsData} isVertical={true} />
            </div>
        </div>
    )
}
