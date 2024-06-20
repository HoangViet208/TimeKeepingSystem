import React, { useEffect, useState, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { loginAsyncApi } from '../../Redux/Account/AccountSlice'
import { LoadingButton } from '@mui/lab'

function Login() {
    const buttonRef = useRef(null)
    const [showPassword, setShowPassword] = React.useState(false)
    const [username, setUsername] = React.useState()
    const [loadingButton, setLoadingButton] = useState(false)
    const [password, setPassword] = React.useState()
    const [error, setError] = React.useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }
    const userString = localStorage.getItem('role')
    const userObject = JSON.parse(userString)
    useEffect(() => {
        if (userObject && userObject == 'Manager') {
            history.push('/Manager/Employee')
        }
        if (userObject && userObject == 'Employee') {
            history.push('/Employee/Dashboard')
        }
        if (userObject && userObject == 'HR') {
            history.push('/Hr/Employee')
        }
        if (userObject && userObject == 'Admin') {
            history.push('/Admin/Team')
        }
    }, [])
    const dispatch = useDispatch()
    let history = useHistory()
    const handleSubmit = () => {
        setLoadingButton(true)
        if (username == '' || password == '') {
            setError('Email or password not null')
            setLoadingButton(false)
        }
        dispatch(
            loginAsyncApi({
                email: username,
                password: password,
            })
        ).then((response) => {
            if (response.payload.statusCode == 409) {
                setError(response.payload.message)
                setLoadingButton(false)
            } else if (response.payload.statusCode == 200) {
                setError()
                localStorage.setItem('user', JSON.stringify(response.payload.data))
                localStorage.setItem('role', JSON.stringify(response.payload.role))
                localStorage.setItem('employeeId', JSON.stringify(response.payload.employeeId))
                localStorage.setItem('employeeName', JSON.stringify(response.payload.employeeName))
                localStorage.setItem('avatar', JSON.stringify(response.payload.avatar))
                if (response.payload.role == 'Employee') {
                    history.push('/Employee/Dashboard')
                } else if (response.payload.role == 'Manager') {
                    history.push('/Manager/Employee')
                } else if (response.payload.role == 'HR') {
                    history.push('/Hr/Employee')
                } else if (response.payload.role == 'Admin') {
                    history.push('/Admin/Team')
                }
                setLoadingButton(false)
            }
        }).catch((err) => {
            setError()
            setLoadingButton(false)
        })
    }
    // history.push('/Employee')
    // const userString = localStorage.getItem("user");
    // const userObject = JSON.parse(userString);
    // useEffect(() => {

    //   if (userObject && userObject.role == "admin") {
    //     navigate("/admin")
    //   }
    //   if (userObject && userObject.role == "sale") {
    //     navigate("/product")
    //   }
    //   if (userObject && userObject.role == "cashier") {
    //     navigate("/SettingCashier")
    //   }

    // }, []);

    //const { user } = useSelector((state) => state.login)
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: async (values, formikHelpers) => {
            history.push('/Employee')
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Please Enter your Username'),
            password: Yup.string().required('Please Enter your Password'),
        }),
    })
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault() // Ngăn chặn hành động mặc định của phím Enter (ví dụ như submit form)
            buttonRef.current.focus() // Tập trung vào nút button
        }
    }

    return (
        <div className="md:grid grid-cols-2 h-full bg-gray-50">
            <div className=" hidden md:flex justify-center items-center m-12">
                <div className="mx-auto  md:shadow-2xl h-2/3 md:border-[1px]  rounded-2xl ">
                    <img
                        src="https://www.softactivity.com/wp-content/uploads/Employee-Time-Tracking-1400.jpg?fbclid=IwAR0XE9c9ARxM-7LdxPdl-pN0JAVXmeEzCVYsfAKbP8sJhTyMBN8t4x-9T4M"
                        alt="Ảnh"
                    />
                </div>
            </div>
            <section className="bg-gray-50 dark:bg-gray-900 ">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to Time Keeping System
                            </h1>

                            {error && <p className="text-red-500 font-bold text-center text-xl">{error}</p>}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Your email
                                </label>
                                <input
                                    //type="email"
                                    onKeyDown={handleKeyPress}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com"
                                    required=""
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <input
                                    onKeyDown={handleKeyPress}
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required=""
                                />
                            </div>
                            {/* <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                            required=""
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <Link
                                    to="/"
                                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Forgot password?
                                </Link>
                            </div> */}
                            <LoadingButton
                                ref={buttonRef}
                                onClick={handleSubmit}
                                loading={loadingButton}
                                variant="contained"
                                color="primary"
                                sx={{
                                    textAlign: 'center',
                                }}
                                autoFocus
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Sign in
                            </LoadingButton>
                            {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet?{' '}
                                <Link
                                    to="/"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Sign up
                                </Link>
                            </p> */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login
