require_relative "lib/gem_name/version"

Gem::Specification.new do |spec|
  spec.name = "{name}"
  spec.version = GemName::VERSION
  spec.authors = ["{name} author"]
  spec.email = ["author@example.com"]

  spec.summary = "A short summary of {name}."
  spec.description = "A longer description of what {name} does."
  spec.homepage = "https://example.com/#{spec.name}"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 3.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/example/#{spec.name}"
  spec.metadata["changelog_uri"] = "https://github.com/example/#{spec.name}/blob/main/CHANGELOG.md"

  spec.files = Dir["lib/**/*.rb"] + ["README.md", "LICENSE"]
  spec.bindir = "exe"
  spec.executables = ["{name}"]
  spec.require_paths = ["lib"]

  spec.add_dependency "thor", "~> 1.2"
end
