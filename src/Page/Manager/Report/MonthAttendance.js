import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { parse } from 'date-fns'

//mui
import { Stack, TextField, Button } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

//Icon
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

//component
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import { formatDateToMonth } from '../../../Hook/useFormatDate'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Month Attendance', icon: <BadgeIcon />, url: '/Report', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function MonthAttendance() {
    const [days, setDays] = useState(null)

    const handleRentFromChange = (newValue) => {
        formik.setFieldValue('startTime', newValue)
        setDays(formatDateToMonth(newValue))
    }
    const initialValues = {
        startTime: null, // Lấy ngày đầu tiên của tháng hiện tại
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object().shape({
            startTime: Yup.string().required(),
        }),
        onSubmit: async (values, { setSubmitting }) => {},
    })

    return (
        <div className="flex-1 ">
            <div className="px-12 py-6">
                <h2 className="font-bold text-3xl mb-4">Month Attendance</h2>
                <div className="mb-8 font-semibold">
                    <IconBreadcrumbs data={dataBreadcrumbs} />
                </div>
                <div className="bg-white p-4">
                    <div className="mb-5 flex items-center">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                label="Month"
                                size="small"
                                openTo="month"
                                views={['year', 'month']}
                                value={formik.values.startTime}
                                inputFormat="DD/MM/YYYY "
                                onChange={handleRentFromChange}
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
                        <div className="ml-auto flex items-center gap-4 mr-4">
                            <Button variant="contained" startIcon={<FileDownloadIcon />}>
                                Export
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto min-h-[550px]">
                        <table className={`${days && 'w-screen'} border-collapse`}>
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="border-[1px] font-medium text-left text-gray-500 px-2 py-4 min-w-[256px]">
                                        Employees
                                    </th>
                                    <th className="border-[1px] font-medium text-center text-gray-500 px-2 py-4 min-w-[100px]">
                                        Working Days
                                    </th>
                                    <th className="border-[1px] font-medium text-center text-gray-500 px-2 py-4 min-w-[120px]">
                                        Non Working Days
                                    </th>
                                    {days &&
                                        days.map((item, index) => (
                                            <th
                                                key={index}
                                                className="border-[1px] font-medium text-center text-gray-500 px-2 py-4 min-w-[150px]"
                                            >
                                                {index + 1}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="h-[50px]">
                                    <td className="border-[1px] font-medium text-left text-gray-500 px-2 py-2 min-w-[256px]">
                                        Đạt
                                    </td>
                                    <td className="border-[1px] font-medium text-center text-gray-500 px-2 py-2 min-w-[100px]">
                                        0
                                    </td>
                                    <td className="border-[1px] font-medium text-center text-gray-500 px-2 py-2 min-w-[120px]">
                                        22
                                    </td>
                                    {days &&
                                        days.map((item, index) => (
                                            <td
                                                key={index}
                                                className="border-[1px]  text-center text-gray-500 px-2 py-2 min-w-[150px]"
                                            >
                                                Non working day
                                            </td>
                                        ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
