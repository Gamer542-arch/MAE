import Vapor

@main
struct App {
    static func main() async throws {
        var env = try Environment.detect()
        try LoggingSystem.bootstrap(from: &env)

        let app = Application(env)
        defer { app.shutdown() }

        app.http.server.configuration.hostname = "0.0.0.0"
        app.http.server.configuration.port = 8080

        try configure(app)
        try app.run()
    }
}

func configure(_ app: Application) throws {
    app.middleware.use(ErrorMiddleware.default(environment: app.environment))

    let name = "{name}"

    app.get { req async throws -> Response in
        let payload = [
            "app": name,
            "status": "running",
            "version": "1.0.0"
        ]
        let data = try JSONSerialization.data(withJSONObject: payload, options: [.prettyPrinted])
        return Response(status: .ok, headers: ["Content-Type": "application/json"], body: .init(data: data))
    }

    try routes(app)
}
