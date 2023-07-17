import { LoginComponent } from "./login.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { IdentityService } from "src/libs/api-client";

describe('Login component', () => {
    it('mounts', () => {
        cy.mount(LoginComponent, {
            imports: [FormsModule],
            providers: [
                { provide: IdentityService, useValue: cy.stub() }
            ]
        });
    });

    it('should submit the form', () => {
        const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        cy.mount(LoginComponent, {
            imports: [FormsModule, HttpClientModule],
        }).then(m => {
            cy.stub((m.component as any).router,'navigate').as('nav');
        });


        cy.get('#username').type('user');
        cy.get('#password').type('pw');

        cy.intercept('POST', '/api/Identity/Login', {
            statusCode: 200,
            body: jwt,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).as('post');


        cy.get('button').click();

        cy.wait('@post')
            .its('request.body').should('deep.include', { userName: 'user', password: 'pw'})
            .then(() => {
                cy.getAllLocalStorage().then((l) => {
                    expect(l).to.not.haveOwnProperty('http://localhost:8080');
                });
                cy.getAllSessionStorage().then((s) => {
                    expect(s).to.deep.equal({
                        'http://localhost:8080': {
                            'token': jwt
                        }
                    });
                });
        });
        cy.get('@nav').should('have.been.calledWith', ['/mealplan']);
    })
});
