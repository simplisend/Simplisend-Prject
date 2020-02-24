import React, { Fragment, Component } from "react";


/* div that wrappes buttons in the toolbar */

class ContentHolder extends Component {
  render = () => {
    const childsCount = React.Children.count(this.props.children);
    const data = childsCount > 1 ? this.props.children : [this.props.children];

    return (
      <div className="btn_group" id={this.props.id}>
        {this.props.title && (
          <span className="tool_group_title groupTitel">
            {this.props.title}
          </span>
        )}

        {data.map((item, i) => (
          <Fragment key={i}>{item}</Fragment>
        ))}
      </div>
    );
  };
}

export default ContentHolder;
