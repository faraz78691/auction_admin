import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-user-offer',
  templateUrl: './user-offer.component.html',
  styleUrl: './user-offer.component.css'
})
export class UserOfferComponent {
  userOfferData: any[] = []

  constructor(private service: SharedService, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.getUserOffers()
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
  }
}
