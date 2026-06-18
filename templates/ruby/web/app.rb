require "sinatra"
require "erb"
require "json"

set :port, 4567
set :bind, "0.0.0.0"

before do
  content_type :html
end

get "/" do
  @app_name = "{name}"
  @time = Time.now
  erb :index
end

get "/health" do
  content_type :json
  { status: "ok", app: "{name}", timestamp: Time.now.iso8601 }.to_json
end

get "/greet/:name" do
  @greeting = "Hello, #{params[:name]}!"
  @app_name = "{name}"
  erb :index
end

post "/echo" do
  body = request.body.read
  content_type :json
  { echo: body, app: "{name}" }.to_json
rescue JSON::ParserError => e
  halt 400, { error: "Invalid JSON", detail: e.message }.to_json
end

not_found do
  content_type :json
  { error: "Not found", app: "{name}" }.to_json
end

error do
  content_type :json
  { error: "Internal server error", app: "{name}" }.to_json
end
