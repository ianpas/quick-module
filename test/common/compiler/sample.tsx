// @ts-ignore
import styles from "./main.css";

// @ts-ignore
import TodoItem from "../todo-item/todo-item";

export interface IMain extends QuickApp.IComponent
{
    handleInput(e: QuickApp.ClickEvent): void;
}

class Main implements IMain
{
    private = {
        cityClassName: "popular"
    }
    template()
    {
        /**
         * 注意TodoItem, prop中字符串插值的写法
         * @todo 改进字符串插值
         */
        return (
            <div class="main-page">
                <div class="if-show">
                    <div class={`city ${this.private.cityClassName}`} if={this.private.showCityList === true} show={this.private.showCityList === true}>
                    </div>
                    <div elif={this.private.showCityList === true}>
                    </div>
                    <div else>
                    </div>
                </div>
                <div class="input">
                    <input class="input-text" type="checkbox" onclick={this.handleInput}></input>
                    <TodoItem prop={`${"test"}`}></TodoItem>
                </div>
            </div>
        );
    }

    handleInput(e: QuickApp.ClickEvent)
    {
        const foo = this.props.foo.foo;
        const bar = this.data.bar;
        console.log(this);
    }
}

export default Main;