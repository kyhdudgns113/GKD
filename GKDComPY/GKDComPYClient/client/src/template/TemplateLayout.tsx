import {Outlet} from 'react-router-dom'
import {CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../common'
import {Footer, Header, Sidebar} from './parts'

type TemplateLayoutProps = DivCommonProps & {}
export const TemplateLayout: FC<TemplateLayoutProps> = ({className, ...props}) => {
  const centerHeight = window.innerHeight - 120

  const styleDiv: CSSProperties = {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh',
    overflowX: 'auto'
  }
  const styleHead: CSSProperties = {
    borderBottomWidth: '4px',
    borderColor: SAKURA_BORDER,
    height: '60px',

    padding: '10px'
  }
  const styleBodyDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    width: '1920px'
  }
  const styleOutlet: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: `${centerHeight}px`,
    overflowX: 'auto',
    width: '1670px'
  }

  return (
    <div className={className} style={styleDiv} {...props}>
      <Header style={styleHead} />
      <div className="BODY_DIV " style={styleBodyDiv}>
        <Sidebar width="250px" />
        <div style={styleOutlet}>
          <Outlet />
        </div>
      </div>
      <Footer style={{height: '60px'}} />
    </div>
  )
}
