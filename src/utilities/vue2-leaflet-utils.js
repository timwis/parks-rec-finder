// Copied from https://github.com/KoRiGaN/Vue2Leaflet
// and linting errors fixed. Otherwise can't import these
// from the project because they won't be transpiled.
// There may be a better way to do this.
import L from 'leaflet'

export function eventsBinder (vueElement, leaflet, events) {
  for (var i = 0; i < events.length; i++) {
    const exposedName = 'l-' + events[i]
    const eventName = events[i]
    leaflet.on(eventName, (ev) => {
      vueElement.$emit(exposedName, ev)
    })
  }
}

export function propsBinder (vueElement, leafletElement, props, options) {
  const keys = Object.keys(props)
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i]
    const setMethodName = 'set' + capitalizeFirstLetter(key)
    const deepValue = (props[key].type === Object) ||
      (props[key].type === Array) ||
      (Array.isArray(props[key].type))
    if (props[key].custom) {
      vueElement.$watch(key, (newVal, oldVal) => {
        vueElement[setMethodName](newVal, oldVal)
      }, {
        deep: deepValue
      })
    } else if (setMethodName === 'setOptions') {
      vueElement.$watch(key, (newVal, oldVal) => {
        L.setOptions(leafletElement, newVal)
      }, {
        deep: deepValue
      })
    } else {
      vueElement.$watch(key, (newVal, oldVal) => {
        leafletElement[setMethodName](newVal)
      }, {
        deep: deepValue
      })
    }
  }
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
