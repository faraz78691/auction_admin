import { Component, computed, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Editor } from 'ngx-editor';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('dt2') table!: Table;
  userData: any[] = []
  loading: boolean = false;
  Form!: FormGroup;
  editor!: Editor;
  UserId = computed(() => {
    return this.service.user_signal()
  })
  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder) {
    this.Form = this.fb.group({
      email: [''],
      subject: [''],
      html: ['']
    })
  }

  ngOnInit() {
    this.editor = new Editor();
    this.getUserList()
  }

  getUserList() {
    let apiUrl = 'admin/getAllUsers'

    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        if (this.UserId() !== 0) {
          const currentUserId = this.UserId();
          this.userData = res.data.filter((user: any) => user.id === currentUserId);
          this.userData.forEach(customer => {
            if (customer.block_reason) {
              try {
                customer.parsedBlockReason = JSON.parse(customer.block_reason);
              } catch (error) {
                customer.parsedBlockReason = null;
              }
            } else {
              customer.parsedBlockReason = null;
            }
          });
        } else {
          this.userData = res.data
          this.userData.forEach(customer => {
            if (customer.block_reason) {
              try {
                customer.parsedBlockReason = JSON.parse(customer.block_reason);
              } catch (error) {
                customer.parsedBlockReason = null;
              }
            } else {
              customer.parsedBlockReason = null;
            }
          });
        }
      } else {
        this.toastr.warning(res.message);
      }
    }, (err: any) => {
      this.toastr.error(err);
    });
  }

  async blockUser(user_id: number, status: number) {
    if (status == 0) {
      const blockReasons = [
        { key: 'NON_PAYMENT', label: 'Non-payment of Commission', description: 'Seller did not pay the 5% commission after product sale.' },
        { key: 'FRAUD', label: 'Fraudulent Activity', description: 'Suspicious or verified fraudulent behavior detected.' },
        { key: 'TNC_VIOLATION', label: 'Violation of Terms and Conditions', description: 'User/Seller violated the website\'s policies or terms of service.' },
        { key: 'MISUSE', label: 'Misuse of Platform', description: 'Abusing features such as fake bids, false sales, or misleading product listings.' },
        { key: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content', description: 'Listing or posting prohibited, inappropriate, or offensive content.' },
        { key: 'COMPLAINTS', label: 'Repeated Complaints from Buyers/Sellers', description: 'Multiple unresolved complaints received from other users.' },
        { key: 'LOW_FULFILLMENT', label: 'Low Fulfillment Rate', description: 'Seller failed to ship products after confirming sales or canceled multiple transactions.' },
        { key: 'PAYMENT_ISSUES', label: 'Payment Issues', description: 'Payment discrepancies or refusal to process legitimate transactions.' },
        { key: 'FAKE_LISTINGS', label: 'Fake or Misleading Listings', description: 'Listings were found to be fake or intentionally misleading.' },
        { key: 'COMPROMISED_ACCOUNT', label: 'Account Compromised', description: 'Account is suspected to be compromised or used maliciously.' },
      ];

      (async () => {
        let selectedKey: string | null = null;
        let editedDescription = '';

        await Swal.fire({
          title: 'Select a reason',
          html: `
          <select id="reasonSelect" class="ct_input form-control ct_input_40" style="width: 100%; margin-bottom: 25px;">
            <option value="" disabled selected>Select a reason</option>
            ${blockReasons.map(reason => `<option value="${reason.label}">${reason.label}</option>`).join('')}
          </select>
          <textarea id="descriptionEdit" class="ct_input form-control" style="width: 100%;" placeholder="Description will appear here" disabled></textarea>
        `,
          showCancelButton: true,
          focusConfirm: false,
          preConfirm: () => {
            const reasonSelect = document.getElementById('reasonSelect') as HTMLSelectElement;
            const descriptionEdit = document.getElementById('descriptionEdit') as HTMLTextAreaElement;

            selectedKey = reasonSelect.value;
            editedDescription = descriptionEdit.value;

            if (!selectedKey) {
              Swal.showValidationMessage('Please select a reason.');
              return null;
            }

            return { selectedKey, editedDescription };
          },
          didOpen: () => {
            const reasonSelect = document.getElementById('reasonSelect') as HTMLSelectElement;
            const descriptionEdit = document.getElementById('descriptionEdit') as HTMLTextAreaElement;

            reasonSelect.addEventListener('change', () => {
              const selectedReason = blockReasons.find(reason => reason.label === reasonSelect.value);
              if (selectedReason) {
                descriptionEdit.value = selectedReason.description;
                descriptionEdit.disabled = false;
              } else {
                descriptionEdit.value = '';
                descriptionEdit.disabled = true;
              }
            });
          }
        }).then(result => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Are you sure?',
              text: "Blocking this user will prevent them from creating or bidding on any offers.",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, Block it!',
            }).then((result) => {
              if (result.isConfirmed) {

                const reson = {
                  label: selectedKey,
                  description: editedDescription
                }
                const formURlData = new URLSearchParams();
                formURlData.set('user_id', user_id.toString());
                formURlData.set('reason', JSON.stringify(reson));
                formURlData.set('status', '1');

                this.service
                  .post('admin/userBlockStatusUpdateById', formURlData.toString())
                  .subscribe({
                    next: (resp) => {
                      if (resp.success == true) {
                        this.toastr.success(resp.message)
                        this.getUserList();
                      }
                    },
                    error: (error) => {
                      console.error('Login error:', error.message);
                    },
                  });
              } else {
                this.getUserList();
              }
            });
          } else {
            this.getUserList();
          }
        });
      })();

    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "Unblocking this user will allow them to create and bid on offers again.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Unblock it!',
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();

          formURlData.set('user_id', user_id.toString());
          formURlData.set('reason', '""');
          formURlData.set('status', '0');

          this.service
            .post('admin/userBlockStatusUpdateById', formURlData.toString())
            .subscribe({
              next: (resp) => {
                if (resp.success == true) {
                  this.toastr.success(resp.message)
                  this.getUserList();
                }
              },
              error: (error) => {
                console.error('Login error:', error.message);
              },
            });
        } else {
          this.getUserList();
        }
      });
    }
  }

  onSubmit(form: any) {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set('email', form.value.email)
    formData.set('subject', form.value.subject)
    formData.set('html', form.value.html)

    this.service.post('admin/userSendQueriesByEmail', formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message);
        this.Form.reset();
        this.closeModal?.nativeElement.click();
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  onClickSend(item: any) {
    this.Form.patchValue({
      email: item.email,
    });
  };

  getErrorMessage(field: string) {
    const control = this.Form.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  }

  clear(table: any) {
    if (this.UserId() != 0) {
      this.service.resetUserSignal()
      this.getUserList();
      table.clear();
      this.searchInput.nativeElement.value = ''
    } else {
      table.clear();
      this.searchInput.nativeElement.value = ''
    }
  };

  ngOnDestroy() {
    this.service.resetUserSignal()
  }
}
