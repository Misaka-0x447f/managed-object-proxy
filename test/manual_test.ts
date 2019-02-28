import Watchable from "../src/main";
import {isUndefined, set, unset} from "lodash";

const echo = (v?: any) => {
  if (isUndefined(v)) {
    console.log(value);
  } else {
    if (typeof v === "object") {
      console.log(JSON.stringify(v));
    } else if (typeof v === "function") {
      console.log(v.toString());
    } else {
      console.log(v);
    }
  }
};

console.log("Object ==========================================");

const proxy = new Watchable();
const value = proxy.init({});

proxy.registerTrigger((v, where) => {
  if (typeof v === "object") {
    console.log(`> ${JSON.stringify(v)} @ ${where}`);
  } else {
    console.log(`> ${v} @ ${where}`);
  }
});

echo();
set(value, "parent", "1");
echo();
set(value, "parent", "2");
echo();
set(value, "parent.depth1.depth2.depth3", "1");
echo();
unset(value, "parent.depth1");
echo();

/*
expected output:
. {}
. > 1 @ parent
. {"parent":"1"}
. > 2 @ parent
. {"parent":"2"}
. > {} @ parent
. > {} @ parent.depth1
. > {} @ parent.depth1.depth2
. > 1 @ parent.depth1.depth2.depth3
. {"parent":{"depth1":{"depth2":{"depth3":"1"}}}}
. > undefined @ parent.depth1
. {"parent":{}}
*/

console.log("Array & Listeners ==========================================");

const proxy2 = new Watchable();
const value2 = proxy.init([]);

const lis = (v, where) => {
  if (typeof v === "object") {
    console.log(`> ${JSON.stringify(v)} @ ${where}`);
  } else {
    console.log(`> ${v} @ ${where}`);
  }
};

proxy2.registerTrigger(lis);
proxy2.registerTrigger(() => {
  console.log("whatever");
});
echo(value2);
value2.push("ele1", "ele2");
proxy2.unregisterTrigger(lis);
echo(value2);
value2.unshift("ele0");
echo(value2);

console.log("Nested Array ==========================================");

const proxy3 = new Watchable();
const value3 = proxy.init({});
const lis3 = (v, where) => {
  if (typeof v === "object") {
    console.log(`> ${JSON.stringify(v)} @ ${where}`);
  } else {
    console.log(`> ${v} @ ${where}`);
  }
};

proxy3.registerTrigger(lis3);
echo(value3);
set(value3, "test", [{
  element: "whatever"
}]);
echo(value3);
// @ts-ignore
value3.test[0].element = "sth else";
echo(value3);
