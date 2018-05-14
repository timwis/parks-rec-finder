const fixtures = {
  locationCategoryDetails: require('../fixtures/locationCategoryDetails'),
  locations: require('../fixtures/locations')
}

describe('Locations page', () => {
  beforeEach(() => {
    cy.server()
    cy.route(/FROM\+ppr_location_types/, fixtures.locationCategoryDetails)
    cy.route(/FROM\+ppr_facilities/, fixtures.locations)
    cy.visit('#/locations/historic-cultural-attractions')
  })

  it('shows the list header', () => {
    const { name } = fixtures.locationCategoryDetails.rows[0]
    const count = fixtures.locations.rows.length

    cy.get('[data-testid=categoryName]')
      .should('be.visible')
      .should('contain', name)
    cy.get('[data-testid=count]')
      .should('contain', count)
  })

  it('shows the list items', () => {
    const firstLocation = fixtures.locations.rows[0]
    const count = fixtures.locations.rows.length

    cy.get('[data-testid=locationListItem]')
      .should('have.lengthOf', count)

    cy.contains(firstLocation.name)
      .should('have.attr', 'href')
      .and('include', `location/${firstLocation.slug}`)
  })

  it('shows the map markers', () => {
    const count = fixtures.locations.rows.length

    cy.get('.leaflet-marker-icon')
      .should('have.lengthOf', count)
  })

  it('shows the marker popup info', () => {
    const firstLocation = fixtures.locations.rows[0]

    cy.get('.leaflet-marker-icon')
      .first().click()

    cy.get('.leaflet-popup')
      .should('have.lengthOf', 1)

    cy.get('.leaflet-popup-content')
      .should('contain', firstLocation.name)

    cy.get('.leaflet-popup-content [data-testid=popupLink]')
      .should('have.attr', 'href')
      .and('include', `location/${firstLocation.slug}`)
  })
})
