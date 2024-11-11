import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrl: './attribute.component.css',
})
export class AttributeComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  attributeData: any[] = [];
  attributeForm!: FormGroup;
  loading: boolean = false;
  selectHeader = false;
  heading = false;
  otherType = false;
  selectedAttribute: any;
  mainHeading: any;
  cat_id: any;
  productName: any;
  pro_id: any;
  otherHeading:any;
  attributeId:any;
  attributeType:any;
  categoryData:any;
  editHeading:any;
  selectedInputs: any[] = [];
  miscInputd: any[] = [
    { type: 'Gender' },
    { type: 'Size' },
    { type: 'Compatiblity' },
    { type: 'Guarantee' },
    { type: 'Other' },
  ];

  selectBoxData = [
    { type: 'Type', input: [{ type: 'select' }] },
    { type: 'Brand', input: [{ type: 'select' }] },
    { type: 'Material', input: [{ type: 'select' }] },
    { type: 'Color', input: [{ type: 'checkbox' }] },
    { type: 'Country', input: [{ type: 'select' }] },
    { type: 'Compatibility', input: [{ type: 'select' }] },
    {
      type: 'Miscellaneous',
      input: [
        { type: 'select' },
        { type: 'checkbox' },
        { type: 'input' },
        { type: 'radio' },
      ],
    },
  ];

  constructor(
    public service: SharedService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    console.log(this.service.categoryData());
    this.route.params.subscribe((params) => {
      this.cat_id = params['cat_id'];
      this.pro_id = params['pro_id'];
    });

    this.attributeForm = this.fb.group({
      attribute_name: ['null', [Validators.required]],
      heading: ['', ],
      input_type: ['null',[Validators.required]],
    });
  }

  ngOnInit() {
    this.getAttributes();
  }

  getAttributes() {
    let apiUrl = `admin/getTypeAttributesByProductId?product_id=${this.pro_id}`;
    this.service.get(apiUrl).subscribe(
      (res: any) => {
        if (res.success) {
          this.productName = res.product.name;
          this.categoryData = res.category;
          this.service.setProductData(res.product.id, res.product.name);
          this.attributeData = res.typeAttributes;
        } else {
          this.productName = res.product.name;
          this.categoryData = res.category;
          this.service.setProductData(res.product.id, res.product.name);
         
        }
      },
      (err: any) => {
        this.toastr.error(err);
      }
    );
  }

  onSubmit(form: any) {
    this.loading = true;
    form.markAllAsTouched();
    if (form.invalid) {
      console.log(form.value)
      this.loading = false;
      return;
    }

    if(form.value.attribute_name.trim().length == 0){
      return
    }

    let apiUrl = `admin/addProductTypeAttributes`;
    let formData = new URLSearchParams();
    formData.set('attribute_name', form.value.attribute_name);
    if(this.selectHeader == true){
      if(this.otherType == true){
        formData.set('heading', this.otherHeading);
      }else{
        console.log("sfgg");
        
        formData.set('heading', this.mainHeading);
      }

    }else{
      formData.set('heading', form.value.heading);
    }
    formData.set('input_type', form.value.input_type);
    formData.set('product_id', this.pro_id);
    formData.set('category_id', this.cat_id);

    this.service.post(apiUrl, formData.toString()).subscribe((res) => {
      if (res.success) {
        this.service.showSuccess(res.message);
        this.closeModal?.nativeElement.click();
        this.attributeForm.reset();
        this.getAttributes();
        this.loading = false;
        this.otherType = false;
        this.heading = false;
        this.selectHeader = false;
      } else {
        this.toastr.error(res.message);
        this.loading = false;
      }
    });
  }

  getErrorMessage(field: string) {
    const control = this.attributeForm.controls[field];
    if (control.hasError('required')) {
      return 'This field cannot be empty';
    }
    return '';
  }

  onAttributeChange(event: any) {
    const selectedAttribute = event.target.value;
    this.selectedAttribute = selectedAttribute;
    console.log(selectedAttribute);
    const selectedOption = this.selectBoxData.find(
      (item) => item.type === selectedAttribute
    );
    this.selectedInputs = selectedOption ? selectedOption.input : [];
    if(this.selectedAttribute != 'Miscellaneous'){
      this.heading = true;
      this.attributeForm.patchValue({
        input_type: this.selectedInputs[0].type, 
      });
    }
    console.log(this.selectedInputs);
  }

  onInputChange(event: any) {
    console.log(event.target.value);
    this.heading = true;
    if (event.target.value) {
      if (
        event.target.value == 'select' &&
        this.selectedAttribute == 'Miscellaneous'
      ) {
        this.selectHeader = true;
      } else {
        this.selectHeader = false;
      }
    }
  }

  onHeadingChange(event: any) {
    console.log(event.target.value)
    if (event.target.value == 'Other') {
      this.otherType = true;
    }else{
      this.otherType = false;

    }
    
  }

  deleteTypeATR(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const formURlData = new URLSearchParams();

        formURlData.set('product_type_id', id.toString());

        this.service
          .post('admin/deleteProductTypeAttribute', formURlData.toString())
          .subscribe({
            next: (resp) => {
              if (resp.success == true) {
                this.getAttributes();
              }
            },
            error: (error) => {
              //this.loading = false;

              console.error('Login error:', error.message);
            },
          });
      }
    });
  };

  onClickUpdate(item: any) {
    this.attributeId = item.id;
    this.attributeForm.patchValue({
      name: item.name
    });
  };

  onClose(){
    this.attributeForm.reset();
    this.heading = false;
    this.closeModal?.nativeElement.click();
  };


    // Method to navigate back
    // goBack(): void {
    //   this.location.back();  // Navigate to the previous page
    // }
  
}
