import styles from './MapPage.module.scss';
import '../../assets/OLMapStyle.scss';

import { useRef, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Context } from '../../main';

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {fromLonLat, toLonLat} from 'ol/proj';
import { Style, Fill, Stroke, Circle } from 'ol/style';

import Popup from 'ol-popup';


export function MapPage() {
    const {store} = useContext(Context);
    const params = useParams();
    const navigate = useNavigate();
    const mapElement = useRef();

    useEffect(() => {
        let iconFeatures = store.getStatements();

        const source = new VectorSource({
            wrapX: false, 
            features: iconFeatures,
        });

        const vector = new VectorLayer({
            source: source,
            style: new Style({
                image: new Circle({
                    fill: new Fill({color: [255, 255, 255, 1],}),
                    radius: 8,
                    stroke: new Stroke({
                        color: [189, 53, 0, 1], 
                        width: 5,
                    }),
                }),
            }),
        });

        const OLmap = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vector,
            ],
            view: new View({
                // center: fromLonLat([ 39.70732721786235, 47.23260132167479]),
                // zoom: 12,
                center: fromLonLat([ params.x, params.y]),
                zoom: params.z,
            }),
        })

        const popup = new Popup();
        OLmap.addOverlay(popup);

        OLmap.on('moveend',(e) => {
            let [x,y] = toLonLat(e.target.getView().getCenter());
            let zoom = e.target.getView().getZoom();
            navigate(`/map/${x}/${y}/${zoom}/`);
        })

        OLmap.on('pointermove', (e) => {
            popup.hide();
            OLmap.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
                console.log();
                popup.show(e.coordinate, createPopup(feature.values_));
            })
        })
    }, [])

    function createPopup(popupData) {
        const popupContaineer = document.createElement('div');
        popupContaineer.classList.add(styles.popupContaineer);

        const pEl1 = document.createElement('p');
        const pEl2 = document.createElement('p');
        const pEl3 = document.createElement('p');
        const pEl4 = document.createElement('p');

        [pEl1, pEl2, pEl3, pEl4].forEach((data) => data.classList.add(styles.pText))

        pEl1.innerHTML = '#' + popupData.id + ' / ' + popupData.adress;
        pEl2.innerHTML = 'Тип: <i>' + popupData.accidentType + '<i>';
        pEl3.innerHTML = 'Приоритет: <i>' + popupData.priority + '<i>';
        pEl4.innerHTML = popupData.applicant + ', ' + popupData.phoneNumber;

        [pEl1, pEl2, pEl3, pEl4].forEach((data) => popupContaineer.append(data));

        return popupContaineer;
    }

    return(
        <>
            <div ref={mapElement} className={styles.mapContent}></div>
        </>
    );
}