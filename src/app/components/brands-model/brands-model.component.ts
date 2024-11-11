import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  @ViewChild('closeModal2') closeModal2: ElementRef | undefined;
  attr_id :number | undefined;
 modelsList:any[]= [];
 modelName:string= '';
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

  onSubmit() {
  
  if(this.modelName.trim().length == 0){
    return
  }

    let apiUrl = `admin/addSubAttributesMapping`
    let formData = new URLSearchParams()
    formData.set('attribute_mapping_id', this.attr_id!.toString())
    formData.set('value', this.modelName)
  

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.getModels()
        this.toastr.success(res.message)
        this.modelName = ''
        this.closeModal?.nativeElement.click()
     
      } else {
        this.toastr.error(res.message)
    
      }
    })
  };


  updateAttr(){
  
    if(this.modelName.trim().length == 0){
      return
    }
    const apiUrl = `admin/updateSubAttributesById`
    
    let formData = new URLSearchParams();
    formData.set('id', this.modelId!.toString())
    formData.set('value', this.modelName)
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)

        this.closeModal2?.nativeElement.click();
        this.getModels()
      
      } else {
        this.toastr.error("Failed to update")
        this.closeModal2?.nativeElement.click();
     
      }
    })
  }

}
