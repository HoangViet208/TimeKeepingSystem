import React from 'react'

//Icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'

//component
import IconBreadcrumbs from '../../../Components/Breadcrumbs'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Daily Attendance', icon: <BadgeIcon />, url: '/Report', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function DailyAttendance() {
    return (
        <div className="">
            <div className="px-12 py-6">
                <h2 className="font-bold text-3xl mb-4">Daily Attendance</h2>
                <div className="mb-8 font-semibold">
                    <IconBreadcrumbs data={dataBreadcrumbs} />
                </div>
                <div className="bg-white p-4">
                    <div className="mb-5 flex items-center">
                        <div className="ml-auto md:mr-16 mr-4"></div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
