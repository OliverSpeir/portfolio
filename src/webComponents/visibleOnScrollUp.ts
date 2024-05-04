import type { MobileTOC } from "./mobileToc";

export class VisibleOnScrollUp extends HTMLElement {
	private lastScrollTop: number = 0;
	private readonly shadow: ShadowRoot;
	// private hasScrolled: boolean = false;
	private ignoreScrollUpdate: boolean = false;

	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.createContent();
		this.lastScrollTop = window.scrollY || document.documentElement.scrollTop;
		window.addEventListener("scroll", this.handleScroll);
		// this.handleScroll();
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
		}, 10);
	};

	handleScroll = () => {
		if (this.ignoreScrollUpdate) return;

		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		console.log(scrollTop);
		console.log("handlescroll called");
		// this.hasScrolled = true;
		if (scrollTop > this.lastScrollTop) {
			const mobileToc = this.shadow.querySelector("mobile-toc") as MobileTOC;
			if (mobileToc) mobileToc.close();
			this.style.transform = "translateY(100%)";
		} else {
			// scrolling up
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
                color:black;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: white;
                border-top: 1px solid black;
                padding: 10px;
                transform: translateY(100%);
                transition: transform 0.3s ease-in-out;
            }
        `;
	}
}
