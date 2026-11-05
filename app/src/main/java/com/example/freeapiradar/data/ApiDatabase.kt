package com.example.freeapiradar.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [ApiEntry::class], version = 2, exportSchema = false)
abstract class ApiDatabase : RoomDatabase() {
    abstract fun apiDao(): ApiDao
    companion object {
        @Volatile private var instance: ApiDatabase? = null
        fun get(context: Context): ApiDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(context.applicationContext, ApiDatabase::class.java, "free-api-radar.db")
                .fallbackToDestructiveMigration()
                .build()
                .also { instance = it }
        }
    }
}
