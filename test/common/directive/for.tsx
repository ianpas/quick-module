class Main
{
    private = {
        cities: [{ name: "", showSpots: false, spots: [{ name: "" }] }],
        showCityList: true
    }
    template()
    {
        return (
            <div class="main-page">
                <div class="city" if={this.private.showCityList === true}>
                    {
                        this.private.cities.map(city => (
                            <block>
                                <text>城市：{city.name}</text>
                                <block if={city.showSpots}>
                                    {
                                        city.spots.map(spot =>
                                        (
                                  			<text if={spot}>景点：{spot.name}</text>
										))
                                    }
                                </block>
                            </block>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Main;