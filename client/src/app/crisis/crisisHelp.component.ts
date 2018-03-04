import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-crisisHelp-component',
    templateUrl: 'crisisHelp.component.html',
    styleUrls: ['./crisisHelp.component.css'],
})

export class CrisisHelpComponent implements OnInit {

    loadService(): void {
    }

    ngOnInit(): void {
        this.loadService();
    }
}
