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



    public filterEmojis(searchName: string, searchAge: number): Emoji[] {

        this.filteredEmojis = this.emojis;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                return !searchName || emoji.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        // Filter by age
        if (searchAge != null) {
            this.filteredEmojis = this.filteredEmojis.filter(emoji => {
                return !searchAge || emoji.age == searchAge;
            });
        }

        return this.filteredEmojis;
    }

    /**
     * Starts an asynchronous operation to update the emojis list
     *
     */
    refreshEmojis(): Observable<Emoji[]> {
        // Get Emojis returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const emojiListObservable: Observable<Emoji[]> = this.emojiListService.getEmojis();
        emojiListObservable.subscribe(
            emojis => {
                this.emojis = emojis;
                this.filterEmojis(this.emojiName, this.emojiAge);
            },
            err => {
                console.log(err);
            });
        return emojiListObservable;
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
        this.refreshEmojis();
        this.loadService();
    }
}
