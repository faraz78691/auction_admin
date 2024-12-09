import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatSocketService } from '../../services/chat-socket.service';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-custom-support',
  templateUrl: './custom-support.component.html',
  styleUrl: './custom-support.component.css',
})
export class CustomSupportComponent {
  isChatboxVisible: boolean = false;
  senderMessage!: string;
  userList: any[] = [];
  alluserData: any[] = [];
  chats: any[] = [];
  adminId!: any;
  userId!: number;
  username!: string;
  isNewChat: boolean = false;
  isOnline: boolean = false;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  // apiUrl = 'http://192.168.29.44:5000/';
  // apiUrl = 'http://localhost:3000/';
  apiUrl = 'http://98.80.36.64:5000/';
  searchQuery: string | undefined;
  usernameArray!: any[];
  onlineUsers: string[] = [];
  filteredUsers: any
  imgUrl: any
  constructor(
    private _chatService: ChatSocketService,
    private apiService: SharedService,
    private authService: AuthService
  ) {
    // this.socket = io(this.apiUrl);
    this.imgUrl = environment.imageUrl
  }

  ngOnInit() {
    this._chatService.connectAdmin();
    this.adminId = localStorage.getItem('auctionAdminID');
    this.getUserList();

    this._chatService.getOnlineUsers();
    this._chatService.getOnlineStatus().subscribe((onlineUsers) => {
      this.onlineUsers = onlineUsers;
      console.log(this.onlineUsers)
    });
    this.getUsersChats();
    this._chatService.getMessage().subscribe((chats) => {
      if (chats.sender_id == chats.admin_id) {
        this.chats.push(chats);
      } else {
        if (chats.sender_id == this.chats[0].user_id) {
          this.chats.push(chats);
        } else {
        }
      }
      this.scrollToBottom();
      this.getUsersChats();
    });
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer && this.myScrollContainer.nativeElement) {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  getUserList() {
    let apiUrl = 'admin/getAllUsers';

    this.apiService.get(apiUrl).subscribe(
      (res: any) => {
        if (res.success) {
          this.alluserData = res.data;
          this.filteredUsers = [...this.alluserData];
          // console.log(this.alluserData);
        } else {
          // this.toastr.warning(res.message)
        }
      },
      (err: any) => {
        // this.toastr.error(err)
      }
    );
  }

  // Method to show the chatbox
  showChatbox(): void {
    this.isChatboxVisible = true;
  }

  // Method to hide the chatbox
  hideChatbox(): void {
    this.isChatboxVisible = false;
  }

  getUsersChats() {
    this.apiService.get('admin/getAllChatMessageUser').subscribe({
      next: (res) => {
        if (res.success == true) {
          this.userList = res.userChat;
          console.log(this.userList)
          if (this.isNewChat) {
            const usernameInfo = { user_name: this.username, unread_count: 0 };
            this.userList.unshift(usernameInfo);
          }
        }
        // console.log(107, res);
      },
    });
  }

  updateReadMSg(id: number) {
    const formdata = new URLSearchParams();
    formdata.set('id', id.toString());

    this.apiService.post('admin/updateMsgCount', formdata).subscribe({
      next: (res) => {
        if (res.success == true) {
          // console.log(this.userList);
        }
        //console.log(res);
      },
    });
  }

  sendMessage() {
    this.isNewChat = false;
    this.getUsersChats();

    if (this.files.length > 0) {
      let formData = new FormData()
      if (this.files && this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          formData.append('socket_image_message', this.files[i]);
        }
      }

      this.apiService.upload('user/socket-imagesend', formData).subscribe((res: any) => {
        if (res.success) {
          this.sendNormalMsg(res.data)
        }
      })
    } else {

      if (this.senderMessage.trim().length == 0) {
        return;
      }
      this.sendNormalMsg('')
    }
  }

  sendNormalMsg(img_path: string) {
    const msg = {
      user_id: this.userId,
      admin_id: this.adminId,
      message: this.senderMessage.trim(),
      sender_id: this.adminId,
      image_path: img_path
    };
    this._chatService
      .sendMessage(msg)
      .then(() => {
        this.chats.push(msg);
      })
      .catch((error) => {
      });
    this.senderMessage = '';
    this.files = [],
      this.previewFiles = []
  }

  // Function to handle keydown events
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.senderMessage.trim()) {
      this.sendMessage();
    }
  }

  @ViewChild('closeModal') closeModal!: ElementRef;

  openChat(userId: any, username: string) {
    this.isChatboxVisible = true;
    this.userId = userId;
    const formData = new URLSearchParams();
    formData.set('user_id', userId);
    //debugger
    this.apiService.post('user/getChatMessage', formData.toString()).subscribe({
      next: (res) => {
        if (res.success == true) {
          this.chats = res.data;
          this.username = username;
          this.closeModal.nativeElement.click();
          this.isNewChat = false;
        } else {
          this.chats = [];
          this.username = username;
          this.isNewChat = true;
          this.getUsersChats();
          this.closeModal.nativeElement.click();
        }

        this.updateReadMSg(userId);
        this.isOnline = this.onlineUsers.includes(userId.toString());
      },
    });
  };


  onKeyup(event: any): void {
    const query = this.searchQuery?.toLowerCase().trim();
    console.log("query", query)
    if (query == '') {
      this.filteredUsers = this.alluserData
    } else {
      this.filteredUsers = this.alluserData.filter(user =>
        user.user_name.toLowerCase().includes(query)
      );

    }
  }


  files: any[] = [];
  previewFiles: { name: string; type: string; url: string }[] = [];

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        this.files.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewFiles.push({
            name: file.name,
            type: file.type,
            url: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeFile(fileToRemove: any): void {
    const index = this.previewFiles.indexOf(fileToRemove);
    if (index > -1) {
      this.previewFiles.splice(index, 1);
      this.files.splice(index, 1);
    }
  }
}
