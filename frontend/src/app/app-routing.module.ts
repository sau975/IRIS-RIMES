import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { DataentryComponent } from './main_page/dataentry/dataentry.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'data-entry', component: DataentryComponent },
  { path: 'front-page', loadChildren: () => import('./main_page/main-page.module').then(m => m.MainPageModule)},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dataentry', component: DataentryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
