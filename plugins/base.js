"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    draw(array, count = 1) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
exports.Plugin = Plugin;
//# sourceMappingURL=base.js.map