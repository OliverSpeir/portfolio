// Define a type guard for Element
const isElement = (node) => {
	return "type" in node && node.type === "element";
};

// Wrapper function for visitation
const visitWrapper = (tree, visitor) => {
	if ("children" in tree) {
		for (const child of tree.children) {
			if (isElement(child)) {
				visitor(child);
			}
			if ("children" in child) {
				visitWrapper(child, visitor);
			}
		}
	}
};

// Main function to add "group" class to h2 elements
export const addGroupToH2 = () => {
	return (tree) => {
		visitWrapper(tree, (node) => {
			if (node.tagName === "h2") {
				node.properties = {
					...node.properties,
					class: "group",
				};
			}
		});
	};
};
