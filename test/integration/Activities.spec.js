const uniqBy = require('lodash/uniqBy')

// Load fixture a second time because I can't figure out how
// to access the cypress fixture...
const activities = require('../fixtures/activities.json').rows

describe('Activities page', () => {
  beforeEach(() => {
    cy.server()
    cy.route(/FROM\+ppr_activity_categories/, 'fixture:activityCategoryDetails')
    cy.route(/FROM\+ppr_programs/, 'fixture:activities')
    cy.visit('#/activities/civic-community')
  })

  it('shows the list header', () => {
    cy.get('[data-testid=categoryName]')
      .should('be.visible')
      .should('contain', 'Civic & Community')
    cy.get('[data-testid=count]')
      .should('contain', activities.length)
  })

  it('shows the list items', () => {
    cy.get('[data-testid=activityListItem]')
      .should('have.lengthOf', activities.length)

    cy.contains('Advisory council meeting')
      .should('have.attr', 'href')
      .and('include', 'activity/advisory-council-meeting')
  })

  it('shows map markers for unique locations', () => {
    const uniqueLocations = uniqBy(activities, 'location_id')
    cy.get('.leaflet-marker-icon')
      .should('have.lengthOf', uniqueLocations.length)
  })

  it('shows the marker popup info', () => {
    cy.get('.leaflet-marker-icon')
      .first().click()

    cy.get('.leaflet-popup')
      .should('have.lengthOf', 1)

    cy.get('.leaflet-popup-content')
      .should('contain', 'Mill Creek')

    cy.get('.leaflet-popup-content [data-testid=popupLink]')
      .first()
      .should('have.attr', 'href')
      .and('include', 'activity/advisory-council-meeting')
  })

  it('filters the list and map', () => {
    cy.get('[data-testid=filterButton]')
      .click()

    cy.get('[data-testid=filterControls]')
      .should('be.visible')

    cy.get('[data-testid=filterCostFree]')
      .check({ force: true }) // phila-standards hides true input

    cy.url().should('contain', 'cost=free')

    const freeActivities = activities.filter(isFree)

    cy.get('[data-testid=count]')
      .should('contain', freeActivities.length)

    cy.get('[data-testid=activityListItem]')
      .should('have.lengthOf', freeActivities.length)

    const uniqueLocations = uniqBy(freeActivities, 'location_id')
    cy.get('.leaflet-marker-icon')
      .should('have.lengthOf', uniqueLocations.length)
  })

  it('filters by url querystring', () => {
    cy.visit('#/activities/civic-community?cost=free')

    const freeActivities = activities.filter(isFree)

    cy.get('[data-testid=count]')
      .should('contain', freeActivities.length)

    cy.get('[data-testid=activityListItem]')
      .should('have.lengthOf', freeActivities.length)

    const uniqueLocations = uniqBy(freeActivities, 'location_id')
    cy.get('.leaflet-marker-icon')
      .should('have.lengthOf', uniqueLocations.length)
  })

  it('shows active filters', () => {
    cy.visit('#/activities/civic-community?cost=free')

    cy.get('[data-testid=activeFilters]')
      .should('be.visible')
      .should('contain', 'free')
  })

  it.only('active filters can be removed', () => {
    cy.visit('#/activities/civic-community?cost=free')

    cy.get('[data-testid=activeFilters] a')
      .click()

    cy.url().should('not.contain', 'cost=free')
  })

  it('resets all filters', () => {
    cy.visit('#/activities/civic-community?cost=free')

    cy.get('[data-testid=filterButton]')
      .click()

    cy.get('[data-testid=resetFilterButton]')
      .click()

    cy.url().should('not.contain', 'cost=free')

    cy.get('[data-testid=count]')
      .should('contain', activities.length)

    cy.get('[data-testid=activityListItem]')
      .should('have.lengthOf', activities.length)

    const uniqueLocations = uniqBy(activities, 'location_id')
    cy.get('.leaflet-marker-icon')
      .should('have.lengthOf', uniqueLocations.length)
  })
})

function isFree (activity) {
  return activity.fee === '' || activity.fee === '0.00'
}
