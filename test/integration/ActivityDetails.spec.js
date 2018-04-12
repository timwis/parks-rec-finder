const fixtures = {
  activity: require('../fixtures/activity')
}

describe('Activity Detail page', () => {
  beforeEach(() => {
    const { slug, id } = fixtures.activity.rows[0]
    cy.server()
    cy.route(id, fixtures.activity)
    cy.visit(`#/activity/${slug}/${id}`)
  })

  it('shows the activity name', () => {
    const { name } = fixtures.activity.rows[0]
    cy.get('[data-testid=name]')
      .should('contain', name)
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
