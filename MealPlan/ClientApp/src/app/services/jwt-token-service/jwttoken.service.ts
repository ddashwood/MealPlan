import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import jwt_decode  from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {
  jwtToken: string = "";
  updated$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  constructor(private storage: LocalStorageService) {
    this.setToken(storage.get("token"))
  }

  setToken(token: string | null) {  
    if (token) {
      let decoded = (jwt_decode(token) as any);
      var exp = new Date(decoded['exp'] * 1000);
      if (exp < new Date()) {
        // The previous token has already expired
        return;
      }

      this.jwtToken = token;
      this.storage.set("token", token);
      this.updated$.next(undefined);
    }
  }

  clearToken() {
    this.jwtToken = "";
    this.storage.remove("token");
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
}
