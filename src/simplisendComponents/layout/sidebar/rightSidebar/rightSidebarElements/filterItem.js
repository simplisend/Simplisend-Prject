import React , { Component } from 'react' ;

class FilterItem extends Component {


  render = () => {
    const { item } = this.props ;
    const cls = item.type === 'filter' ? 'category' : 'sub-category' ;

    return (
      <div className={cls}>
        <input className="checkbox" type="checkbox" name="filter" />
        <span className="title">
          {item.title}
        </span>
      </div>
    )
  }
}



export default FilterItem
