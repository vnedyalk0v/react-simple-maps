import { memo, forwardRef } from "react"
import { geoGraticule } from "d3-geo"
import { GraticuleProps } from "../types"
import { useMapContext } from "./MapProvider"

const Graticule = forwardRef<SVGPathElement, GraticuleProps>(
  (
    {
      fill = "transparent",
      stroke = "currentcolor",
      step = [10, 10],
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useMapContext()
    const graticule = geoGraticule().step(step)()

    return (
      <path
        ref={ref}
        d={path(graticule) || ""}
        fill={fill}
        stroke={stroke}
        className={`rsm-graticule ${className}`}
        {...restProps}
      />
    )
  }
)

Graticule.displayName = "Graticule"

export default memo(Graticule)
