require "sinatra"\n\nget "/" do\n  content_type :json\n  { message: "Hello from {name}!" }.to_json\nend\n
