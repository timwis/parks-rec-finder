const uniqBy = require('lodash/uniqBy')

const fixtures = {
  activities: require('../fixtures/activities'),
  activitiesEmpty: require('../fixtures/activities-empty'),
  locationsEmpty: require('../fixtures/locations-empty'),
  locations: require('../fixtures/locations'),
  zipcodeGeometry: require('../fixtures/zipcodeGeometry'),
  addressGeometry: require('../fixtures/addressGeometry')
}

describe('Search Results page', () => {
  describe('General', () => {
    it('search form term updates route', () => {
      cy.server()
      cy.route('*', {})
      cy.visit('/')

      cy.get('[data-testid=searchTerm]')
        .type('foo')

      cy.get('[data-testid=searchLocation]')
        .type('19111')
        .type('{enter}')

      cy.url()
        .should('contain', 'term=foo')
        .should('contain', 'location=19111')
    })

    it('should switch to locations tab if activities empty but locations not', () => {
      cy.server()
      cy.route(/FROM\+ppr_programs/, fixtures.activitiesEmpty)
      cy.route(/FROM\+ppr_facilities/, fixtures.locations)
      cy.visit('#/search/activities?term=poplar')

      cy.url()
        .should('contain', 'locations')
        .should('contain', 'term=poplar')
    })

    it('should stay on activities tab if both activites and locations empty', () => {
      cy.server()
      cy.route(/FROM\+ppr_programs/, fixtures.activitiesEmpty)
      cy.route(/FROM\+ppr_facilities/, fixtures.locationsEmpty)
      cy.visit('#/search/activities?term=asdfasdf')

      cy.url()
        .should('contain', 'activities')
        .should('contain', 'term=asdfasdf')
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
