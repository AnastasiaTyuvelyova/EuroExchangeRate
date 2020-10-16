export class SourceModel {
    order: number;
    url: string;
    value: number;
    errorMessage: string;

    constructor(url?: string, order?: number, value?: number, errorMessage?: string) {
        this.url = url;
        this.order = order;
        this.value = value;
        this.errorMessage = errorMessage;
    }
}

export interface ResponseModel {
    Valute: any[];
}