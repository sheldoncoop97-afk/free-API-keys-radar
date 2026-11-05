package com.example.freeapiradar.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "apis")
data class ApiEntry(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val category: String,
    val auth: String,
    val https: String,
    val docsUrl: String,
    val source: String,
    val firstSeen: Long,
    val lastSeen: Long,
    val siteStatus: String = "Not checked",
    val statusCheckedAt: Long = 0L,
    val tags: String = "AI,API,Free",
    val rateLimit: String = "Free Tier",
    val responseExample: String = """{
  "status": "success",
  "data": {
    "message": "Connection established with Free API node"
  }
}"""
) {
    val needsKey: Boolean get() = auth.isNotBlank() && !auth.equals("No", true) && !auth.equals("None", true) && !auth.contains("No key", true)
    fun tagList(): List<String> = tags.split(",").map { it.trim() }.filter { it.isNotEmpty() }
}
