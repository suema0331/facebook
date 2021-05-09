import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {CommonModule} from '@angular/common';
import {FacebookGuard} from './guards/facebook.guard';
import {RegisterComponent} from './components/register/register.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
    canActivate: [FacebookGuard]
  },
  {
    path: 'login',
    component: LoginComponent
    // component: RegisterComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
