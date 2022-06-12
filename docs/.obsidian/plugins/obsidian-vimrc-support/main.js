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

const modifiers = /^(CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|AltGr|Option|Alt|Shift|Super)/i;
const keyCodes = /^(Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z)!@#$%^&*(:+<_>?~{|}";=,\-./`[\\\]'])/i;
const UNSUPPORTED = {};

function _command(accelerator, event, modifier) {
	if (process.platform !== 'darwin') {
		return UNSUPPORTED;
	}

	if (event.metaKey) {
		throw new Error('Double `Command` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {metaKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _super(accelerator, event, modifier) {
	if (event.metaKey) {
		throw new Error('Double `Super` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {metaKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _commandorcontrol(accelerator, event, modifier) {
	if (process.platform === 'darwin') {
		if (event.metaKey) {
			throw new Error('Double `Command` modifier specified.');
		}

		return {
			event: Object.assign({}, event, {metaKey: true}),
			accelerator: accelerator.slice(modifier.length)
		};
	}

	if (event.ctrlKey) {
		throw new Error('Double `Control` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {ctrlKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _alt(accelerator, event, modifier) {
	if (modifier === 'option' && process.platform !== 'darwin') {
		return UNSUPPORTED;
	}

	if (event.altKey) {
		throw new Error('Double `Alt` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {altKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _shift(accelerator, event, modifier) {
	if (event.shiftKey) {
		throw new Error('Double `Shift` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {shiftKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function _control(accelerator, event, modifier) {
	if (event.ctrlKey) {
		throw new Error('Double `Control` modifier specified.');
	}

	return {
		event: Object.assign({}, event, {ctrlKey: true}),
		accelerator: accelerator.slice(modifier.length)
	};
}

function reduceModifier({accelerator, event}, modifier) {
	switch (modifier) {
		case 'command':
		case 'cmd': {
			return _command(accelerator, event, modifier);
		}

		case 'super': {
			return _super(accelerator, event, modifier);
		}

		case 'control':
		case 'ctrl': {
			return _control(accelerator, event, modifier);
		}

		case 'commandorcontrol':
		case 'cmdorctrl': {
			return _commandorcontrol(accelerator, event, modifier);
		}

		case 'option':
		case 'altgr':
		case 'alt': {
			return _alt(accelerator, event, modifier);
		}

		case 'shift': {
			return _shift(accelerator, event, modifier);
		}

		default:
			console.error(modifier);
	}
}

function reducePlus({accelerator, event}) {
	return {
		event,
		accelerator: accelerator.trim().slice(1)
	};
}

const virtualKeyCodes = {
	0: 'Digit0',
	1: 'Digit1',
	2: 'Digit2',
	3: 'Digit3',
	4: 'Digit4',
	5: 'Digit5',
	6: 'Digit6',
	7: 'Digit7',
	8: 'Digit8',
	9: 'Digit9',
	'-': 'Minus',
	'=': 'Equal',
	Q: 'KeyQ',
	W: 'KeyW',
	E: 'KeyE',
	R: 'KeyR',
	T: 'KeyT',
	Y: 'KeyY',
	U: 'KeyU',
	I: 'KeyI',
	O: 'KeyO',
	P: 'KeyP',
	'[': 'BracketLeft',
	']': 'BracketRight',
	A: 'KeyA',
	S: 'KeyS',
	D: 'KeyD',
	F: 'KeyF',
	G: 'KeyG',
	H: 'KeyH',
	J: 'KeyJ',
	K: 'KeyK',
	L: 'KeyL',
	';': 'Semicolon',
	'\'': 'Quote',
	'`': 'Backquote',
	'/': 'Backslash',
	Z: 'KeyZ',
	X: 'KeyX',
	C: 'KeyC',
	V: 'KeyV',
	B: 'KeyB',
	N: 'KeyN',
	M: 'KeyM',
	',': 'Comma',
	'.': 'Period',
	'\\': 'Slash',
	' ': 'Space'
};

function reduceKey({accelerator, event}, key) {
	if (key.length > 1 || event.key) {
		throw new Error(`Unvalid keycode \`${key}\`.`);
	}

	const code =
		key.toUpperCase() in virtualKeyCodes ?
			virtualKeyCodes[key.toUpperCase()] :
			null;

	return {
		event: Object.assign({}, event, {key}, code ? {code} : null),
		accelerator: accelerator.trim().slice(key.length)
	};
}

const domKeys = Object.assign(Object.create(null), {
	plus: 'Add',
	space: 'Space',
	tab: 'Tab',
	backspace: 'Backspace',
	delete: 'Delete',
	insert: 'Insert',
	return: 'Return',
	enter: 'Return',
	up: 'ArrowUp',
	down: 'ArrowDown',
	left: 'ArrowLeft',
	right: 'ArrowRight',
	home: 'Home',
	end: 'End',
	pageup: 'PageUp',
	pagedown: 'PageDown',
	escape: 'Escape',
	esc: 'Escape',
	volumeup: 'AudioVolumeUp',
	volumedown: 'AudioVolumeDown',
	volumemute: 'AudioVolumeMute',
	medianexttrack: 'MediaTrackNext',
	mediaprevioustrack: 'MediaTrackPrevious',
	mediastop: 'MediaStop',
	mediaplaypause: 'MediaPlayPause',
	printscreen: 'PrintScreen'
});

// Add function keys
for (let i = 1; i <= 24; i++) {
	domKeys[`f${i}`] = `F${i}`;
}

function reduceCode({accelerator, event}, {code, key}) {
	if (event.code) {
		throw new Error(`Duplicated keycode \`${key}\`.`);
	}

	return {
		event: Object.assign({}, event, {key}, code ? {code} : null),
		accelerator: accelerator.trim().slice((key && key.length) || 0)
	};
}

/**
 * This function transform an Electron Accelerator string into
 * a DOM KeyboardEvent object.
 *
 * @param  {string} accelerator an Electron Accelerator string, e.g. `Ctrl+C` or `Shift+Space`.
 * @return {object} a DOM KeyboardEvent object derivate from the `accelerator` argument.
 */
function toKeyEvent(accelerator) {
	let state = {accelerator, event: {}};
	while (state.accelerator !== '') {
		const modifierMatch = state.accelerator.match(modifiers);
		if (modifierMatch) {
			const modifier = modifierMatch[0].toLowerCase();
			state = reduceModifier(state, modifier);
			if (state === UNSUPPORTED) {
				return {unsupportedKeyForPlatform: true};
			}
		} else if (state.accelerator.trim()[0] === '+') {
			state = reducePlus(state);
		} else {
			const codeMatch = state.accelerator.match(keyCodes);
			if (codeMatch) {
				const code = codeMatch[0].toLowerCase();
				if (code in domKeys) {
					state = reduceCode(state, {
						code: domKeys[code],
						key: code
					});
				} else {
					state = reduceKey(state, code);
				}
			} else {
				throw new Error(`Unvalid accelerator: "${state.accelerator}"`);
			}
		}
	}

	return state.event;
}

var keyboardeventFromElectronAccelerator = {
	UNSUPPORTED,
	reduceModifier,
	reducePlus,
	reduceKey,
	reduceCode,
	toKeyEvent
};

var DEFAULT_SETTINGS = {
    vimrcFileName: ".obsidian.vimrc",
    displayChord: false,
    displayVimMode: false,
    fixedNormalModeLayout: false,
    capturedKeyboardMap: {}
};
// NOTE: to future maintainers, please make sure all mapping commands are included in this array.
var mappingCommands = [
    "map",
    "nmap",
    "noremap",
];
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var VimrcPlugin = /** @class */ (function (_super) {
    __extends(VimrcPlugin, _super);
    function VimrcPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastYankBuffer = new Array(0);
        _this.lastSystemClipboard = "";
        _this.yankToSystemClipboard = false;
        _this.currentKeyChord = [];
        _this.vimChordStatusBar = null;
        _this.vimStatusBar = null;
        _this.currentVimStatus = "\uD83D\uDFE2" /* normal */;
        _this.customVimKeybinds = {};
        _this.currentSelection = null;
        _this.isInsertMode = false;
        return _this;
    }
    VimrcPlugin.prototype.captureKeyboardLayout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyMap, layout, doneIterating;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keyMap = {};
                        return [4 /*yield*/, navigator.keyboard.getLayoutMap()];
                    case 1:
                        layout = _a.sent();
                        doneIterating = new Promise(function (resolve, reject) {
                            var counted = 0;
                            layout.forEach(function (value, index) {
                                keyMap[index] = value;
                                counted += 1;
                                if (counted === layout.size)
                                    resolve();
                            });
                        });
                        return [4 /*yield*/, doneIterating];
                    case 2:
                        _a.sent();
                        new obsidian.Notice('Keyboard layout captured');
                        return [2 /*return*/, keyMap];
                }
            });
        });
    };
    VimrcPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('loading Vimrc plugin');
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new SettingsTab(this.app, this));
                        this.registerEvent(this.app.workspace.on('file-open', function (file) {
                            var VIMRC_FILE_NAME = _this.settings.vimrcFileName;
                            _this.app.vault.adapter.read(VIMRC_FILE_NAME).
                                then(function (lines) { return _this.readVimInit(lines); }).
                                catch(function (error) { console.log('Error loading vimrc file', VIMRC_FILE_NAME, 'from the vault root', error); });
                        }));
                        this.registerDomEvent(document, 'click', function () {
                            _this.captureYankBuffer();
                        });
                        this.registerDomEvent(document, 'keyup', function () {
                            _this.captureYankBuffer();
                        });
                        this.registerDomEvent(document, 'focusin', function () {
                            _this.captureYankBuffer();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    VimrcPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        data = _a.sent();
                        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
                        return [2 /*return*/];
                }
            });
        });
    };
    VimrcPlugin.prototype.saveSettings = function () {
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
    VimrcPlugin.prototype.onunload = function () {
        console.log('unloading Vimrc plugin (but Vim commands that were already loaded will still work)');
    };
    VimrcPlugin.prototype.getActiveView = function () {
        return this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    };
    VimrcPlugin.prototype.getEditor = function (view) {
        var _a;
        return (_a = view.sourceMode) === null || _a === void 0 ? void 0 : _a.cmEditor;
    };
    VimrcPlugin.prototype.readVimInit = function (vimCommands) {
        var _this = this;
        var view = this.getActiveView();
        if (view) {
            var cmEditor = this.getEditor(view);
            if (cmEditor && !CodeMirror.Vim.loadedVimrc) {
                this.defineBasicCommands(CodeMirror.Vim);
                this.defineSendKeys(CodeMirror.Vim);
                this.defineObCommand(CodeMirror.Vim);
                this.defineSurround(CodeMirror.Vim);
                this.defineFixedLayout();
                CodeMirror.on(cmEditor, "vim-mode-change", function (modeObj) {
                    _this.isInsertMode = modeObj.mode === 'insert';
                });
                // Record the position of selections
                CodeMirror.on(cmEditor, "cursorActivity", function (cm) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.currentSelection = cm.listSelections()[0];
                        return [2 /*return*/];
                    });
                }); });
                vimCommands.split("\n").forEach(function (line, index, arr) {
                    if (line.trim().length > 0 && line.trim()[0] != '"') {
                        var split = line.split(" ");
                        if (mappingCommands.includes(split[0])) {
                            // Have to do this because "vim-command-done" event doesn't actually work properly, or something.
                            this.customVimKeybinds[split[1]] = true;
                        }
                        CodeMirror.Vim.handleEx(cmEditor, line);
                    }
                }.bind(this) // Faster than an arrow function. https://stackoverflow.com/questions/50375440/binding-vs-arrow-function-for-react-onclick-event
                );
                this.prepareChordDisplay();
                this.prepareVimModeDisplay();
                // Make sure that we load it just once per CodeMirror instance.
                // This is supposed to work because the Vim state is kept at the keymap level, hopefully
                // there will not be bugs caused by operations that are kept at the object level instead
                CodeMirror.Vim.loadedVimrc = true;
            }
        }
    };
    VimrcPlugin.prototype.defineBasicCommands = function (vimObject) {
        var _this = this;
        vimObject.defineOption('clipboard', '', 'string', ['clip'], function (value, cm) {
            if (value) {
                if (value.trim() == 'unnamed' || value.trim() == 'unnamedplus') {
                    if (!_this.yankToSystemClipboard) {
                        _this.yankToSystemClipboard = true;
                        console.log("Vim is now set to yank to system clipboard.");
                    }
                }
                else {
                    throw new Error("Unrecognized clipboard option, supported are 'unnamed' and 'unnamedplus' (and they do the same)");
                }
            }
        });
        vimObject.defineOption('tabstop', 4, 'number', [], function (value, cm) {
            if (value && cm) {
                cm.setOption('tabSize', value);
            }
        });
        vimObject.defineEx('iunmap', '', function (cm, params) {
            if (params.argString.trim()) {
                CodeMirror.Vim.unmap(params.argString.trim(), 'insert');
            }
        });
        vimObject.defineEx('noremap', '', function (cm, params) {
            var _a;
            if (!((_a = params === null || params === void 0 ? void 0 : params.args) === null || _a === void 0 ? void 0 : _a.length)) {
                throw new Error('Invalid mapping: noremap');
            }
            if (params.argString.trim()) {
                CodeMirror.Vim.noremap.apply(CodeMirror.Vim, params.args);
            }
        });
        // Allow the user to register an Ex command
        vimObject.defineEx('exmap', '', function (cm, params) {
            var _a;
            if (((_a = params === null || params === void 0 ? void 0 : params.args) === null || _a === void 0 ? void 0 : _a.length) && params.args.length < 2) {
                throw new Error("exmap requires at least 2 parameters: [name] [actions...]");
            }
            var commandName = params.args[0];
            params.args.shift();
            var commandContent = params.args.join(' ');
            // The content of the user's Ex command is just the remaining parameters of the exmap command
            CodeMirror.Vim.defineEx(commandName, '', function (cm, params) {
                CodeMirror.Vim.handleEx(cm, commandContent);
            });
        });
    };
    VimrcPlugin.prototype.defineSendKeys = function (vimObject) {
        var _this = this;
        vimObject.defineEx('sendkeys', '', function (cm, params) { return __awaiter(_this, void 0, void 0, function () {
            var allGood, events, _i, _a, key, delay, keyEvent, _b, events_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!((_c = params === null || params === void 0 ? void 0 : params.args) === null || _c === void 0 ? void 0 : _c.length)) {
                            console.log(params);
                            throw new Error("The sendkeys command requires a list of keys, e.g. sendKeys Ctrl+p a b Enter");
                        }
                        allGood = true;
                        events = [];
                        _i = 0, _a = params.args;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        key = _a[_i];
                        if (!key.startsWith('wait')) return [3 /*break*/, 3];
                        delay = key.slice(4);
                        return [4 /*yield*/, sleep(delay * 1000)];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        keyEvent = null;
                        try {
                            keyEvent = new KeyboardEvent('keydown', keyboardeventFromElectronAccelerator.toKeyEvent(key));
                            events.push(keyEvent);
                        }
                        catch (e) {
                            allGood = false;
                            throw new Error("Key '" + key + "' couldn't be read as an Electron Accelerator");
                        }
                        if (allGood) {
                            for (_b = 0, events_1 = events; _b < events_1.length; _b++) {
                                keyEvent = events_1[_b];
                                window.postMessage(JSON.parse(JSON.stringify(keyEvent)), '*');
                            }
                            // view.containerEl.dispatchEvent(keyEvent);
                        }
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    VimrcPlugin.prototype.defineObCommand = function (vimObject) {
        var _this = this;
        vimObject.defineEx('obcommand', '', function (cm, params) { return __awaiter(_this, void 0, void 0, function () {
            var availableCommands, view, editor, command, callback, checkCallback, editorCallback, editorCheckCallback;
            var _a;
            return __generator(this, function (_b) {
                availableCommands = this.app.commands.commands;
                if (!((_a = params === null || params === void 0 ? void 0 : params.args) === null || _a === void 0 ? void 0 : _a.length) || params.args.length != 1) {
                    console.log("Available commands: " + Object.keys(availableCommands).join('\n'));
                    throw new Error("obcommand requires exactly 1 parameter");
                }
                view = this.getActiveView();
                editor = view.editor;
                command = params.args[0];
                if (command in availableCommands) {
                    callback = availableCommands[command].callback;
                    checkCallback = availableCommands[command].checkCallback;
                    editorCallback = availableCommands[command].editorCallback;
                    editorCheckCallback = availableCommands[command].editorCheckCallback;
                    if (editorCheckCallback)
                        editorCheckCallback(false, editor, view);
                    else if (editorCallback)
                        editorCallback(editor, view);
                    else if (checkCallback)
                        checkCallback(false);
                    else if (callback)
                        callback();
                    else
                        throw new Error("Command " + command + " doesn't have an Obsidian callback");
                }
                else
                    throw new Error("Command " + command + " was not found, try 'obcommand' with no params to see in the developer console what's available");
                return [2 /*return*/];
            });
        }); });
    };
    VimrcPlugin.prototype.defineSurround = function (vimObject) {
        var _this = this;
        // Function to surround selected text or highlighted word.
        var surroundFunc = function (cm, params) {
            var _a;
            if (!((_a = params === null || params === void 0 ? void 0 : params.args) === null || _a === void 0 ? void 0 : _a.length) || params.args.length != 2) {
                throw new Error("surround requires exactly 2 parameters: prefix and postfix text.");
            }
            var beginning = params.args[0]; // Get the beginning surround text
            var ending = params.args[1]; // Get the ending surround text
            if (_this.currentSelection.anchor == _this.currentSelection.head) {
                // No range of selected text, so select word.
                var wordRange = cm.findWordAt(_this.currentSelection.anchor);
                var currText = cm.getRange(wordRange.from(), wordRange.to());
                cm.replaceRange(beginning + currText + ending, wordRange.from(), wordRange.to());
            }
            else {
                var currText = cm.getRange(_this.currentSelection.from(), _this.currentSelection.to());
                cm.replaceRange(beginning + currText + ending, _this.currentSelection.from(), _this.currentSelection.to());
            }
        };
        vimObject.defineEx("surround", "", surroundFunc);
        vimObject.defineEx("pasteinto", "", function (cm, params) {
            // Using the register for when this.yankToSystemClipboard == false
            surroundFunc(cm, { args: ["[", "](" + vimObject.Vim.getRegisterController().getRegister('yank').keyBuffer + ")"] });
        });
        var cmEditor = this.getEditor(this.getActiveView());
        // Handle the surround dialog input
        var surroundDialogCallback = function (value) {
            if ((/^\[+$/).test(value)) { // check for 1-inf [ and match them with ]
                surroundFunc(cmEditor, { args: [value, "]".repeat(value.length)] });
            }
            else if ((/^\(+$/).test(value)) { // check for 1-inf ( and match them with )
                surroundFunc(cmEditor, { args: [value, ")".repeat(value.length)] });
            }
            else if ((/^\{+$/).test(value)) { // check for 1-inf { and match them with }
                surroundFunc(cmEditor, { args: [value, "}".repeat(value.length)] });
            }
            else { // Else, just put it before and after.
                surroundFunc(cmEditor, { args: [value, value] });
            }
        };
        vimObject.defineOperator("surroundOperator", function (cm, args, ranges) {
            var p = "<span>Surround with: <input type='text'></span>";
            cm.openDialog(p, surroundDialogCallback, { bottom: true, selectValueOnOpen: false });
        });
        vimObject.mapCommand("<A-y>s", "operator", "surroundOperator");
    };
    VimrcPlugin.prototype.captureYankBuffer = function () {
        var _this = this;
        if (this.yankToSystemClipboard) {
            var currentBuffer = CodeMirror.Vim.getRegisterController().getRegister('yank').keyBuffer;
            if (currentBuffer != this.lastYankBuffer) {
                if (this.lastYankBuffer.length > 0 && currentBuffer.length > 0 && currentBuffer[0]) {
                    navigator.clipboard.writeText(currentBuffer[0]);
                    navigator.clipboard.readText().then(function (value) { _this.lastSystemClipboard = value; });
                }
                this.lastYankBuffer = currentBuffer;
                return;
            }
            var currentClipboard = navigator.clipboard.readText().then(function (value) {
                if (value != _this.lastSystemClipboard) {
                    var yankRegister = CodeMirror.Vim.getRegisterController().getRegister('yank');
                    yankRegister.setText(value);
                    _this.lastYankBuffer = yankRegister.keyBuffer;
                    _this.lastSystemClipboard = value;
                }
            });
        }
    };
    VimrcPlugin.prototype.prepareChordDisplay = function () {
        var _this = this;
        if (this.settings.displayChord) {
            // Add status bar item
            this.vimChordStatusBar = this.addStatusBarItem();
            // Move vimChordStatusBar to the leftmost position and center it.
            var parent_1 = this.vimChordStatusBar.parentElement;
            this.vimChordStatusBar.parentElement.insertBefore(this.vimChordStatusBar, parent_1.firstChild);
            this.vimChordStatusBar.style.marginRight = "auto";
            var cmEditor = this.getEditor(this.getActiveView());
            // See https://codemirror.net/doc/manual.html#vimapi_events for events.
            CodeMirror.on(cmEditor, "vim-keypress", function (vimKey) { return __awaiter(_this, void 0, void 0, function () {
                var tempS, _i, _a, s;
                return __generator(this, function (_b) {
                    if (vimKey != "<Esc>") { // TODO figure out what to actually look for to exit commands.
                        this.currentKeyChord.push(vimKey);
                        if (this.customVimKeybinds[this.currentKeyChord.join("")] != undefined) { // Custom key chord exists.
                            this.currentKeyChord = [];
                        }
                    }
                    else {
                        this.currentKeyChord = [];
                    }
                    tempS = "";
                    for (_i = 0, _a = this.currentKeyChord; _i < _a.length; _i++) {
                        s = _a[_i];
                        tempS += " " + s;
                    }
                    if (tempS != "") {
                        tempS += "-";
                    }
                    this.vimChordStatusBar.setText(tempS);
                    return [2 /*return*/];
                });
            }); });
            CodeMirror.on(cmEditor, "vim-command-done", function (reason) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.vimChordStatusBar.setText("");
                    this.currentKeyChord = [];
                    return [2 /*return*/];
                });
            }); });
        }
    };
    VimrcPlugin.prototype.prepareVimModeDisplay = function () {
        var _this = this;
        if (this.settings.displayVimMode) {
            this.vimStatusBar = this.addStatusBarItem(); // Add status bar item
            this.vimStatusBar.setText("\uD83D\uDFE2" /* normal */); // Init the vimStatusBar with normal mode
            var cmEditor = this.getEditor(this.getActiveView());
            // See https://codemirror.net/doc/manual.html#vimapi_events for events.
            CodeMirror.on(cmEditor, "vim-mode-change", function (modeObj) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (modeObj.mode) {
                        case "insert":
                            this.currentVimStatus = "\uD83D\uDFE0" /* insert */;
                            break;
                        case "normal":
                            this.currentVimStatus = "\uD83D\uDFE2" /* normal */;
                            break;
                        case "visual":
                            this.currentVimStatus = "\uD83D\uDFE1" /* visual */;
                            break;
                        case "replace":
                            this.currentVimStatus = "\uD83D\uDD34" /* replace */;
                            break;
                    }
                    this.vimStatusBar.setText(this.currentVimStatus);
                    return [2 /*return*/];
                });
            }); });
        }
    };
    VimrcPlugin.prototype.defineFixedLayout = function () {
        var _this = this;
        var cmEditor = this.getEditor(this.getActiveView());
        cmEditor.on('keydown', function (instance, ev) {
            if (_this.settings.fixedNormalModeLayout) {
                var keyMap = _this.settings.capturedKeyboardMap;
                if (!_this.isInsertMode && !ev.shiftKey &&
                    ev.code in keyMap && ev.key != keyMap[ev.code]) {
                    CodeMirror.Vim.handleKey(instance, keyMap[ev.code], 'mapping');
                    ev.preventDefault();
                    return false;
                }
            }
        });
    };
    return VimrcPlugin;
}(obsidian.Plugin));
var SettingsTab = /** @class */ (function (_super) {
    __extends(SettingsTab, _super);
    function SettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Vimrc Settings' });
        new obsidian.Setting(containerEl)
            .setName('Vimrc file name')
            .setDesc('Relative to vault directory (requires restart)')
            .addText(function (text) {
            text.setPlaceholder(DEFAULT_SETTINGS.vimrcFileName);
            text.setValue(_this.plugin.settings.vimrcFileName || DEFAULT_SETTINGS.vimrcFileName);
            text.onChange(function (value) {
                _this.plugin.settings.vimrcFileName = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Vim chord display')
            .setDesc('Displays the current chord until completion. Ex: "<Space> f-" (requires restart)')
            .addToggle(function (toggle) {
            toggle.setValue(_this.plugin.settings.displayChord || DEFAULT_SETTINGS.displayChord);
            toggle.onChange(function (value) {
                _this.plugin.settings.displayChord = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Vim mode display')
            .setDesc('Displays the current vim mode (requires restart)')
            .addToggle(function (toggle) {
            toggle.setValue(_this.plugin.settings.displayVimMode || DEFAULT_SETTINGS.displayVimMode);
            toggle.onChange(function (value) {
                _this.plugin.settings.displayVimMode = value;
                _this.plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Use a fixed keyboard layout for Normal mode')
            .setDesc('Define a keyboard layout to always use when in Normal mode, regardless of the input language (experimental).')
            .addButton(function (button) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                button.setButtonText('Capture current layout');
                button.onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.plugin.settings;
                                return [4 /*yield*/, this.plugin.captureKeyboardLayout()];
                            case 1:
                                _a.capturedKeyboardMap = _b.sent();
                                this.plugin.saveSettings();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); })
            .addToggle(function (toggle) {
            toggle.setValue(_this.plugin.settings.fixedNormalModeLayout || DEFAULT_SETTINGS.fixedNormalModeLayout);
            toggle.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.plugin.settings.fixedNormalModeLayout = value;
                            if (!(value && Object.keys(this.plugin.settings.capturedKeyboardMap).length === 0)) return [3 /*break*/, 2];
                            _a = this.plugin.settings;
                            return [4 /*yield*/, this.plugin.captureKeyboardLayout()];
                        case 1:
                            _a.capturedKeyboardMap = _b.sent();
                            _b.label = 2;
                        case 2:
                            this.plugin.saveSettings();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return SettingsTab;
}(obsidian.PluginSettingTab));

module.exports = VimrcPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWZyb20tZWxlY3Ryb24tYWNjZWxlcmF0b3IvaW5kZXguanMiLCJtYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImNvbnN0IG1vZGlmaWVycyA9IC9eKENvbW1hbmRPckNvbnRyb2x8Q21kT3JDdHJsfENvbW1hbmR8Q21kfENvbnRyb2x8Q3RybHxBbHRHcnxPcHRpb258QWx0fFNoaWZ0fFN1cGVyKS9pO1xuY29uc3Qga2V5Q29kZXMgPSAvXihQbHVzfFNwYWNlfFRhYnxCYWNrc3BhY2V8RGVsZXRlfEluc2VydHxSZXR1cm58RW50ZXJ8VXB8RG93bnxMZWZ0fFJpZ2h0fEhvbWV8RW5kfFBhZ2VVcHxQYWdlRG93bnxFc2NhcGV8RXNjfFZvbHVtZVVwfFZvbHVtZURvd258Vm9sdW1lTXV0ZXxNZWRpYU5leHRUcmFja3xNZWRpYVByZXZpb3VzVHJhY2t8TWVkaWFTdG9wfE1lZGlhUGxheVBhdXNlfFByaW50U2NyZWVufEYyNHxGMjN8RjIyfEYyMXxGMjB8RjE5fEYxOHxGMTd8RjE2fEYxNXxGMTR8RjEzfEYxMnxGMTF8RjEwfEY5fEY4fEY3fEY2fEY1fEY0fEYzfEYyfEYxfFswLTlBLVopIUAjJCVeJiooOis8Xz4/fnt8fVwiOz0sXFwtLi9gW1xcXFxcXF0nXSkvaTtcbmNvbnN0IFVOU1VQUE9SVEVEID0ge307XG5cbmZ1bmN0aW9uIF9jb21tYW5kKGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpIHtcblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG5cdFx0cmV0dXJuIFVOU1VQUE9SVEVEO1xuXHR9XG5cblx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0RvdWJsZSBgQ29tbWFuZGAgbW9kaWZpZXIgc3BlY2lmaWVkLicpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRldmVudDogT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHttZXRhS2V5OiB0cnVlfSksXG5cdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0fTtcbn1cblxuZnVuY3Rpb24gX3N1cGVyKGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpIHtcblx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0RvdWJsZSBgU3VwZXJgIG1vZGlmaWVyIHNwZWNpZmllZC4nKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7bWV0YUtleTogdHJ1ZX0pLFxuXHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci5zbGljZShtb2RpZmllci5sZW5ndGgpXG5cdH07XG59XG5cbmZ1bmN0aW9uIF9jb21tYW5kb3Jjb250cm9sKGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpIHtcblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG5cdFx0aWYgKGV2ZW50Lm1ldGFLZXkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBDb21tYW5kYCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge21ldGFLZXk6IHRydWV9KSxcblx0XHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci5zbGljZShtb2RpZmllci5sZW5ndGgpXG5cdFx0fTtcblx0fVxuXG5cdGlmIChldmVudC5jdHJsS2V5KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYENvbnRyb2xgIG1vZGlmaWVyIHNwZWNpZmllZC4nKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7Y3RybEtleTogdHJ1ZX0pLFxuXHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci5zbGljZShtb2RpZmllci5sZW5ndGgpXG5cdH07XG59XG5cbmZ1bmN0aW9uIF9hbHQoYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcikge1xuXHRpZiAobW9kaWZpZXIgPT09ICdvcHRpb24nICYmIHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG5cdFx0cmV0dXJuIFVOU1VQUE9SVEVEO1xuXHR9XG5cblx0aWYgKGV2ZW50LmFsdEtleSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBBbHRgIG1vZGlmaWVyIHNwZWNpZmllZC4nKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7YWx0S2V5OiB0cnVlfSksXG5cdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0fTtcbn1cblxuZnVuY3Rpb24gX3NoaWZ0KGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpIHtcblx0aWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdEb3VibGUgYFNoaWZ0YCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge3NoaWZ0S2V5OiB0cnVlfSksXG5cdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnNsaWNlKG1vZGlmaWVyLmxlbmd0aClcblx0fTtcbn1cblxuZnVuY3Rpb24gX2NvbnRyb2woYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcikge1xuXHRpZiAoZXZlbnQuY3RybEtleSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignRG91YmxlIGBDb250cm9sYCBtb2RpZmllciBzcGVjaWZpZWQuJyk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge2N0cmxLZXk6IHRydWV9KSxcblx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3Iuc2xpY2UobW9kaWZpZXIubGVuZ3RoKVxuXHR9O1xufVxuXG5mdW5jdGlvbiByZWR1Y2VNb2RpZmllcih7YWNjZWxlcmF0b3IsIGV2ZW50fSwgbW9kaWZpZXIpIHtcblx0c3dpdGNoIChtb2RpZmllcikge1xuXHRcdGNhc2UgJ2NvbW1hbmQnOlxuXHRcdGNhc2UgJ2NtZCc6IHtcblx0XHRcdHJldHVybiBfY29tbWFuZChhY2NlbGVyYXRvciwgZXZlbnQsIG1vZGlmaWVyKTtcblx0XHR9XG5cblx0XHRjYXNlICdzdXBlcic6IHtcblx0XHRcdHJldHVybiBfc3VwZXIoYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcik7XG5cdFx0fVxuXG5cdFx0Y2FzZSAnY29udHJvbCc6XG5cdFx0Y2FzZSAnY3RybCc6IHtcblx0XHRcdHJldHVybiBfY29udHJvbChhY2NlbGVyYXRvciwgZXZlbnQsIG1vZGlmaWVyKTtcblx0XHR9XG5cblx0XHRjYXNlICdjb21tYW5kb3Jjb250cm9sJzpcblx0XHRjYXNlICdjbWRvcmN0cmwnOiB7XG5cdFx0XHRyZXR1cm4gX2NvbW1hbmRvcmNvbnRyb2woYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcik7XG5cdFx0fVxuXG5cdFx0Y2FzZSAnb3B0aW9uJzpcblx0XHRjYXNlICdhbHRncic6XG5cdFx0Y2FzZSAnYWx0Jzoge1xuXHRcdFx0cmV0dXJuIF9hbHQoYWNjZWxlcmF0b3IsIGV2ZW50LCBtb2RpZmllcik7XG5cdFx0fVxuXG5cdFx0Y2FzZSAnc2hpZnQnOiB7XG5cdFx0XHRyZXR1cm4gX3NoaWZ0KGFjY2VsZXJhdG9yLCBldmVudCwgbW9kaWZpZXIpO1xuXHRcdH1cblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRjb25zb2xlLmVycm9yKG1vZGlmaWVyKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZWR1Y2VQbHVzKHthY2NlbGVyYXRvciwgZXZlbnR9KSB7XG5cdHJldHVybiB7XG5cdFx0ZXZlbnQsXG5cdFx0YWNjZWxlcmF0b3I6IGFjY2VsZXJhdG9yLnRyaW0oKS5zbGljZSgxKVxuXHR9O1xufVxuXG5jb25zdCB2aXJ0dWFsS2V5Q29kZXMgPSB7XG5cdDA6ICdEaWdpdDAnLFxuXHQxOiAnRGlnaXQxJyxcblx0MjogJ0RpZ2l0MicsXG5cdDM6ICdEaWdpdDMnLFxuXHQ0OiAnRGlnaXQ0Jyxcblx0NTogJ0RpZ2l0NScsXG5cdDY6ICdEaWdpdDYnLFxuXHQ3OiAnRGlnaXQ3Jyxcblx0ODogJ0RpZ2l0OCcsXG5cdDk6ICdEaWdpdDknLFxuXHQnLSc6ICdNaW51cycsXG5cdCc9JzogJ0VxdWFsJyxcblx0UTogJ0tleVEnLFxuXHRXOiAnS2V5VycsXG5cdEU6ICdLZXlFJyxcblx0UjogJ0tleVInLFxuXHRUOiAnS2V5VCcsXG5cdFk6ICdLZXlZJyxcblx0VTogJ0tleVUnLFxuXHRJOiAnS2V5SScsXG5cdE86ICdLZXlPJyxcblx0UDogJ0tleVAnLFxuXHQnWyc6ICdCcmFja2V0TGVmdCcsXG5cdCddJzogJ0JyYWNrZXRSaWdodCcsXG5cdEE6ICdLZXlBJyxcblx0UzogJ0tleVMnLFxuXHREOiAnS2V5RCcsXG5cdEY6ICdLZXlGJyxcblx0RzogJ0tleUcnLFxuXHRIOiAnS2V5SCcsXG5cdEo6ICdLZXlKJyxcblx0SzogJ0tleUsnLFxuXHRMOiAnS2V5TCcsXG5cdCc7JzogJ1NlbWljb2xvbicsXG5cdCdcXCcnOiAnUXVvdGUnLFxuXHQnYCc6ICdCYWNrcXVvdGUnLFxuXHQnLyc6ICdCYWNrc2xhc2gnLFxuXHRaOiAnS2V5WicsXG5cdFg6ICdLZXlYJyxcblx0QzogJ0tleUMnLFxuXHRWOiAnS2V5VicsXG5cdEI6ICdLZXlCJyxcblx0TjogJ0tleU4nLFxuXHRNOiAnS2V5TScsXG5cdCcsJzogJ0NvbW1hJyxcblx0Jy4nOiAnUGVyaW9kJyxcblx0J1xcXFwnOiAnU2xhc2gnLFxuXHQnICc6ICdTcGFjZSdcbn07XG5cbmZ1bmN0aW9uIHJlZHVjZUtleSh7YWNjZWxlcmF0b3IsIGV2ZW50fSwga2V5KSB7XG5cdGlmIChrZXkubGVuZ3RoID4gMSB8fCBldmVudC5rZXkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFVudmFsaWQga2V5Y29kZSBcXGAke2tleX1cXGAuYCk7XG5cdH1cblxuXHRjb25zdCBjb2RlID1cblx0XHRrZXkudG9VcHBlckNhc2UoKSBpbiB2aXJ0dWFsS2V5Q29kZXMgP1xuXHRcdFx0dmlydHVhbEtleUNvZGVzW2tleS50b1VwcGVyQ2FzZSgpXSA6XG5cdFx0XHRudWxsO1xuXG5cdHJldHVybiB7XG5cdFx0ZXZlbnQ6IE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7a2V5fSwgY29kZSA/IHtjb2RlfSA6IG51bGwpLFxuXHRcdGFjY2VsZXJhdG9yOiBhY2NlbGVyYXRvci50cmltKCkuc2xpY2Uoa2V5Lmxlbmd0aClcblx0fTtcbn1cblxuY29uc3QgZG9tS2V5cyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwge1xuXHRwbHVzOiAnQWRkJyxcblx0c3BhY2U6ICdTcGFjZScsXG5cdHRhYjogJ1RhYicsXG5cdGJhY2tzcGFjZTogJ0JhY2tzcGFjZScsXG5cdGRlbGV0ZTogJ0RlbGV0ZScsXG5cdGluc2VydDogJ0luc2VydCcsXG5cdHJldHVybjogJ1JldHVybicsXG5cdGVudGVyOiAnUmV0dXJuJyxcblx0dXA6ICdBcnJvd1VwJyxcblx0ZG93bjogJ0Fycm93RG93bicsXG5cdGxlZnQ6ICdBcnJvd0xlZnQnLFxuXHRyaWdodDogJ0Fycm93UmlnaHQnLFxuXHRob21lOiAnSG9tZScsXG5cdGVuZDogJ0VuZCcsXG5cdHBhZ2V1cDogJ1BhZ2VVcCcsXG5cdHBhZ2Vkb3duOiAnUGFnZURvd24nLFxuXHRlc2NhcGU6ICdFc2NhcGUnLFxuXHRlc2M6ICdFc2NhcGUnLFxuXHR2b2x1bWV1cDogJ0F1ZGlvVm9sdW1lVXAnLFxuXHR2b2x1bWVkb3duOiAnQXVkaW9Wb2x1bWVEb3duJyxcblx0dm9sdW1lbXV0ZTogJ0F1ZGlvVm9sdW1lTXV0ZScsXG5cdG1lZGlhbmV4dHRyYWNrOiAnTWVkaWFUcmFja05leHQnLFxuXHRtZWRpYXByZXZpb3VzdHJhY2s6ICdNZWRpYVRyYWNrUHJldmlvdXMnLFxuXHRtZWRpYXN0b3A6ICdNZWRpYVN0b3AnLFxuXHRtZWRpYXBsYXlwYXVzZTogJ01lZGlhUGxheVBhdXNlJyxcblx0cHJpbnRzY3JlZW46ICdQcmludFNjcmVlbidcbn0pO1xuXG4vLyBBZGQgZnVuY3Rpb24ga2V5c1xuZm9yIChsZXQgaSA9IDE7IGkgPD0gMjQ7IGkrKykge1xuXHRkb21LZXlzW2BmJHtpfWBdID0gYEYke2l9YDtcbn1cblxuZnVuY3Rpb24gcmVkdWNlQ29kZSh7YWNjZWxlcmF0b3IsIGV2ZW50fSwge2NvZGUsIGtleX0pIHtcblx0aWYgKGV2ZW50LmNvZGUpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQga2V5Y29kZSBcXGAke2tleX1cXGAuYCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGV2ZW50OiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge2tleX0sIGNvZGUgPyB7Y29kZX0gOiBudWxsKSxcblx0XHRhY2NlbGVyYXRvcjogYWNjZWxlcmF0b3IudHJpbSgpLnNsaWNlKChrZXkgJiYga2V5Lmxlbmd0aCkgfHwgMClcblx0fTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHRyYW5zZm9ybSBhbiBFbGVjdHJvbiBBY2NlbGVyYXRvciBzdHJpbmcgaW50b1xuICogYSBET00gS2V5Ym9hcmRFdmVudCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBhY2NlbGVyYXRvciBhbiBFbGVjdHJvbiBBY2NlbGVyYXRvciBzdHJpbmcsIGUuZy4gYEN0cmwrQ2Agb3IgYFNoaWZ0K1NwYWNlYC5cbiAqIEByZXR1cm4ge29iamVjdH0gYSBET00gS2V5Ym9hcmRFdmVudCBvYmplY3QgZGVyaXZhdGUgZnJvbSB0aGUgYGFjY2VsZXJhdG9yYCBhcmd1bWVudC5cbiAqL1xuZnVuY3Rpb24gdG9LZXlFdmVudChhY2NlbGVyYXRvcikge1xuXHRsZXQgc3RhdGUgPSB7YWNjZWxlcmF0b3IsIGV2ZW50OiB7fX07XG5cdHdoaWxlIChzdGF0ZS5hY2NlbGVyYXRvciAhPT0gJycpIHtcblx0XHRjb25zdCBtb2RpZmllck1hdGNoID0gc3RhdGUuYWNjZWxlcmF0b3IubWF0Y2gobW9kaWZpZXJzKTtcblx0XHRpZiAobW9kaWZpZXJNYXRjaCkge1xuXHRcdFx0Y29uc3QgbW9kaWZpZXIgPSBtb2RpZmllck1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRzdGF0ZSA9IHJlZHVjZU1vZGlmaWVyKHN0YXRlLCBtb2RpZmllcik7XG5cdFx0XHRpZiAoc3RhdGUgPT09IFVOU1VQUE9SVEVEKSB7XG5cdFx0XHRcdHJldHVybiB7dW5zdXBwb3J0ZWRLZXlGb3JQbGF0Zm9ybTogdHJ1ZX07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzdGF0ZS5hY2NlbGVyYXRvci50cmltKClbMF0gPT09ICcrJykge1xuXHRcdFx0c3RhdGUgPSByZWR1Y2VQbHVzKHN0YXRlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgY29kZU1hdGNoID0gc3RhdGUuYWNjZWxlcmF0b3IubWF0Y2goa2V5Q29kZXMpO1xuXHRcdFx0aWYgKGNvZGVNYXRjaCkge1xuXHRcdFx0XHRjb25zdCBjb2RlID0gY29kZU1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmIChjb2RlIGluIGRvbUtleXMpIHtcblx0XHRcdFx0XHRzdGF0ZSA9IHJlZHVjZUNvZGUoc3RhdGUsIHtcblx0XHRcdFx0XHRcdGNvZGU6IGRvbUtleXNbY29kZV0sXG5cdFx0XHRcdFx0XHRrZXk6IGNvZGVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdGF0ZSA9IHJlZHVjZUtleShzdGF0ZSwgY29kZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVW52YWxpZCBhY2NlbGVyYXRvcjogXCIke3N0YXRlLmFjY2VsZXJhdG9yfVwiYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHN0YXRlLmV2ZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0VU5TVVBQT1JURUQsXG5cdHJlZHVjZU1vZGlmaWVyLFxuXHRyZWR1Y2VQbHVzLFxuXHRyZWR1Y2VLZXksXG5cdHJlZHVjZUNvZGUsXG5cdHRvS2V5RXZlbnRcbn07XG4iLCJpbXBvcnQgKiBhcyBrZXlGcm9tQWNjZWxlcmF0b3IgZnJvbSAna2V5Ym9hcmRldmVudC1mcm9tLWVsZWN0cm9uLWFjY2VsZXJhdG9yJztcclxuaW1wb3J0IHsgTm90aWNlLCBBcHAsIE1hcmtkb3duVmlldywgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBURmlsZSB9IGZyb20gJ29ic2lkaWFuJztcclxuXHJcbmRlY2xhcmUgY29uc3QgQ29kZU1pcnJvcjogYW55O1xyXG5cclxuaW50ZXJmYWNlIFNldHRpbmdzIHtcclxuXHR2aW1yY0ZpbGVOYW1lOiBzdHJpbmcsXHJcblx0ZGlzcGxheUNob3JkOiBib29sZWFuLFxyXG5cdGRpc3BsYXlWaW1Nb2RlOiBib29sZWFuLFxyXG5cdGZpeGVkTm9ybWFsTW9kZUxheW91dDogYm9vbGVhbixcclxuXHRjYXB0dXJlZEtleWJvYXJkTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNldHRpbmdzID0ge1xyXG5cdHZpbXJjRmlsZU5hbWU6IFwiLm9ic2lkaWFuLnZpbXJjXCIsXHJcblx0ZGlzcGxheUNob3JkOiBmYWxzZSxcclxuXHRkaXNwbGF5VmltTW9kZTogZmFsc2UsXHJcblx0Zml4ZWROb3JtYWxNb2RlTGF5b3V0OiBmYWxzZSxcclxuXHRjYXB0dXJlZEtleWJvYXJkTWFwOiB7fVxyXG59XHJcblxyXG5jb25zdCBlbnVtIHZpbVN0YXR1cyB7XHJcblx0bm9ybWFsID0gXCLwn5+iXCIsXHJcblx0aW5zZXJ0ID0gXCLwn5+gXCIsXHJcblx0cmVwbGFjZSA9IFwi8J+UtFwiLFxyXG5cdHZpc3VhbCA9IFwi8J+foVwiXHJcbn1cclxuXHJcbi8vIE5PVEU6IHRvIGZ1dHVyZSBtYWludGFpbmVycywgcGxlYXNlIG1ha2Ugc3VyZSBhbGwgbWFwcGluZyBjb21tYW5kcyBhcmUgaW5jbHVkZWQgaW4gdGhpcyBhcnJheS5cclxuY29uc3QgbWFwcGluZ0NvbW1hbmRzOiBTdHJpbmdbXSA9IFtcclxuXHRcIm1hcFwiLFxyXG5cdFwibm1hcFwiLFxyXG5cdFwibm9yZW1hcFwiLFxyXG5dXHJcblxyXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKSB7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaW1yY1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcblx0c2V0dGluZ3M6IFNldHRpbmdzO1xyXG5cclxuXHRwcml2YXRlIGxhc3RZYW5rQnVmZmVyID0gbmV3IEFycmF5PHN0cmluZz4oMCk7XHJcblx0cHJpdmF0ZSBsYXN0U3lzdGVtQ2xpcGJvYXJkID0gXCJcIjtcclxuXHRwcml2YXRlIHlhbmtUb1N5c3RlbUNsaXBib2FyZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgY3VycmVudEtleUNob3JkOiBhbnkgPSBbXTtcclxuXHRwcml2YXRlIHZpbUNob3JkU3RhdHVzQmFyOiBIVE1MRWxlbWVudCA9IG51bGw7XHJcblx0cHJpdmF0ZSB2aW1TdGF0dXNCYXI6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuXHRwcml2YXRlIGN1cnJlbnRWaW1TdGF0dXM6IHZpbVN0YXR1cyA9IHZpbVN0YXR1cy5ub3JtYWw7XHJcblx0cHJpdmF0ZSBjdXN0b21WaW1LZXliaW5kczogeyBbbmFtZTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XHJcblx0cHJpdmF0ZSBjdXJyZW50U2VsZWN0aW9uOiBDb2RlTWlycm9yLlJhbmdlID0gbnVsbDtcclxuXHRwcml2YXRlIGlzSW5zZXJ0TW9kZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRhc3luYyBjYXB0dXJlS2V5Ym9hcmRMYXlvdXQoKSB7XHJcblx0XHQvLyBUaGlzIGlzIGV4cGVyaW1lbnRhbCBBUEkgYW5kIGl0IG1pZ2h0IGJyZWFrIGF0IHNvbWUgcG9pbnQ6XHJcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRMYXlvdXRNYXBcclxuXHRcdGxldCBrZXlNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuXHRcdGxldCBsYXlvdXQgPSBhd2FpdCAobmF2aWdhdG9yIGFzIGFueSkua2V5Ym9hcmQuZ2V0TGF5b3V0TWFwKCk7XHJcblx0XHRsZXQgZG9uZUl0ZXJhdGluZyA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGNvdW50ZWQgPSAwO1xyXG5cdFx0XHRsYXlvdXQuZm9yRWFjaCgodmFsdWU6IGFueSwgaW5kZXg6IGFueSkgPT4ge1xyXG5cdFx0XHRcdGtleU1hcFtpbmRleF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRjb3VudGVkICs9IDE7XHJcblx0XHRcdFx0aWYgKGNvdW50ZWQgPT09IGxheW91dC5zaXplKVxyXG5cdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdFx0YXdhaXQgZG9uZUl0ZXJhdGluZztcclxuXHRcdG5ldyBOb3RpY2UoJ0tleWJvYXJkIGxheW91dCBjYXB0dXJlZCcpO1xyXG5cdFx0cmV0dXJuIGtleU1hcDtcclxuXHR9XHJcblxyXG5cdGFzeW5jIG9ubG9hZCgpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdsb2FkaW5nIFZpbXJjIHBsdWdpbicpO1xyXG5cclxuXHRcdGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSlcclxuXHJcblx0XHR0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKCdmaWxlLW9wZW4nLCAoZmlsZTogVEZpbGUpID0+IHtcclxuXHRcdFx0Y29uc3QgVklNUkNfRklMRV9OQU1FID0gdGhpcy5zZXR0aW5ncy52aW1yY0ZpbGVOYW1lO1xyXG5cdFx0XHR0aGlzLmFwcC52YXVsdC5hZGFwdGVyLnJlYWQoVklNUkNfRklMRV9OQU1FKS5cclxuXHRcdFx0XHR0aGVuKChsaW5lcykgPT4gdGhpcy5yZWFkVmltSW5pdChsaW5lcykpLlxyXG5cdFx0XHRcdGNhdGNoKGVycm9yID0+IHsgY29uc29sZS5sb2coJ0Vycm9yIGxvYWRpbmcgdmltcmMgZmlsZScsIFZJTVJDX0ZJTEVfTkFNRSwgJ2Zyb20gdGhlIHZhdWx0IHJvb3QnLCBlcnJvcikgfSk7XHJcblx0XHR9KSk7XHJcblxyXG5cdFx0dGhpcy5yZWdpc3RlckRvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuY2FwdHVyZVlhbmtCdWZmZXIoKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5yZWdpc3RlckRvbUV2ZW50KGRvY3VtZW50LCAna2V5dXAnLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuY2FwdHVyZVlhbmtCdWZmZXIoKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5yZWdpc3RlckRvbUV2ZW50KGRvY3VtZW50LCAnZm9jdXNpbicsICgpID0+IHtcclxuXHRcdFx0dGhpcy5jYXB0dXJlWWFua0J1ZmZlcigpO1xyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuXHRcdGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmxvYWREYXRhKCk7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgZGF0YSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBzYXZlU2V0dGluZ3MoKSB7XHJcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG5cdH1cclxuXHJcblx0b251bmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygndW5sb2FkaW5nIFZpbXJjIHBsdWdpbiAoYnV0IFZpbSBjb21tYW5kcyB0aGF0IHdlcmUgYWxyZWFkeSBsb2FkZWQgd2lsbCBzdGlsbCB3b3JrKScpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRBY3RpdmVWaWV3KCkgOiBNYXJrZG93blZpZXcge1xyXG5cdFx0cmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldEVkaXRvcih2aWV3OiBNYXJrZG93blZpZXcpIDogQ29kZU1pcnJvci5FZGl0b3Ige1xyXG5cdFx0cmV0dXJuIHZpZXcuc291cmNlTW9kZT8uY21FZGl0b3I7XHJcblx0fVxyXG5cclxuXHRyZWFkVmltSW5pdCh2aW1Db21tYW5kczogc3RyaW5nKSB7XHJcblx0XHRsZXQgdmlldyA9IHRoaXMuZ2V0QWN0aXZlVmlldygpO1xyXG5cdFx0aWYgKHZpZXcpIHtcclxuXHRcdFx0dmFyIGNtRWRpdG9yID0gdGhpcy5nZXRFZGl0b3Iodmlldyk7XHJcblx0XHRcdGlmIChjbUVkaXRvciAmJiAhQ29kZU1pcnJvci5WaW0ubG9hZGVkVmltcmMpIHtcclxuXHRcdFx0XHR0aGlzLmRlZmluZUJhc2ljQ29tbWFuZHMoQ29kZU1pcnJvci5WaW0pO1xyXG5cdFx0XHRcdHRoaXMuZGVmaW5lU2VuZEtleXMoQ29kZU1pcnJvci5WaW0pO1xyXG5cdFx0XHRcdHRoaXMuZGVmaW5lT2JDb21tYW5kKENvZGVNaXJyb3IuVmltKTtcclxuXHRcdFx0XHR0aGlzLmRlZmluZVN1cnJvdW5kKENvZGVNaXJyb3IuVmltKTtcclxuXHRcdFx0XHR0aGlzLmRlZmluZUZpeGVkTGF5b3V0KCk7XHJcblxyXG5cdFx0XHRcdENvZGVNaXJyb3Iub24oY21FZGl0b3IsIFwidmltLW1vZGUtY2hhbmdlXCIsIChtb2RlT2JqOiBhbnkpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuaXNJbnNlcnRNb2RlID0gbW9kZU9iai5tb2RlID09PSAnaW5zZXJ0JztcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gUmVjb3JkIHRoZSBwb3NpdGlvbiBvZiBzZWxlY3Rpb25zXHJcblx0XHRcdFx0Q29kZU1pcnJvci5vbihjbUVkaXRvciwgXCJjdXJzb3JBY3Rpdml0eVwiLCBhc3luYyAoY206IGFueSkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50U2VsZWN0aW9uID0gY20ubGlzdFNlbGVjdGlvbnMoKVswXVxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdHZpbUNvbW1hbmRzLnNwbGl0KFwiXFxuXCIpLmZvckVhY2goXHJcblx0XHRcdFx0XHRmdW5jdGlvbiAobGluZTogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBhcnI6IFtzdHJpbmddKSB7XHJcblx0XHRcdFx0XHRcdGlmIChsaW5lLnRyaW0oKS5sZW5ndGggPiAwICYmIGxpbmUudHJpbSgpWzBdICE9ICdcIicpIHtcclxuXHRcdFx0XHRcdFx0XHRsZXQgc3BsaXQgPSBsaW5lLnNwbGl0KFwiIFwiKVxyXG5cdFx0XHRcdFx0XHRcdGlmIChtYXBwaW5nQ29tbWFuZHMuaW5jbHVkZXMoc3BsaXRbMF0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBIYXZlIHRvIGRvIHRoaXMgYmVjYXVzZSBcInZpbS1jb21tYW5kLWRvbmVcIiBldmVudCBkb2Vzbid0IGFjdHVhbGx5IHdvcmsgcHJvcGVybHksIG9yIHNvbWV0aGluZy5cclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuY3VzdG9tVmltS2V5YmluZHNbc3BsaXRbMV1dID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRDb2RlTWlycm9yLlZpbS5oYW5kbGVFeChjbUVkaXRvciwgbGluZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0uYmluZCh0aGlzKSAvLyBGYXN0ZXIgdGhhbiBhbiBhcnJvdyBmdW5jdGlvbi4gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTAzNzU0NDAvYmluZGluZy12cy1hcnJvdy1mdW5jdGlvbi1mb3ItcmVhY3Qtb25jbGljay1ldmVudFxyXG5cdFx0XHRcdClcclxuXHJcblx0XHRcdFx0dGhpcy5wcmVwYXJlQ2hvcmREaXNwbGF5KCk7XHJcblx0XHRcdFx0dGhpcy5wcmVwYXJlVmltTW9kZURpc3BsYXkoKTtcclxuXHJcblx0XHRcdFx0Ly8gTWFrZSBzdXJlIHRoYXQgd2UgbG9hZCBpdCBqdXN0IG9uY2UgcGVyIENvZGVNaXJyb3IgaW5zdGFuY2UuXHJcblx0XHRcdFx0Ly8gVGhpcyBpcyBzdXBwb3NlZCB0byB3b3JrIGJlY2F1c2UgdGhlIFZpbSBzdGF0ZSBpcyBrZXB0IGF0IHRoZSBrZXltYXAgbGV2ZWwsIGhvcGVmdWxseVxyXG5cdFx0XHRcdC8vIHRoZXJlIHdpbGwgbm90IGJlIGJ1Z3MgY2F1c2VkIGJ5IG9wZXJhdGlvbnMgdGhhdCBhcmUga2VwdCBhdCB0aGUgb2JqZWN0IGxldmVsIGluc3RlYWRcclxuXHRcdFx0XHRDb2RlTWlycm9yLlZpbS5sb2FkZWRWaW1yYyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRlZmluZUJhc2ljQ29tbWFuZHModmltT2JqZWN0OiBhbnkpIHtcclxuXHRcdHZpbU9iamVjdC5kZWZpbmVPcHRpb24oJ2NsaXBib2FyZCcsICcnLCAnc3RyaW5nJywgWydjbGlwJ10sICh2YWx1ZTogc3RyaW5nLCBjbTogYW55KSA9PiB7XHJcblx0XHRcdGlmICh2YWx1ZSkge1xyXG5cdFx0XHRcdGlmICh2YWx1ZS50cmltKCkgPT0gJ3VubmFtZWQnIHx8IHZhbHVlLnRyaW0oKSA9PSAndW5uYW1lZHBsdXMnKSB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMueWFua1RvU3lzdGVtQ2xpcGJvYXJkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMueWFua1RvU3lzdGVtQ2xpcGJvYXJkID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJWaW0gaXMgbm93IHNldCB0byB5YW5rIHRvIHN5c3RlbSBjbGlwYm9hcmQuXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbnJlY29nbml6ZWQgY2xpcGJvYXJkIG9wdGlvbiwgc3VwcG9ydGVkIGFyZSAndW5uYW1lZCcgYW5kICd1bm5hbWVkcGx1cycgKGFuZCB0aGV5IGRvIHRoZSBzYW1lKVwiKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmltT2JqZWN0LmRlZmluZU9wdGlvbigndGFic3RvcCcsIDQsICdudW1iZXInLCBbXSwgKHZhbHVlOiBudW1iZXIsIGNtOiBhbnkpID0+IHtcclxuXHRcdFx0aWYgKHZhbHVlICYmIGNtKSB7XHJcblx0XHRcdFx0Y20uc2V0T3B0aW9uKCd0YWJTaXplJywgdmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR2aW1PYmplY3QuZGVmaW5lRXgoJ2l1bm1hcCcsICcnLCAoY206IGFueSwgcGFyYW1zOiBhbnkpID0+IHtcclxuXHRcdFx0aWYgKHBhcmFtcy5hcmdTdHJpbmcudHJpbSgpKSB7XHJcblx0XHRcdFx0Q29kZU1pcnJvci5WaW0udW5tYXAocGFyYW1zLmFyZ1N0cmluZy50cmltKCksICdpbnNlcnQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmltT2JqZWN0LmRlZmluZUV4KCdub3JlbWFwJywgJycsIChjbTogYW55LCBwYXJhbXM6IGFueSkgPT4ge1xyXG5cdFx0XHRpZiAoIXBhcmFtcz8uYXJncz8ubGVuZ3RoKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1hcHBpbmc6IG5vcmVtYXAnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHBhcmFtcy5hcmdTdHJpbmcudHJpbSgpKSB7XHJcblx0XHRcdFx0Q29kZU1pcnJvci5WaW0ubm9yZW1hcC5hcHBseShDb2RlTWlycm9yLlZpbSwgcGFyYW1zLmFyZ3MpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byByZWdpc3RlciBhbiBFeCBjb21tYW5kXHJcblx0XHR2aW1PYmplY3QuZGVmaW5lRXgoJ2V4bWFwJywgJycsIChjbTogYW55LCBwYXJhbXM6IGFueSkgPT4ge1xyXG5cdFx0XHRpZiAocGFyYW1zPy5hcmdzPy5sZW5ndGggJiYgcGFyYW1zLmFyZ3MubGVuZ3RoIDwgMikge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgZXhtYXAgcmVxdWlyZXMgYXQgbGVhc3QgMiBwYXJhbWV0ZXJzOiBbbmFtZV0gW2FjdGlvbnMuLi5dYCk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGNvbW1hbmROYW1lID0gcGFyYW1zLmFyZ3NbMF07XHJcblx0XHRcdHBhcmFtcy5hcmdzLnNoaWZ0KCk7XHJcblx0XHRcdGxldCBjb21tYW5kQ29udGVudCA9IHBhcmFtcy5hcmdzLmpvaW4oJyAnKTtcclxuXHRcdFx0Ly8gVGhlIGNvbnRlbnQgb2YgdGhlIHVzZXIncyBFeCBjb21tYW5kIGlzIGp1c3QgdGhlIHJlbWFpbmluZyBwYXJhbWV0ZXJzIG9mIHRoZSBleG1hcCBjb21tYW5kXHJcblx0XHRcdENvZGVNaXJyb3IuVmltLmRlZmluZUV4KGNvbW1hbmROYW1lLCAnJywgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7XHJcblx0XHRcdFx0Q29kZU1pcnJvci5WaW0uaGFuZGxlRXgoY20sIGNvbW1hbmRDb250ZW50KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0XHJcblx0ZGVmaW5lU2VuZEtleXModmltT2JqZWN0OiBhbnkpIHtcclxuXHRcdHZpbU9iamVjdC5kZWZpbmVFeCgnc2VuZGtleXMnLCAnJywgYXN5bmMgKGNtOiBhbnksIHBhcmFtczogYW55KSA9PiB7XHJcblx0XHRcdGlmICghcGFyYW1zPy5hcmdzPy5sZW5ndGgpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhwYXJhbXMpO1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgVGhlIHNlbmRrZXlzIGNvbW1hbmQgcmVxdWlyZXMgYSBsaXN0IG9mIGtleXMsIGUuZy4gc2VuZEtleXMgQ3RybCtwIGEgYiBFbnRlcmApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgYWxsR29vZCA9IHRydWU7XHJcblx0XHRcdGxldCBldmVudHM6IEtleWJvYXJkRXZlbnRbXSA9IFtdO1xyXG5cdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBwYXJhbXMuYXJncykge1xyXG5cdFx0XHRcdGlmIChrZXkuc3RhcnRzV2l0aCgnd2FpdCcpKSB7XHJcblx0XHRcdFx0XHRjb25zdCBkZWxheSA9IGtleS5zbGljZSg0KTtcclxuXHRcdFx0XHRcdGF3YWl0IHNsZWVwKGRlbGF5ICogMTAwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0bGV0IGtleUV2ZW50OiBLZXlib2FyZEV2ZW50ID0gbnVsbDtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdGtleUV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoJ2tleWRvd24nLCBrZXlGcm9tQWNjZWxlcmF0b3IudG9LZXlFdmVudChrZXkpKTtcclxuXHRcdFx0XHRcdFx0ZXZlbnRzLnB1c2goa2V5RXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0YWxsR29vZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEtleSAnJHtrZXl9JyBjb3VsZG4ndCBiZSByZWFkIGFzIGFuIEVsZWN0cm9uIEFjY2VsZXJhdG9yYCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoYWxsR29vZCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKGtleUV2ZW50IG9mIGV2ZW50cylcclxuXHRcdFx0XHRcdFx0XHR3aW5kb3cucG9zdE1lc3NhZ2UoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShrZXlFdmVudCkpLCAnKicpO1xyXG5cdFx0XHRcdFx0XHQvLyB2aWV3LmNvbnRhaW5lckVsLmRpc3BhdGNoRXZlbnQoa2V5RXZlbnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkZWZpbmVPYkNvbW1hbmQodmltT2JqZWN0OiBhbnkpIHtcclxuXHRcdHZpbU9iamVjdC5kZWZpbmVFeCgnb2Jjb21tYW5kJywgJycsIGFzeW5jIChjbTogYW55LCBwYXJhbXM6IGFueSkgPT4ge1xyXG5cdFx0XHRjb25zdCBhdmFpbGFibGVDb21tYW5kcyA9ICh0aGlzLmFwcCBhcyBhbnkpLmNvbW1hbmRzLmNvbW1hbmRzO1xyXG5cdFx0XHRpZiAoIXBhcmFtcz8uYXJncz8ubGVuZ3RoIHx8IHBhcmFtcy5hcmdzLmxlbmd0aCAhPSAxKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYEF2YWlsYWJsZSBjb21tYW5kczogJHtPYmplY3Qua2V5cyhhdmFpbGFibGVDb21tYW5kcykuam9pbignXFxuJyl9YClcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYG9iY29tbWFuZCByZXF1aXJlcyBleGFjdGx5IDEgcGFyYW1ldGVyYCk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IHZpZXcgPSB0aGlzLmdldEFjdGl2ZVZpZXcoKTtcclxuXHRcdFx0bGV0IGVkaXRvciA9IHZpZXcuZWRpdG9yO1xyXG5cdFx0XHRjb25zdCBjb21tYW5kID0gcGFyYW1zLmFyZ3NbMF07XHJcblx0XHRcdGlmIChjb21tYW5kIGluIGF2YWlsYWJsZUNvbW1hbmRzKSB7XHJcblx0XHRcdFx0bGV0IGNhbGxiYWNrID0gYXZhaWxhYmxlQ29tbWFuZHNbY29tbWFuZF0uY2FsbGJhY2s7XHJcblx0XHRcdFx0bGV0IGNoZWNrQ2FsbGJhY2sgPSBhdmFpbGFibGVDb21tYW5kc1tjb21tYW5kXS5jaGVja0NhbGxiYWNrO1xyXG5cdFx0XHRcdGxldCBlZGl0b3JDYWxsYmFjayA9IGF2YWlsYWJsZUNvbW1hbmRzW2NvbW1hbmRdLmVkaXRvckNhbGxiYWNrO1xyXG5cdFx0XHRcdGxldCBlZGl0b3JDaGVja0NhbGxiYWNrID0gYXZhaWxhYmxlQ29tbWFuZHNbY29tbWFuZF0uZWRpdG9yQ2hlY2tDYWxsYmFjaztcclxuXHRcdFx0XHRpZiAoZWRpdG9yQ2hlY2tDYWxsYmFjaylcclxuXHRcdFx0XHRcdGVkaXRvckNoZWNrQ2FsbGJhY2soZmFsc2UsIGVkaXRvciwgdmlldyk7XHJcblx0XHRcdFx0ZWxzZSBpZiAoZWRpdG9yQ2FsbGJhY2spXHJcblx0XHRcdFx0XHRlZGl0b3JDYWxsYmFjayhlZGl0b3IsIHZpZXcpO1xyXG5cdFx0XHRcdGVsc2UgaWYgKGNoZWNrQ2FsbGJhY2spXHJcblx0XHRcdFx0XHRjaGVja0NhbGxiYWNrKGZhbHNlKTtcclxuXHRcdFx0XHRlbHNlIGlmIChjYWxsYmFjaylcclxuXHRcdFx0XHRcdGNhbGxiYWNrKCk7XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb21tYW5kICR7Y29tbWFuZH0gZG9lc24ndCBoYXZlIGFuIE9ic2lkaWFuIGNhbGxiYWNrYCk7XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgQ29tbWFuZCAke2NvbW1hbmR9IHdhcyBub3QgZm91bmQsIHRyeSAnb2Jjb21tYW5kJyB3aXRoIG5vIHBhcmFtcyB0byBzZWUgaW4gdGhlIGRldmVsb3BlciBjb25zb2xlIHdoYXQncyBhdmFpbGFibGVgKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZGVmaW5lU3Vycm91bmQodmltT2JqZWN0OiBhbnkpIHtcclxuXHRcdC8vIEZ1bmN0aW9uIHRvIHN1cnJvdW5kIHNlbGVjdGVkIHRleHQgb3IgaGlnaGxpZ2h0ZWQgd29yZC5cclxuXHRcdHZhciBzdXJyb3VuZEZ1bmMgPSAoY206IENvZGVNaXJyb3IuRWRpdG9yLCBwYXJhbXM6IGFueSkgPT4ge1xyXG5cdFx0XHRpZiAoIXBhcmFtcz8uYXJncz8ubGVuZ3RoIHx8IHBhcmFtcy5hcmdzLmxlbmd0aCAhPSAyKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwic3Vycm91bmQgcmVxdWlyZXMgZXhhY3RseSAyIHBhcmFtZXRlcnM6IHByZWZpeCBhbmQgcG9zdGZpeCB0ZXh0LlwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBiZWdpbm5pbmcgPSBwYXJhbXMuYXJnc1swXSAvLyBHZXQgdGhlIGJlZ2lubmluZyBzdXJyb3VuZCB0ZXh0XHJcblx0XHRcdGxldCBlbmRpbmcgPSBwYXJhbXMuYXJnc1sxXSAvLyBHZXQgdGhlIGVuZGluZyBzdXJyb3VuZCB0ZXh0XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRTZWxlY3Rpb24uYW5jaG9yID09IHRoaXMuY3VycmVudFNlbGVjdGlvbi5oZWFkKSB7XHJcblx0XHRcdFx0Ly8gTm8gcmFuZ2Ugb2Ygc2VsZWN0ZWQgdGV4dCwgc28gc2VsZWN0IHdvcmQuXHJcblx0XHRcdFx0bGV0IHdvcmRSYW5nZSA9IGNtLmZpbmRXb3JkQXQodGhpcy5jdXJyZW50U2VsZWN0aW9uLmFuY2hvcilcclxuXHRcdFx0XHRsZXQgY3VyclRleHQgPSBjbS5nZXRSYW5nZSh3b3JkUmFuZ2UuZnJvbSgpLCB3b3JkUmFuZ2UudG8oKSlcclxuXHRcdFx0XHRjbS5yZXBsYWNlUmFuZ2UoYmVnaW5uaW5nICsgY3VyclRleHQgKyBlbmRpbmcsIHdvcmRSYW5nZS5mcm9tKCksIHdvcmRSYW5nZS50bygpKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBjdXJyVGV4dCA9IGNtLmdldFJhbmdlKHRoaXMuY3VycmVudFNlbGVjdGlvbi5mcm9tKCksIHRoaXMuY3VycmVudFNlbGVjdGlvbi50bygpKVxyXG5cdFx0XHRcdGNtLnJlcGxhY2VSYW5nZShiZWdpbm5pbmcgKyBjdXJyVGV4dCArIGVuZGluZywgdGhpcy5jdXJyZW50U2VsZWN0aW9uLmZyb20oKSwgdGhpcy5jdXJyZW50U2VsZWN0aW9uLnRvKCkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2aW1PYmplY3QuZGVmaW5lRXgoXCJzdXJyb3VuZFwiLCBcIlwiLCBzdXJyb3VuZEZ1bmMpO1xyXG5cclxuXHRcdHZpbU9iamVjdC5kZWZpbmVFeChcInBhc3RlaW50b1wiLCBcIlwiLCAoY206IENvZGVNaXJyb3IuRWRpdG9yLCBwYXJhbXM6IGFueSkgPT4ge1xyXG5cdFx0XHQvLyBVc2luZyB0aGUgcmVnaXN0ZXIgZm9yIHdoZW4gdGhpcy55YW5rVG9TeXN0ZW1DbGlwYm9hcmQgPT0gZmFsc2VcclxuXHRcdFx0c3Vycm91bmRGdW5jKGNtLCB7IGFyZ3M6IFtcIltcIiwgXCJdKFwiICsgdmltT2JqZWN0LlZpbS5nZXRSZWdpc3RlckNvbnRyb2xsZXIoKS5nZXRSZWdpc3RlcigneWFuaycpLmtleUJ1ZmZlciArIFwiKVwiXSB9KVxyXG5cdFx0fSlcclxuXHJcblx0XHRsZXQgY21FZGl0b3IgPSB0aGlzLmdldEVkaXRvcih0aGlzLmdldEFjdGl2ZVZpZXcoKSk7XHJcblx0XHQvLyBIYW5kbGUgdGhlIHN1cnJvdW5kIGRpYWxvZyBpbnB1dFxyXG5cdFx0dmFyIHN1cnJvdW5kRGlhbG9nQ2FsbGJhY2sgPSAodmFsdWU6IHN0cmluZykgPT4ge1xyXG5cdFx0XHRpZiAoKC9eXFxbKyQvKS50ZXN0KHZhbHVlKSkgeyAvLyBjaGVjayBmb3IgMS1pbmYgWyBhbmQgbWF0Y2ggdGhlbSB3aXRoIF1cclxuXHRcdFx0XHRzdXJyb3VuZEZ1bmMoY21FZGl0b3IsIHsgYXJnczogW3ZhbHVlLCBcIl1cIi5yZXBlYXQodmFsdWUubGVuZ3RoKV0gfSlcclxuXHRcdFx0fSBlbHNlIGlmICgoL15cXCgrJC8pLnRlc3QodmFsdWUpKSB7IC8vIGNoZWNrIGZvciAxLWluZiAoIGFuZCBtYXRjaCB0aGVtIHdpdGggKVxyXG5cdFx0XHRcdHN1cnJvdW5kRnVuYyhjbUVkaXRvciwgeyBhcmdzOiBbdmFsdWUsIFwiKVwiLnJlcGVhdCh2YWx1ZS5sZW5ndGgpXSB9KVxyXG5cdFx0XHR9IGVsc2UgaWYgKCgvXlxceyskLykudGVzdCh2YWx1ZSkpIHsgLy8gY2hlY2sgZm9yIDEtaW5mIHsgYW5kIG1hdGNoIHRoZW0gd2l0aCB9XHJcblx0XHRcdFx0c3Vycm91bmRGdW5jKGNtRWRpdG9yLCB7IGFyZ3M6IFt2YWx1ZSwgXCJ9XCIucmVwZWF0KHZhbHVlLmxlbmd0aCldIH0pXHJcblx0XHRcdH0gZWxzZSB7IC8vIEVsc2UsIGp1c3QgcHV0IGl0IGJlZm9yZSBhbmQgYWZ0ZXIuXHJcblx0XHRcdFx0c3Vycm91bmRGdW5jKGNtRWRpdG9yLCB7IGFyZ3M6IFt2YWx1ZSwgdmFsdWVdIH0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2aW1PYmplY3QuZGVmaW5lT3BlcmF0b3IoXCJzdXJyb3VuZE9wZXJhdG9yXCIsIChjbTogYW55LCBhcmdzOiBhbnksIHJhbmdlczogYW55KSA9PiB7XHJcblx0XHRcdGxldCBwID0gXCI8c3Bhbj5TdXJyb3VuZCB3aXRoOiA8aW5wdXQgdHlwZT0ndGV4dCc+PC9zcGFuPlwiXHJcblx0XHRcdGNtLm9wZW5EaWFsb2cocCwgc3Vycm91bmREaWFsb2dDYWxsYmFjaywgeyBib3R0b206IHRydWUsIHNlbGVjdFZhbHVlT25PcGVuOiBmYWxzZSB9KVxyXG5cdFx0fSlcclxuXHJcblxyXG5cdFx0dmltT2JqZWN0Lm1hcENvbW1hbmQoXCI8QS15PnNcIiwgXCJvcGVyYXRvclwiLCBcInN1cnJvdW5kT3BlcmF0b3JcIilcclxuXHJcblx0fVxyXG5cclxuXHRjYXB0dXJlWWFua0J1ZmZlcigpIHtcclxuXHRcdGlmICh0aGlzLnlhbmtUb1N5c3RlbUNsaXBib2FyZCkge1xyXG5cdFx0XHRsZXQgY3VycmVudEJ1ZmZlciA9IENvZGVNaXJyb3IuVmltLmdldFJlZ2lzdGVyQ29udHJvbGxlcigpLmdldFJlZ2lzdGVyKCd5YW5rJykua2V5QnVmZmVyO1xyXG5cdFx0XHRpZiAoY3VycmVudEJ1ZmZlciAhPSB0aGlzLmxhc3RZYW5rQnVmZmVyKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubGFzdFlhbmtCdWZmZXIubGVuZ3RoID4gMCAmJiBjdXJyZW50QnVmZmVyLmxlbmd0aCA+IDAgJiYgY3VycmVudEJ1ZmZlclswXSkge1xyXG5cdFx0XHRcdFx0bmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoY3VycmVudEJ1ZmZlclswXSk7XHJcblx0XHRcdFx0XHRuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCkudGhlbigodmFsdWUpID0+IHsgdGhpcy5sYXN0U3lzdGVtQ2xpcGJvYXJkID0gdmFsdWU7IH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmxhc3RZYW5rQnVmZmVyID0gY3VycmVudEJ1ZmZlcjtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGN1cnJlbnRDbGlwYm9hcmQgPSBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCkudGhlbigodmFsdWUpID0+IHtcclxuXHRcdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5sYXN0U3lzdGVtQ2xpcGJvYXJkKSB7XHJcblx0XHRcdFx0XHRsZXQgeWFua1JlZ2lzdGVyID0gQ29kZU1pcnJvci5WaW0uZ2V0UmVnaXN0ZXJDb250cm9sbGVyKCkuZ2V0UmVnaXN0ZXIoJ3lhbmsnKVxyXG5cdFx0XHRcdFx0eWFua1JlZ2lzdGVyLnNldFRleHQodmFsdWUpO1xyXG5cdFx0XHRcdFx0dGhpcy5sYXN0WWFua0J1ZmZlciA9IHlhbmtSZWdpc3Rlci5rZXlCdWZmZXI7XHJcblx0XHRcdFx0XHR0aGlzLmxhc3RTeXN0ZW1DbGlwYm9hcmQgPSB2YWx1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcmVwYXJlQ2hvcmREaXNwbGF5KCkge1xyXG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MuZGlzcGxheUNob3JkKSB7XHJcblx0XHRcdC8vIEFkZCBzdGF0dXMgYmFyIGl0ZW1cclxuXHRcdFx0dGhpcy52aW1DaG9yZFN0YXR1c0JhciA9IHRoaXMuYWRkU3RhdHVzQmFySXRlbSgpO1xyXG5cclxuXHRcdFx0Ly8gTW92ZSB2aW1DaG9yZFN0YXR1c0JhciB0byB0aGUgbGVmdG1vc3QgcG9zaXRpb24gYW5kIGNlbnRlciBpdC5cclxuXHRcdFx0bGV0IHBhcmVudCA9IHRoaXMudmltQ2hvcmRTdGF0dXNCYXIucGFyZW50RWxlbWVudDtcclxuXHRcdFx0dGhpcy52aW1DaG9yZFN0YXR1c0Jhci5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLnZpbUNob3JkU3RhdHVzQmFyLCBwYXJlbnQuZmlyc3RDaGlsZCk7XHJcblx0XHRcdHRoaXMudmltQ2hvcmRTdGF0dXNCYXIuc3R5bGUubWFyZ2luUmlnaHQgPSBcImF1dG9cIjtcclxuXHJcblx0XHRcdGxldCBjbUVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKHRoaXMuZ2V0QWN0aXZlVmlldygpKTtcclxuXHRcdFx0Ly8gU2VlIGh0dHBzOi8vY29kZW1pcnJvci5uZXQvZG9jL21hbnVhbC5odG1sI3ZpbWFwaV9ldmVudHMgZm9yIGV2ZW50cy5cclxuXHRcdFx0Q29kZU1pcnJvci5vbihjbUVkaXRvciwgXCJ2aW0ta2V5cHJlc3NcIiwgYXN5bmMgKHZpbUtleTogYW55KSA9PiB7XHJcblx0XHRcdFx0aWYgKHZpbUtleSAhPSBcIjxFc2M+XCIpIHsgLy8gVE9ETyBmaWd1cmUgb3V0IHdoYXQgdG8gYWN0dWFsbHkgbG9vayBmb3IgdG8gZXhpdCBjb21tYW5kcy5cclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEtleUNob3JkLnB1c2godmltS2V5KTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmN1c3RvbVZpbUtleWJpbmRzW3RoaXMuY3VycmVudEtleUNob3JkLmpvaW4oXCJcIildICE9IHVuZGVmaW5lZCkgeyAvLyBDdXN0b20ga2V5IGNob3JkIGV4aXN0cy5cclxuXHRcdFx0XHRcdFx0dGhpcy5jdXJyZW50S2V5Q2hvcmQgPSBbXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50S2V5Q2hvcmQgPSBbXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEJ1aWxkIGtleWNob3JkIHRleHRcclxuXHRcdFx0XHRsZXQgdGVtcFMgPSBcIlwiO1xyXG5cdFx0XHRcdGZvciAoY29uc3QgcyBvZiB0aGlzLmN1cnJlbnRLZXlDaG9yZCkge1xyXG5cdFx0XHRcdFx0dGVtcFMgKz0gXCIgXCIgKyBzO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGVtcFMgIT0gXCJcIikge1xyXG5cdFx0XHRcdFx0dGVtcFMgKz0gXCItXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMudmltQ2hvcmRTdGF0dXNCYXIuc2V0VGV4dCh0ZW1wUyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRDb2RlTWlycm9yLm9uKGNtRWRpdG9yLCBcInZpbS1jb21tYW5kLWRvbmVcIiwgYXN5bmMgKHJlYXNvbjogYW55KSA9PiB7IC8vIFJlc2V0IGRpc3BsYXlcclxuXHRcdFx0XHR0aGlzLnZpbUNob3JkU3RhdHVzQmFyLnNldFRleHQoXCJcIik7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50S2V5Q2hvcmQgPSBbXTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcmVwYXJlVmltTW9kZURpc3BsYXkoKSB7XHJcblx0XHRpZiAodGhpcy5zZXR0aW5ncy5kaXNwbGF5VmltTW9kZSkge1xyXG5cdFx0XHR0aGlzLnZpbVN0YXR1c0JhciA9IHRoaXMuYWRkU3RhdHVzQmFySXRlbSgpIC8vIEFkZCBzdGF0dXMgYmFyIGl0ZW1cclxuXHRcdFx0dGhpcy52aW1TdGF0dXNCYXIuc2V0VGV4dCh2aW1TdGF0dXMubm9ybWFsKSAvLyBJbml0IHRoZSB2aW1TdGF0dXNCYXIgd2l0aCBub3JtYWwgbW9kZVxyXG5cclxuXHRcdFx0bGV0IGNtRWRpdG9yID0gdGhpcy5nZXRFZGl0b3IodGhpcy5nZXRBY3RpdmVWaWV3KCkpO1xyXG5cdFx0XHQvLyBTZWUgaHR0cHM6Ly9jb2RlbWlycm9yLm5ldC9kb2MvbWFudWFsLmh0bWwjdmltYXBpX2V2ZW50cyBmb3IgZXZlbnRzLlxyXG5cdFx0XHRDb2RlTWlycm9yLm9uKGNtRWRpdG9yLCBcInZpbS1tb2RlLWNoYW5nZVwiLCBhc3luYyAobW9kZU9iajogYW55KSA9PiB7XHJcblx0XHRcdFx0c3dpdGNoIChtb2RlT2JqLm1vZGUpIHtcclxuXHRcdFx0XHRcdGNhc2UgXCJpbnNlcnRcIjpcclxuXHRcdFx0XHRcdFx0dGhpcy5jdXJyZW50VmltU3RhdHVzID0gdmltU3RhdHVzLmluc2VydDtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwibm9ybWFsXCI6XHJcblx0XHRcdFx0XHRcdHRoaXMuY3VycmVudFZpbVN0YXR1cyA9IHZpbVN0YXR1cy5ub3JtYWw7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSBcInZpc3VhbFwiOlxyXG5cdFx0XHRcdFx0XHR0aGlzLmN1cnJlbnRWaW1TdGF0dXMgPSB2aW1TdGF0dXMudmlzdWFsO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJyZXBsYWNlXCI6XHJcblx0XHRcdFx0XHRcdHRoaXMuY3VycmVudFZpbVN0YXR1cyA9IHZpbVN0YXR1cy5yZXBsYWNlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy52aW1TdGF0dXNCYXIuc2V0VGV4dCh0aGlzLmN1cnJlbnRWaW1TdGF0dXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRlZmluZUZpeGVkTGF5b3V0KCkge1xyXG5cdFx0bGV0IGNtRWRpdG9yID0gdGhpcy5nZXRFZGl0b3IodGhpcy5nZXRBY3RpdmVWaWV3KCkpO1xyXG5cdFx0Y21FZGl0b3Iub24oJ2tleWRvd24nLCAoaW5zdGFuY2U6IENvZGVNaXJyb3IuRWRpdG9yLCBldjogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5maXhlZE5vcm1hbE1vZGVMYXlvdXQpIHtcclxuXHRcdFx0XHRjb25zdCBrZXlNYXAgPSB0aGlzLnNldHRpbmdzLmNhcHR1cmVkS2V5Ym9hcmRNYXA7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmlzSW5zZXJ0TW9kZSAmJiAhZXYuc2hpZnRLZXkgJiZcclxuXHRcdFx0XHRcdFx0ZXYuY29kZSBpbiBrZXlNYXAgJiYgZXYua2V5ICE9IGtleU1hcFtldi5jb2RlXSkge1xyXG5cdFx0XHRcdFx0Q29kZU1pcnJvci5WaW0uaGFuZGxlS2V5KGluc3RhbmNlLCBrZXlNYXBbZXYuY29kZV0sICdtYXBwaW5nJyk7XHJcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdHBsdWdpbjogVmltcmNQbHVnaW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFZpbXJjUGx1Z2luKSB7XHJcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XHJcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuXHR9XHJcblxyXG5cdGRpc3BsYXkoKTogdm9pZCB7XHJcblx0XHRsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuXHJcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ1ZpbXJjIFNldHRpbmdzJyB9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1ZpbXJjIGZpbGUgbmFtZScpXHJcblx0XHRcdC5zZXREZXNjKCdSZWxhdGl2ZSB0byB2YXVsdCBkaXJlY3RvcnkgKHJlcXVpcmVzIHJlc3RhcnQpJylcclxuXHRcdFx0LmFkZFRleHQoKHRleHQpID0+IHtcclxuXHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKERFRkFVTFRfU0VUVElOR1MudmltcmNGaWxlTmFtZSk7XHJcblx0XHRcdFx0dGV4dC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1yY0ZpbGVOYW1lIHx8IERFRkFVTFRfU0VUVElOR1MudmltcmNGaWxlTmFtZSk7XHJcblx0XHRcdFx0dGV4dC5vbkNoYW5nZSh2YWx1ZSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy52aW1yY0ZpbGVOYW1lID0gdmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1ZpbSBjaG9yZCBkaXNwbGF5JylcclxuXHRcdFx0LnNldERlc2MoJ0Rpc3BsYXlzIHRoZSBjdXJyZW50IGNob3JkIHVudGlsIGNvbXBsZXRpb24uIEV4OiBcIjxTcGFjZT4gZi1cIiAocmVxdWlyZXMgcmVzdGFydCknKVxyXG5cdFx0XHQuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcclxuXHRcdFx0XHR0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzcGxheUNob3JkIHx8IERFRkFVTFRfU0VUVElOR1MuZGlzcGxheUNob3JkKTtcclxuXHRcdFx0XHR0b2dnbGUub25DaGFuZ2UodmFsdWUgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzcGxheUNob3JkID0gdmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1ZpbSBtb2RlIGRpc3BsYXknKVxyXG5cdFx0XHQuc2V0RGVzYygnRGlzcGxheXMgdGhlIGN1cnJlbnQgdmltIG1vZGUgKHJlcXVpcmVzIHJlc3RhcnQpJylcclxuXHRcdFx0LmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XHJcblx0XHRcdFx0dG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc3BsYXlWaW1Nb2RlIHx8IERFRkFVTFRfU0VUVElOR1MuZGlzcGxheVZpbU1vZGUpO1xyXG5cdFx0XHRcdHRvZ2dsZS5vbkNoYW5nZSh2YWx1ZSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5kaXNwbGF5VmltTW9kZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdVc2UgYSBmaXhlZCBrZXlib2FyZCBsYXlvdXQgZm9yIE5vcm1hbCBtb2RlJylcclxuXHRcdFx0LnNldERlc2MoJ0RlZmluZSBhIGtleWJvYXJkIGxheW91dCB0byBhbHdheXMgdXNlIHdoZW4gaW4gTm9ybWFsIG1vZGUsIHJlZ2FyZGxlc3Mgb2YgdGhlIGlucHV0IGxhbmd1YWdlIChleHBlcmltZW50YWwpLicpXHJcblx0XHRcdC5hZGRCdXR0b24oYXN5bmMgKGJ1dHRvbikgPT4ge1xyXG5cdFx0XHRcdGJ1dHRvbi5zZXRCdXR0b25UZXh0KCdDYXB0dXJlIGN1cnJlbnQgbGF5b3V0Jyk7XHJcblx0XHRcdFx0YnV0dG9uLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FwdHVyZWRLZXlib2FyZE1hcCA9IGF3YWl0IHRoaXMucGx1Z2luLmNhcHR1cmVLZXlib2FyZExheW91dCgpO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xyXG5cdFx0XHRcdHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5maXhlZE5vcm1hbE1vZGVMYXlvdXQgfHwgREVGQVVMVF9TRVRUSU5HUy5maXhlZE5vcm1hbE1vZGVMYXlvdXQpO1xyXG5cdFx0XHRcdHRvZ2dsZS5vbkNoYW5nZShhc3luYyB2YWx1ZSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5maXhlZE5vcm1hbE1vZGVMYXlvdXQgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdGlmICh2YWx1ZSAmJiBPYmplY3Qua2V5cyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jYXB0dXJlZEtleWJvYXJkTWFwKS5sZW5ndGggPT09IDApXHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmNhcHR1cmVkS2V5Ym9hcmRNYXAgPSBhd2FpdCB0aGlzLnBsdWdpbi5jYXB0dXJlS2V5Ym9hcmRMYXlvdXQoKTtcclxuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KVxyXG5cdH1cclxufVxyXG4iXSwibmFtZXMiOlsiTm90aWNlIiwiTWFya2Rvd25WaWV3Iiwia2V5RnJvbUFjY2VsZXJhdG9yLnRvS2V5RXZlbnQiLCJQbHVnaW4iLCJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUcsb0JBQW9CLElBQUks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
