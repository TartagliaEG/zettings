"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_env_1 = require("./sources/src-env");
exports.EnvSource = src_env_1.default;
const src_memory_1 = require("./sources/src-memory");
exports.MemorySource = src_memory_1.default;
const src_json_1 = require("./sources/src-json");
exports.JsonSource = src_json_1.default;
const zettings_1 = require("./zettings");
exports.default = { Zettings: zettings_1.default };
//# sourceMappingURL=declarations.js.map