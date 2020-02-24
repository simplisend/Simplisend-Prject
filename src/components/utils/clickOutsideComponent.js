import React , { Component } from 'react' ;

/* component that responsd when clicking outside it */
class ClickOutsideComponent extends Component {


  componentWillMount = () => {
      document.addEventListener('mousedown',this.handleClickOutside,false )
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown',this.handleClickOutside,false)
  }

  handleClickOutside = e => {
    const { handleClick,condition } = this.props;
    if (this.node && this.node.contains(e.target)) {
      return
    }

    if (condition) {
      handleClick(e)
    }
  }


  render = () => {

    return (
      <div ref = {node => this.node = node } >
        {this.props.children}
      </div>
    )
  }


}

export default ClickOutsideComponent ;
