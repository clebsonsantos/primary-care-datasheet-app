import { SpreadSheetConnector } from './../../../src/infra/gateways/spreadsheets-connector';
import { Connector } from './../../../src/domain/contracts/gateways/connector';
import { IHttp, RequestMethod } from '@rocket.chat/apps-engine/definition/accessors';
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { StubbedInstance, stubInterface } from "ts-sinon";
import { Environments } from "../../../src/domain/entities/environments";
import { InternalServerError } from "../../../src/infra/errors/internal-server-error";

describe("SpreadSheetConnector", () => {
    let sut: Connector
    let httpClient: StubbedInstance<IHttp>
    let environments: Environments
    let urlConnector: string

    beforeEach(() => {
        httpClient = stubInterface<IHttp>()
        urlConnector = "http://any-api-connector.com"
        environments = new Environments({
            fieldsHeader: ["test", "test"],
            googleCrendentials: {
                any: "value",
            },
            spreadSheetPageName: "pageName",
            spreadsheetsId: "spreadsheetId",
            urlApiConnector: urlConnector
        })

        sut = new SpreadSheetConnector(environments, httpClient)
        httpClient.post.reset()
    })

    describe("loadValuesInDataSheet", () => {
        it("should be return any array with data sheet if success", async () => {
            httpClient.post.resolves({ statusCode: 200, method: RequestMethod.POST, url: urlConnector, data: [] })

            const result = await sut.loadValuesInDataSheet()

            expect(result.isRight()).to.be.ok
            result.isRight() && assert.instanceOf(result.value, Array)
        })

        it("should return InternalServerError if statusCode is different 200", async () => {
            httpClient.post.resolves( { statusCode: 400, data: {}, method: RequestMethod.POST, url:urlConnector })

            const result = await sut.loadValuesInDataSheet()

            expect(result.isLeft()).to.be.ok
            result.isLeft() && assert.instanceOf(result.value, InternalServerError)
        })

        it("should be return InternalServerError if internal server error", async () => {
            const error = new Error("internal_server_error")
            httpClient.post.rejects(error)


            const result = await sut.loadValuesInDataSheet()

            expect(result.isLeft()).to.be.ok
            result.isLeft() && assert.instanceOf(result.value, InternalServerError)
        })
    })

    describe("insertOrUpdateValuesInWorksheet", () => {
        it("should be return any id if the data is entered successfully", async () => {
            httpClient.post.resolves({ statusCode: 200, method: RequestMethod.POST, url: urlConnector, data: { id: "any-id" } })

            const result = await sut.insertOrUpdateValuesInWorksheet({
                values: {}
            })

            expect(result.isRight()).to.be.ok
            result.isRight() && assert.typeOf(result.value, "string")
        })

        it("should return InternalServerError if statusCode is different 200", async () => {
            httpClient.post.resolves( { statusCode: 400, data: {}, method: RequestMethod.POST, url:urlConnector })

            const result = await sut.insertOrUpdateValuesInWorksheet({
                values: {}
            })

            expect(result.isLeft()).to.be.ok
            result.isLeft() && assert.instanceOf(result.value, InternalServerError)
        })

        it("should be return InternalServerError if internal server error", async () => {
            const error = new Error("internal_server_error")
            httpClient.post.rejects(error)


            const result = await sut.insertOrUpdateValuesInWorksheet({
                values: {}
            })

            expect(result.isLeft()).to.be.ok
            result.isLeft() && assert.instanceOf(result.value, InternalServerError)
        })
    })

})
