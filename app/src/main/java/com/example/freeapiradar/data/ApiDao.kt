package com.example.freeapiradar.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ApiDao {
    @Query("SELECT * FROM apis ORDER BY lastSeen DESC, name COLLATE NOCASE")
    fun observeAll(): Flow<List<ApiEntry>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(items: List<ApiEntry>)

    @Query("SELECT * FROM apis WHERE id = :id LIMIT 1")
    suspend fun get(id: String): ApiEntry?

    @Query("UPDATE apis SET siteStatus = :status, statusCheckedAt = :checkedAt WHERE id = :id")
    suspend fun updateStatus(id: String, status: String, checkedAt: Long)

    @Query("SELECT COUNT(*) FROM apis")
    suspend fun count(): Int
}
