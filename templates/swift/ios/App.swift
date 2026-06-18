import SwiftUI

@main
struct App: SwiftUI.App {
    @State private var showSplash = true

    var body: some Scene {
        WindowGroup {
            if showSplash {
                SplashView()
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                            withAnimation { showSplash = false }
                        }
                    }
            } else {
                ContentView()
            }
        }
    }
}

struct SplashView: View {
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(spacing: 16) {
                Image(systemName: "sparkles")
                    .font(.system(size: 64))
                    .foregroundStyle(
                        LinearGradient(colors: [.orange, .red], startPoint: .leading, endPoint: .trailing)
                    )
                Text("{name}")
                    .font(.title).bold()
                    .foregroundStyle(
                        LinearGradient(colors: [Color(red: 0.98, green: 0.7, blue: 0.51), Color(red: 0.99, green: 0.33, blue: 0.23)], startPoint: .leading, endPoint: .trailing)
                    )
            }
        }
    }
}
