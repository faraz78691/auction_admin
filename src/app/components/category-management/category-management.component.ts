import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  @ViewChild('closeModal2') closeModal2: ElementRef | undefined;
  @ViewChild('dt') table!: Table;
  categoryData: any[] = []
  categoryForm!: FormGroup;
  loading: boolean = false;
  categoryId: number | undefined;
  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder,) {
    this.categoryForm = this.fb.group({
      cat_name: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.getCategories()
  };

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
  };

  onClickUpdate(item: any) {
    this.categoryId = item.id;
    this.categoryForm.patchValue({
      cat_name: item.cat_name
    });
  };

  onSubmit(form: any, formType: number) {
    if(form.value.cat_name.trim().length == 0){
      return
    }
    this.loading = true
    form.markAllAsTouched()
    if (form.invalid) {
      this.loading = false
      return
    };

    let formData = new URLSearchParams()
    if (formType == 1) {
      var apiUrl = `admin/addCategory`
      formData.set('cat_name', form.value.cat_name)
    } else {
      var apiUrl = `admin/updateCategoryById`
      formData.set('category_id', Number(this.categoryId).toString())
      formData.set('cat_name', form.value.cat_name)
    }

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message);
        this.categoryForm.reset();
        this.closeModal?.nativeElement.click();
        this.closeModal2?.nativeElement.click();
        this.categoryId = undefined;
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
