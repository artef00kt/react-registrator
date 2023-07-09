import styles from './StatementPage.module.scss';

import { useState, useContext, useEffect } from 'react';

import { useNavigate, Outlet } from 'react-router-dom';

import { Card } from '../../components/Card/Card'

import { Context } from '../../main';

export function StatementPage() {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    const [searchInp, setSearchInp] = useState('');
    const [statements, setStatements] = useState([]);

    const [rerender, setRerender] = useState(0);
    
    const searchHandle = (e) => { setSearchInp(e.target.value) }

    useEffect(() => {
        setStatements(store.getStatements());
    }, [])

    useEffect(() => {
        setStatements(store.getSearch(searchInp));
    }, [searchInp, rerender])

    return (
        <>
            <div className={styles.statementContaineer}>
                <div className={styles.upperContaineer}>
                    <input className={styles.searchInp} onChange={searchHandle} placeholder={'Поиск по заявкам'} type="text" />
                    <button className={styles.createBtn} onClick={() => navigate('/statement/add')}>Создать</button>
                </div>
                <div className={styles.cardContaineer}>
                    {statements.map((data, index) => 
                        <Card key={index} data={data.values_}/>
                    )}
                </div>
            </div>
            <Outlet context={[rerender, setRerender]}/>
        </>
    );
}