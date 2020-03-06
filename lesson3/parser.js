const fs = require('fs');
const { join, relative, extname } = require('path');

const parse = (startPath, maxDeep, extensions, searchPattern, emmiter) => {
	return function parser(path = startPath, deep = 0) {
		const results = [];
		const items = fs.readdirSync(path, { withFileTypes: true });
		for (const item of items) {
			if (item.isFile()) {
				emmiter('found:file');
				if (
					extensions.includes(extname(item.name)) &&
					(!searchPattern || (searchPattern && item.name.includes(searchPattern)))
				) {
					const relativePath = relative(startPath, join(path, item.name));
					results.push(relativePath);
					console.log(results);
					emmiter('file', relativePath);
				}
			} else if (item.isDirectory()) {
				emmiter('found:dir');
				if (deep < maxDeep || maxDeep !== 0) {
					const nextPath = join(path, item.name);
					results.push(...parser(nextPath, deep + 1));
				}
			}

		}
		return results;
	};
};

module.exports = parse;