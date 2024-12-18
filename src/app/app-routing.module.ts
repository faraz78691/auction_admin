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
import { ProductAttributeComponent } from './components/product-attribute/product-attribute.component';
import { authGuard } from './guards/auth.guard';
import { BrandsModelComponent } from './components/brands-model/brands-model.component';
import { LiveAuctionComponent } from './components/live-auction/live-auction.component';
import { FeesManagementComponent } from './components/fees-management/fees-management.component';
import { SetComisssionComponent } from './set-comisssion/set-comisssion.component';
import { PopularCategoriesComponent } from './components/popular-categories/popular-categories.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { SubHeadingComponent } from './components/terms-conditions/sub-heading/sub-heading.component';
import { FeturedProductsComponent } from './components/fetured-products/fetured-products.component';
import { CustomerReportsComponent } from './components/customer-reports/customer-reports.component';

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
    path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]
  },
  {
    path: 'message', component: MessageComponent, canActivate: [authGuard]
  },
  {
    path: 'attribute/:cat_id/:pro_id', component: AttributeComponent, canActivate: [authGuard]
  },
  {
    path: 'product-attribute/:pro_id/:attr_id', component: ProductAttributeComponent, canActivate: [authGuard]
  },
  {
    path: 'boosted-offers', component: BoostedOffersComponent, canActivate: [authGuard]
  },
  {
    path: 'category-management', component: CategoryManagementComponent, canActivate: [authGuard]
  },
  {
    path: 'custom-support', component: CustomSupportComponent, canActivate: [authGuard]
  },
  {
    path: 'order-management', component: OrderManagementComponent, canActivate: [authGuard]
  },
  {
    path: 'product-list/:id', component: ProductListComponent, canActivate: [authGuard]
  },
  {
    path: 'models/:id', component: BrandsModelComponent, canActivate: [authGuard]
  },
  {
    path: 'user-list', component: UserListComponent, canActivate: [authGuard]
  },
  {
    path: 'user-offer', component: UserOfferComponent, canActivate: [authGuard]
  },
  {
    path: 'liveBidding', component: LiveAuctionComponent, canActivate: [authGuard]
  },
  {
    path: 'fees-management', component: FeesManagementComponent, canActivate: [authGuard]
  },
  {
    path: 'comission', component: SetComisssionComponent, canActivate: [authGuard]
  },
  {
    path: 'popular-categories', component: PopularCategoriesComponent, canActivate: [authGuard]
  },
  {
    path: 'terms-conditions', component: TermsConditionsComponent, canActivate: [authGuard]
  },
  {
    path: 'terms-conditions/subheading/:id', component: SubHeadingComponent, canActivate: [authGuard]
  },
  {
    path: 'fatured-products', component: FeturedProductsComponent, canActivate: [authGuard]
  },
  {
    path: 'customer-reports', component: CustomerReportsComponent, canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
