import {test} from 'ava'
import {reaction, toJS} from 'mobx'
import {getSnapshot, onSnapshot, protect} from 'mobx-state-tree'
import {createEndPointStore} from '../src/mst/createEndPointStore'
import {createAppStore} from '../src'

const appStore = createAppStore('123')
const result = [
	{
		Id: "2e90191e-dfa6-453b-908c-c665ea3f239f",
		Title: "some title",
	},
	{
		Id: "b918839d-4192-4724-97d5-73c76a42b198",
		Title: "other title",
	},
]

test('it should be a appStore  ', (t) => {
	t.is(appStore.appId, '123')
	t.is(typeof appStore.lists, 'object')
})

test('it should update lists.data on lists.read() ', (t) => {
		return appStore.lists.read().then(data => {
			const s: any = getSnapshot(data)
			t.deepEqual(s, result)
		}, err => {
			console.log('err', err)
			t.is(err.message, "[mobx-state-tree] Cannot modify \'AnonymousModel@/lists\', the object is protected and can only be modified by using an action."​​)
		})
})
