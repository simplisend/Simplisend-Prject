import React from 'react' ;
import { connect } from 'react-redux' ;

const HeaderButton = ({id,zIndex,action,title,active,name,showHeaderButton}) => {

  let zIndx = zIndex ;
  let cls = 'tag' ;

  if ( name === active ) {
    zIndx = 100 ;
    cls = 'tag active' ;
  }


  /* if the starter screen is hidden */
  if ( showHeaderButton ) {
    return (

      <button
        id = {id}
        style = {{zIndex : zIndx}}
        onClick = { action }
        className = {cls}
        name = {name}
      >
        {title}
      </button>
    )
  }
  return null ;

}

const mapStoreToProps = (state) => {
  return {
    active : state.header.active ,
    showHeaderButton : state.header.showHeaderButton ,
  }
}

export default connect(mapStoreToProps)(HeaderButton) ;
