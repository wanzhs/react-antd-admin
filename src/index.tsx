import React from 'react'
import dva from 'dva'
import {BrowserRouter as Router, HashRouter} from 'react-router-dom'
import createLoading from 'dva-loading'
import {DraggableModalProvider as ModalProvider} from '@components/common/ant-design-draggable-modal'
import '@styles/sass/global.scss'
import 'react-placeholder/lib/reactPlaceholder.css'

import history from '@scripts/history'
import global from '@store/models/global'
import {RenderRouter, ThemeProvider} from '@components/common'
import {ReactRouterGlobalHistory} from '@components/common/GlobalHistory'
import {isMock} from "@root/src/config/config.constant";
// import registerServiceWorker from './registerServiceWorker'

const {isProd} = window.g_config
const app = dva({history})
export const ModeRouter: React.FC = ({children}) =>
    isProd ? <HashRouter>{children}</HashRouter> : <Router>{children}</Router>
isMock && require('./scripts/mock');
window.g_app = app
app.use(createLoading())
app.model(global)
app.router(props => {
    return (
        <ModeRouter>
            <ThemeProvider>
                <ModalProvider>
                    <ReactRouterGlobalHistory/>
                    <RenderRouter {...props} />
                </ModalProvider>
            </ThemeProvider>
        </ModeRouter>
    )
})
app.start('#root')

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
