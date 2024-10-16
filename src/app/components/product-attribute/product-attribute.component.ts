import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-attribute',
  templateUrl: './product-attribute.component.html',
  styleUrl: './product-attribute.component.css'
})
export class ProductAttributeComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined
  attributeData: any[] = []
  attributeForm!: FormGroup;
  loading: boolean = false;
  attr_id: any;
  productName: any;
  pro_id: any;

  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.attr_id = params['attr_id'];
      this.pro_id = params['pro_id'];
    });

    this.attributeForm = this.fb.group({
      attribute_value_name: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.getProAttributes()
  }

  getProAttributes() {
    let apiUrl = `admin/getAttributesByAttributeTypeId?attribute_id=${this.attr_id}`
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.productName = res.attributeName
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

    let apiUrl = `admin/addProductAttributes`
    let formData = new URLSearchParams()
    formData.set('attribute_value_name', form.value.attribute_value_name)
    formData.set('product_id', this.pro_id)
    formData.set('attribute_id', this.attr_id)


    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.closeModal?.nativeElement.click()
        this.attributeForm.reset()
        this.getProAttributes()
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
