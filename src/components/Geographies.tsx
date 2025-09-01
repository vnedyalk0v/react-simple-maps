import { forwardRef } from "react"
import { GeographiesProps } from "../types"
import { useMapContext } from "./MapProvider"
import useGeographies from "./useGeographies"

const Geographies = forwardRef<SVGGElement, GeographiesProps>(
  ({ geography, children, parseGeographies, className = "", ...restProps }, ref) => {
    const { path, projection } = useMapContext()
    const { geographies, outline, borders } = useGeographies({
      geography,
      ...(parseGeographies && { parseGeographies }),
    })

    return (
      <g ref={ref} className={`rsm-geographies ${className}`} {...restProps}>
        {geographies &&
          geographies.length > 0 &&
          children({ geographies, outline, borders, path, projection })}
      </g>
    )
  }
)

Geographies.displayName = "Geographies"

export default Geographies
