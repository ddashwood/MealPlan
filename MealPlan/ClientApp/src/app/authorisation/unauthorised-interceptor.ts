import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class UnauthorisedInterceptor implements HttpInterceptor {
    constructor(private router: Router){

    }
    intercept (request: HttpRequest<unknown>, next: HttpHandler) : Observable<HttpEvent<unknown>> {
        // The login page needs to be able to handle Unauthorised messages itself
        if (this.router.url === '/login') {
            return next.handle(request);
        }

        // For every other page, we handle Unauthorised messages here by directing the user to the logon page
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if(error.status === 401 || error.status === 403){
                        this.router.navigate(["/login"]);
                        return of();
                    }

                    return throwError(() => new Error(error.message));
                })
            )
    }
}