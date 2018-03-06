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

    getEmojis(emojiCompany?: string): Observable<EmojiRecord[]> {
        return this.http.get<EmojiRecord[]>(this.emojiUrl);
    }

    getEmojiById(id: string): Observable<EmojiRecord> {
        return this.http.get<EmojiRecord>(this.emojiUrl + '/' + id);
    }

    private parameterPresent(searchParam: string) {
        return this.emojiUrl.indexOf(searchParam) !== -1;
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
