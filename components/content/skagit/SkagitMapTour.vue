<template>
  <section class="hero-map-container ba b--white bw2 bw3-l" ref="root">
    <div id="map" class="w-100 vh-100 z-1 top-0" ref="mapRoot"></div>

    <div ref="mapText" class="map-text relative z-999 ml5-l measure">
      <p>
        Long before the city dammed the river for cheap power, a different kind
        of power existed. “We have what’s called Indian Power,” Schuyler said.
        “Right now, the river is not clean – not pure – the impurities being
        hydroelectric dams,” he said, adding that as the river goes through the
        hydroelectric system, it’s defiled. As a result, a core part of their
        religious belief system – the ability to draw on this Skagit power – is
        greatly diminished.
      </p>

      <p>
        According to Upper Skagit oral literature, that power,
        S.g[\[1\]](#ftnt1)wǝdílic (Skwa-dee-litch), was the eldest of four
        brothers; among them were Fire and Knife. Long ago,
        S.g[\[2\]](#ftnt2)wǝdílic walked up the Skagit River with his brothers,
        giving everything a name: the mountains, the lakes, the creeks, the
        tribes, and their villages.
      </p>

      <p>
        He put salmon in every creek. Knife taught the people to cut up and
        prepare the fish, while Fire taught the people how to cook them.
        Following this, S.g[\[3\]](#ftnt3)wǝdílic prepared to leave. “I’m going
        to be power now,” he said. S.g[\[4\]](#ftnt4)wǝdílic said the Upper
        Skagit would later find him, and then dove into the depths of the river
        beneath Skagit Falls.
      </p>

      <p>
        Schuyler said the project, along with logging and mining in the upper
        reaches of the river, detracts from the purity of
        S.g[\[5\]](#ftnt5)wǝdílic’s power, Indian Power, which in the Upper
        Skagit’s sense of being, is interlinked with salmon. “For every action
        there is an effect,” he said, referring to the hydroelectric dams. “Who
        bears the burden of the effect? Is it our tribal culture and our history
        that have to bear the burden of this? Is it the salmon?” Schuyler asked.
      </p>
    </div>
  </section>
</template>

<script>
// import * as d3 from 'd3'
// import { easeQuadIn } from 'd3'
// import turf
import { along, length, distance, bearing } from '@turf/turf'
import * as mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import scrollama from 'scrollama'

export default {
  name: 'MemphisContextHeroMap',
  props: {},
  data: function () {
    return {
      map: null,
      focusedEl: null,
      containerScrollY: 0,
      focused: false,
      initialZoom: 7.9,
      focusedZoom: 14.2,
      zoomDuration: 5500,
    }
  },
  computed: {
    isMobile: function () {
      const screenWidth = window.innerWidth
      return screenWidth < 768
    },
  },
  mounted: function () {
    this.setUpMapboxMap()

    const scroller = scrollama()
    scroller.setup({
      step: '.map-text p',
      // debug: true,
      // offset: 0.75,
      // offset: 0.92,
    })
    // .onStepEnter(this.onStepEnter)

    // set up scroll listener
    window.addEventListener('scroll', this.onScroll)
  },
  watch: {
    focused: function (newVal, oldVal) {
      if (newVal) {
        this.onMapFocused()
      } else if (oldVal && !newVal) {
        this.onMapUnfocused()
      }
    },
  },
  methods: {
    onStepEnter(step) {
      const el = step.element
      // console.log('step', step, el)
      this.focusedEl = el
      const zoomDuration = this.zoomDuration
      const lat = el.getAttribute('data-lat')
      const lng = el.getAttribute('data-lng')
      const placeMarker = el.getAttribute('data-place-marker')
      const markerColor = el.getAttribute('data-marker-color')
      const markerText = el.getAttribute('data-marker-text')

      if (!lng || !lat) return
      this.map.flyTo({
        center: [lng, lat],
        zoom: this.focusedZoom,
        duration: this.zoomDuration,
      })
    },
    flyToLocation(location) {
      this.map.flyTo({
        center: [location.lng, location.lat],
        zoom: this.focusedZoom * 1.2,
        duration: this.zoomDuration,
      })
    },
    onMapUnfocused: function () {
      // zoom to first point with focused zoom
      // const startPoint = this.getPositionAlongRoute(skagitRiverTourGeojson, 100)
      // this.map.flyTo({
      //   center: startPoint.geometry.coordinates,
      //   zoom: this.initialZoom,
      //   duration: this.zoomDuration,
      // })
    },
    onMapFocused: function () {
      // const zoomDuration = 8000
      // fit to bounds of whole Memphis
      // this.map.fitBounds(bbox(wholeMemphisGeojson), {
      //   duration: zoomDuration,
      //   padding: {
      //     left: 20,
      //     right: 20,
      //     top: 20,
      //     bottom: 20,
      //   },
      // })
      // this.map.easeTo({
      //   // zoom: this.focusedZoom,
      //   pitch: 59,
      //   bearing: 92,
      //   duration: this.zoomDuration,
      // })
    },
    setUpMapboxMap: function () {
      // get route start from skagitRiverTourGeojson
      const start = this.getPositionAlongRoute(skagitRiverTourGeojson, 0)

      this.map = new mapboxgl.Map({
        container: this.$refs.mapRoot,
        // style: 'mapbox://styles/mapbox/streets-v11',
        // satellite style
        // style: 'mapbox://styles/mapbox/satellite-v9',
        style: 'mapbox://styles/ejfox/cl7p0rxav000o15p0dnsl8jen',
        accessToken:
          'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',
        // center: [-122.08473814464001, 48.51603801371454],
        zoom: this.initialZoom,
        //pitch: 59,
        //pitch: 33,
        //bearing: 92,
        center: start,

        // 'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',

        // projection: 'globe',
        projection: 'mercator',
      })

      this.map.on('load', this.onMapLoaded)
      // Disable zoom scrolling
      this.map.scrollZoom.disable()

      // Disable panning
      if (this.isMobile) this.map.dragPan.disable()
    },
    getPositionAlongRoute(route, positionPercentage) {
      const lineFeature = route.features[0]
      // const routeLineString = lineString(lineFeature)
      const routeLineString = lineFeature.geometry

      // get the route length in miles
      const routeLength = length(routeLineString, { units: 'miles' })

      // get start and end point from route
      const startPoint = routeLineString.coordinates[0]
      const endPoint =
        routeLineString.coordinates[routeLineString.coordinates.length - 1]

      // get the distance between the start and end point in miles
      const distanceBetweenStartAndEnd = distance(startPoint, endPoint, {
        units: 'miles',
      })

      // get the distance between the start point and the point percentage along the route
      const distanceBetweenStartAndPosition = routeLength * positionPercentage

      // const pointAlongRoute = along(routeLineString, positionAlongRoute)
      const pointAlongRoute = along(
        routeLineString,
        distanceBetweenStartAndPosition,
        { units: 'miles' }
      )

      const pointAlongRouteCoords = pointAlongRoute.geometry.coordinates

      // console.log all variables
      // console.log(
      //   {
      //     routeLength,
      //     startPoint,
      //     endPoint,
      //     distanceBetweenStartAndPosition,
      //     pointAlongRouteCoords,
      //   },
      //   pointAlongRouteCoords
      // )
      return pointAlongRouteCoords
    },
    onMapLoaded: function () {
      // add mapboxgl controls
      // this.map.addControl(new mapboxgl.NavigationControl())

      // add DEM elevation layer
      this.map.addSource('dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      })

      // add hillshade from mapbox.mapbox-terrain-v2
      this.map.addLayer({
        id: 'hillshade',
        source: 'dem',
        type: 'hillshade',
        // insert below waterway-river-canal-shadow;
        // where hillshading sits in the Mapbox Outdoors style
        before: 'waterway-river-canal-shadow',
        paint: {
          'hillshade-exaggeration': 0.15,
        },
      })

      // add the DEM source as a terrain layer with exaggerated height
      // this.map.setTerrain({ source: 'dem', exaggeration: 0.25 })
      this.map.setTerrain({ source: 'dem', exaggeration: 0.5 })

      // this.map.setTerrain({ source: 'dem', exaggeration: 1 })

      // add skagitRiverTourGeojson line feature to map
      // this.map.addSource('skagitRiverTourGeojson', {
      //   type: 'geojson',
      //   data: skagitRiverTourGeojson,
      // })

      // this.map.addLayer({
      //   id: 'skagitRiverTourGeojson',
      //   type: 'line',
      //   source: 'skagitRiverTourGeojson',
      //   paint: {
      //     'line-color': '#fff',
      //     'line-width': 2,
      //   },
      // })

      // this.map.easeTo({
      //   pitch: 45,
      //   duration: 0,
      // })

      // add memphis depot as geojson, with orange fill
      // this.map.addSource('highlight', {
      //   type: 'geojson',
      //   data: highlightGeojson,
      // })

      // this.map.addLayer({
      //   id: 'highlight-fill',
      //   type: 'fill',
      //   source: 'highlight',
      //   paint: {
      //     'fill-color': '#ff7f00',
      //     'fill-opacity': 0.2,
      //   },
      // })

      // add skagit river multi line string geojson layer as #c60101 line
      // from mapbox tileset: ejfox.cxot5mj7
      this.map.addSource('skagit-river', {
        type: 'vector',
        url: 'mapbox://ejfox.cxot5mj7',
      })

      this.map.addLayer({
        id: 'skagit-river',
        type: 'line',
        source: 'skagit-river',
        'source-layer': 'skagit-river-82g1oy',
        paint: {
          'line-color': '#c60101',
          'line-width': 2.5,
          // rounded
          // 'line-cap': 'round',
          // rounded
        },
      })

      // add skagit river text label from skagitRiverLabel
      this.map.addSource('skagitRiverLabel', {
        type: 'geojson',
        data: skagitRiverLabel,
      })

      this.map.addLayer({
        id: 'skagitRiverLabel',
        type: 'symbol',
        source: 'skagitRiverLabel',
        layout: {
          'text-field': 'Skagit River',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 24,
        },
        paint: {
          // 'text-color': '#c60101',
          // 'text-halo-color': '#fff',
          'text-color': '#fff',
          'text-halo-color': '#c60101',
          'text-halo-width': 2,
        },
      })

      // add labels for gorge, diablo, and ross dam labels
      this.map.addSource('gorgeDamLabel', {
        type: 'geojson',
        data: gorgeDamLabel,
      })

      this.map.addLayer({
        id: 'gorgeDamLabel',
        type: 'symbol',
        source: 'gorgeDamLabel',
        layout: {
          'text-field': 'Gorge Dam',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 16,
        },
        paint: {
          // 'text-color': '#c60101',
          // 'text-halo-color': '#fff',
          'text-color': '#fff',
          'text-halo-color': '#c60101',
          'text-halo-width': 1,
        },
      })

      this.map.addSource('diabloDamLabel', {
        type: 'geojson',
        data: diabloDamLabel,
      })

      this.map.addLayer({
        id: 'diabloDamLabel',
        type: 'symbol',
        source: 'diabloDamLabel',
        layout: {
          'text-field': 'Diablo Dam',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 16,
        },
        paint: {
          // 'text-color': '#c60101',
          // 'text-halo-color': '#fff',
          'text-color': '#fff',
          'text-halo-color': '#c60101',
          'text-halo-width': 1,
        },
      })

      this.map.addSource('rossDamLabel', {
        type: 'geojson',
        data: rossDamLabel,
      })

      this.map.addLayer({
        id: 'rossDamLabel',
        type: 'symbol',
        source: 'rossDamLabel',
        layout: {
          'text-field': 'Ross Dam',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 16,
        },
        paint: {
          'text-color': '#fff',
          'text-halo-color': '#c60101',
          'text-halo-width': 1,
        },
      })
    },
    onScroll: function (e) {
      this.containerScrollY = this.calcContainerScrollY(e)
      if (!this.$refs.root) return

      const containerHeight = this.$refs.root.offsetHeight
      // if containerScrollY is negative, not in focus for the height of the element
      if (this.containerScrollY < 0) {
        this.focused = false
      } else if (this.containerScrollY > containerHeight) {
        this.focused = false
      } else {
        this.focused = true
      }

      const screenHeight = window.innerHeight

      // using the height of the root, get the % of the scroll
      // const scrollPct =
      //   this.containerScrollY / (containerHeight * 0.5 - screenHeight)

      // the proper way to get the height and % of the scroll
      const scrollPct = this.containerScrollY / (containerHeight - screenHeight)

      // console.log('scrollPct', scrollPct)

      if (scrollPct < 0) return
      if (scrollPct > 1.25) return
      // get the position along the route
      const positionAlongRoute = this.getPositionAlongRoute(
        skagitRiverTourGeojson,
        scrollPct
      )

      // get the next position along the route
      const nextPositionAlongRoute = this.getPositionAlongRoute(
        skagitRiverTourGeojson,
        scrollPct + 2
      )

      // figure out the bearing between the two positions
      const currentRouteBearing = bearing(
        positionAlongRoute,
        nextPositionAlongRoute
      )

      function interpolate(start, end, scrollPct) {
        // const pct = easeQuadIn(scrollPct)
        const pct = scrollPct
        return start + (end - start) * pct
      }

      // add ability to change pitch from 0-65 based on scrollPct
      const scrollPitch = interpolate(0, 78, scrollPct)

      // add ability to change bearing from 0-95 based on scrollPct
      const scrollBearing = interpolate(0, 55, scrollPct)

      // get the interpolation between start and end zoom for the scrollPct
      function interpolateZoom(start, end, scrollPct) {
        // const pct = easeQuadIn(scrollPct)
        const pct = scrollPct
        return start + (end - start) * pct
      }

      const easedFocusZoom = interpolateZoom(
        this.initialZoom,
        this.focusedZoom,
        scrollPct
      )

      if (positionAlongRoute < 0) return
      if (positionAlongRoute > 1) return

      // ease map to current route bearing
      if (currentRouteBearing) {
        this.map.easeTo({
          // bearing: currentRouteBearing,
          bearing: scrollBearing,
          pitch: scrollPitch,
          duration: 0,
        })
      }

      // set the map to that position
      this.map.flyTo({
        center: positionAlongRoute,
        // zoom: this.focusedZoom,
        zoom: easedFocusZoom,
        duration: 0,
      })
    },
    calcContainerScrollY: function (e) {
      const containerEl = this.$refs.root
      if (!containerEl) return false
      /* figure out how many pixels have been scrolled in container */
      let containerScrollY = containerEl.getBoundingClientRect().top
      // invert the number from negative to positive
      containerScrollY = -containerScrollY
      return containerScrollY
    },
  },
}

const skagitRiverTourGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        shape: 'Line',
        name: 'Unnamed Layer',
        category: 'default',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.540976, 48.360469],
          [-122.515747, 48.36697],
          [-122.491206, 48.368681],
          [-122.462888, 48.359443],
          [-122.441608, 48.35853],
          [-122.423073, 48.360926],
          [-122.385488, 48.364689],
          [-122.37725, 48.370506],
          [-122.361804, 48.400602],
          [-122.347903, 48.414163],
          [-122.339665, 48.428973],
          [-122.319414, 48.455392],
          [-122.285262, 48.476222],
          [-122.257287, 48.48066],
          [-122.234634, 48.488055],
          [-122.198078, 48.489307],
          [-122.165471, 48.488169],
          [-122.156203, 48.495905],
          [-122.112955, 48.512624],
          [-122.006722, 48.518196],
          [-121.921598, 48.512738],
          [-121.848014, 48.52786],
          [-121.8221, 48.536272],
          [-121.774046, 48.535704],
          [-121.76066, 48.530475],
          [-121.723418, 48.527406],
          [-121.692355, 48.513079],
          [-121.631601, 48.480432],
          [-121.601568, 48.476222],
          [-121.572564, 48.480204],
          [-121.554544, 48.490558],
          [-121.531718, 48.497384],
          [-121.491902, 48.501706],
          [-121.465644, 48.510691],
          [-121.437327, 48.523426],
          [-121.420337, 48.548092],
          [-121.399571, 48.58274],
          [-121.373484, 48.596138],
          [-121.337444, 48.626101],
          [-121.255753, 48.671013],
          [-121.210617, 48.696513],
          [-121.184049, 48.702574],
          [-121.099806, 48.710051],
          [-121.068821, 48.731229],
        ],
      },
      id: '43c4e120-89f2-446d-98f9-87ce41d44ea0',
    },
    {
      type: 'Feature',
      properties: {
        shape: 'Line',
        name: 'Unnamed Layer',
        category: 'default',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.210617, 48.696513],
          [-121.181613, 48.704103],
          [-121.161705, 48.712939],
          [-121.134417, 48.713279],
        ],
      },
      id: 'c2f382ff-fd04-4a2e-bf15-002f2708ed69',
    },
  ],
}

