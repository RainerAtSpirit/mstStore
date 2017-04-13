# Spike: mobx-state-tree
## Disclaimer: This is not production ready.

**Important!** Install dependencies with `yarn` to get the same package versions.
* Install yarn from https://yarnpkg.com/en/docs/install
* Run `yarn` in root directory of the repo
* Run yarn run dev
* within console
```
var myAppStore = cData.createAppStore('1ee139e0-4fbe-4fc4-9d0a-2beeb6508de1')
myAppStore.listsStore.read()
myAppStore.listsStore.data.slice(0)
```

### TS4023 errors when tryinig to compile without
```javascript
import {IMSTNode} from 'mobx-state-tree/lib/core/mst-node'
import {IModelType} from 'mobx-state-tree/lib/types/complex-types/object'
import {ISnapshottable} from 'mobx-state-tree/lib/types/type'
```


`src/mst/createAppStore.ts(13,14): error TS4023: Exported variable 'Store' has or is using name 'IMSTNode' from external module "C:/github/mstStore/node_modules/mobx-state-tree/lib/core/mst-node" but cannot be named.
src/mst/createAppStore.ts(13,14): error TS4023: Exported variable 'Store' has or is using name 'IModelType' from external module "C:/github/mstStore/node_modules/mobx-state-tree/lib/types/complex-types/object" but cannot be named.
src/mst/createAppStore.ts(13,14): error TS4023: Exported variable 'Store' has or is using name 'ISnapshottable' from external module "C:/github/mstStore/node_modules/mobx-state-tree/lib/types/type" but cannot be named.`