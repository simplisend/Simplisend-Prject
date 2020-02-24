import React , { Component,Fragment } from 'react' ;
import FilterItem from './filterItem' ;
import { connect } from 'react-redux' ;
import { getRequest } from '../../../../../funcs/http' ;
import { updateData  } from '../../../../../store/actions/rootActions' ;

class SubFiltersBlock extends Component {


  componentDidMount = () => {
    const { subFilters,parent } = this.props ;
    if (!subFilters[parent] || !subFilters[parent].length) {

      getRequest(`tree/sub-filters?parent=${parent}`).then(resp => {
        this.props.updateData('SET_SUB-FILTERS',{key : parent, subFilters : resp.data })
      })
    }

  }


  render = () => {
    const { subFilters ,parent} = this.props ;
    return (
      <Fragment>
        {
          subFilters[parent] &&
          subFilters[parent].map(subFilterItem => (
            <FilterItem item = {subFilterItem} key = {subFilterItem.slug} />
          ))
        }
      </Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateData : (type,data) => dispatch(updateData(type,data)),
  }
}

const mapStateToProps = state => {
  return {
    subFilters : state.saCatsReducer.subFilters,
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SubFiltersBlock) ;
