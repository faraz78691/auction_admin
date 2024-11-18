import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import { tap } from 'rxjs';
import { ChatSocketService } from '../../services/chat-socket.service';

@Component({
  selector: 'app-live-auction',
  templateUrl: './live-auction.component.html',
  styleUrl: './live-auction.component.css'
})
export class LiveAuctionComponent {
  userOfferData: any[] = [];
  offerBids: any[] = [];
  userId: number | undefined;
  constructor(public service: SharedService, private toastr: ToastrService, private route: ActivatedRoute, private webSocketService: ChatSocketService) {

  }

  ngOnInit() {
    this.getAllLiveBidding()
    this.webSocketService.onBidUpdate().subscribe((bidData) => {
      console.log(bidData);
      // Update offerData based on the received bidData
      this.userOfferData = this.userOfferData.map((item) => {
        if (item.id == bidData.offer_id) {
          if (this.userId == bidData.user_id) {
            item.isHighlighted = true
          } else {
            item.isHighlighted = false;
          }
          return {
            ...item,
            highest_bid: bidData.bid
          };
        }
        return item;  // If not the matching offer_id, return the item as is
      });
      console.log(this.userOfferData);
    });
  };


  getAllLiveBidding() {
    const apiUrl = `admin/getLiveHighestBid`;

    this.service.get(apiUrl).pipe(
      tap((res: any) => {
        if (res.success && Array.isArray(res.highestBid)) {
          res.highestBid = res.highestBid.map((item: any) => {
            return {
              ...item,
              start_date: new Date(item.start_date),
              end_date: new Date(item.end_date)
            };
          });
        }
      })
    ).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userOfferData = res.highestBid;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err: any) => {
        this.toastr.error(err);
      },
      complete: () => {
        // Optional: If you need to perform something when the observable completes
      }
    });
  }
  getOfferBids(offerId: number) {
    const apiUrl = `buyer/getallbid-offerid?offer_id=${offerId}`;

    this.service.get(apiUrl).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(this.offerBids)
          this.offerBids = res.data;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err: any) => {
        this.toastr.error(err);
      },
      complete: () => {
        // Optional: If you need to perform something when the observable completes
      }
    });
  }

}
