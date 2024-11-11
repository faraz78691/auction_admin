import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  showPassword: boolean = false;
  logInForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.noWhitespaceValidator]]
    })
  }

  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  };

  onSubmit() {
    this.loading = true;
  
    // Mark all form fields as touched and check validity
    if (this.logInForm.invalid) {
      this.logInForm.markAllAsTouched();
      this.loading = false;
      return;
    }
  
    // Set API endpoint and form data
    const apiUrl = `admin/login`;
    const formData = new URLSearchParams();
    formData.set('email', this.logInForm.value.email);
    formData.set('password', this.logInForm.value.password);
  
    // Make the HTTP request
    this.service.post(apiUrl, formData.toString()).subscribe({
      next: (res: any) => {
        this.loading = false;  // Reset loading state on success
        if (res.success) {
          console.log(res);
          this.service.setToken(res.token);
          localStorage.setItem('auctionAdminID', res.userinfo.id);
          this.toastr.success(res.message);
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res.message);
        }
      },
      error: () => {
        this.loading = false;  // Reset loading state on error
        this.toastr.error('Login failed');
      }
    });
  }
  
  // onSubmit(form: any) {
  //   this.loading = true
  //   form.markAllAsTouched()
  //   if (form.invalid) {
  //     this.loading = false
  //     return
  //   }

  //   let apiUrl = `admin/login`
  //   let formData = new URLSearchParams()
  //   formData.set('email', form.value.email);
  //   formData.set('password', form.value.password)
  //   this.service.post(apiUrl, formData.toString()).subscribe({
  //     next: res => {
  //     if (res.success) {
  //       console.log(res);
  //       this.service.setToken(res.token);
  //       localStorage.setItem('auctionAdminID',res.userinfo.id);
  //       this.toastr.success(res.message)
  //       this.router.navigate(['/dashboard'])
  //       this.loading = false
  //     } else {
  //       this.toastr.error(res.message)
  //       this.loading = false
  //     }
  //   },error => {
  //     this.toastr.error('Login failed');
  //   }
  // }
  // )
   
  // }

  getErrorMessage(field: string) {
    const control = this.logInForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address'
    }else if(control.hasError('whitespace')){
      return 'Enter valid password'
    }
    return ''
  }
}
