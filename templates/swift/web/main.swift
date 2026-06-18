import FoundationNetworking

let name = "{name}"
let port = 8080

func handleConnection(_ client: Socket) {
    defer { close(client.rawFileDescriptor) }

    var buffer = [UInt8](repeating: 0, count: 4096)
    let bytesRead = read(client.rawFileDescriptor, &buffer, buffer.count)
    guard bytesRead > 0 else { return }

    let request = String(decoding: buffer[..<bytesRead], as: UTF8.self)

    let body: String
    let contentType: String
    let statusLine: String

    if request.hasPrefix("GET /health") {
        statusLine = "HTTP/1.1 200 OK"
        contentType = "application/json"
        body = "{\"status\":\"ok\",\"app\":\"\(name)\"}"
    } else if request.hasPrefix("GET /") {
        statusLine = "HTTP/1.1 200 OK"
        contentType = "text/html"
        body = """
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><title>\(name)</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, sans-serif; background: #0d0d0d; color: #e0dcd7; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          h1 { background: linear-gradient(135deg, #fab283, #fc533a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 3rem; }
        </style></head>
        <body><h1>\(name)</h1></body>
        </html>
        """
    } else {
        statusLine = "HTTP/1.1 404 Not Found"
        contentType = "text/plain"
        body = "Not Found"
    }

    let response = "\(statusLine)\r\nContent-Type: \(contentType)\r\nContent-Length: \(body.utf8.count)\r\nConnection: close\r\n\r\n\(body)"
    _ = response.withCString { ptr in
        write(client.rawFileDescriptor, ptr, response.utf8.count)
    }
}

func startServer() {
    let sock = socket(AF_INET, SOCK_STREAM, 0)
    guard sock >= 0 else {
        fputs("Failed to create socket\n", stderr)
        return
    }

    var opt: Int32 = 1
    setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &opt, socklen_t(MemoryLayout<Int32>.size))

    var addr = sockaddr_in()
    addr.sin_family = sa_family_t(AF_INET)
    addr.sin_port = CFSwapInt16HostToBig(UInt16(port))
    addr.sin_addr = in_addr(s_addr: INADDR_ANY)
    _ = withUnsafePointer(to: &addr) {
        $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
            bind(sock, $0, socklen_t(MemoryLayout<sockaddr_in>.size))
        }
    }

    listen(sock, 5)
    print("\(name) running on http://0.0.0.0:\(port)")

    while true {
        var clientAddr = sockaddr()
        var clientLen = socklen_t(MemoryLayout<sockaddr>.size)
        let client = accept(sock, &clientAddr, &clientLen)
        guard client >= 0 else {
            perror("accept")
            continue
        }
        handleConnection(client)
    }

    close(sock)
}

startServer()
