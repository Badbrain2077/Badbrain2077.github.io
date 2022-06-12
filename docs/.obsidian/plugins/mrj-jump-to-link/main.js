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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || from);
}

var Settings = /** @class */ (function () {
    function Settings() {
        this.mode = 'popovers';
        // Defaults as in Vimium extension for browsers
        this.letters = 'sadfjklewcmpgh';
        this.jumpToAnywhereRegex = '\\b\\w{3,}\\b';
    }
    return Settings;
}());

var JumpToLink = /** @class */ (function (_super) {
    __extends(JumpToLink, _super);
    function JumpToLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isLinkHintActive = false;
        _this.prefixInfo = undefined;
        _this.handleJumpToLink = function () {
            if (_this.isLinkHintActive) {
                return;
            }
            var currentView = _this.app.workspace.activeLeaf.view;
            if (currentView.getState().mode === 'preview') {
                var previewViewEl = currentView.previewMode.containerEl.querySelector('div.markdown-preview-view');
                _this.managePreviewLinkHints(previewViewEl);
            }
            else if (currentView.getState().mode === 'source') {
                var cmEditor = currentView.sourceMode.cmEditor;
                _this.manageSourceLinkHints(cmEditor);
            }
        };
        _this.handleJumpToRegex = function () {
            var currentView = _this.app.workspace.activeLeaf.view;
            if (_this.isLinkHintActive || currentView.getState().mode !== "source") {
                return;
            }
            var cmEditor = currentView.sourceMode.cmEditor;
            _this.manageSourceLinkHints(cmEditor, "regex");
        };
        _this.managePreviewLinkHints = function (previewViewEl) {
            var linkHints = _this.getPreviewLinkHints(previewViewEl);
            if (linkHints.length) {
                if (_this.settings.mode === 'modal') {
                    _this.displayModal(linkHints);
                }
                else if (_this.settings.mode === 'popovers') {
                    _this.displayPreviewPopovers(previewViewEl, linkHints);
                }
                _this.activateLinkHints(linkHints);
            }
        };
        _this.manageSourceLinkHints = function (cmEditor, mode) {
            if (mode === void 0) { mode = "link"; }
            var linkHints = (mode === "link" ? _this.getSourceLinkHints(cmEditor) : _this.getRegexLinkHints(cmEditor));
            if (linkHints.length) {
                if (_this.settings.mode === "modal") {
                    _this.displayModal(linkHints);
                }
                else if (_this.settings.mode === "popovers") {
                    _this.displaySourcePopovers(cmEditor, linkHints);
                }
                _this.activateLinkHints(linkHints, cmEditor);
            }
        };
        _this.activateLinkHints = function (linkHints, cmEditor) {
            var linkHintMap = {};
            linkHints.forEach(function (x) { return linkHintMap[x.letter] = x; });
            var handleHotkey = function (newLeaf, link) {
                if (link.type === 'internal') {
                    // not sure why the second argument in openLinkText is necessary.
                    _this.app.workspace.openLinkText(decodeURI(link.linkText), '', newLeaf, { active: true });
                }
                else if (link.type === 'external') {
                    // todo
                    require('electron').shell.openExternal(link.linkText);
                }
                else {
                    var editor = cmEditor;
                    editor.setCursor(editor.posFromIndex(link.index));
                }
            };
            var removePopovers = function () {
                document.removeEventListener('click', removePopovers);
                document.querySelectorAll('.jl.popover').forEach(function (e) { return e.remove(); });
                document.querySelectorAll('#jl-modal').forEach(function (e) { return e.remove(); });
                _this.prefixInfo = undefined;
                _this.isLinkHintActive = false;
            };
            var handleKeyDown = function (event) {
                var _a;
                if (event.key === 'Shift') {
                    return;
                }
                var eventKey = event.key.toUpperCase();
                var prefixes = new Set(Object.keys(linkHintMap).filter(function (x) { return x.length > 1; }).map(function (x) { return x[0]; }));
                var linkHint;
                if (_this.prefixInfo) {
                    linkHint = linkHintMap[_this.prefixInfo.prefix + eventKey];
                }
                else {
                    linkHint = linkHintMap[eventKey];
                    if (!linkHint && prefixes && prefixes.has(eventKey)) {
                        _this.prefixInfo = { prefix: eventKey, shiftKey: event.shiftKey };
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return;
                    }
                }
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                var newLeaf = ((_a = _this.prefixInfo) === null || _a === void 0 ? void 0 : _a.shiftKey) || event.shiftKey;
                linkHint && handleHotkey(newLeaf, linkHint);
                document.removeEventListener('keydown', handleKeyDown);
                removePopovers();
            };
            document.addEventListener('click', removePopovers);
            document.addEventListener('keydown', handleKeyDown);
            _this.isLinkHintActive = true;
        };
        _this.getPreviewLinkHints = function (previewViewEl) {
            var checkIsPreviewElOnScreen = _this.checkIsPreviewElOnScreen;
            var anchorEls = previewViewEl.querySelectorAll('a');
            var embedEls = previewViewEl.querySelectorAll('.internal-embed');
            var linkHints = [];
            anchorEls.forEach(function (anchorEl, i) {
                if (checkIsPreviewElOnScreen(previewViewEl, anchorEl)) {
                    return;
                }
                var linkType = anchorEl.hasClass('internal-link')
                    ? 'internal'
                    : 'external';
                var linkText = linkType === 'internal'
                    ? anchorEl.dataset['href']
                    : anchorEl.href;
                var offsetParent = anchorEl.offsetParent;
                var top = anchorEl.offsetTop;
                var left = anchorEl.offsetLeft;
                while (offsetParent) {
                    if (offsetParent == previewViewEl) {
                        offsetParent = undefined;
                    }
                    else {
                        top += offsetParent.offsetTop;
                        left += offsetParent.offsetLeft;
                        offsetParent = offsetParent.offsetParent;
                    }
                }
                linkHints.push({
                    letter: '',
                    linkText: linkText,
                    type: linkType,
                    top: top,
                    left: left,
                });
            });
            embedEls.forEach(function (embedEl, i) {
                var linkText = embedEl.getAttribute('src');
                var linkEl = embedEl.querySelector('.markdown-embed-link');
                if (linkText && linkEl) {
                    if (checkIsPreviewElOnScreen(previewViewEl, linkEl)) {
                        return;
                    }
                    var offsetParent = linkEl.offsetParent;
                    var top_1 = linkEl.offsetTop;
                    var left = linkEl.offsetLeft;
                    while (offsetParent) {
                        if (offsetParent == previewViewEl) {
                            offsetParent = undefined;
                        }
                        else {
                            top_1 += offsetParent.offsetTop;
                            left += offsetParent.offsetLeft;
                            offsetParent = offsetParent.offsetParent;
                        }
                    }
                    linkHints.push({
                        letter: '',
                        linkText: linkText,
                        type: 'internal',
                        top: top_1,
                        left: left,
                    });
                }
            });
            var sortedLinkHints = linkHints.sort(function (a, b) {
                if (a.top > b.top) {
                    return 1;
                }
                else if (a.top === b.top) {
                    if (a.left > b.left) {
                        return 1;
                    }
                    else if (a.left === b.left) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                }
                else {
                    return -1;
                }
            });
            var linkHintLetters = _this.getLinkHintLetters(sortedLinkHints.length);
            sortedLinkHints.forEach(function (linkHint, i) {
                linkHint.letter = linkHintLetters[i];
            });
            return sortedLinkHints;
        };
        _this.getRegexLinkHints = function (cmEditor) {
            var regExUrl = new RegExp(_this.settings.jumpToAnywhereRegex, 'g');
            var linksWithIndex = [];
            var _a = _this.getVisibleLineText(cmEditor), indOffset = _a.indOffset, strs = _a.strs;
            var regExResult;
            while ((regExResult = regExUrl.exec(strs))) {
                var linkText = regExResult[1];
                linksWithIndex.push({
                    index: regExResult.index + indOffset,
                    type: "regex",
                    linkText: linkText,
                });
            }
            var linkHintLetters = _this.getLinkHintLetters(linksWithIndex.length);
            var linksWithLetter = [];
            linksWithIndex
                .sort(function (x, y) { return x.index - y.index; })
                .forEach(function (linkHint, i) {
                linksWithLetter.push(__assign({ letter: linkHintLetters[i] }, linkHint));
            });
            return linksWithLetter;
        };
        _this.getSourceLinkHints = function (cmEditor) {
            // expecting either [[Link]] or [[Link|Title]]
            var regExInternal = /\[\[(.+?)(\|.+?)?\]\]/g;
            // expecting [Title](../example.md)
            var regExMdInternal = /\[.+?\]\(((\.\.|\w|\d).+?)\)/g;
            // expecting [Title](file://link) or [Title](https://link)
            var regExExternal = /\[.+?\]\(((https?:|file:).+?)\)/g;
            // expecting http://hogehoge or https://hogehoge
            var regExUrl = /(?<= |\n|^)(https?:\/\/[^ \n]+)/g;
            var _a = _this.getVisibleLineText(cmEditor), indOffset = _a.indOffset, strs = _a.strs;
            var linksWithIndex = [];
            var regExResult;
            while (regExResult = regExInternal.exec(strs)) {
                var linkText = regExResult[1];
                linksWithIndex.push({ index: regExResult.index + indOffset, type: 'internal', linkText: linkText });
            }
            while (regExResult = regExMdInternal.exec(strs)) {
                var linkText = regExResult[1];
                linksWithIndex.push({ index: regExResult.index + indOffset, type: 'internal', linkText: linkText });
            }
            while (regExResult = regExExternal.exec(strs)) {
                var linkText = regExResult[1];
                linksWithIndex.push({ index: regExResult.index + indOffset, type: 'external', linkText: linkText });
            }
            while (regExResult = regExUrl.exec(strs)) {
                var linkText = regExResult[1];
                linksWithIndex.push({ index: regExResult.index + indOffset, type: 'external', linkText: linkText });
            }
            var linkHintLetters = _this.getLinkHintLetters(linksWithIndex.length);
            var linksWithLetter = [];
            linksWithIndex
                .sort(function (x, y) { return x.index - y.index; })
                .forEach(function (linkHint, i) {
                linksWithLetter.push(__assign({ letter: linkHintLetters[i] }, linkHint));
            });
            return linksWithLetter;
        };
        _this.getLinkHintLetters = function (numLinkHints) {
            var alphabet = _this.settings.letters.toUpperCase();
            var prefixCount = Math.ceil((numLinkHints - alphabet.length) / (alphabet.length - 1));
            // ensure 0 <= prefixCount <= alphabet.length
            prefixCount = Math.max(prefixCount, 0);
            prefixCount = Math.min(prefixCount, alphabet.length);
            var prefixes = __spreadArray([''], Array.from(alphabet.slice(0, prefixCount)));
            var linkHintLetters = [];
            for (var i = 0; i < prefixes.length; i++) {
                var prefix = prefixes[i];
                for (var j = 0; j < alphabet.length; j++) {
                    if (linkHintLetters.length < numLinkHints) {
                        var letter = alphabet[j];
                        if (prefix === '') {
                            if (!prefixes.includes(letter)) {
                                linkHintLetters.push(letter);
                            }
                        }
                        else {
                            linkHintLetters.push(prefix + letter);
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            return linkHintLetters;
        };
        _this.displayModal = function (linkHints) {
            var modalEl = document.createElement('div');
            modalEl.innerHTML = "\n\t\t\t<div class=\"modal-container\" id=\"jl-modal\">\n\t\t\t\t<div class=\"modal-bg\"></div>\n\t\t\t\t<div class=\"modal\">\n\t\t\t\t\t<div class=\"modal-close-button\"></div>\n\t\t\t\t\t<div class=\"modal-title\">Jump to links</div>\n\t\t\t\t\t<div class=\"modal-content\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t";
            modalEl.querySelector('.modal-close-button').addEventListener('click', modalEl.remove);
            document.body.appendChild(modalEl);
            var linkEl = function (content) {
                var el = document.createElement('div');
                el.innerHTML = content;
                return el;
            };
            var modalContentEl = modalEl.querySelector('.modal-content');
            linkHints.forEach(function (linkHint) {
                return modalContentEl.appendChild(linkEl(linkHint.letter + ' ' + linkHint.linkText));
            });
        };
        _this.displayPreviewPopovers = function (markdownPreviewViewEl, linkHints) {
            for (var _i = 0, linkHints_1 = linkHints; _i < linkHints_1.length; _i++) {
                var linkHint = linkHints_1[_i];
                var linkHintEl = markdownPreviewViewEl.createEl('div');
                linkHintEl.style.top = linkHint.top + 'px';
                linkHintEl.style.left = linkHint.left + 'px';
                linkHintEl.textContent = linkHint.letter;
                linkHintEl.addClass('jl');
                linkHintEl.addClass('popover');
            }
        };
        _this.displaySourcePopovers = function (cmEditor, linkKeyMap) {
            var createWidgetElement = function (content) {
                var linkHintEl = document.createElement('div');
                linkHintEl.addClass('jl');
                linkHintEl.addClass('popover');
                linkHintEl.innerHTML = content;
                return linkHintEl;
            };
            var drawWidget = function (cmEditor, linkHint) {
                var pos = cmEditor.posFromIndex(linkHint.index);
                // the fourth parameter is undocumented. it specifies where the widget should be place
                return cmEditor.addWidget(pos, createWidgetElement(linkHint.letter), false, 'over');
            };
            linkKeyMap.forEach(function (x) { return drawWidget(cmEditor, x); });
        };
        return _this;
    }
    JumpToLink.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = (_b.sent()) || new Settings();
                        this.addSettingTab(new SettingTab(this.app, this));
                        this.addCommand({
                            id: 'activate-jump-to-link',
                            name: 'Jump to Link',
                            callback: this.handleJumpToLink,
                            hotkeys: [{ modifiers: ['Ctrl'], key: '\'' }]
                        });
                        this.addCommand({
                            id: "activate-jump-to-anywhere",
                            name: "Jump to Anywhere Regex",
                            callback: this.handleJumpToRegex,
                            hotkeys: [{ modifiers: ["Ctrl"], key: ";" }],
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    JumpToLink.prototype.onunload = function () {
        console.log('unloading jump to links plugin');
    };
    JumpToLink.prototype.checkIsPreviewElOnScreen = function (parent, el) {
        return el.offsetTop < parent.scrollTop || el.offsetTop > parent.scrollTop + parent.offsetHeight;
    };
    JumpToLink.prototype.getVisibleLineText = function (cmEditor) {
        // Grab only visible lines
        var _a = cmEditor.getViewport(), from = _a.from, to = _a.to;
        var indOffset = cmEditor.indexFromPos({ ch: 0, line: from });
        var strs = cmEditor.getRange({ ch: 0, line: from }, { ch: 0, line: to + 1 });
        return { indOffset: indOffset, strs: strs };
    };
    return JumpToLink;
}(obsidian.Plugin));
var SettingTab = /** @class */ (function (_super) {
    __extends(SettingTab, _super);
    function SettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Jump To Link.' });
        new obsidian.Setting(containerEl)
            .setName('Presentation')
            .setDesc('How to show links')
            .addDropdown(function (cb) {
            cb
                .addOptions({
                "popovers": 'Popovers',
                "modal": 'Modal'
            })
                .setValue(_this.plugin.settings.mode)
                .onChange(function (value) {
                _this.plugin.settings.mode = value;
                _this.plugin.saveData(_this.plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Characters used for link hints')
            .setDesc('The characters placed next to each link after enter link-hint mode.')
            .addText(function (cb) {
            cb.setValue(_this.plugin.settings.letters)
                .onChange(function (value) {
                _this.plugin.settings.letters = value;
                _this.plugin.saveData(_this.plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Jump To Anywhere')
            .setDesc("Regex based navigating in editor mode")
            .addText(function (text) {
            return text
                .setPlaceholder('Custom Regex')
                .setValue(_this.plugin.settings.jumpToAnywhereRegex)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.jumpToAnywhereRegex = value;
                            return [4 /*yield*/, this.plugin.saveData(this.plugin.settings)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return SettingTab;
}(obsidian.PluginSettingTab));

module.exports = JumpToLink;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInR5cGVzLnRzIiwibWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IGZyb20pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiZXhwb3J0IHR5cGUgTGlua0hpbnRUeXBlID0gJ2ludGVybmFsJyB8ICdleHRlcm5hbCcgfCAncmVnZXgnO1xuZXhwb3J0IHR5cGUgTGlua0hpbnRNb2RlID0gJ21vZGFsJyB8ICdwb3BvdmVycyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlua0hpbnRCYXNlIHtcblx0bGV0dGVyOiBzdHJpbmc7XG5cdHR5cGU6IExpbmtIaW50VHlwZTtcblx0bGlua1RleHQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcmV2aWV3TGlua0hpbnQgZXh0ZW5kcyBMaW5rSGludEJhc2Uge1xuXHRsZWZ0OiBudW1iZXI7XG5cdHRvcDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZUxpbmtIaW50IGV4dGVuZHMgTGlua0hpbnRCYXNlIHtcblx0aW5kZXg6IG51bWJlclxufVxuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3Mge1xuXHRtb2RlOiBMaW5rSGludE1vZGUgPSAncG9wb3ZlcnMnO1xuXHQvLyBEZWZhdWx0cyBhcyBpbiBWaW1pdW0gZXh0ZW5zaW9uIGZvciBicm93c2Vyc1xuXHRsZXR0ZXJzOiBzdHJpbmcgPSAnc2FkZmprbGV3Y21wZ2gnO1xuXHRqdW1wVG9Bbnl3aGVyZVJlZ2V4OiBzdHJpbmcgPSAnXFxcXGJcXFxcd3szLH1cXFxcYic7XG59XG4iLCJpbXBvcnQgeyBBcHAsIFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IEVkaXRvciB9IGZyb20gJ2NvZGVtaXJyb3InO1xuaW1wb3J0IHsgTGlua0hpbnRCYXNlLCBMaW5rSGludE1vZGUsIExpbmtIaW50VHlwZSwgUHJldmlld0xpbmtIaW50LCBTZXR0aW5ncywgU291cmNlTGlua0hpbnQgfSBmcm9tICd0eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEp1bXBUb0xpbmsgZXh0ZW5kcyBQbHVnaW4ge1xuICAgIGlzTGlua0hpbnRBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBzZXR0aW5nczogU2V0dGluZ3M7XG4gICAgcHJlZml4SW5mbzogeyBwcmVmaXg6IHN0cmluZywgc2hpZnRLZXk6IGJvb2xlYW4gfSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGFzeW5jIG9ubG9hZCgpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IGF3YWl0IHRoaXMubG9hZERhdGEoKSB8fCBuZXcgU2V0dGluZ3MoKTtcblxuICAgICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6ICdhY3RpdmF0ZS1qdW1wLXRvLWxpbmsnLFxuICAgICAgICAgICAgbmFtZTogJ0p1bXAgdG8gTGluaycsXG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5oYW5kbGVKdW1wVG9MaW5rLFxuICAgICAgICAgICAgaG90a2V5czogW3ttb2RpZmllcnM6IFsnQ3RybCddLCBrZXk6ICdcXCcnfV1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImFjdGl2YXRlLWp1bXAtdG8tYW55d2hlcmVcIixcbiAgICAgICAgICAgIG5hbWU6IFwiSnVtcCB0byBBbnl3aGVyZSBSZWdleFwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6IHRoaXMuaGFuZGxlSnVtcFRvUmVnZXgsXG4gICAgICAgICAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIkN0cmxcIl0sIGtleTogXCI7XCIgfV0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9udW5sb2FkKCkge1xuICAgICAgICBjb25zb2xlLmxvZygndW5sb2FkaW5nIGp1bXAgdG8gbGlua3MgcGx1Z2luJyk7XG4gICAgfVxuXG4gICAgaGFuZGxlSnVtcFRvTGluayA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNMaW5rSGludEFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VycmVudFZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3O1xuXG4gICAgICAgIGlmIChjdXJyZW50Vmlldy5nZXRTdGF0ZSgpLm1vZGUgPT09ICdwcmV2aWV3Jykge1xuICAgICAgICAgICAgY29uc3QgcHJldmlld1ZpZXdFbDogSFRNTEVsZW1lbnQgPSAoY3VycmVudFZpZXcgYXMgYW55KS5wcmV2aWV3TW9kZS5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKCdkaXYubWFya2Rvd24tcHJldmlldy12aWV3Jyk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZVByZXZpZXdMaW5rSGludHMocHJldmlld1ZpZXdFbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFZpZXcuZ2V0U3RhdGUoKS5tb2RlID09PSAnc291cmNlJykge1xuICAgICAgICAgICAgY29uc3QgY21FZGl0b3I6IEVkaXRvciA9IChjdXJyZW50VmlldyBhcyBhbnkpLnNvdXJjZU1vZGUuY21FZGl0b3I7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZVNvdXJjZUxpbmtIaW50cyhjbUVkaXRvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVKdW1wVG9SZWdleCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudFZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3O1xuXG4gICAgICAgIGlmICh0aGlzLmlzTGlua0hpbnRBY3RpdmUgfHwgY3VycmVudFZpZXcuZ2V0U3RhdGUoKS5tb2RlICE9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjbUVkaXRvcjogRWRpdG9yID0gKGN1cnJlbnRWaWV3IGFzIGFueSkuc291cmNlTW9kZS5jbUVkaXRvcjtcbiAgICAgICAgdGhpcy5tYW5hZ2VTb3VyY2VMaW5rSGludHMoY21FZGl0b3IsIFwicmVnZXhcIik7XG4gICAgfVxuXG4gICAgbWFuYWdlUHJldmlld0xpbmtIaW50cyA9IChwcmV2aWV3Vmlld0VsOiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBsaW5rSGludHMgPSB0aGlzLmdldFByZXZpZXdMaW5rSGludHMocHJldmlld1ZpZXdFbCk7XG4gICAgICAgIGlmIChsaW5rSGludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5tb2RlID09PSAnbW9kYWwnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TW9kYWwobGlua0hpbnRzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zZXR0aW5ncy5tb2RlID09PSAncG9wb3ZlcnMnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5UHJldmlld1BvcG92ZXJzKHByZXZpZXdWaWV3RWwsIGxpbmtIaW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlTGlua0hpbnRzKGxpbmtIaW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYW5hZ2VTb3VyY2VMaW5rSGludHMgPSAoY21FZGl0b3I6IEVkaXRvciwgbW9kZSA9IFwibGlua1wiKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGxpbmtIaW50cyA9IChtb2RlID09PSBcImxpbmtcIiA/IHRoaXMuZ2V0U291cmNlTGlua0hpbnRzKGNtRWRpdG9yKSA6IHRoaXMuZ2V0UmVnZXhMaW5rSGludHMoY21FZGl0b3IpKTtcbiAgICAgICAgaWYgKGxpbmtIaW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGUgPT09IFwibW9kYWxcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU1vZGFsKGxpbmtIaW50cyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MubW9kZSA9PT0gXCJwb3BvdmVyc1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5U291cmNlUG9wb3ZlcnMoY21FZGl0b3IsIGxpbmtIaW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlTGlua0hpbnRzKGxpbmtIaW50cywgY21FZGl0b3IpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGFjdGl2YXRlTGlua0hpbnRzID0gKGxpbmtIaW50czogTGlua0hpbnRCYXNlW10sIGNtRWRpdG9yPzogRWRpdG9yKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGxpbmtIaW50TWFwOiB7IFtsZXR0ZXI6IHN0cmluZ106IExpbmtIaW50QmFzZSB9ID0ge307XG4gICAgICAgIGxpbmtIaW50cy5mb3JFYWNoKHggPT4gbGlua0hpbnRNYXBbeC5sZXR0ZXJdID0geCk7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlSG90a2V5ID0gKG5ld0xlYWY6IGJvb2xlYW4sIGxpbms6IFNvdXJjZUxpbmtIaW50IHwgTGlua0hpbnRCYXNlKSA9PiB7XG4gICAgICAgICAgICBpZiAobGluay50eXBlID09PSAnaW50ZXJuYWwnKSB7XG4gICAgICAgICAgICAgICAgLy8gbm90IHN1cmUgd2h5IHRoZSBzZWNvbmQgYXJndW1lbnQgaW4gb3BlbkxpbmtUZXh0IGlzIG5lY2Vzc2FyeS5cbiAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KGRlY29kZVVSSShsaW5rLmxpbmtUZXh0KSwgJycsIG5ld0xlYWYsIHsgYWN0aXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsaW5rLnR5cGUgPT09ICdleHRlcm5hbCcpIHtcbiAgICAgICAgICAgICAgICAvLyB0b2RvXG4gICAgICAgICAgICAgICAgcmVxdWlyZSgnZWxlY3Ryb24nKS5zaGVsbC5vcGVuRXh0ZXJuYWwobGluay5saW5rVGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGNtRWRpdG9yO1xuICAgICAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3IoZWRpdG9yLnBvc0Zyb21JbmRleCgoPFNvdXJjZUxpbmtIaW50PmxpbmspLmluZGV4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZW1vdmVQb3BvdmVycyA9ICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlUG9wb3ZlcnMpXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuamwucG9wb3ZlcicpLmZvckVhY2goZSA9PiBlLnJlbW92ZSgpKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNqbC1tb2RhbCcpLmZvckVhY2goZSA9PiBlLnJlbW92ZSgpKTtcbiAgICAgICAgICAgIHRoaXMucHJlZml4SW5mbyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMuaXNMaW5rSGludEFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGFuZGxlS2V5RG93biA9IChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZXZlbnRLZXkgPSBldmVudC5rZXkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeGVzID0gbmV3IFNldChPYmplY3Qua2V5cyhsaW5rSGludE1hcCkuZmlsdGVyKHggPT4geC5sZW5ndGggPiAxKS5tYXAoeCA9PiB4WzBdKSk7XG5cbiAgICAgICAgICAgIGxldCBsaW5rSGludDogTGlua0hpbnRCYXNlO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlZml4SW5mbykge1xuICAgICAgICAgICAgICAgIGxpbmtIaW50ID0gbGlua0hpbnRNYXBbdGhpcy5wcmVmaXhJbmZvLnByZWZpeCArIGV2ZW50S2V5XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlua0hpbnQgPSBsaW5rSGludE1hcFtldmVudEtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFsaW5rSGludCAmJiBwcmVmaXhlcyAmJiBwcmVmaXhlcy5oYXMoZXZlbnRLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlZml4SW5mbyA9IHsgcHJlZml4OiBldmVudEtleSwgc2hpZnRLZXk6IGV2ZW50LnNoaWZ0S2V5IH07XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdMZWFmID0gdGhpcy5wcmVmaXhJbmZvPy5zaGlmdEtleSB8fCBldmVudC5zaGlmdEtleTtcblxuICAgICAgICAgICAgbGlua0hpbnQgJiYgaGFuZGxlSG90a2V5KG5ld0xlYWYsIGxpbmtIaW50KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgICAgICAgICAgcmVtb3ZlUG9wb3ZlcnMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZVBvcG92ZXJzKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93bik7XG4gICAgICAgIHRoaXMuaXNMaW5rSGludEFjdGl2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgY2hlY2tJc1ByZXZpZXdFbE9uU2NyZWVuKHBhcmVudDogSFRNTEVsZW1lbnQsIGVsOiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWwub2Zmc2V0VG9wIDwgcGFyZW50LnNjcm9sbFRvcCB8fCBlbC5vZmZzZXRUb3AgPiBwYXJlbnQuc2Nyb2xsVG9wICsgcGFyZW50Lm9mZnNldEhlaWdodFxuICAgIH1cblxuICAgIGdldFByZXZpZXdMaW5rSGludHMgPSAocHJldmlld1ZpZXdFbDogSFRNTEVsZW1lbnQpOiBQcmV2aWV3TGlua0hpbnRbXSA9PiB7XG4gICAgICAgIGNvbnN0IHtjaGVja0lzUHJldmlld0VsT25TY3JlZW59ID0gdGhpc1xuICAgICAgICBjb25zdCBhbmNob3JFbHMgPSBwcmV2aWV3Vmlld0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTtcbiAgICAgICAgY29uc3QgZW1iZWRFbHMgPSBwcmV2aWV3Vmlld0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnRlcm5hbC1lbWJlZCcpO1xuXG4gICAgICAgIGNvbnN0IGxpbmtIaW50czogUHJldmlld0xpbmtIaW50W10gPSBbXTtcbiAgICAgICAgYW5jaG9yRWxzLmZvckVhY2goKGFuY2hvckVsLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2hlY2tJc1ByZXZpZXdFbE9uU2NyZWVuKHByZXZpZXdWaWV3RWwsIGFuY2hvckVsKSkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaW5rVHlwZTogTGlua0hpbnRUeXBlID0gYW5jaG9yRWwuaGFzQ2xhc3MoJ2ludGVybmFsLWxpbmsnKVxuICAgICAgICAgICAgICAgID8gJ2ludGVybmFsJ1xuICAgICAgICAgICAgICAgIDogJ2V4dGVybmFsJztcblxuICAgICAgICAgICAgY29uc3QgbGlua1RleHQgPSBsaW5rVHlwZSA9PT0gJ2ludGVybmFsJ1xuICAgICAgICAgICAgICAgID8gYW5jaG9yRWwuZGF0YXNldFsnaHJlZiddXG4gICAgICAgICAgICAgICAgOiBhbmNob3JFbC5ocmVmO1xuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0UGFyZW50ID0gYW5jaG9yRWwub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgbGV0IHRvcCA9IGFuY2hvckVsLm9mZnNldFRvcDtcbiAgICAgICAgICAgIGxldCBsZWZ0ID0gYW5jaG9yRWwub2Zmc2V0TGVmdDtcblxuICAgICAgICAgICAgd2hpbGUgKG9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXRQYXJlbnQgPT0gcHJldmlld1ZpZXdFbCkge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRQYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wICs9IG9mZnNldFBhcmVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgKz0gb2Zmc2V0UGFyZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rSGludHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGV0dGVyOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5rVGV4dDogbGlua1RleHQsXG4gICAgICAgICAgICAgICAgdHlwZTogbGlua1R5cGUsXG4gICAgICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbWJlZEVscy5mb3JFYWNoKChlbWJlZEVsLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5rVGV4dCA9IGVtYmVkRWwuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmtFbCA9IGVtYmVkRWwucXVlcnlTZWxlY3RvcignLm1hcmtkb3duLWVtYmVkLWxpbmsnKSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKGxpbmtUZXh0ICYmIGxpbmtFbCkge1xuICAgICAgICAgICAgICAgIGlmIChjaGVja0lzUHJldmlld0VsT25TY3JlZW4ocHJldmlld1ZpZXdFbCwgbGlua0VsKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0UGFyZW50ID0gbGlua0VsLm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gbGlua0VsLm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICBsZXQgbGVmdCA9IGxpbmtFbC5vZmZzZXRMZWZ0O1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKG9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2Zmc2V0UGFyZW50ID09IHByZXZpZXdWaWV3RWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCArPSBvZmZzZXRQYXJlbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCArPSBvZmZzZXRQYXJlbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsaW5rSGludHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGxldHRlcjogJycsXG4gICAgICAgICAgICAgICAgICAgIGxpbmtUZXh0OiBsaW5rVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludGVybmFsJyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNvcnRlZExpbmtIaW50cyA9IGxpbmtIaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS50b3AgPiBiLnRvcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhLnRvcCA9PT0gYi50b3ApIHtcbiAgICAgICAgICAgICAgICBpZiAoYS5sZWZ0ID4gYi5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYS5sZWZ0ID09PSBiLmxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBsaW5rSGludExldHRlcnMgPSB0aGlzLmdldExpbmtIaW50TGV0dGVycyhzb3J0ZWRMaW5rSGludHMubGVuZ3RoKTtcblxuICAgICAgICBzb3J0ZWRMaW5rSGludHMuZm9yRWFjaCgobGlua0hpbnQsIGkpID0+IHtcbiAgICAgICAgICAgIGxpbmtIaW50LmxldHRlciA9IGxpbmtIaW50TGV0dGVyc1tpXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNvcnRlZExpbmtIaW50cztcbiAgICB9XG5cbiAgICBnZXRWaXNpYmxlTGluZVRleHQoY21FZGl0b3I6IEVkaXRvcikge1xuICAgICAgICAvLyBHcmFiIG9ubHkgdmlzaWJsZSBsaW5lc1xuICAgICAgICBjb25zdCB7IGZyb20sIHRvIH0gPSBjbUVkaXRvci5nZXRWaWV3cG9ydCgpXG4gICAgICAgIGNvbnN0IGluZE9mZnNldCA9IGNtRWRpdG9yLmluZGV4RnJvbVBvcyh7Y2g6MCwgbGluZTogZnJvbX0pXG4gICAgICAgIGNvbnN0IHN0cnMgPSBjbUVkaXRvci5nZXRSYW5nZSh7Y2g6IDAsIGxpbmU6IGZyb219LCB7Y2g6IDAsIGxpbmU6IHRvICsgMX0pXG5cbiAgICAgICAgcmV0dXJuIHsgaW5kT2Zmc2V0LCBzdHJzIH07XG4gICAgfVxuXG4gICAgZ2V0UmVnZXhMaW5rSGludHMgPSAoY21FZGl0b3I6IEVkaXRvcik6IFNvdXJjZUxpbmtIaW50W10gPT4ge1xuICAgICAgICBjb25zdCByZWdFeFVybCA9IG5ldyBSZWdFeHAodGhpcy5zZXR0aW5ncy5qdW1wVG9Bbnl3aGVyZVJlZ2V4LCAnZycpO1xuXG4gICAgICAgIGxldCBsaW5rc1dpdGhJbmRleDoge1xuICAgICAgICAgICAgaW5kZXg6IG51bWJlcjtcbiAgICAgICAgICAgIHR5cGU6IFwicmVnZXhcIjtcbiAgICAgICAgICAgIGxpbmtUZXh0OiBzdHJpbmc7XG4gICAgICAgIH1bXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHsgaW5kT2Zmc2V0LCBzdHJzIH0gPSB0aGlzLmdldFZpc2libGVMaW5lVGV4dChjbUVkaXRvcik7XG5cbiAgICAgICAgbGV0IHJlZ0V4UmVzdWx0O1xuXG4gICAgICAgIHdoaWxlICgocmVnRXhSZXN1bHQgPSByZWdFeFVybC5leGVjKHN0cnMpKSkge1xuICAgICAgICAgICAgY29uc3QgbGlua1RleHQgPSByZWdFeFJlc3VsdFsxXTtcbiAgICAgICAgICAgIGxpbmtzV2l0aEluZGV4LnB1c2goe1xuICAgICAgICAgICAgICAgIGluZGV4OiByZWdFeFJlc3VsdC5pbmRleCArIGluZE9mZnNldCxcbiAgICAgICAgICAgICAgICB0eXBlOiBcInJlZ2V4XCIsXG4gICAgICAgICAgICAgICAgbGlua1RleHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxpbmtIaW50TGV0dGVycyA9IHRoaXMuZ2V0TGlua0hpbnRMZXR0ZXJzKGxpbmtzV2l0aEluZGV4Lmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgbGlua3NXaXRoTGV0dGVyOiBTb3VyY2VMaW5rSGludFtdID0gW107XG4gICAgICAgIGxpbmtzV2l0aEluZGV4XG4gICAgICAgICAgICAuc29ydCgoeCwgeSkgPT4geC5pbmRleCAtIHkuaW5kZXgpXG4gICAgICAgICAgICAuZm9yRWFjaCgobGlua0hpbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsaW5rc1dpdGhMZXR0ZXIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGxldHRlcjogbGlua0hpbnRMZXR0ZXJzW2ldLFxuICAgICAgICAgICAgICAgICAgICAuLi5saW5rSGludCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBsaW5rc1dpdGhMZXR0ZXI7XG4gICAgfTtcblxuICAgIGdldFNvdXJjZUxpbmtIaW50cyA9IChjbUVkaXRvcjogRWRpdG9yKTogU291cmNlTGlua0hpbnRbXSA9PiB7XG4gICAgICAgIC8vIGV4cGVjdGluZyBlaXRoZXIgW1tMaW5rXV0gb3IgW1tMaW5rfFRpdGxlXV1cbiAgICAgICAgY29uc3QgcmVnRXhJbnRlcm5hbCA9IC9cXFtcXFsoLis/KShcXHwuKz8pP1xcXVxcXS9nO1xuICAgICAgICAvLyBleHBlY3RpbmcgW1RpdGxlXSguLi9leGFtcGxlLm1kKVxuICAgICAgICBjb25zdCByZWdFeE1kSW50ZXJuYWwgPSAvXFxbLis/XFxdXFwoKChcXC5cXC58XFx3fFxcZCkuKz8pXFwpL2c7XG4gICAgICAgIC8vIGV4cGVjdGluZyBbVGl0bGVdKGZpbGU6Ly9saW5rKSBvciBbVGl0bGVdKGh0dHBzOi8vbGluaylcbiAgICAgICAgY29uc3QgcmVnRXhFeHRlcm5hbCA9IC9cXFsuKz9cXF1cXCgoKGh0dHBzPzp8ZmlsZTopLis/KVxcKS9nO1xuICAgICAgICAvLyBleHBlY3RpbmcgaHR0cDovL2hvZ2Vob2dlIG9yIGh0dHBzOi8vaG9nZWhvZ2VcbiAgICAgICAgY29uc3QgcmVnRXhVcmwgPSAvKD88PSB8XFxufF4pKGh0dHBzPzpcXC9cXC9bXiBcXG5dKykvZztcblxuICAgICAgICBjb25zdCB7IGluZE9mZnNldCwgc3RycyB9ID0gdGhpcy5nZXRWaXNpYmxlTGluZVRleHQoY21FZGl0b3IpO1xuXG4gICAgICAgIGxldCBsaW5rc1dpdGhJbmRleDogeyBpbmRleDogbnVtYmVyLCB0eXBlOiAnaW50ZXJuYWwnIHwgJ2V4dGVybmFsJywgbGlua1RleHQ6IHN0cmluZyB9W10gPSBbXTtcbiAgICAgICAgbGV0IHJlZ0V4UmVzdWx0O1xuXG4gICAgICAgIHdoaWxlKHJlZ0V4UmVzdWx0ID0gcmVnRXhJbnRlcm5hbC5leGVjKHN0cnMpKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5rVGV4dCA9IHJlZ0V4UmVzdWx0WzFdO1xuICAgICAgICAgICAgbGlua3NXaXRoSW5kZXgucHVzaCh7IGluZGV4OiByZWdFeFJlc3VsdC5pbmRleCArIGluZE9mZnNldCwgdHlwZTogJ2ludGVybmFsJywgbGlua1RleHQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZShyZWdFeFJlc3VsdCA9IHJlZ0V4TWRJbnRlcm5hbC5leGVjKHN0cnMpKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5rVGV4dCA9IHJlZ0V4UmVzdWx0WzFdO1xuICAgICAgICAgICAgbGlua3NXaXRoSW5kZXgucHVzaCh7IGluZGV4OiByZWdFeFJlc3VsdC5pbmRleCArIGluZE9mZnNldCwgdHlwZTogJ2ludGVybmFsJywgbGlua1RleHQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZShyZWdFeFJlc3VsdCA9IHJlZ0V4RXh0ZXJuYWwuZXhlYyhzdHJzKSkge1xuICAgICAgICAgICAgY29uc3QgbGlua1RleHQgPSByZWdFeFJlc3VsdFsxXTtcbiAgICAgICAgICAgIGxpbmtzV2l0aEluZGV4LnB1c2goeyBpbmRleDogcmVnRXhSZXN1bHQuaW5kZXggKyBpbmRPZmZzZXQsIHR5cGU6ICdleHRlcm5hbCcsIGxpbmtUZXh0IH0pXG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZShyZWdFeFJlc3VsdCA9IHJlZ0V4VXJsLmV4ZWMoc3RycykpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmtUZXh0ID0gcmVnRXhSZXN1bHRbMV07XG4gICAgICAgICAgICBsaW5rc1dpdGhJbmRleC5wdXNoKHsgaW5kZXg6IHJlZ0V4UmVzdWx0LmluZGV4ICsgaW5kT2Zmc2V0LCB0eXBlOiAnZXh0ZXJuYWwnLCBsaW5rVGV4dCB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGlua0hpbnRMZXR0ZXJzID0gdGhpcy5nZXRMaW5rSGludExldHRlcnMobGlua3NXaXRoSW5kZXgubGVuZ3RoKTtcblxuICAgICAgICBjb25zdCBsaW5rc1dpdGhMZXR0ZXI6IFNvdXJjZUxpbmtIaW50W10gPSBbXTtcbiAgICAgICAgbGlua3NXaXRoSW5kZXhcbiAgICAgICAgICAgIC5zb3J0KCh4LHkpID0+IHguaW5kZXggLSB5LmluZGV4KVxuICAgICAgICAgICAgLmZvckVhY2goKGxpbmtIaW50LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgbGlua3NXaXRoTGV0dGVyLnB1c2goeyBsZXR0ZXI6IGxpbmtIaW50TGV0dGVyc1tpXSwgLi4ubGlua0hpbnR9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBsaW5rc1dpdGhMZXR0ZXI7XG4gICAgfVxuXG4gICAgZ2V0TGlua0hpbnRMZXR0ZXJzID0gKG51bUxpbmtIaW50czogbnVtYmVyKTogc3RyaW5nW10gPT4ge1xuICAgICAgICBjb25zdCBhbHBoYWJldCA9IHRoaXMuc2V0dGluZ3MubGV0dGVycy50b1VwcGVyQ2FzZSgpXG5cbiAgICAgICAgbGV0IHByZWZpeENvdW50ID0gTWF0aC5jZWlsKChudW1MaW5rSGludHMgLSBhbHBoYWJldC5sZW5ndGgpIC8gKGFscGhhYmV0Lmxlbmd0aCAtIDEpKVxuXG4gICAgICAgIC8vIGVuc3VyZSAwIDw9IHByZWZpeENvdW50IDw9IGFscGhhYmV0Lmxlbmd0aFxuICAgICAgICBwcmVmaXhDb3VudCA9IE1hdGgubWF4KHByZWZpeENvdW50LCAwKTtcbiAgICAgICAgcHJlZml4Q291bnQgPSBNYXRoLm1pbihwcmVmaXhDb3VudCwgYWxwaGFiZXQubGVuZ3RoKTtcblxuICAgICAgICBjb25zdCBwcmVmaXhlcyA9IFsnJywgLi4uQXJyYXkuZnJvbShhbHBoYWJldC5zbGljZSgwLCBwcmVmaXhDb3VudCkpXTtcblxuICAgICAgICBjb25zdCBsaW5rSGludExldHRlcnMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwcmVmaXggPSBwcmVmaXhlc1tpXVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhbHBoYWJldC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rSGludExldHRlcnMubGVuZ3RoIDwgbnVtTGlua0hpbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxldHRlciA9IGFscGhhYmV0W2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJlZml4ID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwcmVmaXhlcy5pbmNsdWRlcyhsZXR0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlua0hpbnRMZXR0ZXJzLnB1c2gobGV0dGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtIaW50TGV0dGVycy5wdXNoKHByZWZpeCArIGxldHRlcilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rSGludExldHRlcnM7XG4gICAgfVxuXG4gICAgZGlzcGxheU1vZGFsID0gKGxpbmtIaW50czogTGlua0hpbnRCYXNlW10pOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3QgbW9kYWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBtb2RhbEVsLmlubmVySFRNTCA9ICBgXG5cdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtY29udGFpbmVyXCIgaWQ9XCJqbC1tb2RhbFwiPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtYmdcIj48L2Rpdj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIm1vZGFsLWNsb3NlLWJ1dHRvblwiPjwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkp1bXAgdG8gbGlua3M8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG4gICAgICAgIG1vZGFsRWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWNsb3NlLWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbW9kYWxFbC5yZW1vdmUpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsRWwpO1xuXG4gICAgICAgIGNvbnN0IGxpbmtFbCA9IChjb250ZW50OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSBjb250ZW50O1xuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG1vZGFsQ29udGVudEVsID0gbW9kYWxFbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY29udGVudCcpO1xuICAgICAgICBsaW5rSGludHMuZm9yRWFjaCgobGlua0hpbnQ6IExpbmtIaW50QmFzZSkgPT5cbiAgICAgICAgICAgIG1vZGFsQ29udGVudEVsLmFwcGVuZENoaWxkKGxpbmtFbChsaW5rSGludC5sZXR0ZXIgKyAnICcgKyBsaW5rSGludC5saW5rVGV4dCkpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZGlzcGxheVByZXZpZXdQb3BvdmVycyA9IChtYXJrZG93blByZXZpZXdWaWV3RWw6IEhUTUxFbGVtZW50LCBsaW5rSGludHM6IFByZXZpZXdMaW5rSGludFtdKTogdm9pZCA9PiB7XG4gICAgICAgIGZvciAobGV0IGxpbmtIaW50IG9mIGxpbmtIaW50cykge1xuICAgICAgICAgICAgY29uc3QgbGlua0hpbnRFbCA9IG1hcmtkb3duUHJldmlld1ZpZXdFbC5jcmVhdGVFbCgnZGl2Jyk7XG4gICAgICAgICAgICBsaW5rSGludEVsLnN0eWxlLnRvcCA9IGxpbmtIaW50LnRvcCArICdweCc7XG4gICAgICAgICAgICBsaW5rSGludEVsLnN0eWxlLmxlZnQgPSBsaW5rSGludC5sZWZ0ICsgJ3B4JztcblxuICAgICAgICAgICAgbGlua0hpbnRFbC50ZXh0Q29udGVudCA9IGxpbmtIaW50LmxldHRlcjtcbiAgICAgICAgICAgIGxpbmtIaW50RWwuYWRkQ2xhc3MoJ2psJyk7XG4gICAgICAgICAgICBsaW5rSGludEVsLmFkZENsYXNzKCdwb3BvdmVyJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNwbGF5U291cmNlUG9wb3ZlcnMgPSAoY21FZGl0b3I6IEVkaXRvciwgbGlua0tleU1hcDogU291cmNlTGlua0hpbnRbXSk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBjcmVhdGVXaWRnZXRFbGVtZW50ID0gKGNvbnRlbnQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGlua0hpbnRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGlua0hpbnRFbC5hZGRDbGFzcygnamwnKTtcbiAgICAgICAgICAgIGxpbmtIaW50RWwuYWRkQ2xhc3MoJ3BvcG92ZXInKTtcbiAgICAgICAgICAgIGxpbmtIaW50RWwuaW5uZXJIVE1MID0gY29udGVudDtcbiAgICAgICAgICAgIHJldHVybiBsaW5rSGludEVsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHJhd1dpZGdldCA9IChjbUVkaXRvcjogRWRpdG9yLCBsaW5rSGludDogU291cmNlTGlua0hpbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IGNtRWRpdG9yLnBvc0Zyb21JbmRleChsaW5rSGludC5pbmRleCk7XG4gICAgICAgICAgICAvLyB0aGUgZm91cnRoIHBhcmFtZXRlciBpcyB1bmRvY3VtZW50ZWQuIGl0IHNwZWNpZmllcyB3aGVyZSB0aGUgd2lkZ2V0IHNob3VsZCBiZSBwbGFjZVxuICAgICAgICAgICAgcmV0dXJuIChjbUVkaXRvciBhcyBhbnkpLmFkZFdpZGdldChwb3MsIGNyZWF0ZVdpZGdldEVsZW1lbnQobGlua0hpbnQubGV0dGVyKSwgZmFsc2UsICdvdmVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsaW5rS2V5TWFwLmZvckVhY2goeCA9PiBkcmF3V2lkZ2V0KGNtRWRpdG9yLCB4KSk7XG4gICAgfVxufVxuXG5jbGFzcyBTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gICAgcGx1Z2luOiBKdW1wVG9MaW5rXG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBKdW1wVG9MaW5rKSB7XG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKVxuXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luXG4gICAgfVxuXG4gICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHtjb250YWluZXJFbH0gPSB0aGlzO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywge3RleHQ6ICdTZXR0aW5ncyBmb3IgSnVtcCBUbyBMaW5rLid9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdQcmVzZW50YXRpb24nKVxuICAgICAgICAgICAgLnNldERlc2MoJ0hvdyB0byBzaG93IGxpbmtzJylcbiAgICAgICAgICAgIC5hZGREcm9wZG93bihjYiA9PiB7IGNiXG4gICAgICAgICAgICAgICAgLmFkZE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgICAgICBcInBvcG92ZXJzXCI6ICdQb3BvdmVycycsXG4gICAgICAgICAgICAgICAgICAgIFwibW9kYWxcIjogJ01vZGFsJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1vZGUpXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZTogTGlua0hpbnRNb2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1vZGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKCdDaGFyYWN0ZXJzIHVzZWQgZm9yIGxpbmsgaGludHMnKVxuICAgICAgICAgICAgLnNldERlc2MoJ1RoZSBjaGFyYWN0ZXJzIHBsYWNlZCBuZXh0IHRvIGVhY2ggbGluayBhZnRlciBlbnRlciBsaW5rLWhpbnQgbW9kZS4nKVxuICAgICAgICAgICAgLmFkZFRleHQoY2IgPT4ge1xuICAgICAgICAgICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmxldHRlcnMpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubGV0dGVycyA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0p1bXAgVG8gQW55d2hlcmUnKVxuICAgICAgICAgICAgLnNldERlc2MoXCJSZWdleCBiYXNlZCBuYXZpZ2F0aW5nIGluIGVkaXRvciBtb2RlXCIpXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdDdXN0b20gUmVnZXgnKVxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5qdW1wVG9Bbnl3aGVyZVJlZ2V4KVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuanVtcFRvQW55d2hlcmVSZWdleCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbIlBsdWdpbiIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7QUFDekMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BGLFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFHLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUNGO0FBQ08sU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBSyxJQUFJO0FBQzdDLFFBQVEsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsK0JBQStCLENBQUMsQ0FBQztBQUNsRyxJQUFJ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QUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVB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LENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLEdBQUcsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQyxDQUFDO2FBQzdGO1lBRUQsT0FBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDNUMsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLEdBQUcsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQyxDQUFDO2FBQzdGO1lBRUQsT0FBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDMUMsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLEdBQUcsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQyxDQUFBO2FBQzVGO1lBRUQsT0FBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckMsSUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLEdBQUcsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxVQUFBLEVBQUUsQ0FBQyxDQUFBO2FBQzVGO1lBRUQsSUFBTSxlQUFlLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV2RSxJQUFNLGVBQWUsR0FBcUIsRUFBRSxDQUFDO1lBQzdDLGNBQWM7aUJBQ1QsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBQSxDQUFDO2lCQUNoQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUUsQ0FBQztnQkFDakIsZUFBZSxDQUFDLElBQUksWUFBRyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFLLFFBQVEsRUFBRSxDQUFDO2FBQ3BFLENBQUMsQ0FBQztZQUVQLE9BQU8sZUFBZSxDQUFDO1NBQzFCLENBQUE7UUFFRCx3QkFBa0IsR0FBRyxVQUFDLFlBQW9CO1lBQ3RDLElBQU0sUUFBUSxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBRXBELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7O1lBR3JGLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXJELElBQU0sUUFBUSxrQkFBSSxFQUFFLEdBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFckUsSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFBO1lBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN0QyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0QyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsWUFBWSxFQUFFO3dCQUN2QyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNCLElBQUksTUFBTSxLQUFLLEVBQUUsRUFBRTs0QkFDZixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQ0FDNUIsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs2QkFDaEM7eUJBQ0o7NkJBQU07NEJBQ0gsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUE7eUJBQ3hDO3FCQUNKO3lCQUFNO3dCQUNILE1BQU07cUJBQ1Q7aUJBQ0o7YUFDSjtZQUVELE9BQU8sZUFBZSxDQUFDO1NBQzFCLENBQUE7UUFFRCxrQkFBWSxHQUFHLFVBQUMsU0FBeUI7WUFDckMsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxPQUFPLENBQUMsU0FBUyxHQUFJLGlVQVMxQixDQUFDO1lBQ0ksT0FBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbkMsSUFBTSxNQUFNLEdBQUcsVUFBQyxPQUFlO2dCQUMzQixJQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QyxFQUFFLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztnQkFDdkIsT0FBTyxFQUFFLENBQUM7YUFDYixDQUFDO1lBRUYsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQy9ELFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFzQjtnQkFDckMsT0FBQSxjQUFjLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7YUFBQSxDQUNoRixDQUFDO1NBQ0wsQ0FBQTtRQUVELDRCQUFzQixHQUFHLFVBQUMscUJBQWtDLEVBQUUsU0FBNEI7WUFDdEYsS0FBcUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTLEVBQUU7Z0JBQTNCLElBQUksUUFBUSxrQkFBQTtnQkFDYixJQUFNLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pELFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO2dCQUMzQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFFN0MsVUFBVSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUN6QyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQixVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ2xDO1NBQ0osQ0FBQTtRQUVELDJCQUFxQixHQUFHLFVBQUMsUUFBZ0IsRUFBRSxVQUE0QjtZQUNuRSxJQUFNLG1CQUFtQixHQUFHLFVBQUMsT0FBZTtnQkFDeEMsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0IsVUFBVSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7Z0JBQy9CLE9BQU8sVUFBVSxDQUFDO2FBQ3JCLENBQUE7WUFFRCxJQUFNLFVBQVUsR0FBRyxVQUFDLFFBQWdCLEVBQUUsUUFBd0I7Z0JBQzFELElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztnQkFFbEQsT0FBUSxRQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNoRyxDQUFBO1lBRUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUEsQ0FBQyxDQUFDO1NBQ3BELENBQUE7O0tBQ0o7SUEzYVMsMkJBQU0sR0FBWjs7Ozs7O3dCQUNJLEtBQUEsSUFBSSxDQUFBO3dCQUFZLHFCQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQTs7d0JBQXJDLEdBQUssUUFBUSxHQUFHLENBQUEsU0FBcUIsS0FBSSxJQUFJLFFBQVEsRUFBRSxDQUFDO3dCQUV4RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFFbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQzs0QkFDWixFQUFFLEVBQUUsdUJBQXVCOzRCQUMzQixJQUFJLEVBQUUsY0FBYzs0QkFDcEIsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7NEJBQy9CLE9BQU8sRUFBRSxDQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDO3lCQUM5QyxDQUFDLENBQUM7d0JBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQzs0QkFDWixFQUFFLEVBQUUsMkJBQTJCOzRCQUMvQixJQUFJLEVBQUUsd0JBQXdCOzRCQUM5QixRQUFRLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjs0QkFDaEMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7eUJBQy9DLENBQUMsQ0FBQzs7Ozs7S0FDTjtJQUVELDZCQUFRLEdBQVI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDakQ7SUF1SEQsNkNBQXdCLEdBQXhCLFVBQXlCLE1BQW1CLEVBQUUsRUFBZTtRQUN6RCxPQUFPLEVBQUUsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQTtLQUNsRztJQXNHRCx1Q0FBa0IsR0FBbEIsVUFBbUIsUUFBZ0I7O1FBRXpCLElBQUEsS0FBZSxRQUFRLENBQUMsV0FBVyxFQUFFLEVBQW5DLElBQUksVUFBQSxFQUFFLEVBQUUsUUFBMkIsQ0FBQTtRQUMzQyxJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtRQUMzRCxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQTtRQUUxRSxPQUFPLEVBQUUsU0FBUyxXQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUUsQ0FBQztLQUM5QjtJQStLTCxpQkFBQztBQUFELENBaGJBLENBQXdDQSxlQUFNLEdBZ2I3QztBQUVEO0lBQXlCLDhCQUFnQjtJQUdyQyxvQkFBWSxHQUFRLEVBQUUsTUFBa0I7UUFBeEMsWUFDSSxrQkFBTSxHQUFHLEVBQUUsTUFBTSxDQUFDLFNBR3JCO1FBREcsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7O0tBQ3ZCO0lBRUQsNEJBQU8sR0FBUDtRQUFBLGlCQTZDQztRQTVDUSxJQUFBLFdBQVcsR0FBSSxJQUFJLFlBQVIsQ0FBUztRQUV6QixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFcEIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsNEJBQTRCLEVBQUMsQ0FBQyxDQUFDO1FBRWpFLElBQUlDLGdCQUFPLENBQUMsV0FBVyxDQUFDO2FBQ25CLE9BQU8sQ0FBQyxjQUFjLENBQUM7YUFDdkIsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2FBQzVCLFdBQVcsQ0FBQyxVQUFBLEVBQUU7WUFBTSxFQUFFO2lCQUNsQixVQUFVLENBQUM7Z0JBQ1IsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLE9BQU8sRUFBRSxPQUFPO2FBQ25CLENBQUM7aUJBQ0QsUUFBUSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztpQkFDbkMsUUFBUSxDQUFDLFVBQUMsS0FBbUI7Z0JBQzFCLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ2xDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDOUMsQ0FBQyxDQUFBO1NBQ0wsQ0FBQyxDQUFDO1FBRVAsSUFBSUEsZ0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLGdDQUFnQyxDQUFDO2FBQ3pDLE9BQU8sQ0FBQyxxRUFBcUUsQ0FBQzthQUM5RSxPQUFPLENBQUMsVUFBQSxFQUFFO1lBQ1AsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7aUJBQ3BDLFFBQVEsQ0FBQyxVQUFDLEtBQWE7Z0JBQ3BCLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7Z0JBQ3BDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7YUFDN0MsQ0FBQyxDQUFBO1NBQ1QsQ0FBQyxDQUFDO1FBRVAsSUFBSUEsZ0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLGtCQUFrQixDQUFDO2FBQzNCLE9BQU8sQ0FBQyx1Q0FBdUMsQ0FBQzthQUNoRCxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ1YsT0FBQSxJQUFJO2lCQUNILGNBQWMsQ0FBQyxjQUFjLENBQUM7aUJBQzlCLFFBQVEsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztpQkFDbEQsUUFBUSxDQUFDLFVBQU8sS0FBSzs7Ozs0QkFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDOzRCQUNqRCxxQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFBOzs0QkFBaEQsU0FBZ0QsQ0FBQzs7OztpQkFDcEQsQ0FBQztTQUFBLENBQ0wsQ0FBQztLQUNUO0lBQ0wsaUJBQUM7QUFBRCxDQXZEQSxDQUF5QkMseUJBQWdCOzs7OyJ9
