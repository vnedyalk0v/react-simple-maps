import { forwardRef } from "react"
import { LineProps } from "../types"
import { useMapContext } from "./MapProvider"

const Line = forwardRef<SVGPathElement, LineProps>(
  (
    {
      from = [0, 0],
      to = [0, 0],
      coordinates,
      stroke = "currentcolor",
      strokeWidth = 3,
      fill = "transparent",
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useMapContext()

    const lineData = {
      type: "LineString" as const,
      coordinates: coordinates || [from, to],
    }

    return (
      <path
        ref={ref}
        d={path(lineData) || ""}
        className={`rsm-line ${className}`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        {...restProps}
      />
    )
  }
)

Line.displayName = "Line"

export default Line
