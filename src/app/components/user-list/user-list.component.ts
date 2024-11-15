import { Component, computed } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  userData: any[] = []
  loading: boolean = false;

  UserId = computed(() => {
    return this.service.user_signal()
  })
  constructor(private service: SharedService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getUserList()
  }

  getUserList() {
    let apiUrl = 'admin/getAllUsers'

    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        if (this.UserId() !== 0) {
          const currentUserId = this.UserId();
          this.userData = res.data.filter((user: any) => user.id === currentUserId);
        } else {
          this.userData = res.data
        }
      } else {
        this.toastr.warning(res.message);
      }
    }, (err: any) => {
      this.toastr.error(err);
    });
  }

  ngOnDestroy() {
    this.service.resetUserSignal()
  }
}
