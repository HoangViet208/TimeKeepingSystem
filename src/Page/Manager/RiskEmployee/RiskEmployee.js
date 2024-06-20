import React, { useState } from 'react'
import Navbar from '../Navbar'
import { NavLink } from 'react-router-dom'

//Mui
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

//Icon
import VisibilityIcon from '@mui/icons-material/Visibility'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import EmailIcon from '@mui/icons-material/Email'

//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 200, align: 'left' },
    { id: 'info', label: 'Name', minWidth: 200, align: 'left' },
    { id: 'day', label: 'Day workings', minWidth: 100, align: 'center' },
    { id: 'lackOfTime', label: 'Time workings', minWidth: 100, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'center' },
]

const createRows = () => {
    const data = [
        {
            id: '1',
            avatar: 'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
            email: 'VietDH16022000@gmail.com',
            name: 'Đặng Hoàng Việt',
            day: '22 days',
            lackOfTime: '118 h',
            status: 'Enough',
        },
        {
            id: '2',
            avatar: 'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
            email: 'VietDH16022000@gmail.com',
            name: 'Đặng Hoàng Việt',
            day: '21 days',
            lackOfTime: '100 h',
            status: 'Lack',
        },
        {
            id: '3',
            avatar: 'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
            email: 'VietDH16022000@gmail.com',
            name: 'Đặng Hoàng Việt',
            day: '22 days',
            lackOfTime: '118 h',
            status: 'Enough',
        },
        {
            id: '4',
            avatar: 'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
            email: 'VietDH16022000@gmail.com',
            name: 'Đặng Hoàng Việt',
            day: '22 days',
            lackOfTime: '118 h',
            status: 'Enough',
        },
        {
            id: '5',
            avatar: 'https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien-600x600.jpg',
            email: 'VietDH16022000@gmail.com',
            name: 'Đặng Hoàng Việt',
            day: '22 days',
            lackOfTime: '118 h',
            status: 'Enough',
        },
    ]

    return data.map((item, index) => ({
        ...item,
        email: (
            <button className="flex items-center gap-2 border-[1px] rounded-full py-2 px-3">
                <EmailIcon className="w-8 h-8" />
                {item.email}
            </button>
        ),
        info: (
            <div className="flex gap-2 items-center ">
                {' '}
                {/* Added the class 'align-center' for centering */}
                <p className="font-bold">{item.name}</p>
            </div>
        ),
        status:
            item.status == 'Enough' ? (
                <button className="bg-green-300 text-green-600 font-semibold py-1 px-2 rounded-xl">
                    {item.status}
                </button>
            ) : (
                <button className="bg-yellow-300 text-yellow-600 font-semibold py-1 px-2 rounded-xl">
                    {item.status}
                </button>
            ),
        number: index + 1,
        action: (
            <div className="flex gap-2 justify-center">
                <NavLink
                    to={`/Employee/Detail/${item.id}`}
                    activeStyle={{
                        background: '#dbeafe',
                        color: '#2563eb',
                    }}
                    exact
                    className="cursor-pointer"
                >
                    <Tooltip title="View Detail">
                        <IconButton>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                </NavLink>
            </div>
        ),
        gender: item.gender === 'Female' ? <FemaleIcon /> : <MaleIcon />,
    }))
}

const rows = createRows()

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Risk Employee', icon: <BadgeIcon />, url: '/Employee', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function RiskEmployee() {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
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

    return (
        <div>
            <Navbar />
            <div className="sm:ml-64 h-screen pt-12 bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Risk Employee List </h2>
                    <div className="mb-8 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
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
