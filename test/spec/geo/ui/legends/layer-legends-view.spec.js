var LayerLegendsView = require('../../../../../src/geo/ui/legends/layer-legends-view');
var CartoDBLayer = require('../../../../../src/geo/map/cartodb-layer');

describe('geo/ui/legends/layer-legends-view', function () {
  beforeEach(function () {
    var vis = jasmine.createSpyObj('vis', ['reload']);
    this.cartoDBLayer = new CartoDBLayer({
      layer_name: 'CartoDB Layer #1',
      legends: [
        { type: 'bubble', title: 'Bubble Legend' },
        { type: 'category', title: 'Category Legend' }
      ]
    }, { vis: vis });

    this.layerLegendsView = new LayerLegendsView({
      model: this.cartoDBLayer
    });

    this.layerLegendsView.render();
    this.toggleLayerCheck = this.layerLegendsView.$('.js-toggle-layer');
  });

  var getLegendTitles = function (layerLegendsView) {
    var titleElements = layerLegendsView.$('.CDB-Legend-Title').get();
    return titleElements.map(function (element) { return element.textContent.trim(); });
  };

  it('should render all legends', function () {
    // Legends of all types have been rendered
    expect(this.layerLegendsView.$('.CDB-Legend').length).toEqual(5);

    // Only 2 of them have titles
    expect(getLegendTitles(this.layerLegendsView)).toEqual([ 'Category Legend', 'Bubble Legend' ]);
  });

  it('should hide/show the layer if check next to title is clicked', function () {
    expect(this.cartoDBLayer.isVisible()).toBeTruthy();

    this.toggleLayerCheck.trigger('click');

    expect(this.cartoDBLayer.isVisible()).toBeFalsy();

    this.toggleLayerCheck.trigger('click');

    expect(this.cartoDBLayer.isVisible()).toBeTruthy();
  });

  it('should uncheck/check the check if layer is hidden/shown', function () {
    expect(this.toggleLayerCheck.is(':checked')).toBe(true);

    this.cartoDBLayer.hide();

    expect(this.toggleLayerCheck.is(':checked')).toBe(false);

    this.cartoDBLayer.show();

    expect(this.toggleLayerCheck.is(':checked')).toBe(true);
  });

  it('should disable/enable itself and legend views when layer is hidden/shown', function () {
    expect(this.layerLegendsView.$el.hasClass('is-disabled')).toBeFalsy();
    expect(this.layerLegendsView.$('.is-disabled').length).toEqual(0);

    this.cartoDBLayer.hide();

    // View is disabled
    expect(this.layerLegendsView.$el.hasClass('is-disabled')).toBeTruthy();
    // Legend views are also disabled
    expect(this.layerLegendsView.$('.is-disabled').length).toEqual(5);

    this.cartoDBLayer.show();

    expect(this.layerLegendsView.$el.hasClass('is-disabled')).toBeFalsy();
    expect(this.layerLegendsView.$('.is-disabled').length).toEqual(0);
  });
});