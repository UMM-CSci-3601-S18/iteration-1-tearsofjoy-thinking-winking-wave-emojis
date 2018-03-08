import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {EmojiRecord} from './emojiRecord';
import {EmojiListComponent} from './emoji-list.component';
import {EmojiListService} from './emoji-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Emoji list', () => {

    let emojiList: EmojiListComponent;
    let fixture: ComponentFixture<EmojiListComponent>;

    let emojiListServiceStub: {
        getEmojis: () => Observable<EmojiRecord[]>
    };

    beforeEach(() => {
        // stub EmojiService for test purposes
        emojiListServiceStub = {
            getEmojis: () => Observable.of([
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
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [EmojiListComponent],
            // providers:    [ EmojiListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: EmojiListService, useValue: emojiListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(EmojiListComponent);
            emojiList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

        it('contains all the emojis', () => {
            expect(emojiList.emojis.length).toBe(4);
        });

        it('contains a emoji id \'temp1\'', () => {
            expect(emojiList.emojis.some((emoji: EmojiRecord) => emoji._id === 'temp1')).toBe(true);
        });

        it('contains a emoji id \'temp2\'', () => {
            expect(emojiList.emojis.some((emoji: EmojiRecord) => emoji._id === 'temp2')).toBe(true);
        });

        it('doesn\'t contain a emoji id \'temp5\'', () => {
            expect(emojiList.emojis.some((emoji: EmojiRecord) => emoji._id === 'temp5')).toBe(false);
        });
        it('contains a emoji ownerID \'OwnerTemp1\'', () => {
            expect(emojiList.emojis.some((emoji: EmojiRecord) => emoji.ownerID === 'OwnerTemp1')).toBe(true);
        });

        it('contains a emoji ownerID \'OwnerTemp2\'', () => {
            expect(emojiList.emojis.some((emoji: EmojiRecord) => emoji.ownerID === 'OwnerTemp2')).toBe(true);
        });

        it('doesn\'t contain a emoji ownerID \'OwnerTemp5\'', () => {
            expect(emojiList.emojis.some((emoji: EmojiRecord) => emoji.ownerID === 'OwnerTemp5')).toBe(false);
        });

        it('has two emojis that are emoji 1', () => {
            expect(emojiList.emojis.filter((emoji: EmojiRecord) => emoji.emoji === 1).length).toBe(2);
        });

        it('has two emojis that are rating 1', () => {
            expect(emojiList.emojis.filter((emoji: EmojiRecord) => emoji.rating === 1).length).toBe(2);
        });

        it('has three emojis that are date March 8th 2018', () => {
            expect(emojiList.emojis.filter((emoji: EmojiRecord) => emoji.date === 'March 8th 2018').length).toBe(4);
        });

        it('has one emojis that are description desc1', () => {
            expect(emojiList.emojis.filter((emoji: EmojiRecord) => emoji.description === 'desc1').length).toBe(1);
        });
    /*

    describe('Misbehaving Emoji List', () => {
        let emojiList: EmojiListComponent;
        let fixture: ComponentFixture<EmojiListComponent>;

        let emojiListServiceStub: {
            getEmojis: () => Observable<Emoji[]>
        };

        beforeEach(() => {
            // stub EmojiService for test purposes
            emojiListServiceStub = {
                getEmojis: () => Observable.create(observer => {
                    observer.error('Error-prone observable');
                })
            };

            TestBed.configureTestingModule({
                imports: [FormsModule, CustomModule],
                declarations: [EmojiListComponent],
                providers: [{provide: EmojiListService, useValue: emojiListServiceStub},
                    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
            });
        });

        beforeEach(async(() => {
            TestBed.compileComponents().then(() => {
                fixture = TestBed.createComponent(EmojiListComponent);
                emojiList = fixture.componentInstance;
                fixture.detectChanges();
            });
        }));

        it('generates an error if we don\'t set up a EmojiListService', () => {
            // Since the observer throws an error, we don't expect emojis to be defined.
            expect(emojiList.emojis).toBeUndefined();
        });
    });


    describe('Adding a emoji', () => {
        let emojiList: EmojiListComponent;
        let fixture: ComponentFixture<EmojiListComponent>;
        const newEmoji: Emoji = {
            _id: '',
            name: 'Sam',
            age: 67,
            company: 'Things and stuff',
            email:                    _id: 'jamie_id',
                        name: 'Jamie',
                        age: 37,
                        company: 'Frogs, Inc.',
                        email: 'jamie@frogs.com' 'sam@this.and.that'
        };
        const newId = 'sam_id';

        let calledEmoji: Emoji;

        let emojiListServiceStub: {
            getEmojis: () => Observable<Emoji[]>,
            addNewEmoji: (newEmoji: Emoji) => Observable<{'$oid': string}>
        };
        let mockMatDialog: {
            open: (AddEmojiComponent, any) => {
                afterClosed: () => Observable<Emoji>
            };
        };

        beforeEach(() => {
            calledEmoji = null;
            // stub EmojiService for test purposes
            emojiListServiceStub = {
                getEmojis: () => Observable.of([]),
                addNewEmoji: (emojiToAdd: Emoji) => {
                    calledEmoji = emojiToAdd;
                    return Observable.of({
                        '$oid': newId
                    });
                }
            };
            mockMatDialog = {
                open: () => {
                    return {
                        afterClosed: () => {
                            return Observable.of(newEmoji);
                        }
                    };
                }
            };

            TestBed.configureTestingModule({
                imports: [FormsModule, CustomModule],
                declarations: [EmojiListComponent],
                providers: [
                    {provide: EmojiListService, useValue: emojiListServiceStub},
                    {provide: MatDialog, useValue: mockMatDialog},
                    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
            });
        });

        beforeEach(async(() => {
            TestBed.compileComponents().then(() => {
                fixture = TestBed.createComponent(EmojiListComponent);
                emojiList = fixture.componentInstance;
                fixture.detectChanges();
            });
        }));

        it('calls EmojiListService.addEmoji', () => {
            expect(calledEmoji).toBeNull();
            emojiList.openDialog();
            expect(calledEmoji).toEqual(newEmoji);
        });
        */
});
