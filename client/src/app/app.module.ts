import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';


import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';

import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';

import {EmojiListComponent} from './emoji/emoji-list.component';
import {EmojiListService} from './emoji/emoji-list.service';


import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';

import {CrisisHelpComponent} from './crisis/crisisHelp.component';
import {ResponseComponent} from './response/response.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        UserListComponent,
        AddUserComponent,

        EmojiListComponent,
        CrisisHelpComponent,
        ResponseComponent
    ],
    providers: [
        UserListService, EmojiListService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
    ],
    entryComponents: [
      AddUserComponent,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
