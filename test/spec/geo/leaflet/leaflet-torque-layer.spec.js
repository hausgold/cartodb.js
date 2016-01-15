/* global L */
var $ = require('jquery');
var SharedTestsForTorqueLayer = require('../shared-tests-for-torque-layer');

describe('geo/leaflet/leaflet-torque-layer', function () {
  beforeEach(function () {
    var container = $('<div>').css({
      'height': '200px',
      'width': '200px'
    });
    this.map = new cdb.geo.Map();
    this.mapView = new cdb.geo.LeafletMapView({
      el: container,
      map: this.map
    });

    spyOn(L.TorqueLayer.prototype, 'initialize').and.callThrough();

    var model = new cdb.geo.TorqueLayer({
      type: 'torque',
      sql: 'select * from table',
      cartocss: '#test {}',
      dynamic_cdn: 'dynamic-cdn-value'
    });
    this.map.addLayer(model);
    this.view = this.mapView.layers[model.cid];
  });

  SharedTestsForTorqueLayer.call(this);

  it('should reuse layer view', function () {
    expect(this.view instanceof L.TorqueLayer).toEqual(true);

    this.view.check = 'testing';
    var newLayer = this.view.model.clone();
    newLayer.set({ sql: 'select * from table', cartocss: '#test {}' });
    this.map.layers.reset([newLayer]);

    expect(this.mapView.layers[newLayer.cid] instanceof L.TorqueLayer).toEqual(true);
    expect(this.mapView.layers[newLayer.cid].model).toEqual(newLayer);
    expect(this.mapView.layers[newLayer.cid].check).toEqual('testing');
  });

  it('should apply Leaflet TorqueLayer initialize method on the extended view with a bunch of attrs', function () {
    expect(L.TorqueLayer.prototype.initialize).toHaveBeenCalled();

    var attrs = L.TorqueLayer.prototype.initialize.calls.argsFor(0)[0];
    expect(attrs.cartocss).toEqual(jasmine.any(String));
    expect(attrs.dynamic_cdn).toEqual('dynamic-cdn-value');
    expect(attrs.instanciateCallback).toEqual(jasmine.any(Function));
  });
});