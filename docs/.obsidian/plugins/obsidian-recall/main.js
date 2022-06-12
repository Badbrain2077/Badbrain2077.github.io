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

var DateUtils = /** @class */ (function () {
    function DateUtils() {
    }
    DateUtils.addTime = function (date, time) {
        return new Date(date.getTime() + time);
    };
    DateUtils.fromNow = function (time) {
        return this.addTime(new Date(), time);
    };
    DateUtils.DAYS_TO_MILLIS = 86400000;
    return DateUtils;
}());
var ObjectUtils = /** @class */ (function () {
    function ObjectUtils() {
    }
    /**
     * Creates a copy of obj, and copies values from source into
     * the copy, but only if there already is a property with the
     * matching name.
     *
     * @param obj
     * @param source
     */
    ObjectUtils.assignOnly = function (obj, source) {
        var newObj = Object.assign(obj);
        if (source != undefined) {
            Object.keys(obj).forEach(function (key) {
                if (key in source) {
                    newObj[key] = source[key];
                }
            });
        }
        return newObj;
    };
    return ObjectUtils;
}());

var SrsAlgorithm = /** @class */ (function () {
    function SrsAlgorithm() {
    }
    SrsAlgorithm.prototype.updateSettings = function (settings) {
        this.settings = ObjectUtils.assignOnly(this.defaultSettings(), settings);
    };
    return SrsAlgorithm;
}());

