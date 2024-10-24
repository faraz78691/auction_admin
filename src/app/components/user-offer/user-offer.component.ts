import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-offer',
  templateUrl: './user-offer.component.html',
  styleUrl: './user-offer.component.css'
})
export class UserOfferComponent {
  userOfferData: any[] = []
userId:number | undefined;
  constructor(private service: SharedService, private toastr: ToastrService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.userId = params['id']
      console.log(this.userId)
    });

    if(this.userId != undefined){
this.getUserOffersByUserId()
    }else{
      this.getUserOffers()
    }
  }

  getUserOffers() {
    let apiUrl = 'admin/getAllUsersOffers'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.userOfferData = res.data
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };

  getUserOffersByUserId() {
    let apiUrl = `admin/getAllOffersByUserId?user_id=${this.userId}`;
    
    this.service.get(apiUrl).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userOfferData = res.data;
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
