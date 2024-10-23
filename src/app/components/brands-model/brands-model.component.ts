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
  constructor(public service: SharedService, private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.attr_id = params['id'];
    
    });

    // this.attributeForm = this.fb.group({
    //   attribute_value_name: ['', [Validators.required]],
    // })
  };


  ngOnInit() {
    this.getModels();
  };

  getModels() {
    let apiUrl = `admin/getSubAttributesByProductAttributesMappingId?attribute_mapping_id=${this.attr_id}`
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
       this.modelsList = res.subAttributeData;
      } else {
        // this.productName = res.attributeName
        this.toastr.error(res.message)
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

}
