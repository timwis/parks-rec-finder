const fixtures = {
  activityCategories: require('../fixtures/activityCategories'),
  locationCategories: require('../fixtures/locationCategories'),
  photoUrl: require('../fixtures/photoUrl')
}

describe('Categories page', () => {
  beforeEach(() => {
    cy.server()
    cy.route(/FROM\+ppr_programs/, fixtures.activityCategories)
    cy.route(/FROM\+ppr_facilities/, fixtures.locationCategories)
    cy.route(/flickr/, fixtures.photoUrl)
    cy.visit('#/')
  })

  it('shows activities by default', () => {
    const firstActivityCategory = fixtures.activityCategories.rows[0]

    cy.get('[data-testid=activitiesTab]')
      .should('have.class', 'is-active')

    cy.get('[data-testid=activityCategories]')
      .should('be.visible')

    cy.get('[data-testid=locationCategories]')
      .should('not.be.visible')

    cy.get('.leaflet-marker-icon')
      .should('not.exist')

    cy.contains(firstActivityCategory.name)
      .should('have.attr', 'href')
      .and('include', `activities/${firstActivityCategory.slug}`)
  })

  it('switches to locations tab', () => {
    const firstLocationCategory = fixtures.locationCategories.rows[0]

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

    cy.contains(firstLocationCategory.name)
      .should('have.attr', 'href')
      .and('include', `locations/${firstLocationCategory.slug}`)
  })
})
