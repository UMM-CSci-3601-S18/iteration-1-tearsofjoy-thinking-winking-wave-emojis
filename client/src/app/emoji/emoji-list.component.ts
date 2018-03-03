import {Component, OnInit} from '@angular/core';
import {EmojiListService} from './emoji-list.service';
import {Emoji} from './emoji';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';


@Component({
    selector: 'app-emoji-list-component',
    templateUrl: 'emoji-list.component.html',
    styleUrls: ['./emoji-list.component.css'],
})



export class EmojiListComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public emojis: Emoji[];
    public filteredEmojis: Emoji[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public emojiName: string;
    public emojiAge: number;
    public emojiCompany: string;

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the EmojiListService into this component.
    constructor(public emojiListService: EmojiListService, public dialog: MatDialog) {

    }

    isHighlighted(emoji: Emoji): boolean {
        return emoji._id['$oid'] === this.highlightedID['$oid'];
    }

    loadService(): void {
        this.emojiListService.getEmojis(this.emojiCompany).subscribe(
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
