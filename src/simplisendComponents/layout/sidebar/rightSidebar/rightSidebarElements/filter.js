import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import FilterItem from "./filterItem";
import SubFiltersBlock from "./subFiltersBlock";
import { updateData } from "../../../../../store/actions/rootActions";
import { getRequest } from "../../../../../funcs/http";

class Filter extends Component {
  state = { checked: [] };

  handleChange = e => {};

  componentDidMount = () => {
    const { filters, active } = this.props;
    const activ = active.split(";")[0];

    if ((filters[activ] && !filters[activ].length) | !filters[activ]) {
      getRequest(`tree/filters?parent_tag=${this.props.active}`).then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_FILTERS", {
            key: activ,
            filters: resp.data
          });
        }
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    /* if user chagend the active tag then get the new filters and sub-filters that belong to it */
    const { active } = this.props;
    const activ = active.split(";")[0];
    if (
      prevProps.active !== this.props.active &&
      (!this.props.filters[activ] || !this.props.filters[activ].length)
    ) {
      getRequest(`tree/filters?parent_tag=${activ}`).then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_FILTERS", {
            key: activ,
            filters: resp.data
          });
        }
      });
    }
  };

  render = () => {
    const { active, filters } = this.props;
    const activ = active.toString().split(";")[0];

    return (
      <div className="category-wrapper">
        {filters[activ] &&
          filters[activ].map(item => {
            return (
              <Fragment key={item.slug}>
                <FilterItem item={item} />
                <SubFiltersBlock parent={item.slug} />
              </Fragment>
            );
          })}
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

const mapStateToProps = state => {
  return {
    /* get filters/sub-filters that belong to current active tree item */
    active: state.ssheader.active,

    /* render filters */
    filters: state.saCatsReducer.filters
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Filter);
