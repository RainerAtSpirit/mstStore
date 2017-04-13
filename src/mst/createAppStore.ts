import {createTransportLayer, MockupTransportLayer, ITransportLayer} from './createTransportLayer'
import {types, getEnv, onSnapshot, onPatch} from 'mobx-state-tree'
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

export const AppStore = types.model({
	appId: types.string,
	lists: Store,
	views: Store
})

export function createAppStore(appId: string) {
	const  transportLayer = createTransportLayer(appId)


	const appStore = AppStore.create({
		appId: appId,
		lists: Store.create({endpoint: '/odata/Lists', data: []}),
		views: Store.create({endpoint: '/odata/GridConfigs', data: []})
	}, {tl: transportLayer})

	onSnapshot(appStore, (data) => {
		console.log('onSnapShot', data)
	})

	onPatch(appStore, (data) => {
		console.log('onPatch', data)
	})

	return appStore
}

