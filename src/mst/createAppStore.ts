import {createTransportLayer, MockupTransportLayer, ITransportLayer} from './createTransportLayer'
import {types, getEnv} from 'mobx-state-tree'
import {IObservableArray, action} from 'mobx'
import {IMSTNode} from 'mobx-state-tree/lib/core/mst-node'
import {IModelType} from 'mobx-state-tree/lib/types/complex-types/object'
import {ISnapshottable} from 'mobx-state-tree/lib/types/type'

const ListModel = types.model({
	Id: types.string,
	Title: types.string
})

export const Store = types.model({
	endpoint: types.string,
	data: types.array(ListModel),
	read() {
		const tl = getEnv(this).tl
		return tl.read(this.endpoint)
			.then(action(handleRead.bind(this)))

		function handleRead(data) {
			this.data = data.value
			return this
		}
	}
})

export type IStore = typeof Store.Type

export class AppStore {
	appId: string
	transportLayer: MockupTransportLayer
	listsStore: IStore
	viewsStore: IStore
	constructor(appId) {
		this.appId = appId
		this.transportLayer = createTransportLayer(appId, true)
		this.listsStore = Store.create({endpoint: '/odata/Lists', data: []}, {tl: this.transportLayer})
		this.viewsStore = Store.create({endpoint: '/odata/GridConfigs', data: []}, {tl: this.transportLayer})
	}
}

export function createAppStore(appId: string) {
	return new AppStore(appId)
}

