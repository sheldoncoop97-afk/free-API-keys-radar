package com.example.freeapiradar.worker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.freeapiradar.R
import com.example.freeapiradar.data.ApiRepository

class ScanWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result = try {
        val repo = ApiRepository(applicationContext)
        val added = repo.scan()
        if (added > 0) {
            notifyResult(
                title = "New free API available!",
                text = "New free AI sources ($added new) have been added to the database."
            )
        }
        Result.success()
    } catch (_: Exception) { Result.retry() }

    private fun notifyResult(title: String, text: String) {
        val manager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= 26) {
            val channel = NotificationChannel(
                "api_radar",
                "Free API Radar",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Umbrella Corporation Free API Radar alerts"
            }
            manager.createNotificationChannel(channel)
        }
        val notification = NotificationCompat.Builder(applicationContext, "api_radar")
            .setSmallIcon(R.drawable.notification_icon)
            .setContentTitle(title)
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setAutoCancel(true)
            .build()
        try {
            manager.notify(1201, notification)
        } catch (_: SecurityException) { }
    }
}
