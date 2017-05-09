import { test } from 'ava'
import { createAppStore } from '../src'

const appStore = createAppStore('123')

test('it should be a appStore  ', (t) => {
	t.is(appStore.appId, '123')
	t.is(typeof appStore.lists, 'object')
})

test('it should update lists.data on lists.read() ', async t => {
	const error = await t.throws(appStore.lists.read());
	t.is(error.message, '[mobx-state-tree] Cannot modify \'Lists@/lists\', the object is protected and can only be modified by using an action.' )
})
