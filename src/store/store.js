import { makeAutoObservable } from "mobx";
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import {fromLonLat, toLonLat} from 'ol/proj';

export default class Store {
    statements = [
        new Feature({
            geometry: new Point(fromLonLat([39.70732721786235, 47.23260132167479])),
            
            adress: 'Ул. Ленина д. 22, кв. 23',
            accidentType: 'утечка',
            priority: 'незамедлительно/1',
            applicant: 'Артем',
            phoneNumber: '+79021236709',
            id: 1,
        }),
        new Feature({
            geometry: new Point(fromLonLat([-72.0704, 46.678])),

            adress: 'Ул. Толстого д. 12, кв. 77',
            accidentType: 'прорыв',
            priority: 'высокий/2',
            applicant: 'Камиль',
            phoneNumber: '+12056767809',
            id: 2,
        }),
        
        new Feature({
            geometry: new Point(fromLonLat([50.33733937689333, 53.24658190415036])),

            adress: 'Ул. Гоголя Моголя д. 1',
            accidentType: 'закупор',
            priority: 'высокий/2',
            applicant: 'Иван',
            phoneNumber: '+12333333321',
            id: 3,
        }),
    ];
    
    n = this.statements.length+1;

    constructor() {
        makeAutoObservable(this);
    }

    getN() {
        return this.n;
    }

    getStatementsValueById(i) {
        return this.statements[i-1].values_;
    }

    getStatements() {
        return this.statements;
    }

    getSearch(imp) {
        const temp = [];
        imp = imp.toLowerCase();
        for(let i = 0; i < this.statements.length; ++i) {
            const elem = this.statements[i].values_;
            const boolArr = [
                elem.adress.toLowerCase().includes(imp),
                elem.accidentType.toLowerCase().includes(imp),
                elem.priority.toLowerCase().includes(imp),
                elem.applicant.toLowerCase().includes(imp),
                elem.phoneNumber.toLowerCase().includes(imp),
                ('#'+elem.id).toLowerCase().includes(imp),
            ];

            if (boolArr.reduce((a,b)=>a+b) > 0) {
                temp.push(this.statements[i]);
            }
        }

        return temp;
    }

    setStatements(i, data) {
        const statementsElement = new Feature({
            geometry: new Point(fromLonLat(data.coordinate)),

            adress: data.adress,
            accidentType: data.accidentType,
            priority: data.priority,
            applicant: data.applicant,
            phoneNumber: data.phoneNumber,
            id: data.id,
        });
        this.statements[i-1] = statementsElement;
    }

    pushStatements(data) {
        const statementsElement = new Feature({
            geometry: new Point(fromLonLat(data.coordinate)),

            adress: data.adress,
            accidentType: data.accidentType,
            priority: data.priority,
            applicant: data.applicant,
            phoneNumber: data.phoneNumber,
            id: this.n,
        });
        ++this.n;
        this.statements.push(statementsElement);
    }
}