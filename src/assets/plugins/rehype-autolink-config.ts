import { h } from "hastscript";
import type { Options } from "rehype-autolink-headings";

// Custom escape function
const escape = (str: string = ""): string => {
	const map: { [key: string]: string } = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	};

	return str.replace(/[&<>"']/g, (m) => {
		const key = m as keyof typeof map;
		return map[key] ?? m;
	});
};

interface HastNode {
	type: string;
	value?: string;
	children?: HastNode[];
}

// Custom toString function
const toString = (node: HastNode): string => {
	if (node.type === "text") {
		return node.value || "";
	}

	if (node.children) {
		return node.children.map(toString).join("");
	}

	return "";
};

const AnchorLinkIcon = h(
	"svg",
	{
		width: 24,
		height: 24,
		version: 1.1,
		viewBox: "0 0 16 16",
		xlmns: "http://www.w3.org/2000/svg",
	},
	h("path", {
		fillRule: "evenodd",
		fill: "currentcolor",
		d: "M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z",
	}),
);

const createSROnlyLabel = (text: string) => {
	return h(
		"span",
		{ "is:raw": true, class: "sr-only" },
		`Link to the ${escape(text)} section of this page`,
	);
};

export const autolinkConfig: Options = {
	properties: { class: "anchor-link group" },
	behavior: "append",
	content: (heading) => [
		h(
			`span.anchor-icon`,
			{
				ariaHidden: "true",
				class: "md:opacity-0 pr-2 group-hover:opacity-100 group-focus-within:opacity-100",
			},
			AnchorLinkIcon,
		),
		createSROnlyLabel(toString(heading)),
	],
};
