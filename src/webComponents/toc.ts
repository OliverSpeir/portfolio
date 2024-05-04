export class TOC extends HTMLElement {
	private _current: HTMLAnchorElement | null = null;
	private minH: number;
	private maxH: number;
	private observer: IntersectionObserver | undefined;

	constructor() {
		super();
		this.minH = parseInt(this.dataset.minH || "2", 10);
		this.maxH = parseInt(this.dataset.maxH || "3", 10);
	}

	connectedCallback() {
		this.cloneTemplate();
		this.initDOMDependentFeatures();
	}

	cloneTemplate() {
		const template = document.getElementById("desktopToc") as HTMLTemplateElement;
		const instance = document.importNode(template.content, true);
		this.appendChild(instance);
	}

	initDOMDependentFeatures() {
		this._current = this.querySelector('a[aria-current="true"]');
		const links = [...this.querySelectorAll("a")];
		this.setupIntersectionObserver(links);
		this.handleResize();
	}

	protected set current(link: HTMLAnchorElement) {
		if (link === this._current) return;
		if (this._current) this._current.removeAttribute("aria-current");
		link.setAttribute("aria-current", "true");
		this._current = link;
	}

	setupIntersectionObserver(links: HTMLAnchorElement[]) {
		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const { isIntersecting, target } of entries) {
				if (!isIntersecting) continue;
				const heading = this.getElementHeading(target);
				if (!heading) continue;
				const link = links.find((link) => link.hash === "#" + encodeURIComponent(heading.id));
				if (link) {
					this.current = link;
					break;
				}
			}
		};

		const toObserve = document.querySelectorAll("main [id], main [id] ~ *, main .content > *");
		if (this.observer) this.observer.disconnect();
		this.observer = new IntersectionObserver(setCurrent, { rootMargin: this.getRootMargin() });
		toObserve.forEach((h) => this.observer!.observe(h));
	}

	handleResize() {
		let timeout: NodeJS.Timeout;
		window.addEventListener("resize", () => {
			if (this.observer) this.observer.disconnect();
			clearTimeout(timeout);
			timeout = setTimeout(
				() => this.setupIntersectionObserver([...this.querySelectorAll("a")]),
				200,
			);
		});
	}

	private getRootMargin() {
		const mobileTocHeight = this.querySelector("summary")?.getBoundingClientRect().height || 0;
		const top = mobileTocHeight + 32;
		const bottom = top + 53;
		const height = document.documentElement.clientHeight;
		return `-${top}px 0% ${bottom - height}px`;
	}

	getElementHeading(el: Element | null): HTMLHeadingElement | null {
		if (!el) return null;
		const visited = new Set<Element>();
		while (el && !visited.has(el)) {
			if (el instanceof HTMLHeadingElement) {
				const level = el.tagName[1];
				if (level && parseInt(level, 10) >= this.minH && parseInt(level, 10) <= this.maxH)
					return el as HTMLHeadingElement;
			}
			visited.add(el);
			el = el.parentElement;
		}
		return null;
	}
}
