import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class HorselampView extends BaseView {

    horselamepLbl: Laya.Label;
    horselampPanel: Laya.Panel;
    textInput: Laya.TextInput;
    doBtn: Laya.Button;



    private tips: Array<string> = [];
    private showing: boolean = false;

    private panelLeft: number;
    private panelRight: number;
    private panelTween: Laya.Tween;

    onAwake() {
        super.onAwake();
        this.panelLeft = this.panel.x;
        this.panelRight = this.panel.x + this.panel.width;
        this.horselamepLbl.text = "";
        this.horselampPanel.alpha = 0;
        this.doBtn.on(Laya.Event.CLICK, this, () => {
            this.tryShowHorselamp(this.textInput.text);
        });
    }

    tryShowHorselamp(msg: string) {
        if (null != msg) {
            this.tips.push(msg);
        }
        if (this.showing) {
            return
        }


        this.showing = true;
        let targetMsg = this.tips.shift();
        this.horselamepLbl.text = targetMsg;
        let width = GameUtils.MeasureText(targetMsg, this.horselamepLbl);
        this.horselamepLbl.x = this.panelRight;
        let targetPos = this.panelLeft - width;
        if (null != this.panelTween) {
            this.panelTween.pause();
            this.panelTween = null;
        }
        this.horselampPanel.alpha = 1;
        let duration =  (this.panelRight - targetPos)*10;
        Laya.Tween.to(this.horselamepLbl, { x: targetPos }, duration, Laya.Ease.linearNone,
            Laya.Handler.create(this, () => {
                this.showing = false;
                if (this.tips.length > 0)
                    this.tryShowHorselamp(null);
                else {
                    // 没有内容了，panel慢慢消失
                    this.panelTween = Laya.Tween.to(this.horselampPanel, { alpha: 0 }, 200,
                        Laya.Ease.linearNone);
                }
            }));
    }
}