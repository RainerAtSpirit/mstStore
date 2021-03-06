import { types, getEnv, onSnapshot, onPatch } from 'mobx-state-tree'
import { IObservableArray, action } from 'mobx'
import { IMSTNode } from 'mobx-state-tree/lib/core/mst-node'
import { ISnapshottable } from 'mobx-state-tree/lib/types/type'
import { createTransportLayer, MockupTransportLayer, ITransportLayer } from './createTransportLayer'
import { createEndPointStore } from './createEndPointStore'
import { ListModel, ViewModel } from './models'

export function createAppStore(appId: string) {
	const transportLayer = createTransportLayer(appId)
	const ListStore = createEndPointStore('odata/Lists', ListModel)
	const ViewsStore = createEndPointStore('odata/GridConfigs', ViewModel)

	const AppStore = types.model({
		appId: types.string,
		lists: ListStore,
		views: ViewsStore
	})
	const appStore = AppStore.create({
		appId: appId,
		lists: ListStore.create({ data: []}),
		views: ViewsStore.create({ data: []})
	}, { tl: transportLayer })

	onSnapshot(appStore, (data) => {
		console.log('onSnapShot', data)
	})

	onPatch(appStore, (data) => {
		console.log('onPatch', data)
	})

	return appStore
}
