import process from 'process';
import fs from 'fs';
import { expect, assert } from 'chai';
import { fromQiniuPath, fromPosixPath, fromWin32Path } from '../src/convert';

process.on('uncaughtException', (err: any, origin: any) => {
	fs.writeSync(
		process.stderr.fd,
		`Caught exception: ${err}\n` +
		`Exception origin: ${origin}`
	);
	assert.fail();
});

describe('fromQiniuPath', () => {
	it('should return correct basename', () => {
		expect(fromQiniuPath('file').basename()).to.equal('file');
		expect(fromQiniuPath('/file').basename()).to.equal('file');
		expect(fromQiniuPath('//file').basename()).to.equal('file');
		expect(fromQiniuPath('dir1/').basename()).to.undefined;
		expect(fromQiniuPath('/dir1/').basename()).to.undefined;
		expect(fromQiniuPath('//dir1/').basename()).to.undefined;
		expect(fromQiniuPath('/dir1//').basename()).to.undefined;
		expect(fromQiniuPath('//dir1//').basename()).to.undefined;
		expect(fromQiniuPath('dir1/dir2/dir3/file').basename()).to.equal('file');
		expect(fromQiniuPath('/dir1/dir2/dir3/file').basename()).to.equal('file');
		expect(fromQiniuPath('/dir1//dir2/dir3/file').basename()).to.equal('file');
		expect(fromQiniuPath('//dir1/dir2/dir3/file').basename()).to.equal('file');
	});

	it('should return correct directoryBasename', () => {
		expect(fromQiniuPath('file').directoryBasename()).to.undefined;
		expect(fromQiniuPath('/file').directoryBasename()).to.equal('');
		expect(fromQiniuPath('//file').directoryBasename()).to.equal('');
		expect(fromQiniuPath('dir1/').directoryBasename()).to.equal('dir1');
		expect(fromQiniuPath('/dir1/').directoryBasename()).to.equal('dir1');
		expect(fromQiniuPath('//dir1/').directoryBasename()).to.equal('dir1');
		expect(fromQiniuPath('/dir1//').directoryBasename()).to.equal('');
		expect(fromQiniuPath('//dir1//').directoryBasename()).to.equal('');
		expect(fromQiniuPath('dir1/dir2/dir3/file').directoryBasename()).to.equal('dir3');
		expect(fromQiniuPath('/dir1/dir2/dir3/file').directoryBasename()).to.equal('dir3');
		expect(fromQiniuPath('/dir1//dir2/dir3/file').directoryBasename()).to.equal('dir3');
		expect(fromQiniuPath('//dir1/dir2/dir3/file').directoryBasename()).to.equal('dir3');
	});

	it('should convert to correct string', () => {
		expect(fromQiniuPath('file').toString()).to.equal('file');
		expect(fromQiniuPath('/file').toString()).to.equal('/file');
		expect(fromQiniuPath('//file').toString()).to.equal('//file');
		expect(fromQiniuPath('dir1/').toString()).to.equal('dir1/');
		expect(fromQiniuPath('/dir1/').toString()).to.equal('/dir1/');
		expect(fromQiniuPath('//dir1/').toString()).to.equal('//dir1/');
		expect(fromQiniuPath('/dir1//').toString()).to.equal('/dir1//');
		expect(fromQiniuPath('//dir1//').toString()).to.equal('//dir1//');
		expect(fromQiniuPath('dir1/dir2/dir3/file').toString()).to.equal('dir1/dir2/dir3/file');
		expect(fromQiniuPath('/dir1/dir2/dir3/file').toString()).to.equal('/dir1/dir2/dir3/file');
		expect(fromQiniuPath('/dir1//dir2/dir3/file').toString()).to.equal('/dir1//dir2/dir3/file');
		expect(fromQiniuPath('//dir1/dir2/dir3/file').toString()).to.equal('//dir1/dir2/dir3/file');
	});

	it('should return correct parentDirectoryPath string', () => {
		expect(fromQiniuPath('file').parentDirectoryPath().toString()).to.equal('');
		expect(fromQiniuPath('/file').parentDirectoryPath().toString()).to.equal('/');
		expect(fromQiniuPath('//file').parentDirectoryPath().toString()).to.equal('//');
		expect(fromQiniuPath('dir1/').parentDirectoryPath().toString()).to.equal('');
		expect(fromQiniuPath('/dir1/').parentDirectoryPath().toString()).to.equal('/');
		expect(fromQiniuPath('//dir1/').parentDirectoryPath().toString()).to.equal('//');
		expect(fromQiniuPath('/dir1//').parentDirectoryPath().toString()).to.equal('/dir1/');
		expect(fromQiniuPath('//dir1//').parentDirectoryPath().toString()).to.equal('//dir1/');
		expect(fromQiniuPath('dir1/dir2/dir3/file').parentDirectoryPath().toString()).to.equal('dir1/dir2/dir3/');
		expect(fromQiniuPath('/dir1/dir2/dir3/file').parentDirectoryPath().toString()).to.equal('/dir1/dir2/dir3/');
		expect(fromQiniuPath('/dir1//dir2/dir3/file').parentDirectoryPath().toString()).to.equal('/dir1//dir2/dir3/');
		expect(fromQiniuPath('//dir1/dir2/dir3/file').parentDirectoryPath().toString()).to.equal('//dir1/dir2/dir3/');
	});

	it('should join folder or file', () => {
		expect(fromQiniuPath('/').joinFile('file').toString()).to.equal('/file');
		expect(fromQiniuPath('/').joinFile('file/').toString()).to.equal('/file');
		expect(fromQiniuPath('/').joinFolder('dir').toString()).to.equal('/dir/');
		expect(fromQiniuPath('/').joinFolder('dir/').toString()).to.equal('/dir/');
	});
});

