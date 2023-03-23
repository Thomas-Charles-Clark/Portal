import { EditorView as EditorView } from "@codemirror/view";
import { basicSetup as basicSetup } from "codemirror";
import { keymap as keymap } from "@codemirror/view";
import { EditorState as EditorState } from "@codemirror/state";
import { json as json, jsonParseLinter as jsonParseLinter } from "@codemirror/lang-json";
import { javascript as javascript, esLint as esLint } from "@codemirror/lang-javascript";
import { linter as linter, lintGutter as lintGutter, lintKeymap as lintKeymap, forEachDiagnostic as forEachDiagnostic } from "@codemirror/lint";
import { defaultKeymap as defaultKeymap, indentWithTab as indentWithTab } from "@codemirror/commands";
import { search as search } from "@codemirror/search";
import Linter from "eslint4b-prebuilt-2";
import { solarizedLight as solarizedLight } from "cm6-theme-solarized-light";
import { solarizedDark as solarizedDark } from "cm6-theme-solarized-dark";
import { gruvboxLight as gruvboxLight } from "cm6-theme-gruvbox-light";
import { gruvboxDark as gruvboxDark } from "cm6-theme-gruvbox-dark";
import { basicLight as basicLight } from "cm6-theme-basic-light";
import { basicDark as basicDark } from "cm6-theme-basic-dark";
import { materialDark as materialDark } from "cm6-theme-material-dark";
import { nord as nord } from "cm6-theme-nord";

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

	let editor = new EditorView({
		extensions: extensions,
		parent: element
	});

	editor.clearTo = (contents) => {
		editor.setState(EditorState.create({ doc: contents, extensions: extensions }))
	}

	editor.linterDiagnostic = forEachDiagnostic;

	return editor;
}