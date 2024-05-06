import { TOC } from "./toc";
import type { FlyoutMenu } from "./mobileMenu";

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
		const buttonTitle = this.querySelector("#button-title");
		if (!button || !tocContent || !buttonTitle) return;

		button.addEventListener("click", () => {
			const root = this.getRootNode();
			if (root instanceof ShadowRoot) {
				const hostElement = root.host;
				if (hostElement.shadowRoot) {
					const flyOut = hostElement.shadowRoot.querySelector("flyout-menu") as FlyoutMenu;
					if (flyOut) flyOut.close();
				}
			}
			const isOpen = tocContent.classList.contains("show");
			tocContent.classList.toggle("show", !isOpen);
			buttonTitle.classList.toggle("show", !isOpen);
			tocContent.classList.add("enabled");
			const caret = this.querySelector("#caret") as SVGAElement;
			if (caret) {
				caret.style.transform = `rotateZ(${isOpen ? "0deg" : "-90deg"})`;
			}
		});
	}

	close() {
		const tocContent = this.querySelector("#toc-content");
		if (tocContent) {
			tocContent.classList.toggle("show", false);
		}
		const caret = this.querySelector("#caret") as SVGAElement;
		if (caret) {
			caret.style.transform = "rotateZ(0deg)";
		}
	}

	toggleAxe(isShown: boolean) {
		const links = this.querySelectorAll("a") as NodeListOf<HTMLAnchorElement>;
		const button = this.querySelector("#toc-toggle") as HTMLButtonElement;
		if (!button || !(links.length > 0)) return;

		if (isShown) {
			button.tabIndex = -1;
			button.ariaDisabled = "true";
			links.forEach((link: HTMLAnchorElement) => {
				link.tabIndex = -1;
			});
		} else {
			button.removeAttribute("tabindex");
			button.removeAttribute("aria-disabled");

			links.forEach((link: HTMLAnchorElement) => {
				link.removeAttribute("tabindex");
			});
		}
	}

	getStyle() {
		const style = document.createElement("style");
		style.textContent = `
		mobile-toc {
			width: 100%;
			max-width: 100%;
			display: flex;
			overflow: hidden;
			flex: 1 1 auto;
			touch-action: manipulation;
		}
		#toc-content {
			position: absolute;
			left: 0px;
			right: 0px;
			bottom: 100%;
			transform: translateY(10px);
			z-index: 10;
			background-color: var(--contents-bg);
			color: var(--text-color);
			box-sizing: border-box;
			box-shadow: 0 8px 16px rgba(var(--box-shadow-color), var(--box-shadow-opacity));
			border: 2px solid var(--accent-color);
			border-radius: 10px;
			padding: 10px;
			margin: 10px;
			max-width: 100%;
			visibility: hidden;
			opacity: 0;
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
			background-color: var(--contents-accent);
			border-radius: 2px;
		}
		
		#toc-content a[aria-current="true"] {
			background-color: var(--contents-accent);
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
			transform: translate3d(0, 0px, 0);
			transition: opacity 0.3s, transform 0.3s, visibility 0s 0s; 
		}
		#caret {
			transform: rotateZ(var(--caret-rotation));
			transition: transform 0.3s ease-in-out;
			margin-top: 0.15rem;
			width: 1.25rem;
			height: 1.25rem;
		}
		#display-current {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden; 
			max-width: 47%;
			width: 100%;
			min-width: 10rem;
			text-align: left;
			margin-left: 0.35rem;
		}
		#button-title {
			display:flex;
			padding: 0.25rem;
			background-color: var(--contents-accent);
			justify-content: space-between;
			border: 1px solid grey;
			border-radius: .5rem;
			gap: 0.25rem;
			font-weight: 500;
		}
		#button-title.show {
			background-color: var(--accent-color);
			color: var(--text-color-opposite);
		}
		#toc-display {
			display: flex;
			width: 100%; 
		}
		#toc-toggle {
			background: transparent;
			color: inherit;
			font: inherit;
			border: none;
			margin: 0;
			padding: 0;
			align-items: center;
			display: flex;
			width: 100%;
			-webkit-tap-highlight-color: rgba(0,0,0,0);
		}
		`;
		this.appendChild(style);
	}
}
