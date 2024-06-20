import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'

//hook
import { useSnackbar } from '../../../Hook/useSnackbar'

//Firebase
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../Config/FirebaseConfig'

//Mui
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
    OutlinedInput,
    InputAdornment,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
//Icon
import VisibilityIcon from '@mui/icons-material/Visibility'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BadgeIcon from '@mui/icons-material/Badge'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import AddIcon from '@mui/icons-material/Add'

//Component
import Search from '../../../Components/Search'
import TableData from '../../../Components/Table'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import PopupData from '../../../Components/Popup'
import PopupConfirm from '../../../Components/PopupConfirm'

//reudex
import {
    DeleteEmployeeAsyncApi,
    PostEmployeeAsyncApi,
    PutEmployeeAsyncApi,
    getEmployeeAsyncApi,
} from '../../../Redux/Employee/employeeSlice'
import { PostAccountAsyncApi, getRoleAsyncApi } from '../../../Redux/Account/AccountSlice'
import { GetDepartmentWithoutAsyncApi, getDepartmentAsyncApi } from '../../../Redux/Department/DepartmentSlice'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { set } from 'date-fns';

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 200, align: 'left' },
    { id: 'info', label: 'Name', minWidth: 200, align: 'left' },
    { id: 'roleName', label: 'Role', minWidth: 100, align: 'left' },
    { id: 'departmentName', label: 'Team', minWidth: 250, align: 'left' },
    // { id: 'type', label: 'Type', minWidth: 250, align: 'left' },
    { id: 'status', label: 'Status', minWidth: 50, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Employee', icon: <BadgeIcon />, url: '/Employee', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()
export function generatePassword(length) {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numberChars = '0123456789'
    const specialChars = '!@#$'

    const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars

    let password = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length)
        password += allChars[randomIndex]
    }

    return password
}
export default function EmployeeAdmin() {
    const showSnackbar = useSnackbar()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(4)
    const [open, setOpen] = useState(false)
    const [openTeam, setOpenTeam] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [isAction, setIsAction] = useState(0)
    const [search, setSearch] = useState('')
    const [idDelete, setIdDelete] = useState()
    const [loadingButton, setLoadingButton] = useState(false)
    const [selectedImage, setSelectedImage] = useState()
    const [click, SetClick] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [arrTeam, setArrTeam] = useState([{ id: 1, email: '', team: [{ name: '', role: '' }] }])
    //setting redux

    const { RoleList } = useSelector((state) => state.account)
    const { EmployeeList } = useSelector((state) => state.employee)
    const { DepartmentWithoutList, DepartmentList } = useSelector((state) => state.department)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getEmployeeAsyncApi({ roleId: '', departmentId: '', name: search }))
        dispatch(GetDepartmentWithoutAsyncApi())
        dispatch(getDepartmentAsyncApi())
        dispatch(getRoleAsyncApi())
        return () => {}
    }, [search])
    
   
    const vietnamPhoneNumberRegex = /^(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;

    const initialValues = {
        id: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        address: '',
        phoneNumber: '',
        roleID: '',
        departmentID: '',
        deviceSerialNumber: ""
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            // password: Yup.string().required(),
            username: Yup.string().required('Username is required').email('Invalid email address'),
            firstName: Yup.string().min(2, 'Too Short!').max(4000, 'Too Long!').required('First Name is required'),
            lastName: Yup.string().min(2, 'Too Short!').max(4000, 'Too Long!').required('Last Name is required'),
            gender: Yup.string().required('Gender is required'),
            phoneNumber: Yup.string().required('Phone Number is required').matches(vietnamPhoneNumberRegex, 'Invalid phone number'),
            address: Yup.string().required('Address is required'),
          
        }),
        onSubmit: (values) => {
            if (isAction == 1) {
                setLoadingButton(true)
                let today = new Date()
                
                if(values.roleID == 'c4345666-4d7b-11ee-be56-0242ac120002' && values.departmentID == ''  || values.roleID == 'c43450f8-4d7b-11ee-be56-0242ac120002' && values.departmentID == '' ){
                    showSnackbar({
                        severity: 'error',
                        children: "Team is required",
                    })
                    setLoadingButton(false)
                    return ;
                }
                if (values.roleID == 'c4345940-4d7b-11ee-be56-0242ac120002') {
                    values.departmentID = 'd4a6ec67-3d4e-4e5c-8fe3-64d631f27ab0'
                }
                const newData = {
                    username: values.username,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    gender: values.gender == 'true' ? true : false,
                    address: values.address,
                    phoneNumber: values.phoneNumber,
                    roleID: values.roleID,
                    departmentID: values.departmentID == '' ? null : values.departmentID,
                    deviceSerialNumber: values.deviceSerialNumber
                }

                dispatch(PostAccountAsyncApi(newData))
                    .then((response) => {
                        if (response.meta.requestStatus == 'fulfilled') {
                            setLoadingButton(false)
                            setOpen(false)
                            setIsAction(0)
                            formik.setTouched({})
                            formik.setErrors({})
                            showSnackbar({
                                severity: 'success',
                                children: 'Add Employee successfully',
                            })
                            formik.setValues({
                                employeeId: '',
                                managerId: '',
                                name: '',
                                address: '',
                                gender: '',
                                email: '',
                                phoneNumber: '',
                                status: '',
                                hireDate: '',
                                avatar: '',
                                timeOffRemain: '',
                                employeesClassification: '',
                            })
                            dispatch(getEmployeeAsyncApi({ roleId: '', departmentId: '', name: search }))
                        }
                        if (response.meta.requestStatus == 'rejected') {
                            setLoadingButton(false)
                            console.log("res", response)
                            showSnackbar({
                                severity: 'error',
                                children: response.error.message,
                            })
                        } else {
                            setLoadingButton(false)
                        }
                    })
                    .catch((error) => {
                        setLoadingButton(false)
                    })
            } else if (isAction == 2) {
                const newData = {
                    username: values.id,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    gender: values.gender == 'true' ? true : false,
                    address: values.address,
                    phoneNumber: values.phoneNumber,
                    roleID: values.roleID,
                    deviceSerialNumber: values.deviceSerialNumber,
                    departmentID:
                        values.roleID == 'c4345666-4d7b-11ee-be56-0242ac120002' ||
                        values.roleID == 'c43450f8-4d7b-11ee-be56-0242ac120002'
                            ? values.departmentID
                            : values.departmentID == ''
                            ? null
                            : values.departmentID,
                }
                setLoadingButton(true)
                dispatch(PutEmployeeAsyncApi(values))
                    .then((response) => {
                        if (response.meta.requestStatus == 'fulfilled') {
                            setLoadingButton(false)
                            setOpen(false)
                            setIsAction(0)
                            formik.setTouched({})
                            formik.setErrors({})
                            showSnackbar({
                                severity: 'success',
                                children: 'Update Employee successfully',
                            })
                            formik.setValues({
                                employeeId: '',
                                managerId: '',
                                name: '',
                                address: '',
                                gender: '',
                                email: '',
                                phoneNumber: '',
                                status: '',
                                hireDate: '',
                                avatar: '',
                                timeOffRemain: '',
                                employeesClassification: '',
                            })
                            dispatch(getEmployeeAsyncApi({ roleId: '', departmentId: '', name: search }))
                        }
                    })
                    .catch((error) => {
                        setLoadingButton(false)
                    })
            }
        },
    })

    const handleChangePage = (newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }
    const callbackSearch = (childData) => {
        setSearch(childData)
    }
    const handleClickOpenAdd = () => {
        setOpen(true)
        setIsAction(1)
        formik.setValues({
            id: '',
            username: '',
            password: generatePassword(8),
            firstName: '',
            lastName: '',
            gender: '',
            address: '',
            phoneNumber: '',
            roleID: '',
            departmentID: '',
            deviceSerialNumber: ''
        })
    }
    const handleClickOpenAddTeam = () => {
        setOpenTeam(true)
        setIsAction(1)
    }

    const handleClickOpenUpdate = (data) => {
        setOpen(true)
        setIsAction(2)
        formik.setValues({
            id: data.id,
            username: data.email,
            password: '********',
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            address: data.address,
            phoneNumber: data.phoneNumber,
            roleID: data.roleId,
            departmentID: data.departmentId,
            deviceSerialNumber: data.deviceSerialNumber
        })
    }

    const clickOpenFalse = (event) => {
        setOpen(false)
        setIsAction(0)
        setShowPassword(false)
        formik.setTouched({})
        formik.setErrors({})
        formik.setValues({
            id: '',
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            gender: '',
            address: '',
            phoneNumber: '',
            roleID: '',
            departmentID: '',
            deviceSerialNumber:""
        })
    }
    const clickOpenFalseTeam = (event) => {
        setOpenTeam(false)
        setIsAction(0)
    }
    const handleClickOpenConfirm = (data) => {
        setOpenConfirm(true)
        setIdDelete(data)
    }
    const clickOpenFalseConfirm = (event) => {
        setOpenConfirm(false)
    }
    const handleClickSave = () => {
        setOpen(false)
    }
    const handleAddNewUserTeam = () => {
        const newArrayList = [...arrTeam]
        const newDataList = { id: arrTeam.length + 1, email: '', team: [{ name: '', role: '' }] }
        newArrayList.push(newDataList)
        setArrTeam(newArrayList)
    }
    const handleDeleteNewUserTeam = (data) => {
        if (arrTeam.length > 1) {
            const newArrayList = [...arrTeam]
            newArrayList.splice(data, 1)
            setArrTeam(newArrayList)
        }
    }
    const handleDelete = () => {
        setLoadingButton(true)
        dispatch(DeleteEmployeeAsyncApi(idDelete))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    setOpenConfirm(false)
                    setLoadingButton(false)
                    setIsAction(0)
                    showSnackbar({
                        severity: 'success',
                        children: 'Delete Employee successfully',
                    })
                    dispatch(getEmployeeAsyncApi({ roleId: '', departmentId: '', name: search }))
                }
            })
            .catch((error) => {
                setLoadingButton(false)
            })
    }
    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }
 console.log("formik.errors.deviceSerialNumber", formik.errors.deviceSerialNumber)
    const viewModalContent = (
        <Fragment>
            <form onSubmit={formik.handleSubmit}>
                <div className=" gap-5 py-4 px-8 mb-5 lg:my-0">
                    <div className={`my-2   `}>
                        <TextField
                            id="outlined-basic"
                            size="small"
                            error={formik.touched.username && formik.errors.username ? true : undefined}
                            className={`w-full `}
                            value={formik.values.username}
                            name="username"
                            label={
                                <div className="mb-1 flex gap-1">
                                    <p className=" text-gray-500">Username</p> <i className="text-red-500">*</i>
                                </div>
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            variant="outlined"
                        />
                        {formik.errors.username && formik.touched.username && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.username}</div>
                        )}
                    </div>
                    <div className="my-2">
                        <FormControl
                            error={formik.touched.password && formik.errors.password ? true : undefined}
                            className="w-full"
                            variant="outlined"
                        >
                            <InputLabel size="small" htmlFor="outlined-adornment-password">
                                Password
                            </InputLabel>
                            <OutlinedInput
                                size="small"
                                id="outlined-basic"
                                error={formik.touched.password && formik.errors.password ? true : undefined}
                                className="w-full"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                name="password"
                                label="password"
                                readOnly
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        {formik.errors.password && formik.touched.password && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.password}</div>
                        )}
                    </div>
                    <div className={`my-2`}>
                    <TextField
                                id="outlined-basic"
                                size="small"
                                error={formik.touched.deviceSerialNumber && formik.errors.deviceSerialNumber ? true : undefined}
                                className="w-full"
                                value={formik.values.deviceSerialNumber}
                                name="deviceSerialNumber"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label={
                                    <div className="mb-1 flex gap-1">
                                        <p className=" text-gray-500">Firebase Installation ID</p> <i className="text-red-500">*</i>
                                    </div>
                                }
                                variant="outlined"
                            />
                            {formik.errors.deviceSerialNumber && formik.touched.deviceSerialNumber && (
                                <div className="text mt-1 text-red-600 font-semibold">{formik.errors.deviceSerialNumber}</div>
                            )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 my-2">
                        <div>
                            <TextField
                                id="outlined-basic"
                                size="small"
                                error={formik.touched.firstName && formik.errors.firstName ? true : undefined}
                                className="w-full"
                                value={formik.values.firstName}
                                name="firstName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label={
                                    <div className="mb-1 flex gap-1">
                                        <p className=" text-gray-500">First name</p> <i className="text-red-500">*</i>
                                    </div>
                                }
                                variant="outlined"
                            />
                            {formik.errors.firstName && formik.touched.firstName && (
                                <div className="text mt-1 text-red-600 font-semibold">{formik.errors.firstName}</div>
                            )}
                        </div>
                        <div>
                            <TextField
                                id="outlined-basic"
                                size="small"
                                error={formik.touched.lastName && formik.errors.lastName ? true : undefined}
                                className="w-full"
                                value={formik.values.lastName}
                                name="lastName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label={
                                    <div className="mb-1 flex gap-1">
                                        <p className=" text-gray-500">Last Name</p> <i className="text-red-500">*</i>
                                    </div>
                                }
                                variant="outlined"
                            />
                            {formik.errors.lastName && formik.touched.lastName && (
                                <div className="text mt-1 text-red-600 font-semibold">{formik.errors.lastName}</div>
                            )}
                        </div>
                    </div>

                    <div className="my-2">
                        <TextField
                            id="outlined-basic"
                            size="small"
                            error={formik.touched.address && formik.errors.address ? true : undefined}
                            className="w-full"
                            value={formik.values.address}
                            name="address"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label={
                                <div className="mb-1 flex gap-1">
                                    <p className=" text-gray-500">Address</p> <i className="text-red-500">*</i>
                                </div>
                            }
                            variant="outlined"
                        />
                        {formik.errors.address && formik.touched.address && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.address}</div>
                        )}
                    </div>
                    <div className="my-2">
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">
                                <div className="mb-1 flex gap-1">
                                    <p className=" text-gray-500">Gender</p> <i className="text-red-500">*</i>
                                </div>
                            </FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                error={formik.touched.gender && formik.errors.gender ? true : undefined}
                                className="w-full"
                                value={formik.values.gender}
                                name="gender"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <FormControlLabel value={true} control={<Radio />} label="Female" />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel value={false} control={<Radio />} label="Male" />
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                        </FormControl>

                        {formik.errors.gender && formik.touched.gender && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.gender}</div>
                        )}
                    </div>
                    <div className="my-2">
                        <TextField
                            id="outlined-basic"
                            size="small"
                            error={formik.touched.phoneNumber && formik.errors.phoneNumber ? true : undefined}
                            className="w-full"
                            value={formik.values.phoneNumber}
                            name="phoneNumber"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label={
                                <div className="mb-1 flex gap-1">
                                    <p className=" text-gray-500">Phone number</p> <i className="text-red-500">*</i>
                                </div>
                            }
                            variant="outlined"
                        />
                        {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.phoneNumber}</div>
                        )}
                    </div>
                    <div className="my-2">
                        <FormControl fullWidth>
                            <InputLabel size="small" id="demo-simple-select-label">
                                <div className="mb-1 flex gap-1">
                                    <p className=" text-gray-500">Role</p> <i className="text-red-500">*</i>
                                </div>
                            </InputLabel>
                            <Select
                                id="outlined-basic"
                                size="small"
                                error={formik.touched.roleID && formik.errors.roleID ? true : undefined}
                                className="w-full"
                                value={formik.values.roleID}
                                name="roleID"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label={'role *'}
                                variant="outlined"
                            >
                                {RoleList.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        {formik.errors.roleID && formik.touched.roleID && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.roleID}</div>
                        )}
                    </div>

                    <div
                        className={` ${
                            formik.values.roleID == 'c43450f8-4d7b-11ee-be56-0242ac120002'
                                ? `my-2`
                                : formik.values.roleID == 'c4345666-4d7b-11ee-be56-0242ac120002'
                                ? `my-2`
                                : `hidden invisible`
                        }`}
                    >
                        <FormControl fullWidth>
                            <InputLabel size="small" id="demo-simple-select-label">
                                Team
                            </InputLabel>
                            <Select
                                id="outlined-basic"
                                size="small"
                                disabled={
                                    formik.values.roleID == 'c4345666-4d7b-11ee-be56-0242ac120002' && isAction == 2
                                        ? true
                                        : false
                                }
                                error={formik.touched.departmentID && formik.errors.departmentID ? true : undefined}
                                className="w-full"
                                value={formik.values.departmentID}
                                name="departmentID"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Team"
                                variant="outlined"
                            >
                                {formik.values.roleID == 'c43450f8-4d7b-11ee-be56-0242ac120002' || isAction == 2
                                    ? DepartmentList.map((item, index) => {
                                          return (
                                              <MenuItem key={index} value={item.id}>
                                                  {item.name}
                                              </MenuItem>
                                          )
                                      })
                                    : DepartmentWithoutList.map((item, index) => {
                                          return (
                                              <MenuItem key={index} value={item.id}>
                                                  {item.name}
                                              </MenuItem>
                                          )
                                      })}
                            </Select>
                        </FormControl>
                        {formik.errors.departmentID && formik.touched.departmentID && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.departmentID}</div>
                        )}
                    </div>
                </div>

                <DialogActions>
                    <div className="flex gap-5">
                        <Button variant="contained" color="inherit" autoFocus onClick={handleClickSave}>
                            Cancel
                        </Button>
                        <LoadingButton
                            startIcon={<AddIcon />}
                            type="submit"
                            loading={loadingButton}
                            loadingPosition="start"
                            color="info"
                            variant="contained"
                            sx={{
                                textAlign: 'center',
                            }}
                            autoFocus
                        >
                            Save changes
                        </LoadingButton>
                    </div>
                </DialogActions>
            </form>
        </Fragment>
    )
    const viewModalTeamContent = (
        <Fragment>
            <div className=" py-4 px-8 mb-5 lg:my-0">
                {arrTeam.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <div className="flex gap-5 items-center">
                                <FormControl className="w-96">
                                    <InputLabel size="small" id="demo-simple-select-label">
                                        Email
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        size="small"
                                        className="w-full"
                                        value={item.email}
                                        name="email"
                                        onChange={(e) => {
                                            const updatedDataList = [...arrTeam]
                                            updatedDataList[index].email = e.target.value
                                            setArrTeam(updatedDataList)
                                        }}
                                        label="Email"
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                                {item.team.map((data, index1) => {
                                    return (
                                        <Fragment key={index1}>
                                            <FormControl className="w-40">
                                                <InputLabel size="small" id="demo-simple-select-label">
                                                    Role
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    size="small"
                                                    className="w-full"
                                                    value={data.role}
                                                    onChange={(e) => {
                                                        const updatedDataList = [...arrTeam]
                                                        updatedDataList[index].team[index1].role = e.target.value
                                                        setArrTeam(updatedDataList)
                                                    }}
                                                    name="role"
                                                    label="Role"
                                                >
                                                    <MenuItem value={10}>Ten</MenuItem>
                                                    <MenuItem value={20}>Twenty</MenuItem>
                                                    <MenuItem value={30}>Thirty</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControl className="w-72">
                                                <InputLabel size="small" id="demo-simple-select-label">
                                                    Team
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    size="small"
                                                    className="w-full"
                                                    value={data.name}
                                                    name="team"
                                                    onChange={(e) => {
                                                        const updatedDataList = [...arrTeam]
                                                        updatedDataList[index].team[index1].name = e.target.value
                                                        setArrTeam(updatedDataList)
                                                    }}
                                                    label="Team"
                                                >
                                                    <MenuItem value={10}>Ten</MenuItem>
                                                    <MenuItem value={20}>Twenty</MenuItem>
                                                    <MenuItem value={30}>Thirty</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Fragment>
                                    )
                                })}
                                <button
                                    onClick={(e) => handleDeleteNewUserTeam(index)}
                                    className={arrTeam.length < 2 ? 'text-gray-400 cursor-default' : 'text-red-400'}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                            <hr className="my-6" />
                        </Fragment>
                    )
                })}
                <button onClick={handleAddNewUserTeam} className="flex gap-2 hover:underline cursor-pointer">
                    <AddIcon className="text-blue-400" /> <h2 className="text-blue-400">Add new User</h2>{' '}
                </button>
                <hr className="my-6" />
                <div className="grid text-sm">
                    <div className="">
                        <p className="mx-1">Team Member</p>
                        is a person who you want to be monitored
                    </div>
                    <div className="">
                        <p className="mx-1">Team Manager</p>
                        Manage employees' working time and holidays
                    </div>
                    <div className="">
                        <p className="mx-1">Team Manager HR</p>
                        can see their team members' tracking data in website
                    </div>
                    <div className="">
                        <p className="mx-1">Admin</p>
                        has the control of everything from adding a member, creating a team, seeing the tracking data
                    </div>
                </div>
            </div>
            <DialogActions>
                <div className="flex gap-5">
                    <Button variant="contained" color="inherit" autoFocus onClick={handleClickSave}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" autoFocus>
                        Save changes
                    </Button>
                </div>
            </DialogActions>
        </Fragment>
    )
    const createRows = () => {
        return EmployeeList.map((item, index) => ({
            ...item,
            email: (
                <button className="flex items-center gap-2 border-[1px] rounded-full py-2 px-3">
                    <EmailIcon className="w-8 h-8" />
                    {item.email}
                </button>
            ),
            // address: item.address.length > 20 ? item.address.slice(0, 35) + '...' : item.address,
            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.firstName + ' ' + item.lastName}</p>
                </div>
            ),
            status: <button className="bg-green-300 text-green-600 font-semibold py-1 px-2 rounded-xl">Active</button>,
            number: index + 1,
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip onClick={() => handleClickOpenUpdate(item)} title="View Detail">
                        <IconButton>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip onClick={() => handleClickOpenConfirm(item.id)} title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
            gender: item.gender === 'Female' ? <FemaleIcon /> : <MaleIcon />,
        }))
    }
    const rows = createRows()
    return (
        <div>
            <Navbar />
            <PopupConfirm
                open={openConfirm}
                clickOpenFalse={clickOpenFalseConfirm}
                clickDelete={handleDelete}
                isLoading={loadingButton}
            />
            <PopupData
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle={isAction == 1 ? 'Add Employee' : isAction == 2 ? 'Update Employee' : ''}
                viewContent={viewModalContent}
            />
            <PopupData
                size={'md'}
                open={openTeam}
                clickOpenFalse={clickOpenFalseTeam}
                viewTitle={isAction == 1 ? 'Add Member to the team' : isAction == 2 ? 'Update Member to the team' : ''}
                viewContent={viewModalTeamContent}
            />
            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Employee List </h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                        <div className="ml-auto flex gap-5 uppercase">
                            {/* <Button
                                onClick={handleClickOpenAddTeam}
                                startIcon={<AddIcon />}
                                variant="contained"
                                color="success"
                                className=""
                            >
                                Add Member to the Team
                            </Button> */}
                            <Button
                                onClick={handleClickOpenAdd}
                                startIcon={<AddIcon />}
                                variant="contained"
                                color="primary"
                                className=""
                            >
                                Add New Employee
                            </Button>
                        </div>
                    </div>
                    <div className="bg-white p-4">
                        <div className="mb-5 flex items-center">
                            <Search size="small" parentCallback={callbackSearch} />
                            <div className="ml-auto md:mr-16 mr-4"></div>
                        </div>
                        <div>
                            <TableData
                                tableHeight={400}
                                rowsPerPageOptions={[4, 25, 50]}
                                rows={rows}
                                columns={columns}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
