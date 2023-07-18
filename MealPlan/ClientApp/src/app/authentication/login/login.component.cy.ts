import { LoginComponent } from "./login.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { IdentityService } from "src/libs/api-client";
import { testJwt } from "src/app/test-jwt";

describe('Login component', () => {
    it('mounts', () => {
        cy.mount(LoginComponent, {
            imports: [FormsModule],
            providers: [
                { provide: IdentityService, useValue: cy.stub() }
            ]
        });
    });

    it('should submit the form and not remember me', () => {
        const jwt = testJwt;
        cy.mount(LoginComponent, {
            imports: [FormsModule, HttpClientModule],
        }).then(m => {
            cy.stub((m.component as any).router,'navigate').as('nav');
        });

        cy.intercept('POST', '/api/Identity/Login', {
            statusCode: 200,
            body: jwt,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).as('post');

        cy.get('[data-mealplan-login-id]').type('user');
        cy.get('[data-mealplan-login-password]').type('pw');
        cy.get('[data-mealplan-login-button]').should('not.be.disabled').click();

        cy.wait('@post')
            .its('request.body').should('deep.include', { userName: 'user', password: 'pw'})
            .then(() => {
                cy.getAllLocalStorage().then((l) => {
                    expect(l).to.not.haveOwnProperty(Cypress.config().baseUrl ?? '');
                });
                cy.getAllSessionStorage().then((s) => {
                    expect(s).to.deep.equal({
                        [Cypress.config().baseUrl ?? '']: {
                            'token': jwt
                        }
                    });
                });
        });
        cy.get('@nav').should('have.been.calledWith', ['/mealplan']);
    });

    it('should submit the form and remember me', () => {
        const jwt = testJwt;
        cy.mount(LoginComponent, {
            imports: [FormsModule, HttpClientModule],
        }).then(m => {
            cy.stub((m.component as any).router,'navigate').as('nav');
        });

        cy.intercept('POST', '/api/Identity/Login', {
            statusCode: 200,
            body: jwt,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        }).as('post');

        cy.get('[data-mealplan-login-id]').type('user');
        cy.get('[data-mealplan-login-password]').type('pw');
        cy.get('[data-mealplan-login-rememberme]').check();
        cy.get('[data-mealplan-login-button]').should('not.be.disabled').click();

        cy.wait('@post')
            .its('request.body').should('deep.include', { userName: 'user', password: 'pw'})
            .then(() => {
                cy.getAllLocalStorage().then((l) => {
                    expect(l).to.deep.equal({
                        [Cypress.config().baseUrl ?? '']: {
                            'token': jwt
                        }
                    });
                });
                cy.getAllSessionStorage().then((s) => {
                    expect(s).to.not.haveOwnProperty(Cypress.config().baseUrl ?? '');
                });
        });
        cy.get('@nav').should('have.been.calledWith', ['/mealplan']);
    });

    // To do:
    // - Error for wrong username/password
    // - Error for failure when submitting
    // - Check status of button when username/password missing
});
