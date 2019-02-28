import { isNull, forEach, isArray } from "lodash";

export type triggersCallback = (value?: any, index?: string) => void;

export default class Watchable {
  protected location: string | null = null;
  private triggers: triggersCallback[] = [];

  public init<T extends object>(obj: T) {
    const element = isArray(obj) ? [] : {};
    const p = new Proxy(element, {
      get: (target: object, property: symbol) => {
        return Reflect.get(target, property);
      },
      set: (target: object, property: symbol, input: any) => {
        // ok we are located at "parent"
        if (typeof input === "object") {
          const agent = new Watchable();
          agent.location = symbolToString(property);  // children's location
          // not directly set for non-flatten object...
          const ele = isArray(input) ? [] : {};
          const val = agent.init(ele);
          forEach(input, (v: any, i: string) => {
            Reflect.set(val, i, v);
          });
          Reflect.set(target, property, val);
          // "children"'s listener.
          agent.registerTrigger((payload, where) => {
            // received (value, "children"), goto parent
            this.trigger(payload, where, agent.location);
          });
        } else {
          Reflect.set(target, property, input);
        }
        for (const i of this.triggers) {
          // call root. at children: i(value, "children")
          i(input, symbolToString(property));
        }
        return true;
      },
      deleteProperty: (target: object, property: symbol) => {
        for (const i of this.triggers) {
          i(undefined, symbolToString(property));
        }
        if (property in target) {
          Reflect.deleteProperty(target, property);
        }
        return true;
      }
    }) as unknown as T;
    forEach(obj, (v: any, i: string) => {
      Reflect.set(p, i, v);
    });
    return p;
  }

  public registerTrigger(listener: triggersCallback) {
    this.triggers.push(listener);
  }

  public unregisterTrigger(listener: triggersCallback) {
    let flag = false;
    forEach(this.triggers, (v: triggersCallback, i: number) => {
      if (v === listener) {
        this.triggers.splice(i, 1);
        flag = true;
        return; // this equal to 'break';
      }
    });
    return flag;
  }

  public triggerAll() {
    for (const i of this.triggers) {
      i();
    }
  }

  private trigger(payload: any, where: string, iAm: string) {
    // for each parent's trigger lib
    for (const i of this.triggers) {
      if (iAm === null) {
        i(payload, where);
      } else {
        // {value, where am i}
        i(payload, iAm + "." + where);
      }
    }
  }
}

export const symbolToString = (v: symbol | string) => {
  if (typeof v === "string") {
    return v;
  }
  const a = v.toString().match(/(?<=Symbol\().*(?=\))/);
  if (isNull(a)) {
    throw new Error("Unexpected symbol element");
  } else {
    return a[0];
  }
};
