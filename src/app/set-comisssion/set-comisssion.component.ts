import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-set-comisssion',
  templateUrl: './set-comisssion.component.html',
  styleUrl: './set-comisssion.component.css'
})
export class SetComisssionComponent {
  currentCommission = 10; // Example default value
  newCommission!: number | undefined;
userData:any[]=[]  
constructor(private service: SharedService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getUserList()
  }
  updateCommission(): void {
    if (this.newCommission != null && this.newCommission >= 0 && this.newCommission <= 100) {
      this.currentCommission = this.newCommission;
      const formData = new URLSearchParams();
      formData.append('id', '1');
      formData.append('commission', this.currentCommission.toString());
    
  
  
      this.service
        .post('admin/update-setting', formData.toString())
        .subscribe((res: any) => {
         
          if (res.success == true) {
            this.newCommission  = undefined
            this.toastr.success(res.message);
            // this.orderSummary = res.data;
          } else {
          }
        });
    
    } else {
      this.toastr.warning('Please enter a valid commission value (0-100).');
    }
  };

  getUserList() {
    let apiUrl = 'admin/get-setting'

    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
      
          this.currentCommission = res.transdactionData[0].commission
        
      } else {
        this.toastr.warning(res.message);
      }
    }, (err: any) => {
      this.toastr.error(err);
    });
  };

  
}
