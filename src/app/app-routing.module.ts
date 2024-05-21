import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';


const routes: Routes = [
  {
    path:"",  redirectTo: 'Merchant/1', pathMatch: 'full'
  },
  {
    path: 'Merchant/:MerchantId',
    component: MainPageComponent,
  },
  { path: '**', redirectTo: 'Merchant/1', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
