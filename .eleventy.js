module.exports = function(eleventyConfig) {
	eleventyConfig.setTemplateFormats([
		"njk",
		"css",
	]);

	eleventyConfig.addPassthroughCopy('js');

	return {
		dir: {
			input: "templates"
		}
	};
};
