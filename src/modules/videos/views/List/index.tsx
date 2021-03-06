import {Pagination} from "antd-mobile";
import {toPath, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import Search from "components/Search";
import {routerActions} from "connected-react-router";
import {ListItem, ListSearch, ListSummary} from "entity/video";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  pathname: string;
  listSearch: ListSearch | undefined;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}

let scrollTop = 0;

class Component extends React.PureComponent<Props> {
  private onPageChange = (page: number) => {
    const {dispatch, pathname, listSearch} = this.props;
    const url = toUrl(pathname, {videos: {search: {...listSearch, page}}});
    dispatch(routerActions.push(url));
  };
  private onItemClick = (itemId: string) => {
    // 记住当前滚动位置
    scrollTop = window.pageYOffset;
    const {dispatch} = this.props;
    const detailsPath = toPath(ModuleNames.comments, "Main", {type: "videos", typeId: itemId});
    const url = toUrl(detailsPath, {comments: {search: {articleId: itemId}}});
    dispatch(routerActions.push(url));
  };
  private onSearch = (title: string) => {
    const {dispatch, pathname} = this.props;
    const url = toUrl(pathname, {app: {showSearch: true}, videos: {search: {title, page: 1}}});
    dispatch(routerActions.push(url));
  };
  private onSearchClose = () => {
    const {dispatch, pathname} = this.props;
    const url = toUrl(pathname, {app: {showSearch: false}, videos: {search: {title: ""}}});
    dispatch(routerActions.push(url));
  };

  public render() {
    const {showSearch, listSearch, listItems, listSummary} = this.props;

    if (listItems && listSearch) {
      return (
        <div className={`${ModuleNames.videos}-List g-pic-list`}>
          <Search value={listSearch.title} onClose={this.onSearchClose} onSearch={this.onSearch} visible={showSearch || !!listSearch.title} />
          <div className="list-items">
            {listItems.map(item => (
              <div onClick={() => this.onItemClick(item.id)} key={item.id} className="g-pre-img">
                <div style={{backgroundImage: `url(${item.coverUrl})`}}>
                  <h5 className="title">{item.title}</h5>
                  <div className="listImg" />
                  <div className="props">
                    <Icon type={IconClass.HEART} /> {item.hot}
                  </div>
                  <Icon className="icon-palyer" type={IconClass.PLAY_CIRCLE} />
                </div>
              </div>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination current={listSummary.page} total={listSummary.totalPages} onChange={this.onPageChange} />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
  public componentDidMount() {
    this.scroll();
  }
  public componentDidUpdate() {
    this.scroll();
  }
  private scroll() {
    // 恢复记住的滚动位置
    window.scrollTo(0, scrollTop);
    scrollTop = 0;
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.videos!;
  return {
    showSearch: Boolean(state.app!.showSearch),
    pathname: state.router.location.pathname,
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
