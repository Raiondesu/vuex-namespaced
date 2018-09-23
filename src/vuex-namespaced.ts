import { Commit, MutationTree, ActionTree, CommitOptions, DispatchOptions } from 'vuex';
import { assignToPath } from './misc';

function type(store, modulePath: string, typeName: string) {
  return function () {
    if (typeof arguments[0] === 'object') {
      var type = arguments[0].type;
      var payload = arguments[0].payload;
      var options = arguments[1];
    } else {
      type = arguments[0];
      payload = arguments[1];
      options = arguments[2];
    }

    console.log(arguments)

    return store[typeName](modulePath + '/' + type, payload, options);
  }
}

type ModuleMap = {
  [name: string]: ModuleMap | {}
};

function getModules(rawModule) {
  return Object.keys(rawModule.modules || {}).reduce((obj, key) => {
    if (rawModule.modules[key].namespaced) {
      obj[key] = getModules(rawModule.modules[key]);
    }

    return obj;
  }, {} as ModuleMap);
}

export const namespaced = (store) => {
  const root = getModules(store._modules.root._rawModule);

  const namespace = (current, modulePath: string = '') => {
    const moduleNames = Object.keys(current);

    for (const _module of moduleNames) {
      const nextPath = modulePath ? modulePath + '/' + _module : _module;

      ['commit', 'dispatch'].forEach(f => assignToPath(store[f], nextPath, type(store, nextPath, f), '/'));

      namespace(current[_module], nextPath);
    }
  };

  return namespace(root);
};

export interface TypedCommit<M extends MutationTree<any>> extends Commit {
  (type: keyof M, payload?: any, options?: CommitOptions): void;
  <P extends TypedPayload<M>>(payloadWithType: P, options?: CommitOptions): void;
}

export interface TypedDispatch<M extends MutationTree<any>> extends Commit {
  (type: keyof M, payload?: any, options?: DispatchOptions): void;
  <P extends TypedPayload<M>>(payloadWithType: P, options?: DispatchOptions): void;
}

export type TypedPayload<T extends (MutationTree<any> | ActionTree<any, any>)> = {
  [type in keyof T]: any;
}

export default namespaced;
