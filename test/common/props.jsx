class Main {
  constructor() {
    this.props = {
      foo: {
        default: 1
      },
      bar: {
        default: "hi"
      }
    };
  }

  handleInput(e) {
    console.log(arguments);
  }

}

export default Main;