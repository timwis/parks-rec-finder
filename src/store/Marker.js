class PPRFMarker {
  constructor (entityType, entity) {
    this.entityType = entityType
    this.build(entityType, entity)
  }

  build (entityType, entity) {
    this.lat = entity.latitude
    this.lng = entity.longitude

    this.opacity = 1
    this.size = [20, 28]

    switch (entityType) {
      case 'program':
        this.type = 'program'
        this.id = entity.id
        this.color = '#2176d2'
        this.name = entity.program_name
        break

      case 'facility':
        this.type = 'facility'
        this.id = entity.id
        this.color = '#A5097E'
        this.name = entity.long_name
        this.address = entity.address
        this.assetID = entity.pprassets_object_id
        break
    }
  }

  _formatAddress () {
    if (this.address) {
      return `
        <address>
          ${this.address.street},<br/>
          ${this.address.city}, ${this.address.state} ${this.address.zip}
        </address>
      `
    } else {
      return ``
    }
  }

  content () {
    return `
      <a href="#/${this.type === 'facility' ? 'location' : this.type}/${this.id}"><h3>${this.name}</h3></a>
      ${this._formatAddress()}
    `
  }
}

export default PPRFMarker
