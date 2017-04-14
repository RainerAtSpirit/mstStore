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
			{Id: 'some guid', Title: 'some title', 'GridConfigJSON': 'hello', AddProp1: '123', AddProp2: false}
		]})
	}
}

export function createTransportLayer(appId: string) {
	return new MockupTransportLayer(appId)
}
