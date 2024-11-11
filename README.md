# Reactive store

## Store with watch change properties

### For usage

```
interface ReactiveStore {
  isReactive: boolean;
  storeName: string;
}


const store = store<ReactiveStore>({
  isReactive: true,
  storeName: 'this reactive store'
});
```

### Subscribe

```
this.store.on(["isReactive", "storeName"], (value) => {
  console.log(value)

});
```
