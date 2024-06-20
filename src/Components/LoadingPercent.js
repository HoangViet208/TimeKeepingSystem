import { useEffect, useState } from 'react'
import { Box, Button, LinearProgress } from '@mui/material'
import { GetWorkedSlotByIdDepartmentApi } from '../Api/WorkSlotEmployeeApi'
import { GetWorkedTypeApi } from '../Api/WorkedApi'

/**
 * https://stackoverflow.com/questions/71745138/react-hook-not-updating-after-the-api-call
 */

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 65 }}>
                {`${Math.round(props.value)}%`}
                {/* <Text>
          <Typography variant="body2">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Text> */}
            </Box>
        </Box>
    )
}

const AppApi = {
    searchMany: (emails) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve([1, 2, 3, 4, 5, 6])
            }, 5000)
        }),
}

const emails = 'emails'

const sleep = (ms) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
export default function LinearWithValueLabel(props) {
    const { api } = props
    const [msgBox, setMsgBox] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(10)

    const onSearch = async () => {
        if (loading) {
            setLoading(true)
            const loopPromise = new Promise(async (resolve) => {
                for (let i = 2; i <= 99; i++) {
                    setProgress(i)
                    await sleep(50) // Đợi một chút trước khi tăng tiến trình
                }
                resolve()
            })

            // const apiPromise = GetWorkedSlotByIdDepartmentApi(
            //     'f45b85cf-b3c3-4375-a4e3-15704d2d4bc9',
            //     '2023/10/01',
            //     '2023/10/31'
            // )
            const apiPromise = await api()
            await Promise.all([loopPromise, apiPromise])
            await sleep(1000)
            setProgress(100)
            await sleep(1000)

            setLoading(false)
        }
    }

    useEffect(() => {
        onSearch()
    }, [loading])

    return (
        <Box>
            {loading ? (
                <LinearProgressWithLabel value={progress} />
            ) : (
                <Button onClick={() => setLoading(true)}>Run</Button>
            )}
        </Box>
    )
}
