import { LocalStorageAbstract } from "./local-storage-abstract";

describe("LocalStorageAbstract", () => {
  it("should create an instance", () => {
    expect(new LocalStorageAbstract()).toBeTruthy();
  });
});
