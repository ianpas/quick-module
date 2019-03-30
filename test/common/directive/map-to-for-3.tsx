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
                <div class="city">
                    {
                        this.private.cities.map((city, index) => (
                            <block key={city.name}>
                                <text test={city}>城市：{city.name}</text>
                            </block>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Main;