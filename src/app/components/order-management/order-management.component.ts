import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent {
  userOfferData: any[] = []
  orderSummary: any;
  userId: number | undefined;
  constructor(public service: SharedService, private toastr: ToastrService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getAllTransaction()
  };


  getAllTransaction() {
    let apiUrl = `admin/getAllTransaction`;

    this.service.get(apiUrl).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userOfferData = res.transdactionData;
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

  OpenSummaryModal(items: any) {
    console.log(items);
    let formData = new URLSearchParams()

    var apiUrl = `buyer/ordersummary`
    formData.set('offer_id', items.offer_id)
    formData.set('buyer_id', items.buyer_id)
    formData.set('seller_id', items.seller_id)

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {

        this.orderSummary = res.data;
        console.log(this.orderSummary);
      } else {
        this.toastr.error("No Products found")
      }
    })
  }


}
