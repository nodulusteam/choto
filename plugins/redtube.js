"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require("fetch");
const base_1 = require("./base");
class RedTube extends base_1.Plugin {
    constructor() {
        super();
        this.url = 'https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&search=${keyword}&thumbsize=medium';
    }
    search(term) {
        return new Promise((resolve, reject) => {
            this.url = this.url.replace('${keyword}', term);
            fetch.fetchUrl(this.url, (error, meta, body) => {
                try {
                    const returnValue = JSON.parse(body.toString());
                    resolve(returnValue);
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    format(results) {
        let html = ``;
        const element = this.draw(results.videos).video;
        html += `<a href="${element.url}">${element.title}</a>`;
        return html;
    }
}
exports.RedTube = RedTube;
//# sourceMappingURL=redtube.js.map