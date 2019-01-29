import {toPath} from "common/routers";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import Editor from "./Editor";
import {Details as DetailsView, List as ListView} from "./index";
import "./Main.less";

interface Props {
  pathname: string;
}

class Component extends React.PureComponent<Props> {
  public render() {
    return (
      <div className={`${ModuleNames.comments}`}>
        <div className="wrap">
          <Switch>
            <Route exact={true} path={toPath(ModuleNames.comments, "Details")} component={DetailsView} />
            <Route component={ListView} />
          </Switch>
        </div>
        <Editor />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pathname: state.router.location.pathname,
  };
};

export default connect(mapStateToProps)(Component);
