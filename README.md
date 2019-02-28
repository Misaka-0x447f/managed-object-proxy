## managed-object-proxy

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
})

proxy.registerTrigger(listener);

// starting from here feel free to make any changes to the object.
```
