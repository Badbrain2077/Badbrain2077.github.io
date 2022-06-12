'use strict';

var obsidian = require('obsidian');
var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var os = require('os');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespace(path);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_OPEN_WITH = 'system-default';
const PRESET_BROWSERS = {
    safari: {
        darwin: {
            sysCmd: 'open',
            sysArgs: ['-a'],
            cmd: 'safari',
            optional: {},
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return true;
            }),
        },
    },
    firefox: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Firefox.app', 'Contents', 'MacOS', 'firefox'),
            optional: {
                private: {
                    args: ['--private-window'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return fs.existsSync(b.cmd);
            }),
        },
        linux: {
            cmd: 'firefox',
            optional: {
                private: {
                    args: ['--private-window'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                const c = child_process.spawnSync('which', [b.cmd]);
                return c.status === 0;
            }),
        },
        win32: {
            cmd: path__namespace.join('c:', 'Program Files', 'Mozilla Firefox', 'firefox.exe'),
            optional: {
                private: {
                    args: ['--private-window'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return fs.existsSync(b.cmd);
            }),
        },
    },
    chrome: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Google Chrome.app', 'Contents', 'MacOS', 'Google Chrome'),
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return fs.existsSync(b.cmd);
            }),
        },
        linux: {
            cmd: 'google-chrome',
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                const c = child_process.spawnSync('which', [b.cmd]);
                return c.status === 0;
            }),
        },
        win32: {
            cmd: path__namespace.join('c:', 'Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return fs.existsSync(b.cmd);
            }),
        },
    },
    chromium: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return fs.existsSync(b.cmd);
            }),
        },
        linux: {
            cmd: 'chromium-browser',
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                const c = child_process.spawnSync('which', [b.cmd]);
                return c.status === 0;
            }),
        },
    },
    edge: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Microsoft Edge.app', 'Contents', 'MacOS', 'Microsoft Edge'),
            optional: {
                private: {
                    args: ['-inprivate'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return fs.existsSync(b.cmd);
            }),
        },
        win32: {
            cmd: path__namespace.join('c:', 'Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
            optional: {
                private: {
                    args: ['-inprivate'],
                },
            },
            test: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return fs.existsSync(b.cmd);
            }),
        },
    },
};

class Browser {
    constructor(name, defaultCMD) {
        this.name = name;
        this.profiles = defaultCMD;
    }
}
const openWith = (url, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    const _spawn = (args) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((res) => {
            let failed = false;
            const child = child_process.spawn(args[0], args.slice(1), {
                stdio: 'ignore',
                shell: true,
            });
            child.on('exit', (code) => {
                failed = code !== 0;
                res(!failed);
            });
            setTimeout(() => {
                res(!failed);
            }, 200);
        });
    });
    const target = '$TARGET_URL';
    let match = false;
    const _cmd = cmd.map((arg) => {
        const idx = arg.indexOf(target);
        if (idx !== -1) {
            match = true;
            return (arg.substr(0, idx) +
                encodeURIComponent(url) +
                arg.substr(idx + target.length));
        }
        else {
            return arg;
        }
    });
    if (!match) {
        _cmd.push(url);
    }
    return yield _spawn(_cmd);
});
const getPresetBrowser = () => {
    const presets = [];
    presets.push(new Browser('safari', PRESET_BROWSERS['safari']));
    presets.push(new Browser('firefox', PRESET_BROWSERS['firefox']));
    presets.push(new Browser('chrome', PRESET_BROWSERS['chrome']));
    presets.push(new Browser('chromium', PRESET_BROWSERS['chromium']));
    presets.push(new Browser('edge', PRESET_BROWSERS['edge']));
    return presets;
};
const getValidBrowser = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = getPresetBrowser();
    const os$1 = os.platform();
    const preset = {};
    browser.forEach(({ profiles, name }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let app = profiles[os$1];
        if (app.test && (yield app.test(app))) {
            for (const pvt of [0, 1]) {
                const cmds = [];
                if (pvt) {
                    if (!((_a = app === null || app === void 0 ? void 0 : app.optional) === null || _a === void 0 ? void 0 : _a.private)) {
                        continue;
                    }
                    app = Object.assign(Object.assign({}, app), ((_b = app.optional.private) !== null && _b !== void 0 ? _b : {}));
                }
                if (app.sysCmd) {
                    cmds.push(app.sysCmd);
                }
                if (app.sysArgs) {
                    app.sysArgs.forEach((arg) => cmds.push(arg));
                }
                cmds.push(app.cmd);
                if (app.args) {
                    app.args.forEach((arg) => cmds.push(arg));
                }
                preset[name + (pvt ? '-private' : '')] = cmds;
            }
        }
    }));
    return preset;
});

