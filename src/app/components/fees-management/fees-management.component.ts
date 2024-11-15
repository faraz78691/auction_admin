import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fees-management',
  templateUrl: './fees-management.component.html',
  styleUrl: './fees-management.component.css'
})
export class FeesManagementComponent {
  feeData: any[] = [];
  loading: boolean = false;

  constructor(public service: SharedService, private toastr: ToastrService,) {

  }

  ngOnInit() {
    this.getCategories()
  };

  getCategories() {
    let apiUrl = 'buyer/getAllAdminCommissionFees'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.feeData = res.data
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };
}