const gorgeDamLabel = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        shape: 'Marker',
        name: 'Unnamed Layer',
        category: 'default',
      },
      geometry: {
        type: 'Point',
        coordinates: [-121.208425, 48.697943],
      },
      id: 'cd554554-84a9-4380-b96f-98d432e951c4',
    },
  ],
}

const diabloDamLabel = {
  type: 'Feature',
  properties: {
    shape: 'Marker',
    name: 'Unnamed Layer',
    category: 'default',
  },
  geometry: {
    type: 'Point',
    coordinates: [-121.132021, 48.713817],
  },
  id: 'fc7be170-5d3e-4156-83b6-5a22c7dd6fb2',
}

const rossDamLabel = {
  type: 'Feature',
  properties: {
    shape: 'Marker',
    name: 'Unnamed Layer',
    category: 'default',
  },
  geometry: {
    type: 'Point',
    coordinates: [-121.068093, 48.731851],
  },
  id: '630c6d96-355f-4352-a01a-4476e0822f54',
}

const skagitRiverLabel = {
  type: 'Feature',
  properties: {
    shape: 'Marker',
    name: 'Unnamed Layer',
    category: 'default',
  },
  geometry: {
    type: 'Point',
    coordinates: [-122.37039, 48.383846],
  },
  id: 'd7194808-c284-43c7-92f6-c67f94674b3a',
}
</script>

<style scoped>
#map {
  position: sticky;
}

.vh-80 {
  height: 80vh;
}

.hero-map-container {
  /* position: sticky;
  top: 1rem; */
  /*height: 320vh;*/
}

p {
  margin-bottom: 66vh;

  padding: 2em 1.2em;
  margin-left: 2vw;
  margin-right: 2vw;
  line-height: 1.3em;
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0 0 3.3rem rgba(0, 0, 0, 0.15);
  border: 1px solid white;
}

.sticky {
  position: sticky;
}
</style>
