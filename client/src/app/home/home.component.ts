import {Component} from '@angular/core';

@Component({
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    public text: string;

    constructor() {
        this.text = 'Welcome!';
    }

    gotoemojiNavigate(): void{
        window.location.replace("http://138.68.187.227:4567/emoji");
        }
}
