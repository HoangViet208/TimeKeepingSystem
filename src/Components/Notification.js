import * as React from 'react'
import { Tooltip, IconButton, Avatar, Menu, Divider, MenuItem, Typography, Button, Skeleton, Box } from '@mui/material'
import { useState } from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { formatDate, getTimeAgo } from '../Hook/useFormatDate'
import { Link } from 'react-router-dom'
import { ApplyLeaveAction } from '../Redux/ApplyLeave/ApplyLeaveSlice'
import { useDispatch } from 'react-redux'
import { OvertimeAction } from '../Redux/Overtime/OvertimeSlice'
import { WorkedAction } from '../Redux/Worked/WorkedSlice'

function getIconByType(type) {
    switch (type) {
        case 'Leave':
            return <InsertChartOutlinedIcon style={{ width: '48px', height: '48px' }} />
        case 'Overtime':
            return <AddToPhotosIcon style={{ width: '48px', height: '48px' }} />
        case 'Work Time':
            return <CalendarMonthIcon style={{ width: '48px', height: '48px' }} />
        default:
            return null
    }
}

function getLinkByType(role, type, id) {
    switch (type) {
        case 'Leave':
            return role == 'Manager' ? `/Manager/ManageLeave` : role == 'HR' ? '/Hr/AllRequest' : '/Employee/ApplyLeave'
        case 'Overtime':
            return role == 'Manager'
                ? '/Manager/ManageOvertime'
                : role == 'HR'
                ? '/Hr/AllRequest'
                : '/Employee/Overtime'
        case 'Work Time':
            return role == 'Manager' ? '/Manager/ManageWorked' : role == 'HR' ? '/Hr/AllRequest' : '/Employee/Worked'
        default:
            return null
    }
}

