import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {EmojiRecord} from './emojiRecord';
import {environment} from '../../environments/environment';


@Injectable()
export class EmojiListService {
    readonly baseUrl: string = environment.API_URL + 'emojiRecords';
    private emojiUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getEmojis(emoji_id?: string): Observable<EmojiRecord[]> {
        return this.http.get<EmojiRecord[]>(this.emojiUrl);
    }

    getEmojiById(id: string): Observable<EmojiRecord> {
        return this.http.get<EmojiRecord>(this.emojiUrl + '/' + id);
    }

    private parameterPresent(searchParam: string) {
        return this.emojiUrl.indexOf(searchParam) !== -1;
    }

    filterByOwnerID(emojiOwnerID?: string): void {
        if (!(emojiOwnerID == null || emojiOwnerID === '')) {
            if (this.parameterPresent('OwnerID=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('OwnerID=');
            }
            if (this.emojiUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.emojiUrl += 'OwnerID=' + emojiOwnerID + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.emojiUrl += '?OwnerID=' + emojiOwnerID + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('OwnerID=')) {
                let start = this.emojiUrl.indexOf('OwnerID=');
                const end = this.emojiUrl.indexOf('&', start);
                if (this.emojiUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.emojiUrl = this.emojiUrl.substring(0, start) + this.emojiUrl.substring(end + 1);
            }
        }
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.emojiUrl.indexOf(searchParam);
        let end = 0;
        if (this.emojiUrl.indexOf('&') !== -1) {
            end = this.emojiUrl.indexOf('&', start) + 1;
        } else {
            end = this.emojiUrl.indexOf('&', start);
        }
        this.emojiUrl = this.emojiUrl.substring(0, start) + this.emojiUrl.substring(end);
    }

    addNewEmojiRecord(newEmoji: EmojiRecord): Observable<{'$oid': string}> {
        console.log("it entered the observable addNewEmojiRecord() function")
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new emoji with the emoji data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.emojiUrl + '/new', newEmoji, httpOptions);
    }
}
