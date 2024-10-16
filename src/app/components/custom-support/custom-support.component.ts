import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatSocketService } from '../../services/chat-socket.service';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { Socket, io } from 'socket.io-client';

@Component({
  selector: 'app-custom-support',
  templateUrl: './custom-support.component.html',
  styleUrl: './custom-support.component.css'
})
export class CustomSupportComponent {
  senderMessage!: string;
  userList: any[] = [];
  chats: any[] = [];
  adminId!: any;
  userId!: number;
  username!:string;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  // apiUrl = 'http://192.168.29.44:5000/';
  apiUrl = 'http://localhost:5000/';
  // apiUrl = 'http://98.80.36.64:5000/';
  private socket: Socket;
  constructor(private _chatService: ChatSocketService, private apiService: SharedService, private authService: AuthService) {
    this.socket = io(this.apiUrl);
  };


  ngOnInit() {
    this.adminId = localStorage.getItem('auctionAdminID');
    this._chatService.sendAdminLogin(this.adminId);
    this.getUsersChats();
    this._chatService.getMessage().subscribe((chats) => {
      this.chats.push(chats)
      this.scrollToBottom();
      console.log(this.chats);


    });
  };
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }



  getUsersChats() {
    this.apiService.get('admin/getAllChatMessageUser').subscribe({
      next: res => {
        if (res.success == true) {
          this.userList = res.data;
          this.openChat(this.userList[0].user_id, this.userList[0].user_name)
        }
        console.log(res);
      }
    })
  }

  sendMessage() {
    const msg = {
      user_id: this.userId,
      admin_id: this.adminId,
      message: this.senderMessage,
      sender_id: this.adminId
    }
    this._chatService.sendMessage(msg).then(() => {
      // console.log("not calling");
      // this.chats.push(msg);
      // console.log(this.chats);

      // Close the modal if bid is successful
      // Assuming you have a closeModal() method to close the modal
    }).catch((error) => {
      // Handle any errors (optional)

    });
    this.senderMessage = ''
  };


  openChat(userId: any, username:string) {
    this.userId = userId;
    const formData = new URLSearchParams();
    formData.set('user_id', userId)
    this.apiService.post('user/getChatMessage', formData.toString()).subscribe({
      next: res => {
        if (res.success == true) {
          this.chats = res.data;
          this.username = username
        }

      }
    })
  }

}
