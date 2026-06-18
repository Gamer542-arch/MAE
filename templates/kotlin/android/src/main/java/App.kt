package com.{name}

import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class App : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var statusText: TextView
    private lateinit var adapter: ItemAdapter

    private val scope = CoroutineScope(Dispatchers.Main)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        recyclerView = findViewById(R.id.recyclerView)
        progressBar = findViewById(R.id.progressBar)
        statusText = findViewById(R.id.statusText)

        adapter = ItemAdapter()
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter

        findViewById<FloatingActionButton>(R.id.fabRefresh).setOnClickListener {
            loadData()
        }

        loadData()
    }

    private fun loadData() {
        statusText.visibility = View.GONE
        progressBar.visibility = View.VISIBLE

        scope.launch {
            val result = fetchFromApi()
            progressBar.visibility = View.GONE
            result.onSuccess { data ->
                adapter.submitList(data)
                statusText.text = "Loaded ${data.size} items"
                statusText.visibility = View.VISIBLE
            }.onFailure { error ->
                statusText.text = "Error: ${error.message}"
                statusText.visibility = View.VISIBLE
                Toast.makeText(this@App, "Failed to load data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private suspend fun fetchFromApi(): Result<List<String>> = withContext(Dispatchers.IO) {
        try {
            val url = URL("https://api.example.com/items")
            val connection = url.openConnection() as HttpURLConnection
            connection.connectTimeout = 10000
            connection.readTimeout = 10000

            if (connection.responseCode != HttpURLConnection.HTTP_OK) {
                return@withContext Result.failure(
                    Exception("Server returned ${connection.responseCode}")
                )
            }

            val reader = BufferedReader(InputStreamReader(connection.inputStream))
            val response = reader.readText()
            reader.close()
            connection.disconnect()

            Result.success(listOf(response))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
