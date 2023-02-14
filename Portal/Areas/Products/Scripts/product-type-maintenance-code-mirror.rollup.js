import {EditorView, basicSetup} from "codemirror"
import {keymap} from "@codemirror/view"
import {EditorState} from "@codemirror/state"
import {json, jsonParseLinter} from "@codemirror/lang-json"
import {javascript, esLint} from "@codemirror/lang-javascript"
import {linter, lintGutter, lintKeymap, forEachDiagnostic } from "@codemirror/lint";
import {defaultKeymap, indentWithTab} from "@codemirror/commands";
import {search} from "@codemirror/search"
import Linter from "eslint4b-prebuilt-2"
import { solarizedLight } from "cm6-theme-solarized-light"
import { solarizedDark } from "cm6-theme-solarized-dark"
import { gruvboxLight } from "cm6-theme-gruvbox-light"
import { gruvboxDark } from "cm6-theme-gruvbox-dark"
import { basicLight } from "cm6-theme-basic-light"
import { basicDark } from "cm6-theme-basic-dark"
import { materialDark } from "cm6-theme-material-dark"
import { nord } from "cm6-theme-nord"

window.createJSCodeMirrorEditor = (element, options) => {
	let themes = {
		"solarizedLight": solarizedLight,
		"solarizedDark": solarizedDark,
		"gruvboxLight": gruvboxLight,
		"gruvboxDark": gruvboxDark,
		"basicLight": basicLight,
		"basicDark": basicDark,
		"materialDark": materialDark,
		"nord": nord
	}

	let theme = themes[options.theme] ?? basicLight;

	let extensions = [
		basicSetup,
		keymap.of([...defaultKeymap, indentWithTab, ...lintKeymap]),
		search({ top: true }),
		options.json ? json() : javascript,
		options.json ? linter(jsonParseLinter(new Linter())) : linter(esLint(new Linter())),
		lintGutter(),
		EditorView.domEventHandlers({
			drop(event) {
				console.trace(event);
				if (typeof options.dropListener === 'function') {
					options.dropListener(event);
				}
			}
		}),
		EditorView.updateListener.of((v) => {
			if (typeof options.updateListener === 'function') {
				options.updateListener(v);
			}
		}),
		theme
	];

	let editor = new EditorView(Object.assign({
		extensions: extensions,
		parent: element
	}, options));

	editor.clearTo = (contents) => {
		editor.setState(EditorState.create({ doc: contents, extensions: extensions }))
	}

	editor.linterDiagnostic = forEachDiagnostic;
	 
	return editor;
}