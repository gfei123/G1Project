import GameUtils from "../Util/GameUtils";
import BaseView from "./BaseView";

export default class BackpackView extends BaseView {
    scrollList: Laya.List;

    listData = ["勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
        "勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
        "勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
        "勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
        "勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
    ];

    onAwake() {
        super.onAwake();
        // 设置List的高度
        let row = Math.ceil(this.listData.length / 4);

        this.scrollList.repeatY = row;
        // 设置滑动响应
        this.scrollList.renderHandler = Laya.Handler.create(this, this.onListRender, null, false);
        this.scrollList.array = this.listData;

        // 滚动但不显示滚动条
        this.scrollList.vScrollBarSkin = " ";

    }


    onListRender(item: Laya.Box, index: number): void {
        let itemData: string = this.scrollList.array[index];
        let lbl = item.getChildByName("propName") as Laya.Label;
        lbl.text = itemData;
        let btn = item.getChildByName("btn") as Laya.Button;
        btn.offAll(Laya.Event.CLICK);
        btn.on(Laya.Event.CLICK, this, () => {
            GameUtils.FlyTextTips(itemData);
        });
    }



}


