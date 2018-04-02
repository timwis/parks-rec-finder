describe('Categories page', () => {
  beforeEach(() => {
    cy.server()
    cy.route(/FROM\+ppr_programs/, 'fixture:activityCategories')
    cy.route(/FROM\+ppr_facilities/, 'fixture:locationCategories')
  })

  it('shows activities by default', () => {
    cy.visit('/')
    cy.get('[data-testid=activitiesTab]').should('have.class', 'is-active')
    cy.get('[data-testid=activityCategories]').should('be.visible')
    cy.get('[data-testid=locationCategories]').should('not.be.visible')
  })

  it('switches to locations tab', () => {
    cy.get('[data-testid=locationsTab]').click().should('have.class', 'is-active')
    cy.get('[data-testid=activitiesTab]').should('not.have.class', 'is-active')
    cy.get('[data-testid=locationCategories]').should('be.visible')
    cy.get('[data-testid=activityCategories]').should('not.be.visible')
  })
})
