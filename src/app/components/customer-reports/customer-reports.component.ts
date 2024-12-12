import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-reports',
  templateUrl: './customer-reports.component.html',
  styleUrl: './customer-reports.component.css'
})
export class CustomerReportsComponent {
  reportData: any[] = [];
  loading: boolean = false;

  constructor(public service: SharedService, private toastr: ToastrService,) {

  }

  ngOnInit() {
    this.getReportss()
  };

  getReportss() {
    let apiUrl = 'admin/get-allreports'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.reportData = res.data
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };
}
