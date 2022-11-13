import { ChangeDataSheetValues } from './../../../src/domain/usecases/change-data-sheet-values';
import { assert, expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import { Connector } from "../../../src/domain/contracts/gateways/connector";
import { StubbedInstance, stubInterface } from "ts-sinon";
import { right } from "../../../src/main/shared/either";

describe("ChangeDataSheetValues", () => {
    let sut: ChangeDataSheetValues
    let spreadConnector: StubbedInstance<Connector>

    beforeEach(() => {
        spreadConnector = stubInterface<Connector>({
            loadValuesInDataSheet: new Promise(resolve => resolve(right([])))
        })
        sut = new ChangeDataSheetValues(spreadConnector)
    })

    it("should call ChangeDataSheetValues and return success", async () => {
        const result = await sut.perform()
        expect(result.isRight()).to.be.ok
        expect(result.isLeft()).to.be.not.ok
        result.isRight() && assert.instanceOf(result.value, Array)
    })

})
