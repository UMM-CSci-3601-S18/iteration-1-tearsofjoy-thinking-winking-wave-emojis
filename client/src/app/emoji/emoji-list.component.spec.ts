import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {EmojiRecord} from './emojiRecord';
import {EmojiListComponent} from './emoji-list.component';
import {EmojiListService} from './emoji-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Adding an emoji record to the database', () => {
    let emojiList: EmojiListComponent;
    let fixture: ComponentFixture<EmojiListComponent>;
    const newEmojiRecord: EmojiRecord = {
        _id: '',
        ownerID: 'Sam',
        emoji: 5,
        rating: 5,
        //date: Date.prototype.toDateString(),
        date: "March 8, 2018",
        description: 'sam@this.and.that'
    };
    const newId = 'sam_id';

    let calledEmojiRecord: EmojiRecord;

    let emojiRecordServiceStub: {
        getEmojiRecords: () => Observable<EmojiRecord[]>,
        addNewEmojiRecord: (newEmojiRecord: EmojiRecord) => Observable<{'$oid': string}>
    };

    beforeEach(() => {
        calledEmojiRecord = null;

        emojiRecordServiceStub = {
            getEmojiRecords: () => Observable.of([]),
            addNewEmojiRecord: (emojiRecordToAdd: EmojiRecord) => {
                calledEmojiRecord = emojiRecordToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [EmojiListComponent],
            providers: [
                {provide: EmojiListService, useValue: emojiRecordServiceStub},
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

    it('calls EmojiListService.sendEmojiRecord', () => {
        expect(calledEmojiRecord).toBeNull();
        emojiList.sendEmojiRecord();
        expect(calledEmojiRecord).toEqual(newEmojiRecord);
    });
});
