## managed-object-proxy
[![Build Status](https://dev.azure.com/misaka-org/managed-object-proxy/_apis/build/status/Misaka-0x447f.managed-object-proxy?branchName=master)](https://dev.azure.com/misaka-org/managed-object-proxy/_build/latest?definitionId=4&branchName=master)
### What is it?
A managed object proxy that allows you listen to all changes in the object, including child object.

### Quick start
```typescript
import Watchable from "managed-object-proxy";

const proxy = new Watchable();
const obj = proxy.init({});

const listener = (v, where) => {
  if (typeof v === "object") {
    console.log(`> ${JSON.stringify(v)} @ ${where}`);
  } else {
    console.log(`> ${v} @ ${where}`);
  }
});

proxy.registerTrigger(listener);

// starting from here feel free to make any changes to the object.

proxy.unregisterTrigger(listener);
```

### Documents

We currently not offering documents. To understand APIs please read the source code, it's not a large file.
