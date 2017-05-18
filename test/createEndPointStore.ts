import {test} from 'ava'
import {createAppStore} from '../src'
import {getSnapshot} from 'mobx-state-tree';
const appStore = createAppStore('123')

test('it should be a appStore  ', (t) => {
	t.is(appStore.appId, '123')
	t.is(typeof appStore.lists, 'object')
})

test('it should update lists.data on lists.read() ', async t => {
	const expectedResult = [
		{
			Id: '2e90191e-dfa6-453b-908c-c665ea3f239f',
			Title: 'some title'
		},
		{
			Id: 'b918839d-4192-4724-97d5-73c76a42b198',
			Title: 'other title'
		}
	]
	const result = await appStore.lists.read();
	const s = getSnapshot(appStore.lists.data)
	t.deepEqual(s, expectedResult)
})
