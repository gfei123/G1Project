export default class GameUtils {

    /**在scene中 查找 name 或 var 的数据，用于克隆，例
     * let res = Laya.loader.getRes("xxx.scene");
     * let targetNode = GameUtils.UIDataFindUIByNameOrVar(res, "目标节点的var名");
     * let obj = Laya.SceneUtils.createByData(null, targetNode);
    */
    static UIDataFindUIByNameOrVar(data: any, nameOrVar: string): any {
        if (!data) {
            return null;
        }
        var props = data["props"]
        if (props && (props["var"] == nameOrVar || props["name"] == nameOrVar)) {
            return data;
        }
        var child = data["child"]
        for (var i in child) {
            var node = child[i];
            var res = GameUtils.UIDataFindUIByNameOrVar(node, nameOrVar);
            if (res) {
                return res;
            }
        }
        return null;
    }

    /**
     * 颜色字符串转Laya.Color
     * @param color 颜色字符串
     * @returns Laya.Color
     */
    static ColorStringToRGB(color) {
        let r, g, b;
        color = "" + color;
        if (typeof color !== "string") return;
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

    static Vector3ToString(vector3: Laya.Vector3): string {
        return "(x:" + vector3.x.toFixed(1) + ", y:" + vector3.y.toFixed(1) + ", z:" + vector3.z.toFixed(1) + ")";
    }

    /*
     * 冒提示语
     */
    static FlyTextTips(msg: string): void {
        let label = Laya.Pool.getItemByCreateFun("FlyTips", () => {
            let lbl = new Laya.Label("");
            lbl.fontSize = 30;
            lbl.color = "#ffffff";
            lbl.bgColor = "#000000";
            lbl.visible = false;
            lbl.align = "center";
            lbl.valign = "middle";
            return lbl;
        }, this) as Laya.Label;

        Laya.stage.addChild(label);
        label.width = undefined;
        label.text = msg;
        label.width += 30;
        label.height = label.fontSize + 30;
        label.x = (Laya.stage.width - label.width) / 2;
        label.y = (Laya.stage.height - label.height) / 2;
        let y: number = label.y - 200;
        label.visible = true;
        label.alpha = 1;
        label.zOrder = 5;

        Laya.Tween.to(label, { y: y, alpha: 0 }, 1.8 * 1000, Laya.Ease.linearNone,
            Laya.Handler.create(this, () => {
                label.visible = false;
                label.removeSelf();
                Laya.Pool.recover("FlyTips", label);
            }));
    }


    static Distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    }

    static Calculate(a: Laya.Vector3, b: Laya.Vector3, c: Laya.Vector3) {
        let d_a: number = Laya.Vector3.distance(b, c);
        let d_b: number = Laya.Vector3.distance(a, c);
        let d_c: number = Laya.Vector3.distance(a, b);
        //angleA表示A点的夹角
        let angleA = Math.acos((d_b * d_b + d_c * d_c - d_a * d_a) / (2 * d_b * d_c)) * 180 / Math.PI;
        let angleB = Math.acos((d_a * d_a + d_c * d_c - d_b * d_b) / (2 * d_a * d_c)) * 180 / Math.PI;
        let angleC = Math.acos((d_a * d_a + d_b * d_b - d_c * d_c) / (2 * d_a * d_b)) * 180 / Math.PI;
        console.log(angleA + " " + angleB + " " + angleC);
        return angleA;
    }

    /*
     * 世界坐标转屏幕坐标
     * @param {Laya.Camera} camera   参照相机
     * @param {Laya.Vector3} point   需要转换的点
     */
    static WorldToScreen2(camera, point) {
        var pointA = this.InverseTransformPoint(camera.transform, point);
        var distance = pointA.z;

        var out = new Laya.Vector3();
        camera.viewport.project(point, camera.projectionViewMatrix, out);
        var value = new Laya.Vector3(out.x / Laya.stage.clientScaleX, out.y / Laya.stage.clientScaleY, distance);
        return value;
    }/*
     * 屏幕坐标转世界坐标
     * @param {Laya.Camera} camera  参照相机
     * @param {Laya.Vector3} point  需要转换的点
     */
    static ScreenToWorld(camera, point) {
        var halfFOV = (camera.fieldOfView * 0.5) * Math.PI / 180;
        let height = point.z * Math.tan(halfFOV);
        let width = height * camera.aspectRatio;

        let lowerLeft = this.GetLowerLeft(camera.transform, point.z, width, height);
        let v = this.GetScreenScale(width, height);

        // 放到同一坐标系（相机坐标系）上计算相对位置
        var value = new Laya.Vector3();
        var lowerLeftA = this.InverseTransformPoint(camera.transform, lowerLeft);
        value = new Laya.Vector3(-point.x / v.x, point.y / v.y, 0);
        Laya.Vector3.add(lowerLeftA, value, value);
        // 转回世界坐标系
        value = this.TransformPoint(camera.transform, value);
        return value;
    }

    /*
     * 获取三维场景和屏幕比例
     * @param {Number} width     宽
     * @param {Number} height    长
     */
    static GetScreenScale(width, height) {
        var v = new Laya.Vector3();
        v.x = Laya.stage.width / width / 2;
        v.y = Laya.stage.height / height / 2;
        return v;
    }

    /*
     * 获取相机在 distance距离的截面右下角世界坐标位置
     * @param {Laya.Transform} transform    相机transfrom
     * @param {Number} distance     距离
     * @param {Number} width        宽度
     * @param {Number} height       长度
     */
    static GetLowerLeft(transform, distance, width, height) {
        // 相机在 distance距离的截面左下角世界坐标位置
        // LowerLeft
        var lowerLeft = new Laya.Vector3();

        // lowerLeft = transform.position - (transform.right * width);
        var right = new Laya.Vector3();
        transform.getRight(right);
        Laya.Vector3.normalize(right, right);
        var xx = new Laya.Vector3(right.x * width, right.y * width, right.z * width);
        Laya.Vector3.add(transform.position, xx, lowerLeft);

        // lowerLeft -= transform.up * height;
        var up = new Laya.Vector3();
        transform.getUp(up);
        Laya.Vector3.normalize(up, up);
        var yy = new Laya.Vector3(up.x * height, up.y * height, up.z * height);
        Laya.Vector3.subtract(lowerLeft, yy, lowerLeft);

        // lowerLeft += transform.forward * distance;
        var forward = new Laya.Vector3();
        transform.getForward(forward);
        Laya.Vector3.normalize(forward, forward);
        var zz = new Laya.Vector3(forward.x * distance, forward.y * distance, forward.z * distance);
        Laya.Vector3.subtract(lowerLeft, zz, lowerLeft);
        return lowerLeft;
    }

    /*
     * 世界坐标转相对坐标
     * @param {Laya.Transform} origin   camera.transform
     * @param {Laya.Vector3} point      需要转换的点
     */
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

    /*
     * 相对坐标转世界坐标
     * @param {Laya.Transform} origin   camera.transform
     * @param {Laya.Vector3} point      需要转换的点
     */
    static TransformPoint(origin, point) {
        var value = new Laya.Vector3();
        Laya.Vector3.transformQuat(point, origin.rotation, value);
        Laya.Vector3.add(value, origin.position, value);
        return value;
    }

    /*
     * 向量投影长度, 向量CA 在向量 CB 上的投影长度
     * @param {Laya.Vector3} A
     * @param {Laya.Vector3} C
     * @param {Laya.Vector3} B
     */
    static ProjectDistance(A, C, B) {
        var CA = new Laya.Vector3();
        Laya.Vector3.subtract(A, C, CA);
        var angle = this.Angle2(CA, B) * Math.PI / 180;
        var distance = Laya.Vector3.distance(A, C);
        distance *= Math.cos(angle);
        return distance;
    }

    /*
     * 向量夹角
     * @param {Laya.Vector3} ma 向量A
     * @param {Laya.Vector3} mb 向量B
     */
    static Angle2(ma, mb) {
        var v1 = (ma.x * mb.x) + (ma.y * mb.y) + (ma.z * mb.z);
        var ma_val = Math.sqrt(ma.x * ma.x + ma.y * ma.y + ma.z * ma.z);
        var mb_val = Math.sqrt(mb.x * mb.x + mb.y * mb.y + mb.z * mb.z);
        var cosM = v1 / (ma_val * mb_val);

        if (cosM < -1) cosM = -1;
        if (cosM > 1) cosM = 1;

        var angleAMB = Math.acos(cosM) * 180 / Math.PI;
        return angleAMB;
    }

    // 计算文本的实际宽度 (貌似计算不是很精准)
    static MeasureText(text: string, lbl: Laya.Label): number {
        let style = lbl.getStyle() as Laya.TextStyle;
        let font = style.currBitmapFont;
        if (font) {
            return font.getTextWidth(text);
        }
        else {
            if (Laya.Render.isConchApp) {
                return (window as any).conchTextCanvas.measureText(text).width;;
            }
            else {
                let ret = Laya.Browser.context.measureText(text) || { width: 100 };
                return ret.width;
            }
        }
    }

    // 监听所有的事件（不知道会响应什么事件的时候可以用这个进行测试）
    static onAllEvent(sprite: Laya.Sprite) {
        for (let index in this.eventArray) {
            sprite.on(this.eventArray[index], this, () => {
                console.log(this.eventArray[index]);
            });
        }
    }

    static readonly eventArray = [
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
    ]
}