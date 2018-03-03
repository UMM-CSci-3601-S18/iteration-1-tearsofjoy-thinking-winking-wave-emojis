import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Emoji} from './emoji';
import {environment} from '../../environments/environment';


@Injectable()
export class EmojiListService {
    readonly baseUrl: string = environment.API_URL + 'emojis';
    private emojiUrl: string = this.baseUrl;

    constructor(private http: HttpClient) {
    }

    getEmojis(emojiCompany?: string): Observable<Emoji[]> {
        this.filterByCompany(emojiCompany);
        return this.http.get<Emoji[]>(this.emojiUrl);
    }

    getEmojiById(id: string): Observable<Emoji> {
        return this.http.get<Emoji>(this.emojiUrl + '/' + id);
    }

    /*
    //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
    //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
    getEmojisByCompany(emojiCompany?: string): Observable<Emoji> {
        this.emojiUrl = this.emojiUrl + (!(emojiCompany == null || emojiCompany == "") ? "?company=" + emojiCompany : "");
        console.log("The url is: " + this.emojiUrl);
        return this.http.request(this.emojiUrl).map(res => res.json());
    }
    */

    filterByCompany(emojiCompany?: string): void {
        if (!(emojiCompany == null || emojiCompany === '')) {
            if (this.parameterPresent('company=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('company=');
            }
            if (this.emojiUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.emojiUrl += 'company=' + emojiCompany + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.emojiUrl += '?company=' + emojiCompany + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('company=')) {
                let start = this.emojiUrl.indexOf('company=');
                const end = this.emojiUrl.indexOf('&', start);
                if (this.emojiUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.emojiUrl = this.emojiUrl.substring(0, start) + this.emojiUrl.substring(end + 1);
            }
        }
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

    addNewEmoji(newEmoji: Emoji): Observable<{'$oid': string}> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new emoji with the emoji data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.emojiUrl + '/new', newEmoji, httpOptions);
    }
}
