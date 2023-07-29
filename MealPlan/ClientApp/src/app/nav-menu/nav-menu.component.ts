import { Component } from '@angular/core';
import { JWTTokenService } from '../services/jwt-token-service/jwttoken.service';
import { Router } from '@angular/router';
import { VapidService } from '../services/vapid-service/vapid.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(private authService: JWTTokenService, private router: Router, private vapid: VapidService) {
    this.userName = authService.getUserName();
    authService.updated$.subscribe(() => this.getUserDetails(authService));
  }

  loggedIn: boolean = false;
  isViewer: boolean = false;
  userName: string | null = null;
  isExpanded: boolean = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authService.clearToken();
    this.router.navigate(["/"]);
  }

  subscribe() {
    this.vapid.subscribe();
  }

  private getUserDetails(authService: JWTTokenService) {
    this.loggedIn = !!authService.jwtToken;
    this.isViewer = authService.userCanView();
    this.userName = authService.getUserName();
  }
}
