import { Fragment, memo, useMemo, forwardRef } from "react"
import { SphereProps } from "../types"
import { useMapContext } from "./MapProvider"

const Sphere = forwardRef<SVGPathElement, SphereProps>(
  (
    {
      id = "rsm-sphere",
      fill = "transparent",
      stroke = "currentcolor",
      strokeWidth = 0.5,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const { path } = useMapContext()
    const spherePath = useMemo(() => path({ type: "Sphere" }), [path])

    return (
      <Fragment>
        <defs>
          <clipPath id={id}>
            <path d={spherePath || ""} />
          </clipPath>
        </defs>
        <path
          ref={ref}
          d={spherePath || ""}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={{ pointerEvents: "none" }}
          className={`rsm-sphere ${className}`}
          {...restProps}
        />
      </Fragment>
    )
  }
)

Sphere.displayName = "Sphere"

export default memo(Sphere)
