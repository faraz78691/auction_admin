import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  data: any;
  loading: boolean = false;

  constructor(public service: SharedService, private toastr: ToastrService,) {

  }

  ngOnInit() {
    this.getDashboardData()
  };

  getDashboardData() {
    let apiUrl = 'admin/dashboard'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.data = res.data
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };
}
