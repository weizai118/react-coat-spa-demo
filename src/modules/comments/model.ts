import ResourceHandlers from "common/ResourceHandlers";
import {CommentResource, ItemCreateData, State} from "entity/comment";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";
import {defRouteData} from "./facade";

// 定义本导出本模块的 ModuleState
export {State} from "entity/comment";

const initState: State = {};

class ModuleHandlers extends ResourceHandlers<State, CommentResource> {
  constructor(init: State) {
    super(init, {api});
  }
  @effect()
  public async createItem(data: ItemCreateData) {
    const response = await super.createItem(data);
    if (!response.error) {
      // 如果创建成功，要让用户看到自已发表的评论，必须刷新列表，以创建时间排序
      const search = {...defRouteData.searchData.search, isNewest: true};
      this.searchList(search);
    }
    return response;
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.comments, ModuleHandlers, initState);
