import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment-timezone';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-user-offer',
  templateUrl: './user-offer.component.html',
  styleUrl: './user-offer.component.css'
})
export class UserOfferComponent {
  userOfferData: any[] = []
  userId: number | undefined;
  swissDate: any;
  @ViewChild('dt') table!: Table;
  @ViewChild('searchInput') searchInput!: ElementRef;
  constructor(private service: SharedService, private toastr: ToastrService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getSwitzerlandTime()
    this.route.queryParams.subscribe(params => {
      this.userId = params['id']
     
    });

    if (this.userId != undefined) {
      this.getUserOffersByUserId()
    } else {
      this.getUserOffers()
    }
  };


  getSwitzerlandTime() {
    this.swissDate = moment.tz("Europe/Zurich").toDate();
     // Converts to Date object in Switzerland timezone
  }

  getUserOffers() {
    const apiUrl = 'admin/getAllUsersOffers';
    
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.userOfferData = res.data.map((item: any) => {
          // Convert end_date to Date if it's a string
          const endDateUTC = moment(item.end_date).utc().format('YYYY-MM-DD HH:mm:ss');
          const swissDate = moment(this.swissDate).format('YYYY-MM-DD HH:mm:ss');
      
        if (endDateUTC <= swissDate ) {
          item['status'] = item.offer_buy_status == 1 ? 'Sold' : 'Not Sold';
        } else {
          item['status'] = 'Open';
        }
          
          return item; // Ensure each item is returned after modification
        });
        
        console.log(this.userOfferData);
      } else {
        this.toastr.error(res.message);
      }
    }, (err: any) => {
      this.toastr.error(err);
    });
  }
  

  getUserOffersByUserId() {
    let apiUrl = `admin/getAllOffersByUserId?user_id=${this.userId}`;

    this.service.get(apiUrl).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userOfferData = res.data.map((item: any) => {
            // Convert end_date to Date if it's a string
            const endDateUTC = moment(item.end_date).utc().format('YYYY-MM-DD HH:mm:ss');
            const swissDate = moment(this.swissDate).format('YYYY-MM-DD HH:mm:ss');
           
          if (endDateUTC <=swissDate ) {
            item['status'] = item.offer_buy_status == 1 ? 'Sold' : 'Not Sold';
          } else {
            item['status'] = 'Open';
          }
            
            return item; // Ensure each item is returned after modification
          });
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
  };

  clear(table: any) {
    table.clear();
    this.searchInput.nativeElement.value = ''
  }

}
