import * as React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />
})

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}))

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    )
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
}

export default function PopupData(props) {
    const { open, clickOpenFalse, viewContent, viewTitle, viewAction, size } = props

    const handleClose = () => {
        clickOpenFalse(false)
    }

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open == true ? true : false}
                TransitionComponent={Transition}
                fullWidth
                maxWidth={size}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <p className="font-semibold text-gray-700">{viewTitle}</p>
                </BootstrapDialogTitle>
                <DialogContent dividers>{viewContent}</DialogContent>
                {viewAction && <DialogActions>{viewAction}</DialogActions>}
            </BootstrapDialog>
        </div>
    )
}
