import React, { useState, useEffect, useRef } from 'react'
import ReactApexChart from 'react-apexcharts'

const LineChart = (props) => {
    const { data } = props
    const [loading, setLoading] = useState(true)
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: 'basic-line',
            },
            xaxis: {
                categories: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ],
            },
        },
        series: [
            {
                data: data,
            },
        ],
    })

    useEffect(() => {
        setLoading(true) // hiển thị loading
        setChartData((prevState) => ({
            ...prevState,
            series: data,
        }))
    }, [data])

    useEffect(() => {
        if (loading) {
            setLoading(false) // ẩn loading khi dữ liệu sẵn sàng
        }
    }, [loading])

    return (
        <>
            {loading ? (
                <p>Loading...</p> // hiển thị thông báo đợi tải
            ) : (
                <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={400} />
            )}
        </>
    )
}

export default LineChart
