import { types } from 'mobx-state-tree'
import { IModelType } from 'mobx-state-tree/lib/types/complex-types/object'
import { IObservableArray, toJS } from 'mobx'
import { IMSTNode } from 'mobx-state-tree/lib/core/mst-node'
import { ISnapshottable, IType } from 'mobx-state-tree/lib/types/type'


export const FilterExpression = types.model('FilterExpression', {
	field: types.string,
	operator: types.union(
		types.literal('eq'),
		types.literal('ne')
		// todo: implement other
	),
	value: types.frozen
})

export const FilterGroup = types.model('FilterGroup', {
	logic: types.union(
		types.literal('and'),
		types.literal('or')
	),
	filters: types.frozen
})

export const SortExpression = types.model('SortExpression', {
	dir: types.union(types.literal('asc'), types.literal('desc')),
	field: types.string
})

type ISortExpression = typeof SortExpression.Type

export const Odata = types.model('Odata', {
	$expand: types.withDefault(types.array(types.string), []),
	$filter: types.withDefault(types.frozen, {}),
	$orderby: types.withDefault(types.array(SortExpression), []),
	$select: types.withDefault(types.array(types.string), []),
	$top: types.withDefault(types.number, 30),
	// actions have to be moved into second argument once https://github.com/mobxjs/mobx-state-tree/pull/99 has been merged
	expand(options: string[] | null) {
		if (options === null) {
			return toJS(this.$top)
		}
		this.$expand = options
	},
	filter(filterObj?) {
		if (!filterObj) {
			return toJS(this.$filter)
		}
		this.$filter = filterObj
	},
	orderby(options: ISortExpression[] | null) {
		if (!options) {
			return toJS(this.$orderby)
		}
		this.$orderby = options
	},
	top(options: number | null) {
		if (options === null) {
			return toJS(this.$top)
		}
		this.$top = options
	}
})

