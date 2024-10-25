import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  role: any;
  isCoach: boolean = true;
  private socket!: Socket;
  // apiUrl = 'http://192.168.29.44:5000/';
  // apiUrl = 'http://localhost:5000/';
  // apiUrl = 'http://192.168.29.44:5000/';
  apiUrl = 'http://98.80.36.64:5000/';
  authToken = localStorage.getItem('fbToken');
  constructor() {
    this.socket = io(this.apiUrl);

    // this.role = this.service.getRole();
    // this.isCoach = this.role !== 'USER';

  }

  // Emit event when user is online
  userOnline(userId: string) {
    this.socket.emit('userOnline', userId);
  };


     // Listen for bid updates
     onBidUpdate(): Observable<any> {
      return new Observable((observer) => {
        this.socket.on('updateBid', (data) => {
          console.log(data);
          observer.next(data);
        });
      });
    };


  sendMessage(msg: { user_id: number, admin_id: number, message: string, sender_id: number }): Promise<any> {
    console.log("sendBid", msg);
    return new Promise((resolve, reject) => {
      this.socket.emit('sendMessage', msg, (response: any) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  };

  getMessage(): Observable<any> {

    return new Observable((observer) => {
      this.socket.on('getMessage', (data) => {
        console.log("get msg", data);
        observer.next(data);
      });
    });
  };

  sendAdminLogin(adminId: string): void {
    this.socket.emit('admin_login', adminId);
  }


  sendLogin(userId: number): void {
    this.socket.emit('user_login', userId);
  };


  getUserStatus(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user_status', (data) => {
        observer.next(data);
      });
    });
  }


  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
