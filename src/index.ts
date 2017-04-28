import { useStrict, action } from 'mobx'
import {createAppStore} from './mst'
import {ListModel} from './mst/models'
// using mobx strict mode
// useStrict(true)

// Initial API just exporting stores
export * from './mst'
export * from './core/Modal/Odata'
