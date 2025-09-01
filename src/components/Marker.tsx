import { useState, forwardRef, CSSProperties } from "react"
import { MarkerProps } from "../types"
import { useMapContext } from "./MapProvider"

const Marker = forwardRef<SVGGElement, MarkerProps>(
  (
    {
      coordinates,
      children,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
      style = {},
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { projection } = useMapContext()
    const [isPressed, setPressed] = useState(false)
    const [isFocused, setFocus] = useState(false)

    const projectedCoords = projection(coordinates)
    if (!projectedCoords) {
      return null
    }

    const [x, y] = projectedCoords

    function handleMouseEnter(evt: React.MouseEvent<SVGGElement>) {
      setFocus(true)
      if (onMouseEnter) onMouseEnter(evt)
    }

    function handleMouseLeave(evt: React.MouseEvent<SVGGElement>) {
      setFocus(false)
      if (isPressed) setPressed(false)
      if (onMouseLeave) onMouseLeave(evt)
    }

    function handleFocus(evt: React.FocusEvent<SVGGElement>) {
      setFocus(true)
      if (onFocus) onFocus(evt)
    }

    function handleBlur(evt: React.FocusEvent<SVGGElement>) {
      setFocus(false)
      if (isPressed) setPressed(false)
      if (onBlur) onBlur(evt)
    }

    function handleMouseDown(evt: React.MouseEvent<SVGGElement>) {
      setPressed(true)
      if (onMouseDown) onMouseDown(evt)
    }

    function handleMouseUp(evt: React.MouseEvent<SVGGElement>) {
      setPressed(false)
      if (onMouseUp) onMouseUp(evt)
    }

    const currentState = isPressed || isFocused ? (isPressed ? "pressed" : "hover") : "default"

    const currentStyle = (style as any)?.[currentState] as CSSProperties | undefined

    return (
      <g
        ref={ref}
        transform={`translate(${x}, ${y})`}
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
    )
  }
)

Marker.displayName = "Marker"

export default Marker
