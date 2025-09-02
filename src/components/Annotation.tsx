import { Ref, SVGProps } from 'react';
import { AnnotationProps } from '../types';
import { useMapContext } from './MapProvider';
import { createConnectorPath } from '../utils';

function Annotation({
  subject,
  children,
  connectorProps,
  dx = 30,
  dy = 30,
  curve = 0,
  className = '',
  ref,
  ...restProps
}: AnnotationProps & { ref?: Ref<SVGGElement> }) {
  const { projection } = useMapContext();
  const projectedCoords = projection(subject);

  if (!projectedCoords) {
    return null;
  }

  const [x, y] = projectedCoords;
  const connectorPath = createConnectorPath(dx, dy, curve);

  return (
    <g
      ref={ref}
      transform={`translate(${x + dx}, ${y + dy})`}
      className={`rsm-annotation ${className}`}
      {...restProps}
    >
      <path
        d={connectorPath}
        fill="transparent"
        stroke="#000"
        {...(connectorProps as SVGProps<SVGPathElement>)}
      />
      {children}
    </g>
  );
}

Annotation.displayName = 'Annotation';

export default Annotation;
