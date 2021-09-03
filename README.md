# vector-tile-esm

![tests](https://github.com/GlobeletJS/vector-tile-esm/actions/workflows/node.js.yml/badge.svg)

Reads [Mapbox Vector Tiles][] and allows access to the layers and features.

This module is a fork of [vector-tile-js][], with several key changes:
- Code is set up for ESM `import`, rather than CJS `require`. This allows it
  to be imported dynamically (e.g., on [Observable][]) without depending on a
  third-party bundling service such as [bundle.run][]
- The VectorTileFeature.toGeoJSON() method behaves very differently, returning
  pixel coordinates within a tile, rather than assuming Web Mercator and
  attempting to back-project to longitude and latitude
- The dependence on the [point-geometry][] module has been **removed**

[Mapbox Vector Tiles]: https://github.com/mapbox/vector-tile-spec
[vector-tile-js]: https://github.com/mapbox/vector-tile-js
[Observable]: https://observablehq.com
[bundle.run]: https://bundle.run
[point-geometry]: https://github.com/mapbox/point-geometry

## Example

```js
import { VectorTile } from 'vector-tile-esm';
import Protobuf from 'pbf-esm';

var tile = new VectorTile(new Protobuf(data));

// Contains a map of all layers
tile.layers;

var landuse = tile.layers.landuse;

// Number of features in this layer
landuse.length;

// Returns the first feature
landuse.feature(0);
```

## API Reference
vector-tile-esm exposes 3 constructors: VectorTile, VectorTileLayer, and
VectorTileFeature.

## VectorTile

An object that parses vector tile data and makes it readable.

### Constructor

- **new VectorTile(protobuf[, end])** &mdash;
  parses the vector tile data contained in the given [Protobuf][] object,
  saving resulting layers in the created object as a `layers` property. 
  Optionally accepts end index.

[Protobuf]: https://github.com/mapbox/pbf

### Properties

- **layers** (Object) &mdash; an object containing parsed layers in the form of 
  `{<name>: <layer>, ...}`, where each layer is a `VectorTileLayer` object.

## VectorTileLayer

An object that contains the data for a single vector tile layer.

### Properties

- **version** (`Number`, default: `1`)
- **name** (`String) `&mdash; layer name
- **extent** (`Number`, default: `4096`) &mdash; tile extent size
- **length** (`Number`) &mdash; number of features in the layer

### Methods

- **feature(i)** &mdash; get a feature (`VectorTileFeature`) by the given index
  from the layer.
- **toGeoJSON(size[, sx, sy])** &mdash; Return a GeoJSON FeatureCollection
  representing all the features in the layer. See the corresponding method of
  VectorTileFeature for the parameters

## VectorTileFeature

An object that contains the data for a single feature.

### Properties

- **type** (`Number`) &mdash; type of the feature (also see `VectorTileFeature.types`)
- **extent** (`Number`) &mdash; feature extent size
- **id** (`Number`) &mdash; feature identifier, if present
- **properties** (`Object`) &mdash; object literal with feature properties

### Methods

- **loadGeometry()** &mdash; parses feature geometry and returns an array of
  point objects, with each point having `x` and `y` properties
- **bbox()** &mdash; calculates and returns the bounding box of the feature in 
  the form `[x1, y1, x2, y2]`
- **toGeoJSON(size[, sx, sy])** &mdash; returns a GeoJSON representation of the 
  feature. 
  - `size` &mdash; side length of the (square) area over which the tile's 
    features will be rendered. Default: the .extent property of the layer
  - `sx`, `sy` &mdash; optionally specify the origin of the output coordinates 
    within the (size x size) rendered area of the full tile.