const DEFAULT_SETTINGS = {
    selected: DEFAULT_OPEN_WITH,
    custom: {},
};
class OpenLinkPlugin extends obsidian.Plugin {
    get profiles() {
        return Object.assign(Object.assign({}, this.presetProfiles), this.settings.custom);
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.presetProfiles = yield getValidBrowser();
            this.addSettingTab(new SettingTab(this.app, this));
            this.registerDomEvent(document, 'click', (evt) => __awaiter(this, void 0, void 0, function* () {
                const ele = evt.target;
                if (ele.className === 'external-link') {
                    const url = ele.getAttribute('href');
                    const cur = this.settings.selected;
                    if (cur !== DEFAULT_OPEN_WITH) {
                        evt.preventDefault();
                        if (!(yield openWith(url, this.profiles[cur]))) {
                            open(url);
                        }
                    }
                }
            }));
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
class PanicModal extends obsidian.Modal {
    constructor(app, message) {
        super(app);
        this.message = message;
    }
    onOpen() {
        let { contentEl } = this;
        contentEl.setText(this.message);
    }
    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}
class SettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this._profileChangeHandler = obsidian.debounce((val) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const profiles = JSON.parse(val);
                this.plugin.settings.custom = profiles;
                yield this.plugin.saveSettings();
                this._render();
            }
            catch (e) {
                this.panic((_b = (_a = e.message) !== null && _a !== void 0 ? _a : e.toString()) !== null && _b !== void 0 ? _b : 'some error occurred in open-link-with');
            }
        }), 1500, true);
    }
    panic(msg) {
        new PanicModal(this.app, msg).open();
    }
    _render() {
        let { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName('Browser')
            .setDesc('Open external link with...')
            .addDropdown((dd) => {
            const cur = this.plugin.settings.selected;
            const items = [];
            const profiles = this.plugin.profiles;
            let _match = false;
            for (const p of Object.keys(profiles)) {
                if (p === cur) {
                    _match = true;
                    items.unshift(p);
                }
                else {
                    items.push(p);
                }
            }
            if (!_match) {
                items.unshift(DEFAULT_OPEN_WITH);
            }
            else {
                items.push(DEFAULT_OPEN_WITH);
            }
            items.forEach((i) => dd.addOption(i, i));
            dd.onChange((p) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.selected = p;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Customization')
            .setDesc('Customization profiles in JSON')
            .addText((text) => text
            .setPlaceholder('{}')
            .setValue(JSON.stringify(this.plugin.settings.custom, null, 4))
            .onChange(this._profileChangeHandler));
    }
    display() {
        this._render();
    }
}

module.exports = OpenLinkPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL3NyYy9jb25zdGFudC50cyIsIi4uL3NyYy9vcGVuLnRzIiwiLi4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbInBhdGgiLCJleGlzdHNTeW5jIiwic3Bhd25TeW5jIiwic3Bhd24iLCJvcyIsInBsYXRmb3JtIiwiUGx1Z2luIiwiTW9kYWwiLCJQbHVnaW5TZXR0aW5nVGFiIiwiZGVib3VuY2UiLCJTZXR0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFF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
