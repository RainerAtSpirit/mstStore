import {types, getEnv} from 'mobx-state-tree'
import { IObservableArray, action } from 'mobx'
import { IModelType } from 'mobx-state-tree/lib/types/complex-types/object'

export const createEndPointStore = (endpoint: string, Model) => {
	return types.model({
		endpoint: endpoint,
		data: types.array(Model),
		read() {
			const tl = getEnv(this).tl
			return tl.read(this.endpoint)
					.then(action((data: any) => {
					const values = data.hasOwnProperty('value') ? data.value : data
					this.data = values.map((item) => {
							return Model.create(item)
						}
					)
				}).bind(this))
		}
	})
}
