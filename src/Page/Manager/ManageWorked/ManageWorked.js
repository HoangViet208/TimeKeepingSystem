import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { NavLink } from 'react-router-dom'

//Mui
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Avatar, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import dayjs from 'dayjs'
import { LoadingButton } from '@mui/lab'
//Icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'

//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import TabsData from '../../../Components/Tabs'
import PopupConfirm from '../../../Components/PopupConfirm'

//hooks
import { formatDate, formatDateExact } from '../../../Hook/useFormatDate'
import { useDispatch, useSelector } from 'react-redux'
import {
    PutApproveWorkedAsyncApi,
    PutCancelWorkedAsyncApi,
    PutRejectWorkedAsyncApi,
    PutWorkedAsyncApi,
    getWorkedAsyncApi,
} from '../../../Redux/Worked/WorkedSlice'
import { useSnackbar } from '../../../Hook/useSnackbar'
import NavbarHR from '../NavbarHR'
import TableLoadData from '../../../Components/TableLoad'
import { PutApproveWorkedApi } from '../../../Api/WorkedApi'
import UpdateIsSeenToTrueForManager from '../../../Hook/useFirebase'

const columnsPending = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 200, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 200, align: 'left' },

    { id: 'timeInMonth', label: 'Time In Month', minWidth: 100, align: 'center' },
    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 150, align: 'center' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

const columnsApprove = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 200, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 200, align: 'left' },

    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 150, align: 'center' },
    { id: 'aprrovedBy', label: 'Aprroved By', minWidth: 50, align: 'center' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
]
const columnsReject = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 200, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 200, align: 'left' },

    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 150, align: 'center' },
    { id: 'aprrovedBy', label: 'Reject By', minWidth: 50, align: 'center' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
]

