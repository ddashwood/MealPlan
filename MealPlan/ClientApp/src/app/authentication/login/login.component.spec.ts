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

    fixture.nativeElement.querySelector('#username').value = 'user';
    fixture.nativeElement.querySelector('#password').value = 'pw';

    fixture.nativeElement.querySelectorAll('input').forEach((i: HTMLElement) => i.dispatchEvent(new Event('input')));

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(identityMock.apiIdentityLoginPost).toHaveBeenCalledOnceWith({
      userName: 'user',
      password: 'pw'
    });
  });

  it('should set the token', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(of('tkn'));

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(authMock.setToken).toHaveBeenCalledOnceWith('tkn', false);
  });

  it('should go to the meal plan after login', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(of('tkn'));

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledOnceWith( ['/mealplan'] );
  });

  it('should show an error message for wrong password', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(throwError(() => {
      return {
        status: 401
      }
    }));

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect (component.errorMessage).toEqual("The username/password is not correct");
  });

  it('should show an error message for failure', () => {
    identityMock.apiIdentityLoginPost.and.returnValue(throwError(() => {
      return {
        status: 500,
        message: 'It went wrong'
      }
    }));

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect (component.errorMessage).toEqual("It went wrong");
  });

  it('should disable the logon button if no username', () => {
    fixture.nativeElement.querySelector('#password').value = 'pw';
    fixture.nativeElement.querySelectorAll('input').forEach((i: HTMLElement) => i.dispatchEvent(new Event('input')));

    const button = fixture.nativeElement.querySelector('button');
    fixture.detectChanges();

    expect(button.disabled).toBeTrue();
  });

  it('should disable the logon button if no password', () => {
    fixture.nativeElement.querySelector('#username').value = 'user';
    fixture.nativeElement.querySelectorAll('input').forEach((i: HTMLElement) => i.dispatchEvent(new Event('input')));

    const button = fixture.nativeElement.querySelector('button');
    fixture.detectChanges();

    expect(button.disabled).toBeTrue();
  });

  it('should enable the logon button if username and password entered', () => {
    fixture.nativeElement.querySelector('#username').value = 'user';
    fixture.nativeElement.querySelector('#password').value = 'pw';
    fixture.nativeElement.querySelectorAll('input').forEach((i: HTMLElement) => i.dispatchEvent(new Event('input')));

    const button = fixture.nativeElement.querySelector('button');
    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });
});
