import {
  createContext,
  FC,
  Fragment,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"

type NamedElement = {
  name: string
  component: React.ReactNode
}

const PortalContext = createContext({
  addComponent: (_element: NamedElement) => {},
  removeComponent: (_name: string) => {},
})

type PortalProps = {
  children: React.ReactNode
  name: string
}

const Portal: React.FC<PortalProps> = ({ children, name }) => {
  const { addComponent, removeComponent } = useContext(PortalContext)

  useEffect(() => {
    addComponent({ name, component: children })
    return () => removeComponent(name)
  }, [addComponent, removeComponent, children, name])

  return null
}

const PortalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [components, setComponents] = useState<Record<string, React.ReactNode>>({})

  const addComponent = ({ name, component }: NamedElement) => {
    setComponents((prevComponents) => ({
      ...prevComponents,
      [name]: component,
    }))
  }
  const removeComponent = (name: string) => {
    setComponents((prevComponents) => {
      const newComponents = { ...prevComponents }
      delete newComponents[name]
      return newComponents
    })
  }
  return (
    <PortalContext.Provider value={{ addComponent, removeComponent }}>
      <Fragment>{children}</Fragment>
      <Fragment>{Object.values(components).map((Component) => Component)}</Fragment>
    </PortalContext.Provider>
  )
}

export { PortalContext, Portal, PortalProvider }
