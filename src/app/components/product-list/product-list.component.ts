import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  @ViewChild('closeModal2') closeModal2: ElementRef | undefined
  productData: any[] = []
  productForm!: FormGroup;
  loading: boolean = false;
  cat_id: any;
  productId: any;
  categoryName: any;

  constructor(public service: SharedService, private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.cat_id = params['id'];
    });

    this.productForm = this.fb.group({
      name: ['', [Validators.required, NoWhitespaceDirective.validate]]
    })
  }

  ngOnInit() {
    this.getCategories()
  }

  getCategories() {
    let apiUrl = `admin/getProductByCategoryId?category_id=${this.cat_id}`
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.categoryName = res.productList.category?.cat_name;
        this.productData = res.productList.products;
        this.service.setCategoryData(res.productList.category.id, res.productList.category.cat_name)
      } else {
        this.categoryName = res.category.cat_name
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };

  onClickUpdate(item: any) {
    this.productId = item.id;
    this.productForm.patchValue({
      name: item.name
    });
  };

  onSubmit(form: any, formType: number) {
    this.loading = true
    form.markAllAsTouched()
    if (form.invalid) {
      this.loading = false
      return
    }

    if (form.value.name.trim().length == 0) {
      return
    }


    let formData = new URLSearchParams()
    if (formType == 1) {
      var apiUrl = `admin/addProduct`
      formData.set('name', form.value.name)
      formData.set('category_id', this.cat_id)
    } else {
      var apiUrl = `admin/updateProductByProductId`
      formData.set('product_id', Number(this.productId).toString())
      formData.set('name', form.value.name)
    }
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.closeModal?.nativeElement.click();
        this.closeModal2?.nativeElement.click();
        this.productForm.reset()
        this.getCategories()
        this.loading = false
      } else {
        this.toastr.error("No Products found")
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
  };

  // Method to navigate back
  // goBack(): void {
  //   this.location.back();  // Navigate to the previous page
  // }
}

export class NoWhitespaceDirective {
  static validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.trim() == '') {
      return { required: true };
    }
    return null;
  }
}