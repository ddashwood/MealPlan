import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { IdentityService } from 'src/libs/api-client';
import { FormsModule } from '@angular/forms';
import { JWTTokenService } from 'src/app/services/jwt-token-service/jwttoken.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let identityMock : any;
  let authMock : any;
  let routerMock : any;

  beforeEach(async () => {
    identityMock = jasmine.createSpyObj('IdentityService', [ 'apiIdentityLoginPost' ]);
    authMock = jasmine.createSpyObj('JWTTokenService', ['setToken']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ LoginComponent ],
      providers: [
        { provide: IdentityService, useValue: identityMock},
        { provide: JWTTokenService, useValue: authMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(of('tkn'));

    component.loginDetails.userName = 'user';
    component.loginDetails.password = 'pw';
    component.onLogin();

    expect(identityMock.apiIdentityLoginPost).toHaveBeenCalledOnceWith({
      userName: 'user',
      password: 'pw'
    }, undefined, undefined, { httpHeaderAccept: 'text/plain' });
  });

  it('should set the token', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(of('tkn'));

    component.onLogin();

    expect(authMock.setToken).toHaveBeenCalledOnceWith('tkn', false);
  });

  it('should set the token and remember me', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(of('tkn'));

    component.rememberMe = true;
    component.onLogin();

    expect(authMock.setToken).toHaveBeenCalledOnceWith('tkn', true);
  });

  it('should go to the meal plan after login', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(of('tkn'));

    component.onLogin();

    expect(routerMock.navigate).toHaveBeenCalledOnceWith( ['/mealplan'] );
  });

  it('should show an error message for wrong password', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(throwError(() => {
      return {
        status: 401
      }
    }));

    component.onLogin();

    expect (component.errorMessage).toEqual("The username/password is not correct");
  });

  it('should show an error message for failure', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(throwError(() => {
      return {
        status: 500,
        message: 'It went wrong'
      }
    }));

    component.onLogin();

    expect (component.errorMessage).toEqual("It went wrong");
  });
});
