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
                    _id: '',
                    ownerID: '',
                    emoji: 1,
                    rating: 1,
                    date: '',
                    description: '',
                },
                {
                    _id: '',
                    ownerID: '',
                    emoji: 1,
                    rating: 1,
                    date: '',
                    description: '',
                },
                {
                    _id: '',
                    ownerID: '',
                    emoji: 1,
                    rating: 1,
                    date: '',
                    description: '',
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
/*
    it('contains all the emojis', () => {
        expect(emojiList.emojis.length).toBe(3);
    });

    it('contains a emoji named \'Chris\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.name === 'Chris')).toBe(true);
    });

    it('contain a emoji named \'Jamie\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.name === 'Jamie')).toBe(true);
    });

    it('doesn\'t contain a emoji named \'Santa\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.name === 'Santa')).toBe(false);
    });

    it('has two emojis that are 37 years old', () => {
        expect(emojiList.emojis.filter((emoji: Emoji) => emoji.age === 37).length).toBe(2);
    });

    it('emoji list filters by name', () => {
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.emojiName = 'a';
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(2);
        });
    });

    it('emoji list filters by age', () => {
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.emojiAge = 37;
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(2);
        });
    });

    it('emoji list filters by name and age', () => {
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.emojiAge = 37;
        emojiList.emojiName = 'i';
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(1);
        });
    });

});

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
