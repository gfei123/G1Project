import BaseView from "./BaseView";

export default class TimeCountView extends BaseView {
    progressBar:Laya.ProgressBar;
    progressValue:number = 0;
    lbl:Laya.Label;
    onAwake()
    {
        super.onAwake();
        this.progressBar.value = 0;
        Laya.timer.frameLoop(5, this, ()=>{
            this.progressBar.value = this.progressValue/100;
            ++this.progressValue;
            if(this.progressValue > 100)
            {
                this.progressValue = 0;
            }
            this.lbl.text = this.progressValue + "%";
        });
    }
}
