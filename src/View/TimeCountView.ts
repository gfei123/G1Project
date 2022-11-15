import BaseView from "./BaseView";

export default class TimeCountView extends BaseView {
    
    timeLbl: Laya.Label;

    doBtn: Laya.Button;
    clearBtn: Laya.Button;
    isStart: boolean;

    millisecond: number = 0;


    onAwake() {
        super.onAwake();
        this.isStart = false;

      
        this.doBtn.on(Laya.Event.CLICK, this, this.onDoBtn);
        this.clearBtn.on(Laya.Event.CLICK, this, this.onClearBtn);
    }

    onDoBtn() {
        this.isStart = !this.isStart;
        if (this.isStart) {
            Laya.timer.frameLoop(1, this, this.onStartTimer);
        }
        else {
            Laya.timer.clear(this, this.onStartTimer);
        }
        this.doBtn.text.text = this.isStart ? "暂停" : "开始";
    }

    onStartTimer() {
        this.millisecond += Laya.timer.delta;
        this.timeLbl.text = (this.millisecond / 1000).toFixed(2);
    }

    onClearBtn() {
        Laya.timer.clear(this, this.onStartTimer);
        this.isStart = false;
        this.millisecond = 0;
        this.timeLbl.text = "0";
        this.doBtn.text.text = "开始";
    }

}