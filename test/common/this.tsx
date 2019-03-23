class Main
{
    props = { foo: { foo: 1 }, bar: "hi" };

    handleInput(e)
    {
        const foo = this.props.foo.foo;
    }

}

export default Main;