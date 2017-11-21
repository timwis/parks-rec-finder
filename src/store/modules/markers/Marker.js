class PPRFMarker {
  constructor (entityType, entity) {
    this.entityType = entityType
    this._setID(entity)
    this._setCoords(entity)
    this._setColor(entity)
  }

  _setCoords (entity) {
    this.lat = entity.latitude
    this.lng = entity.longitude
  }

  _setID (entity) {
    this.id = entity.id || entity.ID
  }

  _setColor (entity) {
    if (entity.program_id) {
      this.color = '#2176d2'
    } else {
      this.color = '#9400c6'
    }
  }
}

export default PPRFMarker
