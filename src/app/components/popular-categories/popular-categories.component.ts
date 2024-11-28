import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-popular-categories',
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css'
})
export class PopularCategoriesComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  @ViewChild('closeModal2') closeModal2: ElementRef | undefined;
  @ViewChild('dt') table!: Table;
  categoryData: any[] = []
  popularCatData: any[] = []
  categoryForm!: FormGroup;
  loading: boolean = false;
  categoryId: number | undefined;
  imgUrl
  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder,) {
    this.imgUrl = environment.imageUrl
    this.categoryForm = this.fb.group({
      cat_name: ['', [Validators.required]],
      cat_Image: ['']
    })
  }

  ngOnInit() {
    this.getCategories()
    this.getPopularCategories()
  };

  getCategories() {
    let apiUrl = 'admin/getAllCategory'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.categoryData = res.insertId
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };

  getPopularCategories() {
    let apiUrl = 'admin/getAllPopularCategory'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.popularCatData = res.insertId
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };

  onClickUpdate(item: any) {
    this.categoryId = item.id;
    this.categoryForm.patchValue({
      cat_name: item.category_name
    });
    this.uploadedImage = this.imgUrl + item.category_image
  };

  onSubmit(form: any, formType: number) {
    if (form.value.cat_name.trim().length == 0) {
      return
    }
    this.loading = true
    form.markAllAsTouched()
    if (form.invalid) {
      this.loading = false
      return
    };

    let formData = new FormData()
    if (formType == 1) {
      var apiUrl = `admin/addPopularCategory`
      formData.append('cat_name', form.value.cat_name)
      formData.append('cat_image', this.uploadImg)
    } else {
      var apiUrl = `admin/updatePopularCategoryById`
      formData.append('category_id', Number(this.categoryId).toString())
      formData.append('cat_image', this.uploadImg)
      formData.append('cat_name', form.value.cat_name)
    }

    this.service.upload(apiUrl, formData).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message);
        this.categoryForm.reset();
        this.closeModal?.nativeElement.click();
        this.closeModal2?.nativeElement.click();
        this.categoryId = undefined;
        this.getPopularCategories()
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

  Delete(id: any) {
    let formData = new URLSearchParams()
    formData.set('category_id', id)
    this.service.post('admin/deletePopularCategoryById', formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message);
        this.getPopularCategories()
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  getErrorMessage(field: string) {
    const control = this.categoryForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  }
}
