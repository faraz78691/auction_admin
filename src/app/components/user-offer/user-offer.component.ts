import { Component, computed, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment-timezone';
import { Table } from 'primeng/table';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-user-offer',
  templateUrl: './user-offer.component.html',
  styleUrl: './user-offer.component.css'
})
export class UserOfferComponent {
  userOfferData: any[] = [];
  alluserOfferData: any[] = [];
  userId: number | undefined;
  swissDate: any;
  @ViewChild('dt') table!: Table;
  @ViewChild('searchInput') searchInput!: ElementRef;
  offerUniqueId = computed(() => {
    return this.service.offer_unique_signal()
  })
  images: any;
  imgUrl: any
  constructor(private service: SharedService, private toastr: ToastrService, private route: ActivatedRoute) {
    this.imgUrl = environment.imageUrl
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
    this.swissDate = moment.tz('Europe/Zurich');
    // Converts to Date object in Switzerland timezone
  }

  getUserOffers() {
    const apiUrl = 'admin/getAllUsersOffers';
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {

        if (this.offerUniqueId() == 0) {
          this.userOfferData = res.data.map((item: any) => {
            // Convert end_date to Date if it's a string
            const endDateUTC = moment(item.end_date).utc().format('YYYY-MM-DD HH:mm:ss');
            const swissDate = moment(this.swissDate).format('YYYY-MM-DD HH:mm:ss');

            if (endDateUTC <= swissDate) {
              item['status'] = item.offfer_buy_status == 1 ? 'Sold' : 'Not Sold';
            } else {
              item['status'] = 'Open';
            }

            return item; // Ensure each item is returned after modification
          });
        } else {
          this.alluserOfferData = res.data;
          const filteredOffer = res.data.filter((items: any) => items.offer_unique_id == this.offerUniqueId());
          this.userOfferData = filteredOffer.map((item: any) => {
            // Convert end_date to Date if it's a string
            const endDateUTC = moment(item.end_date).utc().format('YYYY-MM-DD HH:mm:ss');
            const swissDate = moment(this.swissDate).format('YYYY-MM-DD HH:mm:ss');

            if (endDateUTC <= swissDate) {
              item['status'] = item.offfer_buy_status == 1 ? 'Sold' : 'Not Sold';
            } else {
              item['status'] = 'Open';
            }

            return item; // Ensure each item is returned after modification
          });
          this.searchInput.nativeElement.value = this.offerUniqueId()
        }
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
            if (endDateUTC <= swissDate) {
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
    if (this.offerUniqueId() != 0) {
      this.service.resetOfferUniqueSignal()
      this.userOfferData = this.alluserOfferData.map((item: any) => {
        // Convert end_date to Date if it's a string
        const endDateUTC = moment(item.end_date).utc().format('YYYY-MM-DD HH:mm:ss');
        const swissDate = moment(this.swissDate).format('YYYY-MM-DD HH:mm:ss');

        if (endDateUTC <= swissDate) {
          item['status'] = item.offfer_buy_status == 1 ? 'Sold' : 'Not Sold';
        } else {
          item['status'] = 'Open';
        }

        return item; // Ensure each item is returned after modification
      });
      table.clear();
      this.searchInput.nativeElement.value = ''
    } else {
      table.clear();
      this.searchInput.nativeElement.value = ''
    }
  };


  deleteOffer(id: any) {
    this.service.delete(`product/offerDeleteById?offerId=${id}`).subscribe((res: any) => {
      if (res.success) {
        this.toastr.success(res.message);
        this.getUserOffers()
        // this.priceSuggested = res.prices/
      } else {
        // this.toastr.error(res.message)
      }
    })
  }


  viewImage(id: any) {
    this.service.get(`admin/getAllOfferImagesById?id=${id}`).subscribe((res: any) => {
      if (res.success) {
        this.images = res.data
      } else {
        this.images = null
      }
    })
  }

  ngOnDestroy() {
    this.service.resetOfferUniqueSignal()
  }

}
