export default {
    methods: {
        /* 判断直线与水平线夹角
        *  @param x1 点1的x坐标
        *  @param y1 点1的y坐标
        *  @param x2 点2的x坐标
        *  @param y2 点2的y坐标
        *  @returns {number}角度
        */
        findAngle(x1, y1, x2, y2) {
            let k = (y1 - y2) / (x1 - x2);
            return Math.atan(k) * 180 / Math.PI;
        },

        findArrowPoint(x1, y1, x2, y2, rectWidth, rectHeight) {
            let self = this;
            let rect_x = rectWidth / 2;
            let rect_y = rectHeight / 2;
            let x;
            let y;
            let selection = self.findSelection(x1, y1, x2, y2);
            //如果与x轴水平，并在点2的左侧
            if (11 === selection) {
                x = x2 - rect_x;
                y = y2;
                return [x, y]
            }
            //如果与y轴水平，并在点2的上面
            if (22 === selection) {
                x = x2;
                y = y2 - rect_y;
                return [x, y]
            }
            //如果与x轴水平，并在点2的右侧
            if (33 === selection) {
                y = y2;
                x = x2 + rect_x;
                return [x, y]
            }
            //如果与y轴水平，并在点2的下面
            if (44 === selection) {
                x = x2;
                y = y2 + rect_y;
                return [x, y]
            }
            let angle = Math.abs(self.findAngle(x1, y1, x2, y2));
            let x_offset = 0;
            let y_offset = 0;
            if (1 === selection) {
                if (angle === 45) {
                    x = x2 - rect_x;
                    y = y2 - rect_y;
                    return [x, y];
                }
                if (angle < 45) {
                    y_offset = rect_x * self.tan(angle);
                    y = y2 - y_offset;
                    x = x2 - rect_x;
                    return [x, y]
                }
                x_offset = rect_y / self.tan(angle);
                y = y2 - rect_y;
                x = x2 - x_offset;
                return [x, y];
            }
            if (2 === selection) {
                if (angle === 45) {
                    x = x2 + rect_x;
                    y = y2 - rect_y;
                    return [x, y];
                }
                if (angle < 45) {
                    y_offset = rect_x * self.tan(angle);
                    y = y2 - y_offset;
                    x = x2 + rect_x;
                    return [x, y]
                }
                x_offset = rect_y / self.tan(angle);
                y = y2 - rect_y;
                x = x2 + x_offset;
                return [x, y];
            }
            if (3 === selection) {
                if (angle === 45) {
                    x = x2 + rect_x;
                    y = y2 + rect_y;
                    return [x, y];
                }
                if (angle < 45) {
                    y_offset = rect_x * self.tan(angle);
                    y = y2 + y_offset;
                    x = x2 + rect_x;
                    return [x, y]
                }
                x_offset = rect_y / self.tan(angle);
                y = y2 + rect_y;
                x = x2 + x_offset;
                return [x, y];
            }
            if (4 === selection) {
                if (angle === 45) {
                    x = x2 - rect_x;
                    y = y2 + rect_y;
                    return [x, y];
                }
                if (angle < 45) {
                    y_offset = rect_x * self.tan(angle);
                    y = y2 + y_offset;
                    x = x2 - rect_x;
                    return [x, y]
                }
                x_offset = rect_y / self.tan(angle);
                y = y2 + rect_y;
                x = x2 - x_offset;
                return [x, y];
            }
        },

        tan(angle) {
            return Math.tan(angle * Math.PI / 180)
        },

        findSelection(x1, y1, x2, y2) {
            let up = 0;
            if (y1 - y2 < 0) {
                up = 1
            } else if (y1 - y2 > 0) {
                up = -1
            }
            let left = 0;
            if (x1 - x2 < 0) {
                left = 1;
            } else if (x1 - x2 > 0) {
                left = -1;
            }
            if (up > 0 && left > 0) {
                return 1;
            }
            if (up > 0 && left < 0) {
                return 2;
            }
            if (up < 0 && left < 0) {
                return 3;
            }
            if (up < 0 && left > 0) {
                return 4;
            }
            if (up === 0 && left > 0) {
                return 11
            }
            if (left === 0 && up > 0) {
                return 22
            }
            if (up === 0 && left < 0) {
                return 33
            }
            if (left === 0 && up < 0) {
                return 44
            }
        }
    }
}
