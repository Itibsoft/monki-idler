import {Button, Component, Label, _decorator} from "cc";
import {BehaviorSubject} from "../../../../utils/behaviour-subject.ts";

@_decorator.ccclass("Counter")
export class Counter extends Component {
    @_decorator.property(Label) public valueLabel: Label;
    @_decorator.property(Button) public plusButton: Button;
    @_decorator.property(Button) public minusButton: Button;

    private declare _value: BehaviorSubject<number>;

    private readonly _onChangeValue: (value: number) => void = this.setValueText.bind(this);

    public setup(value: BehaviorSubject<number>): void {
        this._value = value;

        this._value.on(this._onChangeValue);

        this.plusButton.node.on(Button.EventType.CLICK, () => {
            this._value.next(this._value.value + 1);
        })

        this.minusButton.node.on(Button.EventType.CLICK, () => {
            this._value.next(this._value.value - 1);
        })
    }

    protected onDestroy(): void {
        this._value.off(this._onChangeValue);
    }

    private setValueText(value: number): void {
        this.valueLabel.string = `${value}%`;
    }
}