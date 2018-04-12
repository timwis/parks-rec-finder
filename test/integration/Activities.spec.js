const uniqBy = require('lodash/uniqBy')

const fixtures = {
  activityCategoryDetails: require('../fixtures/activityCategoryDetails'),
  activities: require('../fixtures/activities')
}

describe('Activities page', () => {
  describe('Starting unfiltered', () => {
    beforeEach(() => {
      cy.server()
      cy.route(/FROM\+ppr_activity_categories/, fixtures.activityCategoryDetails)
      cy.route(/FROM\+ppr_programs/, fixtures.activities)
      cy.visit('#/activities/civic-community')
    })

    it('shows the list header', () => {
      const { name } = fixtures.activityCategoryDetails.rows[0]
      const count = fixtures.activities.rows.length

      cy.get('[data-testid=categoryName]')
        .should('be.visible')
        .should('contain', name)
      cy.get('[data-testid=count]')
        .should('contain', count)
    })

    it('shows the list items', () => {
      const count = fixtures.activities.rows.length
      const firstActivity = fixtures.activities.rows[0]

      cy.get('[data-testid=activityListItem]')
        .should('have.lengthOf', count)

      cy.contains(firstActivity.name)
        .should('have.attr', 'href')
        .and('include', `activity/${firstActivity.slug}`)
    })

    it('shows map markers for unique locations', () => {
      const uniqueLocations = uniqBy(fixtures.activities.rows, 'location_id')

      cy.get('.leaflet-marker-icon')
        .should('have.lengthOf', uniqueLocations.length)
    })

    it('shows the marker popup info', () => {
      const firstActivity = fixtures.activities.rows[0]

      cy.get('.leaflet-marker-icon')
        .first().click()

      cy.get('.leaflet-popup')
        .should('have.lengthOf', 1)

      cy.get('.leaflet-popup-content')
        .should('contain', firstActivity.location_name)

      cy.get('.leaflet-popup-content [data-testid=popupLink]')
        .first()
        .should('have.attr', 'href')
        .and('include', `activity/${firstActivity.slug}`)
    })

    it('filters the list and map', () => {
      const freeActivities = fixtures.activities.rows.filter(isFree)
      const uniqueLocations = uniqBy(freeActivities, 'location_id')

      cy.get('[data-testid=filterButton]')
        .click()

      cy.get('[data-testid=filterControls]')
        .should('be.visible')

      cy.get('[data-testid=filterCostFree]')
        .check({ force: true }) // phila-standards hides true input

      cy.url().should('contain', 'cost=free')

      cy.get('[data-testid=count]')
        .should('contain', freeActivities.length)

      cy.get('[data-testid=activityListItem]')
        .should('have.lengthOf', freeActivities.length)

      cy.get('.leaflet-marker-icon')
        .should('have.lengthOf', uniqueLocations.length)
    })
  })

  describe('Starting filtered', () => {
    beforeEach(() => {
      cy.server()
      cy.route(/FROM\+ppr_activity_categories/, fixtures.activityCategoryDetails)
      cy.route(/FROM\+ppr_programs/, fixtures.activities)
      cy.visit('#/activities/civic-community?cost=free')
    })

    it('filters by url querystring', () => {
      const freeActivities = fixtures.activities.rows.filter(isFree)
      const uniqueLocations = uniqBy(freeActivities, 'location_id')

      cy.get('[data-testid=count]')
        .should('contain', freeActivities.length)

      cy.get('[data-testid=activityListItem]')
        .should('have.lengthOf', freeActivities.length)

      cy.get('.leaflet-marker-icon')
        .should('have.lengthOf', uniqueLocations.length)
    })

    it('shows active filters', () => {
      cy.get('[data-testid=activeFilters]')
        .should('be.visible')
        .should('contain', 'free')
    })

    it('active filters can be removed', () => {
      cy.get('[data-testid=activeFilters] a')
        .click()

      cy.url().should('not.contain', 'cost=free')
    })

    it('resets all filters', () => {
      const count = fixtures.activities.rows.length
      const uniqueLocations = uniqBy(fixtures.activities.rows, 'location_id')

      cy.get('[data-testid=filterButton]')
        .click()

      cy.get('[data-testid=resetFilterButton]')
        .click()

      cy.url().should('not.contain', 'cost=free')

      cy.get('[data-testid=count]')
        .should('contain', count)

      cy.get('[data-testid=activityListItem]')
        .should('have.lengthOf', count)

      cy.get('.leaflet-marker-icon')
        .should('have.lengthOf', uniqueLocations.length)
    })
  })
})

function isFree (activity) {
  return activity.fee === '' || activity.fee === '0.00'
}
