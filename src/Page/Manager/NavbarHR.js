import React, { useEffect, useState } from 'react'
import AssessmentIcon from '@mui/icons-material/Assessment'
import BadgeIcon from '@mui/icons-material/Badge'
import LogoutIcon from '@mui/icons-material/Logout'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip } from '@mui/material'
import Settings from '@mui/icons-material/Settings'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import { Link, NavLink } from 'react-router-dom'
import TuneIcon from '@mui/icons-material/Tune'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import EventNoteIcon from '@mui/icons-material/EventNote'
import KeyIcon from '@mui/icons-material/Key'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import General from './EmployeeDetail/General'
import ChangePassword from './Profile/ChangePassword'
import TabsData from '../../Components/Tabs'
import PopupData from '../../Components/Popup'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TodayIcon from '@mui/icons-material/Today'
import TopicIcon from '@mui/icons-material/Topic';
import { getDatabase, ref, onValue, set } from 'firebase/database'
import app from '../../Config/FirebaseConfig'
import NotificationComponent from '../../Components/Notification'
import GeneralModal from './EmployeeDetail/GeneralModal'
const tabsData = [
    {
        label: 'General',
        icon: <AccountBoxIcon />,
        view: <GeneralModal />,
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
export default function NavbarHR() {
    const [openModal, setOpenModal] = useState(false)
    const clickOpenFalse = (event) => {
        setOpenModal(false)
    }
    const handleClickOpenAdd = () => {
        setOpenModal(true)
    }
    const [anchorEl, setAnchorEl] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const open = Boolean(anchorEl)
    const userStringRole = localStorage.getItem('role')
    const role = JSON.parse(userStringRole)
    const userStringAvatar = localStorage.getItem('avatar')
    const avatar = JSON.parse(userStringAvatar)
    const userStringEmployeeName = localStorage.getItem('employeeName')
    const employeeName = JSON.parse(userStringEmployeeName)
    const userString = localStorage.getItem('role')
    const userObject = JSON.parse(userString)

    const employeeIdString = localStorage.getItem('employeeId')
    const employeeId = JSON.parse(employeeIdString)
  
    useEffect(() => {
     
        if (userObject && userObject == 'Manager') {
            history.push('/Manager/Employee')
        } else if (userObject && userObject == 'Employee') {
            history.push('/Employee/Dashboard')
        } else if (userObject && userObject == 'HR') {
        } else if (userObject && userObject == 'Admin') {
            history.push('/Admin/Team')
        } else {
            history.push('')
        }
        fetchDataFromDatabase()
    }, [])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    let history = useHistory()
    const handleCloseOut = () => {
        setAnchorEl(null)
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        localStorage.removeItem('employeeId')
        history.push('/')
    }

    const handleModalOpen = () => {
        setIsModalOpen(!isModalOpen)
    }
    const [isLoading, setIsLoading] = useState(false)
    const [dataNotification, setDataNotification] = useState([])


    const fetchDataFromDatabase = () => {
        setIsLoading(true)
        const db = getDatabase(app)
        const dbRef = ref(db, 'employeeNoti')

        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                setIsLoading(false)
                const data = Object.entries(snapshot.val()).map(([id, value]) => {
                   if (value.employeeSenderId == employeeId) {
                        return { id, ...value };
                    }
                    return null; 
                }).filter(item => item !== null);
                setDataNotification(data)
            } else {
                setIsLoading(false)
            }
        })
    }
     function UpdateIsSeenToTrue(newValue) {

        const db = getDatabase() // Lấy tham chiếu đến database
        const recordRef = ref(db, `employeeNoti/${newValue.id}`) // Tham chiếu đến bản ghi cụ thể bằng id

        set(recordRef, { ...newValue, isSeen: true })
            .then(() => {
            })
            .catch((error) => {
            })
    }
    const handleModalClose = () => {
        setIsModalOpen(false)
    }
    const handleClickOut = (event) => {
        // Check if the click event target is not inside the modal content (the modal itself)
        if (!event.target.closest('.bg-white')) {
            handleModalClose() // Close the modal when clicking outside
        }
    }
    let MobiUi = (
        <>
            <div onClick={handleClickOut} className="fixed  top-0 left-0 z-40 w-full h-full flex  bg-overlay">
                <div className="bg-white w-48 mt-12 rounded-lg  h-screen overflow-y-auto dark:bg-gray-800">
                    <button
                        onClick={handleModalClose}
                        type="button"
                        data-drawer-hide="drawer-navigation"
                        aria-controls="drawer-navigation"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Close menu</span>
                    </button>
                    <ul className="space-y-2 font-medium cursor-pointer">
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/Scheduling"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <TodayIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Worked Time</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/AllRequest"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <TopicIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">All Request</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/Employee"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <BadgeIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Employee</span>
                            </Link>
                        </li>
                        {/* <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/WorkedTime"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <TodayIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Worked Time</span>
                            </Link>
                        </li> */}
                        {/* <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/ManageLeave"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <AssessmentIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Employee</span>
                            </Link>
                        </li> */}
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/ManageLeave"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <InsertChartOutlinedIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Manage Leave</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/ManageOvertime"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <AddToPhotosIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Manage Overtime</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/ManageWorked"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <CalendarMonthIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Manage Worked</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/ManageHoliday"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <LocationSearchingIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Manage Holiday</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/Workslot"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <EventNoteIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Work Slot</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/Timesheet"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <EventAvailableIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Time Sheet</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/TrackSettings"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <TuneIcon className="rotate-90 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Track Settings</span>
                            </Link>
                        </li>
                        <li className="cursor-pointer p-2">
                            <Link
                                to="/Hr/"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <LogoutIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="flex-1 ml-3 whitespace-nowrap">Log out</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
    let viewModalContent = <TabsData data={tabsData} />
    return (
        <div>
            <PopupData
                size={'lg'}
                viewTitle="Profile"
                open={openModal}
                clickOpenFalse={clickOpenFalse}
                viewContent={viewModalContent}
            />
            {isModalOpen && MobiUi}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-1 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <button
                                onClick={handleModalOpen}
                                data-drawer-target="logo-sidebar"
                                data-drawer-toggle="logo-sidebar"
                                aria-controls="logo-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                    ></path>
                                </svg>
                            </button>
                            <Link to="/Hr/ManageLeave" className="flex ml-2 md:mr-24 cursor-pointer">
                                <img
                                    src="https://t4.ftcdn.net/jpg/03/14/20/15/360_F_314201503_drLthBSHdqSBwBOGo8AHreHIGnfLEUJi.jpg"
                                    className="h-10 mr-3"
                                    alt="FlowBite Logo"
                                />
                                <span className="self-center text-lg font-semibold sm:text-xl whitespace-nowrap dark:text-white">
                                    Time Keeping
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center ">
                        <NotificationComponent
                                role={userObject}
                                isLoading={isLoading}
                                dataNotification={dataNotification}
                                UpdateIsSeenToTrue={UpdateIsSeenToTrue}
                            />
                            <div>
                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 1 }}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar sx={{ width: 32, height: 32 }}>{avatar && avatar.charAt(0)}</Avatar>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <div className=" px-5 py-2 cursor-default w-64">
                                    <p>
                                        {employeeName && employeeName} <strong>({role && role})</strong>
                                    </p>
                                </div>
                                <hr className="mb-2" />

                                <MenuItem onClick={handleClickOpenAdd}>
                                    <Avatar /> Profile
                                </MenuItem>
                                <Divider />

                                <MenuItem onClick={handleCloseOut}>
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </nav>

            <aside
                id="logo-sidebar"
                className=" fixed top-0 left-0 z-40 w-64 h-screen pt-12 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li className="m-4">
                            <button
                                onClick={handleClickOpenAdd}
                                className="flex gap-5 bg-gray-100 py-3 px-4 rounded-xl w-full"
                            >
                                <div className="w-full text-center">
                                    <strong>{employeeName && employeeName}</strong>
                                    <div className="mx-auto text-center">({role && role})</div>
                                </div>
                            </button>
                        </li>
                        {/* <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <Link
                                to="/Hr/"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                            >
                                <DashboardIcon className=" ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3 text-lg">Dashboard</span>
                            </Link>
                        </li> */}
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/WorkedTime"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <TodayIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Worked Time</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/AllRequest"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <TopicIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">All Request</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/Employee"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <BadgeIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Employee</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/ManageLeave"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <InsertChartOutlinedIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Manage Leave</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/ManageOvertime"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <AddToPhotosIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Manage Overtime</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/ManageWorked"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <CalendarMonthIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Manage Worked</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/ManageHoliday"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <LocationSearchingIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Manage Holiday</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/Workslot"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <EventNoteIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Work Slot</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/TimeSheet"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <EventAvailableIcon className="ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Time Sheet</span>
                            </NavLink>
                        </li>
                        <li className="cursor-pointer text-center mx-auto justify-center items-center">
                            <NavLink
                                to="/Hr/TrackSettings"
                                className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700 group"
                                activeStyle={{
                                    background: '#dbeafe',
                                }}
                            >
                                <TuneIcon className="rotate-90 ml-7 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 " />
                                <span className="ml-3">Track Settings</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}
