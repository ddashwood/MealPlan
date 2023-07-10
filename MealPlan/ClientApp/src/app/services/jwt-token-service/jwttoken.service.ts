import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import jwt_decode  from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { SessionStorageService } from '../session-storage-service/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {
  jwtToken: string = "";
  updated$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  constructor(private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {
    var rememberedToken = localStorage.get("token");

    if (rememberedToken) {
      this.setToken(rememberedToken, true);
    } else {
      this.setToken(sessionStorage.get("token"), false);
    }
  }

  setToken(token: string | null, rememberMe: boolean) {  
    if (token) {
      let decoded = (jwt_decode(token) as any);
      var exp = new Date(decoded['exp'] * 1000);
      if (exp < new Date()) {
        // The previous token has already expired
        return;
      }

      this.jwtToken = token;
      if(rememberMe) {
        this.localStorage.set("token", token);
        this.sessionStorage.remove("token");
      } else {
        this.sessionStorage.set("token", token);
        this.localStorage.remove("token");
      }
      this.updated$.next(undefined);
    }
  }

  clearToken() {
    this.jwtToken = "";
    this.localStorage.remove("token");
    this.sessionStorage.remove("token");
    this.updated$.next(undefined);
  }

  getUserName() : string | null {
    if (!this.jwtToken) {
      return null;
    }
    let decoded = (jwt_decode(this.jwtToken) as any);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  }

  userIsInRole(roleName: string) : boolean {
    if (!this.jwtToken) {
      return false;
    }
    
    let decoded = (jwt_decode(this.jwtToken) as any);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].includes(roleName)
  }

  userCanView() : boolean {
    return this.userIsInRole('viewer') || this.userIsInRole('editor');
  }

  userCanEdit() : boolean {
    return this.userIsInRole('editor');
  }
}
