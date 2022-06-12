'use strict';

var obsidian = require('obsidian');

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

var LabView = /** @class */ (function (_super) {
    __extends(LabView, _super);
    function LabView(leaf, commandId, command) {
        var _this = _super.call(this, leaf) || this;
        _this.command = command;
        _this.commandId = commandId;
        return _this;
    }
    LabView.prototype.getViewType = function () {
        return this.commandId;
    };
    LabView.prototype.getDisplayText = function () {
        return this.command.label == null ? this.commandId : this.command.label;
    };
    LabView.prototype.getIcon = function () {
        return this.command.icon == null ? 'lab' : this.command.icon;
    };
    return LabView;
}(obsidian.ItemView));

var path = require('path');
// A panel that shows notes or text.
var LabPanel = /** @class */ (function (_super) {
    __extends(LabPanel, _super);
    function LabPanel(leaf, commandId, command) {
        var _this = _super.call(this, leaf, commandId, command) || this;
        /**
         * Updates the panel
         */
        _this.draw = function () {
            var openFile = _this.app.workspace.getActiveFile();
            var rootEl = createDiv({ cls: 'nav-folder mod-root' });
            _this.state =
                _this.state == null
                    ? {
                        label: '',
                        contents: '',
                    }
                    : _this.state;
            // Label of the panel
            var context = rootEl.createDiv({
                title: 'title',
                cls: 'nav-file python-lab-title',
                text: _this.state.label,
            });
            // Function open on click
            var clickElement = function (file, shouldSplit) {
                if (shouldSplit === void 0) { shouldSplit = false; }
                var filePath = file.path;
                // If it applies, remove the vault path
                if (_this.app.vault.adapter instanceof obsidian.FileSystemAdapter) {
                    var vaultPath = _this.app.vault.adapter.getBasePath();
                    if (filePath.startsWith(vaultPath)) {
                        filePath = path.relative(vaultPath, filePath);
                    }
                }
                var targetFile = _this.app.vault
                    .getFiles()
                    .find(function (f) { return f.path === filePath; });
                if (targetFile) {
                    var leaf = _this.app.workspace.getMostRecentLeaf();
                    if (shouldSplit) {
                        leaf = _this.app.workspace.createLeafBySplit(leaf);
                    }
                    leaf.openFile(targetFile);
                }
                else {
                    new obsidian.Notice("'" + file.path + "' not found");
                    if (Array.isArray(_this.state.contents)) {
                        _this.state.contents = _this.state.contents.filter(function (fp) { return fp.path !== file.path; });
                    }
                    _this.draw();
                }
            };
            // Draw a list, when is a list
            if (Array.isArray(_this.state.contents)) {
                _this.state.contents.forEach(function (currentFile) {
                    var childrenEl = rootEl.createDiv({ cls: 'nav-folder-children' });
                    // The info that will appear on hover
                    var jsonInfo = JSON.stringify(currentFile, null, 4);
                    var navFile = childrenEl.createDiv({
                        title: jsonInfo,
                        cls: 'nav-file',
                    });
                    var navFileTitle = navFile.createDiv({ cls: 'nav-file-title' });
                    if (openFile && currentFile.path === openFile.path) {
                        navFileTitle.addClass('is-active');
                    }
                    navFileTitle.createDiv({
                        cls: 'nav-file-title-content',
                        text: currentFile.name,
                    });
                    navFile.onClickEvent(function (event) {
                        return clickElement(currentFile, event.ctrlKey || event.metaKey);
                    });
                });
            }
            else if (String.isString(_this.state.contents)) {
                // Draw the contents as a list
                rootEl.createDiv({
                    title: 'contents',
                    cls: 'python-lab-text',
                    text: _this.state.contents,
                });
            }
            else {
                rootEl.createDiv({
                    title: 'contents',
                    cls: 'python-lab-text',
                    text: JSON.stringify(_this.state, null, 2),
                });
            }
            var contentEl = _this.containerEl.children[1];
            contentEl.empty();
            contentEl.appendChild(rootEl);
        };
        _this.draw();
        return _this;
    }
    LabPanel.prototype.setData = function (state) {
        this.state = state;
    };
    // Used to handle 'file-open'
    LabPanel.prototype.registerOnFileOpen = function (callback) {
        var _this = this;
        var handleOpenFile = function (openedFile) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!openedFile) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, callback()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.registerEvent(this.app.workspace.on('file-open', handleOpenFile));
    };
    /**
     * The menu that appears with right click on the icon
     */
    LabPanel.prototype.onHeaderMenu = function (menu) {
        var _this = this;
        menu
            .addItem(function (item) {
            item
                .setTitle('Clear list')
                .setIcon('sweep')
                .onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.state = null;
                    this.draw();
                    return [2 /*return*/];
                });
            }); });
        })
            .addItem(function (item) {
            item
                .setTitle('Close')
                .setIcon('cross')
                .onClick(function () {
                _this.app.workspace.detachLeavesOfType(_this.commandId);
            });
        });
    };
    LabPanel.prototype.load = function () {
        _super.prototype.load.call(this);
    };
    return LabPanel;
}(LabView));

// This chat widget is based on the 'dual' prototype.
// I found it pretty.
// https://github.com/Psionica/Dual/blob/master/vault-replica/.obsidian/plugins/Dual/view.ts
var ChatView = /** @class */ (function (_super) {
    __extends(ChatView, _super);
    function ChatView(leaf, commandId, command) {
        var _this = _super.call(this, leaf, commandId, command) || this;
        _this.draw();
        return _this;
    }
    ChatView.prototype.registerOnSendMessage = function (callbackWithView) {
        this.onSendMessage = callbackWithView;
    };
    ChatView.prototype.load = function () {
        _super.prototype.load.call(this);
        this.draw();
    };
    // The use input
    ChatView.prototype.getLastInput = function () {
        return 'hello';
    };
    // The service reponse
    ChatView.prototype.setLastResponse = function (data) {
        console.log('Arrived', data);
    };
    ChatView.prototype.sendMessage = function () {
        var _this = this;
        var input = document.getElementById('input');
        var replied = false;
        if (input.value != '') {
            this.drawMessage(input.value, 'right');
            var typingPromise = new Promise(function (resolve) {
                return setTimeout(resolve, 3000);
            }).then(function () {
                if (replied == false) {
                    _this.setStatus('loading...');
                }
            });
            this.lastInput = input.value;
            this.onSendMessage().then(function (response) {
                if (response.contents) {
                    var message = JSON.stringify(response.contents);
                    _this.drawMessage(message, 'left');
                }
                replied = true;
            });
            input.value = '';
        }
    };
    ChatView.prototype.draw = function () {
        var _this = this;
        var container = this.containerEl.children[1];
        var rootEl = document.createElement('div');
        var headerDiv = rootEl.createDiv({ cls: 'nav-header' });
        var footerDiv = rootEl.createDiv({ cls: 'nav-header' });
        var header = headerDiv.createEl('h3');
        header.appendText(_super.prototype.getDisplayText.call(this));
        header.style.textAlign = 'left';
        header.style.marginTop = '0px';
        header.style.marginBottom = '0px';
        header.style.position = 'absolute';
        header.style.top = '15px';
        var status = headerDiv.createEl('h6');
        status.id = 'status';
        if (this.status) {
            status.appendText('online');
        }
        status.style.textAlign = 'left';
        status.style.marginTop = '0px';
        status.style.marginBottom = '5px';
        status.style.color = 'grey';
        var conversationDiv = headerDiv.createDiv({ cls: 'nav-header' });
        conversationDiv.id = 'conversationDiv';
        conversationDiv.style.padding = '0';
        conversationDiv.style.backgroundColor = 'var(--background-secondary-alt)';
        conversationDiv.style.position = 'absolute';
        conversationDiv.style.left = '0';
        conversationDiv.style.width = '100%';
        conversationDiv.style.paddingLeft = '10px';
        conversationDiv.style.paddingRight = '10px';
        conversationDiv.style.overflowY = 'scroll';
        conversationDiv.style.height = 'calc(100% - 110px)';
        var input = footerDiv.createEl('input');
        input.id = 'input';
        input.type = 'text';
        input.style.fontSize = '0.8em';
        input.style.paddingInlineStart = '2%';
        input.style.paddingInlineEnd = '2%';
        input.style.marginTop = '0px';
        input.style.marginBottom = '10px';
        input.style.maxWidth = '68%';
        input.style.minWidth = '68%';
        input.style.position = 'absolute';
        input.style.bottom = '0';
        input.style.left = '5%';
        var button = footerDiv.createEl('button');
        button.appendText('Send');
        button.id = 'send-button';
        button.style.alignItems = 'left';
        button.style.paddingInlineStart = '2%';
        button.style.paddingInlineEnd = '2%';
        button.style.marginTop = '0px';
        button.style.marginBottom = '10px';
        button.style.width = '20%';
        button.style.position = 'absolute';
        button.style.bottom = '0';
        button.style.left = '75%';
        this.registerDomEvent(button, 'click', function () { return _this.sendMessage(); });
        this.registerDomEvent(input, 'keydown', function (event) {
            if (event.key == 'Enter') {
                _this.sendMessage();
            }
        });
        container.empty();
        container.appendChild(rootEl);
    };
    ChatView.prototype.drawMessage = function (content, side) {
        var conversationDiv = (document.getElementById('conversationDiv'));
        var p = conversationDiv.createEl('p');
        p.appendText(content);
        p.style.textAlign = 'left';
        p.style.fontSize = '0.8em';
        p.style.borderRadius = '5px';
        p.style.lineHeight = '18px';
        p.style.padding = '5px';
        if (side == 'right') {
            p.style.backgroundColor = 'var(--background-primary)';
        }
        else {
            p.style.backgroundColor = 'var(--background-secondary)';
        }
        p.style.width = '90%';
        p.style.position = 'relative';
        if (side == 'right') {
            p.style.left = '10%';
        }
        conversationDiv.scrollBy(0, 1000);
    };
    ChatView.prototype.setStatus = function (content) {
        var statusP = document.getElementById('status');
        statusP.setText(content);
    };
    return ChatView;
}(LabView));

