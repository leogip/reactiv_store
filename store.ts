type StoreSubscriber<T extends {}> = T & {
  on?(keys: string[], cb: any): void;
};

const setListenerFn =
  (listeners: any[], target: object, receiver: any) =>
  (keys: string[], cb: any) => {
    listeners.push({
      keys,
      listener: () =>
        cb(...keys.map((key) => Reflect.get(target, key, receiver))),
    });
  };

const emit = (listeners: any[], property: string | symbol) =>
  listeners
    .filter((record) => record !== undefined && record.keys.includes(property))
    .forEach((record) => record.listener());

function store<T extends {}>(object: StoreSubscriber<T>): StoreSubscriber<T> {
  const listeners: any[] = [];

  return new Proxy(object, {
    get: (target, property, receiver) => {
      return property === "on"
        ? setListenerFn(listeners, target, receiver)
        : Reflect.get(target, property, receiver);
    },
    set: (target, property, value, receiver) => {
      if (!Object.is(value, Reflect.get(target, property, receiver))) {
        Reflect.set(target, property, value, receiver);
        emit(listeners, property);
      }

      return true;
    },
    deleteProperty: (target, property) => {
      if (Reflect.has(target, property)) {
        Reflect.deleteProperty(target, property);
        emit(listeners, property);
      }

      return true;
    },
  });
}

export default store;
