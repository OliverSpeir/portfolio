import type { MobileTOC } from "./mobileToc";
export class FlyoutMenu extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
		this.getStyle();
		this.setupToggle();
	}

	setupToggle() {
		const button = this.querySelector(".toggle-btn");
		const menuContent = this.querySelector("#menu-content");
		const toggleIcon = this.querySelector(".toggle-icon");
		if (!button || !menuContent || !toggleIcon) return;

		button.addEventListener("click", () => {
			const root = this.getRootNode();
			if (root instanceof ShadowRoot) {
				const hostElement = root.host;
				if (hostElement.shadowRoot) {
					const toc = hostElement.shadowRoot.querySelector("mobile-toc") as MobileTOC;
					if (toc) toc.close();
				}
			}

			const isOpen = menuContent.classList.contains("show");
			isOpen
				? button.setAttribute("aria-label", "open menu")
				: button.setAttribute("aria-label", "close menu");
			menuContent.classList.toggle("show", !isOpen);
			menuContent.classList.add("enabled");

			toggleIcon.innerHTML = isOpen
				? `<svg width="30px" height="30px" viewBox="0 0 24 24" class="toggle-svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M5 5L19 19"><animate fill="freeze" attributeName="d" dur="0.3s" values="M5 5L19 19;M5 5L19 5"/></path><path d="M12 12H12" opacity="0"><animate fill="freeze" attributeName="d" begin="0.1s" dur="0.2s" values="M12 12H12;M5 12H19"/><set attributeName="opacity" begin="0.15s" to="1"/></path><path d="M5 19L19 5"><animate fill="freeze" attributeName="d" dur="0.3s" values="M5 19L19 5;M5 19L19 19"/></path></g></svg>`
				: `<svg width="30px" height="30px" viewBox="0 0 24 24" class="toggle-svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M5 5L19 5"><animate fill="freeze" attributeName="d" begin="0.15s" dur="0.3s" values="M5 5L19 5;M5 5L19 19"/></path><path d="M5 12H19"><animate fill="freeze" attributeName="d" dur="0.3s" values="M5 12H19;M12 12H12"/><set attributeName="opacity" begin="0.3s" to="0"/></path><path d="M5 19L19 19"><animate fill="freeze" attributeName="d" begin="0.15s" dur="0.3s" values="M5 19L19 19;M5 19L19 5"/></path></g></svg>`;
		});
	}

	close() {
		const menuContent = this.querySelector("#menu-content");
		const toggleIcon = this.querySelector(".toggle-icon");
		const toggleButton = this.querySelector(".toggle-btn") as HTMLButtonElement;
		if (!menuContent || !toggleIcon || !toggleButton) return;
		const isOpen = menuContent.classList.contains("show");

		if (isOpen) {
			toggleButton.setAttribute("aria-label", "open menu");
			menuContent.classList.remove("show");
			toggleIcon.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 24 24" class="toggle-svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M5 5L19 19"><animate fill="freeze" attributeName="d" dur="0.4s" values="M5 5L19 19;M5 5L19 5"/></path><path d="M12 12H12" opacity="0"><animate fill="freeze" attributeName="d" begin="0.2s" dur="0.4s" values="M12 12H12;M5 12H19"/><set attributeName="opacity" begin="0.2s" to="1"/></path><path d="M5 19L19 5"><animate fill="freeze" attributeName="d" dur="0.4s" values="M5 19L19 5;M5 19L19 19"/></path></g></svg>`;
		}
	}

	toggleAxe(isShown: boolean) {
		type ToggleButton = HTMLElement & {
			toggleAxe: (isShown: boolean) => void;
		};
		const button = this.querySelector(".toggle-btn") as HTMLButtonElement;
		const content = this.querySelector("#menu-content") as HTMLDivElement;
		const toggleButton = this.querySelector("theme-toggle-button") as ToggleButton;
		if (!button || !content || !toggleButton) return;
		const links = content.querySelectorAll("a");

		if (isShown) {
			toggleButton.toggleAxe(true);
			button.setAttribute("tabindex", "-1");
			button.setAttribute("aria-disabled", "true");
			links.forEach((link: HTMLAnchorElement) => {
				link.setAttribute("tabindex", "-1");
			});
		} else {
			toggleButton.toggleAxe(false);
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
      flyout-menu {
        flex: 1 1 auto;
      }  
      #menu-content {
        position: absolute;
        right: 0px;
        bottom: 100%;
        display: flex;
        transform: translateY(10px);
        transform-origin: bottom;
        background-color: var(--contents-bg);
        box-sizing: border-box;
        box-shadow: 0 8px 16px rgba(var(--box-shadow-color), var(--box-shadow-opacity));
        border: 2px solid var(--accent-color);
        border-radius: 10px;
        padding: 10px;
        margin: 10px;
        max-width: 100%;
        visibility: hidden;
        opacity: 0;
        z-index: 10;
        transition: opacity 1s, transform 1s; 
      }
      #menu-content.enabled {
        transition: opacity 0.3s, transform 0.3s, visibility 0s 0.3s; 
      }
      #menu-content.show {
        visibility: visible;
        opacity: 1;
        transform: translateY(0px);
        transition: opacity 0.3s, transform 0.3s, visibility 0s 0s; 
      }
      .home-icon {
        height: 50px;
        width: 50px;
        color: var(--text-color)
      }
      .garden-icon {
        height: 50px;
        width: 50px;
        color: var(--text-color);
      }
      .icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .label {
        font-size: 10px;
        text-align: center;
      }
      .toggle-btn {
        cursor: pointer;
        border: none;
        background: none;
        outline: none;
      }
      .toggle-btn:focus-visible { outline: 2px solid #4D90FE; outline-offset: 2px; }
      .toggle-icon {
        display: block;
      }
      .toggle-svg {
        color: var(--text-color)
      }
    `;
		this.appendChild(style);
	}

	render() {
		this.innerHTML = `
        <button class="toggle-btn" aria-label="open menu"><span class="toggle-icon"><svg width="30px" height="30px" viewBox="0 0 24 24" class="toggle-svg"><g fill="none" stroke="currentColor" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-width="2"><path d="M5 5H19" stroke-dashoffset="0" /><path d="M5 12H19" stroke-dashoffset="0" /><path d="M5 19H19" stroke-dashoffset="0" /></g></svg></span></button>
        <div id="menu-content">
          <div class="icon-container">
            <theme-toggle-button data-theme-icon-size=60px></theme-toggle-button>
          </div>
          <div class="icon-container">
            <a href="/" aria-label="homepage">
            <svg width="1em" height="1em" viewBox="0 0 24 24" class="home-icon"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M10.671 2.843a2 2 0 0 1 2.658 0l3.934 3.497l.25-1.504a1 1 0 1 1 1.973.328L19.03 7.91l2.635 2.343a1 1 0 0 1-1.328 1.494l-.464-.412l-.787 7.864A2 2 0 0 1 17.095 21H6.905a2 2 0 0 1-1.99-1.801l-.786-7.864l-.465.412a1 1 0 0 1-1.328-1.494zM5.957 9.71c.019.062.031.125.038.191l.91 9.1h10.19l.91-9.1c.007-.066.02-.13.038-.19L12 4.337z"/></g></svg></a>
          </div>
          <div class="icon-container">
          <a href="/garden/" aria-label="garden">
          <svg width="1em" height="1em" viewBox="0 0 256 256" class="garden-icon"><path fill="currentColor" d="M247.63 47.89a8 8 0 0 0-7.52-7.52c-51.76-3-93.32 12.74-111.18 42.22c-11.8 19.49-11.78 43.16-.16 65.74a71.34 71.34 0 0 0-14.17 27L98.33 159c7.82-16.33 7.52-33.35-1-47.49c-13.2-21.79-43.67-33.47-81.5-31.25a8 8 0 0 0-7.52 7.52c-2.23 37.83 9.46 68.3 31.25 81.5A45.82 45.82 0 0 0 63.44 176A54.58 54.58 0 0 0 87 170.33l25 25V224a8 8 0 0 0 16 0v-29.49a55.61 55.61 0 0 1 12.27-35a73.91 73.91 0 0 0 33.31 8.4a60.9 60.9 0 0 0 31.83-8.86c29.48-17.84 45.26-59.4 42.22-111.16M47.81 155.6C32.47 146.31 23.79 124.32 24 96c28.32-.24 50.31 8.47 59.6 23.81c4.85 8 5.64 17.33 2.46 26.94l-24.41-24.41a8 8 0 0 0-11.31 11.31l24.41 24.41c-9.61 3.18-18.93 2.39-26.94-2.46m149.31-10.22c-13.4 8.11-29.15 8.73-45.15 2l53.69-53.7a8 8 0 0 0-11.31-11.31L140.65 136c-6.76-16-6.15-31.76 2-45.15c13.94-23 47-35.82 89.33-34.83c.96 42.32-11.84 75.42-34.86 89.36"/></svg></a>
          </div>
        </div>
      `;
	}
}
