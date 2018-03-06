import {Component, OnInit} from '@angular/core';
import {EmojiListService} from './emoji-list.service';
import {EmojiRecord} from './emojiRecord';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';


@Component({
    selector: 'app-emoji-list-component',
    templateUrl: 'emoji-list.component.html',
    styleUrls: ['./emoji-list.component.css'],
})



export class EmojiListComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public emojis: EmojiRecord[];
    public filteredEmojis: EmojiRecord[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.

    public emojiSelected: number = -1;
    public emojiRating: number = -1;
    public description: string = '';
    thumbLabel = true; // used for the slider
    public displayEmoji: boolean = true;
    public ownerID: string = "tempID";


    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the EmojiListService into this component.
    constructor(public emojiListService: EmojiListService, public dialog: MatDialog) {

    }

    isHighlighted(emoji: EmojiRecord): boolean {
        return emoji._id['$oid'] === this.highlightedID['$oid'];
    }

    displayValues(): void{
        console.log("emojiSelected: " + this.emojiSelected);
        console.log("emojiRating: " + this.emojiRating);
        console.log("description: " + this.description);
    }
    sendEmojiRecord(): void {
        this.displayValues();

        console.log("Entered function to send emoji");
        if(this.emojiSelected > 0 && this.emojiSelected < 6 && this.emojiRating > 0 && this.emojiRating < 6){
            console.log("Entered if statement to send emoji");
            const newEmojiRecord: EmojiRecord = {_id: '',
                ownerID: this.ownerID,
                emoji: this.emojiSelected,
                rating: this.emojiRating,
                //date: Date.prototype.toDateString(),
                date: "March 8, 2018",
                description: this.description};

            console.log("created emoji object to be sent");
            this.emojiListService.addNewEmojiRecord(newEmojiRecord).subscribe(
                addEmojiResult => {
                    this.highlightedID = addEmojiResult;
                    console.log("successfully sent emoji");
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the user.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        }

    }

    //This is test function that rediarect to other page. It works
    //window.open: open other window
    //window.location.replace: replace window
    testNavigate(): void{
        if(this.emojiSelected == 1){
            window.location.replace("http://localhost:9000/response#happyMessage");
        }
        if(this.emojiSelected == 2){
            window.location.replace("http://localhost:9000/response#disappointMessage");
        }
        if(this.emojiSelected == 3){
            window.location.replace("http://localhost:9000/response#sickMessage");
        }
        if(this.emojiSelected == 4){
            window.location.replace("http://localhost:9000/response#angryMessage");
        }
        if(this.emojiSelected == 5){
            window.location.replace("http://localhost:9000/response#sadMessage");
        }

    }

    loadService(): void {
        this.emojiListService.getEmojis().subscribe(
            emojis => {
                this.emojis = emojis;
                this.filteredEmojis = this.emojis;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.loadService();
    }
}
