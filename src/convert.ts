import { Path } from './path';
import path from 'path';

export function fromLocalPath(pathStr: string): Path {
	const sep = path.sep;
	let isDir = false;
	if (pathStr.endsWith(sep)) {
		isDir = true;
	}
	const parsed = path.parse(pathStr);
	const dirSegments = parsed.dir.substr(parsed.root.length).split(sep);
	let base: string | undefined = parsed.base;
	let ext: string | undefined = parsed.ext;
	if (isDir) {
		dirSegments.push(parsed.base);
		base = undefined;
		ext = undefined;
	}
	return new Path(sep, parsed.root, base, ext, dirSegments, isDir);
}

export function fromQiniuPath(pathStr: string): Path {
	const sep = '/';
	let isDir = false;
	if (pathStr.endsWith(sep)) {
		isDir = true;
	}
	const segments = pathStr.split(sep);
	let basename: string | undefined = undefined;
	let ext: string | undefined = undefined;
	if (isDir) {
		segments.pop();
	} else {
		basename = segments.pop();
		if (basename) {
			ext = path.extname(basename);
		}
	}
	return new Path(sep, '', basename, ext, segments, isDir);
}