var LeitnerAlgorithm = /** @class */ (function (_super) {
    __extends(LeitnerAlgorithm, _super);
    function LeitnerAlgorithm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LeitnerAlgorithm.prototype.defaultSettings = function () {
        return {
            stages: 6,
            resetOnIncorrect: true,
            timings: [1, 3, 7, 14, 30, 180],
        };
    };
    LeitnerAlgorithm.prototype.defaultData = function () {
        return {
            stage: 0,
        };
    };
    LeitnerAlgorithm.prototype.srsOptions = function () {
        return ["Wrong", "Correct"];
    };
    LeitnerAlgorithm.prototype.onSelection = function (item, option, repeat) {
        var data = item.data;
        if (data.stage === "undefined") {
            data.stage = 0;
        }
        if (option == "Correct") {
            if (repeat) {
                return { correct: true, nextReview: -1 };
            }
            data.stage += 1;
            if (data.stage > this.settings.stages) {
                data.stage = this.settings.stages;
            }
            return {
                correct: true,
                nextReview: this.settings.timings[data.stage - 1] *
                    DateUtils.DAYS_TO_MILLIS,
            };
        }
        else {
            if (repeat) {
                return { correct: false, nextReview: -1 };
            }
            if (this.settings.resetOnIncorrect) {
                data.stage = 1;
            }
            else {
                data.stage = Math.max(1, data.stage - 1);
            }
            return {
                correct: false,
                nextReview: this.settings.timings[data.stage - 1] *
                    DateUtils.DAYS_TO_MILLIS,
            };
        }
    };
    LeitnerAlgorithm.prototype.displaySettings = function (containerEl, update) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName("Stages")
            .setDesc("The number of SRS stages.")
            .addText(function (text) {
            return text
                .setPlaceholder("Stages")
                .setValue(_this.settings.stages.toString())
                .onChange(function (newValue) {
                var _a;
                var stages = Number(newValue);
                if (isNaN(stages)) {
                    new obsidian.Notice("Stages must be a number.");
                    return;
                }
                if (!Number.isInteger(stages) || stages < 1) {
                    new obsidian.Notice("Stages must be an integer larger than 0.");
                    return;
                }
                var old = _this.settings.stages;
                _this.settings.stages = stages;
                if (old < stages) {
                    (_a = _this.settings.timings).push.apply(_a, new Array(stages - old).fill(0));
                }
                else if (old > stages) {
                    _this.settings.timings = _this.settings.timings.slice(0, stages);
                }
                _this.updateTimingsList(update);
                update(_this.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Reset When Incorrect")
            .setDesc("If true, a review item is moved back to the first stage when marked as incorrect. Otherwise it simply moves back to the previous stage.")
            .addToggle(function (toggle) {
            toggle.setValue(_this.settings.resetOnIncorrect);
            toggle.onChange(function (val) {
                _this.settings.resetOnIncorrect = val;
                update(_this.settings);
            });
        });
        var timingsDiv = containerEl.createDiv("timings-setting-item setting-item");
        timingsDiv.createDiv("setting-item-info", function (div) {
            div.createDiv("setting-item-name").innerText = "Timings";
            div.createDiv("setting-item-description").innerText =
                "The timings (in days) of each SRS stage.";
        });
        this.timingsList = timingsDiv.createDiv("setting-item-control");
        this.updateTimingsList(update);
    };
    LeitnerAlgorithm.prototype.updateTimingsList = function (update) {
        var _this = this;
        this.timingsList.empty();
        this.settings.timings.forEach(function (val, ind) {
            new obsidian.TextComponent(_this.timingsList)
                .setPlaceholder(ind.toString())
                .setValue(val.toString())
                .onChange(function (newValue) {
                var num = Number(newValue);
                if (isNaN(num)) {
                    new obsidian.Notice("Timing must be a number.");
                    return;
                }
                if (!Number.isInteger(num) || num < 1) {
                    new obsidian.Notice("Stages must be an integer larger than 0.");
                    return;
                }
                _this.settings.timings[ind] = num;
                update(_this.settings);
            });
        });
    };
    return LeitnerAlgorithm;
}(SrsAlgorithm));

var Sm2Options = [
    "Blackout",
    "Incorrect",
    "Incorrect (Easy)",
    "Hard",
    "Medium",
    "Easy",
];
/**
 * Implementation of the SM2 algorithm as described at
 * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */
var Sm2Algorithm = /** @class */ (function (_super) {
    __extends(Sm2Algorithm, _super);
    function Sm2Algorithm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sm2Algorithm.prototype.defaultSettings = function () {
        return {};
    };
    Sm2Algorithm.prototype.defaultData = function () {
        return {
            ease: 2.5,
            lastInterval: 0,
            iteration: 1,
        };
    };
    Sm2Algorithm.prototype.srsOptions = function () {
        return Sm2Options;
    };
    Sm2Algorithm.prototype.onSelection = function (item, optionStr, repeat) {
        var data = item.data;
        var interval = function (n) {
            if (n === 1) {
                return 1;
            }
            else if (n === 2) {
                return 6;
            }
            else {
                return Math.round(data.lastInterval * data.ease);
            }
        };
        var q = Sm2Options.indexOf(optionStr);
        if (repeat) {
            if (q < 3) {
                return { correct: false, nextReview: -1 };
            }
            else {
                return { correct: true, nextReview: -1 };
            }
        }
        if (q < 3) {
            data.iteration = 1;
            var nextReview = interval(data.iteration);
            data.lastInterval = nextReview;
            return {
                correct: false,
                nextReview: nextReview * DateUtils.DAYS_TO_MILLIS,
            };
        }
        else {
            var nextReview = interval(data.iteration);
            data.iteration += 1;
            data.ease = data.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
            if (data.ease < 1.3) {
                data.ease = 1.3;
            }
            data.lastInterval = nextReview;
            return {
                correct: true,
                nextReview: nextReview * DateUtils.DAYS_TO_MILLIS,
            };
        }
    };
    Sm2Algorithm.prototype.displaySettings = function (containerEl, update) { };
    return Sm2Algorithm;
}(SrsAlgorithm));

var AnkiOptions = ["Again", "Hard", "Good", "Easy"];
/**
 * This is an implementation of the Anki algorithm as described in
 * https://faqs.ankiweb.net/what-spaced-repetition-algorithm.html
 */
var AnkiAlgorithm = /** @class */ (function (_super) {
    __extends(AnkiAlgorithm, _super);
    function AnkiAlgorithm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnkiAlgorithm.prototype.defaultSettings = function () {
        return {
            easyBonus: 1.3,
            startingEase: 2.5,
            lapseInterval: 0.5,
            graduatingInterval: 1,
            easyInterval: 4,
        };
    };
    AnkiAlgorithm.prototype.defaultData = function () {
        return {
            ease: this.settings.startingEase,
            lastInterval: 0,
            iteration: 1,
        };
    };
    AnkiAlgorithm.prototype.srsOptions = function () {
        return AnkiOptions;
    };
    AnkiAlgorithm.prototype.onSelection = function (item, optionStr, repeat) {
        var data = item.data;
        var response = AnkiOptions.indexOf(optionStr);
        var correct = true;
        var nextInterval = 0;
        if (repeat) {
            if (response == 0) {
                correct = false;
            }
            return {
                correct: correct,
                nextReview: -1,
            };
        }
        if (response == 0) {
            // Again
            data.ease = Math.max(1.3, data.ease - 0.2);
            nextInterval = data.lastInterval * this.settings.lapseInterval;
            correct = false;
        }
        else if (response == 1) {
            // Hard
            data.ease = Math.max(1.3, data.ease - 0.15);
            nextInterval = data.lastInterval * 1.2;
            if (nextInterval - data.lastInterval < 1)
                nextInterval = data.lastInterval + 1;
        }
        else if (response == 2) {
            // Good
            if (data.iteration == 1) {
                // Graduation!
                nextInterval = this.settings.graduatingInterval;
            }
            else {
                nextInterval = data.lastInterval * data.ease;
                if (nextInterval - data.lastInterval < 1)
                    nextInterval = data.lastInterval + 1;
            }
        }
        else if (response == 3) {
            data.ease += 0.15;
            if (data.iteration == 1) {
                // Graduation!
                nextInterval = this.settings.easyInterval;
            }
            else {
                nextInterval =
                    data.lastInterval * data.ease * this.settings.easyBonus;
            }
        }
        data.iteration += 1;
        data.lastInterval = nextInterval;
        return {
            correct: correct,
            nextReview: nextInterval * DateUtils.DAYS_TO_MILLIS,
        };
    };
    AnkiAlgorithm.prototype.displaySettings = function (containerEl, update) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName("Starting Ease")
            .setDesc("The initial ease given to an item.")
            .addText(function (text) {
            return text
                .setPlaceholder("Starting Ease")
                .setValue(_this.settings.startingEase.toString())
                .onChange(function (newValue) {
                var ease = Number(newValue);
                if (isNaN(ease) || ease < 0) {
                    new obsidian.Notice("Starting ease must be a positive number.");
                    return;
                }
                if (ease < 1.3) {
                    new obsidian.Notice("Starting ease lower than 1.3 is not recommended.");
                }
                _this.settings.startingEase = ease;
                update(_this.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Easy Bonus")
            .setDesc("A bonus multiplier for items reviewed as easy.")
            .addText(function (text) {
            return text
                .setPlaceholder("Easy Bonus")
                .setValue(_this.settings.easyBonus.toString())
                .onChange(function (newValue) {
                var bonus = Number(newValue);
                if (isNaN(bonus) || bonus < 1) {
                    new obsidian.Notice("Easy bonus must be a number greater than or equal to 1.");
                    return;
                }
                _this.settings.easyBonus = bonus;
                update(_this.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Lapse Interval Modifier")
            .setDesc("A factor to modify the review interval with when an item is reviewed as wrong.")
            .addText(function (text) {
            return text
                .setPlaceholder("Lapse Interval")
                .setValue(_this.settings.lapseInterval.toString())
                .onChange(function (newValue) {
                var lapse = Number(newValue);
                if (isNaN(lapse) || lapse <= 0) {
                    new obsidian.Notice("Lapse interval must be a positive number.");
                    return;
                }
                _this.settings.lapseInterval = lapse;
                update(_this.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Graduating Interval")
            .setDesc("The interval (in days) to the next review after reviewing a new item as 'Good'.")
            .addText(function (text) {
            return text
                .setPlaceholder("Graduating Interval")
                .setValue(_this.settings.graduatingInterval.toString())
                .onChange(function (newValue) {
                var interval = Number(newValue);
                if (isNaN(interval) || interval <= 0) {
                    new obsidian.Notice("Interval must be a positive number.");
                    return;
                }
                _this.settings.graduatingInterval = interval;
                update(_this.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Easy Interval")
            .setDesc("The interval (in days) to the next review after reviewing a new item as 'Easy'.")
            .addText(function (text) {
            return text
                .setPlaceholder("Easy Interval")
                .setValue(_this.settings.easyInterval.toString())
                .onChange(function (newValue) {
                var interval = Number(newValue);
                if (isNaN(interval) || interval <= 0) {
                    new obsidian.Notice("Interval must be a positive number.");
                    return;
                }
                _this.settings.easyInterval = interval;
                update(_this.settings);
            });
        });
    };
    return AnkiAlgorithm;
}(SrsAlgorithm));

var ConfirmModal = /** @class */ (function (_super) {
    __extends(ConfirmModal, _super);
    function ConfirmModal(app, message, callback) {
        var _this = _super.call(this, app) || this;
        _this.message = message;
        _this.callback = callback;
        return _this;
    }
    ConfirmModal.prototype.onOpen = function () {
        var _this = this;
        var contentEl = this.contentEl;
        contentEl.createEl("p").setText(this.message);
        var buttonDiv = contentEl.createDiv("srs-flex-row");
        new obsidian.ButtonComponent(buttonDiv)
            .setButtonText("Confirm")
            .onClick(function () {
            _this.callback(true);
            _this.close();
        })
            .setCta();
        new obsidian.ButtonComponent(buttonDiv).setButtonText("Cancel").onClick(function () {
            _this.callback(false);
            _this.close();
        });
    };
    return ConfirmModal;
}(obsidian.Modal));

var algorithms = {
    Anki: new AnkiAlgorithm(),
    SM2: new Sm2Algorithm(),
    Leitner: new LeitnerAlgorithm(),
};
var DataLocation;
(function (DataLocation) {
    DataLocation["PluginFolder"] = "In Plugin Folder";
    DataLocation["RootFolder"] = "In Vault Folder";
})(DataLocation || (DataLocation = {}));
var locationMap = {
    "In Vault Folder": DataLocation.RootFolder,
    "In Plugin Folder": DataLocation.PluginFolder,
};
var DEFAULT_SETTINGS = {
    maxNewPerDay: 20,
    repeatItems: true,
    dataLocation: DataLocation.RootFolder,
    locationPath: "",
    algorithm: Object.keys(algorithms)[0],
    algorithmSettings: Object.values(algorithms)[0].settings,
};
var SrsSettingTab = /** @class */ (function (_super) {
    __extends(SrsSettingTab, _super);
    function SrsSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SrsSettingTab.prototype.display = function () {
        var plugin = this.plugin;
        var containerEl = this.containerEl;
        containerEl.empty();
        this.addNewPerDaySetting(containerEl);
        this.addRepeatItemsSetting(containerEl);
        this.addDataLocationSettings(containerEl);
        this.addAlgorithmSetting(containerEl);
        containerEl.createEl("h1").innerText = "Algorithm Settings";
        // Add algorithm specific settings
        plugin.algorithm.displaySettings(containerEl, function (settings) {
            plugin.settings.algorithmSettings = settings;
            plugin.saveData(plugin.settings);
        });
    };
    SrsSettingTab.prototype.addDataLocationSettings = function (containerEl) {
        var plugin = this.plugin;
        new obsidian.Setting(containerEl)
            .setName("Data Location")
            .setDesc("Where to store the data file for spaced repetition items.")
            .addDropdown(function (dropdown) {
            Object.values(DataLocation).forEach(function (val) {
                dropdown.addOption(val, val);
            });
            dropdown.setValue(plugin.settings.dataLocation);
            dropdown.onChange(function (val) {
                var loc = locationMap[val];
                plugin.settings.dataLocation = loc;
                plugin.store.moveStoreLocation();
                plugin.saveData(plugin.settings);
            });
        });
    };
    SrsSettingTab.prototype.addRepeatItemsSetting = function (containerEl) {
        var plugin = this.plugin;
        new obsidian.Setting(containerEl)
            .setName("Repeat Items")
            .setDesc("Should items marked as incorrect be repeated until correct?")
            .addToggle(function (toggle) {
            toggle.setValue(plugin.settings.repeatItems);
            toggle.onChange(function (value) {
                plugin.settings.repeatItems = value;
                plugin.saveData(plugin.settings);
            });
        });
    };
    SrsSettingTab.prototype.addAlgorithmSetting = function (containerEl) {
        var plugin = this.plugin;
        new obsidian.Setting(containerEl)
            .setName("Algorithm")
            .addDropdown(function (dropdown) {
            Object.keys(algorithms).forEach(function (val) {
                dropdown.addOption(val, val);
            });
            dropdown.setValue(plugin.settings.algorithm);
            dropdown.onChange(function (newValue) {
                if (newValue != plugin.settings.algorithm) {
                    new ConfirmModal(plugin.app, "Switching algorithms might reset or impact review timings on existing items.\n                            This change is irreversible. Changing algorithms only takes effect after a restart\n                            or a plugin reload. Are you sure you want to switch algorithms?\n                            ", function (confirmed) {
                        if (confirmed) {
                            plugin.settings.algorithm = newValue;
                            plugin.saveData(plugin.settings);
                        }
                        else {
                            dropdown.setValue(plugin.settings.algorithm);
                        }
                    }).open();
                }
            });
        })
            .settingEl.querySelector(".setting-item-description").innerHTML =
            'The algorithm used for spaced repetition. For more information see <a href="https://github.com/martin-jw/obsidian-recall">algorithms</a>.';
    };
    SrsSettingTab.prototype.addNewPerDaySetting = function (containerEl) {
        var plugin = this.plugin;
        new obsidian.Setting(containerEl)
            .setName("New Per Day")
            .setDesc("Maximum number of new (unreviewed) notes to add to the queue each day.")
            .addText(function (text) {
            return text
                .setPlaceholder("New Per Day")
                .setValue(plugin.settings.maxNewPerDay.toString())
                .onChange(function (newValue) {
                var newPerDay = Number(newValue);
                if (isNaN(newPerDay)) {
                    new obsidian.Notice("Timeout must be a number");
                    return;
                }
                if (newPerDay < -1) {
                    new obsidian.Notice("New per day must be -1 or greater.");
                    return;
                }
                plugin.settings.maxNewPerDay = newPerDay;
                plugin.saveData(plugin.settings);
            });
        });
    };
    return SrsSettingTab;
}(obsidian.PluginSettingTab));

var ROOT_DATA_PATH = "./tracked_files.json";
var PLUGIN_DATA_PATH = "./.obsidian/plugins/obsidian-recall/tracked_files.json";
var DEFAULT_SRS_DATA = {
    queue: [],
    repeatQueue: [],
    items: [],
    trackedFiles: [],
    lastQueue: 0,
    newAdded: 0,
};
var NEW_ITEM = {
    nextReview: 0,
    fileIndex: -1,
    timesReviewed: 0,
    timesCorrect: 0,
    errorStreak: 0,
    data: {},
};
var DataStore = /** @class */ (function () {
    function DataStore(plugin) {
        this.plugin = plugin;
        this.dataPath = this.getStorePath();
    }
    DataStore.prototype.getStorePath = function () {
        var dataLocation = this.plugin.settings.dataLocation;
        if (dataLocation == DataLocation.PluginFolder) {
            return PLUGIN_DATA_PATH;
        }
        else if (dataLocation == DataLocation.RootFolder) {
            return ROOT_DATA_PATH;
        }
    };
    DataStore.prototype.moveStoreLocation = function () {
        var _this = this;
        // TODO: Validate folder
        var adapter = this.plugin.app.vault.adapter;
        var newPath = this.getStorePath();
        if (newPath === this.dataPath) {
            return false;
        }
        try {
            this.save();
            adapter.remove(this.dataPath).then(function () {
                _this.dataPath = newPath;
                new obsidian.Notice("Successfully moved data file!");
                return true;
            }, function (e) {
                _this.dataPath = newPath;
                new obsidian.Notice("Unable to delete old data file, please delete it manually.");
                console.log(e);
                return true;
            });
        }
        catch (e) {
            new obsidian.Notice("Unable to move data file!");
            console.log(e);
            return false;
        }
    };
    DataStore.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adapter, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adapter = this.plugin.app.vault.adapter;
                        return [4 /*yield*/, adapter.exists(this.dataPath)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, adapter.read(this.dataPath)];
                    case 2:
                        data = _a.sent();
                        if (data == null) {
                            console.log("Unable to read SRS data!");
                            this.data = Object.assign({}, DEFAULT_SRS_DATA);
                        }
                        else {
                            console.log("Reading tracked files...");
                            this.data = Object.assign(Object.assign({}, DEFAULT_SRS_DATA), JSON.parse(data));
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        console.log("Tracked files not found! Creating new file...");
                        this.data = Object.assign({}, DEFAULT_SRS_DATA);
                        return [4 /*yield*/, this.plugin.app.vault.adapter.write(this.dataPath, JSON.stringify(this.data))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataStore.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.plugin.app.vault.adapter.write(this.dataPath, JSON.stringify(this.data))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns total number of items tracked by the SRS.
     */
    DataStore.prototype.items = function () {
        return this.data.items.length;
    };
    /**
     * Returns the size of the current queue.
     */
    DataStore.prototype.queueSize = function () {
        return this.data.queue.length;
    };
    DataStore.prototype.repeatQueueSize = function () {
        return this.data.repeatQueue.length;
    };
    DataStore.prototype.getFileIndex = function (path) {
        return this.data.trackedFiles.findIndex(function (val, ind, obj) {
            return val != null && val.path == path;
        });
    };
    /**
     * Returns whether or not the given file path is tracked by the SRS.
     * @param path The path of the file.
     */
    DataStore.prototype.isTracked = function (path) {
        return this.getFileIndex(path) >= 0;
    };
    DataStore.prototype.isQueued = function (item) {
        return this.data.queue.includes(item);
    };
    DataStore.prototype.isInRepeatQueue = function (item) {
        return this.data.repeatQueue.includes(item);
    };
    /**
     * Returns when the given item is reviewed next (in hours).
     */
    DataStore.prototype.nextReview = function (itemId) {
        var item = this.data.items[itemId];
        if (item == null) {
            return -1;
        }
        var now = new Date();
        return (item.nextReview - now.getTime()) / (1000 * 60 * 60);
    };
    DataStore.prototype.getItemsOfFile = function (path) {
        var _this = this;
        var result = [];
        var file = this.data.trackedFiles[this.getFileIndex(path)];
        Object.values(file.items).forEach(function (item) {
            result.push(_this.data.items[item]);
        });
        return result;
    };
    DataStore.prototype.getNext = function () {
        var id = this.getNextId();
        if (id != null) {
            return this.data.items[id];
        }
        return null;
    };
    DataStore.prototype.getNextId = function () {
        if (this.queueSize() > 0) {
            return this.data.queue[0];
        }
        else if (this.data.repeatQueue.length > 0) {
            return this.data.repeatQueue[0];
        }
        else {
            return null;
        }
    };
    DataStore.prototype.getFilePath = function (item) {
        return this.data.trackedFiles[item.fileIndex].path;
    };
    DataStore.prototype.reviewId = function (itemId, option) {
        var item = this.data.items[itemId];
        if (item == null) {
            return -1;
        }
        if (this.isInRepeatQueue(itemId)) {
            var result = this.plugin.algorithm.onSelection(item, option, true);
            this.data.repeatQueue.remove(itemId);
            if (!result.correct) {
                this.data.repeatQueue.push(itemId); // Re-add until correct.
            }
        }
        else {
            var result = this.plugin.algorithm.onSelection(item, option, false);
            item.nextReview = DateUtils.fromNow(result.nextReview).getTime();
            item.timesReviewed += 1;
            this.data.queue.remove(itemId);
            if (result.correct) {
                item.timesCorrect += 1;
                item.errorStreak = 0;
            }
            else {
                item.errorStreak += 1;
                if (this.plugin.settings.repeatItems) {
                    this.data.repeatQueue.push(itemId);
                }
            }
        }
    };
    DataStore.prototype.untrackFilesInFolderPath = function (path, recursive) {
        var folder = this.plugin.app.vault.getAbstractFileByPath(path);
        if (folder != null) {
            this.untrackFilesInFolder(folder, recursive);
        }
    };
    DataStore.prototype.untrackFilesInFolder = function (folder, recursive) {
        var _this = this;
        if (recursive == null)
            recursive = true;
        folder.children.forEach(function (child) {
            if (child instanceof obsidian.TFolder) {
                if (recursive) {
                    _this.untrackFilesInFolder(child, recursive);
                }
            }
            else if (child instanceof obsidian.TFile) {
                if (_this.isTracked(child.path)) {
                    _this.untrackFile(child.path, false);
                }
            }
        });
    };
    DataStore.prototype.trackFilesInFolderPath = function (path, recursive) {
        var folder = this.plugin.app.vault.getAbstractFileByPath(path);
        if (folder != null) {
            this.trackFilesInFolder(folder, recursive);
        }
    };
    DataStore.prototype.trackFilesInFolder = function (folder, recursive) {
        var _this = this;
        if (recursive == null)
            recursive = true;
        var totalAdded = 0;
        var totalRemoved = 0;
        folder.children.forEach(function (child) {
            if (child instanceof obsidian.TFolder) {
                if (recursive) {
                    _this.trackFilesInFolder(child, recursive);
                }
            }
            else if (child instanceof obsidian.TFile) {
                if (!_this.isTracked(child.path)) {
                    var _a = _this.trackFile(child.path, false), added = _a.added, removed = _a.removed;
                    totalAdded += added;
                    totalRemoved += removed;
                }
            }
        });
        new obsidian.Notice("Added " +
            totalAdded +
            " new items, removed " +
            totalRemoved +
            " items.");
    };
    DataStore.prototype.trackFile = function (path, notice) {
        this.data.trackedFiles.push({
            path: path,
            items: {},
        });
        var data = this.updateItems(path, notice);
        console.log("Tracked: " + path);
        this.plugin.updateStatusBar();
        return data;
    };
    DataStore.prototype.untrackFile = function (path, notice) {
        if (notice == null)
            notice = true;
        var index = this.getFileIndex(path);
        if (index == -1) {
            return;
        }
        var trackedFile = this.data.trackedFiles[index];
        var numItems = Object.keys(trackedFile.items).length;
        for (var key in trackedFile.items) {
            var ind = trackedFile.items[key];
            if (this.isQueued(ind)) {
                this.data.queue.remove(ind);
            }
            if (this.isInRepeatQueue(ind)) {
                this.data.repeatQueue.remove(ind);
            }
            this.data.items[ind] = null;
        }
        if (notice) {
            new obsidian.Notice("Untracked " + numItems + " items!");
        }
        this.data.trackedFiles[index] = null;
        this.plugin.updateStatusBar();
        console.log("Untracked: " + path);
    };
    DataStore.prototype.updateItems = function (path, notice) {
        if (notice == null)
            notice = true;
        var ind = this.getFileIndex(path);
        if (ind == -1) {
            console.log("Attempt to update untracked file: " + path);
            return;
        }
        var trackedFile = this.data.trackedFiles[ind];
        var file = this.plugin.app.vault.getAbstractFileByPath(path);
        if (!file) {
            console.log("Could not find file: " + path);
            return;
        }
        var added = 0;
        var removed = 0;
        var newItems = {};
        if ("file" in trackedFile.items) {
            newItems["file"] = trackedFile.items["file"];
        }
        else {
            var newItem = Object.assign({}, NEW_ITEM);
            newItem.data = Object.assign(this.plugin.algorithm.defaultData());
            newItem.fileIndex = ind;
            newItems["file"] = this.data.items.push(newItem) - 1;
            added += 1;
        }
        for (var key in trackedFile.items) {
            if (!(key in newItems)) {
                var itemInd = trackedFile.items[key];
                if (this.isQueued(itemInd)) {
                    this.data.queue.remove(itemInd);
                }
                if (this.isInRepeatQueue(itemInd)) {
                    this.data.repeatQueue.remove(itemInd);
                }
                this.data.items[ind] = null;
                removed += 1;
            }
        }
        trackedFile.items = newItems;
        if (notice) {
            new obsidian.Notice("Added " + added + " new items, removed " + removed + " items.");
        }
        return { added: added, removed: removed };
    };
    DataStore.prototype.renameTrackedFile = function (old, newPath) {
        var index = this.getFileIndex(old);
        // Sanity check
        if (index == -1) {
            console.log("Renamed file is not tracked!");
            return;
        }
        var fileData = this.data.trackedFiles[index];
        fileData.path = newPath;
        this.data.trackedFiles[index] = fileData;
        console.log("Updated tracking: " + old + " -> " + newPath);
    };
    DataStore.prototype.buildQueue = function () {
        var _this = this;
        console.log("Building queue...");
        var data = this.data;
        var maxNew = this.plugin.settings.maxNewPerDay;
        var now = new Date();
        if (now.getDate() != new Date(this.data.lastQueue).getDate()) {
            this.data.newAdded = 0;
        }
        var oldAdd = 0;
        var newAdd = 0;
        this.data.items.forEach(function (item, id) {
            if (item != null) {
                if (item.nextReview == 0) {
                    // This is a new item.
                    if (maxNew == -1 || data.newAdded < maxNew) {
                        item.nextReview = now.getTime();
                        data.newAdded += 1;
                        data.queue.push(id);
                        newAdd += 1;
                    }
                }
                else if (item.nextReview <= now.getTime()) {
                    if (_this.isInRepeatQueue(id)) {
                        data.repeatQueue.remove(id);
                    }
                    if (!_this.isQueued(id)) {
                        data.queue.push(id);
                        oldAdd += 1;
                    }
                }
            }
        });
        this.data.lastQueue = now.getTime();
        console.log("Added " +
            (oldAdd + newAdd) +
            " files to review queue, with " +
            newAdd +
            " new!");
    };
    DataStore.prototype.resetData = function () {
        this.data = Object.assign({}, DEFAULT_SRS_DATA);
    };
    return DataStore;
}());

var ReviewView = /** @class */ (function (_super) {
    __extends(ReviewView, _super);
    function ReviewView(leaf, plugin) {
        var _this = _super.call(this, leaf) || this;
        _this.plugin = plugin;
        var contentEl = _this.containerEl.querySelector(".view-content");
        _this.wrapperEl = contentEl.createDiv("srs-review-wrapper");
        _this.questionSubView = new ReviewQuestionView(_this);
        _this.answerSubView = new ReviewAnswerView(_this);
        _this.emptySubView = new ReviewEmptyView(_this);
        _this.currentSubView = _this.emptySubView;
        return _this;
    }
    ReviewView.prototype.setState = function (state, result) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.mode = state.mode;
                        this.item = state.item;
                        return [4 /*yield*/, _super.prototype.setState.call(this, state, result)];
                    case 1:
                        _a.sent();
                        if (!this.file) {
                            this.mode = "empty";
                        }
                        if (this.mode == null || this.mode == "empty") {
                            this.currentSubView.hide();
                            this.currentSubView = this.emptySubView;
                            this.currentSubView.show();
                            return [2 /*return*/];
                        }
                        this.currentSubView.hide();
                        if (this.mode == "question") {
                            this.currentSubView = this.questionSubView;
                            this.currentSubView.show();
                        }
                        else if (this.mode == "answer") {
                            this.currentSubView = this.answerSubView;
                            this.currentSubView.show();
                        }
                        console.log("Loading item " + this.item + "...");
                        this.app.vault.cachedRead(this.file).then(function (content) {
                            var question = _this.file.basename;
                            var answer = content.trim();
                            var metadata = _this.app.metadataCache.getFileCache(_this.file);
                            if (metadata) {
                                if (metadata.headings && metadata.headings.length > 0) {
                                    question = metadata.headings[0].heading;
                                    answer = content
                                        .substr(metadata.headings[0].position.end.offset + 1)
                                        .trim();
                                }
                            }
                            _this.currentSubView.set(question, answer, _this.file);
                        }, function (err) {
                            console.log("Unable to read item: " + err);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ReviewView.prototype.getState = function () {
        var state = _super.prototype.getState.call(this);
        state.mode = this.mode;
        return state;
    };
    ReviewView.prototype.getViewType = function () {
        return "srs-review-view";
    };
    return ReviewView;
}(obsidian.FileView));
var ReviewEmptyView = /** @class */ (function () {
    function ReviewEmptyView(view) {
        this.containerEl = view.wrapperEl.createDiv("srs-review-empty");
        this.containerEl.hidden = true;
        this.containerEl.innerText = "Your queue is empty!";
    }
    ReviewEmptyView.prototype.set = function (question, answer, file) { };
    ReviewEmptyView.prototype.show = function () {
        this.containerEl.hidden = false;
    };
    ReviewEmptyView.prototype.hide = function () {
        this.containerEl.hidden = true;
    };
    return ReviewEmptyView;
}());
var ReviewQuestionView = /** @class */ (function () {
    function ReviewQuestionView(view) {
        var answerClick = function (view) {
            view.leaf.setViewState({
                type: "srs-review-view",
                state: {
                    file: view.file.path,
                    mode: "answer",
                    item: view.item,
                },
            });
        };
        this.containerEl = view.wrapperEl.createDiv("srs-review-question");
        this.containerEl.hidden = true;
        this.questionEl = this.containerEl.createDiv("srs-question-content");
        var buttonDiv = this.containerEl.createDiv("srs-button-div");
        var buttonRow = buttonDiv.createDiv("srs-flex-row");
        var openFileRow = buttonDiv.createDiv("srs-flex-row");
        new obsidian.ButtonComponent(buttonRow)
            .setButtonText("Show Answer")
            .setCta()
            .onClick(function () { return answerClick(view); });
        new obsidian.ButtonComponent(openFileRow)
            .setButtonText("Open File")
            .onClick(function () {
            var leaf = view.app.workspace.getUnpinnedLeaf();
            leaf.setViewState({
                type: "markdown",
                state: {
                    file: view.file.path,
                },
            });
            view.app.workspace.setActiveLeaf(leaf);
        })
            .setClass("srs-review-button");
    }
    ReviewQuestionView.prototype.set = function (question, answer, file) {
        this.questionEl.empty();
        obsidian.MarkdownRenderer.renderMarkdown("# " + question, this.questionEl, file.path, null);
    };
    ReviewQuestionView.prototype.show = function () {
        this.containerEl.hidden = false;
    };
    ReviewQuestionView.prototype.hide = function () {
        this.containerEl.hidden = true;
    };
    return ReviewQuestionView;
}());
var ReviewAnswerView = /** @class */ (function () {
    function ReviewAnswerView(view) {
        var _this = this;
        var buttonClick = function (view, s) {
            view.plugin.store.reviewId(view.item, s);
            var item = view.plugin.store.getNext();
            var state = { mode: "empty" };
            if (item != null) {
                var path = view.plugin.store.getFilePath(item);
                if (path != null) {
                    state.file = path;
                    state.item = view.plugin.store.getNextId();
                    state.mode = "question";
                }
            }
            view.leaf.setViewState({
                type: "srs-review-view",
                state: state,
            });
        };
        this.containerEl = view.wrapperEl.createDiv("srs-review-answer");
        this.containerEl.hidden = true;
        var wrapperEl = this.containerEl.createDiv('srs-qa-wrapper');
        this.questionEl = wrapperEl.createDiv("srs-question-content");
        this.answerEl = wrapperEl.createDiv("srs-answer-content");
        var buttonDiv = this.containerEl.createDiv("srs-button-div");
        var buttonRow = buttonDiv.createDiv("srs-flex-row");
        var openFileRow = buttonDiv.createDiv("srs-flex-row");
        this.buttons = [];
        view.plugin.algorithm.srsOptions().forEach(function (s) {
            _this.buttons.push(new obsidian.ButtonComponent(buttonRow)
                .setButtonText(s)
                .setCta()
                .onClick(function () { return buttonClick(view, s); })
                // .setTooltip("Hotkey: " + (this.buttons.length + 1))
                .setClass("srs-review-button"));
        });
        new obsidian.ButtonComponent(openFileRow)
            .setButtonText("Open File")
            .onClick(function () {
            var leaf = view.app.workspace.getUnpinnedLeaf();
            leaf.setViewState({
                type: "markdown",
                state: {
                    file: view.file.path,
                },
            });
            view.app.workspace.setActiveLeaf(leaf);
        })
            .setClass("srs-review-button");
    }
    ReviewAnswerView.prototype.set = function (question, answer, file) {
        this.questionEl.empty();
        this.answerEl.empty();
        obsidian.MarkdownRenderer.renderMarkdown("# " + question, this.questionEl, file.path, null);
        obsidian.MarkdownRenderer.renderMarkdown(answer, this.answerEl, file.path, null);
    };
    ReviewAnswerView.prototype.show = function () {
        this.containerEl.hidden = false;
    };
    ReviewAnswerView.prototype.hide = function () {
        this.containerEl.hidden = true;
    };
    return ReviewAnswerView;
}());

var Commands = /** @class */ (function () {
    function Commands(plugin) {
        this.plugin = plugin;
    }
    Commands.prototype.addCommands = function () {
        var plugin = this.plugin;
        // plugin.addCommand({
        //     id: "view-item-info",
        //     name: "Item Info",
        //     checkCallback: (checking: boolean) => {
        //         let file = plugin.app.workspace.getActiveFile();
        //         if (file) {
        //             if (plugin.store.isTracked(file.path)) {
        //                 if (!checking) {
        //                     new ItemInfoModal(plugin, file).open();
        //                 }
        //                 return true;
        //             }
        //         }
        //         return false;
        //     },
        // });
        plugin.addCommand({
            id: "track-file",
            name: "Track Note",
            checkCallback: function (checking) {
                var file = plugin.app.workspace.getActiveFile();
                if (file != null) {
                    if (!plugin.store.isTracked(file.path)) {
                        if (!checking) {
                            plugin.store.trackFile(file.path);
                            plugin.updateStatusBar();
                        }
                        return true;
                    }
                }
                return false;
            },
        });
        plugin.addCommand({
            id: "untrack-file",
            name: "Untrack Note",
            checkCallback: function (checking) {
                var file = plugin.app.workspace.getActiveFile();
                if (file != null) {
                    if (plugin.store.isTracked(file.path)) {
                        if (!checking) {
                            plugin.store.untrackFile(file.path);
                            plugin.updateStatusBar();
                        }
                        return true;
                    }
                }
                return false;
            },
        });
        plugin.addCommand({
            id: "update-file",
            name: "Update Note",
            checkCallback: function (checking) {
                var file = plugin.app.workspace.getActiveFile();
                if (file != null) {
                    if (plugin.store.isTracked(file.path)) {
                        if (!checking) {
                            plugin.store.updateItems(file.path);
                            plugin.updateStatusBar();
                        }
                        return true;
                    }
                }
                return false;
            },
        });
        plugin.addCommand({
            id: "build-queue",
            name: "Build Queue",
            callback: function () {
                plugin.store.buildQueue();
            },
        });
        plugin.addCommand({
            id: "review-view",
            name: "Review",
            callback: function () {
                plugin.store.buildQueue();
                var item = plugin.store.getNext();
                var state = { mode: "empty" };
                if (item != null) {
                    var path = plugin.store.getFilePath(item);
                    if (path != null) {
                        state.file = path;
                        state.item = plugin.store.getNextId();
                        state.mode = "question";
                    }
                }
                var leaf = plugin.app.workspace.getUnpinnedLeaf();
                leaf.setViewState({
                    type: "store-review-view",
                    state: state,
                });
                leaf.setPinned(true);
                plugin.app.workspace.setActiveLeaf(leaf);
            },
        });
    };
    Commands.prototype.addDebugCommands = function () {
        console.log("Injecting debug commands...");
        var plugin = this.plugin;
        plugin.addCommand({
            id: "debug-print-view-state",
            name: "Print View State",
            callback: function () {
                console.log(plugin.app.workspace.activeLeaf.getViewState());
            },
        });
        plugin.addCommand({
            id: "debug-print-eph-state",
            name: "Print Ephemeral State",
            callback: function () {
                console.log(plugin.app.workspace.activeLeaf.getEphemeralState());
            },
        });
        plugin.addCommand({
            id: "debug-print-queue",
            name: "Print Queue",
            callback: function () {
                console.log(plugin.store.data.queue);
                console.log("There are " +
                    plugin.store.data.queue.length +
                    " items in queue.");
                console.log(plugin.store.data.newAdded + " new where added to today.");
            },
        });
        plugin.addCommand({
            id: "debug-clear-queue",
            name: "Clear Queue",
            callback: function () {
                plugin.store.data.queue = [];
            },
        });
        plugin.addCommand({
            id: "debug-queue-all",
            name: "Queue All",
            callback: function () {
                plugin.store.data.queue = [];
                for (var i = 0; i < plugin.store.data.items.length; i++) {
                    if (plugin.store.data.items[i] != null) {
                        plugin.store.data.queue.push(i);
                    }
                }
                console.log("Queue Size: " + plugin.store.queueSize());
            },
        });
        plugin.addCommand({
            id: "debug-print-data",
            name: "Print Data",
            callback: function () {
                console.log(plugin.store.data);
            },
        });
        plugin.addCommand({
            id: "debug-reset-data",
            name: "Reset Data",
            callback: function () {
                console.log("Resetting data...");
                plugin.store.resetData();
                console.log(plugin.store.data);
            },
        });
    };
    return Commands;
}());

var ObsidianSrsPlugin = /** @class */ (function (_super) {
    __extends(ObsidianSrsPlugin, _super);
    function ObsidianSrsPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObsidianSrsPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Loading Obsidian Recall...");
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.algorithm = algorithms[this.settings.algorithm];
                        this.algorithm.updateSettings(this.settings.algorithmSettings);
                        this.store = new DataStore(this);
                        return [4 /*yield*/, this.store.load()];
                    case 2:
                        _a.sent();
                        this.store.buildQueue();
                        this.commands = new Commands(this);
                        this.commands.addCommands();
                        this.barItem = this.addStatusBarItem();
                        this.updateStatusBar();
                        this.addSettingTab(new SrsSettingTab(this.app, this));
                        this.registerEvents();
                        this.registerView("store-review-view", function (leaf) {
                            return new ReviewView(leaf, _this);
                        });
                        this.registerInterval(window.setInterval(function () { return _this.store.save(); }, 5 * 60 * 1000));
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianSrsPlugin.prototype.onunload = function () {
        console.log("Unloading Obsidian Recall. Saving tracked files...");
        this.store.save();
    };
    ObsidianSrsPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianSrsPlugin.prototype.saveSettings = function () {
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
    ObsidianSrsPlugin.prototype.updateStatusBar = function () {
        var view = this.app.workspace.getActiveViewOfType(ReviewView);
        this.barItem.removeClasses(["srs-bar-tracked"]);
        if (view) {
            var text = "Remaining: " +
                (this.store.queueSize() + this.store.repeatQueueSize());
            this.barItem.setText(text);
        }
        else {
            var file = this.app.workspace.getActiveFile();
            var text = "Queue: " + this.store.queueSize();
            if (file == null) {
                this.barItem.setText(text);
            }
            else {
                if (this.store.isTracked(file.path)) {
                    var items = this.store.getItemsOfFile(file.path);
                    var mostRecent_1 = Number.MAX_SAFE_INTEGER;
                    items.forEach(function (item) {
                        if (item.nextReview < mostRecent_1) {
                            mostRecent_1 = item.nextReview;
                        }
                    });
                    var now = new Date();
                    var diff = (mostRecent_1 - now.getTime()) / (1000 * 60 * 60);
                    if (diff <= 0) {
                        text = "Next Review: Now!";
                    }
                    else {
                        if (diff >= 24) {
                            diff /= 24;
                            text = "Next Review: " + diff.toFixed(1) + " days";
                        }
                        else {
                            text = "Next Review: " + diff.toFixed(1) + " hours";
                        }
                    }
                    this.barItem.setText(text);
                    this.barItem.addClass("srs-bar-tracked");
                }
                else {
                    this.barItem.setText(text);
                }
            }
        }
    };
    ObsidianSrsPlugin.prototype.registerEvents = function () {
        var _this = this;
        this.registerEvent(this.app.workspace.on("file-open", function (f) {
            _this.updateStatusBar();
        }));
        this.registerEvent(this.app.workspace.on("file-menu", function (menu, file, source, leaf) {
            if (file instanceof obsidian.TFolder) {
                var folder_1 = file;
                menu.addItem(function (item) {
                    item.setIcon("plus-with-circle");
                    item.setTitle("Track All Notes");
                    item.onClick(function (evt) {
                        _this.store.trackFilesInFolder(folder_1);
                    });
                });
                menu.addItem(function (item) {
                    item.setIcon("minus-with-circle");
                    item.setTitle("Untrack All Notes");
                    item.onClick(function (evt) {
                        _this.store.untrackFilesInFolder(folder_1);
                    });
                });
            }
            else if (file instanceof obsidian.TFile) {
                if (_this.store.isTracked(file.path)) {
                    menu.addItem(function (item) {
                        item.setIcon("minus-with-circle");
                        item.setTitle("Untrack Note");
                        item.onClick(function (evt) {
                            _this.store.untrackFile(file.path);
                        });
                    });
                }
                else {
                    menu.addItem(function (item) {
                        item.setIcon("plus-with-circle");
                        item.setTitle("Track Note");
                        item.onClick(function (evt) {
                            _this.store.trackFile(file.path);
                        });
                    });
                }
            }
        }));
        this.registerEvent(this.app.vault.on("rename", function (file, old) {
            _this.store.renameTrackedFile(old, file.path);
        }));
        this.registerEvent(this.app.vault.on("delete", function (file) {
            _this.store.untrackFile(file.path);
        }));
    };
    return ObsidianSrsPlugin;
}(obsidian.Plugin));

module.exports = ObsidianSrsPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy91dGlscy50cyIsInNyYy9hbGdvcml0aG1zLnRzIiwic3JjL2FsZ29yaXRobXMvbGVpdG5lci50cyIsInNyYy9hbGdvcml0aG1zL3N1cGVybWVtby50cyIsInNyYy9hbGdvcml0aG1zL2Fua2kudHMiLCJzcmMvbW9kYWxzL2NvbmZpcm0udHMiLCJzcmMvc2V0dGluZ3MudHMiLCJzcmMvZGF0YS50cyIsInNyYy92aWV3LnRzIiwic3JjL2NvbW1hbmRzLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBEYXRlVXRpbHMge1xuICAgIHN0YXRpYyBhZGRUaW1lKGRhdGU6IERhdGUsIHRpbWU6IG51bWJlcik6IERhdGUge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkgKyB0aW1lKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbU5vdyh0aW1lOiBudW1iZXIpOiBEYXRlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkVGltZShuZXcgRGF0ZSgpLCB0aW1lKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgREFZU19UT19NSUxMSVMgPSA4NjQwMDAwMDtcbn1cblxuZXhwb3J0IGNsYXNzIE9iamVjdFV0aWxzIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY29weSBvZiBvYmosIGFuZCBjb3BpZXMgdmFsdWVzIGZyb20gc291cmNlIGludG9cbiAgICAgKiB0aGUgY29weSwgYnV0IG9ubHkgaWYgdGhlcmUgYWxyZWFkeSBpcyBhIHByb3BlcnR5IHdpdGggdGhlXG4gICAgICogbWF0Y2hpbmcgbmFtZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvYmpcbiAgICAgKiBAcGFyYW0gc291cmNlXG4gICAgICovXG4gICAgc3RhdGljIGFzc2lnbk9ubHkob2JqOiBhbnksIHNvdXJjZTogYW55KTogYW55IHtcbiAgICAgICAgbGV0IG5ld09iaiA9IE9iamVjdC5hc3NpZ24ob2JqKTtcbiAgICAgICAgaWYgKHNvdXJjZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3T2JqO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFJlcGV0aXRpb25JdGVtLCBSZXZpZXdSZXN1bHQgfSBmcm9tIFwiLi9kYXRhXCI7XG5pbXBvcnQgeyBPYmplY3RVdGlscyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFNyc0FsZ29yaXRobSB7XG4gICAgc2V0dGluZ3M6IGFueTtcblxuICAgIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdFV0aWxzLmFzc2lnbk9ubHkoXG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRTZXR0aW5ncygpLFxuICAgICAgICAgICAgc2V0dGluZ3NcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBkZWZhdWx0U2V0dGluZ3MoKTogYW55O1xuICAgIGFic3RyYWN0IGRlZmF1bHREYXRhKCk6IGFueTtcbiAgICBhYnN0cmFjdCBvblNlbGVjdGlvbihcbiAgICAgICAgaXRlbTogUmVwZXRpdGlvbkl0ZW0sXG4gICAgICAgIG9wdGlvbjogc3RyaW5nLFxuICAgICAgICByZXBlYXQ6IGJvb2xlYW5cbiAgICApOiBSZXZpZXdSZXN1bHQ7XG4gICAgYWJzdHJhY3Qgc3JzT3B0aW9ucygpOiBTdHJpbmdbXTtcbiAgICBhYnN0cmFjdCBkaXNwbGF5U2V0dGluZ3MoXG4gICAgICAgIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgdXBkYXRlOiAoc2V0dGluZ3M6IGFueSkgPT4gdm9pZFxuICAgICk6IHZvaWQ7XG59XG4iLCJpbXBvcnQgU3JzQWxnb3JpdGhtIGZyb20gXCIuLy4uL2FsZ29yaXRobXNcIjtcbmltcG9ydCB7IFJldmlld1Jlc3VsdCwgUmVwZXRpdGlvbkl0ZW0gfSBmcm9tIFwiLi8uLi9kYXRhXCI7XG5pbXBvcnQgeyBEYXRlVXRpbHMsIE9iamVjdFV0aWxzIH0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcblxuaW1wb3J0IHsgU2V0dGluZywgTm90aWNlLCBUZXh0Q29tcG9uZW50IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmludGVyZmFjZSBMZWl0bmVyU2V0dGluZ3Mge1xuICAgIHN0YWdlczogbnVtYmVyO1xuICAgIHJlc2V0T25JbmNvcnJlY3Q6IGJvb2xlYW47XG4gICAgdGltaW5nczogbnVtYmVyW107XG59XG5cbmludGVyZmFjZSBMZWl0bmVyRGF0YSB7XG4gICAgc3RhZ2U6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIExlaXRuZXJBbGdvcml0aG0gZXh0ZW5kcyBTcnNBbGdvcml0aG0ge1xuICAgIHNldHRpbmdzOiBMZWl0bmVyU2V0dGluZ3M7XG4gICAgdGltaW5nc0xpc3Q6IEhUTUxEaXZFbGVtZW50O1xuXG4gICAgZGVmYXVsdFNldHRpbmdzKCk6IExlaXRuZXJTZXR0aW5ncyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZXM6IDYsXG4gICAgICAgICAgICByZXNldE9uSW5jb3JyZWN0OiB0cnVlLFxuICAgICAgICAgICAgdGltaW5nczogWzEsIDMsIDcsIDE0LCAzMCwgMTgwXSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkZWZhdWx0RGF0YSgpOiBMZWl0bmVyRGF0YSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZTogMCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzcnNPcHRpb25zKCk6IFN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtcIldyb25nXCIsIFwiQ29ycmVjdFwiXTtcbiAgICB9XG5cbiAgICBvblNlbGVjdGlvbihcbiAgICAgICAgaXRlbTogUmVwZXRpdGlvbkl0ZW0sXG4gICAgICAgIG9wdGlvbjogU3RyaW5nLFxuICAgICAgICByZXBlYXQ6IGJvb2xlYW5cbiAgICApOiBSZXZpZXdSZXN1bHQge1xuICAgICAgICBjb25zdCBkYXRhID0gaXRlbS5kYXRhO1xuXG4gICAgICAgIGlmIChkYXRhLnN0YWdlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnN0YWdlID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb24gPT0gXCJDb3JyZWN0XCIpIHtcbiAgICAgICAgICAgIGlmIChyZXBlYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBjb3JyZWN0OiB0cnVlLCBuZXh0UmV2aWV3OiAtMSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YS5zdGFnZSArPSAxO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5zdGFnZSA+IHRoaXMuc2V0dGluZ3Muc3RhZ2VzKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zdGFnZSA9IHRoaXMuc2V0dGluZ3Muc3RhZ2VzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvcnJlY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgbmV4dFJldmlldzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy50aW1pbmdzW2RhdGEuc3RhZ2UgLSAxXSAqXG4gICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5EQVlTX1RPX01JTExJUyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY29ycmVjdDogZmFsc2UsIG5leHRSZXZpZXc6IC0xIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnJlc2V0T25JbmNvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnN0YWdlID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zdGFnZSA9IE1hdGgubWF4KDEsIGRhdGEuc3RhZ2UgLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29ycmVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbmV4dFJldmlldzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy50aW1pbmdzW2RhdGEuc3RhZ2UgLSAxXSAqXG4gICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5EQVlTX1RPX01JTExJUyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNwbGF5U2V0dGluZ3MoXG4gICAgICAgIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgdXBkYXRlOiAoc2V0dGluZ3M6IGFueSkgPT4gdm9pZFxuICAgICk6IHZvaWQge1xuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiU3RhZ2VzXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIlRoZSBudW1iZXIgb2YgU1JTIHN0YWdlcy5cIilcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiU3RhZ2VzXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLnN0YWdlcy50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFnZXMgPSBOdW1iZXIobmV3VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4oc3RhZ2VzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJTdGFnZXMgbXVzdCBiZSBhIG51bWJlci5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoc3RhZ2VzKSB8fCBzdGFnZXMgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTdGFnZXMgbXVzdCBiZSBhbiBpbnRlZ2VyIGxhcmdlciB0aGFuIDAuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkID0gdGhpcy5zZXR0aW5ncy5zdGFnZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnN0YWdlcyA9IHN0YWdlcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZCA8IHN0YWdlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGltaW5ncy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5uZXcgQXJyYXk8bnVtYmVyPihzdGFnZXMgLSBvbGQpLmZpbGwoMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvbGQgPiBzdGFnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnRpbWluZ3MgPSB0aGlzLnNldHRpbmdzLnRpbWluZ3Muc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGltaW5nc0xpc3QodXBkYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlJlc2V0IFdoZW4gSW5jb3JyZWN0XCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIklmIHRydWUsIGEgcmV2aWV3IGl0ZW0gaXMgbW92ZWQgYmFjayB0byB0aGUgZmlyc3Qgc3RhZ2Ugd2hlbiBtYXJrZWQgYXMgaW5jb3JyZWN0LiBPdGhlcndpc2UgaXQgc2ltcGx5IG1vdmVzIGJhY2sgdG8gdGhlIHByZXZpb3VzIHN0YWdlLlwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5yZXNldE9uSW5jb3JyZWN0KTtcbiAgICAgICAgICAgICAgICB0b2dnbGUub25DaGFuZ2UoKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnJlc2V0T25JbmNvcnJlY3QgPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZSh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHRpbWluZ3NEaXYgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoXG4gICAgICAgICAgICBcInRpbWluZ3Mtc2V0dGluZy1pdGVtIHNldHRpbmctaXRlbVwiXG4gICAgICAgICk7XG4gICAgICAgIHRpbWluZ3NEaXYuY3JlYXRlRGl2KFwic2V0dGluZy1pdGVtLWluZm9cIiwgKGRpdikgPT4ge1xuICAgICAgICAgICAgZGl2LmNyZWF0ZURpdihcInNldHRpbmctaXRlbS1uYW1lXCIpLmlubmVyVGV4dCA9IFwiVGltaW5nc1wiO1xuICAgICAgICAgICAgZGl2LmNyZWF0ZURpdihcInNldHRpbmctaXRlbS1kZXNjcmlwdGlvblwiKS5pbm5lclRleHQgPVxuICAgICAgICAgICAgICAgIFwiVGhlIHRpbWluZ3MgKGluIGRheXMpIG9mIGVhY2ggU1JTIHN0YWdlLlwiO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50aW1pbmdzTGlzdCA9IHRpbWluZ3NEaXYuY3JlYXRlRGl2KFwic2V0dGluZy1pdGVtLWNvbnRyb2xcIik7XG4gICAgICAgIHRoaXMudXBkYXRlVGltaW5nc0xpc3QodXBkYXRlKTtcbiAgICB9XG5cbiAgICB1cGRhdGVUaW1pbmdzTGlzdCh1cGRhdGU6IChzZXR0aW5nczogYW55KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMudGltaW5nc0xpc3QuZW1wdHkoKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy50aW1pbmdzLmZvckVhY2goKHZhbCwgaW5kKSA9PiB7XG4gICAgICAgICAgICBuZXcgVGV4dENvbXBvbmVudCh0aGlzLnRpbWluZ3NMaXN0KVxuICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihpbmQudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodmFsLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBudW0gPSBOdW1iZXIobmV3VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiVGltaW5nIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG51bSkgfHwgbnVtIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlN0YWdlcyBtdXN0IGJlIGFuIGludGVnZXIgbGFyZ2VyIHRoYW4gMC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnRpbWluZ3NbaW5kXSA9IG51bTtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tIFwic3JjL3V0aWxzXCI7XG5pbXBvcnQgU3JzQWxnb3JpdGhtIGZyb20gXCIuLy4uL2FsZ29yaXRobXNcIjtcbmltcG9ydCB7IFJlcGV0aXRpb25JdGVtLCBSZXZpZXdSZXN1bHQgfSBmcm9tIFwiLi8uLi9kYXRhXCI7XG5cbmludGVyZmFjZSBTbTJEYXRhIHtcbiAgICBlYXNlOiBudW1iZXI7XG4gICAgbGFzdEludGVydmFsOiBudW1iZXI7XG4gICAgaXRlcmF0aW9uOiBudW1iZXI7XG59XG5cbmNvbnN0IFNtMk9wdGlvbnM6IHN0cmluZ1tdID0gW1xuICAgIFwiQmxhY2tvdXRcIixcbiAgICBcIkluY29ycmVjdFwiLFxuICAgIFwiSW5jb3JyZWN0IChFYXN5KVwiLFxuICAgIFwiSGFyZFwiLFxuICAgIFwiTWVkaXVtXCIsXG4gICAgXCJFYXN5XCIsXG5dO1xuXG4vKipcbiAqIEltcGxlbWVudGF0aW9uIG9mIHRoZSBTTTIgYWxnb3JpdGhtIGFzIGRlc2NyaWJlZCBhdFxuICogaHR0cHM6Ly93d3cuc3VwZXJtZW1vLmNvbS9lbi9hcmNoaXZlczE5OTAtMjAxNS9lbmdsaXNoL29sL3NtMlxuICovXG5leHBvcnQgY2xhc3MgU20yQWxnb3JpdGhtIGV4dGVuZHMgU3JzQWxnb3JpdGhtIHtcbiAgICBkZWZhdWx0U2V0dGluZ3MoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGRlZmF1bHREYXRhKCk6IFNtMkRhdGEge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWFzZTogMi41LFxuICAgICAgICAgICAgbGFzdEludGVydmFsOiAwLFxuICAgICAgICAgICAgaXRlcmF0aW9uOiAxLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHNyc09wdGlvbnMoKTogU3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gU20yT3B0aW9ucztcbiAgICB9XG5cbiAgICBvblNlbGVjdGlvbihcbiAgICAgICAgaXRlbTogUmVwZXRpdGlvbkl0ZW0sXG4gICAgICAgIG9wdGlvblN0cjogc3RyaW5nLFxuICAgICAgICByZXBlYXQ6IGJvb2xlYW5cbiAgICApOiBSZXZpZXdSZXN1bHQge1xuICAgICAgICBjb25zdCBkYXRhID0gaXRlbS5kYXRhIGFzIFNtMkRhdGE7XG5cbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBmdW5jdGlvbiAobjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gNjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoZGF0YS5sYXN0SW50ZXJ2YWwgKiBkYXRhLmVhc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHEgPSBTbTJPcHRpb25zLmluZGV4T2Yob3B0aW9uU3RyKTtcblxuICAgICAgICBpZiAocmVwZWF0KSB7XG4gICAgICAgICAgICBpZiAocSA8IDMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBjb3JyZWN0OiBmYWxzZSwgbmV4dFJldmlldzogLTEgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY29ycmVjdDogdHJ1ZSwgbmV4dFJldmlldzogLTEgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChxIDwgMykge1xuICAgICAgICAgICAgZGF0YS5pdGVyYXRpb24gPSAxO1xuICAgICAgICAgICAgY29uc3QgbmV4dFJldmlldyA9IGludGVydmFsKGRhdGEuaXRlcmF0aW9uKTtcbiAgICAgICAgICAgIGRhdGEubGFzdEludGVydmFsID0gbmV4dFJldmlldztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29ycmVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbmV4dFJldmlldzogbmV4dFJldmlldyAqIERhdGVVdGlscy5EQVlTX1RPX01JTExJUyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0UmV2aWV3ID0gaW50ZXJ2YWwoZGF0YS5pdGVyYXRpb24pO1xuICAgICAgICAgICAgZGF0YS5pdGVyYXRpb24gKz0gMTtcbiAgICAgICAgICAgIGRhdGEuZWFzZSA9IGRhdGEuZWFzZSArICgwLjEgLSAoNSAtIHEpICogKDAuMDggKyAoNSAtIHEpICogMC4wMikpO1xuICAgICAgICAgICAgaWYgKGRhdGEuZWFzZSA8IDEuMykge1xuICAgICAgICAgICAgICAgIGRhdGEuZWFzZSA9IDEuMztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YS5sYXN0SW50ZXJ2YWwgPSBuZXh0UmV2aWV3O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvcnJlY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgbmV4dFJldmlldzogbmV4dFJldmlldyAqIERhdGVVdGlscy5EQVlTX1RPX01JTExJUyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNwbGF5U2V0dGluZ3MoXG4gICAgICAgIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgdXBkYXRlOiAoc2V0dGluZ3M6IGFueSkgPT4gdm9pZFxuICAgICk6IHZvaWQge31cbn1cbiIsImltcG9ydCB7IFNldHRpbmcsIE5vdGljZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSBcInNyYy91dGlsc1wiO1xuaW1wb3J0IFNyc0FsZ29yaXRobSBmcm9tIFwiLi8uLi9hbGdvcml0aG1zXCI7XG5pbXBvcnQgeyBSZXBldGl0aW9uSXRlbSwgUmV2aWV3UmVzdWx0IH0gZnJvbSBcIi4vLi4vZGF0YVwiO1xuXG5pbnRlcmZhY2UgQW5raURhdGEge1xuICAgIGVhc2U6IG51bWJlcjtcbiAgICBsYXN0SW50ZXJ2YWw6IG51bWJlcjtcbiAgICBpdGVyYXRpb246IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIEFua2lTZXR0aW5ncyB7XG4gICAgZWFzeUJvbnVzOiBudW1iZXI7XG4gICAgc3RhcnRpbmdFYXNlOiBudW1iZXI7XG4gICAgbGFwc2VJbnRlcnZhbDogbnVtYmVyO1xuICAgIGdyYWR1YXRpbmdJbnRlcnZhbDogbnVtYmVyO1xuICAgIGVhc3lJbnRlcnZhbDogbnVtYmVyO1xufVxuXG5jb25zdCBBbmtpT3B0aW9uczogc3RyaW5nW10gPSBbXCJBZ2FpblwiLCBcIkhhcmRcIiwgXCJHb29kXCIsIFwiRWFzeVwiXTtcblxuLyoqXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBBbmtpIGFsZ29yaXRobSBhcyBkZXNjcmliZWQgaW5cbiAqIGh0dHBzOi8vZmFxcy5hbmtpd2ViLm5ldC93aGF0LXNwYWNlZC1yZXBldGl0aW9uLWFsZ29yaXRobS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBBbmtpQWxnb3JpdGhtIGV4dGVuZHMgU3JzQWxnb3JpdGhtIHtcbiAgICBkZWZhdWx0U2V0dGluZ3MoKTogQW5raVNldHRpbmdzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVhc3lCb251czogMS4zLFxuICAgICAgICAgICAgc3RhcnRpbmdFYXNlOiAyLjUsXG4gICAgICAgICAgICBsYXBzZUludGVydmFsOiAwLjUsXG4gICAgICAgICAgICBncmFkdWF0aW5nSW50ZXJ2YWw6IDEsXG4gICAgICAgICAgICBlYXN5SW50ZXJ2YWw6IDQsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZGVmYXVsdERhdGEoKTogQW5raURhdGEge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWFzZTogdGhpcy5zZXR0aW5ncy5zdGFydGluZ0Vhc2UsXG4gICAgICAgICAgICBsYXN0SW50ZXJ2YWw6IDAsXG4gICAgICAgICAgICBpdGVyYXRpb246IDEsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3JzT3B0aW9ucygpOiBTdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBBbmtpT3B0aW9ucztcbiAgICB9XG5cbiAgICBvblNlbGVjdGlvbihcbiAgICAgICAgaXRlbTogUmVwZXRpdGlvbkl0ZW0sXG4gICAgICAgIG9wdGlvblN0cjogc3RyaW5nLFxuICAgICAgICByZXBlYXQ6IGJvb2xlYW5cbiAgICApOiBSZXZpZXdSZXN1bHQge1xuICAgICAgICBjb25zdCBkYXRhID0gaXRlbS5kYXRhIGFzIEFua2lEYXRhO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IEFua2lPcHRpb25zLmluZGV4T2Yob3B0aW9uU3RyKTtcblxuICAgICAgICBsZXQgY29ycmVjdCA9IHRydWU7XG4gICAgICAgIGxldCBuZXh0SW50ZXJ2YWwgPSAwO1xuICAgICAgICBpZiAocmVwZWF0KSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0LFxuICAgICAgICAgICAgICAgIG5leHRSZXZpZXc6IC0xLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXNwb25zZSA9PSAwKSB7XG4gICAgICAgICAgICAvLyBBZ2FpblxuICAgICAgICAgICAgZGF0YS5lYXNlID0gTWF0aC5tYXgoMS4zLCBkYXRhLmVhc2UgLSAwLjIpO1xuICAgICAgICAgICAgbmV4dEludGVydmFsID0gZGF0YS5sYXN0SW50ZXJ2YWwgKiB0aGlzLnNldHRpbmdzLmxhcHNlSW50ZXJ2YWw7XG4gICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgPT0gMSkge1xuICAgICAgICAgICAgLy8gSGFyZFxuICAgICAgICAgICAgZGF0YS5lYXNlID0gTWF0aC5tYXgoMS4zLCBkYXRhLmVhc2UgLSAwLjE1KTtcbiAgICAgICAgICAgIG5leHRJbnRlcnZhbCA9IGRhdGEubGFzdEludGVydmFsICogMS4yO1xuICAgICAgICAgICAgaWYgKG5leHRJbnRlcnZhbCAtIGRhdGEubGFzdEludGVydmFsIDwgMSlcbiAgICAgICAgICAgICAgICBuZXh0SW50ZXJ2YWwgPSBkYXRhLmxhc3RJbnRlcnZhbCArIDE7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgPT0gMikge1xuICAgICAgICAgICAgLy8gR29vZFxuICAgICAgICAgICAgaWYgKGRhdGEuaXRlcmF0aW9uID09IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBHcmFkdWF0aW9uIVxuICAgICAgICAgICAgICAgIG5leHRJbnRlcnZhbCA9IHRoaXMuc2V0dGluZ3MuZ3JhZHVhdGluZ0ludGVydmFsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0SW50ZXJ2YWwgPSBkYXRhLmxhc3RJbnRlcnZhbCAqIGRhdGEuZWFzZTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dEludGVydmFsIC0gZGF0YS5sYXN0SW50ZXJ2YWwgPCAxKVxuICAgICAgICAgICAgICAgICAgICBuZXh0SW50ZXJ2YWwgPSBkYXRhLmxhc3RJbnRlcnZhbCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgPT0gMykge1xuICAgICAgICAgICAgZGF0YS5lYXNlICs9IDAuMTU7XG4gICAgICAgICAgICBpZiAoZGF0YS5pdGVyYXRpb24gPT0gMSkge1xuICAgICAgICAgICAgICAgIC8vIEdyYWR1YXRpb24hXG4gICAgICAgICAgICAgICAgbmV4dEludGVydmFsID0gdGhpcy5zZXR0aW5ncy5lYXN5SW50ZXJ2YWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHRJbnRlcnZhbCA9XG4gICAgICAgICAgICAgICAgICAgIGRhdGEubGFzdEludGVydmFsICogZGF0YS5lYXNlICogdGhpcy5zZXR0aW5ncy5lYXN5Qm9udXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLml0ZXJhdGlvbiArPSAxO1xuICAgICAgICBkYXRhLmxhc3RJbnRlcnZhbCA9IG5leHRJbnRlcnZhbDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29ycmVjdCxcbiAgICAgICAgICAgIG5leHRSZXZpZXc6IG5leHRJbnRlcnZhbCAqIERhdGVVdGlscy5EQVlTX1RPX01JTExJUyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBkaXNwbGF5U2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCB1cGRhdGU6IChzZXR0aW5nczogYW55KSA9PiB2b2lkKSB7XG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJTdGFydGluZyBFYXNlXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIlRoZSBpbml0aWFsIGVhc2UgZ2l2ZW4gdG8gYW4gaXRlbS5cIilcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiU3RhcnRpbmcgRWFzZVwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5zdGFydGluZ0Vhc2UudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZWFzZSA9IE51bWJlcihuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihlYXNlKSB8fCBlYXNlIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiU3RhcnRpbmcgZWFzZSBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlYXNlIDwgMS4zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTdGFydGluZyBlYXNlIGxvd2VyIHRoYW4gMS4zIGlzIG5vdCByZWNvbW1lbmRlZC5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc3RhcnRpbmdFYXNlID0gZWFzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIkVhc3kgQm9udXNcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFwiQSBib251cyBtdWx0aXBsaWVyIGZvciBpdGVtcyByZXZpZXdlZCBhcyBlYXN5LlwiKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFYXN5IEJvbnVzXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmVhc3lCb251cy50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBib251cyA9IE51bWJlcihuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihib251cykgfHwgYm9udXMgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJFYXN5IGJvbnVzIG11c3QgYmUgYSBudW1iZXIgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5lYXN5Qm9udXMgPSBib251cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIkxhcHNlIEludGVydmFsIE1vZGlmaWVyXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIkEgZmFjdG9yIHRvIG1vZGlmeSB0aGUgcmV2aWV3IGludGVydmFsIHdpdGggd2hlbiBhbiBpdGVtIGlzIHJldmlld2VkIGFzIHdyb25nLlwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkxhcHNlIEludGVydmFsXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmxhcHNlSW50ZXJ2YWwudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFwc2UgPSBOdW1iZXIobmV3VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4obGFwc2UpIHx8IGxhcHNlIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkxhcHNlIGludGVydmFsIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5sYXBzZUludGVydmFsID0gbGFwc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUodGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJHcmFkdWF0aW5nIEludGVydmFsXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIlRoZSBpbnRlcnZhbCAoaW4gZGF5cykgdG8gdGhlIG5leHQgcmV2aWV3IGFmdGVyIHJldmlld2luZyBhIG5ldyBpdGVtIGFzICdHb29kJy5cIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJHcmFkdWF0aW5nIEludGVydmFsXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmdyYWR1YXRpbmdJbnRlcnZhbC50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE51bWJlcihuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihpbnRlcnZhbCkgfHwgaW50ZXJ2YWwgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJJbnRlcnZhbCBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZ3JhZHVhdGluZ0ludGVydmFsID0gaW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUodGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJFYXN5IEludGVydmFsXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIlRoZSBpbnRlcnZhbCAoaW4gZGF5cykgdG8gdGhlIG5leHQgcmV2aWV3IGFmdGVyIHJldmlld2luZyBhIG5ldyBpdGVtIGFzICdFYXN5Jy5cIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFYXN5IEludGVydmFsXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmVhc3lJbnRlcnZhbC50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE51bWJlcihuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihpbnRlcnZhbCkgfHwgaW50ZXJ2YWwgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJJbnRlcnZhbCBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZWFzeUludGVydmFsID0gaW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUodGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgTW9kYWwsIEJ1dHRvbkNvbXBvbmVudCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgRGF0YVN0b3JlIH0gZnJvbSBcIi4uL2RhdGFcIjtcblxudHlwZSBDb25maXJtQ2FsbGJhY2sgPSAoY29uZmlybWVkOiBib29sZWFuKSA9PiB2b2lkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maXJtTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gICAgbWVzc2FnZTogc3RyaW5nO1xuICAgIGNhbGxiYWNrOiBDb25maXJtQ2FsbGJhY2s7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgbWVzc2FnZTogc3RyaW5nLCBjYWxsYmFjazogQ29uZmlybUNhbGxiYWNrKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBvbk9wZW4oKSB7XG4gICAgICAgIGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcblxuICAgICAgICBjb250ZW50RWwuY3JlYXRlRWwoXCJwXCIpLnNldFRleHQodGhpcy5tZXNzYWdlKTtcblxuICAgICAgICBjb25zdCBidXR0b25EaXYgPSBjb250ZW50RWwuY3JlYXRlRGl2KFwic3JzLWZsZXgtcm93XCIpO1xuXG4gICAgICAgIG5ldyBCdXR0b25Db21wb25lbnQoYnV0dG9uRGl2KVxuICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoXCJDb25maXJtXCIpXG4gICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnNldEN0YSgpO1xuXG4gICAgICAgIG5ldyBCdXR0b25Db21wb25lbnQoYnV0dG9uRGl2KS5zZXRCdXR0b25UZXh0KFwiQ2FuY2VsXCIpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgU2V0dGluZywgTm90aWNlLCBQbHVnaW5TZXR0aW5nVGFiIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgT2JzaWRpYW5TcnNQbHVnaW4gZnJvbSBcIi4vbWFpblwiO1xuXG5pbXBvcnQgU3JzQWxnb3JpdGhtIGZyb20gXCIuL2FsZ29yaXRobXNcIjtcbmltcG9ydCB7IExlaXRuZXJBbGdvcml0aG0gfSBmcm9tIFwiLi9hbGdvcml0aG1zL2xlaXRuZXJcIjtcbmltcG9ydCB7IFNtMkFsZ29yaXRobSB9IGZyb20gXCIuL2FsZ29yaXRobXMvc3VwZXJtZW1vXCI7XG5pbXBvcnQgeyBBbmtpQWxnb3JpdGhtIH0gZnJvbSBcIi4vYWxnb3JpdGhtcy9hbmtpXCI7XG5cbmltcG9ydCBDb25maXJtTW9kYWwgZnJvbSBcIi4vbW9kYWxzL2NvbmZpcm1cIjtcblxuZXhwb3J0IGNvbnN0IGFsZ29yaXRobXM6IFJlY29yZDxzdHJpbmcsIFNyc0FsZ29yaXRobT4gPSB7XG4gICAgQW5raTogbmV3IEFua2lBbGdvcml0aG0oKSxcbiAgICBTTTI6IG5ldyBTbTJBbGdvcml0aG0oKSxcbiAgICBMZWl0bmVyOiBuZXcgTGVpdG5lckFsZ29yaXRobSgpLFxufTtcblxuZXhwb3J0IGVudW0gRGF0YUxvY2F0aW9uIHtcbiAgICBQbHVnaW5Gb2xkZXIgPSBcIkluIFBsdWdpbiBGb2xkZXJcIixcbiAgICBSb290Rm9sZGVyID0gXCJJbiBWYXVsdCBGb2xkZXJcIlxufVxuXG5jb25zdCBsb2NhdGlvbk1hcDogUmVjb3JkPHN0cmluZywgRGF0YUxvY2F0aW9uPiA9IHtcbiAgICBcIkluIFZhdWx0IEZvbGRlclwiOiBEYXRhTG9jYXRpb24uUm9vdEZvbGRlcixcbiAgICBcIkluIFBsdWdpbiBGb2xkZXJcIjogRGF0YUxvY2F0aW9uLlBsdWdpbkZvbGRlcixcbn07XG5cblxuZXhwb3J0IGludGVyZmFjZSBTcnNQbHVnaW5TZXR0aW5ncyB7XG4gICAgbWF4TmV3UGVyRGF5OiBudW1iZXI7XG4gICAgcmVwZWF0SXRlbXM6IGJvb2xlYW47XG4gICAgZGF0YUxvY2F0aW9uOiBEYXRhTG9jYXRpb247XG4gICAgbG9jYXRpb25QYXRoOiBzdHJpbmc7XG4gICAgYWxnb3JpdGhtOiBzdHJpbmc7XG4gICAgYWxnb3JpdGhtU2V0dGluZ3M6IGFueTtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNyc1BsdWdpblNldHRpbmdzID0ge1xuICAgIG1heE5ld1BlckRheTogMjAsXG4gICAgcmVwZWF0SXRlbXM6IHRydWUsXG4gICAgZGF0YUxvY2F0aW9uOiBEYXRhTG9jYXRpb24uUm9vdEZvbGRlcixcbiAgICBsb2NhdGlvblBhdGg6IFwiXCIsXG4gICAgYWxnb3JpdGhtOiBPYmplY3Qua2V5cyhhbGdvcml0aG1zKVswXSxcbiAgICBhbGdvcml0aG1TZXR0aW5nczogT2JqZWN0LnZhbHVlcyhhbGdvcml0aG1zKVswXS5zZXR0aW5ncyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNyc1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgICBwbHVnaW46IE9ic2lkaWFuU3JzUGx1Z2luO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogT2JzaWRpYW5TcnNQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbjtcbiAgICAgICAgbGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG5cbiAgICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgICB0aGlzLmFkZE5ld1BlckRheVNldHRpbmcoY29udGFpbmVyRWwpO1xuICAgICAgICB0aGlzLmFkZFJlcGVhdEl0ZW1zU2V0dGluZyhjb250YWluZXJFbCk7XG4gICAgICAgIHRoaXMuYWRkRGF0YUxvY2F0aW9uU2V0dGluZ3MoY29udGFpbmVyRWwpO1xuICAgICAgICB0aGlzLmFkZEFsZ29yaXRobVNldHRpbmcoY29udGFpbmVyRWwpO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDFcIikuaW5uZXJUZXh0ID0gXCJBbGdvcml0aG0gU2V0dGluZ3NcIjtcblxuICAgICAgICAvLyBBZGQgYWxnb3JpdGhtIHNwZWNpZmljIHNldHRpbmdzXG4gICAgICAgIHBsdWdpbi5hbGdvcml0aG0uZGlzcGxheVNldHRpbmdzKGNvbnRhaW5lckVsLCAoc2V0dGluZ3M6IGFueSkgPT4ge1xuICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmFsZ29yaXRobVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkRGF0YUxvY2F0aW9uU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2luO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJEYXRhIExvY2F0aW9uXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIldoZXJlIHRvIHN0b3JlIHRoZSBkYXRhIGZpbGUgZm9yIHNwYWNlZCByZXBldGl0aW9uIGl0ZW1zLlwiKVxuICAgICAgICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC52YWx1ZXMoRGF0YUxvY2F0aW9uKS5mb3JFYWNoKCh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKHZhbCwgdmFsKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5kYXRhTG9jYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgZHJvcGRvd24ub25DaGFuZ2UoKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2MgPSBsb2NhdGlvbk1hcFt2YWxdO1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuZGF0YUxvY2F0aW9uID0gbG9jO1xuICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc3RvcmUubW92ZVN0b3JlTG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRSZXBlYXRJdGVtc1NldHRpbmcoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2luO1xuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiUmVwZWF0IEl0ZW1zXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIlNob3VsZCBpdGVtcyBtYXJrZWQgYXMgaW5jb3JyZWN0IGJlIHJlcGVhdGVkIHVudGlsIGNvcnJlY3Q/XCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRvZ2dsZS5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MucmVwZWF0SXRlbXMpO1xuICAgICAgICAgICAgICAgIHRvZ2dsZS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnJlcGVhdEl0ZW1zID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkQWxnb3JpdGhtU2V0dGluZyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgcGx1Z2luID0gdGhpcy5wbHVnaW47XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIkFsZ29yaXRobVwiKVxuICAgICAgICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGFsZ29yaXRobXMpLmZvckVhY2goKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24odmFsLCB2YWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5hbGdvcml0aG0pO1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLm9uQ2hhbmdlKChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgIT0gcGx1Z2luLnNldHRpbmdzLmFsZ29yaXRobSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IENvbmZpcm1Nb2RhbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uYXBwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBTd2l0Y2hpbmcgYWxnb3JpdGhtcyBtaWdodCByZXNldCBvciBpbXBhY3QgcmV2aWV3IHRpbWluZ3Mgb24gZXhpc3RpbmcgaXRlbXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhpcyBjaGFuZ2UgaXMgaXJyZXZlcnNpYmxlLiBDaGFuZ2luZyBhbGdvcml0aG1zIG9ubHkgdGFrZXMgZWZmZWN0IGFmdGVyIGEgcmVzdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIGEgcGx1Z2luIHJlbG9hZC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHN3aXRjaCBhbGdvcml0aG1zP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmZpcm1lZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlybWVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuYWxnb3JpdGhtID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5hbGdvcml0aG1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApLm9wZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zZXR0aW5nRWwucXVlcnlTZWxlY3RvcihcIi5zZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIikuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICdUaGUgYWxnb3JpdGhtIHVzZWQgZm9yIHNwYWNlZCByZXBldGl0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9tYXJ0aW4tancvb2JzaWRpYW4tcmVjYWxsXCI+YWxnb3JpdGhtczwvYT4uJztcbiAgICB9XG5cbiAgICBhZGROZXdQZXJEYXlTZXR0aW5nKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbjtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiTmV3IFBlciBEYXlcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIFwiTWF4aW11bSBudW1iZXIgb2YgbmV3ICh1bnJldmlld2VkKSBub3RlcyB0byBhZGQgdG8gdGhlIHF1ZXVlIGVhY2ggZGF5LlwiXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIk5ldyBQZXIgRGF5XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MubWF4TmV3UGVyRGF5LnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdQZXJEYXkgPSBOdW1iZXIobmV3VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4obmV3UGVyRGF5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJUaW1lb3V0IG11c3QgYmUgYSBudW1iZXJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3UGVyRGF5IDwgLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiTmV3IHBlciBkYXkgbXVzdCBiZSAtMSBvciBncmVhdGVyLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5tYXhOZXdQZXJEYXkgPSBuZXdQZXJEYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IE9ic2lkaWFuU3JzUGx1Z2luIGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBEYXRhTG9jYXRpb24gfSBmcm9tIFwiLi9zZXR0aW5nc1wiO1xuXG5pbXBvcnQgeyBURmlsZSwgVEZvbGRlciwgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmNvbnN0IFJPT1RfREFUQV9QQVRIOiBzdHJpbmcgPSBcIi4vdHJhY2tlZF9maWxlcy5qc29uXCI7XG5jb25zdCBQTFVHSU5fREFUQV9QQVRIOiBzdHJpbmcgPSBcIi4vLm9ic2lkaWFuL3BsdWdpbnMvb2JzaWRpYW4tcmVjYWxsL3RyYWNrZWRfZmlsZXMuanNvblwiO1xuXG5pbnRlcmZhY2UgU3JzRGF0YSB7XG4gICAgcXVldWU6IG51bWJlcltdO1xuICAgIHJlcGVhdFF1ZXVlOiBudW1iZXJbXTtcbiAgICBpdGVtczogUmVwZXRpdGlvbkl0ZW1bXTtcbiAgICB0cmFja2VkRmlsZXM6IFRyYWNrZWRGaWxlW107XG4gICAgbGFzdFF1ZXVlOiBudW1iZXI7XG4gICAgbmV3QWRkZWQ6IDA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVwZXRpdGlvbkl0ZW0ge1xuICAgIG5leHRSZXZpZXc6IG51bWJlcjtcbiAgICBmaWxlSW5kZXg6IG51bWJlcjtcbiAgICB0aW1lc1Jldmlld2VkOiBudW1iZXI7XG4gICAgdGltZXNDb3JyZWN0OiBudW1iZXI7XG4gICAgZXJyb3JTdHJlYWs6IG51bWJlcjsgLy8gTmVlZGVkIHRvIGNhbGN1bGF0ZSBsZWVjaGVzIGxhdGVyIG9uLlxuICAgIGRhdGE6IGFueTsgLy8gQWRkaXRpb25hbCBkYXRhLCBkZXRlcm1pbmVkIGJ5IHRoZSBzZWxlY3RlZCBhbGdvcml0aG0uXG59XG5cbmludGVyZmFjZSBUcmFja2VkRmlsZSB7XG4gICAgcGF0aDogc3RyaW5nO1xuICAgIGl0ZW1zOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJldmlld1Jlc3VsdCB7XG4gICAgY29ycmVjdDogYm9vbGVhbjtcbiAgICBuZXh0UmV2aWV3OiBudW1iZXI7XG59XG5cbmNvbnN0IERFRkFVTFRfU1JTX0RBVEE6IFNyc0RhdGEgPSB7XG4gICAgcXVldWU6IFtdLFxuICAgIHJlcGVhdFF1ZXVlOiBbXSxcbiAgICBpdGVtczogW10sXG4gICAgdHJhY2tlZEZpbGVzOiBbXSxcbiAgICBsYXN0UXVldWU6IDAsXG4gICAgbmV3QWRkZWQ6IDAsXG59O1xuXG5jb25zdCBORVdfSVRFTTogUmVwZXRpdGlvbkl0ZW0gPSB7XG4gICAgbmV4dFJldmlldzogMCxcbiAgICBmaWxlSW5kZXg6IC0xLFxuICAgIHRpbWVzUmV2aWV3ZWQ6IDAsXG4gICAgdGltZXNDb3JyZWN0OiAwLFxuICAgIGVycm9yU3RyZWFrOiAwLFxuICAgIGRhdGE6IHt9LFxufTtcblxuZXhwb3J0IGNsYXNzIERhdGFTdG9yZSB7XG4gICAgZGF0YTogU3JzRGF0YTtcbiAgICBwbHVnaW46IE9ic2lkaWFuU3JzUGx1Z2luO1xuICAgIGRhdGFQYXRoOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihwbHVnaW46IE9ic2lkaWFuU3JzUGx1Z2luKSB7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICB0aGlzLmRhdGFQYXRoID0gdGhpcy5nZXRTdG9yZVBhdGgoKTtcbiAgICB9XG5cbiAgICBnZXRTdG9yZVBhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgZGF0YUxvY2F0aW9uID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGF0YUxvY2F0aW9uO1xuICAgICAgICBpZiAoZGF0YUxvY2F0aW9uID09IERhdGFMb2NhdGlvbi5QbHVnaW5Gb2xkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBQTFVHSU5fREFUQV9QQVRIO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGFMb2NhdGlvbiA9PSBEYXRhTG9jYXRpb24uUm9vdEZvbGRlcikge1xuICAgICAgICAgICAgcmV0dXJuIFJPT1RfREFUQV9QQVRIO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBtb3ZlU3RvcmVMb2NhdGlvbigpOiBib29sZWFuIHtcbiAgICAgICAgLy8gVE9ETzogVmFsaWRhdGUgZm9sZGVyXG4gICAgICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzLnBsdWdpbi5hcHAudmF1bHQuYWRhcHRlcjtcblxuICAgICAgICBsZXQgbmV3UGF0aCA9IHRoaXMuZ2V0U3RvcmVQYXRoKCk7XG4gICAgICAgIGlmIChuZXdQYXRoID09PSB0aGlzLmRhdGFQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICAgICAgICBhZGFwdGVyLnJlbW92ZSh0aGlzLmRhdGFQYXRoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGFQYXRoID0gbmV3UGF0aDtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiU3VjY2Vzc2Z1bGx5IG1vdmVkIGRhdGEgZmlsZSFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVBhdGggPSBuZXdQYXRoO1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJVbmFibGUgdG8gZGVsZXRlIG9sZCBkYXRhIGZpbGUsIHBsZWFzZSBkZWxldGUgaXQgbWFudWFsbHkuXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcIlVuYWJsZSB0byBtb3ZlIGRhdGEgZmlsZSFcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZCgpIHtcbiAgICAgICAgbGV0IGFkYXB0ZXIgPSB0aGlzLnBsdWdpbi5hcHAudmF1bHQuYWRhcHRlcjtcblxuICAgICAgICBpZiAoYXdhaXQgYWRhcHRlci5leGlzdHModGhpcy5kYXRhUGF0aCkpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgYWRhcHRlci5yZWFkKHRoaXMuZGF0YVBhdGgpO1xuICAgICAgICAgICAgaWYgKGRhdGEgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIHJlYWQgU1JTIGRhdGEhXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU1JTX0RBVEEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlYWRpbmcgdHJhY2tlZCBmaWxlcy4uLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NSU19EQVRBKSxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5wYXJzZShkYXRhKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRyYWNrZWQgZmlsZXMgbm90IGZvdW5kISBDcmVhdGluZyBuZXcgZmlsZS4uLlwiKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU1JTX0RBVEEpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uYXBwLnZhdWx0LmFkYXB0ZXIud3JpdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhUGF0aCxcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgc2F2ZSgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uYXBwLnZhdWx0LmFkYXB0ZXIud3JpdGUoXG4gICAgICAgICAgICB0aGlzLmRhdGFQYXRoLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdG90YWwgbnVtYmVyIG9mIGl0ZW1zIHRyYWNrZWQgYnkgdGhlIFNSUy5cbiAgICAgKi9cbiAgICBpdGVtcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLml0ZW1zLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBjdXJyZW50IHF1ZXVlLlxuICAgICAqL1xuICAgIHF1ZXVlU2l6ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnF1ZXVlLmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXBlYXRRdWV1ZVNpemUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yZXBlYXRRdWV1ZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0RmlsZUluZGV4KHBhdGg6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEudHJhY2tlZEZpbGVzLmZpbmRJbmRleCgodmFsLCBpbmQsIG9iaikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHZhbCAhPSBudWxsICYmIHZhbC5wYXRoID09IHBhdGg7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGZpbGUgcGF0aCBpcyB0cmFja2VkIGJ5IHRoZSBTUlMuXG4gICAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggb2YgdGhlIGZpbGUuXG4gICAgICovXG4gICAgaXNUcmFja2VkKHBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGaWxlSW5kZXgocGF0aCkgPj0gMDtcbiAgICB9XG5cbiAgICBpc1F1ZXVlZChpdGVtOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5xdWV1ZS5pbmNsdWRlcyhpdGVtKTtcbiAgICB9XG5cbiAgICBpc0luUmVwZWF0UXVldWUoaXRlbTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucmVwZWF0UXVldWUuaW5jbHVkZXMoaXRlbSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGVuIHRoZSBnaXZlbiBpdGVtIGlzIHJldmlld2VkIG5leHQgKGluIGhvdXJzKS5cbiAgICAgKi9cbiAgICBuZXh0UmV2aWV3KGl0ZW1JZDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YS5pdGVtc1tpdGVtSWRdO1xuICAgICAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3c6IERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICByZXR1cm4gKGl0ZW0ubmV4dFJldmlldyAtIG5vdy5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwKTtcbiAgICB9XG5cbiAgICBnZXRJdGVtc09mRmlsZShwYXRoOiBzdHJpbmcpOiBSZXBldGl0aW9uSXRlbVtdIHtcbiAgICAgICAgbGV0IHJlc3VsdDogUmVwZXRpdGlvbkl0ZW1bXSA9IFtdO1xuICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5kYXRhLnRyYWNrZWRGaWxlc1t0aGlzLmdldEZpbGVJbmRleChwYXRoKV07XG4gICAgICAgIE9iamVjdC52YWx1ZXMoZmlsZS5pdGVtcykuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5kYXRhLml0ZW1zW2l0ZW1dKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZ2V0TmV4dCgpOiBSZXBldGl0aW9uSXRlbSB8IG51bGwge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0TmV4dElkKCk7XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLml0ZW1zW2lkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldE5leHRJZCgpOiBudW1iZXIgfCBudWxsIHtcbiAgICAgICAgaWYgKHRoaXMucXVldWVTaXplKCkgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnF1ZXVlWzBdO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YS5yZXBlYXRRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnJlcGVhdFF1ZXVlWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRGaWxlUGF0aChpdGVtOiBSZXBldGl0aW9uSXRlbSk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnRyYWNrZWRGaWxlc1tpdGVtLmZpbGVJbmRleF0ucGF0aDtcbiAgICB9XG5cbiAgICByZXZpZXdJZChpdGVtSWQ6IG51bWJlciwgb3B0aW9uOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YS5pdGVtc1tpdGVtSWRdO1xuICAgICAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0luUmVwZWF0UXVldWUoaXRlbUlkKSkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMucGx1Z2luLmFsZ29yaXRobS5vblNlbGVjdGlvbihpdGVtLCBvcHRpb24sIHRydWUpO1xuXG4gICAgICAgICAgICB0aGlzLmRhdGEucmVwZWF0UXVldWUucmVtb3ZlKGl0ZW1JZCk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnJlcGVhdFF1ZXVlLnB1c2goaXRlbUlkKTsgLy8gUmUtYWRkIHVudGlsIGNvcnJlY3QuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5wbHVnaW4uYWxnb3JpdGhtLm9uU2VsZWN0aW9uKGl0ZW0sIG9wdGlvbiwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpdGVtLm5leHRSZXZpZXcgPSBEYXRlVXRpbHMuZnJvbU5vdyhyZXN1bHQubmV4dFJldmlldykuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaXRlbS50aW1lc1Jldmlld2VkICs9IDE7XG4gICAgICAgICAgICB0aGlzLmRhdGEucXVldWUucmVtb3ZlKGl0ZW1JZCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0LmNvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBpdGVtLnRpbWVzQ29ycmVjdCArPSAxO1xuICAgICAgICAgICAgICAgIGl0ZW0uZXJyb3JTdHJlYWsgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLmVycm9yU3RyZWFrICs9IDE7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MucmVwZWF0SXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnJlcGVhdFF1ZXVlLnB1c2goaXRlbUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bnRyYWNrRmlsZXNJbkZvbGRlclBhdGgocGF0aDogc3RyaW5nLCByZWN1cnNpdmU/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IGZvbGRlcjogVEZvbGRlciA9IHRoaXMucGx1Z2luLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXG4gICAgICAgICAgICBwYXRoXG4gICAgICAgICkgYXMgVEZvbGRlcjtcblxuICAgICAgICBpZiAoZm9sZGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudW50cmFja0ZpbGVzSW5Gb2xkZXIoZm9sZGVyLCByZWN1cnNpdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW50cmFja0ZpbGVzSW5Gb2xkZXIoZm9sZGVyOiBURm9sZGVyLCByZWN1cnNpdmU/OiBib29sZWFuKSB7XG4gICAgICAgIGlmIChyZWN1cnNpdmUgPT0gbnVsbCkgcmVjdXJzaXZlID0gdHJ1ZTtcblxuICAgICAgICBsZXQgdG90YWxSZW1vdmVkOiBudW1iZXIgPSAwO1xuICAgICAgICBmb2xkZXIuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVjdXJzaXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW50cmFja0ZpbGVzSW5Gb2xkZXIoY2hpbGQsIHJlY3Vyc2l2ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNUcmFja2VkKGNoaWxkLnBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZW1vdmVkID0gdGhpcy51bnRyYWNrRmlsZShjaGlsZC5wYXRoLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUmVtb3ZlZCArPSByZW1vdmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJhY2tGaWxlc0luRm9sZGVyUGF0aChwYXRoOiBzdHJpbmcsIHJlY3Vyc2l2ZT86IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgZm9sZGVyOiBURm9sZGVyID0gdGhpcy5wbHVnaW4uYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChcbiAgICAgICAgICAgIHBhdGhcbiAgICAgICAgKSBhcyBURm9sZGVyO1xuXG4gICAgICAgIGlmIChmb2xkZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50cmFja0ZpbGVzSW5Gb2xkZXIoZm9sZGVyLCByZWN1cnNpdmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdHJhY2tGaWxlc0luRm9sZGVyKGZvbGRlcjogVEZvbGRlciwgcmVjdXJzaXZlPzogYm9vbGVhbikge1xuICAgICAgICBpZiAocmVjdXJzaXZlID09IG51bGwpIHJlY3Vyc2l2ZSA9IHRydWU7XG5cbiAgICAgICAgbGV0IHRvdGFsQWRkZWQ6IG51bWJlciA9IDA7XG4gICAgICAgIGxldCB0b3RhbFJlbW92ZWQ6IG51bWJlciA9IDA7XG4gICAgICAgIGZvbGRlci5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgVEZvbGRlcikge1xuICAgICAgICAgICAgICAgIGlmIChyZWN1cnNpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFja0ZpbGVzSW5Gb2xkZXIoY2hpbGQsIHJlY3Vyc2l2ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzVHJhY2tlZChjaGlsZC5wYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgeyBhZGRlZCwgcmVtb3ZlZCB9ID0gdGhpcy50cmFja0ZpbGUoY2hpbGQucGF0aCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbEFkZGVkICs9IGFkZGVkO1xuICAgICAgICAgICAgICAgICAgICB0b3RhbFJlbW92ZWQgKz0gcmVtb3ZlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgICBcIkFkZGVkIFwiICtcbiAgICAgICAgICAgICAgICB0b3RhbEFkZGVkICtcbiAgICAgICAgICAgICAgICBcIiBuZXcgaXRlbXMsIHJlbW92ZWQgXCIgK1xuICAgICAgICAgICAgICAgIHRvdGFsUmVtb3ZlZCArXG4gICAgICAgICAgICAgICAgXCIgaXRlbXMuXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0cmFja0ZpbGUoXG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgbm90aWNlPzogYm9vbGVhblxuICAgICk6IHsgYWRkZWQ6IG51bWJlcjsgcmVtb3ZlZDogbnVtYmVyIH0gfCBudWxsIHtcbiAgICAgICAgdGhpcy5kYXRhLnRyYWNrZWRGaWxlcy5wdXNoKHtcbiAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICBpdGVtczoge30sXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMudXBkYXRlSXRlbXMocGF0aCwgbm90aWNlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJUcmFja2VkOiBcIiArIHBhdGgpO1xuICAgICAgICB0aGlzLnBsdWdpbi51cGRhdGVTdGF0dXNCYXIoKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgdW50cmFja0ZpbGUocGF0aDogc3RyaW5nLCBub3RpY2U/OiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKG5vdGljZSA9PSBudWxsKSBub3RpY2UgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRGaWxlSW5kZXgocGF0aCk7XG5cbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0cmFja2VkRmlsZSA9IHRoaXMuZGF0YS50cmFja2VkRmlsZXNbaW5kZXhdO1xuICAgICAgICBjb25zdCBudW1JdGVtcyA9IE9iamVjdC5rZXlzKHRyYWNrZWRGaWxlLml0ZW1zKS5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRyYWNrZWRGaWxlLml0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBpbmQgPSB0cmFja2VkRmlsZS5pdGVtc1trZXldO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNRdWV1ZWQoaW5kKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5xdWV1ZS5yZW1vdmUoaW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW5SZXBlYXRRdWV1ZShpbmQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnJlcGVhdFF1ZXVlLnJlbW92ZShpbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kYXRhLml0ZW1zW2luZF0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vdGljZSkge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcIlVudHJhY2tlZCBcIiArIG51bUl0ZW1zICsgXCIgaXRlbXMhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYXRhLnRyYWNrZWRGaWxlc1tpbmRleF0gPSBudWxsO1xuICAgICAgICB0aGlzLnBsdWdpbi51cGRhdGVTdGF0dXNCYXIoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJVbnRyYWNrZWQ6IFwiICsgcGF0aCk7XG4gICAgfVxuXG4gICAgdXBkYXRlSXRlbXMoXG4gICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgbm90aWNlPzogYm9vbGVhblxuICAgICk6IHsgYWRkZWQ6IG51bWJlcjsgcmVtb3ZlZDogbnVtYmVyIH0gfCBudWxsIHtcbiAgICAgICAgaWYgKG5vdGljZSA9PSBudWxsKSBub3RpY2UgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGluZCA9IHRoaXMuZ2V0RmlsZUluZGV4KHBhdGgpO1xuICAgICAgICBpZiAoaW5kID09IC0xKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF0dGVtcHQgdG8gdXBkYXRlIHVudHJhY2tlZCBmaWxlOiBcIiArIHBhdGgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRyYWNrZWRGaWxlID0gdGhpcy5kYXRhLnRyYWNrZWRGaWxlc1tpbmRdO1xuXG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLnBsdWdpbi5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpIGFzIFRGaWxlO1xuICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ291bGQgbm90IGZpbmQgZmlsZTogXCIgKyBwYXRoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhZGRlZCA9IDA7XG4gICAgICAgIGxldCByZW1vdmVkID0gMDtcblxuICAgICAgICBsZXQgbmV3SXRlbXM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcbiAgICAgICAgaWYgKFwiZmlsZVwiIGluIHRyYWNrZWRGaWxlLml0ZW1zKSB7XG4gICAgICAgICAgICBuZXdJdGVtc1tcImZpbGVcIl0gPSB0cmFja2VkRmlsZS5pdGVtc1tcImZpbGVcIl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbmV3SXRlbTogUmVwZXRpdGlvbkl0ZW0gPSBPYmplY3QuYXNzaWduKHt9LCBORVdfSVRFTSk7XG4gICAgICAgICAgICBuZXdJdGVtLmRhdGEgPSBPYmplY3QuYXNzaWduKHRoaXMucGx1Z2luLmFsZ29yaXRobS5kZWZhdWx0RGF0YSgpKTtcbiAgICAgICAgICAgIG5ld0l0ZW0uZmlsZUluZGV4ID0gaW5kO1xuICAgICAgICAgICAgbmV3SXRlbXNbXCJmaWxlXCJdID0gdGhpcy5kYXRhLml0ZW1zLnB1c2gobmV3SXRlbSkgLSAxO1xuICAgICAgICAgICAgYWRkZWQgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0cmFja2VkRmlsZS5pdGVtcykge1xuICAgICAgICAgICAgaWYgKCEoa2V5IGluIG5ld0l0ZW1zKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1JbmQgPSB0cmFja2VkRmlsZS5pdGVtc1trZXldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUXVldWVkKGl0ZW1JbmQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5xdWV1ZS5yZW1vdmUoaXRlbUluZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5SZXBlYXRRdWV1ZShpdGVtSW5kKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEucmVwZWF0UXVldWUucmVtb3ZlKGl0ZW1JbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuaXRlbXNbaW5kXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVtb3ZlZCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRyYWNrZWRGaWxlLml0ZW1zID0gbmV3SXRlbXM7XG5cbiAgICAgICAgaWYgKG5vdGljZSkge1xuICAgICAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICAgICAgICBcIkFkZGVkIFwiICsgYWRkZWQgKyBcIiBuZXcgaXRlbXMsIHJlbW92ZWQgXCIgKyByZW1vdmVkICsgXCIgaXRlbXMuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgYWRkZWQsIHJlbW92ZWQgfTtcbiAgICB9XG5cbiAgICByZW5hbWVUcmFja2VkRmlsZShvbGQ6IHN0cmluZywgbmV3UGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRGaWxlSW5kZXgob2xkKTtcbiAgICAgICAgLy8gU2FuaXR5IGNoZWNrXG4gICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZW5hbWVkIGZpbGUgaXMgbm90IHRyYWNrZWQhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZURhdGEgPSB0aGlzLmRhdGEudHJhY2tlZEZpbGVzW2luZGV4XTtcbiAgICAgICAgZmlsZURhdGEucGF0aCA9IG5ld1BhdGg7XG4gICAgICAgIHRoaXMuZGF0YS50cmFja2VkRmlsZXNbaW5kZXhdID0gZmlsZURhdGE7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJVcGRhdGVkIHRyYWNraW5nOiBcIiArIG9sZCArIFwiIC0+IFwiICsgbmV3UGF0aCk7XG4gICAgfVxuXG4gICAgYnVpbGRRdWV1ZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJCdWlsZGluZyBxdWV1ZS4uLlwiKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3QgbWF4TmV3ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MubWF4TmV3UGVyRGF5O1xuICAgICAgICBjb25zdCBub3c6IERhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIGlmIChub3cuZ2V0RGF0ZSgpICE9IG5ldyBEYXRlKHRoaXMuZGF0YS5sYXN0UXVldWUpLmdldERhdGUoKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhLm5ld0FkZGVkID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvbGRBZGQgPSAwO1xuICAgICAgICBsZXQgbmV3QWRkID0gMDtcblxuICAgICAgICB0aGlzLmRhdGEuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaWQpID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5uZXh0UmV2aWV3ID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG5ldyBpdGVtLlxuICAgICAgICAgICAgICAgICAgICBpZiAobWF4TmV3ID09IC0xIHx8IGRhdGEubmV3QWRkZWQgPCBtYXhOZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubmV4dFJldmlldyA9IG5vdy5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm5ld0FkZGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnF1ZXVlLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QWRkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0ubmV4dFJldmlldyA8PSBub3cuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5SZXBlYXRRdWV1ZShpZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucmVwZWF0UXVldWUucmVtb3ZlKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNRdWV1ZWQoaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnF1ZXVlLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2xkQWRkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGF0YS5sYXN0UXVldWUgPSBub3cuZ2V0VGltZSgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgXCJBZGRlZCBcIiArXG4gICAgICAgICAgICAgICAgKG9sZEFkZCArIG5ld0FkZCkgK1xuICAgICAgICAgICAgICAgIFwiIGZpbGVzIHRvIHJldmlldyBxdWV1ZSwgd2l0aCBcIiArXG4gICAgICAgICAgICAgICAgbmV3QWRkICtcbiAgICAgICAgICAgICAgICBcIiBuZXchXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXNldERhdGEoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU1JTX0RBVEEpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7XG4gICAgRmlsZVZpZXcsXG4gICAgV29ya3NwYWNlTGVhZixcbiAgICBWaWV3U3RhdGVSZXN1bHQsXG4gICAgQnV0dG9uQ29tcG9uZW50LFxuICAgIE1hcmtkb3duUmVuZGVyZXIsXG4gICAgVEZpbGUsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IE9ic2lkaWFuU3JzUGx1Z2luIGZyb20gXCIuL21haW5cIjtcblxuZXhwb3J0IHR5cGUgUmV2aWV3TW9kZSA9IFwicXVlc3Rpb25cIiB8IFwiYW5zd2VyXCIgfCBcImVtcHR5XCI7XG5cbmV4cG9ydCBjbGFzcyBSZXZpZXdWaWV3IGV4dGVuZHMgRmlsZVZpZXcge1xuICAgIHBsdWdpbjogT2JzaWRpYW5TcnNQbHVnaW47XG5cbiAgICB3cmFwcGVyRWw6IEhUTUxFbGVtZW50O1xuXG4gICAgcXVlc3Rpb25TdWJWaWV3OiBSZXZpZXdRdWVzdGlvblZpZXc7XG4gICAgYW5zd2VyU3ViVmlldzogUmV2aWV3QW5zd2VyVmlldztcbiAgICBlbXB0eVN1YlZpZXc6IFJldmlld0VtcHR5VmlldztcblxuICAgIGN1cnJlbnRTdWJWaWV3OiBSZXZpZXdTdWJWaWV3O1xuICAgIG1vZGU6IFJldmlld01vZGU7XG4gICAgaXRlbTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcGx1Z2luOiBPYnNpZGlhblNyc1BsdWdpbikge1xuICAgICAgICBzdXBlcihsZWFmKTtcblxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcblxuICAgICAgICBsZXQgY29udGVudEVsID0gdGhpcy5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgXCIudmlldy1jb250ZW50XCJcbiAgICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgdGhpcy53cmFwcGVyRWwgPSBjb250ZW50RWwuY3JlYXRlRGl2KFwic3JzLXJldmlldy13cmFwcGVyXCIpO1xuXG4gICAgICAgIHRoaXMucXVlc3Rpb25TdWJWaWV3ID0gbmV3IFJldmlld1F1ZXN0aW9uVmlldyh0aGlzKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJTdWJWaWV3ID0gbmV3IFJldmlld0Fuc3dlclZpZXcodGhpcyk7XG4gICAgICAgIHRoaXMuZW1wdHlTdWJWaWV3ID0gbmV3IFJldmlld0VtcHR5Vmlldyh0aGlzKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRTdWJWaWV3ID0gdGhpcy5lbXB0eVN1YlZpZXc7XG4gICAgfVxuXG4gICAgYXN5bmMgc2V0U3RhdGUoc3RhdGU6IGFueSwgcmVzdWx0OiBWaWV3U3RhdGVSZXN1bHQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5tb2RlID0gc3RhdGUubW9kZSBhcyBSZXZpZXdNb2RlO1xuICAgICAgICB0aGlzLml0ZW0gPSBzdGF0ZS5pdGVtO1xuICAgICAgICBhd2FpdCBzdXBlci5zZXRTdGF0ZShzdGF0ZSwgcmVzdWx0KTtcblxuICAgICAgICBpZiAoIXRoaXMuZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlID0gXCJlbXB0eVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PSBudWxsIHx8IHRoaXMubW9kZSA9PSBcImVtcHR5XCIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN1YlZpZXcuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ViVmlldyA9IHRoaXMuZW1wdHlTdWJWaWV3O1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ViVmlldy5zaG93KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRTdWJWaWV3LmhpZGUoKTtcblxuICAgICAgICBpZiAodGhpcy5tb2RlID09IFwicXVlc3Rpb25cIikge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ViVmlldyA9IHRoaXMucXVlc3Rpb25TdWJWaWV3O1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ViVmlldy5zaG93KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlID09IFwiYW5zd2VyXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN1YlZpZXcgPSB0aGlzLmFuc3dlclN1YlZpZXc7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdWJWaWV3LnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBpdGVtIFwiICsgdGhpcy5pdGVtICsgXCIuLi5cIik7XG5cbiAgICAgICAgdGhpcy5hcHAudmF1bHQuY2FjaGVkUmVhZCh0aGlzLmZpbGUpLnRoZW4oXG4gICAgICAgICAgICAoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBxdWVzdGlvbjogc3RyaW5nID0gdGhpcy5maWxlLmJhc2VuYW1lO1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXI6IHN0cmluZyA9IGNvbnRlbnQudHJpbSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUodGhpcy5maWxlKTtcblxuICAgICAgICAgICAgICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWV0YWRhdGEuaGVhZGluZ3MgJiYgbWV0YWRhdGEuaGVhZGluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24gPSBtZXRhZGF0YS5oZWFkaW5nc1swXS5oZWFkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyID0gY29udGVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzdHIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmhlYWRpbmdzWzBdLnBvc2l0aW9uLmVuZC5vZmZzZXQgKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ViVmlldy5zZXQocXVlc3Rpb24sIGFuc3dlciwgdGhpcy5maWxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gcmVhZCBpdGVtOiBcIiArIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0U3RhdGUoKTogYW55IHtcbiAgICAgICAgbGV0IHN0YXRlID0gc3VwZXIuZ2V0U3RhdGUoKTtcbiAgICAgICAgc3RhdGUubW9kZSA9IHRoaXMubW9kZTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcInNycy1yZXZpZXctdmlld1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXZpZXdTdWJWaWV3IHtcbiAgICBzZXQocXVlc3Rpb246IHN0cmluZywgYW5zd2VyOiBzdHJpbmcsIGZpbGU6IFRGaWxlKTogdm9pZDtcblxuICAgIHNob3coKTogdm9pZDtcbiAgICBoaWRlKCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBSZXZpZXdFbXB0eVZpZXcgaW1wbGVtZW50cyBSZXZpZXdTdWJWaWV3IHtcbiAgICBjb250YWluZXJFbDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcih2aWV3OiBSZXZpZXdWaWV3KSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwgPSB2aWV3LndyYXBwZXJFbC5jcmVhdGVEaXYoXCJzcnMtcmV2aWV3LWVtcHR5XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmhpZGRlbiA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5pbm5lclRleHQgPSBcIllvdXIgcXVldWUgaXMgZW1wdHkhXCI7XG4gICAgfVxuXG4gICAgc2V0KHF1ZXN0aW9uOiBzdHJpbmcsIGFuc3dlcjogc3RyaW5nLCBmaWxlOiBURmlsZSkge31cblxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuaGlkZGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5oaWRkZW4gPSB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJldmlld1F1ZXN0aW9uVmlldyBpbXBsZW1lbnRzIFJldmlld1N1YlZpZXcge1xuICAgIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudDtcblxuICAgIHF1ZXN0aW9uRWw6IEhUTUxFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IodmlldzogUmV2aWV3Vmlldykge1xuICAgICAgICBsZXQgYW5zd2VyQ2xpY2sgPSAodmlldzogUmV2aWV3VmlldykgPT4ge1xuICAgICAgICAgICAgdmlldy5sZWFmLnNldFZpZXdTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzcnMtcmV2aWV3LXZpZXdcIixcbiAgICAgICAgICAgICAgICBzdGF0ZToge1xuICAgICAgICAgICAgICAgICAgICBmaWxlOiB2aWV3LmZpbGUucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogXCJhbnN3ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogdmlldy5pdGVtLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsID0gdmlldy53cmFwcGVyRWwuY3JlYXRlRGl2KFwic3JzLXJldmlldy1xdWVzdGlvblwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5oaWRkZW4gPSB0cnVlO1xuXG4gICAgICAgIHRoaXMucXVlc3Rpb25FbCA9IHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRGl2KFwic3JzLXF1ZXN0aW9uLWNvbnRlbnRcIik7XG5cbiAgICAgICAgbGV0IGJ1dHRvbkRpdiA9IHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRGl2KFwic3JzLWJ1dHRvbi1kaXZcIik7XG5cbiAgICAgICAgbGV0IGJ1dHRvblJvdyA9IGJ1dHRvbkRpdi5jcmVhdGVEaXYoXCJzcnMtZmxleC1yb3dcIik7XG4gICAgICAgIGxldCBvcGVuRmlsZVJvdyA9IGJ1dHRvbkRpdi5jcmVhdGVEaXYoXCJzcnMtZmxleC1yb3dcIik7XG5cbiAgICAgICAgbmV3IEJ1dHRvbkNvbXBvbmVudChidXR0b25Sb3cpXG4gICAgICAgICAgICAuc2V0QnV0dG9uVGV4dChcIlNob3cgQW5zd2VyXCIpXG4gICAgICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IGFuc3dlckNsaWNrKHZpZXcpKTtcblxuICAgICAgICBuZXcgQnV0dG9uQ29tcG9uZW50KG9wZW5GaWxlUm93KVxuICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoXCJPcGVuIEZpbGVcIilcbiAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsZWFmID0gdmlldy5hcHAud29ya3NwYWNlLmdldFVucGlubmVkTGVhZigpO1xuICAgICAgICAgICAgICAgIGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtYXJrZG93blwiLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogdmlldy5maWxlLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmlldy5hcHAud29ya3NwYWNlLnNldEFjdGl2ZUxlYWYobGVhZik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnNldENsYXNzKFwic3JzLXJldmlldy1idXR0b25cIik7XG4gICAgfVxuXG4gICAgc2V0KHF1ZXN0aW9uOiBzdHJpbmcsIGFuc3dlcjogc3RyaW5nLCBmaWxlOiBURmlsZSkge1xuICAgICAgICB0aGlzLnF1ZXN0aW9uRWwuZW1wdHkoKTtcblxuICAgICAgICBNYXJrZG93blJlbmRlcmVyLnJlbmRlck1hcmtkb3duKFxuICAgICAgICAgICAgXCIjIFwiICsgcXVlc3Rpb24sXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uRWwsXG4gICAgICAgICAgICBmaWxlLnBhdGgsXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5oaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmhpZGRlbiA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmV2aWV3QW5zd2VyVmlldyBpbXBsZW1lbnRzIFJldmlld1N1YlZpZXcge1xuICAgIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudDtcblxuICAgIHF1ZXN0aW9uRWw6IEhUTUxFbGVtZW50O1xuICAgIGFuc3dlckVsOiBIVE1MRWxlbWVudDtcbiAgICBidXR0b25zOiBCdXR0b25Db21wb25lbnRbXTtcblxuICAgIGNvbnN0cnVjdG9yKHZpZXc6IFJldmlld1ZpZXcpIHtcbiAgICAgICAgbGV0IGJ1dHRvbkNsaWNrID0gKHZpZXc6IFJldmlld1ZpZXcsIHM6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdmlldy5wbHVnaW4uc3RvcmUucmV2aWV3SWQodmlldy5pdGVtLCBzKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB2aWV3LnBsdWdpbi5zdG9yZS5nZXROZXh0KCk7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZTogYW55ID0geyBtb2RlOiBcImVtcHR5XCIgfTtcbiAgICAgICAgICAgIGlmIChpdGVtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gdmlldy5wbHVnaW4uc3RvcmUuZ2V0RmlsZVBhdGgoaXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5maWxlID0gcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaXRlbSA9IHZpZXcucGx1Z2luLnN0b3JlLmdldE5leHRJZCgpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5tb2RlID0gXCJxdWVzdGlvblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpZXcubGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3JzLXJldmlldy12aWV3XCIsXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwgPSB2aWV3LndyYXBwZXJFbC5jcmVhdGVEaXYoXCJzcnMtcmV2aWV3LWFuc3dlclwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5oaWRkZW4gPSB0cnVlO1xuXG4gICAgICAgIGxldCB3cmFwcGVyRWwgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZURpdignc3JzLXFhLXdyYXBwZXInKTtcblxuICAgICAgICB0aGlzLnF1ZXN0aW9uRWwgPSB3cmFwcGVyRWwuY3JlYXRlRGl2KFwic3JzLXF1ZXN0aW9uLWNvbnRlbnRcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyRWwgPSB3cmFwcGVyRWwuY3JlYXRlRGl2KFwic3JzLWFuc3dlci1jb250ZW50XCIpO1xuXG4gICAgICAgIGxldCBidXR0b25EaXYgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZURpdihcInNycy1idXR0b24tZGl2XCIpO1xuXG4gICAgICAgIGxldCBidXR0b25Sb3cgPSBidXR0b25EaXYuY3JlYXRlRGl2KFwic3JzLWZsZXgtcm93XCIpO1xuICAgICAgICBsZXQgb3BlbkZpbGVSb3cgPSBidXR0b25EaXYuY3JlYXRlRGl2KFwic3JzLWZsZXgtcm93XCIpO1xuXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IFtdO1xuICAgICAgICB2aWV3LnBsdWdpbi5hbGdvcml0aG0uc3JzT3B0aW9ucygpLmZvckVhY2goKHM6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5idXR0b25zLnB1c2goXG4gICAgICAgICAgICAgICAgbmV3IEJ1dHRvbkNvbXBvbmVudChidXR0b25Sb3cpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KHMpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiBidXR0b25DbGljayh2aWV3LCBzKSlcbiAgICAgICAgICAgICAgICAgICAgLy8gLnNldFRvb2x0aXAoXCJIb3RrZXk6IFwiICsgKHRoaXMuYnV0dG9ucy5sZW5ndGggKyAxKSlcbiAgICAgICAgICAgICAgICAgICAgLnNldENsYXNzKFwic3JzLXJldmlldy1idXR0b25cIilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBCdXR0b25Db21wb25lbnQob3BlbkZpbGVSb3cpXG4gICAgICAgICAgICAuc2V0QnV0dG9uVGV4dChcIk9wZW4gRmlsZVwiKVxuICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlYWYgPSB2aWV3LmFwcC53b3Jrc3BhY2UuZ2V0VW5waW5uZWRMZWFmKCk7XG4gICAgICAgICAgICAgICAgbGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1hcmtkb3duXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiB2aWV3LmZpbGUucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2aWV3LmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc2V0Q2xhc3MoXCJzcnMtcmV2aWV3LWJ1dHRvblwiKTtcbiAgICB9XG5cbiAgICBzZXQocXVlc3Rpb246IHN0cmluZywgYW5zd2VyOiBzdHJpbmcsIGZpbGU6IFRGaWxlKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb25FbC5lbXB0eSgpO1xuICAgICAgICB0aGlzLmFuc3dlckVsLmVtcHR5KCk7XG5cbiAgICAgICAgTWFya2Rvd25SZW5kZXJlci5yZW5kZXJNYXJrZG93bihcbiAgICAgICAgICAgIFwiIyBcIiArIHF1ZXN0aW9uLFxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkVsLFxuICAgICAgICAgICAgZmlsZS5wYXRoLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICApO1xuICAgICAgICBNYXJrZG93blJlbmRlcmVyLnJlbmRlck1hcmtkb3duKGFuc3dlciwgdGhpcy5hbnN3ZXJFbCwgZmlsZS5wYXRoLCBudWxsKTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmhpZGRlbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuaGlkZGVuID0gdHJ1ZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgT2JzaWRpYW5TcnNQbHVnaW4gZnJvbSBcIi4vbWFpblwiO1xuaW1wb3J0IHsgSXRlbUluZm9Nb2RhbCB9IGZyb20gXCIuL21vZGFscy9pbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRzIHtcbiAgICBwbHVnaW46IE9ic2lkaWFuU3JzUGx1Z2luO1xuXG4gICAgY29uc3RydWN0b3IocGx1Z2luOiBPYnNpZGlhblNyc1BsdWdpbikge1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBhZGRDb21tYW5kcygpIHtcbiAgICAgICAgY29uc3QgcGx1Z2luID0gdGhpcy5wbHVnaW47XG5cbiAgICAgICAgLy8gcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAvLyAgICAgaWQ6IFwidmlldy1pdGVtLWluZm9cIixcbiAgICAgICAgLy8gICAgIG5hbWU6IFwiSXRlbSBJbmZvXCIsXG4gICAgICAgIC8vICAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgLy8gICAgICAgICBsZXQgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgICAgLy8gICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAvLyAgICAgICAgICAgICBpZiAocGx1Z2luLnN0b3JlLmlzVHJhY2tlZChmaWxlLnBhdGgpKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpZiAoIWNoZWNraW5nKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgbmV3IEl0ZW1JbmZvTW9kYWwocGx1Z2luLCBmaWxlKS5vcGVuKCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIC8vICAgICB9LFxuICAgICAgICAvLyB9KTtcblxuICAgICAgICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJ0cmFjay1maWxlXCIsXG4gICAgICAgICAgICBuYW1lOiBcIlRyYWNrIE5vdGVcIixcbiAgICAgICAgICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwbHVnaW4uc3RvcmUuaXNUcmFja2VkKGZpbGUucGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc3RvcmUudHJhY2tGaWxlKGZpbGUucGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnVwZGF0ZVN0YXR1c0JhcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwidW50cmFjay1maWxlXCIsXG4gICAgICAgICAgICBuYW1lOiBcIlVudHJhY2sgTm90ZVwiLFxuICAgICAgICAgICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGx1Z2luLnN0b3JlLmlzVHJhY2tlZChmaWxlLnBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNraW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnN0b3JlLnVudHJhY2tGaWxlKGZpbGUucGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnVwZGF0ZVN0YXR1c0JhcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwidXBkYXRlLWZpbGVcIixcbiAgICAgICAgICAgIG5hbWU6IFwiVXBkYXRlIE5vdGVcIixcbiAgICAgICAgICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5zdG9yZS5pc1RyYWNrZWQoZmlsZS5wYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zdG9yZS51cGRhdGVJdGVtcyhmaWxlLnBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi51cGRhdGVTdGF0dXNCYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImJ1aWxkLXF1ZXVlXCIsXG4gICAgICAgICAgICBuYW1lOiBcIkJ1aWxkIFF1ZXVlXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5zdG9yZS5idWlsZFF1ZXVlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJyZXZpZXctdmlld1wiLFxuICAgICAgICAgICAgbmFtZTogXCJSZXZpZXdcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcGx1Z2luLnN0b3JlLmJ1aWxkUXVldWUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gcGx1Z2luLnN0b3JlLmdldE5leHQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZTogYW55ID0geyBtb2RlOiBcImVtcHR5XCIgfTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBwbHVnaW4uc3RvcmUuZ2V0RmlsZVBhdGgoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXRoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmZpbGUgPSBwYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaXRlbSA9IHBsdWdpbi5zdG9yZS5nZXROZXh0SWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLm1vZGUgPSBcInF1ZXN0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbGVhZiA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldFVucGlubmVkTGVhZigpO1xuICAgICAgICAgICAgICAgIGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdG9yZS1yZXZpZXctdmlld1wiLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGVhZi5zZXRQaW5uZWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgcGx1Z2luLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZERlYnVnQ29tbWFuZHMoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW5qZWN0aW5nIGRlYnVnIGNvbW1hbmRzLi4uXCIpO1xuICAgICAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbjtcblxuICAgICAgICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJkZWJ1Zy1wcmludC12aWV3LXN0YXRlXCIsXG4gICAgICAgICAgICBuYW1lOiBcIlByaW50IFZpZXcgU3RhdGVcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGx1Z2luLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi5nZXRWaWV3U3RhdGUoKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJkZWJ1Zy1wcmludC1lcGgtc3RhdGVcIixcbiAgICAgICAgICAgIG5hbWU6IFwiUHJpbnQgRXBoZW1lcmFsIFN0YXRlXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBwbHVnaW4uYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLmdldEVwaGVtZXJhbFN0YXRlKClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiZGVidWctcHJpbnQtcXVldWVcIixcbiAgICAgICAgICAgIG5hbWU6IFwiUHJpbnQgUXVldWVcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGx1Z2luLnN0b3JlLmRhdGEucXVldWUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBcIlRoZXJlIGFyZSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc3RvcmUuZGF0YS5xdWV1ZS5sZW5ndGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCIgaXRlbXMgaW4gcXVldWUuXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc3RvcmUuZGF0YS5uZXdBZGRlZCArIFwiIG5ldyB3aGVyZSBhZGRlZCB0byB0b2RheS5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJkZWJ1Zy1jbGVhci1xdWV1ZVwiLFxuICAgICAgICAgICAgbmFtZTogXCJDbGVhciBRdWV1ZVwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBwbHVnaW4uc3RvcmUuZGF0YS5xdWV1ZSA9IFtdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiZGVidWctcXVldWUtYWxsXCIsXG4gICAgICAgICAgICBuYW1lOiBcIlF1ZXVlIEFsbFwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBwbHVnaW4uc3RvcmUuZGF0YS5xdWV1ZSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGx1Z2luLnN0b3JlLmRhdGEuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5zdG9yZS5kYXRhLml0ZW1zW2ldICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zdG9yZS5kYXRhLnF1ZXVlLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJRdWV1ZSBTaXplOiBcIiArIHBsdWdpbi5zdG9yZS5xdWV1ZVNpemUoKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJkZWJ1Zy1wcmludC1kYXRhXCIsXG4gICAgICAgICAgICBuYW1lOiBcIlByaW50IERhdGFcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGx1Z2luLnN0b3JlLmRhdGEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwiZGVidWctcmVzZXQtZGF0YVwiLFxuICAgICAgICAgICAgbmFtZTogXCJSZXNldCBEYXRhXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzZXR0aW5nIGRhdGEuLi5cIik7XG4gICAgICAgICAgICAgICAgcGx1Z2luLnN0b3JlLnJlc2V0RGF0YSgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsdWdpbi5zdG9yZS5kYXRhKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRGb2xkZXIsIFRGaWxlLCBQbHVnaW4gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IERhdGFTdG9yZSB9IGZyb20gXCIuL2RhdGFcIjtcbmltcG9ydCB7IFJldmlld1ZpZXcgfSBmcm9tIFwiLi92aWV3XCI7XG5pbXBvcnQgU3JzQWxnb3JpdGhtIGZyb20gXCIuL2FsZ29yaXRobXNcIjtcbmltcG9ydCBTcnNTZXR0aW5nVGFiIGZyb20gXCIuL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBTcnNQbHVnaW5TZXR0aW5ncywgREVGQVVMVF9TRVRUSU5HUywgYWxnb3JpdGhtcyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XG5pbXBvcnQgQ29tbWFuZHMgZnJvbSBcIi4vY29tbWFuZHNcIjtcblxuY29uc3QgREVCVUc6IGJvb2xlYW4gPSBmYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JzaWRpYW5TcnNQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAgIHNldHRpbmdzOiBTcnNQbHVnaW5TZXR0aW5ncztcbiAgICBzdG9yZTogRGF0YVN0b3JlO1xuICAgIGFsZ29yaXRobTogU3JzQWxnb3JpdGhtO1xuXG4gICAgY29tbWFuZHM6IENvbW1hbmRzO1xuXG4gICAgYmFySXRlbTogSFRNTEVsZW1lbnQ7XG5cbiAgICBhc3luYyBvbmxvYWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGluZyBPYnNpZGlhbiBSZWNhbGwuLi5cIik7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcblxuICAgICAgICB0aGlzLmFsZ29yaXRobSA9IGFsZ29yaXRobXNbdGhpcy5zZXR0aW5ncy5hbGdvcml0aG1dO1xuICAgICAgICB0aGlzLmFsZ29yaXRobS51cGRhdGVTZXR0aW5ncyh0aGlzLnNldHRpbmdzLmFsZ29yaXRobVNldHRpbmdzKTtcblxuICAgICAgICB0aGlzLnN0b3JlID0gbmV3IERhdGFTdG9yZSh0aGlzKTtcbiAgICAgICAgYXdhaXQgdGhpcy5zdG9yZS5sb2FkKCk7XG4gICAgICAgIHRoaXMuc3RvcmUuYnVpbGRRdWV1ZSgpO1xuXG4gICAgICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHModGhpcyk7XG4gICAgICAgIHRoaXMuY29tbWFuZHMuYWRkQ29tbWFuZHMoKTtcbiAgICAgICAgaWYgKERFQlVHKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRzLmFkZERlYnVnQ29tbWFuZHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFySXRlbSA9IHRoaXMuYWRkU3RhdHVzQmFySXRlbSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXR1c0JhcigpO1xuXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU3JzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyVmlldyhcInN0b3JlLXJldmlldy12aWV3XCIsIChsZWFmKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJldmlld1ZpZXcobGVhZiwgdGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbChcbiAgICAgICAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnN0b3JlLnNhdmUoKSwgNSAqIDYwICogMTAwMClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJVbmxvYWRpbmcgT2JzaWRpYW4gUmVjYWxsLiBTYXZpbmcgdHJhY2tlZCBmaWxlcy4uLlwiKTtcbiAgICAgICAgdGhpcy5zdG9yZS5zYXZlKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbihERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgICB9XG5cbiAgICB1cGRhdGVTdGF0dXNCYXIoKSB7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoUmV2aWV3Vmlldyk7XG4gICAgICAgIHRoaXMuYmFySXRlbS5yZW1vdmVDbGFzc2VzKFtcInNycy1iYXItdHJhY2tlZFwiXSk7XG4gICAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9XG4gICAgICAgICAgICAgICAgXCJSZW1haW5pbmc6IFwiICtcbiAgICAgICAgICAgICAgICAodGhpcy5zdG9yZS5xdWV1ZVNpemUoKSArIHRoaXMuc3RvcmUucmVwZWF0UXVldWVTaXplKCkpO1xuXG4gICAgICAgICAgICB0aGlzLmJhckl0ZW0uc2V0VGV4dCh0ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gXCJRdWV1ZTogXCIgKyB0aGlzLnN0b3JlLnF1ZXVlU2l6ZSgpO1xuXG4gICAgICAgICAgICBpZiAoZmlsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYXJJdGVtLnNldFRleHQodGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0b3JlLmlzVHJhY2tlZChmaWxlLnBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5zdG9yZS5nZXRJdGVtc09mRmlsZShmaWxlLnBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW9zdFJlY2VudCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5uZXh0UmV2aWV3IDwgbW9zdFJlY2VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vc3RSZWNlbnQgPSBpdGVtLm5leHRSZXZpZXc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWZmID0gKG1vc3RSZWNlbnQgLSBub3cuZ2V0VGltZSgpKSAvICgxMDAwICogNjAgKiA2MCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaWZmIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSBcIk5leHQgUmV2aWV3OiBOb3chXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZiA+PSAyNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgLz0gMjQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFwiTmV4dCBSZXZpZXc6IFwiICsgZGlmZi50b0ZpeGVkKDEpICsgXCIgZGF5c1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gXCJOZXh0IFJldmlldzogXCIgKyBkaWZmLnRvRml4ZWQoMSkgKyBcIiBob3Vyc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXJJdGVtLnNldFRleHQodGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFySXRlbS5hZGRDbGFzcyhcInNycy1iYXItdHJhY2tlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhckl0ZW0uc2V0VGV4dCh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWdpc3RlckV2ZW50cygpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsIChmKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0dXNCYXIoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1tZW51XCIsIChtZW51LCBmaWxlLCBzb3VyY2UsIGxlYWYpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9sZGVyID0gZmlsZSBhcyBURm9sZGVyO1xuXG4gICAgICAgICAgICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRJY29uKFwicGx1cy13aXRoLWNpcmNsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0VGl0bGUoXCJUcmFjayBBbGwgTm90ZXNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm9uQ2xpY2soKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUudHJhY2tGaWxlc0luRm9sZGVyKGZvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldEljb24oXCJtaW51cy13aXRoLWNpcmNsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0VGl0bGUoXCJVbnRyYWNrIEFsbCBOb3Rlc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ub25DbGljaygoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS51bnRyYWNrRmlsZXNJbkZvbGRlcihmb2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0b3JlLmlzVHJhY2tlZChmaWxlLnBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldEljb24oXCJtaW51cy13aXRoLWNpcmNsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKFwiVW50cmFjayBOb3RlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ub25DbGljaygoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUudW50cmFja0ZpbGUoZmlsZS5wYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRJY29uKFwicGx1cy13aXRoLWNpcmNsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKFwiVHJhY2sgTm90ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm9uQ2xpY2soKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnRyYWNrRmlsZShmaWxlLnBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgICAgICAgIHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsIChmaWxlLCBvbGQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlbmFtZVRyYWNrZWRGaWxlKG9sZCwgZmlsZS5wYXRoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgICAgICAgdGhpcy5hcHAudmF1bHQub24oXCJkZWxldGVcIiwgKGZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnVudHJhY2tGaWxlKGZpbGUucGF0aCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJTZXR0aW5nIiwiTm90aWNlIiwiVGV4dENvbXBvbmVudCIsIkJ1dHRvbkNvbXBvbmVudCIsIk1vZGFsIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlRGb2xkZXIiLCJURmlsZSIsIkZpbGVWaWV3IiwiTWFya2Rvd25SZW5kZXJlciIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEtBQUssSUFBSTtBQUM3QyxRQUFRLE1BQU0sSUFBSSxTQUFTLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLCtCQUErQixDQUFDLENBQUM7QUFDbEcsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxF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
