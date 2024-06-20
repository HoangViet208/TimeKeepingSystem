import React, { useState } from 'react'
import Navbar from '../Navbar'

//Mui

//Icon
import TodayIcon from '@mui/icons-material/Today'
import EventNoteIcon from '@mui/icons-material/EventNote'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

//Component
import TabsData from '../../../Components/Tabs'
import DailyAttendance from './DailyAttendance'
import MonthAttendance from './MonthAttendance'
import MonthlyInOutAttendance from './MonthlyInOutAttendance'

export default function Report() {
    const [search, setSearch] = useState('')
    const callbackSearch = (childData) => {
        setSearch(childData)
    }
    const tabsData = [
        {
            label: 'Daily Attendance',
            icon: <TodayIcon />,
            view: <DailyAttendance />,
        },
        {
            label: 'Month Attendance',
            icon: <EventNoteIcon />,
            view: <MonthAttendance />,
        },
        {
            label: 'Monthly In Out',
            icon: <AccessTimeIcon />,
            view: <MonthlyInOutAttendance />,
        },
    ]
    return (
        <div className="h-screen overflow-hidden">
            <Navbar />
            <div className="sm:ml-64 h-screen pt-20 bg-gray-50">
                <TabsData data={tabsData} isVertical={true} />
            </div>
        </div>
    )
}
