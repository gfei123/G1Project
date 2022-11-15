
import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class TextTipsView extends BaseView {

    doBtn: Laya.Button;
    textInput: Laya.TextInput;
    onAwake() {
        super.onAwake();

        this.doBtn.on(Laya.Event.CLICK, this, () => {
            GameUtils.FlyTextTips(this.textInput.text);
        });
    }
}