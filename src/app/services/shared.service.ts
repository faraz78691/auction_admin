import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SharedService {



  categoryData = signal<{ id: number | null, name: string | null }>({
    id: null,
    name: null
  });
  productData = signal<{ id: number | null, name: string | null }>({
    id: null,
    name: null
  });

  offer_unique_signal = signal<number>(0)
  user_signal = signal<number>(0)


  setCategoryData(id: number, name: string) {
    this.categoryData.set({ id, name });
  }
  setProductData(id: number, name: string) {
    this.productData.set({ id, name });
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private messageService: MessageService
  ) { }

  get(url: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.get(environment.baseUrl + url, { headers: headers })
  }

  delete(url: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.delete(environment.baseUrl + url, { headers: headers })
  }

  post(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.post(environment.baseUrl + url, data, { headers: headers })
  }

  upload(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.post(environment.baseUrl + url, data, { headers: headers })
  };

  goBack(): void {
    this.location.back();  // Navigate to the previous page
  };



  showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  };


  redirectToOffer(offerUniqueId: number) {
    this.offer_unique_signal.set(offerUniqueId)
    this.router.navigateByUrl('/user-offer')
  };

  resetOfferUniqueSignal() {
    this.offer_unique_signal.set(0)
  }

  redirectToUser(userId: number) {
    this.user_signal.set(userId)
    this.router.navigateByUrl('/user-list')
  };

  resetUserSignal() {
    this.user_signal.set(0)
  }
}

