import { act, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theSixtiesUSA } from 'react95/dist/themes';
import ImageViewerApp from './ImageViewerApp';
import { galleryImages } from './imageGallery';

const originalResizeObserver = window.ResizeObserver;
let resizeCallback;
let viewportWidth;
let viewportHeight;
let disconnect;

function renderViewer() {
  return render(
    <ThemeProvider theme={theSixtiesUSA}>
      <ImageViewerApp />
    </ThemeProvider>
  );
}

function loadImage(width = 1600, height = 1000) {
  const image = galleryImages.map(item => screen.queryByAltText(item.alt)).find(Boolean);
  Object.defineProperties(image, {
    naturalWidth: { configurable: true, value: width },
    naturalHeight: { configurable: true, value: height }
  });
  fireEvent.load(image);
  return image;
}

beforeEach(() => {
  viewportWidth = 640;
  viewportHeight = 360;
  disconnect = jest.fn();
  window.ResizeObserver = jest.fn(callback => {
    resizeCallback = callback;
    return {
      observe: element => {
        Object.defineProperties(element, {
          clientWidth: { configurable: true, get: () => viewportWidth },
          clientHeight: { configurable: true, get: () => viewportHeight }
        });
        callback();
      },
      disconnect
    };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  window.ResizeObserver = originalResizeObserver;
});

test('opens the first artwork fitted to the viewport after loading', () => {
  renderViewer();
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
  const image = loadImage();
  expect(screen.getByRole('status')).toHaveTextContent('01 / 06');
  expect(screen.getByRole('status')).toHaveTextContent('Fit · 34%');
  expect(image).toHaveStyle({ width: '537.6px', height: '336px' });
});

test('cycles through both ends of the gallery and resets zoom on navigation', () => {
  renderViewer();
  loadImage();
  fireEvent.click(screen.getByRole('button', { name: 'Actual size (100%)' }));
  fireEvent.click(screen.getByRole('button', { name: 'Previous image' }));
  loadImage();
  expect(screen.getByRole('status')).toHaveTextContent('06 / 06');
  expect(screen.getByRole('status')).toHaveTextContent('Fit');
  fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
  expect(screen.getByAltText(galleryImages[0].alt)).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('01 / 06');
});

test('resets the scroll position after fitting or changing an enlarged image', () => {
  renderViewer();
  loadImage();
  const scroller = screen.getByRole('region', { name: 'Image canvas' }).firstElementChild;
  fireEvent.click(screen.getByRole('button', { name: 'Actual size (100%)' }));
  scroller.scrollLeft = 400;
  scroller.scrollTop = 300;
  fireEvent.click(screen.getByRole('button', { name: 'Fit to window' }));
  expect(scroller.scrollLeft).toBe(0);
  expect(scroller.scrollTop).toBe(0);
  fireEvent.click(screen.getByRole('button', { name: 'Actual size (100%)' }));
  scroller.scrollLeft = 400;
  scroller.scrollTop = 300;
  fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
  expect(scroller.scrollLeft).toBe(0);
  expect(scroller.scrollTop).toBe(0);
});

test('uses original pixel dimensions for manual zoom and enforces its limits', () => {
  renderViewer();
  const image = loadImage();
  fireEvent.click(screen.getByRole('button', { name: 'Actual size (100%)' }));
  expect(image).toHaveStyle({ width: '1600px', height: '1000px' });
  fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  expect(image).toHaveStyle({ width: '2000px', height: '1250px' });
  for (let step = 0; step < 20; step += 1) {
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  }
  expect(screen.getByRole('status')).toHaveTextContent('400%');
  expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
  for (let step = 0; step < 20; step += 1) {
    fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
  }
  expect(screen.getByRole('status')).toHaveTextContent('25%');
  expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled();
});

test('recomputes fit when the canvas changes but preserves manual zoom', () => {
  renderViewer();
  const image = loadImage();
  viewportWidth = 824;
  viewportHeight = 524;
  act(() => resizeCallback());
  expect(image).toHaveStyle({ width: '800px', height: '500px' });
  fireEvent.click(screen.getByRole('button', { name: 'Actual size (100%)' }));
  viewportWidth = 424;
  act(() => resizeCallback());
  expect(image).toHaveStyle({ width: '1600px', height: '1000px' });
  fireEvent.click(screen.getByRole('button', { name: 'Fit to window' }));
  expect(image).toHaveStyle({ width: '400px', height: '250px' });
});

test('refits the artwork when the information panel reduces the canvas', () => {
  renderViewer();
  const image = loadImage();
  viewportHeight = 224;
  fireEvent.click(screen.getByRole('button', { name: 'Image information' }));
  expect(image).toHaveStyle({ width: '320px', height: '200px' });
  viewportHeight = 360;
  fireEvent.click(screen.getByRole('button', { name: 'Image information' }));
  expect(image).toHaveStyle({ width: '537.6px', height: '336px' });
});

test('does not enlarge small images in fit mode', () => {
  renderViewer();
  const image = loadImage(100, 100);
  expect(image).toHaveStyle({ width: '100px', height: '100px' });
  expect(screen.getByRole('status')).toHaveTextContent('Fit · 100%');
});

test.each([
  [1200, 1800, '224px', '336px'],
  [1024, 1024, '336px', '336px']
])('fits %i × %i artwork without changing its proportions', (width, height, fittedWidth, fittedHeight) => {
  renderViewer();
  expect(loadImage(width, height)).toHaveStyle({ width: fittedWidth, height: fittedHeight });
});

test('loads images already available from the browser cache', () => {
  jest.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
  jest.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(1600);
  jest.spyOn(HTMLImageElement.prototype, 'naturalHeight', 'get').mockReturnValue(1000);
  renderViewer();
  expect(screen.getByRole('status')).toHaveTextContent('Ready');
  fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
  expect(screen.getByRole('status')).toHaveTextContent(/02 \/ 06\s*Fit · 34%\s*Ready/);
});

test('responds to window resizing when ResizeObserver is unavailable', () => {
  window.ResizeObserver = undefined;
  renderViewer();
  const canvas = screen.getByRole('region', { name: 'Image canvas' }).firstElementChild;
  Object.defineProperties(canvas, {
    clientWidth: { value: 824 }, clientHeight: { value: 524 }
  });
  fireEvent(window, new Event('resize'));
  expect(loadImage()).toHaveStyle({ width: '800px', height: '500px' });
});

test('toggles artwork information with real dimensions and origin', () => {
  renderViewer();
  loadImage(1024, 1536);
  const button = screen.getByRole('button', { name: 'Image information' });
  fireEvent.click(button);
  const info = screen.getByRole('region', { name: 'Image information' });
  expect(info).toHaveTextContent('1024 × 1536 pixels');
  expect(info).toHaveTextContent(galleryImages[0].fileName);
  expect(info).toHaveTextContent(galleryImages[0].description);
  expect(info).toHaveTextContent('PNG');
  expect(info).toHaveTextContent('Original AI-generated artwork');
  expect(button).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(button);
  expect(screen.queryByRole('region', { name: 'Image information' })).toBeNull();
});

test('reports load failures, retries the artwork, and allows navigation', () => {
  renderViewer();
  fireEvent.error(screen.getByAltText(galleryImages[0].alt));
  expect(screen.getByRole('alert')).toHaveTextContent('could not be loaded');
  expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Retry image' }));
  expect(screen.getByRole('status')).toHaveTextContent('Loading');
  loadImage();
  expect(screen.queryByRole('alert')).toBeNull();
  fireEvent.error(screen.getByAltText(galleryImages[0].alt));
  fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
  loadImage();
  expect(screen.getByRole('status')).toHaveTextContent('02 / 06');
  expect(screen.queryByRole('alert')).toBeNull();
});

test('handles viewer keyboard commands without intercepting system shortcuts', () => {
  renderViewer();
  const viewport = screen.getByRole('region', { name: 'Image canvas' });
  loadImage();
  fireEvent.keyDown(viewport, { key: '+', ctrlKey: true });
  expect(screen.getByRole('status')).toHaveTextContent('Fit');
  fireEvent.keyDown(viewport, { key: '+' });
  expect(screen.getByRole('status')).not.toHaveTextContent('Fit');
  fireEvent.keyDown(viewport, { key: 'ArrowRight' });
  expect(screen.getByAltText(galleryImages[1].alt)).toBeInTheDocument();
  fireEvent.keyDown(viewport, { key: 'ArrowLeft', altKey: true });
  expect(screen.getByAltText(galleryImages[1].alt)).toBeInTheDocument();
  fireEvent.keyDown(viewport, { key: 'ArrowLeft' });
  expect(screen.getByAltText(galleryImages[0].alt)).toBeInTheDocument();
});

test('does not enlarge a tiny fitted image when zooming out with the keyboard', () => {
  renderViewer();
  loadImage(4000, 4000);
  expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled();
  fireEvent.keyDown(screen.getByRole('region', { name: 'Image canvas' }), { key: '-' });
  expect(screen.getByRole('status')).toHaveTextContent('Fit · 8%');
});

test('disconnects the viewport observer when closed', () => {
  const { unmount } = renderViewer();
  unmount();
  expect(disconnect).toHaveBeenCalled();
});
