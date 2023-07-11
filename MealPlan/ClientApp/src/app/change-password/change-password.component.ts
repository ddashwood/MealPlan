import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  public formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
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
    
  }
}
