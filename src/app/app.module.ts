import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/shared/header/header.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductAttributeComponent } from './components/product-attribute/product-attribute.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrandsModelComponent } from './components/brands-model/brands-model.component';
import { LiveAuctionComponent } from './components/live-auction/live-auction.component';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FeesManagementComponent } from './components/fees-management/fees-management.component';
import { SetComisssionComponent } from './set-comisssion/set-comisssion.component';
import { PopularCategoriesComponent } from './components/popular-categories/popular-categories.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { SubHeadingComponent } from './components/terms-conditions/sub-heading/sub-heading.component';
import { NgxEditorModule } from 'ngx-editor';
import { FeturedProductsComponent } from './components/fetured-products/fetured-products.component';
import { CustomerReportsComponent } from './components/customer-reports/customer-reports.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    DashboardComponent,
    MessageComponent,
    AttributeComponent,
    BoostedOffersComponent,
    CategoryManagementComponent,
    CustomSupportComponent,
    OrderManagementComponent,
    ProductListComponent,
    UserListComponent,
    UserOfferComponent,
    SidebarComponent,
    HeaderComponent,
    ProductAttributeComponent,
    BrandsModelComponent,
    LiveAuctionComponent,
    FeesManagementComponent,
    SetComisssionComponent,
    PopularCategoriesComponent,
    TermsConditionsComponent,
    SubHeadingComponent,
    FeturedProductsComponent,
    CustomerReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SweetAlert2Module,
    BrowserAnimationsModule,
    IconFieldModule, InputTextModule, InputIconModule, DropdownModule, ButtonModule,
    TableModule,
    NgxEditorModule,
    ToastrModule.forRoot()
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
