import { ResponseModel, SourceModel } from '../models/source.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class RateService {

    euroKey = 'EUR';
    private callStack: Array<Promise<any>>;

    constructor(private http: HttpClient) {
        this.callStack = new Array<Promise<number>>();
    }

    private getRateData(url: string, order: number) {
        return new Promise<any>((resolve, reject) => {
            this.http.get(url)
                .pipe(
                    map(x => {
                        return this.mapResult(<ResponseModel>x, order)
                    }),
                    catchError((e, c) => {
                        return of(new SourceModel(null, order, null, 'Невозможно прочитать данные'));
                    })
                )
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

    private setCallStack(sources: Array<SourceModel>) {
        this.callStack = new Array<Promise<any>>();

        let ordered = [...sources];
        ordered.sort((a, b) => (a.order > b.order) ? 1 : -1);
        ordered.forEach(s => {
            this.callStack.push(this.getRateData(s.url, s.order));
        });
    }

    async updateRate(sources: Array<SourceModel>): Promise<SourceModel[]> {
        this.setCallStack(sources);
        return await Promise.all(this.callStack);
    }

    mapResult(response: ResponseModel, order: number): SourceModel {
        let value = response.Valute[this.euroKey] ? response.Valute[this.euroKey]["Value"] : null;
        let result = new SourceModel();
        if (!value) {
            return result;
        }

        result.order = order;
        result.value = value;
        return result;
    }
}
