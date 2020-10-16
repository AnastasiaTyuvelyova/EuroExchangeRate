import { Component, OnDestroy, OnInit } from '@angular/core';
import { SourceModel } from 'src/app/models/source.model';
import { RateService } from 'src/app/services/rate.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-sources',
    templateUrl: 'sources.component.html',
    styleUrls: ['sources.component.scss']
})
export class SourcesComponent implements OnInit, OnDestroy {

    sources = new Array<SourceModel>();
    newUrl = '';
    interval: any;

    async ngOnInit() {
        this.sources.push(new SourceModel('https://www.cbr-xml-daily.ru/daily_utf8.xml', 0));
        this.sources.push(new SourceModel('https://www.cbr-xml-daily.ru/daily_json.js', this.sources.length));

        this.updateRate();
        this.interval = setInterval(this.updateRate, 10000);
    }

    constructor(private rateService: RateService) {}

    updateRate = async () => {
        let results = await this.rateService.updateRate(this.sources);
        this.sources.forEach(x => {
            let result = results.find(n => n.order === x.order);
            x.mapAfterRequest(result);
        });
    }

    addSource() {
        if (!this.newUrl) return;

        let model = new SourceModel();

        if (!this.urlIsValid(this.newUrl)) {
            model.errorMessage = 'Некорректный адрес';
            model.isInvalid = true;
        }

        model.url = this.newUrl;
        model.order = this.sources.length
        this.sources.push(model);
        this.newUrl = null;
    }

    dropped(event: CdkDragDrop<SourceModel[]>) {
        moveItemInArray(this.sources, event.previousIndex, event.currentIndex);
        this.changeOrder();
    }

    urlIsValid(url: string) {
        if (!url) return false;
        const reg = '(https|http?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        return url.match(reg);
    }

    private changeOrder() {
        for (let i = 0; i < this.sources.length; i++) {
            this.sources[i].order = i;
        }
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }
}
