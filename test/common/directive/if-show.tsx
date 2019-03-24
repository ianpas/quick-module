class Main
{
    private = {
        showCityList: true
    }
    template()
    {
        return (
            <div class="main-page">
                <div class="city" if={this.private.showCityList === true} show={this.private.showCityList === true}>
                </div>
            </div>
        );
    }
}

export default Main;