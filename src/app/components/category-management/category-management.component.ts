import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'jquery';
import 'datatables.net-bs5'; 
declare var $: any; // Declare jQuery globally
@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined
  categoryData: any[] = []
  categoryForm!: FormGroup;
  loading: boolean = false;

  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder,) {
    this.categoryForm = this.fb.group({
      cat_name: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.getCategories()
  };

  ngAfterViewInit(): void {
    // Initialize DataTable with Bootstrap 5 styling
    $('#example').DataTable({
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf'
      ],
      // Optional: Specify your custom options here
    });
  }

  getCategories() {
    let apiUrl = 'admin/getAllCategory'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.categoryData = res.insertId
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  }

  onSubmit(form: any) {
    this.loading = true
    form.markAllAsTouched()
    if (form.invalid) {
      this.loading = false
      return
    }

    let apiUrl = `admin/addCategory`
    let formData = new URLSearchParams()
    formData.set('cat_name', form.value.cat_name)
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.closeModal?.nativeElement.click()
        this.getCategories()
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }


  getErrorMessage(field: string) {
    const control = this.categoryForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  }
}
