import { types, getEnv } from 'mobx-state-tree'
import { toJS } from 'mobx'
import { IModelType } from 'mobx-state-tree/dist/types/complex-types/object'
import { IObservableArray, action } from 'mobx'
import { ISnapshottable } from 'mobx-state-tree/dist/types/type'

export const createEndPointStore = (endpoint: string, Model) => {
  return types.model(Model.name + 's', {
    endpoint: endpoint,
    data: types.array(Model)
  })
    .actions(self => {
      function updateFromRespone (resp) {
        const values = resp.hasOwnProperty('value') ? resp.value : resp
        self.data = values.map((item) => {
          return item
        })
        return toJS(self.data)
      }

      return {
        updateFromRespone
      }
    })
    .actions(self => {
      function read () {
        const tl = getEnv(self).tl
        return tl.read(self.endpoint)
          .then((resp: any) => {
            return self.updateFromRespone(resp)
          })
      }

      return {
        read
      }
    })
}
