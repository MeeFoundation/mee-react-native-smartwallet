import Svg, { Path, SvgProps } from "react-native-svg"

export const DatabaseIcon = (props: SvgProps) => {
  return (
    <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" {...props}>
      <Path
        d="M4.5 7V17C4.5 19.2091 8.08172 21 12.5 21C16.9183 21 20.5 19.2091 20.5 17V7M4.5 7C4.5 9.20914 8.08172 11 12.5 11C16.9183 11 20.5 9.20914 20.5 7M4.5 7C4.5 4.79086 8.08172 3 12.5 3C16.9183 3 20.5 4.79086 20.5 7M20.5 12C20.5 14.2091 16.9183 16 12.5 16C8.08172 16 4.5 14.2091 4.5 12"
        stroke="#4F868E"
        strokeWidth="2"
      />
    </Svg>
  )
}
