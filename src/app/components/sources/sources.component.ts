import { Component } from '@angular/core';
import { SourceModel } from 'src/app/models/source.model';
import { RateService } from 'src/app/services/rate.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-sources',
    templateUrl: 'sources.component.html',
    styleUrls: ['sources.component.scss']
})
export class SourcesComponent {

    sources = new Array<SourceModel>();
    newUrl = '';

    async ngOnInit() {
        this.sources.push(new SourceModel('https://www.cbr-xml-daily.ru/daily_utf8.xml', 0));
        this.sources.push(new SourceModel('https://www.cbr-xml-daily.ru/daily_json.js', 1));

        this.updateRate();
        setInterval(this.updateRate, 10000);
    }

    constructor(private rateService: RateService) {}

    updateRate = async () => {
        let results = await this.rateService.updateRate(this.sources);
        this.sources.forEach(x => {
            let result = results.find(v => v.order === x.order);
            x.value = result ? result.value : 0;
            x.errorMessage = result ? result.errorMessage : null;
        });
        console.log('обновился!');
    }

    addSource() {
        if (!this.newUrl) return;
        this.sources.push(new SourceModel(this.newUrl, this.sources.length));
        this.newUrl = '';
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.sources, event.previousIndex, event.currentIndex);
    }

}
