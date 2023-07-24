import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JWTTokenService } from '../services/jwt-token-service/jwttoken.service';

@Injectable()
export class ViewerRouteGuard  {
    constructor(private tokenService: JWTTokenService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.tokenService.userCanView();
    }

}