import BaseView from "./BaseView";

export default class DlgShowView extends BaseView {
    okBtn: Laya.Button;
    dlgBg: Laya.Image;

    onAwake() {
        super.onAwake();
        this.okBtn.on(Laya.Event.CLICK, this, () => {
            this.doTween();
        });


        this.doTween();

    }

    doTween() {
        // tween动画
        this.dlgBg.scale(0, 0);
        Laya.Tween.to(this.dlgBg, { scaleX: 1, scaleY: 1 }, 500, Laya.Ease.quartOut,
            Laya.Handler.create(this, () => {
                console.log("tween 动画完毕");
            }), 50);
    }
}