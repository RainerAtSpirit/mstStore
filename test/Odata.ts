import { test } from 'ava'
import { reaction, toJS } from 'mobx'
import { getSnapshot, onSnapshot, protect } from 'mobx-state-tree'
import { Odata } from '../src/core/Model'

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

// === FACTORY TESTS ===
test('it should produce default Odata options when called with an empty object', (t) => {
	const option = {}

	const instance = Odata.create(option)
	const snapshot = getSnapshot(instance)

	t.deepEqual(snapshot, {
		$expand: [],
		$filter: {},
		$orderby: [],
		$select: [],
		$top: 30
	})
})

// === FACTORY TESTS ===
test('it should produce take partial Odata options', (t) => {
	const option = {
		$expand: ['Test'],
		$select: ['Title', 'Id'],
		$top: 50
	}

	const instance = Odata.create(option)
	const snapshot = getSnapshot(instance)

	t.deepEqual(snapshot, {
		$expand: ['Test'],
		$filter: {},
		$orderby: [],
		$select: ['Title', 'Id'],
		$top: 50
	})
})


// === FACTORY TESTS ===
test('it should create snapshots on update', (t) => {

	const instance = Odata.create()

	let history: any[] = []
	onSnapshot(instance, data => history.push(data))

	instance.$filter = 123
	instance.filter({ a: { b: 'c' } })
	instance.$expand.push('SubNode')

	t.deepEqual(getSnapshot(instance).$filter, { a: { b: 'c' } })

	// t.deepEqual(instance.filter(), complexFilter)

	t.is(history.length, 3)

})

test('it should only allow updates through action if protected', (t) => {

	const instance = Odata.create()
	protect(instance)

	let history: any[] = []
	onSnapshot(instance, data => history.push(data))

	instance.filter({ a: { b: 'c' } })

	let error = t.throws(() => {
		instance.$expand.push('New Node')
	})

	t.is(error.message, '[mobx-state-tree] Cannot modify \'/$expand\', the object is protected and can only be modified from model actions'​​)

	error = t.throws(() => {
		instance.$filter = 'New Node'
	})

	t.is(error.message, '[mobx-state-tree] Cannot modify \'\', the object is protected and can only be modified from model actions'​​)


	t.deepEqual(getSnapshot(instance).$filter, { a: { b: 'c' } })

	// t.deepEqual(instance.filter(), complexFilter)

	t.is(history.length, 1)

})