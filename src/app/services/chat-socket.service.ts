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
    apiUrl = 'http://192.168.29.44:5000/';
  // apiUrl = 'http://98.80.36.64:5000/';
    authToken = localStorage.getItem('fbToken');
    constructor() {
      this.socket = io(this.apiUrl);
  
      // this.role = this.service.getRole();
      // this.isCoach = this.role !== 'USER';
  
    }
  
    connectSocket(){
      const authToken = localStorage.getItem('fbToken');
  
  
      this.socket.on('connect_error', (err:any) => {
        console.error('Connection Error:', err);
      });
  
      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });
    };

    sendMessage(message: string): Promise<any> {
      console.log("sendBid",message);
      return new Promise((resolve, reject) => {
        this.socket.emit('sendMessage', message, (response:any) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(response.error);
          }
        });
      });
    }
  
    getMessage(): Observable<{ user: string, message: string }> {
      return new Observable<{ user: string, message: string }>(observer => {
        this.socket.on('messageReceived', (data:any) => {
          observer.next(data);
          console.log('Message received:', data);
        });
  
        return () => {
          this.socket.disconnect();
        };
      }).pipe(
        catchError(err => {
          console.error('Error:', err);
          return of({ user: '', message: '' }); // Return a default value or empty observable
        })
      );
    }
  
    disconnect(): void {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  
}
