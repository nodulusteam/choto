"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
require('pg').defaults.ssl = config_1.Config.db.ssl;
const { Client } = require('pg');
console.log('configuration:', config_1.Config);
let activeClient = null;
function DB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!activeClient) {
            const connectionObj = (config_1.Config.db.url) ? config_1.Config.db.url : config_1.Config.db;
            const client = new Client(connectionObj);
            yield client.connect();
            activeClient = client;
        }
        return activeClient;
    });
}
exports.DB = DB;
//# sourceMappingURL=index.js.map