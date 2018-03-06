import {Component, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion'

@Component({
    selector: 'app-response-component',
    templateUrl: 'response.component.html',
    styleUrls: ['./response.component.css'],
})

export class ResponseComponent implements OnInit {

    step = -1;

    setStep(index: number) {
        if(window.location.href.indexOf ("http://localhost:9000/response#happyMessage")){
            this.step = index;

        }
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    loadService(): void {
    }

    ngOnInit(): void {
        this.loadService();
    }


    testopenexpansion(): void{

    }


}
