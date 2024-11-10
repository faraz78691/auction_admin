import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brands-model',
  templateUrl: './brands-model.component.html',
  styleUrl: './brands-model.component.css'
})
export class BrandsModelComponent {
  attr_id :number | undefined;
 modelsList:any[]= [];
 modelName:string | undefined;
 modelId:number | undefined
  attrName: any;
  productName: any;
  categoryData: any;
  attributeMapping: any;
  brandName: any;
  constructor(public service: SharedService, private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.attr_id = params['id'];
    });

    // this.attributeForm = this.fb.group({
    //   attribute_value_name: ['', [Validators.required]],
    // })
  };
  // addSubAttributesMapping

  ngOnInit() {
    this.getModels();
  };

  getModels() {
    let apiUrl = `admin/getSubAttributesByProductAttributesMappingId?attribute_mapping_id=${this.attr_id}`
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.attrName = res.attributeType;
        this.productName = res.product;
        this.categoryData = res.category;
        this.attributeMapping = res.attribute_mapping_name;
        this.brandName = res.attributeMapping;
       this.modelsList = res.subAttributeData;
      } else {
        // this.productName = res.attributeName
        this.attrName = res.attributeType;
        this.productName = res.product;
        this.categoryData = res.category;
        this.attributeMapping = res.attribute_mapping_name;
        this.brandName = res.attributeMapping;
       
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
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
     this.getModels()
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

  onClickUpdate(item: any) {
    this.modelId = item.id;
    this.modelName = item.value;
  
  };

  // onSubmit(form: any) {
  //   this.loading = true
  //   form.markAllAsTouched()
  //   if (form.invalid) {
  //     this.loading = false
  //     return
  //   }

  //   let apiUrl = `admin/addProductAttributes`
  //   let formData = new URLSearchParams()
  //   formData.set('attribute_value_name', form.value.attribute_value_name)
  //   formData.set('product_id', this.pro_id)
  //   formData.set('attribute_id', this.attr_id)


  //   this.service.post(apiUrl, formData.toString()).subscribe(res => {
  //     if (res.success) {
  //       this.toastr.success(res.message)
  //       this.closeModal?.nativeElement.click()
  //       this.attributeForm.reset()
  //       this.getProAttributes()
  //       this.loading = false
  //     } else {
  //       this.toastr.error(res.message)
  //       this.loading = false
  //     }
  //   })
  // };

}
