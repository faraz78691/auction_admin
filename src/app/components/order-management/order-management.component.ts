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
  userId:number | undefined;
    constructor(private service: SharedService, private toastr: ToastrService, private route: ActivatedRoute) {
  
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
    }


}
