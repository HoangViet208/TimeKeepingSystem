import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Skeleton from '@mui/material/Skeleton'
export default function TableLoadData(props) {
    const { tableHeight, columns } = props
    const rows = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: tableHeight, minHeight: tableHeight }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns &&
                                columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                            minWidth: column.minWidth,
                                            width: column.maxWidth,
                                            background: 'rgb(229 231 235)',
                                            fontWeight: 'bold',
                                            fontFamily: 'Montserrat, sans-serif',
                                            textAlign: column.align,
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows &&
                            rows.map((row, index) => (
                                <TableRow role="checkbox" tabIndex={-1} key={index}>
                                    {columns &&
                                        columns.map((column) => {
                                            const value = row[column.id]
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <Skeleton animation="wave" />
                                                </TableCell>
                                            )
                                        })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