var sweepIcon = "\n<svg fill=\"currentColor\" stroke=\"currentColor\" version=\"1.1\" viewBox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path d=\"m495.72 1.582c-7.456-3.691-16.421-0.703-20.142 6.694l-136.92 274.08-26.818-13.433c-22.207-11.118-49.277-2.065-60.396 20.083l-6.713 13.405 160.96 80.616 6.713-13.411c11.087-22.143 2.227-49.18-20.083-60.381l-26.823-13.435 136.92-274.08c3.706-7.412 0.703-16.421-6.694-20.141z\"/>\n  <circle cx=\"173\" cy=\"497\" r=\"15\"/>\n  <circle cx=\"23\" cy=\"407\" r=\"15\"/>\n  <circle cx=\"83\" cy=\"437\" r=\"15\"/>\n  <path d=\"m113 482h-60c-8.276 0-15-6.724-15-15 0-8.291-6.709-15-15-15s-15 6.709-15 15c0 24.814 20.186 45 45 45h60c8.291 0 15-6.709 15-15s-6.709-15-15-15z\"/>\n  <path d=\"m108.64 388.07c-6.563 0.82-11.807 5.845-12.92 12.349-1.113 6.519 2.153 12.993 8.057 15.952l71.675 35.889c12.935 6.475 27.231 9.053 41.177 7.573-1.641 6.65 1.479 13.784 7.852 16.992l67.061 33.589c5.636 2.78 12.169 1.8 16.685-2.197 2.347-2.091 53.436-48.056 83.3-98.718l-161.6-80.94c-36.208 48.109-120.36 59.39-121.28 59.511z\"/>\n</svg>";
// From: https://github.com/mgmeyers/obsidian-icon-swapper
var icons = [
    'lab',
    'sweep',
    'any-key',
    'audio-file',
    'blocks',
    'bold-glyph',
    'bracket-glyph',
    'broken-link',
    'bullet-list-glyph',
    'bullet-list',
    'calendar-with-checkmark',
    'check-in-circle',
    'check-small',
    'checkbox-glyph',
    'checkmark',
    'clock',
    'cloud',
    'code-glyph',
    'create-new',
    'cross-in-box',
    'cross',
    'crossed-star',
    'dice',
    'document',
    'documents',
    'dot-network',
    'double-down-arrow-glyph',
    'double-up-arrow-glyph',
    'down-arrow-with-tail',
    'down-chevron-glyph',
    'enter',
    'exit-fullscreen',
    'expand-vertically',
    'filled-pin',
    'folder',
    'forward-arrow',
    'fullscreen',
    'gear',
    'go-to-file',
    'hashtag',
    'heading-glyph',
    'help',
    'highlight-glyph',
    'horizontal-split',
    'image-file',
    'image-glyph',
    'indent-glyph',
    'info',
    'install',
    'italic-glyph',
    'keyboard-glyph',
    'languages',
    'left-arrow-with-tail',
    'left-arrow',
    'left-chevron-glyph',
    'lines-of-text',
    'link-glyph',
    'link',
    'logo-crystal',
    'magnifying-glass',
    'microphone-filled',
    'microphone',
    'minus-with-circle',
    'note-glyph',
    'number-list-glyph',
    'open-vault',
    'pane-layout',
    'paper-plane',
    'paused',
    'pdf-file',
    'pencil',
    'percent-sign-glyph',
    'pin',
    'plus-with-circle',
    'popup-open',
    'presentation',
    'price-tag-glyph',
    'quote-glyph',
    'redo-glyph',
    'reset',
    'right-arrow-with-tail',
    'right-arrow',
    'right-chevron-glyph',
    'right-triangle',
    'run-command',
    'search',
    'sheets-in-box',
    'stacked-levels',
    'star-list',
    'star',
    'strikethrough-glyph',
    'switch',
    'sync-small',
    'sync',
    'tag-glyph',
    'three-horizontal-bars',
    'trash',
    'undo-glyph',
    'unindent-glyph',
    'up-and-down-arrows',
    'up-arrow-with-tail',
    'up-chevron-glyph',
    'uppercase-lowercase-a',
    'vault',
    'vertical-split',
    'vertical-three-dots',
    'wrench-screwdriver-glyph',
];

