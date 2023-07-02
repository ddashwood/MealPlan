import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration, IdentityService, LoginDto } from 'src/libs/api-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})  
export class LoginComponent {
  constructor(private identityService: IdentityService, private configuration: Configuration, private router: Router) {
  }

  loginDetails: LoginDto = <LoginDto>{};
  errorMessage: string | null = null;

  onLogin() {
    console.log(this.loginDetails.userName);
    console.log(this.loginDetails.password);

    this.identityService.apiIdentityLoginPost(this.loginDetails)
      .subscribe({ next: results => {
        this.configuration.credentials["Token"] = results;
        this.router.navigate(['/']);
      }, error: error => {
        console.log(error);
        if(error.status == 401) {
          this.errorMessage = "The username/password is not correct";
        } else {
          this.errorMessage = error.message;
        }
      }})
  }
}
