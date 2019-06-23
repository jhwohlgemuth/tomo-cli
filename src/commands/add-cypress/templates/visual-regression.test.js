/// <reference types="Cypress" />

const LONG_ENOUGH_TO_SEE_VIEWPORT = 200;

describe('Visual Regression Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    it('Should render as desired on multiple resolutions', () => {
        // https://on.cypress.io/viewport
        const WIDTH = 800;
        const HEIGHT = 800;
        cy.viewport(WIDTH, HEIGHT);
        cy.viewport('macbook-15');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('macbook-13');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('macbook-11');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('ipad-2');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('ipad-mini');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('iphone-6+');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('iphone-6');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('iphone-5');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('iphone-4');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('iphone-3');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('ipad-2', 'portrait');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
        cy.viewport('iphone-4', 'landscape');
        cy.wait(LONG_ENOUGH_TO_SEE_VIEWPORT);
    });
});
describe('Automated Visual Regression Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });
    it('Should match screenshot', () => {
        cy.matchScreenshot('001');
    });
});
