import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, NavLink } from 'react-router-dom'

//date-picker-range
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { addDays, startOfDay } from 'date-fns'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import dayjs from 'dayjs'
//Firebase

//Mui
import { styled } from '@mui/system'
import { Popover, Select, Button, Tooltip, IconButton, TextField, Card } from '@mui/material'

//Icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import VisibilityIcon from '@mui/icons-material/Visibility'
//Component
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import PopupData from '../../../Components/Popup'
import PopupConfirm from '../../../Components/PopupConfirm'
import Navbar from '../Navbar'

//hooks
import {
    calculateDays,
    calculateDuration,
    calculateTime,
    formatDate,
    formatDateExact,
    formattedDate,
    getDateRangeArray,
    getDayOfWeek,
} from '../../../Hook/useFormatDate'
import LineChart from './Chart'
import { GetWorkedSlotByIdEmployeeApi } from '../../../Api/WorkSlotEmployeeApi'
import { useDispatch, useSelector } from 'react-redux'
import { getWorkSlotEmployeeedAsyncApi } from '../../../Redux/WorkSlotEmployee/WorkSlotEmployeeSlice'

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
    { id: 'date', label: 'Date', minWidth: 100, align: 'left' },
    { id: 'startTime', label: 'Start time', minWidth: 100, align: 'center' },
    { id: 'endTime', label: 'End time', minWidth: 100, align: 'center' },
    { id: 'checkIn', label: 'Check In', minWidth: 100, align: 'center' },
    { id: 'checkOut', label: 'Check Out', minWidth: 100, align: 'center' },
    { id: 'duration', label: 'Duration', minWidth: 100, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'center' },
]

