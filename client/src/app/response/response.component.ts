import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-response-component',
    templateUrl: 'response.component.html',
    styleUrls: ['./response.component.css'],
})

export class ResponseComponent implements OnInit {

    loadService(): void {
    }

    ngOnInit(): void {
        this.loadService();
    }
}
