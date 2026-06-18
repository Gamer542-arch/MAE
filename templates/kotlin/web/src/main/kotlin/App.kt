import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import java.util.concurrent.ConcurrentHashMap
import java.util.UUID

@Serializable
data class Item(
    val id: String,
    val name: String,
    val description: String,
    val price: Double
)

@Serializable
data class CreateItemRequest(
    val name: String,
    val description: String,
    val price: Double
)

object ItemRepository {
    private val items = ConcurrentHashMap<String, Item>()

    init {
        val id = UUID.randomUUID().toString()
        items[id] = Item(id, "Sample Item", "This is a starter item for {name}", 19.99)
    }

    fun findAll(): List<Item> = items.values.toList()

    fun findById(id: String): Item? = items[id]

    fun create(request: CreateItemRequest): Item {
        val id = UUID.randomUUID().toString()
        val item = Item(id, request.name, request.description, request.price)
        items[id] = item
        return item
    }

    fun delete(id: String): Boolean = items.remove(id) != null
}

fun main() {
    embeddedServer(Netty, port = 3000) {
        install(ContentNegotiation) { json() }
        install(CORS) {
            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Delete)
            allowHeader(HttpHeaders.ContentType)
            anyHost()
        }
        routing {
            get("/") {
                call.respond(mapOf("service" to "{name} API", "version" to "1.0.0"))
            }
            get("/items") {
                call.respond(ItemRepository.findAll())
            }
            get("/items/{id}") {
                val id = call.parameters["id"] ?: return@get call.respondText(
                    "Missing id", status = HttpStatusCode.BadRequest
                )
                val item = ItemRepository.findById(id)
                if (item == null) {
                    call.respondText("Item not found", status = HttpStatusCode.NotFound)
                } else {
                    call.respond(item)
                }
            }
            post("/items") {
                val request = try {
                    call.receive<CreateItemRequest>()
                } catch (e: Exception) {
                    return@post call.respondText(
                        "Invalid request body", status = HttpStatusCode.BadRequest
                    )
                }
                if (request.name.isBlank()) {
                    return@post call.respondText(
                        "Name is required", status = HttpStatusCode.BadRequest
                    )
                }
                if (request.price < 0) {
                    return@post call.respondText(
                        "Price cannot be negative", status = HttpStatusCode.BadRequest
                    )
                }
                val item = ItemRepository.create(request)
                call.respond(HttpStatusCode.Created, item)
            }
            delete("/items/{id}") {
                val id = call.parameters["id"] ?: return@delete call.respondText(
                    "Missing id", status = HttpStatusCode.BadRequest
                )
                if (ItemRepository.delete(id)) {
                    call.respondText("Deleted", status = HttpStatusCode.OK)
                } else {
                    call.respondText("Item not found", status = HttpStatusCode.NotFound)
                }
            }
        }
    }.start(wait = true)
}