const columnsAll = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Employee Name', minWidth: 200, align: 'left' },
    { id: 'dayAndTime', label: 'Date', minWidth: 200, align: 'left' },

    { id: 'files', label: 'File', minWidth: 100, align: 'left' },
    { id: 'applied', label: 'Applied On', minWidth: 150, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 50, align: 'left' },
    { id: 'reason', label: 'Reason', minWidth: 50, align: 'center' },
    { id: 'actionAll', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'left' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Manage Worked', icon: <BadgeIcon />, url: '/ManageWorked', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function ManageWorked() {
    const [errorReject, setErrorReject] = useState(true)
    const [rejectReason, setRejectReason] = useState('')
    const userId = localStorage.getItem('employeeId')
    const UserParseId = JSON.parse(userId)
    const [requestId, setRequestId] = useState()
    const [employeeId, setEmployeeID] = useState()
    const [loadingButton, setLoadingButton] = useState(false)
    const [loadingRJButton, setLoadingRJButton] = useState(false)
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const showSnackbar = useSnackbar()
    //setting redux
    const { WorkedList, loading, valueTabs } = useSelector((state) => state.worked)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(
            getWorkedAsyncApi({
                name: search,
                status: valueTabs == 4 ? -1 : valueTabs,
                date: formatDateExact(selectedDate),
                id: userRole == 'Manager' ? UserParseId : '',
            })
        )
        return () => {}
    }, [search, valueTabs, selectedDate])
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
    const handleClickOpen = () => {
        setOpen(true)
    }
    const clickOpenFalse = (event) => {
        setErrorReject(true)
        setRejectReason('')
        setOpen(false)
    }
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate)
    }
    const searchData = (data) => {
        return (
            <div className="p-4">
                <div className="mb-5 flex items-center">
                    <Search parentCallback={callbackSearch} />
                    <div className="ml-auto md:mr-4 mr-4">
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
                {data}
            </div>
        )
    }
    const handleClickOpenReason = (data) => {
        setRequestId(data.id)
        setEmployeeID(data.employeeId)
        setOpen(true)
    }
    const [loadingButtonIndex, setLoadingButtonIndex] = useState(null)
    const handleClickApprove = (data, index) => {
        setLoadingButton(true)
        setLoadingButtonIndex(index)
        UpdateIsSeenToTrueForManager(data)
        dispatch(PutApproveWorkedAsyncApi(data.id))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    setLoadingButton(false)
                    dispatch(
                        getWorkedAsyncApi({
                            name: search,
                            status: valueTabs == 4 ? -1 : valueTabs,
                            date: formatDateExact(selectedDate),
                            id: userRole == 'Manager' ? UserParseId : '',
                        })
                    )
                    setLoadingButtonIndex(null)
                    showSnackbar({
                        severity: 'success',
                        children: 'Approved request',
                    })
                    setLoadingButtonIndex(null)
                }
            })
            .catch((error) => {
                setLoadingButton(false)
            })
    }
    const handleClickReject = () => {
        setLoadingRJButton(true)
        const body = {
            requestId: requestId,
            reason: rejectReason,
            employeeIdDecider: employeeId,
        }
        const dataForManager = {
            id : requestId
        };
        UpdateIsSeenToTrueForManager(dataForManager)
        dispatch(PutRejectWorkedAsyncApi(body))
            .then((response) => {
                setLoadingRJButton(false)

                if (response.meta.requestStatus == 'fulfilled') {
                    dispatch(
                        getWorkedAsyncApi({
                            name: search,
                            status: valueTabs == 4 ? -1 : valueTabs,
                            date: formatDateExact(selectedDate),
                            id: userRole == 'Manager' ? UserParseId : '',
                        })
                    )
                    showSnackbar({
                        severity: 'success',
                        children: 'Reject request',
                    })

                    setErrorReject(true)
                    setRejectReason('')
                    setOpen(false)
                }
            })
            .catch((error) => {
                setLoadingRJButton(false)
            })
    }
    const createRows = () => {
        return WorkedList.map((item, index) => ({
            ...item,
            reason: (
                <Tooltip title={item.reason }>
                     <button>
                        {item.reason.length > 5 ? item.reason.slice(0, 5) + '...' : item.reason}
                    </button>
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
                    <div>
                        {loadingButtonIndex === index ? (
                            <LoadingButton
                                type="submit"
                                loading={true}
                                sx={{
                                    textAlign: 'center',
                                    color: '#22c55e',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #22c55e',
                                    padding: '4px 16px', // tùy chỉnh px và py theo cần thiết
                                    borderRadius: '9999px', // hoặc '3xl' nếu bạn muốn sử dụng classnames
                                    '&:hover': {
                                        backgroundColor: '#22c55e',
                                        color: 'white',
                                    },
                                }}
                            >
                                Approve
                            </LoadingButton>
                        ) : (
                            <LoadingButton
                                type="submit"
                                sx={{
                                    textAlign: 'center',
                                    color: '#22c55e',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #22c55e',
                                    padding: '4px 16px', // tùy chỉnh px và py theo cần thiết
                                    borderRadius: '9999px', // hoặc '3xl' nếu bạn muốn sử dụng classnames
                                    '&:hover': {
                                        backgroundColor: '#22c55e',
                                        color: 'white',
                                    },
                                }}
                                onClick={() => handleClickApprove(item, index)}
                            >
                                Approve
                            </LoadingButton>
                        )}

                        {/* <LoadingButton
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
                            onClick={() => handleClickApprove(item, index)}
                        >
                            Approve
                        </LoadingButton> */}
                    </div>
                    <div>
                        <LoadingButton
                            type="submit"
                            loading={loadingRJButton}
                            sx={{
                                textAlign: 'center',
                                color: 'rgb(239 68 68)',
                                backgroundColor: 'transparent',
                                border: '1px solid #f44336',
                                padding: '4px 16px', // tùy chỉnh px và py theo cần thiết
                                borderRadius: '9999px', // hoặc '3xl' nếu bạn muốn sử dụng classnames
                                '&:hover': {
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                },
                            }}
                            autoFocus
                            onClick={() => handleClickOpenReason(item)}
                        >
                            Reject
                        </LoadingButton>
                    </div>
                </div>
            ),
            actionAll: (
                <Tooltip    onClick={() => handleClickOpenReason(item)} title="Cancel">
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
                    {item.status == 1 ? (
                        <p className="text-green-500">{item.statusName}</p>
                    ) : item.status == 2 ? (
                        <p className="text-red-500">{item.statusName}</p>
                    ) : item.status == 3 ? (
                        <p className="text-orange-500">{item.statusName}</p>
                    ) : (
                        <p className="text-yellow-500">{item.statusName}</p>
                    )}
                </Tooltip>
            ),
        }))
    }

    const rows = createRows()

    const tabsData = [
        {
            label: 'Pending Worked',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={380} />
                ) : (
                    <TableData
                        tableHeight={360}
                        rows={rows}
                        columns={columnsPending}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
        {
            label: 'Approved Worked',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={380} />
                ) : (
                    <TableData
                        tableHeight={360}
                        rows={rows}
                        columns={columnsApprove}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
        {
            label: 'Reject Worked',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={360} />
                ) : (
                    <TableData
                        tableHeight={380}
                        rows={rows}
                        columns={columnsReject}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
        {
            label: 'Cancel Worked',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={360} />
                ) : (
                    <TableData
                        tableHeight={380}
                        rows={rows}
                        columns={columnsReject}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
        {
            label: 'All Workeds',
            view: searchData(
                loading == true ? (
                    <TableLoadData columns={columnsPending} tableHeight={380} />
                ) : (
                    <TableData
                        tableHeight={360}
                        rows={rows}
                        columns={columnsAll}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )
            ),
        },
    ]
    const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role')
        const userObject = JSON.parse(userString)
        return userObject || 'defaultRole' // Provide a default role if undefined
    })
    useEffect(() => {
        // Update the userRole state whenever 'role' is changed in localStorage
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
    const handleClickCancel = () => {
        setLoadingRJButton(true)
        const Updatedata = {
            requestId: requestId,
            reason: rejectReason,
            employeeIdDecider: UserParseId,
        }
        dispatch(PutCancelWorkedAsyncApi(Updatedata))
            .then((response) => {
                setLoadingRJButton(false)
                if (response.meta.requestStatus == 'fulfilled') {
                    dispatch(
                        dispatch(
                            getWorkedAsyncApi({
                                name: search,
                                status: valueTabs == 4 ? -1 : valueTabs,
                                date: formatDateExact(selectedDate),
                                id: userRole == 'Manager' ? UserParseId : '',
                            })
                        )
                    )
                    showSnackbar({
                        severity: 'success',
                        children: 'Cancel request',
                    })
                    setErrorReject(true)
                    setRejectReason('')

                    setOpen(false)
                }else{
                    setOpen(false)
                }
            })
            .catch((error) => {
                setLoadingRJButton(false)
                setOpen(false)
            })
    }
    const handleChangeReasonRejectInput = (e) => {
        if (e == '') {
            setErrorReject(true)
        } else {
            setErrorReject(false)
        }
        setRejectReason(e)
    }
    const RejectContent = (
        <Fragment>
            <div className="">
                <div className="my-2">
                    <div className="mb-1">
                        <strong className=" text-gray-500">Reject Reason</strong>
                        <i className="text-red-500">*</i>
                    </div>

                    <TextField
                        multiline
                        rows={6}
                        id="outlined-basic"
                        size="small"
                        className="mt-2 w-full"
                        name="leaveReason"
                        variant="outlined"
                        value={rejectReason}
                        onChange={(e) => handleChangeReasonRejectInput(e.target.value)}
                    />
                </div>
            </div>
        </Fragment>
    )
    return (
        <div>
            {userRole === 'Manager' ? <Navbar /> : <NavbarHR />}

            <PopupConfirm
                open={open}
                witdhModal={'sm'}
                clickOpenFalse={clickOpenFalse}
                clickDelete={valueTabs == 4 ? handleClickCancel : handleClickReject}
                isError={errorReject}
                viewTitle={valueTabs == 4 ? 'Cancel Confirm' : 'Reject Confirm'}
                viewContent={
                    valueTabs == 4 ? (
                        <Fragment>
                            <h2 className="font-bold text-xl">Are you sure to cancel this ?</h2>
                            <p className="mb-5 text-gray-400">You can't undo this action once you canceled this.</p>
                            {RejectContent}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <h2 className="font-bold text-xl">Are you sure to reject this ?</h2>
                            <p className="mb-5 text-gray-400">You can't undo this action once you rejected this.</p>
                            {RejectContent}
                        </Fragment>
                    )
                }
                viewAction={valueTabs == 4 ? 'Cancel' : 'Reject'}
                isLoading={loadingRJButton}
            />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Manage Worked List </h2>
                    <div className="mb-8 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <div className="bg-white">
                        <TabsData data={tabsData} />
                    </div>
                </div>
            </div>
        </div>
    )
}
