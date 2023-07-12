import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ChangePasswordDto, IdentityService } from 'src/libs/api-client';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  public formGroup: FormGroup;
  public errors: string[] = [];
  public submitting: boolean = false;

  constructor(formBuilder: FormBuilder, private identityService: IdentityService, private router: Router) {
    this.formGroup = formBuilder.group({
      'oldPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmPassword': ['', RxwebValidators.compare({fieldName:'newPassword'})]
    });
  }

  get passwordConfirmation() : AbstractControl<any, any> | null {
    return this.formGroup.get('confirmPassword');
  }

  public onChangePassword() {
    this.submitting = true;

    let dto = <ChangePasswordDto> {
      oldPassword: this.formGroup.value['oldPassword'],
      newPassword: this.formGroup.value['newPassword']
    };
    this.identityService.apiIdentityPasswordPut(dto)
    .subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(["/mealplan"]);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting = false;
          if(Array.isArray(err.error)) {
            this.errors = err.error;
          }
        }
      });
  }
}