var COMMAND_PREFIX = 'obsidian_lab_';
var DEFAULT_ICON = 'gear';
var DEFAULT_SETTINGS = {
    server_url: 'http://localhost:5000',
    debug: 'verbose',
    commands: {
        hello_world: {
            active: true,
            label: 'Hello world',
            type: 'insert-text',
        },
        to_upper_case: {
            active: false,
            label: 'Convert to upper case',
            type: 'replace-text',
        },
        chat: {
            active: false,
            label: 'Simple chat service',
            type: 'command-line',
        },
        random_similarity: {
            active: true,
            label: 'Random score similarity',
            type: 'panel',
            icon: DEFAULT_ICON,
            invokeOnOpen: true,
        },
    },
};
function getServerStatus(serverUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(serverUrl, {
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json',
                        },
                    })
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (data) {
                        var status = {
                            status: 'available',
                            availableCommandUrls: data.scripts ? data.scripts : [],
                        };
                        return status;
                    })
                        .catch(function (error) {
                        return {
                            status: 'unavailable',
                            availableCommandUrls: [],
                            error: error,
                        };
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function commandIdFromName(command_name) {
    return "" + COMMAND_PREFIX + command_name;
}
function getNameFromUrl(currentUrl) {
    return currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
}
function loadCommands(commandUrls, commandSettings) {
    var e_1, _a;
    var result = new Map();
    try {
        for (var commandUrls_1 = __values(commandUrls), commandUrls_1_1 = commandUrls_1.next(); !commandUrls_1_1.done; commandUrls_1_1 = commandUrls_1.next()) {
            var commandURL = commandUrls_1_1.value;
            var commandName = getNameFromUrl(commandURL);
            // If the settings for this command are already stored
            if (commandSettings[commandName]) {
                result.set(commandName, commandSettings[commandName]);
            }
            else {
                // Otherwise use the default one
                result.set(commandName, {
                    label: commandName,
                    type: 'insert-text',
                    active: false,
                    invokeOnOpen: false,
                    icon: 'lab',
                });
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (commandUrls_1_1 && !commandUrls_1_1.done && (_a = commandUrls_1.return)) _a.call(commandUrls_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
var PythonLabPlugin = /** @class */ (function (_super) {
    __extends(PythonLabPlugin, _super);
    function PythonLabPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Init all commands
         */
        _this.initViews = function (commands) {
            return function () {
                var e_2, _a;
                try {
                    // Attach only commands that have a view.
                    for (var commands_1 = __values(commands), commands_1_1 = commands_1.next(); !commands_1_1.done; commands_1_1 = commands_1.next()) {
                        var _b = __read(commands_1_1.value, 2), name_1 = _b[0], command = _b[1];
                        var hasView = command.type == 'panel' || command.type == 'command-line';
                        if (hasView && command.active) {
                            var commandId = commandIdFromName(name_1);
                            _this.showPanel(commandId);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (commands_1_1 && !commands_1_1.done && (_a = commands_1.return)) _a.call(commands_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            };
        };
        return _this;
    }
    PythonLabPlugin.prototype.commandUrlFromName = function (command_name) {
        return this.settings.server_url + "/" + command_name;
    };
    PythonLabPlugin.prototype.getVaultPath = function () {
        if (!(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
            throw new Error('app.vault is not a FileSystemAdapter instance');
        }
        return this.app.vault.adapter.getBasePath();
    };
    PythonLabPlugin.prototype.loadCommandPanes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var serverStatus, availableCommands, availableCommands_1, availableCommands_1_1, _a, name_2, command, init;
            var e_3, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, getServerStatus(this.settings.server_url)];
                    case 2:
                        serverStatus = _c.sent();
                        // Detach panes
                        // Disclaimer: I still cannot figure out how to detach or unregister all leaves produced by this plugin
                        // The intention here is to clean all leaves of created by the lab. @TODO detach properly in the future
                        this.app.workspace.iterateAllLeaves(function (leaf) {
                            if (leaf.getViewState().type.startsWith(COMMAND_PREFIX)) {
                                if (_this.settings.debug == 'verbose') {
                                    console.log('detaching', leaf.getViewState().type);
                                }
                                leaf.detach();
                            }
                        });
                        if (serverStatus.status == 'available') {
                            availableCommands = loadCommands(serverStatus.availableCommandUrls, this.settings.commands);
                            try {
                                for (availableCommands_1 = __values(availableCommands), availableCommands_1_1 = availableCommands_1.next(); !availableCommands_1_1.done; availableCommands_1_1 = availableCommands_1.next()) {
                                    _a = __read(availableCommands_1_1.value, 2), name_2 = _a[0], command = _a[1];
                                    if (command.active) {
                                        this.initCommand(name_2, command);
                                    }
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (availableCommands_1_1 && !availableCommands_1_1.done && (_b = availableCommands_1.return)) _b.call(availableCommands_1);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            init = this.initViews(availableCommands);
                            if (this.app.workspace.layoutReady) {
                                init();
                            }
                            else {
                                this.app.workspace.onLayoutReady(init);
                            }
                        }
                        else {
                            new obsidian.Notice('Lab disconected, Start server');
                            if (this.settings.debug == 'verbose') {
                                console.log(serverStatus);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PythonLabPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('loading python lab plugin');
                obsidian.addIcon('sweep', sweepIcon);
                this.loadCommandPanes();
                this.addSettingTab(new PythonLabSettings(this.app, this));
                return [2 /*return*/];
            });
        });
    };
    PythonLabPlugin.prototype.initCommand = function (name, command) {
        var _this = this;
        var commandId = commandIdFromName(name);
        var commandUrl = this.commandUrlFromName(name);
        if (this.settings.debug == 'verbose') {
            console.log("init [" + name + "] as [" + command.type + "]");
        }
        if (command.type == 'command-line') {
            var viewCreator = function (leaf) {
                var commandLine = new ChatView(leaf, commandId, command);
                var commandLineCallback = function () { return __awaiter(_this, void 0, void 0, function () {
                    var parameters;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parameters = this.getDefaultPostParameters();
                                parameters.data = {
                                    input: commandLine.getLastInput(),
                                };
                                return [4 /*yield*/, this.doPost(commandUrl, parameters)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); };
                commandLine.registerOnSendMessage(commandLineCallback);
                _this.addCommand({
                    id: commandId,
                    name: command.label,
                    callback: function () { return commandLineCallback(); },
                    hotkeys: [],
                });
                return commandLine;
            };
            // I would love to know if this view is already registered, but I don't know how.
            this.registerView(commandId, viewCreator);
        }
        else if (command.type == 'panel') {
            var viewCreator = function (leaf) {
                var panel = new LabPanel(leaf, commandId, command);
                var panelCallback = function () { return __awaiter(_this, void 0, void 0, function () {
                    var parameters, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                parameters = this.getDefaultPostParameters();
                                return [4 /*yield*/, this.doPost(commandUrl, parameters)];
                            case 1:
                                data = _a.sent();
                                data.label = command.label;
                                // Update the state of the view panel
                                panel.setData(data);
                                panel.draw();
                                return [2 /*return*/];
                        }
                    });
                }); };
                _this.addCommand({
                    id: commandId,
                    name: command.label,
                    callback: function () { return panelCallback(); },
                    hotkeys: [],
                });
                if (command.invokeOnOpen) {
                    panel.registerOnFileOpen(panelCallback);
                }
                return panel;
            };
            // I would love to know if this view is already registered, but I don't know how.
            this.registerView(commandId, viewCreator);
        }
        else if (command.type == 'insert-text' ||
            command.type == 'replace-text') {
            var callbackWithoutView_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                var parameters, data, activeView, editor, doc, cursor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parameters = this.getDefaultPostParameters();
                            return [4 /*yield*/, this.doPost(commandUrl, parameters)];
                        case 1:
                            data = _a.sent();
                            activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                            if (command.type == 'replace-text' &&
                                activeView instanceof obsidian.MarkdownView) {
                                // Replaces the current selection
                                // const editor = activeView.sourceMode.cmEditor;
                                if (data.contents) {
                                    editor = activeView.editor;
                                    editor.replaceSelection(data.contents);
                                }
                            }
                            else if (command.type == 'insert-text' &&
                                activeView instanceof obsidian.MarkdownView) {
                                doc = activeView.editor.getDoc();
                                cursor = doc.getCursor();
                                if (data.contents) {
                                    doc.replaceRange(data.contents, cursor);
                                }
                            }
                            else {
                                console.error("Cannot process: ", command);
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            this.addCommand({
                id: commandId,
                name: command.label,
                callback: function () { return callbackWithoutView_1(); },
                hotkeys: [],
            });
        }
    };
    PythonLabPlugin.prototype.doPost = function (command_url, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var requestBody, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestBody = JSON.stringify(parameters);
                        if (this.settings.debug == 'verbose') {
                            console.info('Post:', command_url);
                            console.info('requestBody', requestBody);
                        }
                        return [4 /*yield*/, fetch(command_url, {
                                method: 'POST',
                                body: requestBody,
                                headers: {
                                    'content-type': 'application/json',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (this.settings.debug == 'verbose') {
                            console.info('response data', data);
                        }
                        if (data.errors) {
                            console.error(data);
                            new Notification(data.message);
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    PythonLabPlugin.prototype.getDefaultPostParameters = function () {
        var parameters = {
            vaultPath: this.getVaultPath(),
        };
        var activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (activeView) {
            var editor = activeView.editor;
            var selectedText = editor.getSelection();
            if (selectedText) {
                parameters.text = selectedText;
            }
            if (activeView.file && activeView.file.path) {
                parameters.notePath = activeView.file.path;
            }
        }
        return parameters;
    };
    PythonLabPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, _super.prototype.loadData.call(this)];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    PythonLabPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PythonLabPlugin.prototype.showPanel = function (commandId) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existing = this.app.workspace.getLeavesOfType(commandId);
                        if (existing.length) {
                            this.app.workspace.revealLeaf(existing[0]);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.app.workspace.getRightLeaf(false).setViewState({
                                type: commandId,
                                active: true,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PythonLabPlugin;
}(obsidian.Plugin));
/**
 * Settings
 */
var PythonLabSettings = /** @class */ (function (_super) {
    __extends(PythonLabSettings, _super);
    function PythonLabSettings(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    PythonLabSettings.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian lab settings' });
        containerEl.createEl('h4', { text: 'Restart after making changes' });
        var settings = this.plugin.settings;
        var serverURLSetting = new obsidian.Setting(this.containerEl)
            .setName('Server url')
            .addText(function (text) {
            text.setValue(settings.server_url);
            text.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.plugin.settings.server_url = value;
                    return [2 /*return*/];
                });
            }); });
        })
            .addExtraButton(function (b) {
            b.setIcon('reset')
                .setTooltip('set and refresh')
                .onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.plugin.loadCommandPanes()];
                        case 2:
                            _a.sent();
                            this.display();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        var updateSetting = function (commandId, command) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugin.settings.commands[commandId] = command;
                        if (this.plugin.settings.debug == 'verbose') {
                            console.log('save', command);
                        }
                        return [4 /*yield*/, this.plugin.saveSettings()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        getServerStatus(settings.server_url).then(function (serverStatus) {
            var e_4, _a;
            if (serverStatus.status == 'available') {
                var availableCommands = loadCommands(serverStatus.availableCommandUrls, settings.commands);
                var n = 0;
                try {
                    for (var availableCommands_2 = __values(availableCommands), availableCommands_2_1 = availableCommands_2.next(); !availableCommands_2_1.done; availableCommands_2_1 = availableCommands_2.next()) {
                        var _b = __read(availableCommands_2_1.value, 2), name_3 = _b[0], command = _b[1];
                        addCommandSetting(name_3, command);
                        n++;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (availableCommands_2_1 && !availableCommands_2_1.done && (_a = availableCommands_2.return)) _a.call(availableCommands_2);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                serverURLSetting.setName("Server online [" + n + "]");
            }
            else {
                serverURLSetting
                    .setName('⚠ Cannot reach server')
                    .setDesc('')
                    .setClass('python-lab-error');
                console.log(serverStatus);
            }
            _this.setFooter(containerEl, settings);
        });
        /**
         * Given a command, adds the configuration
         * @param name
         * @param command
         */
        var addCommandSetting = function (name, command) {
            var commandEl = containerEl.createEl('div', {});
            var commandUrl = _this.plugin.commandUrlFromName(name);
            var commandDesc = "" + commandUrl;
            if (command.active) {
                new obsidian.Setting(commandEl)
                    .setName("" + name)
                    .setDesc(commandDesc)
                    // Type
                    .addDropdown(function (dropdown) {
                    dropdown.addOption('insert-text', 'Insert text');
                    dropdown.addOption('replace-text', 'Replace selected text');
                    dropdown.addOption('panel', 'Panel: text or lists');
                    dropdown.addOption('command-line', 'Chat');
                    // dropdown.addOption('graph', 'a graph');
                    dropdown.setValue(String(command.type)).onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command.type = value;
                                    return [4 /*yield*/, updateSetting(name, command)];
                                case 1:
                                    _a.sent();
                                    this.display();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                })
                    // Active or not
                    .addToggle(function (toggle) {
                    toggle.setValue(command.active);
                    toggle.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command.active = value;
                                    return [4 /*yield*/, updateSetting(name, command)];
                                case 1:
                                    _a.sent();
                                    this.display();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                var isWidget = command.type == 'panel' || command.type == 'command-line';
                new obsidian.Setting(commandEl)
                    .setDesc(isWidget ? 'Widget name' : 'Command name')
                    // Name
                    .addText(function (text) {
                    text.setValue(command.label);
                    text.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command.label = value;
                                    return [4 /*yield*/, updateSetting(name, command)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                if (isWidget) {
                    new obsidian.Setting(commandEl)
                        .setDesc('Widget icon')
                        // Icon
                        .addDropdown(function (dropdown) {
                        icons.forEach(function (icon) {
                            dropdown.addOption(icon, icon);
                        });
                        dropdown
                            .setValue(String(command.icon))
                            .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        command.icon = value;
                                        return [4 /*yield*/, updateSetting(name, command)];
                                    case 1:
                                        _a.sent();
                                        this.display();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    })
                        .addExtraButton(function (b) {
                        b.setIcon(command.icon)
                            .setTooltip('Icon shown in the widget tab')
                            .onClick(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); });
                    });
                }
                if (command.type == 'panel') {
                    new obsidian.Setting(commandEl)
                        .setDesc('Additional triggers for panel')
                        .addDropdown(function (dropdown) {
                        dropdown.addOption('false', 'no triggers');
                        dropdown.addOption('true', 'trigers when opening a file');
                        dropdown
                            .setValue(String(command.invokeOnOpen))
                            .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        command.invokeOnOpen = value == 'true';
                                        return [4 /*yield*/, updateSetting(name, command)];
                                    case 1:
                                        _a.sent();
                                        this.display();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                }
            }
            else {
                new obsidian.Setting(commandEl)
                    .setName("" + name)
                    .setDesc(commandDesc)
                    // Active or not
                    .addToggle(function (toggle) {
                    toggle.setValue(command.active);
                    toggle.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    command.active = value;
                                    return [4 /*yield*/, updateSetting(name, command)];
                                case 1:
                                    _a.sent();
                                    this.display();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            }
        };
    };
    PythonLabSettings.prototype.setFooter = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Debug')
            .setDesc('')
            .addDropdown(function (dropdown) {
            dropdown.addOption('off', 'off');
            dropdown.addOption('verbose', 'verbose');
            // dropdown.addOption('graph', 'a graph');
            dropdown.setValue(String(settings.debug)).onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.debug = value;
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            this.display();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        containerEl.createEl('a', {
            text: 'You can find a simple server at github: obsidian-lab-py',
            href: 'https://github.com/cristianvasquez/obsidian-lab-py',
        });
        containerEl.createEl('p', {
            text: 'Pull requests are both welcome and appreciated. :)',
        });
    };
    return PythonLabSettings;
}(obsidian.PluginSettingTab));

module.exports = PythonLabPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy92aWV3cy9sYWJWaWV3LnRzIiwic3JjL3ZpZXdzL3BhbmVsLnRzIiwic3JjL3ZpZXdzL2NoYXRWaWV3LnRzIiwic3JjL2ljb25zLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHtcbiAgSXRlbVZpZXcsXG4gIE1lbnUsXG4gIFdvcmtzcGFjZUxlYWYsXG4gIEZpbGVTeXN0ZW1BZGFwdGVyLFxuICBOb3RpY2UsXG4gIFRGaWxlLFxufSBmcm9tICdvYnNpZGlhbic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGFiVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgcHJvdGVjdGVkIGNvbW1hbmQ6IENvbW1hbmQ7XG4gIHByb3RlY3RlZCBjb21tYW5kSWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmLCBjb21tYW5kSWQ6IHN0cmluZywgY29tbWFuZDogQ29tbWFuZCkge1xuICAgIHN1cGVyKGxlYWYpO1xuICAgIHRoaXMuY29tbWFuZCA9IGNvbW1hbmQ7XG4gICAgdGhpcy5jb21tYW5kSWQgPSBjb21tYW5kSWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb21tYW5kSWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb21tYW5kLmxhYmVsID09IG51bGwgPyB0aGlzLmNvbW1hbmRJZCA6IHRoaXMuY29tbWFuZC5sYWJlbDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWFuZC5pY29uID09IG51bGwgPyAnbGFiJyA6IHRoaXMuY29tbWFuZC5pY29uO1xuICB9XG5cbn0iLCJpbXBvcnQge1xuICBNZW51LFxuICBXb3Jrc3BhY2VMZWFmLFxuICBGaWxlU3lzdGVtQWRhcHRlcixcbiAgTm90aWNlLFxuICBURmlsZSxcbn0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgTGFiVmlldyBmcm9tICcuL2xhYlZpZXcnO1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG4vLyBBIHBhbmVsIHRoYXQgc2hvd3Mgbm90ZXMgb3IgdGV4dC5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhYlBhbmVsIGV4dGVuZHMgTGFiVmlldyB7XG4gIHByaXZhdGUgc3RhdGU6IFBhbmVsU3RhdGU7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgY29tbWFuZElkOiBzdHJpbmcsIGNvbW1hbmQ6IENvbW1hbmQpIHtcbiAgICBzdXBlcihsZWFmLCBjb21tYW5kSWQsIGNvbW1hbmQpO1xuICAgIHRoaXMuZHJhdygpO1xuICB9XG5cbiAgcHVibGljIHNldERhdGEoc3RhdGU6IFBhbmVsU3RhdGUpIHtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gIH1cblxuICAvLyBVc2VkIHRvIGhhbmRsZSAnZmlsZS1vcGVuJ1xuICByZWdpc3Rlck9uRmlsZU9wZW4oY2FsbGJhY2s6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgICBjb25zdCBoYW5kbGVPcGVuRmlsZSA9IGFzeW5jIChvcGVuZWRGaWxlOiBURmlsZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgaWYgKCFvcGVuZWRGaWxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgfTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKCdmaWxlLW9wZW4nLCBoYW5kbGVPcGVuRmlsZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtZW51IHRoYXQgYXBwZWFycyB3aXRoIHJpZ2h0IGNsaWNrIG9uIHRoZSBpY29uXG4gICAqL1xuICBwdWJsaWMgb25IZWFkZXJNZW51KG1lbnU6IE1lbnUpOiB2b2lkIHtcbiAgICBtZW51XG4gICAgICAuYWRkSXRlbSgoaXRlbSkgPT4ge1xuICAgICAgICBpdGVtXG4gICAgICAgICAgLnNldFRpdGxlKCdDbGVhciBsaXN0JylcbiAgICAgICAgICAuc2V0SWNvbignc3dlZXAnKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmFkZEl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgICAgaXRlbVxuICAgICAgICAgIC5zZXRUaXRsZSgnQ2xvc2UnKVxuICAgICAgICAgIC5zZXRJY29uKCdjcm9zcycpXG4gICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZSh0aGlzLmNvbW1hbmRJZCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG9uZm9jdXNIYW5kbGVyOiAob3BlbmVkRmlsZTogVEZpbGUpID0+IFByb21pc2U8dm9pZD47XG5cbiAgcHVibGljIGxvYWQoKTogdm9pZCB7XG4gICAgc3VwZXIubG9hZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBhbmVsXG4gICAqL1xuXG4gIHB1YmxpYyByZWFkb25seSBkcmF3ID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9wZW5GaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCByb290RWwgPSBjcmVhdGVEaXYoeyBjbHM6ICduYXYtZm9sZGVyIG1vZC1yb290JyB9KTtcblxuICAgIHRoaXMuc3RhdGUgPVxuICAgICAgdGhpcy5zdGF0ZSA9PSBudWxsXG4gICAgICAgID8ge1xuICAgICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgICAgY29udGVudHM6ICcnLFxuICAgICAgICAgIH1cbiAgICAgICAgOiB0aGlzLnN0YXRlO1xuXG4gICAgLy8gTGFiZWwgb2YgdGhlIHBhbmVsXG4gICAgY29uc3QgY29udGV4dCA9IHJvb3RFbC5jcmVhdGVEaXYoe1xuICAgICAgdGl0bGU6ICd0aXRsZScsXG4gICAgICBjbHM6ICduYXYtZmlsZSBweXRob24tbGFiLXRpdGxlJyxcbiAgICAgIHRleHQ6IHRoaXMuc3RhdGUubGFiZWwsXG4gICAgfSk7XG5cbiAgICAvLyBGdW5jdGlvbiBvcGVuIG9uIGNsaWNrXG4gICAgbGV0IGNsaWNrRWxlbWVudCA9IChmaWxlOiBJdGVtLCBzaG91bGRTcGxpdCA9IGZhbHNlKTogdm9pZCA9PiB7XG4gICAgICBsZXQgZmlsZVBhdGggPSBmaWxlLnBhdGg7XG5cbiAgICAgIC8vIElmIGl0IGFwcGxpZXMsIHJlbW92ZSB0aGUgdmF1bHQgcGF0aFxuICAgICAgaWYgKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgaW5zdGFuY2VvZiBGaWxlU3lzdGVtQWRhcHRlcikge1xuICAgICAgICBjb25zdCB2YXVsdFBhdGggPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmdldEJhc2VQYXRoKCk7XG4gICAgICAgIGlmIChmaWxlUGF0aC5zdGFydHNXaXRoKHZhdWx0UGF0aCkpIHtcbiAgICAgICAgICBmaWxlUGF0aCA9IHBhdGgucmVsYXRpdmUodmF1bHRQYXRoLCBmaWxlUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFyZ2V0RmlsZSA9IHRoaXMuYXBwLnZhdWx0XG4gICAgICAgIC5nZXRGaWxlcygpXG4gICAgICAgIC5maW5kKChmKSA9PiBmLnBhdGggPT09IGZpbGVQYXRoKTtcblxuICAgICAgaWYgKHRhcmdldEZpbGUpIHtcbiAgICAgICAgbGV0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TW9zdFJlY2VudExlYWYoKTtcbiAgICAgICAgaWYgKHNob3VsZFNwbGl0KSB7XG4gICAgICAgICAgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5jcmVhdGVMZWFmQnlTcGxpdChsZWFmKTtcbiAgICAgICAgfVxuICAgICAgICBsZWFmLm9wZW5GaWxlKHRhcmdldEZpbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3IE5vdGljZShgJyR7ZmlsZS5wYXRofScgbm90IGZvdW5kYCk7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZS5jb250ZW50cykpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLmNvbnRlbnRzID0gdGhpcy5zdGF0ZS5jb250ZW50cy5maWx0ZXIoXG4gICAgICAgICAgICAoZnApID0+IGZwLnBhdGggIT09IGZpbGUucGF0aCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIERyYXcgYSBsaXN0LCB3aGVuIGlzIGEgbGlzdFxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc3RhdGUuY29udGVudHMpKSB7XG4gICAgICB0aGlzLnN0YXRlLmNvbnRlbnRzLmZvckVhY2goKGN1cnJlbnRGaWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuRWwgPSByb290RWwuY3JlYXRlRGl2KHsgY2xzOiAnbmF2LWZvbGRlci1jaGlsZHJlbicgfSk7XG5cbiAgICAgICAgLy8gVGhlIGluZm8gdGhhdCB3aWxsIGFwcGVhciBvbiBob3ZlclxuICAgICAgICBsZXQganNvbkluZm8gPSBKU09OLnN0cmluZ2lmeShjdXJyZW50RmlsZSwgbnVsbCwgNCk7XG5cbiAgICAgICAgY29uc3QgbmF2RmlsZSA9IGNoaWxkcmVuRWwuY3JlYXRlRGl2KHtcbiAgICAgICAgICB0aXRsZToganNvbkluZm8sXG4gICAgICAgICAgY2xzOiAnbmF2LWZpbGUnLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbmF2RmlsZVRpdGxlID0gbmF2RmlsZS5jcmVhdGVEaXYoeyBjbHM6ICduYXYtZmlsZS10aXRsZScgfSk7XG5cbiAgICAgICAgaWYgKG9wZW5GaWxlICYmIGN1cnJlbnRGaWxlLnBhdGggPT09IG9wZW5GaWxlLnBhdGgpIHtcbiAgICAgICAgICBuYXZGaWxlVGl0bGUuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmF2RmlsZVRpdGxlLmNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiAnbmF2LWZpbGUtdGl0bGUtY29udGVudCcsXG4gICAgICAgICAgdGV4dDogY3VycmVudEZpbGUubmFtZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmF2RmlsZS5vbkNsaWNrRXZlbnQoKGV2ZW50KSA9PlxuICAgICAgICAgIGNsaWNrRWxlbWVudChjdXJyZW50RmlsZSwgZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoU3RyaW5nLmlzU3RyaW5nKHRoaXMuc3RhdGUuY29udGVudHMpKSB7XG4gICAgICAvLyBEcmF3IHRoZSBjb250ZW50cyBhcyBhIGxpc3RcbiAgICAgIHJvb3RFbC5jcmVhdGVEaXYoe1xuICAgICAgICB0aXRsZTogJ2NvbnRlbnRzJyxcbiAgICAgICAgY2xzOiAncHl0aG9uLWxhYi10ZXh0JyxcbiAgICAgICAgdGV4dDogdGhpcy5zdGF0ZS5jb250ZW50cyxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290RWwuY3JlYXRlRGl2KHtcbiAgICAgICAgdGl0bGU6ICdjb250ZW50cycsXG4gICAgICAgIGNsczogJ3B5dGhvbi1sYWItdGV4dCcsXG4gICAgICAgIHRleHQ6IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUsIG51bGwsIDIpLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGVudEVsID0gdGhpcy5jb250YWluZXJFbC5jaGlsZHJlblsxXTtcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgICBjb250ZW50RWwuYXBwZW5kQ2hpbGQocm9vdEVsKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IEl0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmLCBOb3RpY2UsIFRleHRBcmVhQ29tcG9uZW50IH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgcnVuSW5UaGlzQ29udGV4dCB9IGZyb20gJ3ZtJztcbmltcG9ydCBMYWJWaWV3IGZyb20gJy4vbGFiVmlldyc7XG5cblxuLy8gVGhpcyBjaGF0IHdpZGdldCBpcyBiYXNlZCBvbiB0aGUgJ2R1YWwnIHByb3RvdHlwZS5cbi8vIEkgZm91bmQgaXQgcHJldHR5LlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL1BzaW9uaWNhL0R1YWwvYmxvYi9tYXN0ZXIvdmF1bHQtcmVwbGljYS8ub2JzaWRpYW4vcGx1Z2lucy9EdWFsL3ZpZXcudHNcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhdFZpZXcgZXh0ZW5kcyBMYWJWaWV3IHtcbiAgcHJpdmF0ZSBvblNlbmRNZXNzYWdlOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBwcml2YXRlIGxhc3RJbnB1dDogc3RyaW5nO1xuICBwcml2YXRlIHN0YXR1czpzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgY29tbWFuZElkOiBzdHJpbmcsIGNvbW1hbmQ6IENvbW1hbmQpIHtcbiAgICBzdXBlcihsZWFmLCBjb21tYW5kSWQsIGNvbW1hbmQpO1xuICAgIHRoaXMuZHJhdygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPblNlbmRNZXNzYWdlKGNhbGxiYWNrV2l0aFZpZXc6ICgpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgICB0aGlzLm9uU2VuZE1lc3NhZ2UgPSBjYWxsYmFja1dpdGhWaWV3O1xuICB9XG5cbiAgbG9hZCgpOiB2b2lkIHtcbiAgICBzdXBlci5sb2FkKCk7XG4gICAgdGhpcy5kcmF3KCk7XG4gIH1cblxuICAvLyBUaGUgdXNlIGlucHV0XG4gIGdldExhc3RJbnB1dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnaGVsbG8nO1xuICB9XG5cbiAgLy8gVGhlIHNlcnZpY2UgcmVwb25zZVxuICBzZXRMYXN0UmVzcG9uc2UoZGF0YTogYW55KSB7XG4gICAgY29uc29sZS5sb2coJ0Fycml2ZWQnLCBkYXRhKTtcbiAgfVxuXG4gIHNlbmRNZXNzYWdlKCk6IHZvaWQge1xuICAgIGxldCBpbnB1dCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dCcpO1xuICAgIGxldCByZXBsaWVkID0gZmFsc2U7XG5cbiAgICBpZiAoaW5wdXQudmFsdWUgIT0gJycpIHtcbiAgICAgIHRoaXMuZHJhd01lc3NhZ2UoaW5wdXQudmFsdWUsICdyaWdodCcpO1xuXG4gICAgICBsZXQgdHlwaW5nUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMDApLFxuICAgICAgKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKHJlcGxpZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXR1cygnbG9hZGluZy4uLicpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5sYXN0SW5wdXQgPSBpbnB1dC52YWx1ZTtcblxuICAgICAgdGhpcy5vblNlbmRNZXNzYWdlKCkudGhlbigocmVzcG9uc2U6IGFueSkgPT4ge1xuXG4gICAgICAgIGlmIChyZXNwb25zZS5jb250ZW50cyl7XG4gICAgICAgICAgbGV0IG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5jb250ZW50cyk7XG4gICAgICAgICAgdGhpcy5kcmF3TWVzc2FnZShtZXNzYWdlLCAnbGVmdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVwbGllZCA9IHRydWU7XG4gICAgICB9KTtcblxuICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZHJhdygpOiB2b2lkIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lckVsLmNoaWxkcmVuWzFdO1xuXG4gICAgY29uc3Qgcm9vdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBjb25zdCBoZWFkZXJEaXYgPSByb290RWwuY3JlYXRlRGl2KHsgY2xzOiAnbmF2LWhlYWRlcicgfSk7XG4gICAgY29uc3QgZm9vdGVyRGl2ID0gcm9vdEVsLmNyZWF0ZURpdih7IGNsczogJ25hdi1oZWFkZXInIH0pO1xuXG4gICAgbGV0IGhlYWRlciA9IGhlYWRlckRpdi5jcmVhdGVFbCgnaDMnKTtcbiAgICBoZWFkZXIuYXBwZW5kVGV4dChzdXBlci5nZXREaXNwbGF5VGV4dCgpKTtcbiAgICBoZWFkZXIuc3R5bGUudGV4dEFsaWduID0gJ2xlZnQnO1xuICAgIGhlYWRlci5zdHlsZS5tYXJnaW5Ub3AgPSAnMHB4JztcbiAgICBoZWFkZXIuc3R5bGUubWFyZ2luQm90dG9tID0gJzBweCc7XG4gICAgaGVhZGVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBoZWFkZXIuc3R5bGUudG9wID0gJzE1cHgnO1xuXG4gICAgbGV0IHN0YXR1cyA9IGhlYWRlckRpdi5jcmVhdGVFbCgnaDYnKTtcbiAgICBzdGF0dXMuaWQgPSAnc3RhdHVzJztcblxuICAgIGlmICh0aGlzLnN0YXR1cyl7XG4gICAgICBzdGF0dXMuYXBwZW5kVGV4dCgnb25saW5lJyk7XG4gICAgfVxuXG4gICAgc3RhdHVzLnN0eWxlLnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICBzdGF0dXMuc3R5bGUubWFyZ2luVG9wID0gJzBweCc7XG4gICAgc3RhdHVzLnN0eWxlLm1hcmdpbkJvdHRvbSA9ICc1cHgnO1xuICAgIHN0YXR1cy5zdHlsZS5jb2xvciA9ICdncmV5JztcblxuICAgIGxldCBjb252ZXJzYXRpb25EaXYgPSBoZWFkZXJEaXYuY3JlYXRlRGl2KHsgY2xzOiAnbmF2LWhlYWRlcicgfSk7XG4gICAgY29udmVyc2F0aW9uRGl2LmlkID0gJ2NvbnZlcnNhdGlvbkRpdic7XG4gICAgY29udmVyc2F0aW9uRGl2LnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgY29udmVyc2F0aW9uRGl2LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd2YXIoLS1iYWNrZ3JvdW5kLXNlY29uZGFyeS1hbHQpJztcbiAgICBjb252ZXJzYXRpb25EaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGNvbnZlcnNhdGlvbkRpdi5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgIGNvbnZlcnNhdGlvbkRpdi5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBjb252ZXJzYXRpb25EaXYuc3R5bGUucGFkZGluZ0xlZnQgPSAnMTBweCc7XG4gICAgY29udmVyc2F0aW9uRGl2LnN0eWxlLnBhZGRpbmdSaWdodCA9ICcxMHB4JztcbiAgICBjb252ZXJzYXRpb25EaXYuc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XG4gICAgY29udmVyc2F0aW9uRGl2LnN0eWxlLmhlaWdodCA9ICdjYWxjKDEwMCUgLSAxMTBweCknO1xuXG4gICAgbGV0IGlucHV0ID0gZm9vdGVyRGl2LmNyZWF0ZUVsKCdpbnB1dCcpO1xuICAgIGlucHV0LmlkID0gJ2lucHV0JztcbiAgICBpbnB1dC50eXBlID0gJ3RleHQnO1xuICAgIGlucHV0LnN0eWxlLmZvbnRTaXplID0gJzAuOGVtJztcbiAgICBpbnB1dC5zdHlsZS5wYWRkaW5nSW5saW5lU3RhcnQgPSAnMiUnO1xuICAgIGlucHV0LnN0eWxlLnBhZGRpbmdJbmxpbmVFbmQgPSAnMiUnO1xuICAgIGlucHV0LnN0eWxlLm1hcmdpblRvcCA9ICcwcHgnO1xuICAgIGlucHV0LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICcxMHB4JztcbiAgICBpbnB1dC5zdHlsZS5tYXhXaWR0aCA9ICc2OCUnO1xuICAgIGlucHV0LnN0eWxlLm1pbldpZHRoID0gJzY4JSc7XG4gICAgaW5wdXQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGlucHV0LnN0eWxlLmJvdHRvbSA9ICcwJztcbiAgICBpbnB1dC5zdHlsZS5sZWZ0ID0gJzUlJztcblxuICAgIGxldCBidXR0b24gPSBmb290ZXJEaXYuY3JlYXRlRWwoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi5hcHBlbmRUZXh0KCdTZW5kJyk7XG4gICAgYnV0dG9uLmlkID0gJ3NlbmQtYnV0dG9uJztcbiAgICBidXR0b24uc3R5bGUuYWxpZ25JdGVtcyA9ICdsZWZ0JztcbiAgICBidXR0b24uc3R5bGUucGFkZGluZ0lubGluZVN0YXJ0ID0gJzIlJztcbiAgICBidXR0b24uc3R5bGUucGFkZGluZ0lubGluZUVuZCA9ICcyJSc7XG4gICAgYnV0dG9uLnN0eWxlLm1hcmdpblRvcCA9ICcwcHgnO1xuICAgIGJ1dHRvbi5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMTBweCc7XG4gICAgYnV0dG9uLnN0eWxlLndpZHRoID0gJzIwJSc7XG4gICAgYnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBidXR0b24uc3R5bGUuYm90dG9tID0gJzAnO1xuICAgIGJ1dHRvbi5zdHlsZS5sZWZ0ID0gJzc1JSc7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoYnV0dG9uLCAnY2xpY2snLCAoKSA9PiB0aGlzLnNlbmRNZXNzYWdlKCkpO1xuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChpbnB1dCwgJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT0gJ0VudGVyJykge1xuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIuZW1wdHkoKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocm9vdEVsKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd01lc3NhZ2UoY29udGVudDogc3RyaW5nLCBzaWRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgY29udmVyc2F0aW9uRGl2ID0gPEhUTUxEaXZFbGVtZW50PihcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb252ZXJzYXRpb25EaXYnKVxuICAgICk7XG4gICAgbGV0IHAgPSBjb252ZXJzYXRpb25EaXYuY3JlYXRlRWwoJ3AnKTtcbiAgICBwLmFwcGVuZFRleHQoY29udGVudCk7XG4gICAgcC5zdHlsZS50ZXh0QWxpZ24gPSAnbGVmdCc7XG4gICAgcC5zdHlsZS5mb250U2l6ZSA9ICcwLjhlbSc7XG4gICAgcC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcbiAgICBwLnN0eWxlLmxpbmVIZWlnaHQgPSAnMThweCc7XG4gICAgcC5zdHlsZS5wYWRkaW5nID0gJzVweCc7XG5cbiAgICBpZiAoc2lkZSA9PSAncmlnaHQnKSB7XG4gICAgICBwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd2YXIoLS1iYWNrZ3JvdW5kLXByaW1hcnkpJztcbiAgICB9IGVsc2Uge1xuICAgICAgcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAndmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpJztcbiAgICB9XG5cbiAgICBwLnN0eWxlLndpZHRoID0gJzkwJSc7XG4gICAgcC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cbiAgICBpZiAoc2lkZSA9PSAncmlnaHQnKSB7XG4gICAgICBwLnN0eWxlLmxlZnQgPSAnMTAlJztcbiAgICB9XG5cbiAgICBjb252ZXJzYXRpb25EaXYuc2Nyb2xsQnkoMCwgMTAwMCk7XG4gIH1cblxuICBwcml2YXRlIHNldFN0YXR1cyhjb250ZW50OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgc3RhdHVzUCA9IDxIVE1MUGFyYWdyYXBoRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJyk7XG4gICAgc3RhdHVzUC5zZXRUZXh0KGNvbnRlbnQpO1xuICB9XG59XG4iLCJjb25zdCBzd2VlcEljb24gPSBgXG48c3ZnIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICA8cGF0aCBkPVwibTQ5NS43MiAxLjU4MmMtNy40NTYtMy42OTEtMTYuNDIxLTAuNzAzLTIwLjE0MiA2LjY5NGwtMTM2LjkyIDI3NC4wOC0yNi44MTgtMTMuNDMzYy0yMi4yMDctMTEuMTE4LTQ5LjI3Ny0yLjA2NS02MC4zOTYgMjAuMDgzbC02LjcxMyAxMy40MDUgMTYwLjk2IDgwLjYxNiA2LjcxMy0xMy40MTFjMTEuMDg3LTIyLjE0MyAyLjIyNy00OS4xOC0yMC4wODMtNjAuMzgxbC0yNi44MjMtMTMuNDM1IDEzNi45Mi0yNzQuMDhjMy43MDYtNy40MTIgMC43MDMtMTYuNDIxLTYuNjk0LTIwLjE0MXpcIi8+XG4gIDxjaXJjbGUgY3g9XCIxNzNcIiBjeT1cIjQ5N1wiIHI9XCIxNVwiLz5cbiAgPGNpcmNsZSBjeD1cIjIzXCIgY3k9XCI0MDdcIiByPVwiMTVcIi8+XG4gIDxjaXJjbGUgY3g9XCI4M1wiIGN5PVwiNDM3XCIgcj1cIjE1XCIvPlxuICA8cGF0aCBkPVwibTExMyA0ODJoLTYwYy04LjI3NiAwLTE1LTYuNzI0LTE1LTE1IDAtOC4yOTEtNi43MDktMTUtMTUtMTVzLTE1IDYuNzA5LTE1IDE1YzAgMjQuODE0IDIwLjE4NiA0NSA0NSA0NWg2MGM4LjI5MSAwIDE1LTYuNzA5IDE1LTE1cy02LjcwOS0xNS0xNS0xNXpcIi8+XG4gIDxwYXRoIGQ9XCJtMTA4LjY0IDM4OC4wN2MtNi41NjMgMC44Mi0xMS44MDcgNS44NDUtMTIuOTIgMTIuMzQ5LTEuMTEzIDYuNTE5IDIuMTUzIDEyLjk5MyA4LjA1NyAxNS45NTJsNzEuNjc1IDM1Ljg4OWMxMi45MzUgNi40NzUgMjcuMjMxIDkuMDUzIDQxLjE3NyA3LjU3My0xLjY0MSA2LjY1IDEuNDc5IDEzLjc4NCA3Ljg1MiAxNi45OTJsNjcuMDYxIDMzLjU4OWM1LjYzNiAyLjc4IDEyLjE2OSAxLjggMTYuNjg1LTIuMTk3IDIuMzQ3LTIuMDkxIDUzLjQzNi00OC4wNTYgODMuMy05OC43MThsLTE2MS42LTgwLjk0Yy0zNi4yMDggNDguMTA5LTEyMC4zNiA1OS4zOS0xMjEuMjggNTkuNTExelwiLz5cbjwvc3ZnPmA7XG5cbi8vIEZyb206IGh0dHBzOi8vZ2l0aHViLmNvbS9tZ21leWVycy9vYnNpZGlhbi1pY29uLXN3YXBwZXJcbmNvbnN0IGljb25zOiBzdHJpbmdbXSA9IFtcbiAgJ2xhYicsXG4gICdzd2VlcCcsXG4gICdhbnkta2V5JyxcbiAgJ2F1ZGlvLWZpbGUnLFxuICAnYmxvY2tzJyxcbiAgJ2JvbGQtZ2x5cGgnLFxuICAnYnJhY2tldC1nbHlwaCcsXG4gICdicm9rZW4tbGluaycsXG4gICdidWxsZXQtbGlzdC1nbHlwaCcsXG4gICdidWxsZXQtbGlzdCcsXG4gICdjYWxlbmRhci13aXRoLWNoZWNrbWFyaycsXG4gICdjaGVjay1pbi1jaXJjbGUnLFxuICAnY2hlY2stc21hbGwnLFxuICAnY2hlY2tib3gtZ2x5cGgnLFxuICAnY2hlY2ttYXJrJyxcbiAgJ2Nsb2NrJyxcbiAgJ2Nsb3VkJyxcbiAgJ2NvZGUtZ2x5cGgnLFxuICAnY3JlYXRlLW5ldycsXG4gICdjcm9zcy1pbi1ib3gnLFxuICAnY3Jvc3MnLFxuICAnY3Jvc3NlZC1zdGFyJyxcbiAgJ2RpY2UnLFxuICAnZG9jdW1lbnQnLFxuICAnZG9jdW1lbnRzJyxcbiAgJ2RvdC1uZXR3b3JrJyxcbiAgJ2RvdWJsZS1kb3duLWFycm93LWdseXBoJyxcbiAgJ2RvdWJsZS11cC1hcnJvdy1nbHlwaCcsXG4gICdkb3duLWFycm93LXdpdGgtdGFpbCcsXG4gICdkb3duLWNoZXZyb24tZ2x5cGgnLFxuICAnZW50ZXInLFxuICAnZXhpdC1mdWxsc2NyZWVuJyxcbiAgJ2V4cGFuZC12ZXJ0aWNhbGx5JyxcbiAgJ2ZpbGxlZC1waW4nLFxuICAnZm9sZGVyJyxcbiAgJ2ZvcndhcmQtYXJyb3cnLFxuICAnZnVsbHNjcmVlbicsXG4gICdnZWFyJyxcbiAgJ2dvLXRvLWZpbGUnLFxuICAnaGFzaHRhZycsXG4gICdoZWFkaW5nLWdseXBoJyxcbiAgJ2hlbHAnLFxuICAnaGlnaGxpZ2h0LWdseXBoJyxcbiAgJ2hvcml6b250YWwtc3BsaXQnLFxuICAnaW1hZ2UtZmlsZScsXG4gICdpbWFnZS1nbHlwaCcsXG4gICdpbmRlbnQtZ2x5cGgnLFxuICAnaW5mbycsXG4gICdpbnN0YWxsJyxcbiAgJ2l0YWxpYy1nbHlwaCcsXG4gICdrZXlib2FyZC1nbHlwaCcsXG4gICdsYW5ndWFnZXMnLFxuICAnbGVmdC1hcnJvdy13aXRoLXRhaWwnLFxuICAnbGVmdC1hcnJvdycsXG4gICdsZWZ0LWNoZXZyb24tZ2x5cGgnLFxuICAnbGluZXMtb2YtdGV4dCcsXG4gICdsaW5rLWdseXBoJyxcbiAgJ2xpbmsnLFxuICAnbG9nby1jcnlzdGFsJyxcbiAgJ21hZ25pZnlpbmctZ2xhc3MnLFxuICAnbWljcm9waG9uZS1maWxsZWQnLFxuICAnbWljcm9waG9uZScsXG4gICdtaW51cy13aXRoLWNpcmNsZScsXG4gICdub3RlLWdseXBoJyxcbiAgJ251bWJlci1saXN0LWdseXBoJyxcbiAgJ29wZW4tdmF1bHQnLFxuICAncGFuZS1sYXlvdXQnLFxuICAncGFwZXItcGxhbmUnLFxuICAncGF1c2VkJyxcbiAgJ3BkZi1maWxlJyxcbiAgJ3BlbmNpbCcsXG4gICdwZXJjZW50LXNpZ24tZ2x5cGgnLFxuICAncGluJyxcbiAgJ3BsdXMtd2l0aC1jaXJjbGUnLFxuICAncG9wdXAtb3BlbicsXG4gICdwcmVzZW50YXRpb24nLFxuICAncHJpY2UtdGFnLWdseXBoJyxcbiAgJ3F1b3RlLWdseXBoJyxcbiAgJ3JlZG8tZ2x5cGgnLFxuICAncmVzZXQnLFxuICAncmlnaHQtYXJyb3ctd2l0aC10YWlsJyxcbiAgJ3JpZ2h0LWFycm93JyxcbiAgJ3JpZ2h0LWNoZXZyb24tZ2x5cGgnLFxuICAncmlnaHQtdHJpYW5nbGUnLFxuICAncnVuLWNvbW1hbmQnLFxuICAnc2VhcmNoJyxcbiAgJ3NoZWV0cy1pbi1ib3gnLFxuICAnc3RhY2tlZC1sZXZlbHMnLFxuICAnc3Rhci1saXN0JyxcbiAgJ3N0YXInLFxuICAnc3RyaWtldGhyb3VnaC1nbHlwaCcsXG4gICdzd2l0Y2gnLFxuICAnc3luYy1zbWFsbCcsXG4gICdzeW5jJyxcbiAgJ3RhZy1nbHlwaCcsXG4gICd0aHJlZS1ob3Jpem9udGFsLWJhcnMnLFxuICAndHJhc2gnLFxuICAndW5kby1nbHlwaCcsXG4gICd1bmluZGVudC1nbHlwaCcsXG4gICd1cC1hbmQtZG93bi1hcnJvd3MnLFxuICAndXAtYXJyb3ctd2l0aC10YWlsJyxcbiAgJ3VwLWNoZXZyb24tZ2x5cGgnLFxuICAndXBwZXJjYXNlLWxvd2VyY2FzZS1hJyxcbiAgJ3ZhdWx0JyxcbiAgJ3ZlcnRpY2FsLXNwbGl0JyxcbiAgJ3ZlcnRpY2FsLXRocmVlLWRvdHMnLFxuICAnd3JlbmNoLXNjcmV3ZHJpdmVyLWdseXBoJyxcbl07XG5cbmV4cG9ydCB7IGljb25zLCBzd2VlcEljb24gfTtcbiIsImltcG9ydCB7XG4gIGFkZEljb24sXG4gIEFwcCxcbiAgRmlsZVN5c3RlbUFkYXB0ZXIsXG4gIE1hcmtkb3duVmlldyxcbiAgTm90aWNlLFxuICBQbHVnaW4sXG4gIFBsdWdpblNldHRpbmdUYWIsXG4gIFNldHRpbmcsXG4gIFdvcmtzcGFjZUxlYWYsXG4gIFZpZXdDcmVhdG9yLFxufSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgTGFiUGFuZWwgZnJvbSAnLi92aWV3cy9wYW5lbCc7XG5pbXBvcnQgQ2hhdFZpZXcgZnJvbSAnLi92aWV3cy9jaGF0Vmlldyc7XG5pbXBvcnQgeyBpY29ucywgc3dlZXBJY29uIH0gZnJvbSAnLi9pY29ucyc7XG5jb25zdCBDT01NQU5EX1BSRUZJWCA9ICdvYnNpZGlhbl9sYWJfJztcblxuY29uc3QgREVGQVVMVF9JQ09OID0gJ2dlYXInO1xuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBTZXR0aW5ncyA9IHtcbiAgc2VydmVyX3VybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsXG4gIGRlYnVnOiAndmVyYm9zZScsXG4gIGNvbW1hbmRzOiB7XG4gICAgaGVsbG9fd29ybGQ6IHtcbiAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgIGxhYmVsOiAnSGVsbG8gd29ybGQnLFxuICAgICAgdHlwZTogJ2luc2VydC10ZXh0JyxcbiAgICB9LFxuXG4gICAgdG9fdXBwZXJfY2FzZToge1xuICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgIGxhYmVsOiAnQ29udmVydCB0byB1cHBlciBjYXNlJyxcbiAgICAgIHR5cGU6ICdyZXBsYWNlLXRleHQnLFxuICAgIH0sXG5cbiAgICBjaGF0OiB7XG4gICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgbGFiZWw6ICdTaW1wbGUgY2hhdCBzZXJ2aWNlJyxcbiAgICAgIHR5cGU6ICdjb21tYW5kLWxpbmUnLFxuICAgIH0sXG5cbiAgICByYW5kb21fc2ltaWxhcml0eToge1xuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgbGFiZWw6ICdSYW5kb20gc2NvcmUgc2ltaWxhcml0eScsXG4gICAgICB0eXBlOiAncGFuZWwnLFxuICAgICAgaWNvbjogREVGQVVMVF9JQ09OLFxuICAgICAgaW52b2tlT25PcGVuOiB0cnVlLFxuICAgIH0sXG4gIH0sXG59O1xuXG5hc3luYyBmdW5jdGlvbiBnZXRTZXJ2ZXJTdGF0dXMoc2VydmVyVXJsOiBzdHJpbmcpIHtcbiAgY29uc3QgcmVzdWx0OiBTZXJ2ZXJTdGF0dXMgPSBhd2FpdCBmZXRjaChzZXJ2ZXJVcmwsIHtcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgfSxcbiAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgY29uc3Qgc3RhdHVzOiBTZXJ2ZXJTdGF0dXMgPSB7XG4gICAgICAgIHN0YXR1czogJ2F2YWlsYWJsZScsXG4gICAgICAgIGF2YWlsYWJsZUNvbW1hbmRVcmxzOiBkYXRhLnNjcmlwdHMgPyBkYXRhLnNjcmlwdHMgOiBbXSxcbiAgICAgIH07XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzOiAndW5hdmFpbGFibGUnLFxuICAgICAgICBhdmFpbGFibGVDb21tYW5kVXJsczogW10sXG4gICAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgIH07XG4gICAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGNvbW1hbmRJZEZyb21OYW1lKGNvbW1hbmRfbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke0NPTU1BTkRfUFJFRklYfSR7Y29tbWFuZF9uYW1lfWA7XG59XG5cbmZ1bmN0aW9uIGdldE5hbWVGcm9tVXJsKGN1cnJlbnRVcmw6IGFueSkge1xuICByZXR1cm4gY3VycmVudFVybC5zdWJzdHJpbmcoY3VycmVudFVybC5sYXN0SW5kZXhPZignLycpICsgMSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRDb21tYW5kcyhcbiAgY29tbWFuZFVybHM6IHN0cmluZ1tdLFxuICBjb21tYW5kU2V0dGluZ3M6IFJlY29yZDxzdHJpbmcsIENvbW1hbmQ+LFxuKSB7XG4gIGxldCByZXN1bHQ6IE1hcDxzdHJpbmcsIENvbW1hbmQ+ID0gbmV3IE1hcCgpO1xuICBmb3IgKGNvbnN0IGNvbW1hbmRVUkwgb2YgY29tbWFuZFVybHMpIHtcbiAgICBsZXQgY29tbWFuZE5hbWUgPSBnZXROYW1lRnJvbVVybChjb21tYW5kVVJMKTtcblxuICAgIC8vIElmIHRoZSBzZXR0aW5ncyBmb3IgdGhpcyBjb21tYW5kIGFyZSBhbHJlYWR5IHN0b3JlZFxuICAgIGlmIChjb21tYW5kU2V0dGluZ3NbY29tbWFuZE5hbWVdKSB7XG4gICAgICByZXN1bHQuc2V0KGNvbW1hbmROYW1lLCBjb21tYW5kU2V0dGluZ3NbY29tbWFuZE5hbWVdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlIHVzZSB0aGUgZGVmYXVsdCBvbmVcbiAgICAgIHJlc3VsdC5zZXQoY29tbWFuZE5hbWUsIHtcbiAgICAgICAgbGFiZWw6IGNvbW1hbmROYW1lLFxuICAgICAgICB0eXBlOiAnaW5zZXJ0LXRleHQnLFxuICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICBpbnZva2VPbk9wZW46IGZhbHNlLFxuICAgICAgICBpY29uOiAnbGFiJyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQeXRob25MYWJQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBwdWJsaWMgc2V0dGluZ3M6IFNldHRpbmdzO1xuXG4gIHB1YmxpYyBjb21tYW5kVXJsRnJvbU5hbWUoY29tbWFuZF9uYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLnNldHRpbmdzLnNlcnZlcl91cmx9LyR7Y29tbWFuZF9uYW1lfWA7XG4gIH1cblxuICBwdWJsaWMgZ2V0VmF1bHRQYXRoKCk6IHN0cmluZyB7XG4gICAgaWYgKCEodGhpcy5hcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhcHAudmF1bHQgaXMgbm90IGEgRmlsZVN5c3RlbUFkYXB0ZXIgaW5zdGFuY2UnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBsb2FkQ29tbWFuZFBhbmVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgY29uc3Qgc2VydmVyU3RhdHVzID0gYXdhaXQgZ2V0U2VydmVyU3RhdHVzKHRoaXMuc2V0dGluZ3Muc2VydmVyX3VybCk7XG5cbiAgICAvLyBEZXRhY2ggcGFuZXNcbiAgICAvLyBEaXNjbGFpbWVyOiBJIHN0aWxsIGNhbm5vdCBmaWd1cmUgb3V0IGhvdyB0byBkZXRhY2ggb3IgdW5yZWdpc3RlciBhbGwgbGVhdmVzIHByb2R1Y2VkIGJ5IHRoaXMgcGx1Z2luXG4gICAgLy8gVGhlIGludGVudGlvbiBoZXJlIGlzIHRvIGNsZWFuIGFsbCBsZWF2ZXMgb2YgY3JlYXRlZCBieSB0aGUgbGFiLiBAVE9ETyBkZXRhY2ggcHJvcGVybHkgaW4gdGhlIGZ1dHVyZVxuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlQWxsTGVhdmVzKChsZWFmOiBXb3Jrc3BhY2VMZWFmKSA9PiB7XG4gICAgICBpZiAobGVhZi5nZXRWaWV3U3RhdGUoKS50eXBlLnN0YXJ0c1dpdGgoQ09NTUFORF9QUkVGSVgpKSB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRlYnVnID09ICd2ZXJib3NlJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXRhY2hpbmcnLCBsZWFmLmdldFZpZXdTdGF0ZSgpLnR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGxlYWYuZGV0YWNoKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoc2VydmVyU3RhdHVzLnN0YXR1cyA9PSAnYXZhaWxhYmxlJykge1xuICAgICAgY29uc3QgYXZhaWxhYmxlQ29tbWFuZHM6IE1hcDxzdHJpbmcsIENvbW1hbmQ+ID0gbG9hZENvbW1hbmRzKFxuICAgICAgICBzZXJ2ZXJTdGF0dXMuYXZhaWxhYmxlQ29tbWFuZFVybHMsXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY29tbWFuZHMsXG4gICAgICApO1xuICAgICAgZm9yIChsZXQgW25hbWUsIGNvbW1hbmRdIG9mIGF2YWlsYWJsZUNvbW1hbmRzKSB7XG4gICAgICAgIGlmIChjb21tYW5kLmFjdGl2ZSkge1xuICAgICAgICAgIHRoaXMuaW5pdENvbW1hbmQobmFtZSwgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IGluaXQ6ICgpID0+IGFueSA9IHRoaXMuaW5pdFZpZXdzKGF2YWlsYWJsZUNvbW1hbmRzKTtcbiAgICAgIGlmICh0aGlzLmFwcC53b3Jrc3BhY2UubGF5b3V0UmVhZHkpIHtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoaW5pdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ldyBOb3RpY2UoJ0xhYiBkaXNjb25lY3RlZCwgU3RhcnQgc2VydmVyJyk7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWJ1ZyA9PSAndmVyYm9zZScpIHtcbiAgICAgICAgY29uc29sZS5sb2coc2VydmVyU3RhdHVzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nIHB5dGhvbiBsYWIgcGx1Z2luJyk7XG5cbiAgICBhZGRJY29uKCdzd2VlcCcsIHN3ZWVwSWNvbik7XG4gICAgdGhpcy5sb2FkQ29tbWFuZFBhbmVzKCk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBQeXRob25MYWJTZXR0aW5ncyh0aGlzLmFwcCwgdGhpcykpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0Q29tbWFuZChuYW1lOiBzdHJpbmcsIGNvbW1hbmQ6IENvbW1hbmQpIHtcbiAgICBsZXQgY29tbWFuZElkOiBzdHJpbmcgPSBjb21tYW5kSWRGcm9tTmFtZShuYW1lKTtcbiAgICBsZXQgY29tbWFuZFVybCA9IHRoaXMuY29tbWFuZFVybEZyb21OYW1lKG5hbWUpO1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVidWcgPT0gJ3ZlcmJvc2UnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgaW5pdCBbJHtuYW1lfV0gYXMgWyR7Y29tbWFuZC50eXBlfV1gKTtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZC50eXBlID09ICdjb21tYW5kLWxpbmUnKSB7XG4gICAgICBsZXQgdmlld0NyZWF0b3I6IFZpZXdDcmVhdG9yID0gKGxlYWY6IFdvcmtzcGFjZUxlYWYpID0+IHtcbiAgICAgICAgbGV0IGNvbW1hbmRMaW5lID0gbmV3IENoYXRWaWV3KGxlYWYsIGNvbW1hbmRJZCwgY29tbWFuZCk7XG5cbiAgICAgICAgY29uc3QgY29tbWFuZExpbmVDYWxsYmFjayA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVycyA9IHRoaXMuZ2V0RGVmYXVsdFBvc3RQYXJhbWV0ZXJzKCk7XG4gICAgICAgICAgcGFyYW1ldGVycy5kYXRhID0ge1xuICAgICAgICAgICAgaW5wdXQ6IGNvbW1hbmRMaW5lLmdldExhc3RJbnB1dCgpLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZG9Qb3N0KGNvbW1hbmRVcmwsIHBhcmFtZXRlcnMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbW1hbmRMaW5lLnJlZ2lzdGVyT25TZW5kTWVzc2FnZShjb21tYW5kTGluZUNhbGxiYWNrKTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgIGlkOiBjb21tYW5kSWQsXG4gICAgICAgICAgbmFtZTogY29tbWFuZC5sYWJlbCxcbiAgICAgICAgICBjYWxsYmFjazogKCkgPT4gY29tbWFuZExpbmVDYWxsYmFjaygpLFxuICAgICAgICAgIGhvdGtleXM6IFtdLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29tbWFuZExpbmU7XG4gICAgICB9O1xuXG4gICAgICAvLyBJIHdvdWxkIGxvdmUgdG8ga25vdyBpZiB0aGlzIHZpZXcgaXMgYWxyZWFkeSByZWdpc3RlcmVkLCBidXQgSSBkb24ndCBrbm93IGhvdy5cbiAgICAgIHRoaXMucmVnaXN0ZXJWaWV3KGNvbW1hbmRJZCwgdmlld0NyZWF0b3IpO1xuICAgIH0gZWxzZSBpZiAoY29tbWFuZC50eXBlID09ICdwYW5lbCcpIHtcbiAgICAgIGxldCB2aWV3Q3JlYXRvcjogVmlld0NyZWF0b3IgPSAobGVhZjogV29ya3NwYWNlTGVhZikgPT4ge1xuICAgICAgICBsZXQgcGFuZWwgPSBuZXcgTGFiUGFuZWwobGVhZiwgY29tbWFuZElkLCBjb21tYW5kKTtcblxuICAgICAgICBjb25zdCBwYW5lbENhbGxiYWNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGxldCBwYXJhbWV0ZXJzID0gdGhpcy5nZXREZWZhdWx0UG9zdFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5kb1Bvc3QoY29tbWFuZFVybCwgcGFyYW1ldGVycyk7XG4gICAgICAgICAgZGF0YS5sYWJlbCA9IGNvbW1hbmQubGFiZWw7XG5cbiAgICAgICAgICAvLyBVcGRhdGUgdGhlIHN0YXRlIG9mIHRoZSB2aWV3IHBhbmVsXG4gICAgICAgICAgcGFuZWwuc2V0RGF0YShkYXRhKTtcbiAgICAgICAgICBwYW5lbC5kcmF3KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICBpZDogY29tbWFuZElkLFxuICAgICAgICAgIG5hbWU6IGNvbW1hbmQubGFiZWwsXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHBhbmVsQ2FsbGJhY2soKSxcbiAgICAgICAgICBob3RrZXlzOiBbXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNvbW1hbmQuaW52b2tlT25PcGVuKSB7XG4gICAgICAgICAgcGFuZWwucmVnaXN0ZXJPbkZpbGVPcGVuKHBhbmVsQ2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhbmVsO1xuICAgICAgfTtcbiAgICAgIC8vIEkgd291bGQgbG92ZSB0byBrbm93IGlmIHRoaXMgdmlldyBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQsIGJ1dCBJIGRvbid0IGtub3cgaG93LlxuICAgICAgdGhpcy5yZWdpc3RlclZpZXcoY29tbWFuZElkLCB2aWV3Q3JlYXRvcik7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNvbW1hbmQudHlwZSA9PSAnaW5zZXJ0LXRleHQnIHx8XG4gICAgICBjb21tYW5kLnR5cGUgPT0gJ3JlcGxhY2UtdGV4dCdcbiAgICApIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrV2l0aG91dFZpZXcgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxldCBwYXJhbWV0ZXJzID0gdGhpcy5nZXREZWZhdWx0UG9zdFBhcmFtZXRlcnMoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuZG9Qb3N0KGNvbW1hbmRVcmwsIHBhcmFtZXRlcnMpO1xuICAgICAgICBjb25zdCBhY3RpdmVWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNvbW1hbmQudHlwZSA9PSAncmVwbGFjZS10ZXh0JyAmJlxuICAgICAgICAgIGFjdGl2ZVZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXdcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gUmVwbGFjZXMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICAgICAgLy8gY29uc3QgZWRpdG9yID0gYWN0aXZlVmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xuICAgICAgICAgIGlmIChkYXRhLmNvbnRlbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBlZGl0b3IgPSBhY3RpdmVWaWV3LmVkaXRvcjtcbiAgICAgICAgICAgIGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGRhdGEuY29udGVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjb21tYW5kLnR5cGUgPT0gJ2luc2VydC10ZXh0JyAmJlxuICAgICAgICAgIGFjdGl2ZVZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXdcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gSW5zZXJ0IGNvbnRlbnQgaW4gdGhlIGN1cnNvciBwb3NpdGlvblxuICAgICAgICAgIGxldCBkb2MgPSBhY3RpdmVWaWV3LmVkaXRvci5nZXREb2MoKTtcbiAgICAgICAgICBsZXQgY3Vyc29yID0gZG9jLmdldEN1cnNvcigpO1xuICAgICAgICAgIGlmIChkYXRhLmNvbnRlbnRzKSB7XG4gICAgICAgICAgICBkb2MucmVwbGFjZVJhbmdlKGRhdGEuY29udGVudHMsIGN1cnNvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYENhbm5vdCBwcm9jZXNzOiBgLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgIGlkOiBjb21tYW5kSWQsXG4gICAgICAgIG5hbWU6IGNvbW1hbmQubGFiZWwsXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiBjYWxsYmFja1dpdGhvdXRWaWV3KCksXG4gICAgICAgIGhvdGtleXM6IFtdLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBkb1Bvc3QoY29tbWFuZF91cmw6IHN0cmluZywgcGFyYW1ldGVyczogYW55KSB7XG4gICAgbGV0IHJlcXVlc3RCb2R5ID0gSlNPTi5zdHJpbmdpZnkocGFyYW1ldGVycyk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5kZWJ1ZyA9PSAndmVyYm9zZScpIHtcbiAgICAgIGNvbnNvbGUuaW5mbygnUG9zdDonLCBjb21tYW5kX3VybCk7XG4gICAgICBjb25zb2xlLmluZm8oJ3JlcXVlc3RCb2R5JywgcmVxdWVzdEJvZHkpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goY29tbWFuZF91cmwsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keTogcmVxdWVzdEJvZHksXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZGVidWcgPT0gJ3ZlcmJvc2UnKSB7XG4gICAgICBjb25zb2xlLmluZm8oJ3Jlc3BvbnNlIGRhdGEnLCBkYXRhKTtcbiAgICB9XG4gICAgaWYgKGRhdGEuZXJyb3JzKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGRhdGEpO1xuICAgICAgbmV3IE5vdGlmaWNhdGlvbihkYXRhLm1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGVmYXVsdFBvc3RQYXJhbWV0ZXJzKCkge1xuICAgIGxldCBwYXJhbWV0ZXJzOiBJbnB1dCA9IHtcbiAgICAgIHZhdWx0UGF0aDogdGhpcy5nZXRWYXVsdFBhdGgoKSxcbiAgICB9O1xuICAgIGNvbnN0IGFjdGl2ZVZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmIChhY3RpdmVWaWV3KSB7XG4gICAgICBjb25zdCBlZGl0b3IgPSBhY3RpdmVWaWV3LmVkaXRvcjtcbiAgICAgIGxldCBzZWxlY3RlZFRleHQgPSBlZGl0b3IuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBpZiAoc2VsZWN0ZWRUZXh0KSB7XG4gICAgICAgIHBhcmFtZXRlcnMudGV4dCA9IHNlbGVjdGVkVGV4dDtcbiAgICAgIH1cbiAgICAgIGlmIChhY3RpdmVWaWV3LmZpbGUgJiYgYWN0aXZlVmlldy5maWxlLnBhdGgpIHtcbiAgICAgICAgcGFyYW1ldGVycy5ub3RlUGF0aCA9IGFjdGl2ZVZpZXcuZmlsZS5wYXRoO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyYW1ldGVycztcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgc3VwZXIubG9hZERhdGEoKSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdCBhbGwgY29tbWFuZHNcbiAgICovXG4gIHByaXZhdGUgaW5pdFZpZXdzID0gKGNvbW1hbmRzOiBNYXA8c3RyaW5nLCBDb21tYW5kPikgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAvLyBBdHRhY2ggb25seSBjb21tYW5kcyB0aGF0IGhhdmUgYSB2aWV3LlxuICAgICAgZm9yIChsZXQgW25hbWUsIGNvbW1hbmRdIG9mIGNvbW1hbmRzKSB7XG4gICAgICAgIGxldCBoYXNWaWV3ID0gY29tbWFuZC50eXBlID09ICdwYW5lbCcgfHwgY29tbWFuZC50eXBlID09ICdjb21tYW5kLWxpbmUnO1xuICAgICAgICBpZiAoaGFzVmlldyAmJiBjb21tYW5kLmFjdGl2ZSkge1xuICAgICAgICAgIGxldCBjb21tYW5kSWQ6IHN0cmluZyA9IGNvbW1hbmRJZEZyb21OYW1lKG5hbWUpO1xuICAgICAgICAgIHRoaXMuc2hvd1BhbmVsKGNvbW1hbmRJZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIHByaXZhdGUgYXN5bmMgc2hvd1BhbmVsKGNvbW1hbmRJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKGNvbW1hbmRJZCk7XG4gICAgaWYgKGV4aXN0aW5nLmxlbmd0aCkge1xuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnJldmVhbExlYWYoZXhpc3RpbmdbMF0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKS5zZXRWaWV3U3RhdGUoe1xuICAgICAgdHlwZTogY29tbWFuZElkLFxuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogU2V0dGluZ3NcbiAqL1xuXG5jbGFzcyBQeXRob25MYWJTZXR0aW5ncyBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwcml2YXRlIHJlYWRvbmx5IHBsdWdpbjogUHl0aG9uTGFiUGx1Z2luO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFB5dGhvbkxhYlBsdWdpbikge1xuICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgfVxuXG4gIHB1YmxpYyBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ09ic2lkaWFuIGxhYiBzZXR0aW5ncycgfSk7XG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2g0JywgeyB0ZXh0OiAnUmVzdGFydCBhZnRlciBtYWtpbmcgY2hhbmdlcycgfSk7XG5cbiAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMucGx1Z2luLnNldHRpbmdzO1xuXG4gICAgY29uc3Qgc2VydmVyVVJMU2V0dGluZyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU2VydmVyIHVybCcpXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICB0ZXh0LnNldFZhbHVlKHNldHRpbmdzLnNlcnZlcl91cmwpO1xuICAgICAgICB0ZXh0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNlcnZlcl91cmwgPSB2YWx1ZSBhcyBzdHJpbmc7XG4gICAgICAgICAgLy8gYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgLy8gSG93IHRvIG1haW50YWluIGZvY3VzIG9uIHRoaXM/XG4gICAgICAgICAgLy8gdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcblxuICAgICAgLmFkZEV4dHJhQnV0dG9uKChiKSA9PiB7XG4gICAgICAgIGIuc2V0SWNvbigncmVzZXQnKVxuICAgICAgICAgIC5zZXRUb29sdGlwKCdzZXQgYW5kIHJlZnJlc2gnKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4ubG9hZENvbW1hbmRQYW5lcygpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIGNvbnN0IHVwZGF0ZVNldHRpbmcgPSBhc3luYyAoY29tbWFuZElkOiBzdHJpbmcsIGNvbW1hbmQ6IENvbW1hbmQpID0+IHtcblxuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWFuZHNbY29tbWFuZElkXSA9IGNvbW1hbmQ7XG4gICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVidWcgPT0gJ3ZlcmJvc2UnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzYXZlJywgY29tbWFuZCk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB9O1xuXG4gICAgZ2V0U2VydmVyU3RhdHVzKHNldHRpbmdzLnNlcnZlcl91cmwpLnRoZW4oKHNlcnZlclN0YXR1cykgPT4ge1xuICAgICAgaWYgKHNlcnZlclN0YXR1cy5zdGF0dXMgPT0gJ2F2YWlsYWJsZScpIHtcbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQ29tbWFuZHMgPSBsb2FkQ29tbWFuZHMoXG4gICAgICAgICAgc2VydmVyU3RhdHVzLmF2YWlsYWJsZUNvbW1hbmRVcmxzLFxuICAgICAgICAgIHNldHRpbmdzLmNvbW1hbmRzLFxuICAgICAgICApO1xuICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgIGZvciAobGV0IFtuYW1lLCBjb21tYW5kXSBvZiBhdmFpbGFibGVDb21tYW5kcykge1xuICAgICAgICAgIGFkZENvbW1hbmRTZXR0aW5nKG5hbWUsIGNvbW1hbmQpO1xuICAgICAgICAgIG4rKztcbiAgICAgICAgfVxuICAgICAgICBzZXJ2ZXJVUkxTZXR0aW5nLnNldE5hbWUoYFNlcnZlciBvbmxpbmUgWyR7bn1dYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXJ2ZXJVUkxTZXR0aW5nXG4gICAgICAgICAgLnNldE5hbWUoJ+KaoCBDYW5ub3QgcmVhY2ggc2VydmVyJylcbiAgICAgICAgICAuc2V0RGVzYygnJylcbiAgICAgICAgICAuc2V0Q2xhc3MoJ3B5dGhvbi1sYWItZXJyb3InKTtcbiAgICAgICAgY29uc29sZS5sb2coc2VydmVyU3RhdHVzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRGb290ZXIoY29udGFpbmVyRWwsIHNldHRpbmdzKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgY29tbWFuZCwgYWRkcyB0aGUgY29uZmlndXJhdGlvblxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHBhcmFtIGNvbW1hbmRcbiAgICAgKi9cbiAgICBjb25zdCBhZGRDb21tYW5kU2V0dGluZyA9IChuYW1lOiBzdHJpbmcsIGNvbW1hbmQ6IENvbW1hbmQpID0+IHtcbiAgICAgIGxldCBjb21tYW5kRWwgPSBjb250YWluZXJFbC5jcmVhdGVFbCgnZGl2Jywge30pO1xuICAgICAgbGV0IGNvbW1hbmRVcmwgPSB0aGlzLnBsdWdpbi5jb21tYW5kVXJsRnJvbU5hbWUobmFtZSk7XG4gICAgICBsZXQgY29tbWFuZERlc2MgPSBgJHtjb21tYW5kVXJsfWA7XG5cbiAgICAgIGlmIChjb21tYW5kLmFjdGl2ZSkge1xuICAgICAgICBuZXcgU2V0dGluZyhjb21tYW5kRWwpXG4gICAgICAgICAgLnNldE5hbWUoYCR7bmFtZX1gKVxuICAgICAgICAgIC5zZXREZXNjKGNvbW1hbmREZXNjKVxuXG4gICAgICAgICAgLy8gVHlwZVxuICAgICAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbignaW5zZXJ0LXRleHQnLCAnSW5zZXJ0IHRleHQnKTtcbiAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbigncmVwbGFjZS10ZXh0JywgJ1JlcGxhY2Ugc2VsZWN0ZWQgdGV4dCcpO1xuICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdwYW5lbCcsICdQYW5lbDogdGV4dCBvciBsaXN0cycpO1xuICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdjb21tYW5kLWxpbmUnLCAnQ2hhdCcpO1xuICAgICAgICAgICAgLy8gZHJvcGRvd24uYWRkT3B0aW9uKCdncmFwaCcsICdhIGdyYXBoJyk7XG4gICAgICAgICAgICBkcm9wZG93bi5zZXRWYWx1ZShTdHJpbmcoY29tbWFuZC50eXBlKSkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbW1hbmQudHlwZSA9IHZhbHVlIGFzXG4gICAgICAgICAgICAgICAgfCAncGFuZWwnXG4gICAgICAgICAgICAgICAgfCAncmVwbGFjZS10ZXh0J1xuICAgICAgICAgICAgICAgIHwgJ2luc2VydC10ZXh0J1xuICAgICAgICAgICAgICAgIHwgJ2NvbW1hbmQtbGluZSc7XG4gICAgICAgICAgICAgIGF3YWl0IHVwZGF0ZVNldHRpbmcobmFtZSwgY29tbWFuZCk7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC8vIEFjdGl2ZSBvciBub3RcbiAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgIHRvZ2dsZS5zZXRWYWx1ZShjb21tYW5kLmFjdGl2ZSk7XG4gICAgICAgICAgICB0b2dnbGUub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbW1hbmQuYWN0aXZlID0gdmFsdWUgYXMgYm9vbGVhbjtcbiAgICAgICAgICAgICAgYXdhaXQgdXBkYXRlU2V0dGluZyhuYW1lLCBjb21tYW5kKTtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBpc1dpZGdldCA9XG4gICAgICAgICAgY29tbWFuZC50eXBlID09ICdwYW5lbCcgfHwgY29tbWFuZC50eXBlID09ICdjb21tYW5kLWxpbmUnO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbW1hbmRFbClcbiAgICAgICAgICAuc2V0RGVzYyhpc1dpZGdldCA/ICdXaWRnZXQgbmFtZScgOiAnQ29tbWFuZCBuYW1lJylcbiAgICAgICAgICAvLyBOYW1lXG4gICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+IHtcbiAgICAgICAgICAgIHRleHQuc2V0VmFsdWUoY29tbWFuZC5sYWJlbCk7XG4gICAgICAgICAgICB0ZXh0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICBjb21tYW5kLmxhYmVsID0gdmFsdWUgYXMgc3RyaW5nO1xuICAgICAgICAgICAgICBhd2FpdCB1cGRhdGVTZXR0aW5nKG5hbWUsIGNvbW1hbmQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGlzV2lkZ2V0KSB7XG4gICAgICAgICAgbmV3IFNldHRpbmcoY29tbWFuZEVsKVxuICAgICAgICAgICAgLnNldERlc2MoJ1dpZGdldCBpY29uJylcbiAgICAgICAgICAgIC8vIEljb25cbiAgICAgICAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgICAgICAgaWNvbnMuZm9yRWFjaCgoaWNvbikgPT4ge1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbihpY29uLCBpY29uKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKFN0cmluZyhjb21tYW5kLmljb24pKVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbW1hbmQuaWNvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgYXdhaXQgdXBkYXRlU2V0dGluZyhuYW1lLCBjb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYikgPT4ge1xuICAgICAgICAgICAgICBiLnNldEljb24oY29tbWFuZC5pY29uKVxuICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKCdJY29uIHNob3duIGluIHRoZSB3aWRnZXQgdGFiJylcbiAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7fSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21tYW5kLnR5cGUgPT0gJ3BhbmVsJykge1xuICAgICAgICAgIG5ldyBTZXR0aW5nKGNvbW1hbmRFbClcbiAgICAgICAgICAgIC5zZXREZXNjKCdBZGRpdGlvbmFsIHRyaWdnZXJzIGZvciBwYW5lbCcpXG4gICAgICAgICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbignZmFsc2UnLCAnbm8gdHJpZ2dlcnMnKTtcbiAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCd0cnVlJywgJ3RyaWdlcnMgd2hlbiBvcGVuaW5nIGEgZmlsZScpO1xuICAgICAgICAgICAgICBkcm9wZG93blxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShTdHJpbmcoY29tbWFuZC5pbnZva2VPbk9wZW4pKVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbW1hbmQuaW52b2tlT25PcGVuID0gdmFsdWUgPT0gJ3RydWUnO1xuICAgICAgICAgICAgICAgICAgYXdhaXQgdXBkYXRlU2V0dGluZyhuYW1lLCBjb21tYW5kKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbW1hbmRFbClcbiAgICAgICAgICAuc2V0TmFtZShgJHtuYW1lfWApXG4gICAgICAgICAgLnNldERlc2MoY29tbWFuZERlc2MpXG4gICAgICAgICAgLy8gQWN0aXZlIG9yIG5vdFxuICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICAgICAgdG9nZ2xlLnNldFZhbHVlKGNvbW1hbmQuYWN0aXZlKTtcbiAgICAgICAgICAgIHRvZ2dsZS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgY29tbWFuZC5hY3RpdmUgPSB2YWx1ZSBhcyBib29sZWFuO1xuICAgICAgICAgICAgICBhd2FpdCB1cGRhdGVTZXR0aW5nKG5hbWUsIGNvbW1hbmQpO1xuICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHNldEZvb3Rlcihjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHNldHRpbmdzOiBTZXR0aW5ncykge1xuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0RlYnVnJylcbiAgICAgIC5zZXREZXNjKCcnKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ29mZicsICdvZmYnKTtcbiAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCd2ZXJib3NlJywgJ3ZlcmJvc2UnKTtcbiAgICAgICAgLy8gZHJvcGRvd24uYWRkT3B0aW9uKCdncmFwaCcsICdhIGdyYXBoJyk7XG4gICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKFN0cmluZyhzZXR0aW5ncy5kZWJ1ZykpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmRlYnVnID0gdmFsdWUgYXMgJ29mZicgfCAndmVyYm9zZSc7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnYScsIHtcbiAgICAgIHRleHQ6ICdZb3UgY2FuIGZpbmQgYSBzaW1wbGUgc2VydmVyIGF0IGdpdGh1Yjogb2JzaWRpYW4tbGFiLXB5JyxcbiAgICAgIGhyZWY6ICdodHRwczovL2dpdGh1Yi5jb20vY3Jpc3RpYW52YXNxdWV6L29ic2lkaWFuLWxhYi1weScsXG4gICAgfSk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgncCcsIHtcbiAgICAgIHRleHQ6ICdQdWxsIHJlcXVlc3RzIGFyZSBib3RoIHdlbGNvbWUgYW5kIGFwcHJlY2lhdGVkLiA6KScsXG4gICAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJJdGVtVmlldyIsIkZpbGVTeXN0ZW1BZGFwdGVyIiwiTm90aWNlIiwiYWRkSWNvbiIsIk1hcmtkb3duVmlldyIsIlBsdWdpbiIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7QUFDekMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BGLFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFHLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUNGO0FBQ08sU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBSyxJQUFJO0FBQzdDLFFBQVEsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsK0JBQStCLENBQUMsQ0FBQztBQUNsRyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0MsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUF1Q0Q7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3pGLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMs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
