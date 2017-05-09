import {types} from 'mobx-state-tree'
import { IModelType } from 'mobx-state-tree/lib/types/complex-types/object'

export const ListModel = types.model('List', {
	Id: types.identifier(),
	Title: types.string
})

export const ViewModel = types.model('View', {
	Id: types.identifier(),
	Title: types.string,
	GridConfigJSON: types.string
})