const dataList = [
    {
        id: 1,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2024-04-08T07:09:31.6056975',
        isSee: true,
    },
    {
        id: 2,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2024-03-08T07:09:31.6056975',
        isSee: true,
    },
    {
        id: 3,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2024-01-09T07:09:31.6056975',
        isSee: false,
    },
    {
        id: 4,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2022-02-08T07:09:31.6056975',
        isSee: false,
    },
    {
        id: 5,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2024-03-09T07:09:31.6056975',
        isSee: false,
    },
    {
        id: 6,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2024-03-09T07:09:31.6056975',
        isSee: false,
    },
    {
        id: 7,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2024-03-09T07:09:31.6056975',
        isSee: false,
    },
    {
        id: 8,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2024-03-09T07:09:31.6056975',
        isSee: false,
    },
    {
        id: 9,
        name: 'Việt',
        status: 'Accept',
        type: 'Request Leave',
        fromDate: '2024-03-20T00:00:00',
        toDate: '2024-03-20T00:00:00',
        submitedDate: '2024-03-09T07:09:31.6056975',
        isSee: false,
    },
]
const dataLoading = [{}, {}, {}, {}, {}]
export default function NotificationComponent(props) {
    const { isLoading, dataNotification, role, UpdateIsSeenToTrue } = props

    let lengthIsSeen = dataNotification ? dataNotification.filter((obj) => obj.isSeen == false).length : 0
    const [isSeeAll, setIsSeeAll] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClickChangeSeeAll = (event) => {
        setIsSeeAll(true)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const dispatch = useDispatch()
    const handleChange = (newValue) => {
        UpdateIsSeenToTrue(newValue)
        setAnchorEl(null)

        newValue.requestType == 'Overtime'
            ? dispatch(OvertimeAction.changeRequestId(newValue.requestId))
            : newValue.requestType == 'Work Time'
            ? dispatch(WorkedAction.changeRequestId(newValue.requestId))
            : dispatch(ApplyLeaveAction.changeRequestId(newValue.requestId))
    }

    return (
        <div className="relative">
            {lengthIsSeen > 0 ? (
                <div className="rounded-full bg-red-500 h-5 w-5 absolute text-[14px] flex items-center justify-center z-10 -right-1">
                    {lengthIsSeen}
                </div>
            ) : (
                ''
            )}

            <div>
                <Tooltip title="Notifications">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            <NotificationsIcon />
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </div>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        '& .MuiMenuItem-root:hover': {
                            backgroundColor: '#e5e7eb', // Màu nền khi hover
                        },
                    },
                }}
            >
                <div className="w-96 px-2  cursor-default">
                    <div className="p-2">
                        <h2 className=" font-bold text-2xl">Notifications</h2>
                    </div>
                    <div className="flex px-2 mb-2 font-semibold">
                        <div className="">New</div>
                        {/* <div className='ml-auto text-blue-300 p-1 rounded-md hover:bg-gray-300'>See All</div> */}
                    </div>
                    {isLoading == true
                        ? dataLoading.map((item, index) => {
                              return (
                                  <div key={index} className="grid grid-cols-5 w-full p-2">
                                      <div className="flex ">
                                          <Skeleton variant="circular" width={48} height={48} />
                                      </div>
                                      <Box width="100%" className="col-span-4 mt-[10px]">
                                          <Skeleton variant="text" width="100%" />
                                      </Box>
                                  </div>
                              )
                          })
                        : dataNotification &&
                          dataNotification.map((item, index) => {
                              if (!isSeeAll && index >= 5) {
                                  return null
                              }
                              return (
                                  <MenuItem
                                      key={index}
                                      style={{
                                          marginBottom: '10px',
                                          borderLeft: item.isSeen == false ? '2px solid #3b82f6' : 'none',
                                      }}
                                  >
                                      <Link
                                          to={{
                                              pathname: getLinkByType(role, item.requestType, item.requestId),
                                          }}
                                          className="grid grid-cols-5"
                                          onClick={() => handleChange(item)}
                                      >
                                          <div className="flex">{getIconByType(item.requestType)}</div>
                                          <Typography
                                              variant="inherit"
                                              style={{ whiteSpace: 'normal' }}
                                              className="col-span-4"
                                          >
                                              {role == 'Manager' ? (
                                                  <>
                                                      {' '}
                                                      <strong> {item.employeeSenderName} </strong> <em>(Employee) </em>
                                                      has send{' '}
                                                  </>
                                              ) : (
                                                  <>
                                                      {' '}
                                                      <strong> {item.employeeDeciderName} </strong> <em>(Manager) </em>
                                                      has {item.status} your{' '}
                                                  </>
                                              )}
                                              Request {item.requestType}
                                              {/* {item.requestType === 'Overtime'
                                                  ? ' on ' +
                                                    formatDate(item.fromDate) +
                                                    ' from ' +
                                                    item.fromHour +
                                                    'h' +
                                                    ' to ' +
                                                    item.toHour +
                                                    'h'
                                                  : item.requestType === 'Leave'
                                                  ? ' from ' +
                                                    formatDate(item.fromDate) +
                                                    ' to ' +
                                                    formatDate(item.toDate)
                                                  : ''} */}
                                              <br />
                                              <span
                                                  className={
                                                      item.isSeen === false
                                                          ? 'text-blue-500 text-[12px]'
                                                          : 'text-[12px] text-gray-500'
                                                  }
                                              >
                                                  {getTimeAgo(item.actionDate)}
                                              </span>
                                          </Typography>
                                      </Link>
                                  </MenuItem>
                              )
                          })}
                    {isSeeAll == false && dataNotification.length > 5 ? (
                        <div className="p-2 ">
                            <Button
                                variant="contained"
                                color="inherit"
                                sx={{
                                    width: '100%',
                                    background: '#d1d5db',
                                    '&:hover': {
                                        backgroundColor: '#e5e7eb', // Màu hover mong muốn
                                    },
                                    textTransform: 'none',
                                }}
                                onClick={handleClickChangeSeeAll}
                            >
                                See previous Notifications
                            </Button>
                        </div>
                    ) : (
                        ``
                    )}
                </div>
            </Menu>
        </div>
    )
}
