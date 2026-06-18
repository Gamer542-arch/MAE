// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "{name}",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    dependencies: [],
    targets: [
        .executableTarget(
            name: "{name}",
            path: ".",
            exclude: ["Package.swift"]
        )
    ]
)
