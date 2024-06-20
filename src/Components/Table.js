import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

export default function TableData(props) {
    const { tableHeight, columns, rows, page, rowsPerPage, handleChangeRowsPerPage, handleChangePage, rowsPerPageOptions } = props

    const handleThisChangePage = (event, newPage) => {
        handleChangePage(newPage)
    }

    const handleThisChangeRowsPerPage = (event) => {
        handleChangeRowsPerPage(event)
    }

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
                        {rows && rows.length == 0 ? (
                            <TableRow className="w-full h-full mx-auto text-center text-lg">
                                <TableCell
                                    colSpan={columns.length}
                                    className="w-full text-center text-lg border-none"
                                    style={{ borderBottom: 'none' }}
                                >
                                    <img
                                        src="https://firebasestorage.googleapis.com/v0/b/carmanaager-upload-file.appspot.com/o/images%2Fdownload.svg2561bc28-0cfc-4d75-b183-00387dc91474?alt=media&token=cc09aed8-ccd7-4d8a-ba3c-0b4ace899f40"
                                        className="h-48 w-48 mx-auto "
                                    />
                                    <div className="mx-auto max-w-screen-sm text-center mt-8 mb-8 lg:mb-16">
                                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                            No Result
                                        </h2>
                                        <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
                                            There is no data yet or you can search for another value
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow role="checkbox" tabIndex={-1} key={index}>
                                    {columns &&
                                        columns.map((column) => {
                                            const value = row[column.id]
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'info' ? (
                                                        <React.Fragment>{value}</React.Fragment>
                                                    ) : (
                                                        <React.Fragment>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </React.Fragment>
                                                    )}
                                                </TableCell>
                                            )
                                        })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions ? rowsPerPageOptions :[10, 25, 100]}
                component="div"
                count={rows && rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleThisChangePage}
                onRowsPerPageChange={handleThisChangeRowsPerPage}
            />
        </Paper>
    )
}
