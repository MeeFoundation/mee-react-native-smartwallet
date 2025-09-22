import { type FC } from "react"
import { StyleSheet, View, type ViewProps } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 8,
    gap: 8,
  },
  content: {
    flex: 1,
  },
  header: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
})

/* -------------------------------------------------------------------------------------------------
 * ListLayoutHeader
 * -----------------------------------------------------------------------------------------------*/
type ListLayoutHeaderProps = ViewProps

const ListLayoutHeader: FC<ListLayoutHeaderProps> = ({ style, ...rest }) => (
  <View style={[styles.header, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ListLayoutContent
 * -----------------------------------------------------------------------------------------------*/
type ListLayoutContentProps = ViewProps

const ListLayoutContent: FC<ListLayoutContentProps> = ({ style, ...rest }) => (
  <View style={[styles.content, style]} {...rest} />
)

/* -------------------------------------------------------------------------------------------------
 * ListLayout
 * -----------------------------------------------------------------------------------------------*/
type ListLayoutProps = ViewProps

const ListLayout: FC<ListLayoutProps> = ({ style, ...rest }) => (
  <View style={[styles.container, style]} {...rest} />
)

/* -----------------------------------------------------------------------------------------------*/

const Root = ListLayout
const Header = ListLayoutHeader
const Content = ListLayoutContent

export {
  Content,
  Header,
  //
  ListLayout,
  ListLayoutContent,
  ListLayoutHeader,
  Root,
}
export type { ListLayoutContentProps, ListLayoutHeaderProps, ListLayoutProps }
