import Svg, { Path, SvgProps } from "react-native-svg"

export const LinkIcon = (props: SvgProps) => {
  return (
    <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" {...props}>
      <Path
        d="M14.3284 10.1716C12.7663 8.60948 10.2337 8.60948 8.67157 10.1716L4.67157 14.1716C3.10948 15.7337 3.10948 18.2663 4.67157 19.8284C6.23367 21.3905 8.76633 21.3905 10.3284 19.8284L11.43 18.7269M10.6716 13.8284C12.2337 15.3905 14.7663 15.3905 16.3284 13.8284L20.3284 9.82843C21.8905 8.26633 21.8905 5.73367 20.3284 4.17157C18.7663 2.60948 16.2337 2.60948 14.6716 4.17157L13.572 5.27118"
        stroke="#4F868E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
