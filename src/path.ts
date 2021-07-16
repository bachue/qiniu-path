import path from 'path';

export class Path {
	constructor(
		private readonly sep: string,
		private readonly root: string,
		private readonly base: string | undefined,
		private readonly ext: string | undefined,
		private readonly dirSegments: Array<string>,
		private readonly isDir: boolean,
	) { }

	basename(): string | undefined { return this.base; }
	extname(): string | undefined { return this.ext; }

	directoryBasename(): string | undefined {
		if (this.dirSegments.length > 0) {
			return this.dirSegments[this.dirSegments.length - 1];
		} else {
			return undefined;
		}
	}

	private directory(): string {
		if (this.dirSegments.length > 0) {
			return `${this.root}${this.dirSegments.join(this.sep)}${this.sep}`;
		} else {
			return this.root;
		}
	}

	toString(): string {
		let fullPath = this.directory();
		if (this.basename()) {
			fullPath += this.basename();
		}
		return fullPath;
	}

	parentDirectoryPath(): Path {
		if (this.isDir) {
			const dirSegments = this.dirSegments.slice(0, this.dirSegments.length - 1);
			return new Path(this.sep, this.root, undefined, undefined, dirSegments, true);
		} else {
			return new Path(this.sep, this.root, undefined, undefined, this.dirSegments, true);
		}
	}

	joinFile(pathStr: string): Path {
		while (pathStr.endsWith(this.sep)) {
			pathStr = pathStr.slice(0, pathStr.length - 1);
		}
		return this.join(pathStr);
	}

	joinFolder(pathStr: string): Path {
		if (!pathStr.endsWith(this.sep)) {
			pathStr += this.sep;
		}
		return this.join(pathStr);
	}

	private join(pathStr: string): Path {
		if (this.isDir) {
			const segments = pathStr.split(this.sep);
			let isDir = false;
			let base: string | undefined = undefined;
			let ext: string | undefined = undefined;
			if (pathStr.endsWith(this.sep)) {
				segments.pop();
				isDir = true;
			} else {
				base = segments.pop();
				if (base) {
					ext = path.extname(base);
				}
			}
			const dirSegments = this.dirSegments.concat(segments);
			return new Path(this.sep, this.root, base, ext, dirSegments, isDir);
		} else {
			throw new Error("Cannot join path for File");
		}
	}
}
