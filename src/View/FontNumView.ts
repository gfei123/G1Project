import BaseView from "./BaseView";

export default class FontNumView extends BaseView {
    textInput:Laya.TextInput;
    fontClip:Laya.FontClip;
  
    onAwake()
    {
        super.onAwake();
        this.fontClip.value = this.textInput.text;

        this.textInput.on(Laya.Event.BLUR, this,()=>{
            this.fontClip.value = this.textInput.text;
        });

    }
}