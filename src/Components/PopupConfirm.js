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
import LoadingButton from '@mui/lab/LoadingButton';
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

export default function PopupConfirm(props) {
    const { open, clickOpenFalse, clickDelete, content, witdhModal, isError, viewContent, viewTitle, viewAction, isLoading } = props

    const handleClose = () => {
        clickOpenFalse(false)
    }

    const handledelete = () => {
        clickDelete()
    }

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open == true ? true : false}
                fullWidth
                maxWidth={witdhModal ? witdhModal : 'xs'}
                TransitionComponent={Transition}
                PaperProps={{
                    style: {
                        marginTop: '', // Cách top 10px
                    },
                }}
            >
                <BootstrapDialogTitle className="text-gray-400" id="customized-dialog-title" onClose={handleClose}>
                    {viewTitle ? viewTitle : 'Remove Confirm'}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {viewContent ? (
                        viewContent
                    ) : (
                        <React.Fragment>
                            <h2 className="font-bold text-xl">Are you sure to remove this ?</h2>
                            <p className="mb-5 text-gray-400">You can't undo this action once you removed this.</p>
                            {content}
                        </React.Fragment>
                    )}
                </DialogContent>
                <DialogActions className="my-2">
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        disabled={isError == true ? true : false}
                        loading={isLoading}
                        variant="contained"
                        color="error"
                        onClick={handledelete}
                    >
                        {viewAction ? viewAction : "Remove"}  
                    </LoadingButton>
                </DialogActions>
            </BootstrapDialog>
        </div>
    )
}
