import './App.scss'

import { observer } from 'mobx-react-lite';

import { Routes, Route } from 'react-router-dom'

import { Header } from './components/Header/Header';
import { MapPage } from './pages/MapPage/MapPage';
import { StatementPage } from './pages/StatementPage/StatementPage';
import { Modal } from './components/Modal/Modal';

function App() {
    return (
        <>
            <Routes>
                <Route path={'/'} element={<Header />}>
                    <Route path={'/map/:x/:y/:z/'} element={<MapPage />}/>
                    <Route path={'/statement'} element={<StatementPage />}>
                        <Route path={'/statement/add'} element={<Modal />}/>
                        <Route path={'/statement/:id'} element={<Modal />}/>
                    </Route>
                    <Route path={'/*'} element={<></>}/>
                </Route>
            </Routes>
        </>
    )
}

export default observer(App);
