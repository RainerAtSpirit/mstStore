import {types, getEnv, protect, unprotect} from 'mobx-state-tree'
import {IObservableArray, toJS} from 'mobx'
import {IModelType} from 'mobx-state-tree/lib/types/complex-types/object'
import {IMSTNode} from 'mobx-state-tree/lib/core/mst-node'
import {ISnapshottable} from 'mobx-state-tree/lib/types/type'

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
