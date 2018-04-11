describe('Locations page', () => {
  before(() => {
    cy.server()
    cy.route(/FROM\+ppr_location_types/, 'fixture:locationCategoryDetails')
    cy.route(/FROM\+ppr_facilities/, 'fixture:locations')
  })

  beforeEach(() => {
    cy.visit('#/locations/historic-cultural-attractions')
  })

  it('shows the list header', () => {
    cy.get('[data-testid=categoryName]')
      .should('be.visible')
      .should('contain', 'Historic & Cultural Attractions')
    cy.get('[data-testid=count]')
      .should('contain', '14')
  })

  it('shows the list items', () => {
    cy.get('[data-testid=locationListItem]')
      .should('have.lengthOf', 14)

    cy.contains('Venice Island')
      .should('have.attr', 'href')
      .and('include', 'location/venice-island')
  })

  it('shows the map markers', () => {
    cy.get('.leaflet-marker-icon')
      .should('have.lengthOf', 14)
  })

  it('shows the marker popup info', () => {
    cy.get('.leaflet-marker-icon')
      .first().click()

    cy.get('.leaflet-popup')
      .should('have.lengthOf', 1)

    cy.get('.leaflet-popup-content')
      .should('contain', 'Venice Island')

    cy.get('.leaflet-popup-content [data-testid=popupLink]')
      .should('have.attr', 'href')
      .and('include', 'location/venice-island')
  })
})
