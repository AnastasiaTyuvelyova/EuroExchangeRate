import { ResponseModel, SourceModel } from '../models/source.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, timeout } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class RateService {

    euroKey = 'EUR';
    private callStack: Array<Promise<any>>;

    constructor(private http: HttpClient) {
        this.callStack = new Array<Promise<number>>();
    }

    private getRateData(model: SourceModel) {
        return new Promise<any>((resolve, reject) => {
            try {
                this.http.get(model.url)
                .pipe(
                    timeout(10000),
                    map(x => {
                        return this.mapResult(<ResponseModel>x, model)
                    }),
                    catchError((e, c) => {
                        return of(new SourceModel(null, model.order, null, 'Невозможно прочитать данные'));
                    })
                )
                .subscribe(data => {
                    resolve(data);
                });
            }
            catch(e) {
                reject(e);
            }
            
        });
    }

    private setCallStack(sources: Array<SourceModel>) {
        this.callStack = new Array<Promise<any>>();

        let ordered = [...sources.filter(x => !x.isInvalid)];
        ordered.sort((a, b) => (a.order > b.order) ? 1 : -1);
        ordered.forEach(s => {
            this.callStack.push(this.getRateData(s));
        });
    }

    async updateRate(sources: Array<SourceModel>): Promise<SourceModel[]> {
        this.setCallStack(sources);
        return await Promise.all(this.callStack);
    }

    mapResult(response: ResponseModel, model: SourceModel): SourceModel {
        let value = response.Valute[this.euroKey] ? response.Valute[this.euroKey]["Value"] : null;
        let result = new SourceModel();
        result.map(model);

        if (!value) {
            return result;
        }

        result.order = model.order;
        result.value = value;
        return result;
    }
}
