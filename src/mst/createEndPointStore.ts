import {types, getEnv} from 'mobx-state-tree'
import {toJS} from 'mobx'
import {IModelType} from 'mobx-state-tree/dist/types/complex-types/object'
import {IObservableArray, action} from 'mobx'
import {ISnapshottable} from 'mobx-state-tree/dist/types/type'

export const createEndPointStore = (endpoint: string, Model) => {
  return types.model(Model.name + 's', {
    endpoint: endpoint,
    data: types.array(Model)
  }, {
    read() {
      const tl = getEnv(this).tl
      return tl.read(this.endpoint)
        .then((resp: any) => {
          return this.updateFromRespone(resp)
        })
    },
    updateFromRespone(resp) {
      const values = resp.hasOwnProperty('value') ? resp.value : resp
      this.data = values.map((item) => {
        return item
      })
      return toJS(this.data)
    }
  })
}
