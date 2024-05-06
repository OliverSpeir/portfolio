import type { MobileTOC } from "./mobileToc";
import type { FlyoutMenu } from "./mobileMenu";

export class VisibleOnScrollUp extends HTMLElement {
	private lastScrollTop: number = 0;
	private readonly shadow: ShadowRoot;
	private ignoreScrollUpdate: boolean = false;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.createContent();
		this.lastScrollTop = window.scrollY || document.documentElement.scrollTop;
		window.addEventListener("scroll", this.handleScroll);
		this.addLinkClickListener();
	}

	disconnectedCallback() {
		window.removeEventListener("scroll", this.handleScroll);
		this.removeLinkClickListener();
	}

	createContent() {
		const style = document.createElement("style");
		style.textContent = this.getStyle();
		this.shadow.appendChild(style);

		const mobileToc = document.createElement("mobile-toc");
		this.shadow.appendChild(mobileToc);
		const flyOut = document.createElement("flyout-menu");
		flyOut.setAttribute("data-theme-icon-size", "60px");
		this.shadow.appendChild(flyOut);
	}

	addLinkClickListener() {
		const links = this.shadow.querySelectorAll("a");
		links.forEach((link) => link.addEventListener("click", this.handleLinkClick));
	}

	removeLinkClickListener() {
		const links = this.shadow.querySelectorAll("a");
		links.forEach((link) => link.removeEventListener("click", this.handleLinkClick));
	}

	handleLinkClick = () => {
		this.ignoreScrollUpdate = true;
		setTimeout(() => {
			this.ignoreScrollUpdate = false;
		}, 100);
	};

	handleScroll = () => {
		if (this.ignoreScrollUpdate) return;
		const mobileToc = this.shadow.querySelector("mobile-toc") as MobileTOC;
		const flyOut = this.shadow.querySelector("flyout-menu") as FlyoutMenu;
		if (!mobileToc || !flyOut) return;
		const isTocOpen = mobileToc.querySelector("section")?.classList.contains("show");
		const isFlyOutOpen = flyOut.querySelector("#menu-content")?.classList.contains("show");

		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		if (scrollTop > this.lastScrollTop) {
			if (isTocOpen) mobileToc.close();
			mobileToc.toggleAxe(true);
			if (isFlyOutOpen) flyOut.close();
			flyOut.toggleAxe(true);

			this.style.transform = "translateY(100%)";
		} else {
			mobileToc.toggleAxe(false);
			flyOut.toggleAxe(false);
			this.style.transform = "translateY(0)";
		}
		this.lastScrollTop = scrollTop;
	};

	getStyle() {
		return `
        :host {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                color: var(--text-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: var(--contents-bg);
                border-top: 1px solid black;
                padding: 10px;
                transform: translateY(100%);
                transition: transform 0.3s ease-in-out;
				z-index: 20;
				width: 100%;
				max-width: 100%;
				touch-action: manipulation;
            }
        `;
	}
}
