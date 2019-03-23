// @ts-ignore
import styles from "./main.css";

// @ts-ignore
import TodoItem from "../todo-item/todo-item.tsx";

export interface IMain extends QuickApp.IComponent
{
    handleInput(e: QuickApp.ClickEvent): void;
}

class Main implements IMain
{
    template()
    {
        return (
            <div class="main-page">
                <div class="input">
                    <input class="input-text" type="checkbox" onclick={this.handleInput}></input>
                    <TodoItem></TodoItem>
                </div>
            </div>
        );
    }

    handleInput(e: QuickApp.ClickEvent)
    {
        console.log(arguments);
    }
}

export default Main;