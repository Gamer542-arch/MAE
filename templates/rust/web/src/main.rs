use axum::{
    extract::Path,
    http::StatusCode,
    response::IntoResponse,
    routing::{delete, get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

type Db = Arc<RwLock<HashMap<u64, Item>>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Item {
    id: u64,
    name: String,
}

#[derive(Debug, Deserialize)]
struct CreateItem {
    name: String,
}

async fn list_items(db: Db) -> impl IntoResponse {
    let items = db.read().await;
    let result: Vec<Item> = items.values().cloned().collect();
    Json(result)
}

async fn create_item(db: Db, Json(payload): Json<CreateItem>) -> impl IntoResponse {
    if payload.name.trim().is_empty() {
        return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "name is required"})));
    }

    let mut items = db.write().await;
    let id = items.len() as u64 + 1;
    let item = Item {
        id,
        name: payload.name,
    };
    items.insert(id, item.clone());
    (StatusCode::CREATED, Json(item))
}

async fn get_item(db: Db, Path(id): Path<u64>) -> impl IntoResponse {
    let items = db.read().await;
    match items.get(&id) {
        Some(item) => (StatusCode::OK, Json(serde_json::json!(item))).into_response(),
        None => (StatusCode::NOT_FOUND, Json(serde_json::json!({"error": "item not found"}))).into_response(),
    }
}

async fn delete_item(db: Db, Path(id): Path<u64>) -> impl IntoResponse {
    let mut items = db.write().await;
    if items.remove(&id).is_some() {
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let db: Db = Arc::new(RwLock::new(HashMap::new()));

    let app = Router::new()
        .route("/api/items", get(list_items).post(create_item))
        .route("/api/items/{id}", get(get_item).delete(delete_item))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .with_state(db);

    let addr = "0.0.0.0:8080";
    tracing::info!("{name} listening on {addr}");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
