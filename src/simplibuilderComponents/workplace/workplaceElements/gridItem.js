import React , { Component } from 'react' ;
import { connect } from 'react-redux' ;


class GridItem extends Component {

  state = { isActivated  : false,tempValue :'' }
  handleChange = e => this.setState({tempValue : e.target.value}) ;
  activate = e => this.setState({isActivated : true }) ;

  select = () => {
    const { item,index } = this.props ;
    this.props.selectCell(item,index) ;
  }

  handleKeyPress = e => {
    if (e.key === 'Enter' && this.state.isActivated) {
      const { index } = this.props ;
      e.preventDefault() ;
      this.props.updateCell(index,this.state.tempValue) ;
      this.setState({isActivated : false,tempValue : ''}) ;
    }
  }

  componentDidMount = () => this.setState({tempValue : this.props.item.value })

  render = () => {
    const { item,active } = this.props ;
    const { isActivated,tempValue } = this.state ;
    const action = active === 'btn-Select-element-bar' ?  this.select : this.activate

    return (
      <div
        className = 'fb-grid-item'
        style = {{
          background : item.isSelected ? '#444' : '#F5F5F5',
          color : item.isSelected ? '#fff' : "black",
          gridColumn : `${item.col} / span ${item.colSpan}` ,
          gridRow : `${item.row} / span ${item.rowSpan}`
        }}
        onClick = {action}
      >
        {
            isActivated &&
            <input
              type = 'text'
              value = {tempValue}
              onChange = { this.handleChange }
              onKeyPress = {this.handleKeyPress}
              className = 'fb-grid-item-input'
              autoFocus = { true }
            />
        }

        {
          !isActivated &&
          <p>{item.value}</p>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    active : state.formToolBar.selectEditActive ,
  }
}
export default connect(mapStateToProps)(GridItem) ;
