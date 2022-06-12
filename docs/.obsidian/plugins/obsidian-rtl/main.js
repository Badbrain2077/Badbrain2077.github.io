'use strict';

var obsidian = require('obsidian');

class Settings {
    constructor() {
        this.fileDirections = {};
        this.defaultDirection = 'ltr';
        this.rememberPerFile = true;
        this.setNoteTitleDirection = true;
    }
    toJson() {
        return JSON.stringify(this);
    }
    fromJson(content) {
        var obj = JSON.parse(content);
        this.fileDirections = obj['fileDirections'];
        this.defaultDirection = obj['defaultDirection'];
        this.rememberPerFile = obj['rememberPerFile'];
        this.setNoteTitleDirection = obj['setNoteTitleDirection'];
    }
}
class RtlPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.settings = new Settings();
        this.SETTINGS_PATH = '.obsidian/rtl.json';
        // This stores the value in CodeMirror's autoCloseBrackets option before overriding it, so it can be restored when
        // we're back to LTR
        this.autoCloseBracketsValue = false;
    }
    onload() {
        console.log('loading RTL plugin');
        this.addCommand({
            id: 'switch-text-direction',
            name: 'Switch Text Direction (LTR<>RTL)',
            callback: () => { this.toggleDocumentDirection(); }
        });
        this.addSettingTab(new RtlSettingsTab(this.app, this));
        this.loadSettings();
        this.registerEvent(this.app.workspace.on('file-open', (file) => {
            if (file && file.path) {
                this.currentFile = file;
                this.adjustDirectionToCurrentFile();
            }
        }));
        this.registerEvent(this.app.vault.on('delete', (file) => {
            if (file && file.path && file.path in this.settings.fileDirections) {
                delete this.settings.fileDirections[file.path];
                this.saveSettings();
            }
        }));
        this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
            if (file && file.path && oldPath in this.settings.fileDirections) {
                this.settings.fileDirections[file.path] = this.settings.fileDirections[oldPath];
                delete this.settings.fileDirections[oldPath];
                this.saveSettings();
            }
        }));
        this.registerCodeMirror((cm) => {
            let cmEditor = cm;
            let currentExtraKeys = cmEditor.getOption('extraKeys');
            let moreKeys = {
                'End': (cm) => {
                    if (cm.getOption('direction') == 'rtl') {
                        let editor = this.getObsidianEditor();
                        let pos = editor.getCursor();
                        pos.ch = 1000;
                        editor.setCursor(pos);
                        editor.refresh();
                    }
                    else
                        cm.execCommand('goLineEnd');
                },
                'Home': (cm) => {
                    if (cm.getOption('direction') == 'rtl') {
                        let editor = this.getObsidianEditor();
                        let pos = editor.getCursor();
                        pos.ch = 0;
                        editor.setCursor(pos);
                        editor.refresh();
                    }
                    else
                        cm.execCommand('goLineStartSmart');
                }
            };
            cmEditor.setOption('extraKeys', Object.assign({}, currentExtraKeys, moreKeys));
        });
    }
    onunload() {
        console.log('unloading RTL plugin');
    }
    adjustDirectionToCurrentFile() {
        if (this.currentFile && this.currentFile.path) {
            if (this.settings.rememberPerFile && this.currentFile.path in this.settings.fileDirections) {
                // If the user wants to remember the direction per file, and we have a direction set for this file -- use it
                var requiredDirection = this.settings.fileDirections[this.currentFile.path];
            }
            else {
                // Use the default direction
                var requiredDirection = this.settings.defaultDirection;
            }
            this.setDocumentDirection(requiredDirection);
        }
    }
    saveSettings() {
        var settings = this.settings.toJson();
        this.app.vault.adapter.write(this.SETTINGS_PATH, settings);
    }
    loadSettings() {
        this.app.vault.adapter.read(this.SETTINGS_PATH).
            then((content) => this.settings.fromJson(content)).
            catch(error => { console.log("RTL settings file not found"); });
    }
    getObsidianEditor() {
        let view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (view)
            return view.editor;
        return null;
    }
    getCmEditor() {
        var _a;
        let view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (view)
            return (_a = view.sourceMode) === null || _a === void 0 ? void 0 : _a.cmEditor;
        return null;
    }
    setDocumentDirection(newDirection) {
        var cmEditor = this.getCmEditor();
        if (cmEditor && cmEditor.getOption("direction") != newDirection) {
            this.patchAutoCloseBrackets(cmEditor, newDirection);
            cmEditor.setOption("direction", newDirection);
            cmEditor.setOption("rtlMoveVisually", true);
        }
        let view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (view && view.previewMode && view.previewMode.containerEl)
            view.previewMode.containerEl.dir = newDirection;
        if (view) {
            // Fix the list indentation style
            let listStyle = document.createElement('style');
            document.head.appendChild(listStyle);
            listStyle.sheet.insertRule(".CodeMirror-rtl pre { text-indent: 0px !important; }");
            if (this.settings.setNoteTitleDirection) {
                var leafContainer = this.app.workspace.activeLeaf.containerEl;
                let header = leafContainer.getElementsByClassName('view-header-title-container');
                // let headerStyle = document.createElement('style');
                // header[0].appendChild(headerStyle);
                header[0].style.direction = newDirection;
            }
            this.setExportDirection(newDirection);
        }
    }
    setExportDirection(newDirection) {
        let styles = document.head.getElementsByTagName('style');
        for (let style of styles) {
            if (style.getText().includes('searched and replaced') && style.getText().includes('direction:')) {
                style.setText(`/* This is searched and replaced by the plugin */ @media print { body { direction: ${newDirection}; } }`);
            }
        }
    }
    patchAutoCloseBrackets(cmEditor, newDirection) {
        // Auto-close brackets doesn't work in RTL: https://github.com/esm7/obsidian-rtl/issues/7
        // Until the actual fix is released (as part of CodeMirror), we store the value of autoCloseBrackets when
        // switching to RTL, overriding it to 'false' and restoring it when back to LTR.
        if (newDirection == 'rtl') {
            this.autoCloseBracketsValue = cmEditor.getOption('autoCloseBrackets');
            cmEditor.setOption('autoCloseBrackets', false);
        }
        else {
            cmEditor.setOption('autoCloseBrackets', this.autoCloseBracketsValue);
        }
    }
    toggleDocumentDirection() {
        var cmEditor = this.getCmEditor();
        if (cmEditor) {
            var newDirection = cmEditor.getOption("direction") == "ltr" ? "rtl" : "ltr";
            this.setDocumentDirection(newDirection);
            if (this.settings.rememberPerFile && this.currentFile && this.currentFile.path) {
                this.settings.fileDirections[this.currentFile.path] = newDirection;
                this.saveSettings();
            }
        }
    }
}
class RtlSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.settings = plugin.settings;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'RTL Settings' });
        new obsidian.Setting(containerEl)
            .setName('Remember text direction per file')
            .setDesc('Store and remember the text direction used for each file individually.')
            .addToggle(toggle => toggle.setValue(this.settings.rememberPerFile)
            .onChange((value) => {
            this.settings.rememberPerFile = value;
            this.plugin.saveSettings();
            this.plugin.adjustDirectionToCurrentFile();
        }));
        new obsidian.Setting(containerEl)
            .setName('Default text direction')
            .setDesc('What should be the default text direction in Obsidian?')
            .addDropdown(dropdown => dropdown.addOption('ltr', 'LTR')
            .addOption('rtl', 'RTL')
            .setValue(this.settings.defaultDirection)
            .onChange((value) => {
            this.settings.defaultDirection = value;
            this.plugin.saveSettings();
            this.plugin.adjustDirectionToCurrentFile();
        }));
        new obsidian.Setting(containerEl)
            .setName('Set note title direction')
            .setDesc('In RTL notes, also set the direction of the note title.')
            .addToggle(toggle => toggle.setValue(this.settings.setNoteTitleDirection)
            .onChange((value) => {
            this.settings.setNoteTitleDirection = value;
            this.plugin.saveSettings();
            this.plugin.adjustDirectionToCurrentFile();
        }));
    }
}

