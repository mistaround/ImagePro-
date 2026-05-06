export function clampZoom(zoom: number): number {
  return Math.max(0.1, Math.min(10, zoom));
}

export function zoomToPoint(
  currentZoom: number,
  currentPanX: number,
  currentPanY: number,
  delta: number,
  cx: number,
  cy: number,
): { zoom: number; panX: number; panY: number } {
  const newZoom = clampZoom(currentZoom + delta * currentZoom);
  const scale = newZoom / currentZoom;
  return {
    zoom: newZoom,
    panX: cx - scale * (cx - currentPanX),
    panY: cy - scale * (cy - currentPanY),
  };
}

export function fitToRect(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
): { zoom: number; panX: number; panY: number } {
  const scaleX = containerWidth / imageWidth;
  const scaleY = containerHeight / imageHeight;
  const zoom = Math.min(scaleX, scaleY, 1);
  return {
    zoom,
    panX: (containerWidth - imageWidth * zoom) / 2,
    panY: (containerHeight - imageHeight * zoom) / 2,
  };
}
