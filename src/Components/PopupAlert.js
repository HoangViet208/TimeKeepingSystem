import * as React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" timeout={1000} ref={ref} {...props} />
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

export default function PopupAlert(props) {
    const { open, clickOpenFalse, onClose } = props

    const handleClose = () => {
        clickOpenFalse(false)
    }

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth="xs"
                TransitionComponent={Transition}
                PaperProps={{
                    style: {
                        marginTop: '', // Cách top 10px
                    },
                }}
            >
                <BootstrapDialogTitle className="text-gray-400" id="customized-dialog-title" onClose={handleClose}>
                    Delete Alert
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <h2 className="font-bold text-xl">This data cannot currently be deleted</h2>
                    <p className="mb-5 text-gray-400">
                        You can't delete because its status has been completed or rejected.
                    </p>
                </DialogContent>
                <DialogActions className="my-2">
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    )
}
