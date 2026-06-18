import SwiftUI

struct ContentView: View {
    @State private var items = (1...20).map { Item(id: $0, title: "Item \($0)", subtitle: "Description for item \($0)") }
    @State private var searchText = ""
    @State private var showAddSheet = false

    var filteredItems: [Item] {
        guard !searchText.isEmpty else { return items }
        return items.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(filteredItems) { item in
                    NavigationLink(destination: DetailView(item: item)) {
                        ItemRow(item: item)
                    }
                }
                .onDelete(perform: deleteItems)
                .onMove(perform: moveItems)
            }
            .searchable(text: $searchText, prompt: "Search items...")
            .navigationTitle("{name}")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { EditButton() }
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { showAddSheet = true }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showAddSheet) {
                AddItemView { newItem in
                    items.append(newItem)
                }
            }
        }
    }

    private func deleteItems(at offsets: IndexSet) {
        items.remove(atOffsets: offsets)
    }

    private func moveItems(from source: IndexSet, to destination: Int) {
        items.move(fromOffsets: source, toOffset: destination)
    }
}

struct Item: Identifiable {
    let id: Int
    var title: String
    var subtitle: String
}

struct ItemRow: View {
    let item: Item

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(
                    LinearGradient(colors: [.orange, .red], startPoint: .topLeading, endPoint: .bottomTrailing)
                )
                .frame(width: 44, height: 44)
                .overlay(Text("\(item.id)").foregroundColor(.white).fontWeight(.semibold))

            VStack(alignment: .leading, spacing: 4) {
                Text(item.title).fontWeight(.semibold)
                Text(item.subtitle).font(.caption).foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}

struct DetailView: View {
    let item: Item

    var body: some View {
        VStack(spacing: 24) {
            Circle()
                .fill(
                    LinearGradient(colors: [.orange, .red], startPoint: .topLeading, endPoint: .bottomTrailing)
                )
                .frame(width: 120, height: 120)
                .overlay(Text("\(item.id)").foregroundColor(.white).font(.largeTitle).fontWeight(.bold))

            VStack(spacing: 8) {
                Text(item.title).font(.title).fontWeight(.bold)
                Text(item.subtitle).font(.body).foregroundColor(.secondary)
            }

            Spacer()
        }
        .padding()
        .navigationTitle(item.title)
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct AddItemView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var subtitle = ""
    let onSave: (Item) -> Void

    var body: some View {
        NavigationStack {
            Form {
                Section("Details") {
                    TextField("Title", text: $title)
                    TextField("Subtitle", text: $subtitle)
                }
            }
            .navigationTitle("New Item")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        let id = Int.random(in: 100...9999)
                        onSave(Item(id: id, title: title, subtitle: subtitle))
                        dismiss()
                    }
                    .disabled(title.isEmpty)
                }
            }
        }
    }
}
