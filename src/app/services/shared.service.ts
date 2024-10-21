import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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


  setCategoryData(id: number, name: string) {
    this.categoryData.set({ id, name });
  }
  setProductData(id: number, name: string) {
    this.productData.set({ id, name });
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(url: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('authorization', `Bearer ${this.authService.getToken()}`)
    return this.http.get(environment.baseUrl + url, { headers: headers })
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
  }
}

