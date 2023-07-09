import styles from './Card.module.scss';

import { useNavigate } from 'react-router-dom';

export function Card(props) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        console.log(props.data.id);
        navigate(`/statement/${props.data.id}`);
    };

    return(
        <div onClick={handleClick} className={styles.card}>
            <h2>Заявка #{props.data.id}</h2>
            <p className={styles.cardAdress}>Адрес: {props.data.adress}</p>
            <p>Тип: <i>{props.data.accidentType}</i></p>
            <p>Приоритет: <i>{props.data.priority}</i></p>
            <p className={styles.cardApplicant}>{props.data.applicant}{`, ${props.data.phoneNumber}`}</p>
        </div>
    );
}