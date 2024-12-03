import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-fetured-products',
  templateUrl: './fetured-products.component.html',
  styleUrl: './fetured-products.component.css'
})
export class FeturedProductsComponent {
  getErrorMessage(arg0: string) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  @ViewChild('closeModal2') closeModal2: ElementRef | undefined;
  @ViewChild('dt') table!: Table;
  Form!: FormGroup;
  loading: boolean = false;
  categoryId: number | undefined;
  imgUrl
  data: any[] = []
  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder,) {
    this.imgUrl = environment.imageUrl
    this.Form = this.fb.group({
      featured_image: ['']
    })
  }

  ngOnInit() {
    this.getData()
  };

  getData() {
    let apiUrl = 'admin/get-allfeaturedproduct'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.data = res.data
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };


  onClickUpdate(item: any) {
    this.categoryId = item.id;
    this.uploadedImage = this.imgUrl + item.featured_image
  };

  onSubmit(form: any, formType: number) {
    let formData = new FormData()
    var apiUrl = `admin/update-featuredproductbyid`
    formData.append('id', Number(this.categoryId).toString())
    formData.append('featured_image', this.uploadImg)

    this.service.upload(apiUrl, formData).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message);
        this.Form.reset();
        this.uploadImg = this.uploadedImage = undefined
        this.closeModal?.nativeElement.click();
        this.closeModal2?.nativeElement.click();
        this.getData()
        this.categoryId = undefined;
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  uploadImg: any
  uploadedImage: any

  ngFileInputChange(e: any) {
    this.uploadImg = e.target.files[0]
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
