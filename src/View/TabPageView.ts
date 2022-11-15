import BaseView from "./BaseView";

export default class TabPageView extends BaseView {
    page1:Laya.Box;
    page2:Laya.Box;
    tab:Laya.Tab;

    onAwake()
    {
        super.onAwake();

        this.tab.labels="页面1,页面2";
        this.tab.selectedIndex = 0;
        this.tab.selectHandler = Laya.Handler.create(this, this.onTabSelect, null, false);
        this.onTabSelect();
    }

    onTabSelect()
    {
        this.page1.visible = 0 == this.tab.selectedIndex;
        this.page2.visible = 1 == this.tab.selectedIndex;
    }
}