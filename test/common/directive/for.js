class Main {
  constructor() {
    this.private = {
      cities: [{
        name: "",
        showSpots: false,
        spots: [{
          name: ""
        }]
      }],
      showCityList: true
    };
  }

}

const __INSTANCE__ = new Main();

export default __INSTANCE__;