module.exports = function(eleventyConfig) {
	eleventyConfig.setTemplateFormats([
		"njk",
		"css"
	]);

	return {
		dir: {
			input: "templates"
		}
	};
};
