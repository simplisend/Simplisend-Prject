import React , { Component } from 'react' ;
import { connect } from 'react-redux' ;
import { Logout, Settings} from './rightSidebarElements' ;
import { updateData } from '../../../../store/actions/rootActions' ;
import { ClickOutsideComponent } from '../../../../components/utils' ;


const ELEMENTS_MAP = {
  'logout' : Logout ,
  'settings' : Settings ,
}

class RightSidebarElementsContainer extends Component {



  render = () => {

    const { element } = this.props ;
    const Component = ELEMENTS_MAP[element] ;


    return (
      <div className = 'right-sidebar-elements-container' ref = {node => this.node = node}>
        {
          Component &&
          <ClickOutsideComponent
            condition = {true }
            handleClick = {() => this.props.updateData('SET_SA_RIGHT_SIDEBAR_ELEMENT',null)}
          >
            <Component history = {this.props.history}/>
          </ClickOutsideComponent>
        }

      </div>
    )

  }
}

const mapStoreToProps = state => {
  return {
    element : state.saRightSidebar.element ,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    updateData : (type,data) => dispatch(updateData(type,data)) ,
  }
}
export default connect(mapStoreToProps,mapDispatchToProps)(RightSidebarElementsContainer)
