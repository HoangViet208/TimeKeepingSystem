import * as React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { Link } from 'react-router-dom'

function handleClick(event) {
    event.preventDefault()
    console.info('You clicked a breadcrumb.')
}

export default function IconBreadcrumbs(props) {
    const { data } = props
    return (
        <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
                {data &&
                    data.map((item, index) => {
                        return (
                            <div
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontWeight: item.title === false ? 'bold' : '',
                                }}
                                color="inherit"
                                className={`${
                                    item.status === false
                                        ? 'cursor-default'
                                        : 'cursor-pointer hover:underline hover:font-semibold'
                                }`}
                               // to={item.url}
                            >
                                {item.title}
                            </div>
                        )
                    })}
            </Breadcrumbs>
        </div>
    )
}
