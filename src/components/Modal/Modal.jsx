import styles from './Modal.module.scss';

import { useState, useRef, useEffect, useContext } from 'react';

import { createPortal } from 'react-dom';

import { useNavigate, useParams, useLocation, useOutletContext } from 'react-router-dom';

import { Context } from '../../main';

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM.js';
import {fromLonLat, toLonLat} from 'ol/proj';

import Popup from 'ol-popup';

const formTemplate = {
    adress: '',
    coordinate: [],
    accidentType: '',
    priority: '',
    applicant: '',
    phoneNumber: '',
};


export function Modal(props) {
    const navigate = useNavigate();
    const {store} = useContext(Context);
    const minimap = useRef();

    const [rerender, setRerender] = useOutletContext();

    const isAdd = useLocation().pathname === '/statement/add';

    const params = useParams();
        
    const [isError, setIsError] = useState(false);
    const [coords, setCoords] = useState([]);
    
    const [formData, setFormData] = useState(isAdd ? {
        ...formTemplate,
    }:{
        ...formTemplate,
        ...store.getStatementsValueById(params.id),
    });

    useEffect(() => {
        const OLmap = new Map({
            target: minimap.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: isAdd ? fromLonLat([ 39.70732721786235, 47.23260132167479]) : formData.geometry.flatCoordinates,
                zoom: 12,
            }),
        })

        const popup = new Popup();
        OLmap.addOverlay(popup);
        if (!isAdd) {
            popup.show(formData.geometry.flatCoordinates, createMarker());
            setCoords(toLonLat(formData.geometry.flatCoordinates));
        }

        OLmap.on('click', (e) => {
            setCoords(toLonLat(e.coordinate));
            popup.show(e.coordinate, createMarker());
        })

    }, [])

    useEffect(() => {
        setIsError(false);
        setFormData({...formData, ['coordinate']: coords})
    }, [coords])

    const createMarker = () => {
        const marker = document.createElement('div');
        marker.classList.add(styles.marker);
        return marker;
    };

    const onChangeForm = (e) => {
        if (e.target.name === "phoneNumber") {
            const pervValue = e.target.value.slice(0, e.target.value.length-1);
            if (!((/^\+\d{0,11}$/.test( e.target.value )) || (/^8\d{0,10}$/.test( e.target.value )))) {
                e.target.value = pervValue;
                return;
            }
        }
        setIsError(false);
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    const sumbitBtn = () => {
        const boolArr = [
            formData.adress === '',
            formData.coordinate[0] === undefined,
            formData.accidentType === '',
            formData.priority === '',
            formData.applicant === '',
            formData.phoneNumber === '',
        ];

        if (boolArr.reduce((a,b)=>a+b) > 0) {
            setIsError(true);
        } else {
            if (isAdd) {
                store.pushStatements(formData);
            } else {
                store.setStatements(params.id, formData);
            }
            setRerender(rerender+1);
            navigate('/statement');
        }
    }

    return (
        <>
            {createPortal(
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <h1>{isAdd ? `Создание заявки`: `Редактирование заявки #${params.id}`}</h1>
                    <CustomInput name={'adress'} onChange={onChangeForm} value={formData.adress} placeholder={'Адрес'} type={'text'} />

                    <div className={styles.minimap}>
                        <p>Точка на карте {formData.coordinate[0]} {formData.coordinate[1]}</p>
                        <div ref={minimap}></div>
                    </div>

                    <div className={styles.inputsContainer}>
                        <div>
                            <select name="accidentType" onChange={onChangeForm} value={formData.accidentType}>
                                <option value="">-тип аварии-</option>
                                <option value="прорыв">Прорыв</option>
                                <option value="утечка">Утечка</option>
                                <option value="колонка уличная">Колонка уличная</option>
                                <option value="некачественная вода">Некачественная вода</option>
                                <option value="закупорка">Закупорка</option>
                                <option value="другое">Другое</option>
                            </select>

                            <select name="priority" onChange={onChangeForm} value={formData.priority}>
                                <option value="">-приоритет-</option>
                                <option value="незамедлительно/1">Незамедлительно</option>
                                <option value="высокий/2">Высокий</option>
                                <option value="средний/3">Средний</option>
                                <option value="низкий/4">Низкий</option>
                            </select>
                        </div>

                        <div>
                            <CustomInput name={'applicant'} onChange={onChangeForm} value={formData.applicant} placeholder={'Заявитель'} type={'text'} />

                            <CustomInput name={'phoneNumber'} onChange={onChangeForm} value={formData.phoneNumber} placeholder={'Номер телефона'} type={'text'} />
                        </div>
                    </div>

                    <p> {isError ? 'заполните все поля' : ' '} </p>

                    <div className={styles.menu}>
                        <button className={styles.menuBtn} onClick={() => navigate('/statement')}>Закрыть</button>
                        <button className={styles.menuBtn} onClick={sumbitBtn}>{isAdd ? 'Создать' : 'Изменить'}</button>
                    </div>
                </div>
            </div>
            , document.body)}
        </>
    );
} 

const CustomInput = (props) => {
    return (
        <div className={styles.customInputContainer}>
            <input {...props} />
            <span></span>
        </div>
    );
}