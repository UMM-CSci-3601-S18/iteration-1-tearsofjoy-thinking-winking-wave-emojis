// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './users/user-list.component';

import {EmojiListComponent} from './emoji/emoji-list.component';
import {CrisisHelpComponent} from './crisis/crisisHelp.component';
import {ResponseComponent} from './response/response.component';



// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'users', component: UserListComponent},
    {path: 'emoji', component: EmojiListComponent},
    {path: 'response', component: ResponseComponent},
    {path: 'crisis', component: CrisisHelpComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
