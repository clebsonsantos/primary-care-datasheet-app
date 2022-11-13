import { InserDataSheetValues } from './../../../src/domain/usecases/insert-data-sheet-values';
import { assert, expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import { Connector } from "../../../src/domain/contracts/gateways/connector";
import { StubbedInstance, stubInterface } from "ts-sinon";
import { right } from "../../../src/main/shared/either";

describe("InserDataSheetValues", () => {
    let sut: InserDataSheetValues
    let spreadConnector: StubbedInstance<Connector>

    before(()=> {
        spreadConnector = stubInterface<Connector>({
            insertOrUpdateValuesInWorksheet: Promise.resolve(right({ id: "any-id" }))
        })
    })
    beforeEach(() => {
        sut = new InserDataSheetValues(spreadConnector)
    })

    it("should call InserDataSheetValues and return success if data is valid", async () => {
        const result = await sut.perform({
            name: "any"
        })
        expect(result.isRight()).to.be.ok
        expect(result.isLeft()).to.be.not.ok
        result.isRight() && assert.typeOf(result.value.id, "string")
    })

})
