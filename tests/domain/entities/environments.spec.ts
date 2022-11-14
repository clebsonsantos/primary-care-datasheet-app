import { Environments } from "./../../../src/domain/entities/environments";
import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";


describe("Environments", () => {
let data: Omit<Environments, "getValue" | "isValid" | "setFieldsHeader" | "setI18n">
    beforeEach(() => {
        data = {
            spreadsheetsId: "environmentFake",
            googleCrendentials: {
                test: "test"
            },
            fieldsHeader: ["test", "test"],
            spreadSheetPageName: "Test",
            urlApiConnector: "https://api-test.ts"
        }
    })

    it("should be able returns valid instace of Environment", () => {
        const environment = new Environments(data);
        expect(environment.isValid()).to.be.ok
        expect(environment.getValue()).to.be.deep.equal(data)
    })

    it("should be able returns invalid instace of Environment", () => {
        const environment = Environments.empty()
        expect(environment.isValid()).to.be.not.ok
    })

    it("should be able returns valid instace of Environment if setFieldsHeader calling", () => {
        const environment = new Environments(data)
        const env = environment.setFieldsHeader(["test", "test"])
        expect(env.isValid()).to.be.ok
    })

    it("should be able to assign new values to i18n when setI18n is called", () => {
        const environment = new Environments(data)
        const label = {
            any_label: "any_label"
        }
        environment.setI18n(label)
        expect(environment.isValid()).to.be.ok
        expect(environment.i18n).to.be.deep.equal(label)
    })
})
