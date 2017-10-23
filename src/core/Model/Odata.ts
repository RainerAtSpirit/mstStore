import { types, getParent, getSnapshot } from 'mobx-state-tree'
import { IModelType } from 'mobx-state-tree/dist/types/complex-types/object'
import { IObservableArray } from 'mobx'
import { ISnapshottable, IType, ISimpleType } from 'mobx-state-tree'

export const Operator = types.enumeration('Operations', [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'ne',
  'contains',
  'doesnotcontain',
  'endswith',
  'startswith',
  'isnull',
  'isnotnull',
  'isempty',
  'isnotempty'
])

export type IOperator = typeof Operator.Type

export const Logic = types.enumeration('Logic', ['and', 'or'])
export type ILogic = typeof Logic.Type

export const FilterExpression = types.model('FilterExpression', {
  field: types.optional(
    types.string,
    ''),
  operator: types.optional(
    Operator,
    'eq'),
  value: types.optional(
    types.frozen,
    types.null)
})

export type FilterExpressionType = typeof FilterExpression.Type

export type FilterGroupInstance = {
  logic: ILogic,
  filters: IObservableArray<({} | FilterGroupInstance | FilterExpressionType)>
}

export type FilterGroupModel = IModelType<FilterGroupInstance, FilterGroupInstance>

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
  logic: types.optional(
    Logic,
    'and'),
  filters: types.optional(
    types.array(FilterOrGroup),
    [])
})

export type IFilterGroup = typeof FilterGroup.Type

export const SortExpression = types.model('SortExpression', {
  dir: types.optional(
    types.enumeration('SortDir', [
      'asc',
      'desc']),
    'asc'),
  field: types.optional(
    types.string,
    '')
})

type ISortExpression = typeof SortExpression.Type

export const odataDefaults = {
  $expand: [],
  $filter: {},
  $orderby: [],
  $select: [],
  $top: 30
}

export const ODataStore = types.model('Odata',
  {
    $expand: types.optional(
      types.array(types.string),
      []
    ),
    $filter: types.optional(
      FilterGroup,
      {}
    ),
    $orderby: types.optional(
      types.array(SortExpression),
      []
    ),
    $select: types.optional(
      types.array(types.string),
      []
    ),
    $top: types.optional(
      types.number, 30
    )
  })
  .views(self => ({
    get collection () {
      return getParent(self)
    }
  }))
  .actions(self => ({
    expand (options?: IObservableArray<string>) {
      if (!options) {
        return getSnapshot(self.$expand)
      }
      self.$expand = options
      return self
    },
    filter (options?: IFilterGroup) {
      if (!options) {
        return getSnapshot(self.$filter)
      }
      self.$filter = options
      return self
    },
    orderby (options?: IObservableArray<ISortExpression>) {
      if (!options) {
        return getSnapshot(self.$orderby)
      }
      self.$orderby = options
      return self
    },
    top (options?: number) {
      if (!options) {
        return getSnapshot(self.$top)
      }
      self.$top = options
      return self
    }
  }))

export type IOdataStore = typeof ODataStore.Type
