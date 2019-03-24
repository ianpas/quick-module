import styles from "./main.css";

import todo_item from "./todo-item/todo-item.tsx";

class Main {
  template() {
    return <div class="main-page">
                <div class="input">
                    <input class="input-text" type="checkbox" onclick={this.handleInput}></input>
                    <todo-item></todo-item>
                </div>
            </div>;
  }

  handleInput(e) {
    console.log(arguments);
  }

}

export default Main;