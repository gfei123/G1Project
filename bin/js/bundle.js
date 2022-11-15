(function () {
    'use strict';

    class BaseView extends Laya.Scene {
        onAwake() {
            this.height = 548;
            if (null != this.backBtn) {
                this.backBtn.on(Laya.Event.CLICK, this, () => {
                    this.destroy();
                });
            }
            Laya.stage.on(Laya.Event.RESIZE, this, this.onScreenResize);
            this.onScreenResize();
        }
        onScreenResize() {
            if (null != this.panel) {
                this.panel.height = Laya.stage.height - (this.panel.top ? this.panel.top : 0)
                    - (this.panel.bottom ? this.panel.bottom : 0);
            }
            if (null != this.center) {
                this.center.y = Laya.stage.height / 2;
            }
        }
    }

    class AtlasAniView extends BaseView {
        constructor() {
            super(...arguments);
            this.spawnAtlas = "res/atlas/PlayerSpawn.atlas";
            this.idleAtlas = "res/atlas/PlayerIdle.atlas";
            this.runAtlas = "res/atlas/PlayerRun.atlas";
        }
        onAwake() {
            super.onAwake();
            Laya.loader.load([this.spawnAtlas, this.idleAtlas, this.runAtlas], Laya.Handler.create(this, this.onLoadComplete), null, Laya.Loader.ATLAS);
        }
        onLoadComplete() {
            this.ani.loadAtlas(this.spawnAtlas, null, "spawn");
            this.ani.loadAtlas(this.idleAtlas, null, "idle");
            this.ani.loadAtlas(this.runAtlas, null, "run");
            this.ani.interval = 40;
            this.ani.play(0, false, "spawn");
            this.ani.on(Laya.Event.COMPLETE, this, () => {
                this.ani.offAll();
                this.ani.play(0, true, "idle");
                this.doBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                    this.ani.play(0, true, "run");
                });
                this.doBtn.on(Laya.Event.MOUSE_UP, this, () => {
                    this.ani.play(0, true, "idle");
                });
            });
        }
    }

    class GameUtils {
        static UIDataFindUIByNameOrVar(data, nameOrVar) {
            if (!data) {
                return null;
            }
            var props = data["props"];
            if (props && (props["var"] == nameOrVar || props["name"] == nameOrVar)) {
                return data;
            }
            var child = data["child"];
            for (var i in child) {
                var node = child[i];
                var res = GameUtils.UIDataFindUIByNameOrVar(node, nameOrVar);
                if (res) {
                    return res;
                }
            }
            return null;
        }
        static ColorStringToRGB(color) {
            let r, g, b;
            color = "" + color;
            if (typeof color !== "string")
                return;
            if (color.charAt(0) == "#") {
                color = color.substring(1);
            }
            if (color.length == 3) {
                color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
            }
            if (/^[0-9a-fA-F]{6}$/.test(color)) {
                r = parseInt(color.substr(0, 2), 16);
                g = parseInt(color.substr(2, 2), 16);
                b = parseInt(color.substr(4, 2), 16);
                return new Laya.Color(r, g, b, 255);
            }
        }
        static Vector3ToString(vector3) {
            return "(x:" + vector3.x.toFixed(1) + ", y:" + vector3.y.toFixed(1) + ", z:" + vector3.z.toFixed(1) + ")";
        }
        static FlyTextTips(msg) {
            let label = Laya.Pool.getItemByCreateFun("FlyTips", () => {
                let lbl = new Laya.Label("");
                lbl.fontSize = 30;
                lbl.color = "#ffffff";
                lbl.bgColor = "#000000";
                lbl.visible = false;
                lbl.align = "center";
                lbl.valign = "middle";
                return lbl;
            }, this);
            Laya.stage.addChild(label);
            label.width = undefined;
            label.text = msg;
            label.width += 30;
            label.height = label.fontSize + 30;
            label.x = (Laya.stage.width - label.width) / 2;
            label.y = (Laya.stage.height - label.height) / 2;
            let y = label.y - 200;
            label.visible = true;
            label.alpha = 1;
            label.zOrder = 5;
            Laya.Tween.to(label, { y: y, alpha: 0 }, 1.8 * 1000, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                label.visible = false;
                label.removeSelf();
                Laya.Pool.recover("FlyTips", label);
            }));
        }
        static Distance(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        }
        static Calculate(a, b, c) {
            let d_a = Laya.Vector3.distance(b, c);
            let d_b = Laya.Vector3.distance(a, c);
            let d_c = Laya.Vector3.distance(a, b);
            let angleA = Math.acos((d_b * d_b + d_c * d_c - d_a * d_a) / (2 * d_b * d_c)) * 180 / Math.PI;
            let angleB = Math.acos((d_a * d_a + d_c * d_c - d_b * d_b) / (2 * d_a * d_c)) * 180 / Math.PI;
            let angleC = Math.acos((d_a * d_a + d_b * d_b - d_c * d_c) / (2 * d_a * d_b)) * 180 / Math.PI;
            console.log(angleA + " " + angleB + " " + angleC);
            return angleA;
        }
        static WorldToScreen2(camera, point) {
            var pointA = this.InverseTransformPoint(camera.transform, point);
            var distance = pointA.z;
            var out = new Laya.Vector3();
            camera.viewport.project(point, camera.projectionViewMatrix, out);
            var value = new Laya.Vector3(out.x / Laya.stage.clientScaleX, out.y / Laya.stage.clientScaleY, distance);
            return value;
        }
        static ScreenToWorld(camera, point) {
            var halfFOV = (camera.fieldOfView * 0.5) * Math.PI / 180;
            let height = point.z * Math.tan(halfFOV);
            let width = height * camera.aspectRatio;
            let lowerLeft = this.GetLowerLeft(camera.transform, point.z, width, height);
            let v = this.GetScreenScale(width, height);
            var value = new Laya.Vector3();
            var lowerLeftA = this.InverseTransformPoint(camera.transform, lowerLeft);
            value = new Laya.Vector3(-point.x / v.x, point.y / v.y, 0);
            Laya.Vector3.add(lowerLeftA, value, value);
            value = this.TransformPoint(camera.transform, value);
            return value;
        }
        static GetScreenScale(width, height) {
            var v = new Laya.Vector3();
            v.x = Laya.stage.width / width / 2;
            v.y = Laya.stage.height / height / 2;
            return v;
        }
        static GetLowerLeft(transform, distance, width, height) {
            var lowerLeft = new Laya.Vector3();
            var right = new Laya.Vector3();
            transform.getRight(right);
            Laya.Vector3.normalize(right, right);
            var xx = new Laya.Vector3(right.x * width, right.y * width, right.z * width);
            Laya.Vector3.add(transform.position, xx, lowerLeft);
            var up = new Laya.Vector3();
            transform.getUp(up);
            Laya.Vector3.normalize(up, up);
            var yy = new Laya.Vector3(up.x * height, up.y * height, up.z * height);
            Laya.Vector3.subtract(lowerLeft, yy, lowerLeft);
            var forward = new Laya.Vector3();
            transform.getForward(forward);
            Laya.Vector3.normalize(forward, forward);
            var zz = new Laya.Vector3(forward.x * distance, forward.y * distance, forward.z * distance);
            Laya.Vector3.subtract(lowerLeft, zz, lowerLeft);
            return lowerLeft;
        }
        static InverseTransformPoint(origin, point) {
            var xx = new Laya.Vector3();
            origin.getRight(xx);
            var yy = new Laya.Vector3();
            origin.getUp(yy);
            var zz = new Laya.Vector3();
            origin.getForward(zz);
            var zz1 = new Laya.Vector3(-zz.x, -zz.y, -zz.z);
            var x = this.ProjectDistance(point, origin.position, xx);
            var y = this.ProjectDistance(point, origin.position, yy);
            var z = this.ProjectDistance(point, origin.position, zz1);
            var value = new Laya.Vector3(x, y, z);
            return value;
        }
        static TransformPoint(origin, point) {
            var value = new Laya.Vector3();
            Laya.Vector3.transformQuat(point, origin.rotation, value);
            Laya.Vector3.add(value, origin.position, value);
            return value;
        }
        static ProjectDistance(A, C, B) {
            var CA = new Laya.Vector3();
            Laya.Vector3.subtract(A, C, CA);
            var angle = this.Angle2(CA, B) * Math.PI / 180;
            var distance = Laya.Vector3.distance(A, C);
            distance *= Math.cos(angle);
            return distance;
        }
        static Angle2(ma, mb) {
            var v1 = (ma.x * mb.x) + (ma.y * mb.y) + (ma.z * mb.z);
            var ma_val = Math.sqrt(ma.x * ma.x + ma.y * ma.y + ma.z * ma.z);
            var mb_val = Math.sqrt(mb.x * mb.x + mb.y * mb.y + mb.z * mb.z);
            var cosM = v1 / (ma_val * mb_val);
            if (cosM < -1)
                cosM = -1;
            if (cosM > 1)
                cosM = 1;
            var angleAMB = Math.acos(cosM) * 180 / Math.PI;
            return angleAMB;
        }
        static MeasureText(text, lbl) {
            let style = lbl.getStyle();
            let font = style.currBitmapFont;
            if (font) {
                return font.getTextWidth(text);
            }
            else {
                if (Laya.Render.isConchApp) {
                    return window.conchTextCanvas.measureText(text).width;
                    ;
                }
                else {
                    let ret = Laya.Browser.context.measureText(text) || { width: 100 };
                    return ret.width;
                }
            }
        }
        static onAllEvent(sprite) {
            for (let index in this.eventArray) {
                sprite.on(this.eventArray[index], this, () => {
                    console.log(this.eventArray[index]);
                });
            }
        }
    }
    GameUtils.eventArray = [
        Laya.Event.MOUSE_DOWN,
        Laya.Event.MOUSE_UP,
        Laya.Event.CLICK,
        Laya.Event.RIGHT_MOUSE_DOWN,
        Laya.Event.RIGHT_MOUSE_UP,
        Laya.Event.RIGHT_CLICK,
        Laya.Event.MOUSE_MOVE,
        Laya.Event.MOUSE_OVER,
        Laya.Event.MOUSE_OUT,
        Laya.Event.MOUSE_WHEEL,
        Laya.Event.ROLL_OVER,
        Laya.Event.ROLL_OUT,
        Laya.Event.DOUBLE_CLICK,
        Laya.Event.CHANGE,
        Laya.Event.CHANGED,
        Laya.Event.RESIZE,
        Laya.Event.ADDED,
        Laya.Event.REMOVED,
        Laya.Event.DISPLAY,
        Laya.Event.UNDISPLAY,
        Laya.Event.ERROR,
        Laya.Event.COMPLETE,
        Laya.Event.LOADED,
        Laya.Event.READY,
        Laya.Event.PROGRESS,
        Laya.Event.INPUT,
        Laya.Event.RENDER,
        Laya.Event.OPEN,
        Laya.Event.MESSAGE,
        Laya.Event.CLOSE,
        Laya.Event.KEY_DOWN,
        Laya.Event.KEY_PRESS,
        Laya.Event.KEY_UP,
        Laya.Event.FRAME,
        Laya.Event.DRAG_START,
        Laya.Event.DRAG_MOVE,
        Laya.Event.DRAG_END,
        Laya.Event.ENTER,
        Laya.Event.SELECT,
        Laya.Event.BLUR,
        Laya.Event.FOCUS,
        Laya.Event.VISIBILITY_CHANGE,
        Laya.Event.FOCUS_CHANGE,
        Laya.Event.PLAYED,
        Laya.Event.PAUSED,
        Laya.Event.STOPPED,
        Laya.Event.START,
        Laya.Event.END,
        Laya.Event.COMPONENT_ADDED,
        Laya.Event.COMPONENT_REMOVED,
        Laya.Event.RELEASED,
        Laya.Event.LINK,
        Laya.Event.LABEL,
        Laya.Event.FULL_SCREEN_CHANGE,
        Laya.Event.DEVICE_LOST,
        Laya.Event.TRANSFORM_CHANGED,
        Laya.Event.ANIMATION_CHANGED,
        Laya.Event.TRAIL_FILTER_CHANGE,
        Laya.Event.TRIGGER_ENTER,
        Laya.Event.TRIGGER_STAY
    ];

    class BackpackView extends BaseView {
        constructor() {
            super(...arguments);
            this.listData = ["勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
                "勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
                "勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
                "勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
                "勇气勋章", "代达罗斯之殇", "穷鬼盾", "玲珑心", "虚灵刀", "臂章", "辉耀", "林肯法球", "强袭",
            ];
        }
        onAwake() {
            super.onAwake();
            let row = Math.ceil(this.listData.length / 4);
            this.scrollList.repeatY = row;
            this.scrollList.renderHandler = Laya.Handler.create(this, this.onListRender, null, false);
            this.scrollList.array = this.listData;
            this.scrollList.vScrollBarSkin = " ";
        }
        onListRender(item, index) {
            let itemData = this.scrollList.array[index];
            let lbl = item.getChildByName("propName");
            lbl.text = itemData;
            let btn = item.getChildByName("btn");
            btn.offAll(Laya.Event.CLICK);
            btn.on(Laya.Event.CLICK, this, () => {
                GameUtils.FlyTextTips(itemData);
            });
        }
    }

    class TimeCountView extends BaseView {
        constructor() {
            super(...arguments);
            this.progressValue = 0;
        }
        onAwake() {
            super.onAwake();
            this.progressBar.value = 0;
            Laya.timer.frameLoop(5, this, () => {
                this.progressBar.value = this.progressValue / 100;
                ++this.progressValue;
                if (this.progressValue > 100) {
                    this.progressValue = 0;
                }
                this.lbl.text = this.progressValue + "%";
            });
        }
    }

    class ColorFilterView extends BaseView {
        onAwake() {
            super.onAwake();
        }
    }

    class MyColorFilter extends Laya.Script {
        constructor() {
            super(...arguments);
            this.colorFilter = "#ffffff";
        }
        onAwake() {
            let color = GameUtils.ColorStringToRGB(this.colorFilter);
            let mat = [
                color.r / 255, 0, 0, 0, 0,
                0, color.g / 255, 0, 0, 0,
                0, 0, color.b / 255, 0, 0,
                0, 0, 0, color.a / 255, 0
            ];
            let f = new Laya.ColorFilter(mat);
            let spr = this.owner;
            spr.filters = [f];
        }
    }

    class ComboBoxView extends BaseView {
        onAwake() {
            super.onAwake();
            this.comboBox.labels = "豆浆,油条,炒面,糯米鸡,皮蛋瘦肉粥,肠粉,八宝粥,牛奶,燕麦,小笼包,水晶包,叉烧包,烧卖,花卷,馒头,鸡蛋饼,面茶,云吞,炸糕";
            this.comboBox.selectedIndex = 0;
            this.comboBox.selectHandler = Laya.Handler.create(this, () => {
                GameUtils.FlyTextTips("选中了:" + this.comboBox.selectedIndex + ":" + this.comboBox.selectedLabel);
            }, null, false);
        }
    }

    class DlgShowView extends BaseView {
        onAwake() {
            super.onAwake();
            this.okBtn.on(Laya.Event.CLICK, this, () => {
                this.doTween();
            });
            this.doTween();
        }
        doTween() {
            this.dlgBg.scale(0, 0);
            Laya.Tween.to(this.dlgBg, { scaleX: 1, scaleY: 1 }, 500, Laya.Ease.quartOut, Laya.Handler.create(this, () => {
                console.log("tween 动画完毕");
            }), 50);
        }
    }

    class FontNumView extends BaseView {
        onAwake() {
            super.onAwake();
            this.fontClip.value = this.textInput.text;
            this.textInput.on(Laya.Event.BLUR, this, () => {
                this.fontClip.value = this.textInput.text;
            });
        }
    }

    class FrameInfoView extends BaseView {
        onAwake() {
            super.onAwake();
            this.checkBox.selected = FrameInfoView.showFrameInfo;
            this.checkBox.on(Laya.Event.CLICK, this, () => {
                FrameInfoView.showFrameInfo = this.checkBox.selected;
                if (FrameInfoView.showFrameInfo) {
                    Laya.Stat.show();
                }
                else {
                    Laya.Stat.hide();
                }
            });
        }
    }
    FrameInfoView.showFrameInfo = false;

    class HorselampView extends BaseView {
        constructor() {
            super(...arguments);
            this.tips = [];
            this.showing = false;
        }
        onAwake() {
            super.onAwake();
            this.panelLeft = this.panel.x;
            this.panelRight = this.panel.x + this.panel.width;
            this.horselamepLbl.text = "";
            this.horselampPanel.alpha = 0;
            this.doBtn.on(Laya.Event.CLICK, this, () => {
                this.tryShowHorselamp(this.textInput.text);
            });
        }
        tryShowHorselamp(msg) {
            if (null != msg) {
                this.tips.push(msg);
            }
            if (this.showing) {
                return;
            }
            this.showing = true;
            let targetMsg = this.tips.shift();
            this.horselamepLbl.text = targetMsg;
            let width = GameUtils.MeasureText(targetMsg, this.horselamepLbl);
            this.horselamepLbl.x = this.panelRight;
            let targetPos = this.panelLeft - width;
            if (null != this.panelTween) {
                this.panelTween.pause();
                this.panelTween = null;
            }
            this.horselampPanel.alpha = 1;
            let duration = (this.panelRight - targetPos) * 10;
            Laya.Tween.to(this.horselamepLbl, { x: targetPos }, duration, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                this.showing = false;
                if (this.tips.length > 0)
                    this.tryShowHorselamp(null);
                else {
                    this.panelTween = Laya.Tween.to(this.horselampPanel, { alpha: 0 }, 200, Laya.Ease.linearNone);
                }
            }));
        }
    }

    class HttpRequestView extends BaseView {
        onAwake() {
            super.onAwake();
            this.getBtn.on(Laya.Event.CLICK, this, () => {
                this.httpGet("http://www.baidu.com/");
            });
            this.postBtn.on(Laya.Event.CLICK, this, () => {
                console.log("TODO");
                GameUtils.FlyTextTips("TODO");
            });
        }
        httpGet(url) {
            var req = new Laya.HttpRequest();
            req.http.timeout = 10000;
            req.on(Laya.Event.PROGRESS, this, (data) => {
                console.log("get请求进行中: " + data);
            });
            req.once(Laya.Event.ERROR, this, (data) => {
                console.log("get请求错误: " + data);
            });
            req.once(Laya.Event.COMPLETE, this, (data) => {
                console.log("get请求成功: " + data);
                GameUtils.FlyTextTips("get请求成功");
            });
            req.send(url, null, "get", "text");
        }
        httpPost(url, data, contentType) {
            var req = new Laya.HttpRequest();
            req.http.timeout = 10000;
            req.on(Laya.Event.PROGRESS, this, (data) => {
                console.log("post请求进行中: " + data);
            });
            req.once(Laya.Event.ERROR, this, (data) => {
                console.log("post请求错误: " + data);
            });
            req.once(Laya.Event.COMPLETE, this, (data) => {
                console.log("post请求成功: " + data);
            });
            if (contentType == null) {
                req.send(url, data, "post", "json");
            }
            else {
                req.send(url, data, "post", "json", ["content-type", contentType]);
            }
        }
    }

    class Joystick3DCtrlView extends BaseView {
        constructor() {
            super(...arguments);
            this.speedX = 0;
            this.speedY = 0;
            this.speedFactor = 0.1;
            this.hitResults = new Array();
        }
        onAwake() {
            super.onAwake();
            this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
                - (this.bgBox.bottom ? this.bgBox.bottom : 0);
            Laya.Scene3D.load("scene3d/LayaScene_MoveCtrler/Conventional/MoveCtrler.ls", Laya.Handler.create(this, this.onLoadSceneComplete));
        }
        onLoadSceneComplete(scene3d) {
            this.bgBox.visible = false;
            this.addChildAt(scene3d, 0);
            let cam = scene3d.getChildByName("Main Camera");
            let cube = scene3d.getChildByName("Cube");
            this.ctrlBack.pivot(this.ctrlBack.width / 2, this.ctrlBack.height / 2);
            this.ctrlRockerMove.pivot(this.ctrlRockerMove.width / 2, this.ctrlRockerMove.height / 2);
            this.ctrlRockerMove.visible = false;
            let backRadius = this.ctrlBack.width / 2;
            let originalPos = new Laya.Point(150, Laya.stage.height - 150);
            this.ctrlBack.pos(originalPos.x, originalPos.y);
            this.on(Laya.Event.MOUSE_DOWN, this, () => {
                let mouseX = Laya.stage.mouseX;
                let mouseY = Laya.stage.mouseY;
                if (mouseX <= Laya.stage.width / 1.5 && mouseY >= Laya.stage.height / 2) {
                    this.ctrlBack.pos(mouseX, mouseY);
                    this.canMove = true;
                }
            });
            this.on(Laya.Event.MOUSE_MOVE, this, () => {
                let mouseX = Laya.stage.mouseX;
                let mouseY = Laya.stage.mouseY;
                if (this.canMove) {
                    this.ctrlRocker.visible = false;
                    this.ctrlRockerMove.visible = true;
                    let ang = Math.atan2(mouseY - this.ctrlBack.y, mouseX - this.ctrlBack.x);
                    let d = GameUtils.Distance(mouseX, mouseY, this.ctrlBack.x, this.ctrlBack.y);
                    if (d <= (this.ctrlBack.width / 2)) {
                        this.ctrlRockerMove.pos(mouseX, mouseY);
                    }
                    else {
                        this.ctrlRockerMove.pos(this.ctrlBack.x + backRadius * Math.cos(ang), this.ctrlBack.y + backRadius * Math.sin(ang));
                    }
                    let targetRot = ang * 180 / Math.PI;
                    cube.transform.localRotationEulerY = -90 - targetRot;
                    let force = (Math.min(d, backRadius) / backRadius);
                    this.speedX = force * Math.cos(ang);
                    this.speedY = force * Math.sin(ang);
                }
            });
            this.on(Laya.Event.MOUSE_UP, this, () => {
                this.ctrlBack.pos(originalPos.x, originalPos.y);
                this.ctrlRocker.visible = true;
                this.ctrlRockerMove.visible = false;
                this.speedX = 0;
                this.speedY = 0;
                this.canMove = false;
            });
            Laya.timer.frameLoop(1, this, () => {
                if (!this.canMove)
                    return;
                let nextPosX = cube.transform.position.x - this.speedX * this.speedFactor;
                let nextPosZ = cube.transform.position.z - this.speedY * this.speedFactor;
                let rayFrom = new Laya.Vector3(nextPosX, -100, nextPosZ);
                let rayTo = new Laya.Vector3(nextPosX, 100, nextPosZ);
                scene3d.physicsSimulation.raycastAllFromTo(rayFrom, rayTo, this.hitResults);
                if (this.hitResults.length > 0) {
                    let hitPlane = false;
                    for (var i = 0, n = this.hitResults.length; i < n; i++) {
                        if (this.hitResults[i].collider.owner.name == "Plane") {
                            hitPlane = true;
                            break;
                        }
                    }
                    if (hitPlane) {
                        cube.transform.position = new Laya.Vector3(nextPosX, cube.transform.position.y, nextPosZ);
                    }
                }
            });
        }
    }

    class JoystickView extends BaseView {
        constructor() {
            super(...arguments);
            this.speedX = 0;
            this.speedY = 0;
            this.speedFactor = 2;
        }
        onAwake() {
            super.onAwake();
            this.ctrlBack.pivot(this.ctrlBack.width / 2, this.ctrlBack.height / 2);
            this.ctrlRockerMove.pivot(this.ctrlRockerMove.width / 2, this.ctrlRockerMove.height / 2);
            this.ctrlRockerMove.visible = false;
            let backRadius = this.ctrlBack.width / 2;
            let originalPos = new Laya.Point(150, Laya.stage.height - 150);
            this.ctrlBack.pos(originalPos.x, originalPos.y);
            this.on(Laya.Event.MOUSE_DOWN, this, () => {
                let mouseX = Laya.stage.mouseX;
                let mouseY = Laya.stage.mouseY;
                if (mouseX <= Laya.stage.width / 1.5 && mouseY >= Laya.stage.height / 2) {
                    this.ctrlBack.pos(mouseX, mouseY);
                    this.canMove = true;
                }
            });
            this.on(Laya.Event.MOUSE_MOVE, this, () => {
                let mouseX = Laya.stage.mouseX;
                let mouseY = Laya.stage.mouseY;
                if (this.canMove) {
                    this.ctrlRocker.visible = false;
                    this.ctrlRockerMove.visible = true;
                    let ang = Math.atan2(mouseY - this.ctrlBack.y, mouseX - this.ctrlBack.x);
                    let d = GameUtils.Distance(mouseX, mouseY, this.ctrlBack.x, this.ctrlBack.y);
                    if (d <= (this.ctrlBack.width / 2)) {
                        this.ctrlRockerMove.pos(mouseX, mouseY);
                    }
                    else {
                        this.ctrlRockerMove.pos(this.ctrlBack.x + backRadius * Math.cos(ang), this.ctrlBack.y + backRadius * Math.sin(ang));
                    }
                    let targetRot = ang * 180 / Math.PI;
                    let force = (Math.min(d, backRadius) / backRadius);
                    this.speedX = force * Math.cos(ang);
                    this.speedY = force * Math.sin(ang);
                }
            });
            this.on(Laya.Event.MOUSE_UP, this, () => {
                this.ctrlBack.pos(originalPos.x, originalPos.y);
                this.ctrlRocker.visible = true;
                this.ctrlRockerMove.visible = false;
                this.speedX = 0;
                this.speedY = 0;
                this.canMove = false;
            });
            Laya.timer.frameLoop(1, this, () => {
                if (!this.canMove)
                    return;
                this.avatar.x += this.speedX * this.speedFactor;
                this.avatar.y += this.speedY * this.speedFactor;
            });
        }
    }

    class ViewMgr {
        static ShowView(url, root) {
            Laya.Scene.load(url, Laya.Handler.create(this, (sceneObj) => {
                root.addChild(sceneObj);
            }));
        }
    }

    class MainView extends BaseView {
        constructor() {
            super(...arguments);
            this.listData = ["定时器", "帧率显示", "进度条", "艺术字", "下拉选框", "标签页", "声音播放", "弹框提示", "单选框",
                "提示语", "跑马灯", "过滤器", "图集动画", "3D场景", "预设动画", "粒子系统", "加载网络头像", "Http请求",
                "背包", "摇杆控制2D移动", "摇杆控制3D移动", "射线检测控制移动",
                "待开发...",
            ];
        }
        onAwake() {
            super.onAwake();
            Laya.stage.bgColor = "#ffffff";
            this.scrollList.repeatY = this.listData.length;
            this.scrollList.renderHandler = Laya.Handler.create(this, this.onListRender, null, false);
            this.scrollList.array = this.listData;
            this.scrollList.vScrollBarSkin = " ";
            this.onScreenResize();
        }
        onScreenResize() {
            super.onScreenResize();
            this.scrollList.height = Laya.stage.height - (this.scrollList.top ? this.scrollList.top : 0)
                - (this.scrollList.bottom ? this.scrollList.bottom : 0);
        }
        onListRender(cell, index) {
            if (index > this.scrollList.array.length) {
                return;
            }
            let itemData = this.scrollList.array[index];
            let lbl = cell.getChildByName("lbl");
            lbl.text = itemData;
            let btn = cell.getChildByName("bg");
            btn.offAll(Laya.Event.CLICK);
            btn.on(Laya.Event.CLICK, this, () => {
                this.onItemClick(itemData);
            });
        }
        onItemClick(name) {
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

    class PrefabAniView extends BaseView {
        onAwake() {
            super.onAwake();
            Laya.Scene3D.load("scene3d/LayaScene_ParticleScene/Conventional/ParticleScene.ls", Laya.Handler.create(this, this.onLoadSceneComplete));
            this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
                - (this.bgBox.bottom ? this.bgBox.bottom : 0);
        }
        onLoadSceneComplete(scene3D) {
            console.log("onLoadSceneComplete");
            this.bgBox.visible = false;
            this.addChildAt(scene3D, 0);
            let cam = scene3D.getChildByName("Main Camera");
            let ptc = scene3D.getChildByName("Particle");
            if (null != ptc) {
                this.on(Laya.Event.MOUSE_DOWN, this, () => {
                    let targetPos = GameUtils.ScreenToWorld(cam, new Laya.Vector3(Laya.stage.mouseX, Laya.stage.mouseY, -10));
                    ptc.transform.position = targetPos;
                });
                this.on(Laya.Event.MOUSE_MOVE, this, () => {
                    let targetPos = GameUtils.ScreenToWorld(cam, new Laya.Vector3(Laya.stage.mouseX, Laya.stage.mouseY, -10));
                    ptc.transform.position = targetPos;
                });
            }
        }
    }

    class PrefabAniView$1 extends BaseView {
        onAwake() {
            super.onAwake();
            Laya.Scene3D.load("scene3d/LayaScene_PrefabScene/Conventional/PrefabScene.ls", Laya.Handler.create(this, this.onLoadSceneComplete));
            this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
                - (this.bgBox.bottom ? this.bgBox.bottom : 0);
        }
        onLoadSceneComplete(scene3D) {
            this.bgBox.visible = false;
            this.addChildAt(scene3D, 0);
            let cube = scene3D.getChildByName("Cube");
            let cam = scene3D.getChildByName("Main Camera");
            this.on(Laya.Event.MOUSE_DOWN, this, () => {
                let obj = Laya.Pool.getItemByCreateFun("cube", () => {
                    return Laya.Sprite3D.instantiate(cube, cube.parent);
                }, this);
                obj.active = true;
                let targetPos = GameUtils.ScreenToWorld(cam, new Laya.Vector3(Laya.stage.mouseX, Laya.stage.mouseY, -10));
                obj.active = true;
                obj.transform.position = targetPos;
                Laya.timer.once(2000, this, () => {
                    obj.active = false;
                    Laya.Pool.recover("cube", obj);
                });
            });
        }
        onDestroy() {
            Laya.Pool.clearBySign("cube");
        }
    }

    class RadioView extends BaseView {
        onAwake() {
            super.onAwake();
            this.radiogroup.on(Laya.Event.CLICK, this, () => {
                console.log(this.radiogroup.selectedIndex);
            });
        }
    }

    class RayCastToMoveView extends BaseView {
        constructor() {
            super(...arguments);
            this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, -2, 0));
            this.hitResult = new Laya.HitResult();
            this.moveDir = new Laya.Vector3;
            this.moveSpeed = 0.01;
        }
        onAwake() {
            super.onAwake();
            this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
                - (this.bgBox.bottom ? this.bgBox.bottom : 0);
            Laya.Scene3D.load("scene3d/LayaScene_MoveCtrler/Conventional/MoveCtrler.ls", Laya.Handler.create(this, this.onLoadSceneComplete));
        }
        onLoadSceneComplete(scene3d) {
            this.bgBox.visible = false;
            this.addChildAt(scene3d, 0);
            let cam = scene3d.getChildByName("Main Camera");
            let cube = scene3d.getChildByName("Cube");
            let canMove = false;
            this.on(Laya.Event.MOUSE_DOWN, this, () => {
                canMove = false;
                var point = new Laya.Vector2();
                point.x = Laya.MouseManager.instance.mouseX;
                point.y = Laya.MouseManager.instance.mouseY;
                cam.viewportPointToRay(point, this.ray);
                scene3d.physicsSimulation.rayCast(this.ray, this.hitResult);
            });
            let nextPos = new Laya.Vector3;
            let deltaVector = new Laya.Vector3;
            let curMoveDir = new Laya.Vector3;
            Laya.timer.frameLoop(1, this, () => {
                if (!canMove)
                    return;
                Laya.Vector3.subtract(this.hitResult.point, cube.transform.position, curMoveDir);
                if (Laya.Vector3.dot(this.moveDir, curMoveDir) > 0) {
                    Laya.Vector3.scale(this.moveDir, Laya.timer.delta * this.moveSpeed, deltaVector);
                    Laya.Vector3.add(cube.transform.position, deltaVector, nextPos);
                    cube.transform.position = nextPos;
                }
                else {
                    cube.transform.position = this.hitResult.point;
                    canMove = false;
                }
            });
            this.on(Laya.Event.MOUSE_UP, this, () => {
                if (!this.hitResult.succeeded)
                    return;
                console.log("点中了: " + this.hitResult.collider.owner.name);
                if ("Plane" != this.hitResult.collider.owner.name)
                    return;
                this.hitResult.point.y = cube.transform.position.y;
                Laya.Vector3.subtract(this.hitResult.point, cube.transform.position, this.moveDir);
                Laya.Vector3.normalize(this.moveDir, this.moveDir);
                let lookAtPos = new Laya.Vector3();
                Laya.Vector3.add(cube.transform.position, new Laya.Vector3(-this.moveDir.x, 0, -this.moveDir.z), lookAtPos);
                cube.transform.lookAt(lookAtPos, new Laya.Vector3(0, 1, 0), false);
                canMove = true;
            });
        }
    }

    class DlgShowView$1 extends BaseView {
        constructor() {
            super(...arguments);
            this.mouseLastX = -1;
            this.windsockRoting = false;
        }
        onAwake() {
            super.onAwake();
            this.center.visible = false;
            this.bgBox.height = Laya.stage.height - (this.bgBox.top ? this.bgBox.top : 0)
                - (this.bgBox.bottom ? this.bgBox.bottom : 0);
            Laya.loader.create("scene3d/LayaScene_3DScene/Conventional/3DScene.ls", Laya.Handler.create(this, this.onLoadSceneComplete), Laya.Handler.create(this, (pro) => {
                this.progressBar.value = pro;
                this.progressLbl.text = (pro * 100).toFixed(2) + "%";
            }));
        }
        onLoadSceneComplete(scene) {
            console.log("onLoadSceneComplete");
            this.bgBox.visible = false;
            this.center.visible = true;
            this.addChildAt(scene, 0);
            this.cam = scene.getChildByName("Main Camera");
            let windsock = scene.getChildByName("aircraft-A-A").getChildByName("Plane");
            this.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.mouseLastX = Laya.stage.mouseX;
            });
            this.on(Laya.Event.MOUSE_MOVE, this, () => {
                let delta = Laya.stage.mouseX - this.mouseLastX;
                this.cam.transform.localRotationEulerY += delta * 0.15;
                this.mouseLastX = Laya.stage.mouseX;
            });
            this.doBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.windsockRoting = true;
            });
            this.doBtn.on(Laya.Event.MOUSE_UP, this, () => {
                this.windsockRoting = false;
            });
            Laya.timer.frameLoop(1, this, () => {
                if (!this.windsockRoting)
                    return;
                if (null == windsock)
                    return;
                windsock.transform.localRotationEulerZ -= Laya.timer.delta * 100;
            }, null, false);
        }
    }

    class FontNumView$1 extends BaseView {
        onAwake() {
            super.onAwake();
            this.soundBtn.on(Laya.Event.CLICK, this, () => {
                Laya.SoundManager.playSound("sounds/sound.wav", 1);
            });
            this.musicBtn.on(Laya.Event.CLICK, this, () => {
                console.log("play music");
                Laya.SoundManager.playMusic("sounds/bgm.wav", -1, Laya.Handler.create(this, () => {
                    console.log("播放完了");
                }));
            });
            this.musicVol.on(Laya.Event.CHANGE, this, () => {
                Laya.SoundManager.setMusicVolume(this.musicVol.value / 100);
            });
            this.musicVol.value = Laya.SoundManager.musicVolume * 100;
            this.soundVol.on(Laya.Event.CHANGE, this, () => {
                Laya.SoundManager.setSoundVolume(this.soundVol.value / 100);
            });
            this.soundVol.value = Laya.SoundManager.soundVolume * 100;
        }
    }

    class TabPageView extends BaseView {
        onAwake() {
            super.onAwake();
            this.tab.labels = "页面1,页面2";
            this.tab.selectedIndex = 0;
            this.tab.selectHandler = Laya.Handler.create(this, this.onTabSelect, null, false);
            this.onTabSelect();
        }
        onTabSelect() {
            this.page1.visible = 0 == this.tab.selectedIndex;
            this.page2.visible = 1 == this.tab.selectedIndex;
        }
    }

    class TextTipsView extends BaseView {
        onAwake() {
            super.onAwake();
            this.doBtn.on(Laya.Event.CLICK, this, () => {
                GameUtils.FlyTextTips(this.textInput.text);
            });
        }
    }

    class TimeCountView$1 extends BaseView {
        constructor() {
            super(...arguments);
            this.millisecond = 0;
        }
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

    class WebHeadView extends BaseView {
        onAwake() {
            super.onAwake();
            let url = "http://ask.layabox.com/static/common/avatar-max-img.png";
            Laya.loader.load(url, Laya.Handler.create(this, () => {
                this.circleHeadImage.skin = url;
                this.headImage.skin = url;
            }));
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("View/AtlasAniView.ts", AtlasAniView);
            reg("View/BackpackView.ts", BackpackView);
            reg("View/ProgressBarView.ts", TimeCountView);
            reg("View/ColorFilterView.ts", ColorFilterView);
            reg("ColorFilter/MyColorFilter.ts", MyColorFilter);
            reg("View/ComboBoxView.ts", ComboBoxView);
            reg("View/DlgShowView.ts", DlgShowView);
            reg("View/FontNumView.ts", FontNumView);
            reg("View/FrameInfoView.ts", FrameInfoView);
            reg("View/HorselampView.ts", HorselampView);
            reg("View/HttpRequestView.ts", HttpRequestView);
            reg("View/Joystick3DCtrlView.ts", Joystick3DCtrlView);
            reg("View/JoystickView.ts", JoystickView);
            reg("View/MainView.ts", MainView);
            reg("View/ParticleView.ts", PrefabAniView);
            reg("View/PrefabAniView.ts", PrefabAniView$1);
            reg("View/RadioView.ts", RadioView);
            reg("View/RayCastToMoveView.ts", RayCastToMoveView);
            reg("View/Scene3DView.ts", DlgShowView$1);
            reg("View/SoundPlayView.ts", FontNumView$1);
            reg("View/TabPageView.ts", TabPageView);
            reg("View/TextTipsView.ts", TextTipsView);
            reg("View/TimeCountView.ts", TimeCountView$1);
            reg("View/WebHeadView.ts", WebHeadView);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 2048;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "MainView.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
