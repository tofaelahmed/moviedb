import { TestBed } from "@angular/core/testing";

import { CookieService } from "./cookie.service";

describe("CookieServiceService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: CookieService = TestBed.get(CookieService);
    expect(service).toBeTruthy();
  });
});
