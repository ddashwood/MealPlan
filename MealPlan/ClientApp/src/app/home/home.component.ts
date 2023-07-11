import { Component } from '@angular/core';
import { JWTTokenService } from '../services/jwt-token-service/jwttoken.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public loggedIn: boolean;

  constructor (authService: JWTTokenService) {
    this.loggedIn = !!authService.jwtToken;
    authService.updated$.subscribe(() => this.loggedIn = !!authService.jwtToken);
  }
}
