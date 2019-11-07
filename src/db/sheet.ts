
const SystemCreds = require('../../certs/client_secret.json');
import * as uuidv1 from 'uuid/v1';
import { MethodError } from '@methodus/server';
import { GoogleSpreadsheet } from '@methodus/google-spreadsheet';

export function getSheet(sheetId: string) {
    if (!SheetsCache[sheetId]) {
        SheetsCache[sheetId] = new Sheet(sheetId);
    }
    return SheetsCache[sheetId];
}
class SheetsCache {
    public static collection: any;
}
export class Sheet {
    private sheets: any = {};
    private maps: any = {};
    private sheetsWithMeta: any = {};
    private info: any;
    private doc: any;

    constructor(sheetid: string, ) {
        this.doc = new GoogleSpreadsheet(sheetid);

    }
    public async handleHeader(dataObject, sheet) {
        const finalObject: any = {};
        Object.keys(dataObject).forEach((key) => {
            finalObject[key] = dataObject[key];
        });



        const headerRow = await this.doc.worksheets[sheet].getHeaderRow({});
        const existingFields = headerRow.data || [];
        Object.keys(finalObject).forEach((key) => {
            if (existingFields.indexOf(key) === -1) {
                existingFields.push(key);
            }
        });
        return [finalObject, existingFields];
    }
    public async insert(sheet: number = 0, dataObject: any) {
        // Authenticate with the Google Spreadsheets API.

        await this.doc.useServiceAccountAuth(SystemCreds);
        const info = await this.doc.getInfo();
        if (!info.worksheets[sheet]) {
            const sheet = await this.doc.addWorksheet({
                title: 'my new sheet'
            });
            info.worksheets[sheet] = sheet;
        }
        const [finalObject, existingFields] = await this.handleHeader(dataObject, sheet);

        if (existingFields.indexOf('keyid') === -1) {
            existingFields.push('keyid');
        }
        finalObject.keyid = uuidv1();
        // await info.worksheets[sheet].setHeaderRow(existingFields);

        await info.worksheets[sheet].addRow(finalObject, existingFields);
        this.sheets[sheet] = null;
        return finalObject;
    }

    public async delete(dataObject: any, sheet: number = 0) {
        await this.doc.useServiceAccountAuth(SystemCreds);
        const info = await this.doc.getInfo();
        const headerRow = await this.doc.worksheets[sheet].getRows({
            query: `keyid = "${dataObject.keyid}"`
        });
        if (headerRow && headerRow.length > 0) {
            await headerRow[0].del();
        }
        return headerRow;
    }

    public async update(dataObject: any, sheet: number = 0) {

        await this.doc.useServiceAccountAuth(SystemCreds);
        const info = await this.doc.getInfo();
        const [finalObject, existingFields] = await this.handleHeader(dataObject, sheet);

        // Authenticate with the Google Spreadsheets API.
        const row = this.sheets[sheet].filter((rowData) => {
            return rowData.data['keyid'] === dataObject['keyid'];
        });
        Object.assign(row[0], dataObject);

        await this.doc.worksheets[sheet].updateRow(row[0].index, finalObject, existingFields)

        //   await row[0].save(finalObject, existingFields);







        // await this.doc.worksheets[sheet].getRows({
        //     query: `keyid = "${dataObject.keyid}"`,
        // }, (err, headerRow: any) => {
        //     if (err) {
        //         return reject(err);
        //     }

        //     debugger;
        //     const existingFields = (headerRow.length > 0) ? Object.keys(headerRow[0]).filter((key) => {
        //         return nonHeader.indexOf(key) === -1
        //     }) : [];
        //     Object.keys(finalObject).forEach((key) => {
        //         if (existingFields.indexOf(key) === -1) {
        //             existingFields.push(key);
        //         }
        //     });

        //     info.worksheets[sheet].setHeaderRow(existingFields, (err, headerResult) => {
        //         Object.assign(headerRow[0], dataObject);
        //         headerRow[0].save();
        //         return resolve(finalObject);
        //     });

        // });


        return true;
    }



    public async updateBy(dataObject: any, filterStr, sheet: number = 0) {
        // Authenticate with the Google Spreadsheets API.

        await this.doc.useServiceAccountAuth(SystemCreds);

        const finalObject = {};
        Object.values((dataObject as any).odm.fields).forEach((field: any) => {
            finalObject[field.propertyKey] = dataObject[field.propertyKey];
            if (field.type === 'String' && finalObject[field.propertyKey].indexOf(`'`) !== 0) {
                finalObject[field.propertyKey] = `'${finalObject[field.propertyKey]}`;
            }
        });



        const info = await this.doc.getInfo();


        const nonHeader = [
            '_xml',
            'id',
            'app:edited',
            '_links',
            'save',
            'del'
        ];

        const headerRow = await this.doc.worksheets[sheet].getRows({
            query: filterStr,
        });



        Object.assign(headerRow[0], dataObject);
        headerRow[0].save();

        const existingFields = (headerRow.length > 0) ? Object.keys(headerRow[0]).filter((key) => {
            return nonHeader.indexOf(key) === -1
        }) : [];
        Object.keys(finalObject).forEach((key) => {
            if (existingFields.indexOf(key) === -1) {
                existingFields.push(key);
            }
        });


        return finalObject;
    }

    private _clean(data) {
        if (data) {
            data.forEach(element => {
                delete element.id;
                delete element._xml;
                delete element['app:edited'];
                delete element._links;
            });
        }
        return data;
    }
    public errorHandler(error, reject) {
        if (error.message.indexOf('Error: HTTP error 403 (Forbidden) ') > -1) {
            return reject(new MethodError(error.message, 403));
        }
    }
    public async query(sheet: number, query?: Function, page: number = 1, pageSize: number = 10, sorts?) {
        if (!this.sheets[sheet]) {


            let reverse = false;
            let sortField = 'id';
            if (sorts && sorts.length > 0) {
                reverse = sorts[0].sort !== 'asc';
                sortField = sorts[0].colId;
            }
            try {
                // Authenticate with the Google Spreadsheets API.
                await this.doc.useServiceAccountAuth(SystemCreds);
                const info = await this.doc.getInfo();
                //this.errorHandler(err, reject);
                const data = await this.doc.worksheets[sheet].getRows({

                    // offset: ((page - 1) * pageSize),
                    // limit: pageSize,
                    // orderby: sortField,
                    // reverse
                });
                this.info = info;
                this.sheets[sheet] = data;// data.map((d: any, index: number) => { return Object.assign({}, d.data, { _index: index + 1 }); });

            } catch (error) {
                throw error;
            }
        }



        if (query) {
            if (this.sheets[sheet]) {
                console.warn(query);
                console.warn(this.sheets[sheet].length);
                return { info: this.info, data: this.sheets[sheet].map((d: any) => { return Object.assign({}, d.data); }).filter(query) };

            } else {
                return { info: this.info, data: [] };
            }
        } else {
            return { info: this.info, data: this.sheets[sheet].map((d: any) => { return Object.assign({}, d.data); }) };

        }
    }
}