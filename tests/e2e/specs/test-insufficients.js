// https://docs.cypress.io/api/introduction/api.html

describe('Test Results page', () => {
  it('Test Results Page', () => {
    cy.visit('/')
    cy.contains('h2', 'Je trouve les candidats qui me correspondent')
    cy.get('.btn-start').click()
    cy.contains('.text-center > h1', 'Mon code postal')

    cy.get('.el-input__inner').type('2850')

    cy.get('.el-autocomplete-suggestion__list > li').click()

    cy.get('.el-button').click()
  })
})
