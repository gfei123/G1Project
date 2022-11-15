/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui {
    export class AtlasAniViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public ani:Laya.Animation;
		public doBtn:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("AtlasAniView");
        }
    }
    REG("ui.AtlasAniViewUI",AtlasAniViewUI);
    export class BackpackViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public dlgBg:Laya.Image;
		public titleLbl:Laya.Label;
		public scrollList:Laya.List;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("BackpackView");
        }
    }
    REG("ui.BackpackViewUI",BackpackViewUI);
    export class ComboBoxViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public comboBox:Laya.ComboBox;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("ComboBoxView");
        }
    }
    REG("ui.ComboBoxViewUI",ComboBoxViewUI);
    export class DlgShowViewUI extends Scene {
		public panel:Laya.Panel;
		public center:Laya.Box;
		public dlgBg:Laya.Image;
		public backBtn:Laya.Button;
		public titleLbl:Laya.Label;
		public contentLbl:Laya.Label;
		public okBtn:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("DlgShowView");
        }
    }
    REG("ui.DlgShowViewUI",DlgShowViewUI);
    export class FrameInfoViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public checkBox:Laya.CheckBox;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("FrameInfoView");
        }
    }
    REG("ui.FrameInfoViewUI",FrameInfoViewUI);
    export class HorselampViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public doBtn:Laya.Button;
		public textInput:Laya.TextInput;
		public horselampPanel:Laya.Panel;
		public horselamepLbl:Laya.Label;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("HorselampView");
        }
    }
    REG("ui.HorselampViewUI",HorselampViewUI);
    export class HttpRequestViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public getBtn:Laya.Button;
		public postBtn:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("HttpRequestView");
        }
    }
    REG("ui.HttpRequestViewUI",HttpRequestViewUI);
    export class Joystick3DCtrlViewUI extends Scene {
		public bgBox:Laya.Box;
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public ctrlBack:Laya.Sprite;
		public ctrlRocker:Laya.Sprite;
		public ctrlRockerMove:Laya.Sprite;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("Joystick3DCtrlView");
        }
    }
    REG("ui.Joystick3DCtrlViewUI",Joystick3DCtrlViewUI);
    export class MainViewUI extends Scene {
		public scrollList:Laya.List;
		public itemBox:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("MainView");
        }
    }
    REG("ui.MainViewUI",MainViewUI);
    export class ParticleViewUI extends Scene {
		public bgBox:Laya.Box;
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("ParticleView");
        }
    }
    REG("ui.ParticleViewUI",ParticleViewUI);
    export class PrefabAniViewUI extends Scene {
		public bgBox:Laya.Box;
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("PrefabAniView");
        }
    }
    REG("ui.PrefabAniViewUI",PrefabAniViewUI);
    export class RadioViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public radiogroup:Laya.RadioGroup;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("RadioView");
        }
    }
    REG("ui.RadioViewUI",RadioViewUI);
    export class RayCastToMoveViewUI extends Scene {
		public bgBox:Laya.Box;
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("RayCastToMoveView");
        }
    }
    REG("ui.RayCastToMoveViewUI",RayCastToMoveViewUI);
    export class Scene3DViewUI extends Scene {
		public bgBox:Laya.Box;
		public progressBar:Laya.ProgressBar;
		public progressLbl:Laya.Label;
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public doBtn:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("Scene3DView");
        }
    }
    REG("ui.Scene3DViewUI",Scene3DViewUI);
    export class SocketTestViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("SocketTestView");
        }
    }
    REG("ui.SocketTestViewUI",SocketTestViewUI);
    export class SoundPlayViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public soundBtn:Laya.Button;
		public musicBtn:Laya.Button;
		public musicVol:Laya.HSlider;
		public soundVol:Laya.HSlider;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("SoundPlayView");
        }
    }
    REG("ui.SoundPlayViewUI",SoundPlayViewUI);
    export class TabPageViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public page1:Laya.Box;
		public page2:Laya.Box;
		public tab:Laya.Tab;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("TabPageView");
        }
    }
    REG("ui.TabPageViewUI",TabPageViewUI);
    export class TextTipsViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public doBtn:Laya.Button;
		public textInput:Laya.TextInput;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("TextTipsView");
        }
    }
    REG("ui.TextTipsViewUI",TextTipsViewUI);
    export class TimeCountViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public doBtn:Laya.Button;
		public timeLbl:Laya.Label;
		public clearBtn:Laya.Button;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("TimeCountView");
        }
    }
    REG("ui.TimeCountViewUI",TimeCountViewUI);
    export class WebHeadViewUI extends Scene {
		public panel:Laya.Panel;
		public backBtn:Laya.Button;
		public center:Laya.Box;
		public circleHeadImage:Laya.Image;
		public headImage:Laya.Image;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("WebHeadView");
        }
    }
    REG("ui.WebHeadViewUI",WebHeadViewUI);
}