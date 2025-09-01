import { useState, memo, forwardRef } from "react"
import { GeographyProps, PreparedFeature } from "../types"

const Geography = forwardRef<SVGPathElement, GeographyProps>(
  (
    {
      geography,
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
    const [isPressed, setPressed] = useState(false)
    const [isFocused, setFocus] = useState(false)

    function handleMouseEnter(evt: React.MouseEvent<SVGPathElement>) {
      setFocus(true)
      if (onMouseEnter) onMouseEnter(evt)
    }

    function handleMouseLeave(evt: React.MouseEvent<SVGPathElement>) {
      setFocus(false)
      if (isPressed) setPressed(false)
      if (onMouseLeave) onMouseLeave(evt)
    }

    function handleFocus(evt: React.FocusEvent<SVGPathElement>) {
      setFocus(true)
      if (onFocus) onFocus(evt)
    }

    function handleBlur(evt: React.FocusEvent<SVGPathElement>) {
      setFocus(false)
      if (isPressed) setPressed(false)
      if (onBlur) onBlur(evt)
    }

    function handleMouseDown(evt: React.MouseEvent<SVGPathElement>) {
      setPressed(true)
      if (onMouseDown) onMouseDown(evt)
    }

    function handleMouseUp(evt: React.MouseEvent<SVGPathElement>) {
      setPressed(false)
      if (onMouseUp) onMouseUp(evt)
    }

    const currentState = isPressed || isFocused ? (isPressed ? "pressed" : "hover") : "default"

    return (
      <path
        ref={ref}
        tabIndex={0}
        className={`rsm-geography ${className}`}
        d={(geography as PreparedFeature).svgPath}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={style[currentState]}
        {...restProps}
      />
    )
  }
)

Geography.displayName = "Geography"

export default memo(Geography)
