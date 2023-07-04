import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService, LoginDto } from 'src/libs/api-client';
import { JWTTokenService } from '../services/jwt-token-service/jwttoken.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})  
export class LoginComponent {
  constructor(private identityService: IdentityService, private authService: JWTTokenService, private router: Router) {
  }

  loginDetails: LoginDto = <LoginDto>{};
  errorMessage: string | null = null;

  onLogin() {
    this.identityService.apiIdentityLoginPost(this.loginDetails)
      .subscribe({ next: results => {
        this.authService.setToken(results);
        this.router.navigate(['/']);
      }, error: error => {
        if(error.status == 401) {
          this.errorMessage = "The username/password is not correct";
        } else {
          this.errorMessage = error.message;
        }
      }})
  }
}
