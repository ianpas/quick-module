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

  template() {
    return <div class="main-page">
                <div class="city">
                    <block for="(index,city) in cities"><block>
                                <text test={"{{city}}"}>城市：{city.name}</text>
                            </block></block>
                </div>
            </div>;
  }

}

export default Main;