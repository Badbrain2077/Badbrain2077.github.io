/*
THIS IS A GENERATED FILE BUNDLED BY ROLLUP.
If you want to view the source, visit the package's GitHub repository.
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

function pick(obj, keys) {
    const out = {};
    keys.forEach((k) => (out[k] = obj[k]));
    return out;
}
function fromPairs(pairs) {
    const out = {};
    for (let i = 0; i < (pairs === null || pairs === void 0 ? void 0 : pairs.length); i++) {
        out[pairs[i][0]] = pairs[i][1];
    }
    return out;
}
function zipObject(props, values) {
    const out = {};
    for (let i = 0; i < props.length; i++) {
        out[props[i]] = values[i];
    }
    return out;
}

const TFolderProps = ["path", "name"];
const TFileProps = TFolderProps.concat("stat", "basename", "extension");
function TFileToObsimianFile(f) {
    return Object.assign(Object.assign({}, pick(f, TFileProps)), { parent: TFolderToObsimianFolder(f.parent) });
}
function TFolderToObsimianFolder(f) {
    if (!f) {
        return null;
    }
    return Object.assign(Object.assign({}, pick(f, TFolderProps)), { parent: TFolderToObsimianFolder(f.parent) });
}

/**
 * Dumps the output of Obsidian's APIs into {@code outFile} for testing.
 */
function exportData(plugin, outFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield gatherMarkdownData(plugin.app);
        yield writeData(plugin, data, outFile);
        return data;
    });
}
function gatherMarkdownData(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = app.vault.getMarkdownFiles();
        const paths = files.map((f) => f.path);
        const markdownContents = yield Promise.all(files.map((md) => app.vault.read(md)));
        const metadatas = files.map((md) => app.metadataCache.getFileCache(md));
        const getDest = (link, path) => TFileToObsimianFile(app.metadataCache.getFirstLinkpathDest(link, path));
        const fileLinkpathDests = files.map((md, i) => { var _a; return fromPairs((_a = metadatas[i].links) === null || _a === void 0 ? void 0 : _a.map((l) => [l.link, getDest(l.link, md.path)])); });
        return {
            "vault.getMarkdownFiles()": files.map(TFileToObsimianFile),
            "vault.read(*)": zipObject(paths, markdownContents),
            "metadataCache.getCache(*)": zipObject(paths, metadatas),
            "metadataCache.getFirstLinkpathDest(*)": zipObject(paths, fileLinkpathDests),
        };
    });
}
function writeData(plugin, data, outFile) {
    return __awaiter(this, void 0, void 0, function* () {
        return plugin.app.vault.create(outFile, JSON.stringify(data, null, 2));
    });
}

/** A plugin settings tab for Obsimian settings. */
class ObsimianExportPluginSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    /** Returns an {@code onChange} function that saves the new value to settings. */
    onChangeSave(name) {
        return (value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings[name] = value;
            this.plugin.saveData(this.plugin.settings);
        });
    }
    /** Renders the settings page. */
    display() {
        let { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Export directory")
            .setDesc("The directory to write export data into. Relative paths are resolved relative to the vault directory.")
            .addText((text) => {
            text.inputEl.style.width = "100%";
            text
                .setPlaceholder("/path/to/export/directory")
                .setValue(this.plugin.settings.outDir)
                .onChange(this.onChangeSave("outDir"));
        });
    }
}

const DEFAULT_SETTINGS = {
    outDir: ".",
};
/** Provides an "Export data" command to dump an Obsimian-compatible data file. */
class ObsimianExportPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("loading ObsimianExportPlugin");
            yield this.loadSettings();
            this.addCommand({
                id: "obsimian-export-data",
                name: "Export data for testing",
                callback: () => {
                    const outPath = `${this.settings.outDir}/${this.app.vault.getName() + ".json"}`;
                    exportData(this, outPath);
                },
            });
            this.addSettingTab(new ObsimianExportPluginSettingsTab(this.app, this));
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(Object.assign({}, DEFAULT_SETTINGS), (yield this.loadData()));
        });
    }
}

module.exports = ObsimianExportPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9wbHVnaW4vdXRpbC50cyIsInNyYy9wbHVnaW4vbWFwcGluZy50cyIsInNyYy9wbHVnaW4vZXhwb3J0LnRzIiwic3JjL3BsdWdpbi9zZXR0aW5ncy50cyIsInNyYy9wbHVnaW4vbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFD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
