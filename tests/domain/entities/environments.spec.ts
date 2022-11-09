import { Environments } from "./../../../src/domain/entities/environments";
import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";


describe("Environments", () => {
let data: Omit<Environments, "getValue" | "isValid">
    beforeEach(() => {
        data = {
            spreadsheetsId: "environmentFake",
            googleCrendentials: {
                test: "test"
            },
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
})
