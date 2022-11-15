import BaseView from "./BaseView";

export default class FrameInfoView extends BaseView {
    static showFrameInfo:boolean = false;
    checkBox:Laya.CheckBox;
    onAwake()
    {
        super.onAwake();
        this.checkBox.selected = FrameInfoView.showFrameInfo;
        
        this.checkBox.on(Laya.Event.CLICK, this,()=>{
            FrameInfoView.showFrameInfo = this.checkBox.selected;
            if(FrameInfoView.showFrameInfo)
            {
                Laya.Stat.show();
            }
            else
            {
                Laya.Stat.hide();
            }
        });
    }
}