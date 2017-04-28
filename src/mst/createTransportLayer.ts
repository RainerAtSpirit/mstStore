import {merge} from 'lodash'
import {Promise} from 'es6-promise'

export interface ITransportLayer {
	appId: string
}

export class MockupTransportLayer implements ITransportLayer {
	appId

	constructor(appId: string) {
		this.appId = appId
	}

	read(url: string, options = {}): Promise<any> {
		return Promise.resolve({ value: [
			{Id: '2e90191e-dfa6-453b-908c-c665ea3f239f', Title: 'some title', 'GridConfigJSON': 'hello', AddProp1: '123', AddProp2: false},
			{Id: 'b918839d-4192-4724-97d5-73c76a42b198', Title: 'other title', 'GridConfigJSON': 'world', AddProp1: '123', AddProp2: false}
		]})
	}
}

export function createTransportLayer(appId: string) {
	return new MockupTransportLayer(appId)
}
