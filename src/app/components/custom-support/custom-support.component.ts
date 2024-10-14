import { Component } from '@angular/core';
import { ChatSocketService } from '../../services/chat-socket.service';

@Component({
  selector: 'app-custom-support',
  templateUrl: './custom-support.component.html',
  styleUrl: './custom-support.component.css'
})
export class CustomSupportComponent {
  senderMessage!:string;

  constructor(private _chatService:ChatSocketService){

  };


  ngOnint(){
    this._chatService.getMessage().subscribe((bidData) => {
          
      // if (this.offerId == bidData.offer_id) {
      //   this.currentBid = bidData.bid;
     
      // }

    });
  }

  sendMessage(){
    this._chatService.sendMessage(this.senderMessage).then(() => {
      console.log("socket success");
      // Close the modal if bid is successful
     // Assuming you have a closeModal() method to close the modal
    }).catch((error) => {
      // Handle any errors (optional)
    
    });
  }
}
