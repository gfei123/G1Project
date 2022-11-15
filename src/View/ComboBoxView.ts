import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class ComboBoxView extends BaseView {
    comboBox:Laya.ComboBox;
    
    onAwake()
    {
        super.onAwake();
        
        this.comboBox.labels = "豆浆,油条,炒面,糯米鸡,皮蛋瘦肉粥,肠粉,八宝粥,牛奶,燕麦,小笼包,水晶包,叉烧包,烧卖,花卷,馒头,鸡蛋饼,面茶,云吞,炸糕";
        this.comboBox.selectedIndex = 0;
        this.comboBox.selectHandler = Laya.Handler.create(this, ()=>{
            GameUtils.FlyTextTips("选中了:" + this.comboBox.selectedIndex + ":" + this.comboBox.selectedLabel);
        }, null, false);
    }
}