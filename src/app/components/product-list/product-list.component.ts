import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined
  productData: any[] = []
  productForm!: FormGroup;
  loading: boolean = false;
  cat_id: any;
  categoryName: any;

  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.cat_id = params['id'];
    });

    this.productForm = this.fb.group({
      name: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.getCategories()
  }

  getCategories() {
    let apiUrl = `admin/getProductByCategoryId?category_id=${this.cat_id}`
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.categoryName = res.productList.category
        this.productData = res.productList.products
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

    let apiUrl = `admin/addProduct`
    let formData = new URLSearchParams()
    formData.set('name', form.value.name)
    formData.set('category_id', this.cat_id)
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
    const control = this.productForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  }
}
