// Wrapper function
const visitWrapper = (tree, visitor) => {
	if ("children" in tree) {
		for (let i = 0; i < tree.children.length; i++) {
			const child = tree.children[i];
			if ("tagName" in child && "properties" in child) {
				visitor(child, tree); // Assuming child is an Element and tree is a Parent
			}
			if ("children" in child) {
				visitWrapper(child, visitor);
			}
		}
	}
};

// Main function
export const accessibleCheckbox = () => {
	let idCounter = 0;
	const modifications = [];

	return (tree) => {
		visitWrapper(tree, (node, parent) => {
			if (
				node.tagName === "input" &&
				node.properties?.type === "checkbox" &&
				node.properties?.disabled !== undefined
			) {
				const id = `checkbox-${idCounter++}`;
				node.properties.id = id;

				const description = node.properties?.checked
					? "Checkbox is selected"
					: "Checkbox is not selected";

				const label = {
					type: "element",
					tagName: "label",
					properties: {
						htmlFor: id,
						className: ["sr-only"],
					},
					children: [{ type: "text", value: description }],
				};

				modifications.push({ parent, node, label });
			}
		});

		modifications.forEach(({ parent, node, label }) => {
			const index = parent.children.indexOf(node);
			if (index !== -1) {
				parent.children.splice(index + 1, 0, label);
			}
		});
	};
};
