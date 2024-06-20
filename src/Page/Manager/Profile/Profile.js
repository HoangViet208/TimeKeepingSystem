import React, { useState, useEffect } from 'react'

//mui

//icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import KeyIcon from '@mui/icons-material/Key'
import EventNoteIcon from '@mui/icons-material/EventNote'

//component
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import TabsData from '../../../Components/Tabs'
import General from '../EmployeeDetail/General'
import ChangePassword from './ChangePassword'
import TimeEntries from '../EmployeeDetail/TimeEntries'
import NavbarManager from '../Navbar'
import NavbarHR from '../NavbarHR'
import NavbarAdmin from '../../Admin/Navbar'
import Navbar from '../../Employee/Navbar'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Accout Settings', icon: <BadgeIcon />, url: '/Profile', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

const tabsData = [
    {
        label: 'General',
        icon: <AccountBoxIcon />,
        view: <General />,
    },
    {
        label: 'Change Password',
        icon: <KeyIcon />,
        view: <ChangePassword />,
    },
    // {
    //     label: 'Time Entries',
    //     icon: <EventNoteIcon />,
    //     view: <TimeEntries />,
    // },
]

export default function Profile() {
    const userStringRole = localStorage.getItem('role')
    const role = JSON.parse(userStringRole)
    let newNav = null
    useEffect(() => {
        if (role) {
            if (role === 'Manager') {
                newNav = <NavbarManager />
            } else if (role === 'User') {
                newNav = <Navbar />
            } else if (role === 'HR') {
                newNav = <NavbarHR />
            } else if (role === 'Admin') {
                newNav = <NavbarAdmin />
            }
        }
    }, [role])
    return (
        <div>
            {newNav}
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4">Account</h2>
                    <div className="mb-8 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <TabsData data={tabsData} />
                </div>
            </div>
        </div>
    )
}
