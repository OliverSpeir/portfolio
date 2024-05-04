import { TOC } from "./toc";

export class MobileTOC extends TOC {
	constructor() {
		super();
	}

	override connectedCallback() {
		this.cloneTemplate();
		super.initDOMDependentFeatures();
		this.setupToggle();
		this.getStyle();
	}

	override cloneTemplate() {
		const template = document.getElementById("mobileToc") as HTMLTemplateElement;
		const instance = document.importNode(template.content, true);
		this.appendChild(instance);
	}

	override set current(link: HTMLAnchorElement) {
		super.current = link;
		const display = this.querySelector("#display-current") as HTMLSpanElement;
		if (display) display.textContent = link.textContent;
	}

	setupToggle() {
		const button = this.querySelector("#toc-toggle");
		const tocContent = this.querySelector("#toc-content");
		if (!button || !tocContent) return;

		button.addEventListener("click", () => {
			const isOpen = tocContent.classList.contains("show");
			tocContent.classList.toggle("show", !isOpen);
			tocContent.classList.add("enabled"); // Enable transitions after the first interaction
			this.style.setProperty("--caret-rotation", isOpen ? "0deg" : "-90deg");
		});
	}

	close() {
		const tocContent = this.querySelector("#toc-content");
		if (tocContent) {
			tocContent.classList.toggle("show", false);
		}
		this.style.setProperty("--caret-rotation", "0deg");
	}

	getStyle() {
		const style = document.createElement("style");
		style.textContent = `
		:host {
			--caret-rotation: 0deg;
		}
		#toc-container {
			width: 100%;
			background: black;
			border-top: 1px solid black;
			z-index: 100;
		}
		#toc-content {
			position: absolute;
			left: 0px;
			right: 0px;
			bottom: 100%;
			transform: translateY(10px);
			transform-origin: bottom;
			background-color: var(--contents-bg);
			color: var(--text-color);
			box-sizing: border-box;
			box-shadow: 0 8px 16px rgba(0,0,0,0.2);
			border-radius: 10px;
			padding: 10px;
			margin: 10px;
			max-width: 100%;
			visibility: hidden;
			opacity: 0;
			z-index: 10;
			transition: opacity 1s, transform 1s; 
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		#toc-content-wrapper {
			width:95%;
		}
		#toc-content ul {
			width: 100%;
			padding: 0;
			list-style: none;
			margin: 0;
		}
		
		#toc-content li {
			display: block;
			width: 100%;
			padding: 0;
			box-sizing: border-box;
			border-top: 1px solid #565656;
		}

		#toc-content ul ul li.current {
			background-color: #323232;
			border-radius: 2px;
		}
		
		#toc-content a[aria-current="true"] {
			background-color: #323232;
			border-radius: 2px;
		}

		#toc-content > #toc-content-wrapper > ul > li:first-child {
			border-top: none;
		}

		
		#toc-content ul ul li {
			padding-left: 20px;
			padding-right: 0;
		}
		
		#toc-content li, #toc-content a {
			white-space: nowrap;
			overflow: hidden; 
			text-overflow: ellipsis;
			display: block;
			width: 100%;
		}
		#toc-content a {
			padding-left: 0.35rem;
			text-decoration: none;
			font-weight: 500;
			color: var(--accent-color);
			transition: color 0.15s;
		}
		#toc-content a:hover {
			text-decoration: underline;
			text-underline-position: from-font;
			text-decoration-thickness: 2px;
		}
		#toc-content.enabled {
			transition: opacity 0.3s, transform 0.3s, visibility 0s 0.3s; 
		}
		#toc-content.show {
			visibility: visible;
			opacity: 1;
			transform: translateY(0px);
			transition: opacity 0.3s, transform 0.3s, visibility 0s 0s; 
		}
		#caret {
			transform: rotateZ(var(--caret-rotation));
			transition: transform 0.3s ease-in-out;
		}
		#display-current {
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		
		`;
		this.appendChild(style);
	}
}
