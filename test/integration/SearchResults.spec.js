const uniqBy = require('lodash/uniqBy')

const fixtures = {
  activities: require('../fixtures/activities'),
  locations: require('../fixtures/locations'),
  zipcodeGeometry: require('../fixtures/zipcodeGeometry'),
  addressGeometry: require('../fixtures/addressGeometry')
}

describe('Search Results page', () => {
  describe('Search form', () => {
    beforeEach(() => {
      cy.server()
      cy.route('*', {})
      cy.visit('/')
    })

    it('search form term updates route', () => {
      cy.get('[data-testid=searchTerm]')
        .type('foo')

      cy.get('[data-testid=searchLocation]')
        .type('19111')
        .type('{enter}')

      cy.url()
        .should('contain', 'term=foo')
        .should('contain', 'location=19111')
    })
  })

  describe('Tab navigation', () => {
    beforeEach(() => {
      cy.server()
      cy.route(/FROM\+ppr_programs/, fixtures.activities)
      cy.route(/FROM\+ppr_facilities/, fixtures.locations)
      cy.visit('#/search/activities?term=foo')
    })

    it('shows activities by default', () => {
      const activitiesCount = fixtures.activities.rows.length
      const uniqueLocations = uniqBy(fixtures.activities.rows, 'location_id')

      cy.get('[data-testid=activitiesTab]')
        .should('have.class', 'is-active')

      cy.get('[data-testid=activityListItem]')
        .should('have.lengthOf', activitiesCount)

      cy.get('.leaflet-marker-icon')
        .should('have.lengthOf', uniqueLocations.length)
    })

    it('switches to locations tab', () => {
      const locationsCount = fixtures.locations.rows.length

      cy.get('[data-testid=locationsTab]')
        .click()
        .should('have.class', 'is-active')

      cy.get('[data-testid=locationListItem]')
        .should('have.lengthOf', locationsCount)

      cy.get('.leaflet-marker-icon')
        .should('have.lengthOf', locationsCount)
    })
  })

  describe('Term and location combinations', () => {
    beforeEach(() => {
      cy.server()
      cy.route(/FROM\+ppr_programs/, fixtures.activities)
      cy.route(/FROM\+ppr_facilities/, fixtures.locations)
      cy.route(/FROM\+zip_codes/, fixtures.zipcodeGeometry)
      cy.route('ais', fixtures.addressGeometry)
    })

    it('term only', () => {
      const activitiesCount = fixtures.activities.rows.length
      const locationsCount = fixtures.locations.rows.length
      const totalCount = activitiesCount + locationsCount

      cy.get('[data-testid=resultsSummary]')
        .should('contain', totalCount)

      cy.get('[data-testid=searchLocationGeometry]', { force: true })
        .should('not.exist')
    })

    it('zipcode only', () => {
      cy.visit('#/search/locations?location=19111')
      const activitiesCount = fixtures.activities.rows.length
      const locationsCount = fixtures.locations.rows.length
      const totalCount = activitiesCount + locationsCount

      cy.get('[data-testid=resultsSummary]')
        .should('contain', totalCount)
        .should('contain', '19111')

      cy.get('[data-testid=searchLocationGeometry]', { force: true })
        .should('exist')
    })

    it('address only', () => {
      cy.visit('#/search/locations?location=1234%20market')
      const activitiesCount = fixtures.activities.rows.length
      const locationsCount = fixtures.locations.rows.length
      const totalCount = activitiesCount + locationsCount

      cy.get('[data-testid=resultsSummary]')
        .should('contain', totalCount)
        .should('contain', '1234 market')

      cy.get('[data-testid=searchLocationGeometry]', { force: true })
        .should('exist')
    })

    it('term and zip code', () => {
      cy.visit('#/search/locations?term=foo&location=19111')
      const activitiesCount = fixtures.activities.rows.length
      const locationsCount = fixtures.locations.rows.length
      const totalCount = activitiesCount + locationsCount

      cy.get('[data-testid=resultsSummary]')
        .should('contain', totalCount)
        .should('contain', 'foo')
        .should('contain', '19111')

      cy.get('[data-testid=searchLocationGeometry]', { force: true })
        .should('exist')
    })
  })
})
