import {types, getParent, getSnapshot} from 'mobx-state-tree'
import {IModelType} from 'mobx-state-tree/lib/types/complex-types/object'
import {IObservableArray, toJS} from 'mobx'
import {IMSTNode} from 'mobx-state-tree/lib/core/mst-node'
import {ISnapshottable, IType} from 'mobx-state-tree/lib/types/type'

export const FilterExpression = types.model('FilterExpression', {
  field: types.string,
  operator: types.union(
    types.literal('eq'),
    types.literal('ne'),
    types.literal('startswith')
    // todo: implement other
  ),
  value: types.frozen
})

export type IFilterExpression = typeof FilterExpression.Type

export type FilterGroupInstance = {
  logic: string,
  filters: (FilterGroupInstance | IFilterExpression)[]
}
export type FilterGroupModel = IModelType<FilterGroupInstance, FilterGroupInstance>

const late = types.late<any, FilterGroupInstance>(() => FilterGroup)

export const FilterOrGroup = types.union(snapshot => snapshot && 'logic' in snapshot
    ? late
    : FilterExpression,
  FilterExpression, late)

// TypeScript is'nt smart enough to infer self referencing types -> We are smarter ;)
export const FilterGroup: FilterGroupModel = types.model({
  logic: types.optional(types.union(types.literal('and'), types.literal('or')), 'and'),
  filters: types.optional(types.array(FilterOrGroup), [])
})

export type IFilterGroup = typeof FilterGroup.Type

export const SortExpression = types.model('SortExpression', {
  dir: types.union(types.literal('asc'), types.literal('desc')),
  field: types.string
})

type ISortExpression = typeof SortExpression.Type

export const ODataStore = types.model('Odata',
  {
    $expand: types.optional(types.array(types.string), []),
    $filter: types.optional(FilterGroup, {}),
    $orderby: types.optional(types.array(SortExpression), []),
    $select: types.optional(types.array(types.string), []),
    $top: types.optional(types.number, 30),
    get collection() {
      return getParent(this)
    }
  }, {
    expand (options?: string[]) {
      if (options === null) {
        return getSnapshot(this.$top)
      }
      this.$expand = options
      return this
    },
    filter (options?: IFilterGroup) {
      if (!options) {
        return getSnapshot(this.$filter)
      }
      this.$filter = options
      return this
    },
    orderby (options?: ISortExpression[]) {
      if (!options) {
        return getSnapshot(this.$orderby)
      }
      this.$orderby = options
      return this
    },
    top (options?: number) {
      if (options === null) {
        return getSnapshot(this.$top)
      }
      this.$top = options
      return this
    }
  })
