import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import AddIcon from '@mui/icons-material/Add'
//Firebase
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../Config/FirebaseConfig'

//mui
import {
    Avatar,
    Button,
    FormControl,
    TextField,
    DialogActions,
    Tooltip,
    IconButton,
    Select,
    InputLabel,
    MenuItem,
    Radio,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Grid,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
//redux
import { PutEmployeeAsyncApi, getEmployeeByIdAsyncApi } from '../../../Redux/Employee/employeeSlice'
import { useSnackbar } from '../../../Hook/useSnackbar'
import { getDepartmentAsyncApi } from '../../../Redux/Department/DepartmentSlice'
import { getRoleAsyncApi } from '../../../Redux/Account/AccountSlice'
import NavbarManager from '../Navbar'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import General from './General'
import AllRequest from './AllRequest'
import TabsData from '../../../Components/Tabs'
import PopupData from '../../../Components/Popup'
import NavbarHR from '../NavbarHR'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', url: '/', status: true },
        { title: 'Employee', url: '/Employee', status: true },
        { title: 'Employee Detail', url: '/Employee', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

const tabsData = [
    {
        label: 'General',
        //icon: <AccountBoxIcon />,
        view: <General />,
    },
    {
        label: 'All Request',
        //icon: <KeyIcon />,
        view: <AllRequest />,
    },
    // {
    //     label: 'Time Entries',
    //     icon: <EventNoteIcon />,
    //     view: <TimeEntries />,
    // },
]

export default function EmployeeDetail() {
    const [userRole, setUserRole] = useState(() => {
        const userString = localStorage.getItem('role')
        const userObject = JSON.parse(userString)
        return userObject || 'defaultRole' // Provide a default role if undefined
    })
    let viewModalContent = <TabsData data={tabsData} />
    return (
        <div className="">

           {userRole === 'Manager' ? <NavbarManager /> : <NavbarHR />}
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
