# frozen_string_literal: true

require "thor"

module GemName
  class CLI < Thor
    desc "greet [NAME]", "Greet someone"
    option :times, type: :numeric, default: 1, desc: "How many times to greet"
    def greet(name = "World")
      greeter = Greeter.new
      greeter.repeat(greeter.greet(name), options[:times]).each { |msg| puts msg }
    end

    desc "info", "Show gem information"
    def info
      Greeter.info.each { |k, v| puts "#{k}: #{v}" }
    end

    desc "version", "Show version"
    def version
      puts "{name} v#{GemName::VERSION}"
    end
  end
end
