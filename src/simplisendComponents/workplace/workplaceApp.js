import React from "react";

const WorkplaceApp = ({ item }) => {
  //if (!item.is_private) {
    return (
      <div className="form-app-container">
        <div className="app-title" />

        <div className="app-body">
          <div className="app-logo" />
          <div className="app-info" />
        </div>

        <div className="app-footer" />
      </div>
    );
 // }

  //return null;
};

export default WorkplaceApp;