export default function DashboardEmployee() {
    //popover
    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const [error, SetError] = useState()
    const [errorImport, seterrorImport] = useState(false)
    const [chosenFileName, setChosenFileName] = useState('Chosen file')
    const fileInputRef = useRef(null)
    const openPopover = Boolean(anchorEl)
    const id = openPopover ? 'simple-popover' : undefined
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [isAction, setIsAction] = useState(0)
    const [search, setSearch] = useState('')
    const [leaveDays, setLeaveDays] = useState(0)
    const [reason, setReason] = useState('')
    const [leaveDaysDate, setLeaveDaysDate] = useState([])

    const today = new Date()
    const [series, setSeries] = useState([
        {
            name: 'Worked',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ])
    const userStringEmployeeName = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(userStringEmployeeName)

    const { WorkSlotByEmployee } = useSelector((state) => state.WorkSlotEmployee)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getWorkSlotEmployeeedAsyncApi({ id: employeeId, month: formatDateExact(selectedDate) })).then(
            (res) => {
                setSeries([res.payload.allTimeWork])
            }
        )

        return () => {}
    }, [selectedDate])
    const [date, setDate] = useState(null)
    const DaysLater = addDays(today, 2)
    const [selectedStartTime, setSelectedStartTime] = useState(null)
    const [selectedEndTime, setSelectedEndTime] = useState(null)
    const handleChangeStartTime = (newTime) => {
        setSelectedStartTime(newTime)
    }
    const handleChangeEndTime = (newTime) => {
        setSelectedEndTime(newTime)
    }

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
    const handleClickOpenAdd = () => {
        setOpen(true)
        setIsAction(1)
    }
    const handleClickOpenUpdate = (data) => {
        setOpen(true)
        setIsAction(2)
    }
    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0]
        seterrorImport(false)
        SetError()
        if (selectedFile) {
            setChosenFileName(selectedFile.name)
            seterrorImport(true)
        }
    }
    const handleBrowseButtonClick = () => {
        fileInputRef.current.click()
    }
    const clickOpenFalse = (event) => {
        setOpen(false)
        setIsAction(0)

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

    const createRows = () => {
        const data = [
            {
                date: '01/07/2023',
                startTime: '7:00',
                stopTime: '5:30',
                duration: '8:00',
                status: 'Working',
            },
            {
                date: '02/07/2023',
                startTime: '7:00',
                stopTime: '5:30',
                duration: '8:00',
                status: 'Working',
            },
            { date: '03/07/2023', startTime: '0', stopTime: '0', duration: '0', status: 'Not Working' },
        ]

        return WorkSlotByEmployee.timeSlot
            ? WorkSlotByEmployee.timeSlot.map((item, index) => ({
                  ...item,
                  number: index + 1,
                  date: (
                      <p>
                          {' '}
                          {item.date && formatDate(item.date)} {item.isOvertime ? '(Over Time)' : '(Worked)'}{' '}
                      </p>
                  ),
                  startTime: item.startTime,
                  stopTime: item.stopTime,
                  duration: item.duration, // calculateDuration(item.startTime, item.stopTime),
                  status: item.status,
                  action: (
                      <Tooltip title="View Detail">
                          <IconButton>
                              <VisibilityIcon />
                          </IconButton>
                      </Tooltip>
                  ),
              }))
            : []
    }
    const rows = createRows()

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
                >
                    <div className="md:flex">
                        <Calendar onChange={(item) => setDate(item)} date={date} minDate={DaysLater} />
                        <div className="mx-2 flex flex-col items-center justify-center">
                            <div className="mb-2">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker
                                            label="Start Time"
                                            slotProps={{ textField: { size: 'small' } }}
                                            value={selectedStartTime}
                                            onChange={handleChangeStartTime}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                            <div className="mb-2">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker
                                            label="End Time"
                                            slotProps={{ textField: { size: 'small' } }}
                                            value={selectedEndTime}
                                            onChange={handleChangeEndTime}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                            <div className="mb-2 relative">
                                <input
                                    className="hidden w-full" // Ẩn input mặc định
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileInputChange}
                                />
                                <button
                                    onClick={handleBrowseButtonClick}
                                    className="border-[1px] cursor-pointer rounded-md h-10 bg-gray-300 px-4 absolute "
                                >
                                    Browse
                                </button>
                                <div>
                                    <button
                                        onClick={handleBrowseButtonClick}
                                        className="cursor-pointer  block rounded-md h-10 text-left w-[260px] pl-[90px] font-medium text-gray-600  border border-gray-300   bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                        fullWidth
                                        variant="contained"
                                    >
                                        {chosenFileName.length > 16
                                            ? chosenFileName.slice(0, 16).concat('...')
                                            : chosenFileName}
                                    </button>
                                    {error && <div className="text-red-500 w-[260px]">{error}</div>}
                                </div>
                            </div>
                            <div className="mb-2">
                                <TextField label="Reason" multiline className="w-[260px]" rows={3} value={reason} />
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <hr />
                        <div className="my-2 float-right mr-4">
                            <Button disabled={error || !errorImport} variant="contained">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Popover>
            )}
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Dashboard </h2>
                    <div className="grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-3 gap-10 mt-4">
                        <Card className="flex  ">
                            <div className="">
                                <Link to="/Employee/ApplyLeave">
                                    <button className="text-white bg-gray-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                                        <InsertChartOutlinedIcon className="text-teal-400 h-12 w-12" />
                                    </button>
                                </Link>
                            </div>
                            <div className="grid grid-rows-2 mt-2 ml-2">
                                <div className="flex gap-1 ">
                                    <div className="text-3xl font-extrabold  text-teal-400">
                                        {WorkSlotByEmployee && WorkSlotByEmployee.requestLeavePending}
                                    </div>
                                    <div className="text-sm mt-3 text-gray-500">Apply Leave</div>
                                </div>
                                <div className=" font-bold flex gap-1  text-gray-500  ">
                                    <CheckCircleOutlineIcon className="" />
                                    <div className="text-sm mt-[1px]">Pending</div>
                                </div>
                            </div>
                        </Card>
                        <Card className="flex   ">
                            <div className="">
                                <Link to="/Employee/Overtime">
                                    <button className="text-white bg-yellow-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                                        <AddToPhotosIcon className="text-yellow-400 h-12 w-12" />
                                    </button>
                                </Link>
                            </div>

                            <div className="grid grid-rows-2 mt-2 ml-2">
                                <div className="flex gap-1 ">
                                    <div className="text-3xl font-extrabold  text-yellow-400">
                                        {WorkSlotByEmployee && WorkSlotByEmployee.requestOverTimePending}
                                    </div>
                                    <div className="text-sm mt-3 text-gray-500">OverTime Request</div>
                                </div>
                                <div className=" font-bold flex gap-1  text-gray-500  ">
                                    <CheckCircleOutlineIcon className="" />
                                    <div className="text-sm mt-[1px]">Pending</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="flex  ">
                            <div className="">
                                <Link to="/Employee/Worked">
                                    <button className="text-white bg-green-100 rounded-lg  ml-5 my-[10px] h-20 w-20">
                                        <CalendarMonthIcon className="text-green-700 h-12 w-12" />
                                    </button>
                                </Link>
                            </div>
                            <div className="grid grid-rows-2 mt-2 ml-2">
                                <div className="flex gap-1 ">
                                    <div className="text-3xl font-extrabold  text-green-700">
                                        {WorkSlotByEmployee && WorkSlotByEmployee.requestWorkTimePending}
                                    </div>
                                    <div className="text-sm mt-3 text-gray-500">Worked Request</div>
                                </div>
                                <div className=" font-bold flex gap-1  text-gray-500  ">
                                    <CheckCircleOutlineIcon className="" />
                                    <div className="text-sm mt-[1px]">Pending</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <div className="ml-auto uppercase">
                            {/* <Button
                                onClick={handleClick}
                                startIcon={<AddIcon />}
                                variant="contained"
                                color="primary"
                                className=""
                            >
                                Add New
                            </Button> */}
                        </div>
                    </div>
                    <div className=" gap-5">
                        <div className="bg-white p-4">
                            <div className=" mt-4 text-center">
                                <LineChart data={series} />
                            </div>
                        </div>
                        <div className="bg-white p-4">
                            <div className="mb-5 flex items-center">
                                <div className="">
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
                            <div>
                                <TableData
                                    tableHeight={500}
                                    rows={rows}
                                    columns={columns}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    handleChangePage={handleChangePage}
                                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
