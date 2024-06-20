import * as React from 'react'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'

export default function MultiSelectData(props) {
    const { disabled, data, defaultValueData, onChange, placeholder } = props

    return (
        <Stack spacing={3}>
            <Autocomplete
                multiple
                size="small"
                options={data}
                disabled={disabled}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                    onChange(newValue)
                }}
                value={defaultValueData}
                renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
            />
        </Stack>
    )
}
