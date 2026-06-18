# frozen_string_literal: true

require_relative "gem_name/version"
require_relative "gem_name/cli"

module GemName
  class Error < StandardError; end

  class Greeter
    attr_reader :name

    def initialize(name = "{name}")
      @name = name
    end

    def greet(who = "World")
      "Hello, #{who}! From #{@name} v#{VERSION}"
    end

    def repeat(message, times = 1)
      raise ArgumentError, "times must be positive" unless times.positive?

      Array.new(times) { message }
    end

    def self.info
      {
        name: "{name}",
        version: VERSION,
        ruby: RUBY_VERSION,
        platform: RUBY_PLATFORM
      }
    end
  end
end
