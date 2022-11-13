import { ChangeDataSheetValues } from './../../../src/domain/usecases/change-data-sheet-values';
import { assert, expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import { Connector } from "../../../src/domain/contracts/gateways/connector";
import { StubbedInstance, stubInterface } from "ts-sinon";
import { left, right } from "../../../src/main/shared/either";
import { InternalServerError } from "../../../src/infra/errors/internal-server-error";

describe("ChangeDataSheetValues", () => {
    let sut: ChangeDataSheetValues
    let spreadConnector: StubbedInstance<Connector>

    before(()=> {
        spreadConnector = stubInterface<Connector>({
            loadValuesInDataSheet: Promise.resolve(right([]))
        })
    })
    beforeEach(() => {
        sut = new ChangeDataSheetValues(spreadConnector)
    })

    it("should call ChangeDataSheetValues and return success", async () => {
        const result = await sut.perform()
        expect(result.isRight()).to.be.ok
        expect(result.isLeft()).to.be.not.ok
        result.isRight() && assert.instanceOf(result.value, Array)
    })

    it("should call ChangeDataSheetValues and return error if Internal server Error", async () => {
        const internalError = new InternalServerError(new Error("internal server error"))
        spreadConnector.loadValuesInDataSheet.resolves(left(internalError))

        const result = await sut.perform()
        expect(result.isLeft()).to.be.ok
        expect(result.isRight()).to.be.not.ok
        result.isLeft() && assert.typeOf(result.value, "string")
    })

})
