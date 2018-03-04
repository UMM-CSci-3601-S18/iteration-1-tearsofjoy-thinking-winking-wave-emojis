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


    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the EmojiListService into this component.
    constructor(public emojiListService: EmojiListService, public dialog: MatDialog) {

    }

    isHighlighted(emoji: EmojiRecord): boolean {
        return emoji._id['$oid'] === this.highlightedID['$oid'];
    }

    sendEmojiRecord(): void {

        if(this.emojiSelected > 0 && this.emojiSelected < 6 && this.emojiRating > 0 && this.emojiRating < 6){
            const newEmojiRecord: EmojiRecord = {_id: '',
                ownerID: 'tempID',
                emoji: this.emojiSelected,
                rating: this.emojiRating,
                date: Date.prototype.toDateString(),
                description: ''};

            this.emojiListService.addNewEmojiRecord(newEmojiRecord).subscribe(
                addUserResult => {
                    this.highlightedID = addUserResult;
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the user.');
                    console.log('The error was ' + JSON.stringify(err));
                });
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
