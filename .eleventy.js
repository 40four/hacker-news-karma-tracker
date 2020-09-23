module.exports = function(eleventyConfig) {
	eleventyConfig.setTemplateFormats([
		"njk",
		"css",
	]);

	eleventyConfig.addPassthroughCopy('11ty_input/js');

	return {
		dir: {
			input: "11ty_input",
			output: '11ty_output'
		}
	};
};
