import test from 'tape';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import eventHelper from '../assets/js/src/helpers/event';
import ResponsiveImage from '../assets/js/src/components/ResponsiveImage.jsx';
import ResponsiveImageSize from '../assets/js/src/components/ResponsiveImageSize.jsx';

const host = window.location.host;
const imageData = {
  initialUrl: 'http://' + host + '/assets/images/original/building.jpg',
  smallImageUrl: 'http://' + host + '/assets/images/small/building.jpg',
  mediumImageUrl: 'http://' + host + '/assets/images/medium/building.jpg',
  originalImageUrl: 'http://' + host + '/assets/images/original/building.jpg',
};


test('ResponsiveImage component: Should return an object ', (assert) => {
  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  assert.equal(typeof component, 'object');
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should render child ResponsiveImageSize' +
  ' components ', (assert) => {
  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  assert.equal(component.props.children[0].type.name, 'ResponsiveImageSize');
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should render a background image', (assert) => {
  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage background>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  const node = ReactDOM.findDOMNode(component).firstChild.firstChild;
  const nodeStyle = node.getAttribute('style');

  window.innerWidth = 400;

  const resizeEvent =
    eventHelper.createEvent('Events', 'resize', 0, 0, 0, 0);
  eventHelper.dispatchEvent(window, resizeEvent);

  assert.equal(nodeStyle.indexOf('background-image'), 0);
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should add an additional class ', (assert) => {
  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage className='additional-class'>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  const node = ReactDOM.findDOMNode(component);
  const nodeClass = node.getAttribute('class');

  assert.equal(nodeClass, 'component-responsive-image additional-class');
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should add an \'alt\' attribute ', (assert) => {
  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage
      alt={'Image alt text'}
    >
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  const node = ReactDOM.findDOMNode(component);
  const nodeClass = node.childNodes[0].childNodes[0].getAttribute('alt');

  assert.equal(nodeClass, 'Image alt text');
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should load the proper size image if the ' +
  'browser width is greater than 768px ', (assert) => {
  window.innerWidth = 769;

  const resizeEvent =
    eventHelper.createEvent('Events', 'resize', 0, 0, 0, 0);
  eventHelper.dispatchEvent(window, resizeEvent);

  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage className='additional-class'>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  const node = ReactDOM.findDOMNode(component).firstChild.firstChild;
  const nodeSrc = node.getAttribute('src');

  assert.equal(nodeSrc, imageData.mediumImageUrl);
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should load the original size image if the ' +
  'browser width is greater than 1100px ', (assert) => {
  window.innerWidth = 1101;

  const resizeEvent =
    eventHelper.createEvent('Events', 'resize', 0, 0, 0, 0);
  eventHelper.dispatchEvent(window, resizeEvent);

  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage className='additional-class'>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  const node = ReactDOM.findDOMNode(component).firstChild.firstChild;
  const nodeSrc = node.getAttribute('src');

  assert.equal(nodeSrc, imageData.originalImageUrl);
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should fire the onLoad callback', (assert) => {
  window.innerWidth = 400;

  let loadCount = 0;
  const resizeEvent =
    eventHelper.createEvent('Events', 'resize', 0, 0, 0, 0);
  eventHelper.dispatchEvent(window, resizeEvent);

  function loadCallback() {
    loadCount++;

    // there will be 2 callbacks fired, one for the initial image and another
    // because a new image is loaded when the window is resized
    if (loadCount === 1) {
      ReactDOM.unmountComponentAtNode(document);
      assert.end();
    }
  }

  ReactTestUtils.renderIntoDocument(
    <ResponsiveImage className='additional-class' onLoad={loadCallback}>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );
});


test('ResponsiveImage component: Should load the placeholder image if the ' +
  'lazy prop is true ', (assert) => {
  window.innerWidth = 1025;

  const resizeEvent =
    eventHelper.createEvent('Events', 'resize', 0, 0, 0, 0);
  eventHelper.dispatchEvent(window, resizeEvent);

  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage lazy>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  const node = ReactDOM.findDOMNode(component).firstChild.firstChild;
  const nodeSrc = node.getAttribute('src');

  assert.equal(nodeSrc, component.refs.currentImageSize.placeHolderUrl);
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should load the the proper image if the ' +
  'lazy prop is true and loadImage() is called', (assert) => {
  window.innerWidth = 1101;

  let loadCount = 0;
  const resizeEvent =
    eventHelper.createEvent('Events', 'resize', 0, 0, 0, 0);
  eventHelper.dispatchEvent(window, resizeEvent);

  function lazyLoadCallback() {
    loadCount++;

    // there will be 2 callbacks fired, one for the initial image and another
    // because a new image is loaded when the window is resized
    if (loadCount === 1) {
      const node = ReactDOM.findDOMNode(component).firstChild.firstChild;
      const nodeSrc = node.getAttribute('src');

      assert.equal(nodeSrc, imageData.originalImageUrl);
      ReactDOM.unmountComponentAtNode(document);
      assert.end();
    }
  }

  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage
      lazy
      onLoad={lazyLoadCallback}
    >
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );

  component.loadImage();
});


test('ResponsiveImage component: Should add style ', (assert) => {
  const newStyle = {
    left: '10px',
  };

  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage imageStyle={newStyle}>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );


  const node = ReactDOM.findDOMNode(component).firstChild.firstChild;
  const nodeStyle = node.getAttribute('style');

  assert.equal(nodeStyle, 'left: 10px;');
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});


test('ResponsiveImage component: Should add style to a background image',
(assert) => {
  const newStyle = {
    left: '10px',
  };

  const component = ReactTestUtils.renderIntoDocument(
    <ResponsiveImage imageStyle={newStyle} background>
      <ResponsiveImageSize
        default
        minWidth={0}
        path={imageData.initialUrl}
      />
      <ResponsiveImageSize
        minWidth={768}
        path={imageData.mediumImageUrl}
      />
      <ResponsiveImageSize
        minWidth={1100}
        path={imageData.originalImageUrl}
      />
    </ResponsiveImage>
  );


  const node = ReactDOM.findDOMNode(component).firstChild.firstChild;
  const nodeStyle = node.getAttribute('style');

  assert.equal(nodeStyle, 'left: 10px; background-image: url(' + imageData.initialUrl + ');');
  ReactDOM.unmountComponentAtNode(document);
  assert.end();
});
