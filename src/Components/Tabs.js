import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import SwipeableViews from 'react-swipeable-views'
import { useDispatch } from 'react-redux'
import { ApplyLeaveAction } from '../Redux/ApplyLeave/ApplyLeaveSlice'
import { OvertimeAction } from '../Redux/Overtime/OvertimeSlice'
import { WorkedAction } from '../Redux/Worked/WorkedSlice'

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    }
}

export default function TabsData(props) {
    const theme = useTheme()
    const { data, isVertical, changeTab } = props
    const [value, setValue] = React.useState(0)
    const dispatch = useDispatch()
    const handleChange = (event, newValue) => {
        setValue(newValue)
        changeTab == "OverTime" ?  dispatch(OvertimeAction.ChangeTab(newValue)) : changeTab == "Leave" ?  dispatch(ApplyLeaveAction.ChangeTab(newValue))
       : dispatch(WorkedAction.ChangeTab(newValue))
    }
    const handleChangeIndex = (index) => {
        setValue(index)
    }
    return (
        <Box
            className={isVertical == true ? 'flex-grow flex h-full w-full' : 'bg-white'}
            sx={{
                display: isVertical ? 'grid' : 'initial',
                gridTemplateColumns: isVertical ? 'auto 1fr' : 'auto',
            }}
        >
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="full width tabs example"
                className={`${isVertical == true ? 'bg-white' : ''}`}
                sx={isVertical == true ? { borderRight: 1, borderColor: '#d1d5db', flexShrink: 0 } : { borderRight: 0 }}
                orientation={isVertical == true ? 'vertical' : 'horizontal'}
                TabIndicatorProps={
                    isVertical == true
                        ? {
                              style: {},
                          }
                        : {}
                }
            >
                {data &&
                    data.map((item, index) => {
                        return (
                            <Tab
                                icon={item.icon}
                                iconPosition="start"
                                key={index}
                                label={
                                    <div
                                        style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
                                    >
                                        {item.label}
                                    </div>
                                }
                                {...a11yProps(index)}
                            />
                        )
                    })}
            </Tabs>

            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {data &&
                    data.map((item, index) => {
                        return (
                            <div
                                key={index}
                                role="tabpanel"
                                hidden={value !== index}
                                id={`tabpanel-${index}`}
                                aria-labelledby={`tab-${index}`}
                            >
                                {item.view}
                            </div>
                        )
                    })}
            </SwipeableViews>
        </Box>
    )
}
