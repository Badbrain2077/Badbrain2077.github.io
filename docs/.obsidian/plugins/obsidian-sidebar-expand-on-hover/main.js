/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_SETTINGS = {
    leftSidebarWidth: 252,
    rightSidebarWidth: 252,
    leftPin: false,
    rightPin: false,
    leftSideEnabled: true,
    rightSideEnabled: true,
};
class SidebarExpandOnHoverPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        // Initializes the variables to store DOM HTML elements
        this.initialize = () => {
            this.leftRibbon = this.app.workspace.leftRibbon.containerEl;
            this.rightRibbon = this.app.workspace.rightRibbon.containerEl;
            this.leftSidebar = this.app.workspace
                .leftSplit.containerEl;
            this.rightSidebar = this.app.workspace
                .rightSplit.containerEl;
        };
        // Adds event listeners to the HTML elements
        this.setEvents = () => {
            this.registerDomEvent(document, 'mouseleave', () => {
                this.collapseSidebar(this.leftSidebar);
                this.collapseSidebar(this.rightSidebar);
            });
            this.registerDomEvent(this.app.workspace.rootSplit.containerEl, 'mouseenter', () => {
                this.collapseSidebar(this.leftSidebar);
                this.collapseSidebar(this.rightSidebar);
            });
            this.registerDomEvent(this.leftRibbon, 'mouseenter', () => {
                if (!this.settings.leftPin) {
                    this.expandSidebar(this.leftSidebar);
                }
            });
            this.registerDomEvent(this.rightRibbon, 'mouseenter', () => {
                if (!this.settings.rightPin) {
                    this.expandSidebar(this.rightSidebar);
                }
            });
            // To avoid 'glitch'
            this.registerDomEvent(this.app.workspace.leftSplit.resizeHandleEl, 'mouseenter', () => {
                if (!this.settings.leftPin) {
                    this.expandSidebar(this.leftSidebar);
                }
                this.settings.leftSidebarWidth = Number(this.app.workspace.leftSplit.size);
                this.saveSettings();
            });
            this.registerDomEvent(this.app.workspace.rightSplit.resizeHandleEl, 'mouseenter', () => {
                if (!this.settings.rightPin) {
                    this.expandSidebar(this.rightSidebar);
                }
                this.settings.rightSidebarWidth = Number(this.app.workspace.rightSplit.size);
                this.saveSettings();
            });
            // Double click on left ribbon to toggle pin/unpin of left sidebar
            this.registerDomEvent(this.leftRibbon, 'dblclick', () => {
                if (this.settings.leftSideEnabled) {
                    this.settings.leftPin = !this.settings.leftPin;
                    this.saveSettings();
                }
            });
            // Double click on right ribbon to toggle pin/unpin of right sidebar
            this.registerDomEvent(this.rightRibbon, 'dblclick', () => {
                if (this.settings.rightSideEnabled) {
                    this.settings.rightPin = !this.settings.rightPin;
                    this.saveSettings();
                }
            });
        };
        // Changes sidebar style width and display to expand it
        this.expandSidebar = (sidebar) => {
            if (sidebar == this.leftSidebar && this.settings.leftSideEnabled) {
                this.app.workspace.leftSplit.setSize(this.settings.leftSidebarWidth);
                this.app.workspace.leftSplit.expand();
            }
            if (sidebar == this.rightSidebar && this.settings.rightSideEnabled) {
                this.app.workspace.rightSplit.setSize(this.settings.rightSidebarWidth);
                this.app.workspace.rightSplit.expand();
            }
        };
        // Changes sidebar style width to collapse it
        this.collapseSidebar = (sidebar) => {
            if (sidebar == this.leftSidebar &&
                !this.settings.leftPin &&
                this.settings.leftSideEnabled) {
                this.app.workspace.leftSplit.collapse();
            }
            if (sidebar == this.rightSidebar &&
                !this.settings.rightPin &&
                this.settings.rightSideEnabled) {
                this.app.workspace.rightSplit.collapse();
            }
        };
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize and set events when layout is fully ready
            this.app.workspace.onLayoutReady(() => {
                this.loadSettings().then(() => {
                    this.initialize();
                    this.setEvents();
                    this.addSettingTab(new SidebarExpandOnHoverSettingTab(this.app, this));
                    // This timeout is needed to override Obsidian sidebar state at launch
                    setTimeout(() => {
                        if (this.settings.leftPin) {
                            this.expandSidebar(this.leftSidebar);
                        }
                        else {
                            this.collapseSidebar(this.leftSidebar);
                        }
                        if (this.settings.rightPin) {
                            this.expandSidebar(this.rightSidebar);
                        }
                        else {
                            this.collapseSidebar(this.rightSidebar);
                        }
                    }, 200);
                });
            });
            this.addCommand({
                id: 'Toggle-Left-Sidebar-Expand-On-Hover',
                name: 'Toggle Left Sidebar Behavior',
                callback: () => {
                    this.settings.leftSideEnabled = !this.settings.leftSideEnabled;
                    if (this.settings.leftSideEnabled == false)
                        this.settings.leftPin = false;
                    this.saveSettings();
                    if (this.settings.leftSideEnabled) {
                        new obsidian.Notice('Left Sidebar Expand on Hover Enabled');
                    }
                    else {
                        new obsidian.Notice('Left Sidebar Expand on Hover disabled');
                    }
                },
            });
            this.addCommand({
                id: 'Toggle-Right-Sidebar-Expand-On-Hover',
                name: 'Toggle Right Sidebar Behavior',
                callback: () => {
                    this.settings.rightSideEnabled = !this.settings.rightSideEnabled;
                    if (this.settings.rightSideEnabled == false)
                        this.settings.rightPin = false;
                    this.saveSettings();
                    if (this.settings.rightSideEnabled) {
                        new obsidian.Notice('Right Sidebar Expand on Hover Enabled');
                    }
                    else {
                        new obsidian.Notice('Right Sidebar Expand on Hover disabled');
                    }
                },
            });
        });
    }
    onunload() {
        this.saveSettings();
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
// Plugin settings
class SidebarExpandOnHoverSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        this.plugin.loadData();
        containerEl.createEl('h2', { text: 'Sidebar Expand On Hover' });
        containerEl.createEl('p', {
            text: `Note: You can also double click on each of the ribbons to 'pin' the corresponding 
      sidebar so that it remains expanded.
      You can undo this 'pinned state' behavior by double clicking on the ribbons again.
      This only works when you have that sidebar 'enabled' in this settings. Enjoy! :D`,
        });
        containerEl.createEl('h4', { text: 'Enable Individual Sidebar' });
        const leftSideEnabled = new obsidian.Setting(containerEl);
        leftSideEnabled.setName('Left Sidebar');
        leftSideEnabled.setDesc('Toggle to enable/disable left sidebar expand on hover');
        leftSideEnabled.addToggle((t) => {
            t.setValue(this.plugin.settings.leftSideEnabled);
            t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.leftSideEnabled = v;
                if (v == false)
                    this.plugin.settings.leftPin = false;
                this.plugin.saveSettings();
            }));
        });
        const rightSideEnabled = new obsidian.Setting(containerEl);
        rightSideEnabled.setName('Right Sidebar');
        rightSideEnabled.setDesc('Toggle to enable/disable right sidebar expand on hover');
        rightSideEnabled.addToggle((t) => {
            t.setValue(this.plugin.settings.rightSideEnabled);
            t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.rightSideEnabled = v;
                if (v == false)
                    this.plugin.settings.rightPin = false;
                this.plugin.saveSettings();
            }));
        });
        containerEl.createEl('h4', { text: 'Sidebar Expand Width' });
        const leftSidebarWidth = new obsidian.Setting(containerEl);
        leftSidebarWidth.setName('Left Sidebar');
        leftSidebarWidth.setDesc('Set the width of left sidebar in pixel unit');
        leftSidebarWidth.addText((t) => {
            t.setValue(String(this.plugin.settings.leftSidebarWidth));
            t.setPlaceholder('Default: 252').onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.leftSidebarWidth = Number(value);
                this.app.workspace.leftSplit.setSize(this.plugin.settings.leftSidebarWidth);
                this.plugin.saveSettings();
            }));
        });
        const rightSidebarWidth = new obsidian.Setting(containerEl);
        rightSidebarWidth.setName('Right Sidebar');
        rightSidebarWidth.setDesc('Set the width of right sidebar in pixel unit');
        rightSidebarWidth.addText((t) => {
            t.setValue(String(this.plugin.settings.rightSidebarWidth));
            t.setPlaceholder('Default: 252').onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.rightSidebarWidth = Number(value);
                this.app.workspace.rightSplit.setSize(this.plugin.settings.rightSidebarWidth);
                this.plugin.saveSettings();
            }));
        });
    }
}

module.exports = SidebarExpandOnHoverPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW4iLCJOb3RpY2UiLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7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
