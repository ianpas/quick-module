class Main {
  handleInput(e) {
    const foo = this.foo.foo;
    const bar = this.bar;
    console.log(this);
  }

}

const __INSTANCE__ = new Main();

const props = Object.getOwnPropertyNames(Main.prototype);
props.forEach(prop => {
  if (prop !== "constructor") {
    __INSTANCE__[prop] = __INSTANCE__.__proto__[prop];
  }
});

export default __INSTANCE__;