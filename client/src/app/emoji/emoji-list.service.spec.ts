import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {EmojiRecord} from "./emojiRecord";
import {EmojiListService} from './emoji-list.service';

describe('Emoji list service: ', () => {
    // A small collection of test emojis
    const testEmojis: EmojiRecord[] = [
        {
            _id: 'temp1',
            ownerID: 'OwnerTemp1',
            emoji: 1,
            rating: 1,
            date: 'March 8th 2018',
            description: 'desc1',
        },
        {
            _id: 'temp2',
            ownerID: 'OwnerTemp2',
            emoji: 2,
            rating: 1,
            date: 'March 8th 2018',
            description: 'desc2',
        },
        {
            _id: 'temp3',
            ownerID: 'OwnerTemp3',
            emoji: 1,
            rating: 3,
            date: 'March 8th 2018',
            description: 'desc3',
        },
        {
            _id: 'temp4',
            ownerID: 'OwnerTemp4',
            emoji: 3,
            rating: 3,
            date: 'March 8th 2018',
            description: 'desc4',
        }
    ];
    const mEmojis: EmojiRecord[] = testEmojis.filter(emoji =>
        emoji.ownerID.toLowerCase().indexOf('m') !== -1
    );

    // We will need some url information from the emojiListService to meaningfully test company filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let emojiListService: EmojiListService;
    let currentlyImpossibleToGenerateSearchEmojiUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        emojiListService = new EmojiListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getEmojis() calls api/emojis', () => {
        // Assert that the emojis we get from this call to getEmojis()
        // should be our set of test emojis. Because we're subscribing
        // to the result of getEmojis(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testEmojis) a few lines
        // down.
        emojiListService.getEmojis().subscribe(
            emojis => expect(emojis).toBe(testEmojis)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(emojiListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testEmojis);
    });
/*
    it('getEmojis(emoji_id) adds appropriate param string to called URL', () => {
        emojiListService.getEmojis('m').subscribe(
            emojis => expect(emojis).toEqual(mEmojis)
        );

        const req = httpTestingController.expectOne(emojiListService.baseUrl + '/' + _id);
        expect(req.request.method).toEqual('GET');
        req.flush(mEmojis);
    });
*/
    it('filterByOwnerID(emojiOwnerID) deals appropriately with a URL that already had a OwnerID', () => {
        currentlyImpossibleToGenerateSearchEmojiUrl = emojiListService.baseUrl + '?OwnerID=f&something=k&';
        emojiListService['emojiUrl'] = currentlyImpossibleToGenerateSearchEmojiUrl;
        emojiListService.filterByOwnerID('m');
        expect(emojiListService['emojiUrl']).toEqual(emojiListService.baseUrl + '?something=k&OwnerID=m&');
    });

    it('filterByOwnerID(emojiOwnerID) deals appropriately with a URL that already had some filtering, but no company', () => {
        currentlyImpossibleToGenerateSearchEmojiUrl = emojiListService.baseUrl + '?something=k&';
        emojiListService['emojiUrl'] = currentlyImpossibleToGenerateSearchEmojiUrl;
        emojiListService.filterByOwnerID('m');
        expect(emojiListService['emojiUrl']).toEqual(emojiListService.baseUrl + '?something=k&OwnerID=m&');
    });

    it('filterByOwnerID(emojiOwnerID) deals appropriately with a URL has the keyword OwnerID, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchEmojiUrl = emojiListService.baseUrl + '?OwnerID=&';
        emojiListService['emojiUrl'] = currentlyImpossibleToGenerateSearchEmojiUrl;
        emojiListService.filterByOwnerID('');
        expect(emojiListService['emojiUrl']).toEqual(emojiListService.baseUrl + '');
    });

    it('getEmojiById() calls api/emojis/id', () => {
        const targetEmoji: EmojiRecord = testEmojis[1];
        const targetId: string = targetEmoji._id;
        emojiListService.getEmojiById(targetId).subscribe(
            emoji => expect(emoji).toBe(targetEmoji)
        );

        const expectedUrl: string = emojiListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetEmoji);
    });

    it('adding a emoji calls api/emojis/new', () => {
        const temp5_id = { '$oid': 'temp5_id' };
        const newEmoji: EmojiRecord = {
            _id: 'temp5',
            ownerID: 'OwnerTemp5',
            emoji: 3,
            rating: 3,
            date: 'March 8th 2018',
            description: 'desc5',
        };

        emojiListService.addNewEmojiRecord(newEmoji).subscribe(
            id => {
                expect(id).toBe(temp5_id);
            }
        );

        const expectedUrl: string = emojiListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(temp5_id);
    });
});
