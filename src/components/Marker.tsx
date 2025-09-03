import { useState, Ref, memo, useMemo, useCallback } from 'react';
import { MarkerProps } from '../types';
import { useMapContext } from './MapProvider';

function Marker({
  coordinates,
  children,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  style = {},
  className = '',
  ref,
  ...restProps
}: MarkerProps & { ref?: Ref<SVGGElement> }) {
  const { projection } = useMapContext();
  const [isPressed, setPressed] = useState(false);
  const [isFocused, setFocus] = useState(false);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(
    (evt: React.MouseEvent<SVGGElement>) => {
      setFocus(true);
      if (onMouseEnter) onMouseEnter(evt);
    },
    [onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (evt: React.MouseEvent<SVGGElement>) => {
      setFocus(false);
      if (isPressed) setPressed(false);
      if (onMouseLeave) onMouseLeave(evt);
    },
    [onMouseLeave, isPressed],
  );

  const handleFocus = useCallback(
    (evt: React.FocusEvent<SVGGElement>) => {
      setFocus(true);
      if (onFocus) onFocus(evt);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (evt: React.FocusEvent<SVGGElement>) => {
      setFocus(false);
      if (isPressed) setPressed(false);
      if (onBlur) onBlur(evt);
    },
    [onBlur, isPressed],
  );

  const handleMouseDown = useCallback(
    (evt: React.MouseEvent<SVGGElement>) => {
      setPressed(true);
      if (onMouseDown) onMouseDown(evt);
    },
    [onMouseDown],
  );

  const handleMouseUp = useCallback(
    (evt: React.MouseEvent<SVGGElement>) => {
      setPressed(false);
      if (onMouseUp) onMouseUp(evt);
    },
    [onMouseUp],
  );

  // Memoize projection calculation to prevent unnecessary recalculations
  const projectedCoords = useMemo(() => {
    return projection(coordinates);
  }, [projection, coordinates]);

  // Memoize current state calculation
  const currentState = useMemo(() => {
    return isPressed || isFocused
      ? isPressed
        ? 'pressed'
        : 'hover'
      : 'default';
  }, [isPressed, isFocused]);

  // Memoize current style to prevent unnecessary style recalculations
  const currentStyle = useMemo(() => {
    return style?.[currentState];
  }, [style, currentState]);

  // Memoize transform string (only if coordinates exist)
  const transform = useMemo(() => {
    if (!projectedCoords) return '';
    const [x, y] = projectedCoords;
    return `translate(${x}, ${y})`;
  }, [projectedCoords]);

  if (!projectedCoords) {
    return null;
  }

  return (
    <g
      ref={ref}
      transform={transform}
      className={`rsm-marker ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={currentStyle}
      {...restProps}
    >
      {children}
    </g>
  );
}

Marker.displayName = 'Marker';

export default memo(Marker);