module.exports = RtlPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIEVkaXRvciwgTWFya2Rvd25WaWV3LCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFRGaWxlLCBUQWJzdHJhY3RGaWxlLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgKiBhcyBjb2RlbWlycm9yIGZyb20gJ2NvZGVtaXJyb3InO1xyXG5cclxuY2xhc3MgU2V0dGluZ3Mge1xyXG5cdHB1YmxpYyBmaWxlRGlyZWN0aW9uczogeyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuXHRwdWJsaWMgZGVmYXVsdERpcmVjdGlvbjogc3RyaW5nID0gJ2x0cic7XHJcblx0cHVibGljIHJlbWVtYmVyUGVyRmlsZTogYm9vbGVhbiA9IHRydWU7XHJcblx0cHVibGljIHNldE5vdGVUaXRsZURpcmVjdGlvbjogYm9vbGVhbiA9IHRydWU7XHJcblxyXG5cdHRvSnNvbigpIHtcclxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcclxuXHR9XHJcblxyXG5cdGZyb21Kc29uKGNvbnRlbnQ6IHN0cmluZykge1xyXG5cdFx0dmFyIG9iaiA9IEpTT04ucGFyc2UoY29udGVudCk7XHJcblx0XHR0aGlzLmZpbGVEaXJlY3Rpb25zID0gb2JqWydmaWxlRGlyZWN0aW9ucyddO1xyXG5cdFx0dGhpcy5kZWZhdWx0RGlyZWN0aW9uID0gb2JqWydkZWZhdWx0RGlyZWN0aW9uJ107XHJcblx0XHR0aGlzLnJlbWVtYmVyUGVyRmlsZSA9IG9ialsncmVtZW1iZXJQZXJGaWxlJ107XHJcblx0XHR0aGlzLnNldE5vdGVUaXRsZURpcmVjdGlvbiA9IG9ialsnc2V0Tm90ZVRpdGxlRGlyZWN0aW9uJ107XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdGxQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG5cclxuXHRwdWJsaWMgc2V0dGluZ3MgPSBuZXcgU2V0dGluZ3MoKTtcclxuXHRwcml2YXRlIGN1cnJlbnRGaWxlOiBURmlsZTtcclxuXHRwdWJsaWMgU0VUVElOR1NfUEFUSCA9ICcub2JzaWRpYW4vcnRsLmpzb24nXHJcblx0Ly8gVGhpcyBzdG9yZXMgdGhlIHZhbHVlIGluIENvZGVNaXJyb3IncyBhdXRvQ2xvc2VCcmFja2V0cyBvcHRpb24gYmVmb3JlIG92ZXJyaWRpbmcgaXQsIHNvIGl0IGNhbiBiZSByZXN0b3JlZCB3aGVuXHJcblx0Ly8gd2UncmUgYmFjayB0byBMVFJcclxuXHRwcml2YXRlIGF1dG9DbG9zZUJyYWNrZXRzVmFsdWU6IGFueSA9IGZhbHNlO1xyXG5cclxuXHRvbmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnbG9hZGluZyBSVEwgcGx1Z2luJyk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6ICdzd2l0Y2gtdGV4dC1kaXJlY3Rpb24nLFxyXG5cdFx0XHRuYW1lOiAnU3dpdGNoIFRleHQgRGlyZWN0aW9uIChMVFI8PlJUTCknLFxyXG5cdFx0XHRjYWxsYmFjazogKCkgPT4geyB0aGlzLnRvZ2dsZURvY3VtZW50RGlyZWN0aW9uKCk7IH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgUnRsU2V0dGluZ3NUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcblx0XHR0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG5cclxuXHRcdHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2ZpbGUtb3BlbicsIChmaWxlOiBURmlsZSkgPT4ge1xyXG5cdFx0XHRpZiAoZmlsZSAmJiBmaWxlLnBhdGgpIHtcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRGaWxlID0gZmlsZTtcclxuXHRcdFx0XHR0aGlzLmFkanVzdERpcmVjdGlvblRvQ3VycmVudEZpbGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSkpO1xyXG5cclxuXHRcdHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbignZGVsZXRlJywgKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcclxuXHRcdFx0aWYgKGZpbGUgJiYgZmlsZS5wYXRoICYmIGZpbGUucGF0aCBpbiB0aGlzLnNldHRpbmdzLmZpbGVEaXJlY3Rpb25zKSB7XHJcblx0XHRcdFx0ZGVsZXRlIHRoaXMuc2V0dGluZ3MuZmlsZURpcmVjdGlvbnNbZmlsZS5wYXRoXTtcclxuXHRcdFx0XHR0aGlzLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHR9XHJcblx0XHR9KSk7XHJcblxyXG5cdFx0dGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKCdyZW5hbWUnLCAoZmlsZTogVEFic3RyYWN0RmlsZSwgb2xkUGF0aDogc3RyaW5nKSA9PiB7XHJcblx0XHRcdGlmIChmaWxlICYmIGZpbGUucGF0aCAmJiBvbGRQYXRoIGluIHRoaXMuc2V0dGluZ3MuZmlsZURpcmVjdGlvbnMpIHtcclxuXHRcdFx0XHR0aGlzLnNldHRpbmdzLmZpbGVEaXJlY3Rpb25zW2ZpbGUucGF0aF0gPSB0aGlzLnNldHRpbmdzLmZpbGVEaXJlY3Rpb25zW29sZFBhdGhdO1xyXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLnNldHRpbmdzLmZpbGVEaXJlY3Rpb25zW29sZFBhdGhdO1xyXG5cdFx0XHRcdHRoaXMuc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pKTtcclxuXHJcblx0XHR0aGlzLnJlZ2lzdGVyQ29kZU1pcnJvcigoY206IENvZGVNaXJyb3IuRWRpdG9yKSA9PiB7XHJcblx0XHRcdGxldCBjbUVkaXRvciA9IGNtO1xyXG5cdFx0XHRsZXQgY3VycmVudEV4dHJhS2V5cyA9IGNtRWRpdG9yLmdldE9wdGlvbignZXh0cmFLZXlzJyk7XHJcblx0XHRcdGxldCBtb3JlS2V5cyA9IHtcclxuXHRcdFx0XHQnRW5kJzogKGNtOiBDb2RlTWlycm9yLkVkaXRvcikgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKGNtLmdldE9wdGlvbignZGlyZWN0aW9uJykgPT0gJ3J0bCcpIHtcclxuXHRcdFx0XHRcdFx0bGV0IGVkaXRvciA9IHRoaXMuZ2V0T2JzaWRpYW5FZGl0b3IoKTtcclxuXHRcdFx0XHRcdFx0bGV0IHBvcyA9IGVkaXRvci5nZXRDdXJzb3IoKTtcclxuXHRcdFx0XHRcdFx0cG9zLmNoID0gMTAwMDtcclxuXHRcdFx0XHRcdFx0ZWRpdG9yLnNldEN1cnNvcihwb3MpO1xyXG5cdFx0XHRcdFx0XHRlZGl0b3IucmVmcmVzaCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRjbS5leGVjQ29tbWFuZCgnZ29MaW5lRW5kJyk7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnSG9tZSc6IChjbTogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcclxuXHRcdFx0XHRcdGlmIChjbS5nZXRPcHRpb24oJ2RpcmVjdGlvbicpID09ICdydGwnKSB7XHJcblx0XHRcdFx0XHRcdGxldCBlZGl0b3IgPSB0aGlzLmdldE9ic2lkaWFuRWRpdG9yKCk7XHJcblx0XHRcdFx0XHRcdGxldCBwb3MgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XHJcblx0XHRcdFx0XHRcdHBvcy5jaCA9IDA7XHJcblx0XHRcdFx0XHRcdGVkaXRvci5zZXRDdXJzb3IocG9zKTtcclxuXHRcdFx0XHRcdFx0ZWRpdG9yLnJlZnJlc2goKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0Y20uZXhlY0NvbW1hbmQoJ2dvTGluZVN0YXJ0U21hcnQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGNtRWRpdG9yLnNldE9wdGlvbignZXh0cmFLZXlzJywgT2JqZWN0LmFzc2lnbih7fSwgY3VycmVudEV4dHJhS2V5cywgbW9yZUtleXMpKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdG9udW5sb2FkKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ3VubG9hZGluZyBSVEwgcGx1Z2luJyk7XHJcblx0fVxyXG5cclxuXHRhZGp1c3REaXJlY3Rpb25Ub0N1cnJlbnRGaWxlKCkge1xyXG5cdFx0aWYgKHRoaXMuY3VycmVudEZpbGUgJiYgdGhpcy5jdXJyZW50RmlsZS5wYXRoKSB7XHJcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLnJlbWVtYmVyUGVyRmlsZSAmJiB0aGlzLmN1cnJlbnRGaWxlLnBhdGggaW4gdGhpcy5zZXR0aW5ncy5maWxlRGlyZWN0aW9ucykge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB1c2VyIHdhbnRzIHRvIHJlbWVtYmVyIHRoZSBkaXJlY3Rpb24gcGVyIGZpbGUsIGFuZCB3ZSBoYXZlIGEgZGlyZWN0aW9uIHNldCBmb3IgdGhpcyBmaWxlIC0tIHVzZSBpdFxyXG5cdFx0XHRcdHZhciByZXF1aXJlZERpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MuZmlsZURpcmVjdGlvbnNbdGhpcy5jdXJyZW50RmlsZS5wYXRoXTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBVc2UgdGhlIGRlZmF1bHQgZGlyZWN0aW9uXHJcblx0XHRcdFx0dmFyIHJlcXVpcmVkRGlyZWN0aW9uID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0RGlyZWN0aW9uO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuc2V0RG9jdW1lbnREaXJlY3Rpb24ocmVxdWlyZWREaXJlY3Rpb24pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2F2ZVNldHRpbmdzKCkge1xyXG5cdFx0dmFyIHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncy50b0pzb24oKTtcclxuXHRcdHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIud3JpdGUodGhpcy5TRVRUSU5HU19QQVRILCBzZXR0aW5ncyk7XHJcblx0fVxyXG5cclxuXHRsb2FkU2V0dGluZ3MoKSB7XHJcblx0XHR0aGlzLmFwcC52YXVsdC5hZGFwdGVyLnJlYWQodGhpcy5TRVRUSU5HU19QQVRIKS5cclxuXHRcdFx0dGhlbigoY29udGVudCkgPT4gdGhpcy5zZXR0aW5ncy5mcm9tSnNvbihjb250ZW50KSkuXHJcblx0XHRcdGNhdGNoKGVycm9yID0+IHsgY29uc29sZS5sb2coXCJSVEwgc2V0dGluZ3MgZmlsZSBub3QgZm91bmRcIik7IH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0T2JzaWRpYW5FZGl0b3IoKTogRWRpdG9yIHtcclxuXHRcdGxldCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuXHRcdGlmICh2aWV3KVxyXG5cdFx0XHRyZXR1cm4gdmlldy5lZGl0b3I7XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdGdldENtRWRpdG9yKCk6IGNvZGVtaXJyb3IuRWRpdG9yIHtcclxuXHRcdGxldCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuXHRcdGlmICh2aWV3KVxyXG5cdFx0XHRyZXR1cm4gdmlldy5zb3VyY2VNb2RlPy5jbUVkaXRvcjtcclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0c2V0RG9jdW1lbnREaXJlY3Rpb24obmV3RGlyZWN0aW9uOiBzdHJpbmcpIHtcclxuXHRcdHZhciBjbUVkaXRvciA9IHRoaXMuZ2V0Q21FZGl0b3IoKTtcclxuXHRcdGlmIChjbUVkaXRvciAmJiBjbUVkaXRvci5nZXRPcHRpb24oXCJkaXJlY3Rpb25cIikgIT0gbmV3RGlyZWN0aW9uKSB7XHJcblx0XHRcdHRoaXMucGF0Y2hBdXRvQ2xvc2VCcmFja2V0cyhjbUVkaXRvciwgbmV3RGlyZWN0aW9uKTtcclxuXHRcdFx0Y21FZGl0b3Iuc2V0T3B0aW9uKFwiZGlyZWN0aW9uXCIsIG5ld0RpcmVjdGlvbiBhcyBhbnkpO1xyXG5cdFx0XHRjbUVkaXRvci5zZXRPcHRpb24oXCJydGxNb3ZlVmlzdWFsbHlcIiwgdHJ1ZSk7XHJcblx0XHR9XHJcblx0XHRsZXQgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XHJcblx0XHRpZiAodmlldyAmJiB2aWV3LnByZXZpZXdNb2RlICYmIHZpZXcucHJldmlld01vZGUuY29udGFpbmVyRWwpXHJcblx0XHRcdHZpZXcucHJldmlld01vZGUuY29udGFpbmVyRWwuZGlyID0gbmV3RGlyZWN0aW9uO1xyXG5cclxuXHRcdGlmICh2aWV3KSB7XHJcblx0XHRcdC8vIEZpeCB0aGUgbGlzdCBpbmRlbnRhdGlvbiBzdHlsZVxyXG5cdFx0XHRsZXQgbGlzdFN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaXN0U3R5bGUpO1xyXG5cdFx0XHRsaXN0U3R5bGUuc2hlZXQuaW5zZXJ0UnVsZShcIi5Db2RlTWlycm9yLXJ0bCBwcmUgeyB0ZXh0LWluZGVudDogMHB4ICFpbXBvcnRhbnQ7IH1cIik7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5zZXR0aW5ncy5zZXROb3RlVGl0bGVEaXJlY3Rpb24pIHtcclxuXHRcdFx0XHR2YXIgbGVhZkNvbnRhaW5lciA9ICh0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZiBhcyBhbnkpLmNvbnRhaW5lckVsIGFzIERvY3VtZW50O1xyXG5cdFx0XHRcdGxldCBoZWFkZXIgPSBsZWFmQ29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3ZpZXctaGVhZGVyLXRpdGxlLWNvbnRhaW5lcicpO1xyXG5cdFx0XHRcdC8vIGxldCBoZWFkZXJTdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcblx0XHRcdFx0Ly8gaGVhZGVyWzBdLmFwcGVuZENoaWxkKGhlYWRlclN0eWxlKTtcclxuXHRcdFx0XHQoaGVhZGVyWzBdIGFzIGFueSkuc3R5bGUuZGlyZWN0aW9uID0gbmV3RGlyZWN0aW9uO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnNldEV4cG9ydERpcmVjdGlvbihuZXdEaXJlY3Rpb24pO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdHNldEV4cG9ydERpcmVjdGlvbihuZXdEaXJlY3Rpb246IHN0cmluZykge1xyXG5cdFx0bGV0IHN0eWxlcyA9IGRvY3VtZW50LmhlYWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3N0eWxlJyk7XHJcblx0XHRmb3IgKGxldCBzdHlsZSBvZiBzdHlsZXMpIHtcclxuXHRcdFx0aWYgKHN0eWxlLmdldFRleHQoKS5pbmNsdWRlcygnc2VhcmNoZWQgYW5kIHJlcGxhY2VkJykgJiYgc3R5bGUuZ2V0VGV4dCgpLmluY2x1ZGVzKCdkaXJlY3Rpb246JykpIHtcclxuXHRcdFx0XHRzdHlsZS5zZXRUZXh0KGAvKiBUaGlzIGlzIHNlYXJjaGVkIGFuZCByZXBsYWNlZCBieSB0aGUgcGx1Z2luICovIEBtZWRpYSBwcmludCB7IGJvZHkgeyBkaXJlY3Rpb246ICR7bmV3RGlyZWN0aW9ufTsgfSB9YClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cGF0Y2hBdXRvQ2xvc2VCcmFja2V0cyhjbUVkaXRvcjogYW55LCBuZXdEaXJlY3Rpb246IHN0cmluZykge1xyXG5cdFx0Ly8gQXV0by1jbG9zZSBicmFja2V0cyBkb2Vzbid0IHdvcmsgaW4gUlRMOiBodHRwczovL2dpdGh1Yi5jb20vZXNtNy9vYnNpZGlhbi1ydGwvaXNzdWVzLzdcclxuXHRcdC8vIFVudGlsIHRoZSBhY3R1YWwgZml4IGlzIHJlbGVhc2VkIChhcyBwYXJ0IG9mIENvZGVNaXJyb3IpLCB3ZSBzdG9yZSB0aGUgdmFsdWUgb2YgYXV0b0Nsb3NlQnJhY2tldHMgd2hlblxyXG5cdFx0Ly8gc3dpdGNoaW5nIHRvIFJUTCwgb3ZlcnJpZGluZyBpdCB0byAnZmFsc2UnIGFuZCByZXN0b3JpbmcgaXQgd2hlbiBiYWNrIHRvIExUUi5cclxuXHRcdGlmIChuZXdEaXJlY3Rpb24gPT0gJ3J0bCcpIHtcclxuXHRcdFx0dGhpcy5hdXRvQ2xvc2VCcmFja2V0c1ZhbHVlID0gY21FZGl0b3IuZ2V0T3B0aW9uKCdhdXRvQ2xvc2VCcmFja2V0cycpO1xyXG5cdFx0XHRjbUVkaXRvci5zZXRPcHRpb24oJ2F1dG9DbG9zZUJyYWNrZXRzJywgZmFsc2UpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y21FZGl0b3Iuc2V0T3B0aW9uKCdhdXRvQ2xvc2VCcmFja2V0cycsIHRoaXMuYXV0b0Nsb3NlQnJhY2tldHNWYWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0b2dnbGVEb2N1bWVudERpcmVjdGlvbigpIHtcclxuXHRcdHZhciBjbUVkaXRvciA9IHRoaXMuZ2V0Q21FZGl0b3IoKTtcclxuXHRcdGlmIChjbUVkaXRvcikge1xyXG5cdFx0XHR2YXIgbmV3RGlyZWN0aW9uID0gY21FZGl0b3IuZ2V0T3B0aW9uKFwiZGlyZWN0aW9uXCIpID09IFwibHRyXCIgPyBcInJ0bFwiIDogXCJsdHJcIlxyXG5cdFx0XHR0aGlzLnNldERvY3VtZW50RGlyZWN0aW9uKG5ld0RpcmVjdGlvbik7XHJcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLnJlbWVtYmVyUGVyRmlsZSAmJiB0aGlzLmN1cnJlbnRGaWxlICYmIHRoaXMuY3VycmVudEZpbGUucGF0aCkge1xyXG5cdFx0XHRcdHRoaXMuc2V0dGluZ3MuZmlsZURpcmVjdGlvbnNbdGhpcy5jdXJyZW50RmlsZS5wYXRoXSA9IG5ld0RpcmVjdGlvbjtcclxuXHRcdFx0XHR0aGlzLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBSdGxTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdHNldHRpbmdzOiBTZXR0aW5ncztcclxuXHRwbHVnaW46IFJ0bFBsdWdpbjtcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUnRsUGx1Z2luKSB7XHJcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XHJcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSBwbHVnaW4uc2V0dGluZ3M7XHJcblx0fVxyXG5cclxuXHRkaXNwbGF5KCk6IHZvaWQge1xyXG5cdFx0bGV0IHtjb250YWluZXJFbH0gPSB0aGlzO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywge3RleHQ6ICdSVEwgU2V0dGluZ3MnfSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdSZW1lbWJlciB0ZXh0IGRpcmVjdGlvbiBwZXIgZmlsZScpXHJcblx0XHRcdC5zZXREZXNjKCdTdG9yZSBhbmQgcmVtZW1iZXIgdGhlIHRleHQgZGlyZWN0aW9uIHVzZWQgZm9yIGVhY2ggZmlsZSBpbmRpdmlkdWFsbHkuJylcclxuXHRcdFx0LmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MucmVtZW1iZXJQZXJGaWxlKVxyXG5cdFx0XHRcdFx0ICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHQgICB0aGlzLnNldHRpbmdzLnJlbWVtYmVyUGVyRmlsZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHQgICB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdFx0ICAgdGhpcy5wbHVnaW4uYWRqdXN0RGlyZWN0aW9uVG9DdXJyZW50RmlsZSgpO1xyXG5cdFx0XHRcdFx0ICAgfSkpO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnRGVmYXVsdCB0ZXh0IGRpcmVjdGlvbicpXHJcblx0XHRcdC5zZXREZXNjKCdXaGF0IHNob3VsZCBiZSB0aGUgZGVmYXVsdCB0ZXh0IGRpcmVjdGlvbiBpbiBPYnNpZGlhbj8nKVxyXG5cdFx0XHQuYWRkRHJvcGRvd24oZHJvcGRvd24gPT4gZHJvcGRvd24uYWRkT3B0aW9uKCdsdHInLCAnTFRSJylcclxuXHRcdFx0XHRcdFx0IC5hZGRPcHRpb24oJ3J0bCcsICdSVEwnKVxyXG5cdFx0XHRcdFx0XHQgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuZGVmYXVsdERpcmVjdGlvbilcclxuXHRcdFx0XHRcdFx0IC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdFx0XHQgdGhpcy5zZXR0aW5ncy5kZWZhdWx0RGlyZWN0aW9uID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdFx0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdFx0XHRcdCB0aGlzLnBsdWdpbi5hZGp1c3REaXJlY3Rpb25Ub0N1cnJlbnRGaWxlKCk7XHJcblx0XHRcdFx0XHRcdCB9KSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdTZXQgbm90ZSB0aXRsZSBkaXJlY3Rpb24nKVxyXG5cdFx0XHQuc2V0RGVzYygnSW4gUlRMIG5vdGVzLCBhbHNvIHNldCB0aGUgZGlyZWN0aW9uIG9mIHRoZSBub3RlIHRpdGxlLicpXHJcblx0XHRcdC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLnNldE5vdGVUaXRsZURpcmVjdGlvbilcclxuXHRcdFx0XHRcdFx0IC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdFx0XHQgdGhpcy5zZXR0aW5ncy5zZXROb3RlVGl0bGVEaXJlY3Rpb24gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0XHQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHRcdFx0IHRoaXMucGx1Z2luLmFkanVzdERpcmVjdGlvblRvQ3VycmVudEZpbGUoKTtcclxuXHRcdFx0XHRcdFx0IH0pKTtcclxuXHJcblx0fVxyXG59XHJcbiJdLCJuYW1lcyI6WyJQbHVnaW4iLCJNYXJrZG93blZpZXciLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7OztBQUdBLE1B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
