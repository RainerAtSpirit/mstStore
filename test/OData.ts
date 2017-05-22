import { test } from 'ava'
import { getSnapshot, onSnapshot } from 'mobx-state-tree'
import { ODataStore } from '../src/core/Model/Odata'

const complexFilter = {
  logic: 'and',
  'filters': [
    {
      'logic': 'or',
      'filters': [
        {
          'field': 'Title',
          'operator': 'startswith',
          'value': 'A'
        },
        {
          'field': 'Title',
          'operator': 'startswith',
          'value': 'B'
        }
      ]
    },
    {
      'logic': 'or',
      'filters': [
        {
          'field': 'Priority',
          'operator': 'eq',
          'value': '(1) High'
        },
        {
          'field': 'Priority',
          'operator': 'eq',
          'value': '(2) Normal'
        }
      ]
    }
  ]
}
const simpleFilter = { logic: 'and', filters: [{field: 'test', operator: 'eq', value: 123}] }

// === FACTORY TESTS ===
test('it should produce default Odata options when called with an empty object', (t) => {
  const option = {}

  const instance = ODataStore.create(option)
  const snapshot = getSnapshot(instance)

  t.deepEqual(snapshot, {
    $expand: [],
    $filter: {
      filters: [],
      logic: 'and'
    },
    $orderby: [],
    $select: [],
    $top: 30
  })
})

// === FACTORY TESTS ===
test('it should take partial Odata options', (t) => {
  const option = {
    $expand: ['Test'],
    $select: ['Title', 'Id'],
    $top: 50
  }

  const instance = ODataStore.create(option)
  const snapshot = getSnapshot(instance)

  t.deepEqual(snapshot, {
    $expand: ['Test'],
    $filter: {
      filters: [],
      logic: 'and'
    },
    $orderby: [],
    $select: ['Title', 'Id'],
    $top: 50
  })
})

// === FACTORY TESTS ===
test('it should throw when trying to update observables directly', (t) => {

  const instance = ODataStore.create()

  let history: any[] = []
  onSnapshot(instance, data => history.push(data))

  let error = t.throws(() => {
    instance.$filter = simpleFilter
  })
  t.is(error.message, '[mobx-state-tree] Cannot modify \'Odata@<root>\', the object is protected and can only be modified by using an action.')

  error = t.throws(() => {
    instance.$expand.push('Fields')
  })
  t.is(error.message, '[mobx-state-tree] Cannot modify \'string[]@/$expand\', the object is protected and can only be modified by using an action.')

  t.is(history.length, 0)
})

test('it should only allow updates through actions', (t) => {

  const instance = ODataStore.create()
  let history: any[] = []

  onSnapshot(instance, data => history.push(data))

  instance.filter(simpleFilter)

  t.deepEqual(getSnapshot(instance).$filter, simpleFilter)

  instance.filter(complexFilter)

  t.deepEqual(instance.filter(), complexFilter)

  t.is(history.length, 2)

})

test('it should only allow updates through actions', (t) => {

  const instance = ODataStore.create()
  let history: any[] = []

  onSnapshot(instance, data => history.push(data))

  instance.filter(simpleFilter)

  t.deepEqual(getSnapshot(instance).$filter, simpleFilter)

  instance.filter(complexFilter)

  t.deepEqual(instance.filter(), complexFilter)

  t.is(history.length, 2)

})

test('it should runtime check filter expression', (t) => {

  const instance = ODataStore.create()
  let history: any[] = []

  onSnapshot(instance, data => history.push(data))

  let error = t.throws(() => {
    instance.filter({ logic: 'and', filters: [{field: 'test', operator: 'invalid', value: 123}] })
  })
  t.regex(error.message, /Error while converting/)

  error = t.throws(() => {
    instance.filter({ logic: 'invalid', filters: [{field: 'test', operator: 'eq', value: 123}] })
  })
  t.regex(error.message, /Error while converting/)

  t.is(history.length, 0)
})
