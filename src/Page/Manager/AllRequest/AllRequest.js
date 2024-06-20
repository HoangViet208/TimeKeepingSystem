import React, { useEffect, useState } from 'react'

import NavbarManager from '../Navbar'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import TabsData from '../../../Components/Tabs'
import NavbarHR from '../NavbarHR'
import ApplyLeaveHR from './ApplyLeave'
import OvertimeHR from './Overtime'
import WorkedHR from './Worked'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', url: '/', status: true },
        { title: 'Request', url: '/Employee', status: true },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

const tabsData = [
    {
        label: 'Request Leave',
        view: <ApplyLeaveHR />,
    },
    {
        label: 'Request Overtime',
        view: <OvertimeHR />,
    },
    {
        label: 'Request Worked',
        view: <WorkedHR />,
    },
]

export default function AllRequestForHR() {
    const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role')
        const userObject = JSON.parse(userString)
        return userObject || 'defaultRole' 
    })
    let viewModalContent = <TabsData data={tabsData} />
    return (
        <div className="">

   <NavbarHR />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Employee Detail </h2>
                    <div className="mb-2 font-semibold">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                    </div>
                    <div className="">
                        <TabsData data={tabsData} />
                    </div>
                </div>
            </div>
        </div>
    )
}
