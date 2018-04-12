describe('Categories page', () => {
  beforeEach(() => {
    cy.server()
    cy.route(/FROM\+ppr_programs/, 'fixture:activityCategories')
    cy.route(/FROM\+ppr_facilities/, 'fixture:locationCategories')
    cy.route(/flickr/, 'fixture:photoUrl')
    cy.visit('#/')
  })

  it('shows activities by default', () => {
    cy.get('[data-testid=activitiesTab]')
      .should('have.class', 'is-active')

    cy.get('[data-testid=activityCategories]')
      .should('be.visible')

    cy.get('[data-testid=locationCategories]')
      .should('not.be.visible')

    cy.get('.leaflet-marker-icon')
      .should('not.exist')

    cy.contains('Athletic')
      .should('have.attr', 'href')
      .and('include', 'activities/athletic')
  })

  it('switches to locations tab', () => {
    cy.get('[data-testid=locationsTab]')
      .click()
      .should('have.class', 'is-active')

    cy.get('[data-testid=activitiesTab]')
      .should('not.have.class', 'is-active')

    cy.get('[data-testid=locationCategories]')
      .should('be.visible')

    cy.get('[data-testid=activityCategories]')
      .should('not.be.visible')

    cy.get('.leaflet-marker-icon')
      .should('not.exist')

    cy.contains('Parks')
      .should('have.attr', 'href')
      .and('include', 'locations/parks')
  })
})
