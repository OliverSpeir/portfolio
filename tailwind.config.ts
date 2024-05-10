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
				"heading-light-text": "#09090b",
				"light-text": "#363840",
				"dark-text": "#c2c3c7",
				"dark-heading-text": "#ecf1f9",
				"accent-color": "#2f3a91",
				"dark-accent-color": "#acbef9",
				"headings-light": "",
				"headings-dark": "",
			},
		},
	},

	plugins: [
		plugin(({ addBase, theme }) => {
			addBase({
				"*, ::before, ::after": {
					boxSizing: "border-box",
				},
				html: {
					fontSize: "1.1rem",
					lineHeight: "1.5",
					"letter-spacing": "0.02em",
					"@apply text-light-text dark:text-dark-text bg-light-bg dark:bg-dark-bg": {},
				},
				body: {
					"@apply min-h-screen w-full p-2": {},
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
					margin: "0",
					padding: "0",
				},
				a: {
					textDecoration: "none",
					fontWeight: "500",
					paddingTop: "0.1rem",
					paddingBottom: "0.1rem",
					transition: "color .15s",
					"&:hover": {
						textDecoration: "underline",
						textUnderlinePosition: "from-font",
						textDecorationThickness: "2px",
					},
					"@apply text-accent-color dark:text-dark-accent-color": {},
				},
				"h1, h2, h3, h4": {
					marginTop: "2.25rem",
					marginBottom: "1rem",
					letterSpacing: "-.01em",
					fontWeight: "600",
					fontSize: "1.4rem",
					lineHeight: "1",
					"letter-spacing": "0.02em",
					"@apply text-heading-light-text dark:text-dark-heading-text": {},
				},
				article: {
					marginBottom: "3rem",
				},
				"article p, p, ul, pre, blockquote": {
					marginBottom: "1em",
				},
				"h1, h2": {
					fontSize: "1.65rem",
				},
				h1: {
					marginTop: "1rem",
					fontSize: "2rem",
				},
				"li>p": {
					marginBottom: ".6rem",
				},
				code: {
					backgroundColor: "#D4D4D8",
					"@apply px-1 py-[.1rem] rounded-md dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap break-words":
						{},
				},
				"article img": {
					maxWidth: "100%",
					height: "auto",
					borderRadius: theme("borderRadius.md"),
				},
			});
		}),
	],
};

export default config;
