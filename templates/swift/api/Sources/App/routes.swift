import Vapor

func routes(_ app: Application) throws {
    let name = "{name}"

    app.get("health") { req async throws -> Response in
        let payload = [
            "status": "ok",
            "app": name,
            "uptime": ProcessInfo.processInfo.systemUptime
        ]
        let data = try JSONSerialization.data(withJSONObject: payload, options: [])
        return Response(status: .ok, headers: ["Content-Type": "application/json"], body: .init(data: data))
    }

    app.get("greet", ":name") { req async throws -> Response in
        let who = req.parameters.get("name") ?? "World"
        let payload = ["message": "Hello, \(who)!", "from": name]
        let data = try JSONSerialization.data(withJSONObject: payload, options: [.prettyPrinted])
        return Response(status: .ok, headers: ["Content-Type": "application/json"], body: .init(data: data))
    }

    app.post("echo") { req async throws -> Response in
        struct EchoBody: Content {
            let message: String?
        }
        let echo: EchoBody
        do {
            echo = try req.content.decode(EchoBody.self)
        } catch {
            let errPayload = ["error": "Invalid request body", "detail": error.localizedDescription]
            let errData = try JSONSerialization.data(withJSONObject: errPayload, options: [])
            return Response(status: .badRequest, headers: ["Content-Type": "application/json"], body: .init(data: errData))
        }
        let payload: [String: Any] = [
            "echo": echo.message ?? "",
            "app": name
        ]
        let data = try JSONSerialization.data(withJSONObject: payload, options: [.prettyPrinted])
        return Response(status: .ok, headers: ["Content-Type": "application/json"], body: .init(data: data))
    }
}
