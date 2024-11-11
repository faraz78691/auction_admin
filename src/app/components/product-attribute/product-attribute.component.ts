import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
@Component({
  selector: 'app-product-attribute',
  templateUrl: './product-attribute.component.html',
  styleUrl: './product-attribute.component.css'
})
export class ProductAttributeComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined
  @ViewChild('closeModal2') closeModal2: ElementRef | undefined
  attributeData: any[] = []
  attributeForm!: FormGroup;
  loading: boolean = false;
  attr_id: any;
  productName: any;
  attrName: any;
  categoryData: any;
  pro_id: any;
  attrValue:any;
  attrMappingID:any
  constructor(public service: SharedService,private location: Location, private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.attr_id = params['attr_id'];
      this.pro_id = params['pro_id'];
    });

    this.attributeForm = this.fb.group({
      attribute_value_name: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.getProAttributes();
  }

  getProAttributes() {
    let apiUrl = `admin/getAttributesByAttributeTypeId?attribute_id=${this.attr_id}`
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.attrName = res.attributeName;
        this.productName = res.product.name;
        this.categoryData = res.category;
        this.attributeData = res.typeAttributes;
      } else {
        this.attrName = res.attributeName;
        this.productName = res.product.name;
        this.categoryData = res.category;

      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  }

  onSubmit(form: any) {
    if(this.attrValue.trim().length == 0){
      return
    }
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
  };

  updateAttr(){
    if(this.attrValue.trim().length == 0){
      return
    }
    const apiUrl = `admin/updateProductAttributeMapping`
    
    let formData = new URLSearchParams();
    formData.set('id', this.attrMappingID)
    formData.set('attribute_value_name', this.attrValue)
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.closeModal?.nativeElement.click();
        this.closeModal2?.nativeElement.click();
        this.getProAttributes()
        this.loading = false
      } else {
        this.toastr.error("No Products found")
        
        this.loading = false;
      }
    })
  }

  onClickUpdate(item: any) {
    this.attrMappingID = item.id;
    this.attrValue = item.attribute_value_name;
  };


  getErrorMessage(field: string) {
    const control = this.attributeForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  };


  deleteTypeATR(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
 
        const formURlData = new URLSearchParams();

        formURlData.set('product_attribute_id', id.toString());
      
      this.service.post('admin/deleteProductAttributeMapping', formURlData.toString()).subscribe({
        next: (resp) => {
  
          if (resp.success == true) {
     this.getProAttributes()
        }
      },
        error: (error) => {
          //this.loading = false;
        
          console.error('Login error:', error.message);
        }
      });
      }
    })
  };

   // Method to navigate back
   goBack(): void {
    this.location.back();  // Navigate to the previous page
  }
}
