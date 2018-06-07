const fixtures = {
  location: require('../fixtures/location'),
  activities: require('../fixtures/activities')
}

describe('Location Detail page', () => {
  beforeEach(() => {
    const { slug, id } = fixtures.location.rows[0]
    cy.server()
    cy.route(/FROM\+ppr_facilities/, fixtures.location)
    cy.route(/FROM\+ppr_programs/, fixtures.activities)
    cy.visit(`#/location/${slug}/${id}`)
  })

  it('shows the location name', () => {
    const { name } = fixtures.location.rows[0]

    cy.get('[data-testid=name]')
      .should('contain', name)
  })

  it('shows associated activities', () => {
    const count = fixtures.activities.rows.length

    cy.get('[data-testid=activitiesCount]')
      .should('contain', count)

    cy.get('[data-testid=activityListItem]')
      .should('have.lengthOf', count)
  })

  it('shows the map marker', () => {
    cy.get('.leaflet-marker-icon')
      .should('have.lengthOf', 1)
  })

  it('notifies user of error on 404', () => {
    cy.route({ url: /12345/, status: 404 })
    cy.visit('#/activity/fake-id/12345')
    cy.get('[data-testid=error]')
      .should('be.visible')
  })
})
