/// <reference types="Cypress" />

const LONG_ENOUGH = 5000;

describe('Automated Visual Regression Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    it('Should match screenshot', () => {
        const WIDTH = 1200;
        const HEIGHT = 1000;
        cy.viewport(WIDTH, HEIGHT);
        cy.wait(LONG_ENOUGH);
        cy.matchImageSnapshot('homepage');
    });
});
