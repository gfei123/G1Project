import ViewMgr from "../ViewMgr";
import BaseView from "./BaseView";

export default class MainView extends BaseView {
    scrollList: Laya.List;
    bar: Laya.ScrollBar;

    listData = ["定时器", "帧率显示", "进度条", "艺术字", "下拉选框", "标签页", "声音播放", "弹框提示", "单选框",
        "提示语", "跑马灯", "过滤器", "图集动画", "3D场景", "预设动画", "粒子系统", "加载网络头像", "Http请求",
        "背包", "摇杆控制2D移动", "摇杆控制3D移动", "射线检测控制移动",
        "待开发...",


    ];



    onAwake() {
        super.onAwake();
        // 修改舞台颜色
        Laya.stage.bgColor = "#ffffff";
        // 滑动列表，注意Box需要设置renderType为render
        this.scrollList.repeatY = this.listData.length;
        // 设置滑动响应
        this.scrollList.renderHandler = Laya.Handler.create(this, this.onListRender, null, false);
        this.scrollList.array = this.listData;
        // 滚动但不显示滚动条
        this.scrollList.vScrollBarSkin = " ";

        this.onScreenResize();
    }

    onScreenResize() {
        super.onScreenResize();
        this.scrollList.height = Laya.stage.height - (this.scrollList.top ? this.scrollList.top : 0)
            - (this.scrollList.bottom ? this.scrollList.bottom : 0);
    }


    onListRender(cell: Laya.Button, index: number): void {
        if (index > this.scrollList.array.length) {
            return;
        }
        let itemData: string = this.scrollList.array[index];
        let lbl = cell.getChildByName("lbl") as Laya.Label;
        lbl.text = itemData;
        let btn = cell.getChildByName("bg") as Laya.Button;
        btn.offAll(Laya.Event.CLICK);
        btn.on(Laya.Event.CLICK, this, () => {
            this.onItemClick(itemData);
        });
    }

    onItemClick(name: string) {
        switch (name) {
            case "定时器":
                {
                    ViewMgr.ShowView("TimeCountView.scene", this);
                    break;
                }
            case "帧率显示":
                {
                    ViewMgr.ShowView("FrameInfoView.scene", this);
                    break;
                }
            case "进度条":
                {
                    ViewMgr.ShowView("ProgressBarView.scene", this);
                    break;
                }
            case "艺术字":
                {
                    ViewMgr.ShowView("FontNumView.scene", this);
                    break;
                }
            case "下拉选框":
                {
                    ViewMgr.ShowView("ComboBoxView.scene", this);
                    break;
                }
            case "标签页":
                {
                    ViewMgr.ShowView("TabPageView.scene", this);
                    break;
                }
            case "声音播放":
                {
                    ViewMgr.ShowView("SoundPlayView.scene", this);
                    break;
                }
            case "弹框提示":
                {
                    ViewMgr.ShowView("DlgShowView.scene", this);
                    break;
                }
            case "单选框":
                {
                    ViewMgr.ShowView("RadioView.scene", this);
                    break;
                }
            case "提示语":
                {
                    ViewMgr.ShowView("TextTipsView.scene", this);
                    break;
                }
            case "过滤器":
                {
                    ViewMgr.ShowView("ColorFilterView.scene", this);
                    break;
                }
            case "跑马灯":
                {
                    ViewMgr.ShowView("HorselampView.scene", this);
                    break;
                }
            case "图集动画":
                {
                    ViewMgr.ShowView("AtlasAniView.scene", this);
                    break;
                }
            case "3D场景":
                {
                    ViewMgr.ShowView("Scene3DView.scene", this);
                    break;
                }
            case "预设动画":
                {
                    ViewMgr.ShowView("PrefabAniView.scene", this);
                    break;
                }
            case "粒子系统":
                {
                    ViewMgr.ShowView("ParticleView.scene", this);
                    break;
                }
            case "加载网络头像":
                {
                    ViewMgr.ShowView("WebHeadView.scene", this);
                    break;
                }
            case "Http请求":
                {
                    ViewMgr.ShowView("HttpRequestView.scene", this);
                    break;
                }
            case "背包":
                {
                    ViewMgr.ShowView("BackpackView.scene", this);
                    break;
                }
            case "摇杆控制2D移动":
                {
                    ViewMgr.ShowView("JoystickView.scene", this);
                    break;
                }
            case "摇杆控制3D移动":
                {
                    ViewMgr.ShowView("Joystick3DCtrlView.scene", this);
                    break;
                }
            case "射线检测控制移动":
                {
                    ViewMgr.ShowView("RayCastToMoveView.scene", this);
                    break;
                }

        }
    }
}