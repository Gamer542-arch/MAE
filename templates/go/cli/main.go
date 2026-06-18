package main\n\nimport (\n\t"flag"\n\t"fmt"\n)\n\nfunc main() {\n\tname := flag.String("name", "World", "Name to greet")\n\tflag.Parse()\n\tfmt.Printf("Hello, %s!\n", *name)\n}\n
