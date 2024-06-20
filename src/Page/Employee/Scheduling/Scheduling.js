import React, { Fragment, useCallback, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'

import dayGridPlugin from '@fullcalendar/daygrid'
//date-picker-range
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
//mui
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
//icon

//component
import Navbar from '../Navbar'
import { formatDateExact } from '../../../Hook/useFormatDate'

//style
//style
import './Style.css'
import { useDispatch, useSelector } from 'react-redux'
import { GetWorkedSlotForPersonalAsyncApi } from '../../../Redux/WorkSlotEmployee/WorkSlotEmployeeSlice'

export default function Scheduling() {
    const [currentMonth, setCurrentMonth] = useState(null)
    const [currentData, setCurrentData] = useState([])

    //setting redux
    const { WorkedSlot, loading, WorkslotForPersonal } = useSelector((state) => state.WorkSlotEmployee)

    const dispatch = useDispatch()
    const userStringEmployeeName = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(userStringEmployeeName)
    useEffect(() => {
        if (currentMonth) {
            const timeout = setTimeout(() => {
                dispatch(
                    GetWorkedSlotForPersonalAsyncApi({
                        month: formatDateExact(currentMonth),
                        id: employeeId,
                    })
                )
                    .then((response) => {
                        if (response.meta.requestStatus === 'fulfilled') {
                        }
                    })
                    .catch((error) => {
                        // Xử lý lỗi nếu có
                    })
            }, 1500) // Chờ 1.5 giây trước khi dispatch action

            return () => clearTimeout(timeout)
        }
    }, [currentMonth])

    const calendarRef = React.createRef()

    const handleChangeMonth = (info) => {
        const startDate = info.view.currentStart
        const endDate = info.view.currentEnd
        const events = []

        //
        const firstDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
        const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)

        // Chuyển đổi định dạng ngày thành "yyyy/MM/dd"
        const formattedStartDate = firstDayOfMonth.toLocaleDateString('en-CA')
        const formattedDate = formattedStartDate.replace(/-/g, '/')

        // Hiển thị tháng hiện tại dưới dạng "yyyy/MM/dd"
        setCurrentMonth(formattedDate)
        for (let day = firstDayOfMonth.getDate(); day <= lastDayOfMonth.getDate(); day++) {
            const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), day)
            events.push({
                title: `Sự kiện tháng ${startDate.getMonth() + 1}`,
                start: eventDate,
                // Thêm các thuộc tính khác nếu cần
            })
        }

        setCurrentData(events)
    }

    const newEvents =
        loading == true
            ? currentData.map((item, index) => {
                  return {
                      start: item.start,
                      title: item.title,
                  }
              })
            : WorkslotForPersonal.map((item, index) => {
                  return {
                      start: item.date,
                      title: item.title,
                      time: item.startTime + ' ~ ' + item.endTime,
                      period: item.period,
                  }
              })

    function renderEventContent(eventInfo) {
        // Tùy chỉnh cách hiển thị sự kiện
        if (loading == true) {
            return (
                <div className="working-event flex items-center justify-center h-12 w-full">
                    <CircularProgress />
                </div>
            )
        } else {
            if (eventInfo.event.title === 'Not working') {
                return (
                    <div className="working-event text-black">
                        <b>{eventInfo.timeText}</b>
                        <div className="flex my-2 gap-2 bg-none items-center mx-auto ml-4">
                            <button className="rounded-full bg-gray-500 w-2 h-2"></button>
                            <p className=" ">{eventInfo.event.title}</p>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="text-black">
                        {eventInfo.event.title == 'Working' ? (
                            <div className="flex bg-blue-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto">
                                <p className="text-white">{eventInfo.event.extendedProps.time}</p>
                            </div>
                        ) : eventInfo.event.title == 'Overtime' ? (
                            <div className="flex bg-orange-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto ">
                                <p className="text-white">{eventInfo.event.extendedProps.time}</p>
                            </div>
                        ) : eventInfo.event.title == 'Public Holiday' ? (
                            <div className="flex bg-red-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto ">
                                <p className="text-white">{eventInfo.event.title}</p>
                            </div>
                        ) : eventInfo.event.title == 'Leave' ? (
                            <div className="flex bg-emerald-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto ">
                                <p className="text-white">
                                    {eventInfo.event.title} {eventInfo.event.extendedProps.period}
                                </p>
                            </div>
                        ) : (
                            <div className="flex bg-gray-500 p-2 rounded-md my-2 gap-2 bg-none items-center mx-auto ">
                                <p className="text-white">{eventInfo.event.title}</p>
                            </div>
                        )}
                    </div>
                )
            }
        }
    }
    return (
        <div>
            <Navbar />
            <div className="text-xl mb-5 sm:ml-64  pt-20 ">
                <div className="flex">
                    <div className="ml-4 flex  items-center gap-1">
                        <button className="h-6 w-6 bg-gray-500"></button> :<p>Non Working Date</p>
                    </div>
                    <div className="ml-4 flex  items-center gap-1">
                        <button className="h-6 w-6 bg-blue-500"></button> :<p>Working Date</p>
                    </div>
                    <div className="ml-4 flex  items-center gap-1">
                        <button className="h-6 w-6 bg-orange-500"></button> :<p>Overtime</p>
                    </div>
                    <div className="ml-4 flex  items-center gap-1">
                        <button className="h-6 w-6 bg-red-500"></button> :<p>Holiday</p>
                    </div>
                </div>
            </div>
            <div className="sm:ml-64 bg-gray-50">
                <div className="w-full py-8 px-5 bg-white relative ">
                    <div className="  xl:flex mb-2 w-full  absolute right-[200px] top-[32px]">
                        <div className="text-2xl font-bold sm:ml-64 ">Work Slot</div>
                    </div>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin]}
                        datesSet={handleChangeMonth}
                        initialView="dayGridMonth"
                        events={newEvents}
                        eventContent={renderEventContent}
                        headerToolbar={{
                            left: '',
                            center: 'title',
                            right: 'prev,next today',
                        }}
                        height="150vh"
                        daysOfWeek={(0, 1)}
                        DayGrid={true}
                        TimeGrid={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        daysHidden={[6, 5]}
                        editable={true}
                        droppable={true}
                        eventBackgroundColor={'#ffffff'}
                        eventBorderColor={'#ffffff'}
                        className="custom-calendar"
                    />
                </div>
            </div>
        </div>
    )
}
