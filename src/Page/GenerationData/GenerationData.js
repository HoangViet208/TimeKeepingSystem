import React, { useEffect, useState } from 'react'
//mui
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    DialogActions,
    Autocomplete,
    TextField,
    InputLabel,
    Stack,
} from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import { useDispatch, useSelector } from 'react-redux'
import { getDepartmentAsyncApi } from '../../Redux/Department/DepartmentSlice'
import LinearWithValueLabel from '../../Components/LoadingPercent'
import { GetWorkedTypeApi } from '../../Api/WorkedApi'
import { GetWorkedSlotByIdDepartmentApi } from '../../Api/WorkSlotEmployeeApi'
import { PostGenerationDataCheckInApi, PostGenerationDataEmployeeApi } from '../../Api/FakeDataApi'
import { formattedDate } from '../../Hook/useFormatDate'
import PopupData from '../../Components/Popup'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import dayjs from 'dayjs'
import {
    PostGenerationDataCheckInAsyncApi,
    PostGenerationDataEmployeeAsyncApi,
} from '../../Redux/FakeData/fakeDataSlice'
function GenerationData() {
    const [Department, setDepartment] = useState('')
    //setting redux
    const { DepartmentList } = useSelector((state) => state.department)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getDepartmentAsyncApi())

        return () => {}
    }, [])
    const handleChangeDepartment = (event) => {
        setDepartment(event.target.value)
    }
    const handleClickSaveCheckIn = () => {}
    const { format, parse } = require('date-fns')
    const [open, setOpen] = useState()
    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })

    const clickOpenFalse = (event) => {
        setOpen(false)
        setSelectedDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        })
    }
    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClickSave = () => {
        setOpen(false)
    }
    const handleDateRangeChange = (ranges) => {
        setSelectedDateRange(ranges.selection)
    }
    const viewModalContent = (
        <DateRangePicker ranges={[selectedDateRange]} onChange={handleDateRangeChange} minDate={new Date()} />
    )
    const viewModalAction = (
        <Button autoFocus onClick={handleClickSave}>
            Save changes
        </Button>
    )
    const data = [
        {
            title: 'Generation CheckIn all Employee for Department',
            button: (
                <Button variant="contained" className="float-right right-8" autoFocus onClick={handleClickSaveCheckIn}>
                    Run
                </Button>
            ),
            view: (
                <>
                    <PopupData
                        open={open}
                        clickOpenFalse={clickOpenFalse}
                        viewTitle="Pick Date"
                        viewContent={viewModalContent}
                        viewAction={viewModalAction}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={handleClickOpen}
                            variant="outlined"
                            sx={{
                                color: 'black',
                                borderColor: '#f3f4f6',
                                borderRadius: '200px',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    color: '#2196f3',
                                },
                            }}
                            startIcon={<EventAvailableIcon />}
                        >
                            {selectedDateRange.startDate.getTime() == selectedDateRange.endDate.getTime()
                                ? formattedDate(selectedDateRange.startDate)
                                : formattedDate(selectedDateRange.startDate) +
                                  ' - ' +
                                  formattedDate(selectedDateRange.endDate)}
                        </Button>
                    </Stack>
                    <div className=" my-5 mx-4">
                        <LinearWithValueLabel
                            api={() =>
                                dispatch(
                                    PostGenerationDataCheckInAsyncApi({
                                        id: Department,
                                        std: format(selectedDateRange.startDate, 'yyyy/MM/dd'),
                                        end: format(selectedDateRange.endDate, 'yyyy/MM/dd'),
                                    })
                                )
                            }
                        />
                    </div>
                </>
            ),
        },
        {
            title: 'Generation 5 Employee for Department',
            button: (
                <Button variant="contained" className="float-right right-8" autoFocus onClick={handleClickSaveCheckIn}>
                    Run
                </Button>
            ),
            view: (
                <>
                    <div className=" my-5 mx-4">
                        <LinearWithValueLabel api={() => dispatch(PostGenerationDataEmployeeAsyncApi(Department))} />
                    </div>
                </>
            ),
        },
    ]
    return (
        <div className="bg-gray-50 h-full">
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <button
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
                            <div className="flex ml-2 md:mr-24 cursor-pointer">
                                <img
                                    src="https://t4.ftcdn.net/jpg/03/14/20/15/360_F_314201503_drLthBSHdqSBwBOGo8AHreHIGnfLEUJi.jpg"
                                    className="h-12 mr-3"
                                    alt="FlowBite Logo"
                                />
                                <span className="self-center text-lg font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    Time Keeping
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="pt-[72px]"></div>
            <div className=" container mx-auto  bg-white mt-[32px] h-32 grid grid-cols-4 gap-5 p-5">
                <div className="">
                    <FormControl sx={{ width: 300, marginBottom: 4 }}>
                        <InputLabel size="small" id="demo-simple-select-label">
                            Department
                        </InputLabel>
                        <Select
                            size="small"
                            className="bg-white"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={Department}
                            label="Department"
                            onChange={handleChangeDepartment}
                        >
                            {DepartmentList.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 container mx-auto pt-10">
                {data.map((item, index) => {
                    return (
                        <div key={index} className="bg-white border-[1px] rounded-md p-2 h-40  w-full">
                            <h2 className="font-bold text-xl text-center my-2">{item.title}</h2>
                            <hr className="my-2" />
                            <>{item.view}</>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default GenerationData
