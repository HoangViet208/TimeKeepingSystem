import React, { useEffect } from 'react'

//mui
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

//icon
import VisibilityIcon from '@mui/icons-material/Visibility'

//component
import TableData from '../../../Components/Table'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTimeEntrieByIdAsyncApi } from '../../../Redux/TimeEntries/timeEntriesSlice'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { calculateDuration, formatDate } from '../../../Hook/useFormatDate'

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'date', label: 'Date', minWidth: 200, align: 'left' },
    { id: 'startTime', label: 'Start time', minWidth: 200, align: 'center' },
    { id: 'stopTime', label: 'Stop time', minWidth: 250, align: 'center' },
    { id: 'duration', label: 'Duration', minWidth: 100, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'center' },
]

export default function TimeEntries() {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const param = useParams()
    const { TimeEntriesDetail } = useSelector((state) => state.timeEntries)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getTimeEntrieByIdAsyncApi(param.id))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                }
            })
            .catch((error) => {
                // Handle failure case
            })
        return () => {}
    }, [])
    const handleChangePage = (newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const createRows = () => {
        const data = [
            {
                date: '01/07/2023',
                startTime: '7:00',
                stopTime: '5:30',
                duration: '8:00',
                status: 'Working',
            },
            {
                date: '02/07/2023',
                startTime: '7:00',
                stopTime: '5:30',
                duration: '8:00',
                status: 'Working',
            },
            { date: '03/07/2023', startTime: '0', stopTime: '0', duration: '0', status: 'Not Working' },
        ]

        return (
            data &&
            data.map((item, index) => ({
                ...item,
                number: index + 1,
                date: formatDate(item.date),
                startTime: item.clockInTime,
                stopTime: item.clockOutTime,
                duration: calculateDuration(item.clockInTime, item.clockOutTime),
                status: item.workClassification,
                action: (
                    <Tooltip title="View Detail">
                        <IconButton>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                ),
            }))
        )
    }
    const rows = createRows()
    return (
        <div className="bg-white h-[600px] p-4 ">
            <div className="">
                <LocalizationProvider size="small" dateAdapter={AdapterDayjs}>
                    <DatePicker
                        variant="inline"
                        size="small"
                        openTo="month"
                        views={['year', 'month']}
                        label="Month"
                        helperText="Start from year selection"
                    />
                </LocalizationProvider>
            </div>
            <div className="mt-5">
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
    )
}
