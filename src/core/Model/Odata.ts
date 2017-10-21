import {types, getParent, getSnapshot} from 'mobx-state-tree'
import {IModelType} from 'mobx-state-tree/dist/types/complex-types/object'
import {IObservableArray} from 'mobx'
import {ISnapshottable, IType} from 'mobx-state-tree/dist/types/type'

const op1 = types.union(
  types.literal('eq'),
  types.literal('neq'),
  types.literal('gt'),
  types.literal('gte'),
  types.literal('lt'),
  types.literal('lte'),
  types.literal('in'),
  types.literal('ne'),
  types.literal('contains'),
  types.literal('doesnotcontain')
)
const op2 = types.union(
  types.literal('endswith'),
  types.literal('startswith'),
  types.literal('isnull'),
  types.literal('null'),
  types.literal('nnull'),
  types.literal('isnotnull'),
  types.literal('isempty'),
  types.literal('isnotempty')
)

const logicOp1 = types.literal<'and'>('and')
const logicOp2 = types.literal<'or'>('or')

export const FilterExpression = types.model('FilterExpression', {
  field: types.string,
  operator: types.union(op1, op2),
  value: types.frozen
})

export type FilterExpressionType = typeof FilterExpression.Type

export type FilterGroupInstance = {
  logic: 'and' | 'or',
  filters: IObservableArray<({} | FilterGroupInstance | FilterExpressionType)>
}

export type FilterGroupModel = IModelType<FilterGroupInstance, {}, FilterGroupInstance>

const LateFilterGroup = types.late<any, FilterGroupInstance>(() => FilterGroup)

export const FilterOrGroup = types.union(snapshot => snapshot && 'logic' in snapshot
    ? LateFilterGroup
    : FilterExpression,
  FilterExpression, LateFilterGroup)

// TypeScript is'nt smart enough to infer self referencing types -> We are smarter ;)
// export const FilterGroup: FilterGroupModel = types.model('FilterGroup', {
//   logic: types.optional(types.union(types.literal('and'), types.literal('or')), 'and'),
//   filters: types.optional(types.array(FilterOrGroup), [])
// })
export const FilterGroup = types.model<FilterGroupInstance>('FilterGroup', {
  logic: types.optional(types.union(logicOp1, logicOp2), 'and'),
  filters: types.optional(types.array(FilterOrGroup), [])
})

export type FilterGroupType = typeof FilterGroup.Type

export const SortExpression = types.model('SortExpression', {
  dir: types.union(types.literal('asc'), types.literal('desc')),
  field: types.string
})

type SortExpressionType = typeof SortExpression.Type

export const odataDefaults = {
  $expand: [],
  $filter: {},
  $orderby: [],
  $select: [],
  $top: 30
}

export const ODataStore = types.model('Odata',
  {
    $expand: types.optional(types.array(types.string), []),
    $filter: types.optional(FilterGroup, {}),
    $orderby: types.optional(types.array(SortExpression), []),
    $select: types.optional(types.array(types.string), []),
    $top: types.optional(types.number, 30),
    get collection () {
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
    filter (options?: FilterGroupType) {
      if (!options) {
        return getSnapshot(this.$filter)
      }
      this.$filter = options
      return this
    },
    orderby (options?: SortExpressionType[]) {
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

export type IOdataStore = typeof ODataStore.Type
