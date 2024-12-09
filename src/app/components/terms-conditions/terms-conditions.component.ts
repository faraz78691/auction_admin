import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.css'
})
export class TermsConditionsComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  @ViewChild('closeModal2') closeModal2: ElementRef | undefined;
  @ViewChild('dt') table!: Table;
  headingData: any[] = []
  Form!: FormGroup;
  loading: boolean = false;
  headingId: number | undefined;
  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder,) {
    this.Form = this.fb.group({
      heading: ['', [Validators.required, NoWhitespaceDirective.validate]]
    })
  }

  ngOnInit() {
    this.getHeadings()
  };

  getHeadings() {
    let apiUrl = 'admin/get-termheading'
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.headingData = res.data
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      this.toastr.error(err)
    })
  };

  onClickUpdate(item: any) {
    this.headingId = item.id;
    this.Form.patchValue({
      heading: item.heading
    });
  };

  onSubmit(form: any, formType: number) {
    if (form.value.heading.trim().length == 0) {
      return
    }
    this.loading = true
    form.markAllAsTouched()
    if (form.invalid) {
      this.loading = false
      return
    };

    let formData = new URLSearchParams()
    if (formType == 1) {
      var apiUrl = `admin/add-termcondition`
      formData.set('heading', form.value.heading)
    } else {
      var apiUrl = `admin/update-termcondition`
      formData.set('id', Number(this.headingId).toString())
      formData.set('heading', form.value.heading)
    }

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message);
        this.Form.reset();
        this.closeModal?.nativeElement.click();
        this.closeModal2?.nativeElement.click();
        this.headingId = undefined;
        this.getHeadings()
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  Delete(id: any) {
    let formData = new URLSearchParams()
    formData.set('category_id', id)
    this.service.get(`admin/delete-termcondition?id=${id}`).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message);
        this.getHeadings()
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  getErrorMessage(field: string) {
    const control = this.Form.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  }
}

export class NoWhitespaceDirective {
  static validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.trim() == '') {
      return { required: true };
    }
    return null;
  }
}