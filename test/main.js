const describe = require("mocha");
const Watchable = require("../src/main.ts");
const isEqual = require("lodash").isEqual;
const set = require("lodash").set;

describe("Main", () => {
  describe("Object", () => {
    const proxy = new Watchable();
    const value = proxy.init({});
    proxy.registerTrigger((v, where) => {
      if (typeof v === "object") {
        buffer.push(`> ${JSON.stringify(v)} @ ${where}`);
      } else {
        buffer.push(`> ${v} @ ${where}`);
      }
    });
    const buffer = [];
    it("init", function (done) {
      if (isEqual(value, {})) {
        done();
      } else {
        done(false);
      }
    });
    it("adding child", function (done) {
      set(value, "parent", "1");
      if (
        isEqual(buffer, ["> 1 @ parent"])
        && isEqual(value, {"parent":"1"})
      ) {
        done();
      } else {
        done(false);
      }
    });
    it("changing child", function(done) {
      set(value, "parent", "1");
      if (
        isEqual(buffer, ["> 1 @ parent", "> 2 @ parent"])
        && isEqual(value, {"parent":"2"})
      ) {
        done();
      } else {
        done(false);
      }
    });
  });
});
