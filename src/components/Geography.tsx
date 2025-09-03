import { useState, memo, Ref, useMemo, useCallback } from 'react';
import { GeographyProps, PreparedFeature } from '../types';

function Geography({
  geography,
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
}: GeographyProps & { ref?: Ref<SVGPathElement> }) {
  const [isPressed, setPressed] = useState(false);
  const [isFocused, setFocus] = useState(false);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(
    (evt: React.MouseEvent<SVGPathElement>) => {
      setFocus(true);
      if (onMouseEnter) onMouseEnter(evt);
    },
    [onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (evt: React.MouseEvent<SVGPathElement>) => {
      setFocus(false);
      if (isPressed) setPressed(false);
      if (onMouseLeave) onMouseLeave(evt);
    },
    [onMouseLeave, isPressed],
  );

  const handleFocus = useCallback(
    (evt: React.FocusEvent<SVGPathElement>) => {
      setFocus(true);
      if (onFocus) onFocus(evt);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (evt: React.FocusEvent<SVGPathElement>) => {
      setFocus(false);
      if (isPressed) setPressed(false);
      if (onBlur) onBlur(evt);
    },
    [onBlur, isPressed],
  );

  const handleMouseDown = useCallback(
    (evt: React.MouseEvent<SVGPathElement>) => {
      setPressed(true);
      if (onMouseDown) onMouseDown(evt);
    },
    [onMouseDown],
  );

  const handleMouseUp = useCallback(
    (evt: React.MouseEvent<SVGPathElement>) => {
      setPressed(false);
      if (onMouseUp) onMouseUp(evt);
    },
    [onMouseUp],
  );

  // Memoize current state calculation
  const currentState = useMemo(() => {
    return isPressed || isFocused
      ? isPressed
        ? 'pressed'
        : 'hover'
      : 'default';
  }, [isPressed, isFocused]);

  // Memoize the SVG path to prevent unnecessary recalculations
  const svgPath = useMemo(() => {
    return (geography as PreparedFeature).svgPath;
  }, [geography]);

  // Memoize the current style to prevent unnecessary style recalculations
  const currentStyle = useMemo(() => {
    return style[currentState];
  }, [style, currentState]);

  return (
    <path
      ref={ref}
      tabIndex={0}
      className={`rsm-geography ${className}`}
      d={svgPath}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={currentStyle}
      {...restProps}
    />
  );
}

Geography.displayName = 'Geography';

// Custom comparison function for memo to prevent unnecessary re-renders
const arePropsEqual = (
  prevProps: GeographyProps & { ref?: Ref<SVGPathElement> },
  nextProps: GeographyProps & { ref?: Ref<SVGPathElement> },
): boolean => {
  // Check if geography data has changed (most important check)
  if (prevProps.geography !== nextProps.geography) {
    return false;
  }

  // Check if the SVG path has changed (expensive to recalculate)
  const prevPath = (prevProps.geography as PreparedFeature).svgPath;
  const nextPath = (nextProps.geography as PreparedFeature).svgPath;
  if (prevPath !== nextPath) {
    return false;
  }

  // Check if event handlers have changed (shallow comparison)
  const eventHandlers = [
    'onMouseEnter',
    'onMouseLeave',
    'onMouseDown',
    'onMouseUp',
    'onFocus',
    'onBlur',
    'onClick',
  ] as const;

  for (const handler of eventHandlers) {
    if (prevProps[handler] !== nextProps[handler]) {
      return false;
    }
  }

  // Check if style object has changed (deep comparison for style states)
  if (prevProps.style !== nextProps.style) {
    if (!prevProps.style || !nextProps.style) {
      return false;
    }

    const styleStates = ['default', 'hover', 'pressed', 'focused'] as const;
    for (const state of styleStates) {
      const prevStyle = prevProps.style[state];
      const nextStyle = nextProps.style[state];

      if (prevStyle !== nextStyle) {
        // Shallow comparison of style objects
        if (!prevStyle || !nextStyle) {
          return false;
        }

        const prevKeys = Object.keys(prevStyle);
        const nextKeys = Object.keys(nextStyle);

        if (prevKeys.length !== nextKeys.length) {
          return false;
        }

        for (const key of prevKeys) {
          if (
            prevStyle[key as keyof typeof prevStyle] !==
            nextStyle[key as keyof typeof nextStyle]
          ) {
            return false;
          }
        }
      }
    }
  }

  // Check className
  if (prevProps.className !== nextProps.className) {
    return false;
  }

  // All other props are considered equal if we reach here
  return true;
};

export default memo(Geography, arePropsEqual);
