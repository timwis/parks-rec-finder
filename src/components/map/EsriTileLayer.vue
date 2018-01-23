<template>
</template>

<script>
/* eslint-disable */
import {tiledMapLayer} from 'esri-leaflet';
import { eventsBinder, propsBinder } from '../../utilities/vue2-leaflet-utils';

const events = [
  'loading',
  'tileunload',
  'tileloadstart',
  'tileerror',
  'tileload',
  'load',
  'add',
  'remove',
  'popupopen',
  'popupclose',
  'tooltipopen',
  'tooltipclose'
];

const props = {
  url: String,
  attribution: {
    type: String,
    custom: true
  },
  detectRetina: {
    type: Boolean,
    custom: false,
    default: false
  },
  token: {
    type: String,
    custom: true
  },
  // opacity: {
  //   type: Number,
  //   custom: false,
  //   default: 1.0
  // },
  // zIndex: {
  //   type: Number,
  //   default: 1
  // },
  options: {
    type: Object,
    default: function() {
      return {};
    }
  }
};

export default {
  name: 'EsriTileLayer',
  props: props,
  mounted() {
    const options = this.options;
    const otherPropertytoInitialize = [ "attribution", "token", "detectRetina", "opacity", "zIndex" ];
    for (var i = 0; i < otherPropertytoInitialize.length; i++) {
      const propName = otherPropertytoInitialize[i];
      if(this[propName]) {
        options[propName] = this[propName];
      }
    }
    console.log(this.url);
    console.log(options);
    this.mapObject = tiledMapLayer({url: this.url});
    eventsBinder(this, this.mapObject, events);
    propsBinder(this, this.mapObject, props);
  },
  methods: {
    deferredMountedTo(parent) {
      this.mapObject.addTo(parent);
      this.attributionControl = parent.attributionControl;
      for (var i = 0; i < this.$children.length; i++) {
        if (typeof this.$children[i].deferredMountedTo === "function") {
          this.$children[i].deferredMountedTo(this.mapObject);
        }
      }
    },
    setAttribution(val, old) {
      this.attributionControl.removeAttribution(old);
      this.attributionControl.addAttribution(val);
    },
    setToken(val) {
      this.options.token = val;
    }
  },
  beforeDestroy() {
    this.$parent.mapObject.removeLayer(this.mapObject);
  }
};
</script>
