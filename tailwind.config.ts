import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
	content: ["./src/**/*.{astro,js,ts,tsx,md,mdx}"],
	darkMode: ["selector", '[data-theme="dark"]'],
	corePlugins: {
		preflight: false,
		filter: false,
		backdropFilter: false,
		ringWidth: false,
		ringColor: false,
		ringOffsetWidth: false,
		ringOffsetColor: false,
		boxShadow: false,
		transform: false,
		touchAction: false,
		scrollSnapType: false,
		borderColor: false,
		borderOpacity: false,
		textOpacity: false,
		fontVariantNumeric: false,
	},

	theme: {
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
		},
		extend: {
			colors: {
				inherit: "inherit",
				"light-bg": "#f2f3f5",
				"dark-bg": "#27272a",
				"light-text": "#09090b",
				"dark-text": "#ecf1f9",
				"accent-color": "#2f3a91",
				"dark-accent-color": "#acbef9",
				"headings-light": "",
				"headings-dark": "",
			},
		},
	},

	plugins: [
		plugin(({ addBase }) => {
			addBase({
				"*, ::before, ::after": {
					boxSizing: "border-box",
				},
				html: {
					fontSize: "17px",
					lineHeight: "1.5",
					"@apply text-light-text": {},
				},
				body: {
					"@apply min-h-screen w-full bg-light-bg dark:bg-dark-bg p-2 dark:text-dark-text": {},
				},
				"body, dl, dd, p": {
					margin: "0",
				},
				":root": {
					"-moz-tab-size": "4",
					tabSize: "4",
				},
				"html, body": {
					fontFamily:
						"ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', fallback-arial, 'Arial', 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
				},
				a: {
					textDecoration: "none",
					fontWeight: "500",
					transition: "color .15s",
					"&:hover": {
						textDecoration: "underline",
						textUnderlinePosition: "from-font",
						textDecorationThickness: "2px",
					},
					"@apply text-accent-color dark:text-dark-accent-color": {},
				},
				"h1, h2, h3, h4": {
					marginTop: "1rem",
					letterSpacing: "-.01em",
					fontWeight: "550",
					"@apply text-headings-light dark:text-headings-dark": {},
				},
				article: {
					marginBottom: "3rem",
				},
				"article p, p, ul, pre, blockquote": {
					marginBottom: "1em",
				},
				"h1, h2": {
					marginBottom: ".6rem",
					fontSize: "28px",
				},
				h3: {
					marginBottom: ".6rem",
				},
				"li>p": {
					marginBottom: ".6rem",
				},
				code: {
					backgroundColor: "#D4D4D8",
					"@apply px-1 py-[.1rem] rounded-md dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap break-words":
						{},
				},
			});
		}),
	],
};

export default config;
