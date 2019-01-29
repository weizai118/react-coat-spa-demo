import ArticleHandlers from "common/ArticleHandlers";
import {State, VideoResource} from "entity/video";
import {ModuleNames} from "modules/names";
import {Actions, effect, exportModel} from "react-coat";
import api from "./api";

// 定义本导出本模块的 ModuleState
export {State} from "entity/video";

const initState: State = {};

class ModuleHandlers extends ArticleHandlers<State, VideoResource> {
  constructor(init: State) {
    super(init, {api});
  }
  @effect()
  protected async [ModuleNames.videos + "/INIT"]() {
    await super.onInit();
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.videos, ModuleHandlers, initState);
