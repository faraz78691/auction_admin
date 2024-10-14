import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MessageComponent } from './components/message/message.component';
import { AttributeComponent } from './components/attribute/attribute.component';
import { BoostedOffersComponent } from './components/boosted-offers/boosted-offers.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { CustomSupportComponent } from './components/custom-support/custom-support.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserOfferComponent } from './components/user-offer/user-offer.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'log-in', pathMatch: 'full'
  },
  {
    path: 'log-in', component: LogInComponent
  },
  {
    path: 'forget-password', component: ForgetPasswordComponent
  },
  {
    path: 'change-password', component: ChangePasswordComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'message', component: MessageComponent
  },
  {
    path: 'attribute', component: AttributeComponent
  },
  {
    path: 'boosted-offers', component: BoostedOffersComponent
  },
  {
    path: 'category-management', component: CategoryManagementComponent
  },
  {
    path: 'custom-support', component: CustomSupportComponent
  },
  {
    path: 'order-management', component: OrderManagementComponent
  },
  {
    path: 'product-list', component: ProductListComponent
  },
  {
    path: 'user-list', component: UserListComponent
  },
  {
    path: 'user-offer', component: UserOfferComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
