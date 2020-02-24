import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SimpliBuilder } from "../../simplibuilderComponents/screens";
import { Simplisend } from "../../simplisendComponents/screens";
import { Simpliadmin } from "../../simpliadminComponents/screens";
import { CheckAuth } from "../utils";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={Simplisend} exact />

      <Route
        path="/admin"
        component={props => (
          <CheckAuth {...props}>
            <Simpliadmin />
          </CheckAuth>
        )}
      />

      <Route
        path="/form-builder"
        component={props => (
          <CheckAuth {...props}>
            <SimpliBuilder />
          </CheckAuth>
        )}
      />

      <Route path="/simplisend/:slug" component={Simplisend} />
    </Switch>
  </BrowserRouter>
);

// <Route path = '/forms/:id' component = {FormDetails} />
export default Router;
