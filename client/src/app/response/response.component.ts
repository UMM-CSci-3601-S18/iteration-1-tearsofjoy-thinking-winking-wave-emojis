import {Component, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion'

@Component({
    selector: 'app-response-component',
    templateUrl: 'response.component.html',
    styleUrls: ['./response.component.css'],
})

export class ResponseComponent implements OnInit {

    step = -1;

    setStep() {
        if(window.location.href.indexOf ("http://localhost:9000/response#disappointMessage")){
            this.step = 1;

        }
    }

    loadService(): void {
    }

    ngOnInit(): void {
        this.loadService();
    }


    testopenexpansion(): void{

    }


}
