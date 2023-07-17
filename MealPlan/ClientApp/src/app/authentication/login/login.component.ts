import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService, LoginDto } from 'src/libs/api-client';
import { JWTTokenService } from '../../services/jwt-token-service/jwttoken.service';

@Component({
  selector: 'authentication-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})  
export class LoginComponent {
  constructor(private identityService: IdentityService, private authService: JWTTokenService, private router: Router) {
  }

  loginDetails: LoginDto = <LoginDto>{};
  rememberMe: boolean = false;
  errorMessage: string | null = null;

  onLogin() {
    this.identityService.apiIdentityLoginPost(this.loginDetails, undefined, undefined, { httpHeaderAccept: 'text/plain' })
      .subscribe({ next: results => {
        this.authService.setToken(results, this.rememberMe);
        this.router.navigate(['/mealplan']);
      }, error: error => {
        if(error.status == 401) {
          this.errorMessage = "The username/password is not correct";
        } else {
          this.errorMessage = error.message;
        }
      }})
  }
}
