import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView } from 'react95';
import { useTheme } from 'styled-components';
import imageIcon from '@/assets/icons/image_viewer.png';
import { galleryImages } from './imageGallery';
import './ImageViewerApp.css';

const CANVAS_PADDING = 24;

function ViewerButton({ label, glyph, children, ...props }) {
  return (
    <Button aria-label={label} className="image-viewer-button" {...props}>
      <span aria-hidden="true" className="image-viewer-glyph">{glyph}</span>
      <span>{children}</span>
    </Button>
  );
}

export default function ImageViewerApp() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [retry, setRetry] = useState(0);
  const [imageState, setImageState] = useState({ status: 'loading', size: null });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const image = galleryImages[index];
  const { size, status } = imageState;
  const ready = status === 'ready';
  const fitScale = size
    ? Math.max(0, Math.min(1,
      (viewport.width - CANVAS_PADDING) / size.width,
      (viewport.height - CANVAS_PADDING) / size.height))
    : 1;
  const scale = zoom === null ? fitScale : zoom / 100;

  const measureCanvas = useCallback(() => {
    const canvas = canvasRef.current?.firstElementChild;
    if (!canvas) return;
    setViewport(current => current.width === canvas.clientWidth &&
      current.height === canvas.clientHeight ? current : {
        width: canvas.clientWidth, height: canvas.clientHeight
      });
  }, []);

  useLayoutEffect(() => {
    const observer = typeof ResizeObserver === 'function'
      ? new ResizeObserver(measureCanvas) : null;
    observer?.observe(canvasRef.current.firstElementChild);
    measureCanvas();
    window.addEventListener('resize', measureCanvas);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measureCanvas);
    };
  }, [measureCanvas]);

  useLayoutEffect(measureCanvas, [measureCanvas, showInfo, zoom, status]);

  function imageLoaded(element) {
    if (element.naturalWidth > 0 && element.naturalHeight > 0) {
      setImageState({ status: 'ready', size: {
        width: element.naturalWidth, height: element.naturalHeight
      } });
    }
  }

  useEffect(() => {
    if (imageRef.current?.complete) imageLoaded(imageRef.current);
  }, [image.id, retry]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current.firstElementChild;
    canvas.scrollTop = 0;
    canvas.scrollLeft = 0;
  }, [image.id, retry, zoom]);

  function navigate(direction) {
    setIndex(current => (current + direction + galleryImages.length) % galleryImages.length);
    setZoom(null);
    setRetry(0);
    setImageState({ status: 'loading', size: null });
  }

  function changeZoom(direction) {
    if (!ready || (direction < 0 && scale <= 0.25)) return;
    setZoom(Math.min(400, Math.max(25,
      (zoom === null ? Math.round(fitScale * 100) : zoom) + direction * 25)));
  }

  function handleKeyboard(event) {
    if (event.altKey || event.ctrlKey || event.metaKey ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable) return;
    const actions = {
      ArrowLeft: () => navigate(-1), ArrowRight: () => navigate(1),
      '+': () => changeZoom(1), '=': () => changeZoom(1), '-': () => changeZoom(-1)
    };
    if (actions[event.key]) {
      event.preventDefault();
      actions[event.key]();
    }
  }

  return (
    <div className="image-viewer-app" onKeyDown={handleKeyboard} style={{
      '--viewer-material': theme.material,
      '--viewer-text': theme.materialText,
      '--viewer-dark': theme.borderDark,
      '--viewer-darkest': theme.borderDarkest,
      '--viewer-light': theme.borderLightest
    }}>
      <div aria-label="Image controls" className="image-viewer-toolbar" role="toolbar">
        <ViewerButton label="Previous image" glyph="←" onClick={() => navigate(-1)}>Previous</ViewerButton>
        <ViewerButton label="Next image" glyph="→" onClick={() => navigate(1)}>Next</ViewerButton>
        <span aria-hidden="true" className="image-viewer-divider" />
        <ViewerButton label="Zoom out" glyph="−" disabled={!ready || scale <= 0.25} onClick={() => changeZoom(-1)}>Out</ViewerButton>
        <ViewerButton label="Zoom in" glyph="+" disabled={!ready || zoom >= 400} onClick={() => changeZoom(1)}>In</ViewerButton>
        <Button aria-label="Actual size (100%)" className="image-viewer-button" disabled={!ready} onClick={() => setZoom(100)}>100%</Button>
        <ViewerButton label="Fit to window" glyph="▣" disabled={!ready} aria-pressed={zoom === null} onClick={() => setZoom(null)}>Fit</ViewerButton>
        <ViewerButton label="Image information" glyph="i" aria-controls="image-viewer-info" aria-expanded={showInfo} onClick={() => setShowInfo(current => !current)}>Info</ViewerButton>
      </div>

      <div className="image-viewer-archive-label">
        <img alt="" src={imageIcon} />
        <span>VAPOR ARCHIVE</span><small>{String(galleryImages.length).padStart(2, '0')} ORIGINAL FRAMES</small>
      </div>

      <ScrollView aria-label="Image canvas" className="image-viewer-canvas" ref={canvasRef} role="region" shadow={false} tabIndex={0}>
        <div className="image-viewer-stage">
          {status === 'loading' && <p className="image-viewer-message">Loading artwork…</p>}
          {status === 'error' && (
            <div className="image-viewer-message" role="alert">
              <p>This image could not be loaded.</p>
              <Button onClick={() => {
                setImageState({ status: 'loading', size: null });
                setRetry(current => current + 1);
              }}>Retry image</Button>
            </div>
          )}
          <img alt={image.alt} className={`image-viewer-artwork${ready ? '' : ' is-pending'}`}
            draggable={false} key={`${image.id}-${retry}`} ref={imageRef}
            onError={() => setImageState({ status: 'error', size: null })}
            onLoad={event => imageLoaded(event.currentTarget)} src={image.src}
            style={size ? { width: size.width * scale, height: size.height * scale } : undefined} />
        </div>
      </ScrollView>

      {showInfo && (
        <ScrollView as="section" aria-label="Image information" className="image-viewer-info" id="image-viewer-info" shadow={false}>
          <strong>{image.title}</strong><p>{image.description}</p>
          <dl>
            <div><dt>File</dt><dd>{image.fileName}</dd></div>
            <div><dt>Format</dt><dd>{image.format}</dd></div>
            <div><dt>Dimensions</dt><dd>{size ? `${size.width} × ${size.height} pixels` : 'Unavailable until loaded'}</dd></div>
            <div><dt>Source</dt><dd>Original AI-generated artwork · Vintage Vibe</dd></div>
          </dl>
        </ScrollView>
      )}

      <footer aria-live="polite" className="image-viewer-status" role="status">
        <span className="image-viewer-status-title">{image.title}</span>
        <span>{String(index + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}</span>
        <span>{ready ? `${zoom === null ? 'Fit · ' : ''}${Math.round(scale * 100)}%` : '—'}</span>
        <span>{status === 'loading' ? 'Loading' : status === 'error' ? 'Load failed' : 'Ready'}</span>
      </footer>
    </div>
  );
}
