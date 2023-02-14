import {EditorView, basicSetup} from "codemirror"
import {keymap} from "@codemirror/view"
import {EditorState} from "@codemirror/state"
import {json, jsonParseLinter} from "@codemirror/lang-json"
import {javascript, esLint} from "@codemirror/lang-javascript"
import {linter, lintGutter, lintKeymap } from "@codemirror/lint";
import {defaultKeymap, indentWithTab} from "@codemirror/commands";
import {search} from "@codemirror/search"
import Linter from "eslint4b-prebuilt-2"

window.createJSCodeMirrorEditor = (element, options) => {
	let editor = new EditorView(Object.assign({
		extensions: [
			basicSetup,
			keymap.of([...defaultKeymap, indentWithTab, ...lintKeymap]),
			search({ top: true }),
			options.json ? json() : javascript,
			options.json ? linter(jsonParseLinter(new Linter())) : linter(esLint(new Linter())),
			EditorView.updateListener.of((v) => {
				if (typeof options.updateListener === 'function') {
					options.updateListener(v);
				}
			})
		],
		parent: element
	}, options));
	
	return editor;
}