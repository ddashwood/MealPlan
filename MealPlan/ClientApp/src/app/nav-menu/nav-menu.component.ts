import { Component } from '@angular/core';
import { JWTTokenService } from '../services/jwt-token-service/jwttoken.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(private authService: JWTTokenService, private router: Router) {
    this.userName = authService.getUserName();
    authService.updated$.subscribe(() => this.getUserDetails(authService));
  }

  loggedIn: boolean = false;
  isViewer: boolean = false;
  userName: string | null = null;
  isExpanded: boolean = false;
  showUserDropdown: boolean = false;

  collapse() {
    this.isExpanded = false;
    this.showUserDropdown = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  // Bootstrap is supposed to handle toggling this dropdown for us. But it
  // only seems to work intermittently, perhaps because of an interfaction
  // with some other library, and I can't find the problem, so here we control
  // the dropdown manually instead.
  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout() {
    this.authService.clearToken();
    this.router.navigate(["/"]);
  }

  private getUserDetails(authService: JWTTokenService) {
    this.loggedIn = !!authService.jwtToken;
    this.isViewer = authService.userCanView();
    this.userName = authService.getUserName();
  }
}
