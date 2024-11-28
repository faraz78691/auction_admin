import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { SharedService } from '../../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-sub-heading',
  templateUrl: './sub-heading.component.html',
  styleUrl: './sub-heading.component.css'
})
export class SubHeadingComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  @ViewChild('closeModal2') closeModal2: ElementRef | undefined;
  @ViewChild('dt') table!: Table;
  headingData: any[] = []
  Form!: FormGroup;
  loading: boolean = false;
  headingId: any;
  editor!: Editor;
  editor2!: Editor;
  html = '';
  subHeadingId: any
  constructor(private service: SharedService, private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.headingId = params['id'];
    });

    this.Form = this.fb.group({
      sub_heading: [''],
      description: ['']
    })
  }

  ngOnInit() {
    this.editor = new Editor();
    this.editor2 = new Editor();
    this.getHeadings()
  };

  getHeadings() {
    let apiUrl = `admin/get-termsubheading?heading_id=${this.headingId}`
    this.service.get(apiUrl).subscribe((res: any) => {
      if (res.success) {
        this.headingData = res.data
      } else {
        this.toastr.error(res.message)
      }
    }, (err: any) => {
      // this.toastr.error(err)
      this.headingData = []
    })
  };

  onClickUpdate(item: any) {
    this.subHeadingId = item.id
    this.Form.patchValue({
      sub_heading: item.sub_heading,
      description: item.description
    });
  };

  onSubmit(form: any, formType: number) {
    // if (form.value.sub_heading.trim().length == 0) {
    //   return
    // }
    this.loading = true
    form.markAllAsTouched()
    if (form.invalid) {
      this.loading = false
      return
    };

    let formData = new URLSearchParams()
    if (formType == 1) {
      var apiUrl = `admin/add-termcondition`
      formData.set('parent_id', this.headingId)

      if (form.value.sub_heading) {
        formData.set('sub_heading', form.value.sub_heading)
      }
      if (form.value.description) {
        formData.set('description', form.value.description)
      }
    } else {
      var apiUrl = `admin/update-termcondition`
      formData.set('id', this.subHeadingId)
      if (form.value.sub_heading) {
        formData.set('sub_heading', form.value.sub_heading)
      }
      if (form.value.description) {
        formData.set('description', form.value.description)
      }
    }

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message);
        this.Form.reset();
        this.closeModal?.nativeElement.click();
        this.closeModal2?.nativeElement.click();
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
