import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrl: './attribute.component.css'
})
export class AttributeComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined
  attributeData: any[] = []
  attributeForm!: FormGroup;
  loading: boolean = false;
  cat_id: any;
  productName: any;
  pro_id: any;

  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.cat_id = params['cat_id'];
      this.pro_id = params['pro_id'];
    });

    this.attributeForm = this.fb.group({
      attribute_name: ['', [Validators.required]],
      heading: ['', [Validators.required]],
      input_type: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.getAttributes()
  }

  getAttributes() {
    let apiUrl = `admin/getTypeAttributesByProductId?product_id=${this.pro_id}`
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.productName = res.product.name
        this.attributeData = res.typeAttributes
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

    let apiUrl = `admin/addProductTypeAttributes`
    let formData = new URLSearchParams()
    formData.set('attribute_name', form.value.attribute_name)
    formData.set('heading', form.value.heading)
    formData.set('input_type', form.value.input_type)
    formData.set('product_id', this.pro_id)
    formData.set('category_id', this.cat_id)


    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.closeModal?.nativeElement.click()
        this.getAttributes()
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }


  getErrorMessage(field: string) {
    const control = this.attributeForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  }
}
