import React, { Fragment, useState } from 'react'
import Navbar from '../Navbar'
import { NavLink } from 'react-router-dom'

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
//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import PopupData from '../../../Components/Popup'
import MultiSelectData from '../../../Components/MultiSelect'

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, maxWidth: 50, align: 'center' },
    { id: 'title', label: 'Title', minWidth: 200, maxWidth: 350, align: 'left' },
    { id: 'rule', label: 'Rule Condition', minWidth: 200, align: 'left' },
    { id: 'action', label: 'Actions', minWidth: 50, maxWidth: 200, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Risk Settings', icon: <BadgeIcon />, url: '/Employee', status: false },
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

export default function RiskEmployeeSettings() {
    const [loadingButton, setLoadingButton] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isAction, setIsAction] = useState(0)
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState([])
    const [triggerName, setTriggerName] = useState('')
    const [triggerRule, setTriggeRule] = useState('')
    const [isInvalid, setIsInvalid] = useState(false)

    const handleSubmit = () => {
        if (triggerName.trim() === '') {
            setIsInvalid(true)
        } else {
        }
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
        setSelectedUser(data.excludeTrigger)
    }
    const clickOpenFalse = (event) => {
        setOpen(false)
        setSelectedUser([])
        setIsInvalid(false)
    }
    const handleMultiSelectUserChange = (newValue) => {
        setSelectedUser(newValue)
    }

    const createRows = () => {
        const data = [
            {
                id: '1',
                title: 'Less Working Hours',
                rule: 'Avg Work hour is less than 1 hour in last 4 days',
                active: true,
                excludeTrigger: [
                    { id: 2, name: 'việt' },
                    { id: 3, name: 'tài' },
                ],
            },
        ]

        return data.map((item, index) => ({
            ...item,
            number: index + 1,
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip onClick={() => handleClickOpenUpdate(item)} title="Edit">
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    {item.active == true ? (
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
                    )}
                    <Tooltip title="Delete">
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
                <strong className="text-gray-500">Name of the Trigger</strong>
                <div className="relative">
                    <input
                        className={`h-10 w-full outline-none border-[1px] border-gray-300 rounded-md px-2 mt-2 ${
                            isInvalid ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter name of the Trigger"
                        value={triggerName}
                        onChange={(event) => {
                            const { value } = event.target
                            setTriggerName(value)
                            setIsInvalid(false)
                        }}
                    />
                </div>
                {isInvalid && (
                    <p className="text-red-500 mt-1">
                        <ErrorIcon fontSize="small" className="mr-1" />
                        Please enter a valid Trigger name.
                    </p>
                )}
            </div>
            <div className="mb-5">
                <strong className="text-gray-500">Risk Trigger Rule</strong>
                <div className="relative">
                    <input
                        className={`h-10 w-full outline-none border-[1px] border-gray-300 rounded-md px-2 mt-2 ${
                            isInvalid ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter rule of the Trigger"
                        value={triggerRule}
                        onChange={(event) => {
                            const { value } = event.target
                            setTriggeRule(value)
                            setIsInvalid(false)
                        }}
                    />
                </div>
                {isInvalid && (
                    <p className="text-red-500 mt-1">
                        <ErrorIcon fontSize="small" className="mr-1" />
                        Please enter a valid Trigger name.
                    </p>
                )}
            </div>
            <div className="mb-5">
                <strong className="text-gray-500">Exclude User from the Trigger (optional)</strong>
                <div className="mt-4">
                    <MultiSelectData
                        data={dataUser}
                        defaultValueData={selectedUser}
                        onChange={handleMultiSelectUserChange}
                        placeholder="Select User..."
                    />
                </div>
            </div>
        </Fragment>
    )
    const viewodalAction = (
        <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
        </Button>
    )
    return (
        <div>
            <Navbar />
            <PopupData
                size="lg"
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle={isAction == 1 ? 'Add Risk Trigger' : isAction == 2 ? 'Edit Risk Trigger' : ''}
                viewContent={viewModalContent}
                viewAction={viewodalAction}
            />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Risk Trigger List </h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                        <div className="ml-auto uppercase">
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
                            <div className="ml-auto md:mr-14 mr-4">
                                <FilterListIcon className="" />
                            </div>
                        </div>
                        <div>
                            <TableData
                                tableHeight={400}
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