describe('fromLocalPath for UNIX', () => {
	it('should return correct basename', () => {
		expect(fromPosixPath('file').basename()).to.equal('file');
		expect(fromPosixPath('/file').basename()).to.equal('file');
		expect(fromPosixPath('dir1/').basename()).to.undefined;
		expect(fromPosixPath('/dir1/').basename()).to.undefined;
		expect(fromPosixPath('dir1/dir2/dir3/file').basename()).to.equal('file');
		expect(fromPosixPath('/dir1/dir2/dir3/file').basename()).to.equal('file');
	});

	it('should return correct directoryBasename', () => {
		expect(fromPosixPath('file').directoryBasename()).to.undefined;
		expect(fromPosixPath('/file').directoryBasename()).to.undefined;
		expect(fromPosixPath('dir1/').directoryBasename()).to.equal('dir1');
		expect(fromPosixPath('/dir1/').directoryBasename()).to.equal('dir1');
		expect(fromPosixPath('dir1/dir2/dir3/file').directoryBasename()).to.equal('dir3');
		expect(fromPosixPath('/dir1/dir2/dir3/file').directoryBasename()).to.equal('dir3');
	});

	it('should convert to correct string', () => {
		expect(fromPosixPath('file').toString()).to.equal('file');
		expect(fromPosixPath('/file').toString()).to.equal('/file');
		expect(fromPosixPath('dir1/').toString()).to.equal('dir1/');
		expect(fromPosixPath('/dir1/').toString()).to.equal('/dir1/');
		expect(fromPosixPath('dir1/dir2/dir3/file').toString()).to.equal('dir1/dir2/dir3/file');
		expect(fromPosixPath('/dir1/dir2/dir3/file').toString()).to.equal('/dir1/dir2/dir3/file');
	});

	it('should return correct parentDirectoryPath string', () => {
		expect(fromPosixPath('file').parentDirectoryPath().toString()).to.equal('');
		expect(fromPosixPath('/file').parentDirectoryPath().toString()).to.equal('/');
		expect(fromPosixPath('dir1/').parentDirectoryPath().toString()).to.equal('');
		expect(fromPosixPath('/dir1/').parentDirectoryPath().toString()).to.equal('/');
		expect(fromPosixPath('dir1/dir2/dir3/file').parentDirectoryPath().toString()).to.equal('dir1/dir2/dir3/');
		expect(fromPosixPath('/dir1/dir2/dir3/file').parentDirectoryPath().toString()).to.equal('/dir1/dir2/dir3/');
	});
});

describe('fromLocalPath for Windows', () => {
	it('should return correct basename', () => {
		expect(fromWin32Path('file').basename()).to.equal('file');
		expect(fromWin32Path('C:\\file').basename()).to.equal('file');
		expect(fromWin32Path('dir1\\').basename()).to.undefined;
		expect(fromWin32Path('C:\\dir1\\').basename()).to.undefined;
		expect(fromWin32Path('dir1\\dir2\\dir3\\file').basename()).to.equal('file');
		expect(fromWin32Path('C:\\dir1\\dir2\\dir3\\file').basename()).to.equal('file');
	});

	it('should return correct directoryBasename', () => {
		expect(fromWin32Path('file').directoryBasename()).to.undefined;
		expect(fromWin32Path('C:\\file').directoryBasename()).to.undefined;
		expect(fromWin32Path('dir1\\').directoryBasename()).to.equal('dir1');
		expect(fromWin32Path('C:\\dir1\\').directoryBasename()).to.equal('dir1');
		expect(fromWin32Path('dir1\\dir2\\dir3\\file').directoryBasename()).to.equal('dir3');
		expect(fromWin32Path('C:\\dir1\\dir2\\dir3\\file').directoryBasename()).to.equal('dir3');
	});

	it('should convert to correct string', () => {
		expect(fromWin32Path('file').toString()).to.equal('file');
		expect(fromWin32Path('C:\\file').toString()).to.equal('C:\\file');
		expect(fromWin32Path('dir1\\').toString()).to.equal('dir1\\');
		expect(fromWin32Path('C:\\dir1\\').toString()).to.equal('C:\\dir1\\');
		expect(fromWin32Path('dir1\\dir2\\dir3\\file').toString()).to.equal('dir1\\dir2\\dir3\\file');
		expect(fromWin32Path('C:\\dir1\\dir2\\dir3\\file').toString()).to.equal('C:\\dir1\\dir2\\dir3\\file');
	});

	it('should return correct parentDirectoryPath string', () => {
		expect(fromWin32Path('file').parentDirectoryPath().toString()).to.equal('');
		expect(fromWin32Path('C:\\file').parentDirectoryPath().toString()).to.equal('C:\\');
		expect(fromWin32Path('dir1\\').parentDirectoryPath().toString()).to.equal('');
		expect(fromWin32Path('C:\\dir1\\').parentDirectoryPath().toString()).to.equal('C:\\');
		expect(fromWin32Path('dir1\\dir2\\dir3\\file').parentDirectoryPath().toString()).to.equal('dir1\\dir2\\dir3\\');
		expect(fromWin32Path('C:\\dir1\\dir2\\dir3\\file').parentDirectoryPath().toString()).to.equal('C:\\dir1\\dir2\\dir3\\');
	});
});
