export class SourceModel {
    order: number;
    url: string;
    value: number;
    errorMessage: string;
    isInvalid = false;

    constructor(url?: string, order?: number, value?: number, errorMessage?: string) {
        this.url = url;
        this.order = order;
        this.value = value;
        this.errorMessage = errorMessage;
    }

    map(model: SourceModel) {
        this.order = model.order;
        this.url = model.url;
        this.value = model.value;
        this.errorMessage = model.errorMessage;
        this.isInvalid = this.isInvalid;
    }

    mapAfterRequest(model: SourceModel) {
        if (!model) return;
        this.value = model.value || 0;
        this.errorMessage = this.errorMessage || model.errorMessage;
    }
}

export interface ResponseModel {
    Valute: any[];
}