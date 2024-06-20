import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App'
import { createRoot } from 'react-dom/client'
import SnackbarProvider from './Hook/useSnackbar'
import { store } from './Redux/store'

const rootElement = document.getElementById('root')

const root = createRoot(rootElement)

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <SnackbarProvider>
                <App />
            </SnackbarProvider>
        </Provider>
    </BrowserRouter>
)
