import styles from './Header.module.scss';

import { Outlet, Link, useLocation  } from 'react-router-dom';



export function Header() {
    const location = useLocation();
    const [isMap, isStatement] = [location.pathname.slice(0, 4) === '/map', location.pathname.slice(0, 10) === '/statement'];


    return(
        <>
            <nav className={styles.headerNav}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerNavButton + ' ' + (isStatement ? styles.headerNavButtonActive : '')}> <Link to='/statement'> Журнал </Link> </div>
                    <div className={styles.headerNavButton + ' ' + (isMap ? styles.headerNavButtonActive : '')}> <Link to='/map/39.70732721786235/47.23260132167479/12'> Карта </Link> </div>
                </div>
            </nav>

            <Outlet/>
        </>
    );
} 