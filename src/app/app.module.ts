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
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
