import Vue from 'vue';
import Vuex from 'vuex';
import namespaced, { TypedCommit, TypedDispatch } from '../src/vuex-namespaced';

Vue.use(Vuex);

declare module 'vuex' {
  interface Commit {
    test: {
      submodule: {
        another: TypedCommit<{
          setAs(state, payload): void;
        }>
      }
    }
  }

  interface Dispatch {
    test: {
      submodule: TypedDispatch<{
        commitSubmodule(): void;
      }>
    }
  }
}

describe("vuex-namespaced", () => {
  it("works", () => {
    const store = new Vuex.Store({
      modules: {
        test: {
          namespaced: true,
          state: {
            test: 'asd'
          },
          modules: {
            submodule: {
              namespaced: true,
              state: {},
              modules: {
                another: {
                  namespaced: true,
                  state: {
                    as: 'as'
                  },
                  mutations: {
                    setAs(state, payload) {
                      state.as = payload;
                    }
                  }
                },
                hidden: {
                  namespaced: false,
                  state: {
                    bu: 'bu'
                  }
                }
              },

              actions: {
                commitSubmodule(context, payload) {
                  context.commit('another/setAs', payload);
                }
              }
            }
          }
        }
      },
      plugins: [
        namespaced
      ]
    });

    store.state.test.submodule.another.as;

    ['commit', 'dispatch'].forEach(type => {
      expect(store[type]).toHaveProperty('test');
      expect(store[type].test).toHaveProperty('submodule');
      expect(store[type].test.submodule).toHaveProperty('another');
      expect(typeof store[type].test.submodule.another).toBe('function');
      expect(typeof store[type].test.submodule.hidden).toBe('undefined');
    });

    expect(store.state.test.submodule.another.as).toBe('as');

    store.commit.test.submodule.another('setAs', 'module');
    expect(store.state.test.submodule.another.as).toBe('module');

    store.dispatch.test.submodule({
      type: 'commitSubmodule',
      payload: 'module reset'
    });
    expect(store.state.test.submodule.another.as).toBe('module reset');
  });
});
