import { PROJECT_INFO_FILE } from '../constants/core';
import { encodeProject } from './urlParser';
import { dialog } from 'electron';
import { parse as parsePath, join as joinPaths } from 'path';
import fs from 'fs';
import eosp from 'end-of-stream-promise';
import pumpify from 'pumpify';

export default class Project {
  static async load(key, Hyperdrive, db) {
    const project = new Project(key, Hyperdrive, db);

    await project.init();

    return project;
  }

  constructor(key, Hyperdrive, db) {
    this.key = key;
    this.Hyperdrive = Hyperdrive;
    this.db = db;
  }

  get url() {
    return encodeProject(this.archive.key);
  }

  async init() {
    this.archive = this.Hyperdrive(this.key);

    await this.archive.ready();
  }

  async getInfo() {
  	const key = this.key.toString('hex')
  	try {
      const raw = await this.archive.readFile(PROJECT_INFO_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      const final = {title: key, ...parsed, key}
      return parsed;
	} catch(e) {
		return {title: key, key}
	}
  }

  async updateInfo(info) {
    const existing = await this.getInfo();

    const updated = { ...existing, ...info };

    const stringified = JSON.stringify(updated, null, '\t');

    await this.archive.writeFile(PROJECT_INFO_FILE, stringified);

    return updated;
  }

  async showSaveFile(path) {
		const {base : defaultPath} = parsePath(path)
		const {canceled, filePath} = await dalog.showSaveDialog({
			defaultPath
		})

		if(canceled) throw new Error('Cancelled file save')

		const readStream = this.archive.createReadStream(path)
		const writeStream = fs.createWriteStream(filePath)

		await eosp(pumpify(readStream, writeStream))

		return {
			filePath
		}
  }

  async showLoadFile(basePath='/') {
		const {cancelled, filePaths} = await dialog.showOpenDialog()

		// If they cancelled, whatever
		if(canceled) return {filePaths: []}

		for(let filePath of filePaths) {
			const {base: fileName} = parsePath(filePath)

			const destination = joinPaths(basePath, fileName)

			const writeStream = this.archive.createWriteStream(destination)
			const readStream = fs.createReadStream(filePath)

			await eosp(pumpify(readStream, writeStream))
		}

		return {
			filePaths
		}
  }
}
