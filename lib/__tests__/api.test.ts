import { ApiError, apiRequest, setUnauthorizedHandler } from "@/lib/api"

const mockFetch = jest.fn()
beforeEach(() => {
  mockFetch.mockReset()
  globalThis.fetch = mockFetch as unknown as typeof fetch
  setUnauthorizedHandler(null)
})

const json = (status: number, body: unknown) =>
  ({ ok: status < 400, status, json: async () => body }) as Response

describe("apiRequest", () => {
  it("sends the bearer token and JSON body", async () => {
    mockFetch.mockResolvedValue(json(200, { ok: true }))
    await apiRequest("/x", { method: "POST", body: { a: 1 }, token: "t" })
    const [, init] = mockFetch.mock.calls[0]
    expect(init.headers).toEqual({ "Content-Type": "application/json", Authorization: "Bearer t" })
    expect(init.body).toBe('{"a":1}')
  })

  it("returns null for 204", async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 204 } as Response)
    await expect(apiRequest("/x", { method: "DELETE", token: "t" })).resolves.toBeNull()
  })

  it("throws ApiError with the server message", async () => {
    mockFetch.mockResolvedValue(json(409, { error: "Email taken" }))
    await expect(apiRequest("/x")).rejects.toMatchObject({ status: 409, message: "Email taken" })
  })

  it("calls the unauthorized handler only for authenticated 401s", async () => {
    const handler = jest.fn()
    setUnauthorizedHandler(handler)
    mockFetch.mockResolvedValue(json(401, { error: "Invalid credentials" }))

    await expect(apiRequest("/auth/login", { method: "POST", body: {} })).rejects.toBeInstanceOf(ApiError)
    expect(handler).not.toHaveBeenCalled()

    await expect(apiRequest("/accounts", { token: "expired" })).rejects.toBeInstanceOf(ApiError)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it("turns a network failure into a friendly ApiError", async () => {
    mockFetch.mockRejectedValue(new TypeError("Network request failed"))
    await expect(apiRequest("/x")).rejects.toMatchObject({ status: 0 })
  })
})
