
import BaseView from "./BaseView";

export default class RadioView extends BaseView {

    radiogroup:Laya.RadioGroup;


    onAwake()
    {
        super.onAwake();

        
        this.radiogroup.on(Laya.Event.CLICK, this, ()=>{
            console.log(this.radiogroup.selectedIndex);
        });


    }

}
