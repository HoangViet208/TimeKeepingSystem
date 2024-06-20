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
import {
    DeleteDepartmentAsyncApi,
    PostDepartmentAsyncApi,
    PutDepartmentAsyncApi,
    PutTeamMemberAsyncApi,
    getDepartmentAsyncApi,
    getDepartmentByIdAsyncApi,
} from '../../../Redux/Department/DepartmentSlice'
import { GetALLEmployeeNotIncludeInAnyTeamAsyncApi, getEmployeeAsyncApi } from '../../../Redux/Employee/employeeSlice'
import { DeleteDepartmentApi } from '../../../Api/DepartmentApi'

//reudex

const columns = [
    { id: 'number', label: 'Number', minWidth: 50, align: 'center' },
    { id: 'info', label: 'Name', minWidth: 200, align: 'left' },
    { id: 'manager', label: 'Manager', minWidth: 200, align: 'center' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'center' },
]
const columnsModal = [
    { id: 'number', label: 'Number', minWidth: 50, maxWidth: 50, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 100, maxWidth: 200, align: 'left' },
    { id: 'role', label: 'Role', minWidth: 100, maxWidth: 200, align: 'left' },
    { id: 'info', label: 'Name', minWidth: 100, maxWidth: 200, align: 'left' },
    { id: 'action', label: 'Actions', minWidth: 50, align: 'left' },
    // { id: 'manager', label: 'Manager', minWidth: 200, align: 'center' },
]

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', icon: <DashboardIcon />, url: '/', status: true },
        { title: 'Team', icon: <BadgeIcon />, url: '/team', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

export default function Team() {
    const [loadingButton, setLoadingButton] = useState(false)

    const showSnackbar = useSnackbar()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [pageModal, setPageModal] = useState(0)
    const [rowsPerPageModal, setRowsPerPageModal] = useState(10)
    const [open, setOpen] = useState(false)
    const [openTeam, setOpenTeam] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [isAction, setIsAction] = useState(0)
    const [search, setSearch] = useState('')
    const [idDelete, setIdDelete] = useState()
    const [selectedImage, setSelectedImage] = useState()
    const [click, SetClick] = useState(false)
    const [arrTeam, setArrTeam] = useState([{ id: 1, email: '', team: [{ name: '', role: '' }] }])
    //setting redux
    const { EmployeeList, EmployeeNotTeam } = useSelector((state) => state.employee)
    const { DepartmentList, DepartmentDetail } = useSelector((state) => state.department)
    const [teamData, setTeamData] = useState([])
    const [EmployeeNotIncludeInAnyTeam, setEmployeeNotIncludeInAnyTeam] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getDepartmentAsyncApi())
        dispatch(GetALLEmployeeNotIncludeInAnyTeamAsyncApi()).then((res) => {
            if (res.meta.requestStatus == 'fulfilled') {
                setEmployeeNotIncludeInAnyTeam(res.payload)
            }
        })
        return () => {}
    }, [openConfirm])
    const initialValues = {
        name: '',
        managerName: '',
        id: '',
        workTrackId: '',
        isDeleted: true,
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            name: Yup.string().min(5, 'Too Short!').max(4000, 'Too Long!').required(),
            //   managerName: Yup.string().min(5, 'Too Short!').max(4000, 'Too Long!').required(),
        }),
        onSubmit: (values) => {
            setLoadingButton(true)
            if (isAction == 1) {
                setLoadingButton(true)
                const body = {
                    //   managerId: values.managerName,
                    name: values.name,
                }
                dispatch(PostDepartmentAsyncApi(body))
                    .then((response) => {
                        console.log("f", response)
                        if (response.meta.requestStatus == 'fulfilled') {
                            setLoadingButton(false)

                            dispatch(getDepartmentAsyncApi())
                            showSnackbar({
                                severity: 'success',
                                children: 'Add successfully',
                            })
                            setOpen(false)
                            setIsAction(0)
                            setIdDelete()
                            formik.setTouched({})
                            formik.setErrors({})
                            formik.setValues({
                                name: '',
                                managerName: '',
                            })
                        }else{
                            setLoadingButton(false)
                            showSnackbar({
                                severity: 'error',
                                children: response.error.message,
                            })
                        }
                    })
                    .catch((error) => {
                        setLoadingButton(false)
                    })
            } else if (isAction == 2) {
                setLoadingButton(true)

                const newTeamData = teamData
                    .filter((member) => member.id !== '') // Lọc ra các đối tượng có id khác rỗng
                    .map((member) => ({
                        employeeId: member.id,
                        roleName: member.roleName,
                    }))
                const body = {
                    departmentId: values.id,
                    departmentName: values.name,
                    team: newTeamData,
                }
                dispatch(PutTeamMemberAsyncApi(body))
                    .then((response) => {
                        if (response.meta.requestStatus == 'fulfilled') {
                            dispatch(getDepartmentAsyncApi())
                            setLoadingButton(false)
                            dispatch(GetALLEmployeeNotIncludeInAnyTeamAsyncApi())
                            showSnackbar({
                                severity: 'success',
                                children: 'Update successfully',
                            })
                            setOpen(false)
                            setIsAction(0)
                            setIdDelete()
                            formik.setTouched({})
                            formik.setErrors({})
                            formik.setValues({
                                name: '',
                                managerName: '',
                            })
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
    const handleChangePageModal = (newPage) => {
        setPageModal(newPage)
    }
    const handleChangeRowsPerPageModal = (event) => {
        setRowsPerPageModal(+event.target.value)
        setPageModal(0)
    }
    const callbackSearch = (childData) => {
        setSearch(childData)
    }
    const handleClickOpenAdd = () => {
        setOpen(true)
        setIsAction(1)
    }
    const handleClickOpenAddTeam = () => {
        setOpenTeam(true)
        setIsAction(1)
    }

    const handleClickOpenUpdate = (data) => {
        setOpen(true)
        setIsAction(2)
        dispatch(getDepartmentByIdAsyncApi(data.id))
            .then((response) => {
                const updatedData = response.payload.map((item) => ({
                    ...item,
                    isNew: false,
                }))
                setTeamData(updatedData)
            })
            .catch((error) => {
                console.error('Error fetching team data:', error)
            })
        formik.setValues({
            name: data.name,
            managerName: data.managerId,
            id: data.id,
            workTrackId: data.workTrackId,
            isDeleted: data.isDeleted,
        })
    }

    const clickOpenFalse = (event) => {
        setEmployeeNotIncludeInAnyTeam(EmployeeNotTeam)
        setOpen(false)
        setIsAction(0)
        setIdDelete()
        formik.setTouched({})
        formik.setErrors({})
        formik.setValues({
            name: '',
            managerName: '',
        })
    }

    const handleClickOpenConfirm = (data) => {
        setOpenConfirm(true)
        setIdDelete(data)
    }

    const clickOpenFalseConfirm = (event) => {
        setOpenConfirm(false)
        setIdDelete()
    }
    const handleClickSave = () => {
        setOpen(false)
    }

    const handleDelete = () => {
        setLoadingButton(true)
        dispatch(DeleteDepartmentAsyncApi(idDelete))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    dispatch(getDepartmentAsyncApi())
                    showSnackbar({
                        severity: 'success',
                        children: 'Delete Successfully',
                    })
                    setOpen(false)
                    setIsAction(0)
                    setLoadingButton(false)
                    setOpenConfirm(false)
                    setIdDelete()
                    formik.setTouched({})
                    formik.setErrors({})
                    formik.setValues({
                        name: '',
                        managerName: '',
                    })
                }
            })
            .catch((error) => {
                setLoadingButton(false)
            })
    }
    const handleChangeMemberInTeam = (employeeId, index) => {
        const employee = EmployeeNotIncludeInAnyTeam.find((emp) => emp.id === employeeId)
        if (employee) {
            const updatedDataList = [...teamData]
            updatedDataList[index].firstName = employee.firstName
            updatedDataList[index].lastName = employee.lastName
            updatedDataList[index].email = employee.email
            updatedDataList[index].id = employee.id
            setTeamData(updatedDataList)
        }
    }

    const handleChangeRoleMemberInTeam = (index, data) => {
        const updatedDataList = [...teamData]
        if (data === 'Manager') {
            updatedDataList.forEach((item, i) => {
                if (i !== index) {
                    item.roleName = 'Employee'
                }
            })
            updatedDataList[index].roleName = data
        } else {
            updatedDataList[index].roleName = data
        }
        setTeamData(updatedDataList)
    }

    const handleClickDeleteMemberInTeam = (data, index) => {
        const updatedDataList = [...teamData]
        updatedDataList.splice(index, 1)
        setTeamData(updatedDataList)
    }

    const handleClickAddMemberInTeam = () => {
        const isNewExists = teamData.some((item) => item.id == '')
        const hasTrueIsNew = teamData.some((obj) => obj.isNew === true)
        if (!isNewExists) {
            if (hasTrueIsNew) {
                const updateTeam = [...teamData]
                const lastIndex = updateTeam.length - 1
                updateTeam[lastIndex].isNew = false
                setTeamData(updateTeam)
            }
            const updatedEmployeeList = [...EmployeeNotIncludeInAnyTeam]
            const filteredEmployeeNotIncludeInAnyTeam = updatedEmployeeList.filter((employee) => {
                return !teamData.some((teamMember) => teamMember.email === employee.email)
            })
            setEmployeeNotIncludeInAnyTeam(filteredEmployeeNotIncludeInAnyTeam)

            const updatedDataList = [...teamData]
            updatedDataList.push({
                id: '',
                email: '',
                roleName: 'Employee',
                firstName: '',
                lastName: '',
                isNew: true,
            })
            setTeamData(updatedDataList)
        }
    }
    const createRowsModal = () => {
        // const filteredEmployeeNotIncludeInAnyTeam = EmployeeNotIncludeInAnyTeam.filter(employee => {
        //     // Kiểm tra xem trường email của nhân viên có tồn tại trong teamData không
        //     return !teamData.some(teamMember => teamMember.email === employee.email);
        // });
        return teamData.map((item, index) => ({
            ...item,

            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <p className="font-bold">{item.firstName + ' ' + item.lastName}</p>
                </div>
            ),
            email:
                item.isNew == false ? (
                    item.email
                ) : (
                    <FormControl fullWidth>
                        <InputLabel size="small" id="demo-simple-select-label">
                            Employee
                        </InputLabel>
                        <Select
                            size="small"
                            className="w-full"
                            value={item.id} // Sử dụng employeeId làm value
                            label="Employee"
                            onChange={(e) => handleChangeMemberInTeam(e.target.value, index)}
                            variant="outlined"
                        >
                            {EmployeeNotIncludeInAnyTeam.map((employee, index) => {
                                return (
                                    <MenuItem key={index} value={employee.id}>
                                        {employee.email}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                ),
            number: index + 1,
            role:
                formik.values.name == 'Team HR' ? (
                    item.roleName
                ) : (
                    <FormControl fullWidth>
                        <InputLabel size="small" id="demo-simple-select-label">
                            Role Name
                        </InputLabel>
                        <Select
                            size="small"
                            className="w-full"
                            value={item.roleName}
                            label="Role Name"
                            onChange={(e) => handleChangeRoleMemberInTeam(index, e.target.value)}
                            variant="outlined"
                        >
                            <MenuItem value="Manager">Manager</MenuItem>
                            <MenuItem value="Employee">Employee</MenuItem>
                        </Select>
                    </FormControl>
                ),
            action: (
                <div className="flex gap-2 justify-center">
                    <Tooltip onClick={() => handleClickDeleteMemberInTeam(item.id, index)} title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }))
    }

    const rowsModal = createRowsModal()
    const viewModalContent = (
        <Fragment>
            <form onSubmit={formik.handleSubmit}>
                <div className=" gap-5 py-4 px-8 mb-5 lg:my-0">
                    {isAction == 2 && formik.values.name !== 'Team HR' && (
                        <Button onClick={handleClickAddMemberInTeam} variant="contained" color="success">
                            Add Employee
                        </Button>
                    )}
                    <div className="mb-2 mt-4">
                        <TextField
                            size="small"
                            error={formik.touched.name && formik.errors.name ? true : undefined}
                            className="w-full"
                            value={formik.values.name}
                            name="name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label={
                                <div className="mb-1 flex gap-1">
                                    <p className=" text-gray-500">Name</p> <i className="text-red-500">*</i>
                                </div>
                            }
                            variant="outlined"
                        />
                        {formik.errors.name && formik.touched.name && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.name}</div>
                        )}
                    </div>
                    {isAction == 2 && (
                        <TableData
                            tableHeight={400}
                            rows={rowsModal}
                            columns={columnsModal}
                            page={pageModal}
                            rowsPerPageOptions={[5, 25, 50]}
                            rowsPerPage={rowsPerPageModal}
                            handleChangePage={handleChangePageModal}
                            handleChangeRowsPerPage={handleChangeRowsPerPageModal}
                        />
                    )}
                    {/* <div className="my-2">
                        <FormControl fullWidth>
                            <InputLabel size="small" id="demo-simple-select-label">
                                Manager
                            </InputLabel>
                            <Select
                                size="small"
                                error={formik.touched.managerName && formik.errors.managerName ? true : undefined}
                                className="w-full"
                                value={formik.values.managerName}
                                name="managerName"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Manager"
                                variant="outlined"
                            >
                                {EmployeeList.map((item, index) => {
                                    return (
                                        <MenuItem key={index} value={item.id}>
                                            {item.firstName} {item.lastName}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        {formik.errors.managerName && formik.touched.managerName && (
                            <div className="text mt-1 text-red-600 font-semibold">{formik.errors.managerName}</div>
                        )}
                    </div> */}
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

    const createRows = () => {
        const dataTeam = [
            { name: 'It', descripion: ' vay do' },
            { name: 'Design', descripion: ' vay do' },
        ]
        return DepartmentList.map((item, index) => ({
            ...item,
            manager: item.managerName,
            info: (
                <div className="flex gap-2 items-center ">
                    {' '}
                    {/* Added the class 'align-center' for centering */}
                    <Avatar src={item.name} alt={item.name} style={{ width: 40, height: 40 }} />
                    <p className="font-bold">{item.name}</p>
                </div>
            ),
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
                viewTitle={isAction == 1 ? 'Add Team' : isAction == 2 ? 'Update Team' : ''}
                viewContent={viewModalContent}
                size="md"
            />

            <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
                <div className="px-12 py-6">
                    <h2 className="font-bold text-3xl mb-4"> Team List </h2>
                    <div className="w-full mb-8 flex font-semibold items-center">
                        <IconBreadcrumbs data={dataBreadcrumbs} />
                        <div className="ml-auto flex gap-5 uppercase">
                            <Button
                                onClick={handleClickOpenAdd}
                                startIcon={<AddIcon />}
                                variant="contained"
                                color="primary"
                                className=""
                            >
                                Add New Team
                            </Button>
                        </div>
                    </div>
                    <div className="bg-white p-4">
                        <div className="flex items-center">
                            {/* <Search parentCallback={callbackSearch} /> */}
                            <div className="ml-auto md:mr-16 mr-4"></div>
                        </div>
                        <div>
                            <TableData
                                tableHeight={460}
                                rowsPerPageOptions={[10, 25, 50]}
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
