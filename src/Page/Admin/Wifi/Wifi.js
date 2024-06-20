import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { NavLink } from 'react-router-dom'
import * as Yup from 'yup'
//Mui
import { Button, IconButton, Tooltip } from '@mui/material'
import { LoadingButton } from '@mui/lab'
//Icon
import VisibilityIcon from '@mui/icons-material/Visibility'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ErrorIcon from '@mui/icons-material/Error'
import DownloadingIcon from '@mui/icons-material/Downloading'
//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import PopupData from '../../../Components/Popup'
import MultiSelectData from '../../../Components/MultiSelect'
import { useDispatch, useSelector } from 'react-redux'
import {
    DeletewifiAsyncApi,
    PostwifiAsyncApi,
    PutwifiAsyncApi,
    getwifiAsyncApi,
    getwifiByIdAsyncApi,
} from '../../../Redux/Wifi/wifiSlice'
import { useSnackbar } from '../../../Hook/useSnackbar'
import { useFormik } from 'formik'

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, maxWidth: 50, align: 'center' },
    { id: 'title', label: 'Title', minWidth: 100, maxWidth: 200, align: 'left' },
    { id: 'rule', label: 'Bssid', minWidth: 100, maxWidth: 200, align: 'left' },
    { id: 'public', label: 'Public', minWidth: 100, maxWidth: 200, align: 'left' },
    { id: 'action', label: 'Actions', minWidth: 50, maxWidth: 200, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Wifi', icon: <BadgeIcon />, url: '/Admin/Wifi', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

const dataUser = [
    { id: 1, name: 'đạt' },
    { id: 2, name: 'việt' },
    { id: 3, name: 'tài' },
    { id: 1, name: 'phúc' },
]

export default function Wifi() {
    const showSnackbar = useSnackbar()
    const [loadingButton, setLoadingButton] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(4)
    const [isAction, setIsAction] = useState(0)
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [triggerName, setTriggerName] = useState('')
    const [triggerRule, setTriggeRule] = useState('')
    const [isInvalid, setIsInvalid] = useState()
    const [isInvalidName, setIsInvalidName] = useState(false)
    const [isInvalidBssid, setIsInvalidBssid] = useState(false)
    const [id, setId] = useState()
    //setting redux

    const { wifiList } = useSelector((state) => state.wifi)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getwifiAsyncApi())

        return () => {}
    }, [search])
    const handleClickDelete = (item) => {
        dispatch(DeletewifiAsyncApi(item.id)).then((res) => {
            if (res.meta.requestStatus == 'fulfilled') {
                showSnackbar({
                    severity: 'success',
                    children: 'Delete Wifi successfully',
                })

                dispatch(getwifiAsyncApi())
            }
        })
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

    function handleClickDownFile() {
        const templateUrl = '/Wifi.exe'
        const link = document.createElement('a')
        link.href = templateUrl
        link.download = 'Wifi.exe'
        link.click()
    }

    const handleClickOpenUpdate = (data) => {
        setOpen(true)
        setId(data.id)
        setTriggeRule(data.bssid)
        setTriggerName(data.name)
        setIsAction(2)
    }
    const clickOpenFalse = (event) => {
        setOpen(false)
        setIsInvalid(false)
        setTriggeRule()
        setTriggerName()
    }
    const handleMultiSelectUserChange = (newValue) => {}
    const handleClickAction = () => {
        if (triggerName.trim() === '') {
            setIsInvalidName(true)
        } else {
            setIsInvalidName(false)
        }

        if (triggerRule.trim() === '') {
            setIsInvalidBssid(true)
        } else {
            setIsInvalidBssid(false)
        }

        if (!isInvalidName && !isInvalidBssid) {
            if (isAction == 1) {
                setLoadingButton(true)
                let today = new Date()

                const newData = {
                    bssid: triggerRule,
                    name: triggerName,
                    status: true,
                }

                dispatch(PostwifiAsyncApi(newData))
                    .then((response) => {
                        if (response.meta.requestStatus == 'fulfilled') {
                            setLoadingButton(false)
                            setOpen(false)
                            setIsAction(0)
                            setTriggeRule()
                            setTriggerName()
                            setIsInvalidName(true)
                            setIsInvalidBssid(true)
                            showSnackbar({
                                severity: 'success',
                                children: 'Add Wifisuccessfully',
                            })

                            dispatch(getwifiAsyncApi())
                        }
                    })
                    .catch((error) => {
                        setLoadingButton(false)
                    })
            } else if (isAction == 2) {
                const newData = {
                    id: id,
                    bssid: triggerRule,
                    name: triggerName,
                    status: true,
                    isDeleted: false,
                }

                setLoadingButton(true)
                dispatch(PutwifiAsyncApi(newData))
                    .then((response) => {
                        if (response.meta.requestStatus == 'rejected') {
                        }
                        if (response.meta.requestStatus == 'fulfilled') {
                            setLoadingButton(false)
                            setOpen(false)
                            setIsAction(0)
                            setIsInvalidName(true)
                            setIsInvalidBssid(true)
                            showSnackbar({
                                severity: 'success',
                                children: 'Update Wifisuccessfully',
                            })
                            setTriggeRule()
                            setTriggerName()
                            dispatch(getwifiAsyncApi())
                        }
                    })
                    .catch((error) => {
                        setLoadingButton(false)
                    })
            }
        }
    }
    const onchangeActiveWifi= async (data) => {
        const newData = {
            id: data.id,
            bssid: data.bssid,
            name: data.name,
            status: !data.status,
            isDeleted: data.isDeleted,
        }
        try {
            const response = await dispatch(PutwifiAsyncApi(newData))
            showSnackbar({
                severity: 'success',
                children: 'Update status Wifisuccessfully',
            })
            await dispatch(getwifiAsyncApi())
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const createRows = () => {
        // const data = [
        //     {
        //         id: '1',
        //         title: 'Less Working Hours',
        //         rule: 'Avg Work hour is less than 1 hour in last 4 days',
        //         active: true,
        //         excludeTrigger: [
        //             { id: 2, name: 'việt' },
        //             { id: 3, name: 'tài' },
        //         ],
        //     },
        // ]

        return wifiList.map((item, index) => ({
            ...item,
            number: index + 1,
            title: item.name,
            rule: item.bssid,
            public:
                item.status == false ? (
                    <Tooltip title="Active">
                        <IconButton>
                            <ToggleOnOutlinedIcon onClick={() => onchangeActiveWifi(item)} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Inactive">
                        <IconButton>
                            <ToggleOffOutlinedIcon onClick={() => onchangeActiveWifi(item)} />
                        </IconButton>
                    </Tooltip>
                ),
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip onClick={() => handleClickOpenUpdate(item)} title="Edit">
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    {/* {item.active == true ? (
                        <Tooltip title="Active">
                            <IconButton>
                                <ToggleOnOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Inactive">
                            <IconButton>
                                <ToggleOffOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )} */}
                    <Tooltip onClick={() => handleClickDelete(item)} title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }
    const rows = createRows()
    const viewModalContent = (
        <Fragment>
            <div className="mb-5">
                <div className="mb-1 flex gap-1">
                    <strong className=" text-gray-500">Name</strong> <i className="text-red-500">*</i>
                </div>
                <div className="relative">
                    <input
                        className={`h-10 w-full outline-none border-[1px] border-gray-300 rounded-md px-2 mt-2 ${
                            isInvalid ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter name "
                        value={triggerName}
                        onChange={(event) => {
                            const { value } = event.target
                            setTriggerName(value)
                            setIsInvalidName(false)
                        }}
                    />
                </div>
                {isInvalidName && (
                    <p className="text-red-500 mt-1">
                        <ErrorIcon fontSize="small" className="mr-1" />
                        Please enter a valid Wifiname.
                    </p>
                )}
            </div>
            <div className="mb-5">
                <div className="mb-1 flex gap-1">
                    <strong className=" text-gray-500">Bssid</strong> <i className="text-red-500">*</i>
                </div>
                <div className="relative">
                    <input
                        className={`h-10 w-full outline-none border-[1px] border-gray-300 rounded-md px-2 mt-2 ${
                            isInvalid ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter Bssid"
                        value={triggerRule}
                        onChange={(event) => {
                            const { value } = event.target
                            setTriggeRule(value)
                            setIsInvalidBssid(false)
                        }}
                    />
                </div>
                {isInvalidBssid && (
                    <p className="text-red-500 mt-1">
                        <ErrorIcon fontSize="small" className="mr-1" />
                        Please enter a valid WifiBssid.
                    </p>
                )}
            </div>
        </Fragment>
    )
    const viewodalAction = (
        <LoadingButton variant="contained" color="primary" onClick={handleClickAction} loading={loadingButton}>
            Save changes
        </LoadingButton>
    )
    return (
        <div>
            <Navbar />
            <PopupData
                size="lg"
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle={isAction == 1 ? 'Add Wifi' : isAction == 2 ? 'Edit Wifi' : ''}
                viewContent={viewModalContent}
                viewAction={viewodalAction}
            />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">WifiList </h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                        <div className="ml-auto uppercase flex gap-5">
                            <LoadingButton
                                startIcon={<DownloadingIcon />}
                                onClick={handleClickDownFile}
                                loading={loadingButton}
                                loadingPosition="start"
                                variant="contained"
                                color="success"
                                autoFocus
                            >
                                Download File
                            </LoadingButton>

                            <Button
                                onClick={handleClickOpenAdd}
                                startIcon={<AddIcon />}
                                variant="contained"
                                color="primary"
                                className=""
                            >
                                Add New
                            </Button>
                        </div>
                    </div>
                    <div className="bg-white p-4">
                        <div className="mb-5 flex items-center">
                            <Search parentCallback={callbackSearch} />
                            <div className="ml-auto md:mr-14 mr-4">{/* <FilterListIcon className="" /> */}</div>
                        </div>
                        <div>
                            <TableData
                                tableHeight={400}
                                rowsPerPageOptions={[4,25,50]}
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
    )
}
