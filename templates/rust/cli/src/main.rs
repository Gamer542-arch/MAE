use std::env;\n\nfn main() {\n    let args: Vec<String> = env::args().collect();\n    let name = args.get(1).map(|s| s.as_str()).unwrap_or("World");\n    println!("Hello, {}!", name);\n}\n
