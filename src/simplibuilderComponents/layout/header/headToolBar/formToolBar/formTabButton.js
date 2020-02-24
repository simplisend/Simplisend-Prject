import React from 'react' ;
import { connect } from 'react-redux' ;



const FormTabButton =({cls,id,symbol,action,selected,type,active,name}) => {
 
  let clsName ;
  if (type === 'activeButton') {
    clsName = id === active ? `${cls} active` : cls ;
  } else {
    clsName = selected.indexOf(id) !== -1 ? `${cls} active` : cls ;
  }

  return (
      <button name = {name} id = {id} className = {clsName} onClick = {(e) => action(e)}>{symbol}</button>
  )
}


const mapStoreToProps = (state) => {
  return {
    selected: state.formToolBar.selected ,
    active : state.formToolBar.selectEditActive ,
  }
}

export default connect(mapStoreToProps)(FormTabButton) ;
