package com.example.freeapiradar

import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.work.*
import com.example.freeapiradar.data.ApiEntry
import com.example.freeapiradar.data.ApiRepository
import com.example.freeapiradar.worker.ScanWorker
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.Locale
import java.util.concurrent.TimeUnit

val UmbrellaRed = Color(0xFFE50914)
val UmbrellaRedGlow = Color(0xFFFF2A42)
val UmbrellaDarkRed = Color(0xFF8A0614)
val UmbrellaBlack = Color(0xFF090A0D)
val UmbrellaDarkBg = Color(0xFF0F1116)
val UmbrellaPanel = Color(0xFF161820)
val UmbrellaCard = Color(0xFF1E212B)
val UmbrellaWhite = Color(0xFFF4F4F6)
val UmbrellaGray = Color(0xFF8E93A0)
val UmbrellaGold = Color(0xFFFFD700)
val UmbrellaGreen = Color(0xFF00E676)

class MainActivity : ComponentActivity() {
    private val notificationPermission = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }
    private var tts: TextToSpeech? = null
    private var introPlayer: MediaPlayer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        schedulePeriodicScan()

        if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            notificationPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
        }

        tts = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                tts?.language = Locale.US
            }
        }

        setContent {
            val darkColors = darkColorScheme(
                primary = UmbrellaRed,
                onPrimary = Color.White,
                background = UmbrellaBlack,
                onBackground = UmbrellaWhite,
                surface = UmbrellaPanel,
                onSurface = UmbrellaWhite,
                secondary = UmbrellaRedGlow,
                outline = Color(0xFF434752)
            )

            MaterialTheme(colorScheme = darkColors) {
                Surface(Modifier.fillMaxSize(), color = UmbrellaBlack) {
                    var showSplash by remember { mutableStateOf(true) }

                    LaunchedEffect(Unit) {
                        try {
                            introPlayer = MediaPlayer.create(this@MainActivity, R.raw.umbrella_intro)
                            introPlayer?.start()
                        } catch (_: Exception) { }

                        delay(6500)
                        showSplash = false
                        introPlayer?.let { if (it.isPlaying) it.pause(); it.seekTo(0) }
                    }

                    Box(Modifier.fillMaxSize()) {
                        UmbrellaMainApp(
                            repo = ApiRepository(applicationContext),
                            onScan = ::runScan,
                            openWebsite = ::openWebsite,
                            onExit = { finish() }
                        )

                        AnimatedVisibility(
                            visible = showSplash,
                            enter = fadeIn(tween(300)),
                            exit = fadeOut(tween(800))
                        ) {
                            UmbrellaSplash4Phase(
                                onSkip = {
                                    showSplash = false
                                    introPlayer?.let { if (it.isPlaying) it.pause(); it.seekTo(0) }
                                },
                                onVoiceTrigger = {
                                    try {
                                        tts?.speak("Welcome to Umbrella Corporation.", TextToSpeech.QUEUE_FLUSH, null, "umbrella_intro")
                                    } catch (_: Exception) {}
                                }
                            )
                        }
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        introPlayer?.run { if (isPlaying) stop(); release() }
        tts?.stop(); tts?.shutdown()
        super.onDestroy()
    }

    private fun openWebsite(url: String) {
        try {
            val uri = Uri.parse(url.trim())
            if (uri.scheme !in listOf("http", "https") || uri.host.isNullOrBlank()) {
                Toast.makeText(this, "Invalid website address", Toast.LENGTH_SHORT).show()
                return
            }

            try {
                startActivity(Intent(Intent.ACTION_VIEW, uri).apply {
                    setPackage("com.android.chrome")
                })
                return
            } catch (_: Exception) { }

            try {
                startActivity(Intent(Intent.ACTION_VIEW, uri))
            } catch (_: Exception) {
                Toast.makeText(this, "Please install or enable a web browser", Toast.LENGTH_LONG).show()
            }
        } catch (_: Exception) {
            Toast.makeText(this, "Could not open URL", Toast.LENGTH_SHORT).show()
        }
    }

    private fun schedulePeriodicScan() {
        val constraints = Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()
        val periodic = PeriodicWorkRequestBuilder<ScanWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .build()
        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "free-api-radar-periodic",
            ExistingPeriodicWorkPolicy.KEEP,
            periodic
        )
        WorkManager.getInstance(this).enqueue(OneTimeWorkRequestBuilder<ScanWorker>().setConstraints(constraints).build())
    }

    private fun runScan() {
        val constraints = Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()
        WorkManager.getInstance(this).enqueue(OneTimeWorkRequestBuilder<ScanWorker>().setConstraints(constraints).build())
    }
}

/* =========================================================================================
 * 1. 4-PHASE ANIMATED SPLASH SCREEN (MATCHING CONCEPT SECTION 2)
 * Phase 1 (0 - 1.5s): Initializing & digital grid
 * Phase 2 (1.5 - 3.0s): Wireframe forming logo
 * Phase 3 (3.0 - 5.0s): Solid logo + "WELCOME TO UMBRELLA CORPORATION" + motto
 * Phase 4 (5.0 - 6.5s): Final scene with skyscraper background + voice
 * ========================================================================================= */
@Composable
private fun UmbrellaSplash4Phase(onSkip: () -> Unit, onVoiceTrigger: () -> Unit) {
    var phase by remember { mutableIntStateOf(1) }

    LaunchedEffect(Unit) {
        delay(1400)
        phase = 2
        delay(1500)
        phase = 3
        delay(1900)
        phase = 4
        onVoiceTrigger()
    }

    val infiniteTransition = rememberInfiniteTransition(label = "wireframe")
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = 360f,
        animationSpec = infiniteRepeatable(tween(14000, easing = LinearEasing), RepeatMode.Restart),
        label = "rotation"
    )
    val pulse by infiniteTransition.animateFloat(
        initialValue = 0.85f, targetValue = 1.0f,
        animationSpec = infiniteRepeatable(tween(900, easing = FastOutSlowInEasing), RepeatMode.Reverse),
        label = "pulse"
    )

    Box(
        Modifier
            .fillMaxSize()
            .background(UmbrellaBlack)
            .clickable { onSkip() }
    ) {
        if (phase == 4) {
            Image(
                painter = painterResource(R.drawable.umbrella_building),
                contentDescription = "Umbrella Skyscraper HQ",
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxSize()
                    .alpha(0.85f)
            )
            Box(Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.45f)))
        }

        // Radar Scanning Grid (Phases 1-3)
        Canvas(modifier = Modifier.fillMaxSize().alpha(if (phase < 4) 0.35f else 0.15f)) {
            val step = 48.dp.toPx()
            for (x in 0..(size.width / step).toInt()) {
                drawLine(
                    color = UmbrellaDarkRed,
                    start = Offset(x * step, 0f),
                    end = Offset(x * step, size.height),
                    strokeWidth = 1f
                )
            }
            for (y in 0..(size.height / step).toInt()) {
                drawLine(
                    color = UmbrellaDarkRed,
                    start = Offset(0f, y * step),
                    end = Offset(size.width, y * step),
                    strokeWidth = 1f
                )
            }
        }

        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            when (phase) {
                1 -> {
                    Text(
                        text = "SECURE NETWORK SCANNER",
                        color = UmbrellaRedGlow,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        letterSpacing = 2.sp
                    )
                    Spacer(Modifier.height(28.dp))
                    Box(contentAlignment = Alignment.Center) {
                        Canvas(Modifier.size(160.dp)) {
                            drawCircle(
                                color = UmbrellaRed.copy(alpha = 0.3f),
                                style = androidx.compose.ui.graphics.drawscope.Stroke(
                                    width = 2.dp.toPx(),
                                    pathEffect = PathEffect.dashPathEffect(floatArrayOf(15f, 15f), 0f)
                                )
                            )
                        }
                        Text(
                            text = "INITIALIZING...",
                            color = UmbrellaWhite,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            letterSpacing = 3.sp
                        )
                    }
                }
                2 -> {
                    Text(
                        text = "FORMING LOGO INTERFACE",
                        color = UmbrellaRedGlow,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        letterSpacing = 2.sp
                    )
                    Spacer(Modifier.height(24.dp))
                    Box(
                        modifier = Modifier
                            .size(180.dp)
                            .rotate(rotation * 0.4f),
                        contentAlignment = Alignment.Center
                    ) {
                        Canvas(Modifier.fillMaxSize()) {
                            val r = size.minDimension / 2 * pulse
                            drawCircle(
                                color = UmbrellaRed,
                                radius = r,
                                style = androidx.compose.ui.graphics.drawscope.Stroke(width = 3.dp.toPx())
                            )
                            for (i in 0..7) {
                                val angle = (i * 45f) * (Math.PI / 180f)
                                val x = center.x + (r * Math.cos(angle)).toFloat()
                                val y = center.y + (r * Math.sin(angle)).toFloat()
                                drawLine(color = UmbrellaRedGlow, start = center, end = Offset(x, y), strokeWidth = 2.dp.toPx())
                            }
                        }
                    }
                }
                3 -> {
                    Image(
                        painter = painterResource(R.drawable.umbrella_icon),
                        contentDescription = "Umbrella Corporation Logo",
                        modifier = Modifier
                            .size(150.dp)
                            .scale(pulse)
                    )
                    Spacer(Modifier.height(32.dp))
                    Text(
                        text = "WELCOME TO",
                        color = UmbrellaWhite,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Light,
                        letterSpacing = 4.sp
                    )
                    Text(
                        text = "UMBRELLA",
                        color = UmbrellaWhite,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 6.sp
                    )
                    Text(
                        text = "CORPORATION",
                        color = UmbrellaWhite,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 5.sp
                    )
                    Spacer(Modifier.height(14.dp))
                    Text(
                        text = "OUR BUSINESS IS LIFE ITSELF",
                        color = UmbrellaRedGlow,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        letterSpacing = 2.sp
                    )
                }
                4 -> {
                    Image(
                        painter = painterResource(R.drawable.umbrella_icon),
                        contentDescription = "Umbrella Corporation Logo",
                        modifier = Modifier.size(120.dp)
                    )
                    Spacer(Modifier.height(20.dp))
                    Text(
                        text = "WELCOME TO",
                        color = UmbrellaWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Light,
                        letterSpacing = 3.sp
                    )
                    Text(
                        text = "UMBRELLA",
                        color = UmbrellaWhite,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 5.sp
                    )
                    Text(
                        text = "CORPORATION",
                        color = UmbrellaWhite,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 4.sp
                    )
                    Spacer(Modifier.height(12.dp))
                    Text(
                        text = "OUR BUSINESS IS LIFE ITSELF",
                        color = UmbrellaRedGlow,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp
                    )
                    Spacer(Modifier.height(16.dp))
                    Text(
                        text = "RADAR SCANNER ONLINE // 15 MIN CADENCE",
                        color = UmbrellaGray,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 9.sp,
                        letterSpacing = 1.sp
                    )
                }
            }
        }

        Text(
            text = "TAP SCREEN TO PROCEED",
            color = UmbrellaGray.copy(alpha = 0.6f),
            fontFamily = FontFamily.Monospace,
            fontSize = 9.sp,
            letterSpacing = 1.5.sp,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 20.dp)
        )
    }
}

/* =========================================================================================
 * 2. MAIN APPLICATION SHELL (DRAWER + BOTTOM BAR + HOME + 18+ ADULT CATEGORIES)
 * ========================================================================================= */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun UmbrellaMainApp(
    repo: ApiRepository,
    onScan: () -> Unit,
    openWebsite: (String) -> Unit,
    onExit: () -> Unit
) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    var currentTab by remember { mutableStateOf("HOME") }
    var selectedCategory by remember { mutableStateOf<String?>(null) }
    var selectedAdultSubCategory by remember { mutableStateOf<String?>(null) }
    var selectedApiForDetails by remember { mutableStateOf<ApiEntry?>(null) }
    var searchQuery by remember { mutableStateOf("") }
    var showAdultGateDialog by remember { mutableStateOf(false) }
    var adultGateConfirmed by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }

    BackHandler(enabled = selectedApiForDetails != null || selectedCategory != null || currentTab != "HOME") {
        if (selectedApiForDetails != null) {
            selectedApiForDetails = null
        } else if (selectedCategory != null) {
            selectedCategory = null
            selectedAdultSubCategory = null
        } else if (currentTab != "HOME") {
            currentTab = "HOME"
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet(
                drawerContainerColor = UmbrellaDarkBg,
                drawerContentColor = UmbrellaWhite,
                modifier = Modifier.width(300.dp)
            ) {
                UmbrellaDrawerContent(
                    currentTab = currentTab,
                    onItemClick = { tab ->
                        scope.launch { drawerState.close() }
                        when (tab) {
                            "ABOUT" -> showAboutDialog = true
                            "EXIT" -> onExit()
                            "SEARCH" -> {
                                currentTab = "HOME"
                                selectedCategory = null
                                selectedAdultSubCategory = null
                                selectedApiForDetails = null
                            }
                            else -> {
                                currentTab = tab
                                selectedCategory = null
                                selectedAdultSubCategory = null
                                selectedApiForDetails = null
                            }
                        }
                    }
                )
            }
        }
    ) {
        Scaffold(
            topBar = {
                if (selectedApiForDetails == null) {
                    UmbrellaTopBar(
                        onMenuClick = { scope.launch { drawerState.open() } },
                        onScanClick = onScan
                    )
                }
            },
            bottomBar = {
                if (selectedApiForDetails == null) {
                    UmbrellaBottomNav(
                        currentTab = currentTab,
                        onTabSelected = { tab ->
                            currentTab = tab
                            selectedCategory = null
                            selectedAdultSubCategory = null
                            selectedApiForDetails = null
                        }
                    )
                }
            },
            containerColor = UmbrellaBlack
        ) { paddingValues ->
            Box(
                Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                // Skyscraper backdrop watermark
                Image(
                    painter = painterResource(R.drawable.umbrella_splash),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxSize()
                        .alpha(0.07f)
                )

                if (selectedApiForDetails != null) {
                    ApiDetailsScreen(
                        api = selectedApiForDetails!!,
                        isFavorite = repo.favoriteIds().contains(selectedApiForDetails!!.id),
                        onToggleFavorite = { repo.toggleFavorite(selectedApiForDetails!!.id) },
                        onBack = { selectedApiForDetails = null },
                        onOpenBrowser = {
                            repo.addToHistory(selectedApiForDetails!!.id)
                            openWebsite(selectedApiForDetails!!.docsUrl)
                        }
                    )
                } else {
                    when (currentTab) {
                        "HOME" -> {
                            HomeScreen(
                                repo = repo,
                                searchQuery = searchQuery,
                                onSearchQueryChange = { searchQuery = it },
                                selectedCategory = selectedCategory,
                                selectedAdultSubCategory = selectedAdultSubCategory,
                                onSelectAdultSubCategory = { selectedAdultSubCategory = it },
                                onSelectCategory = { cat ->
                                    if (cat == "18+ / Adult AI" && !adultGateConfirmed) {
                                        showAdultGateDialog = true
                                    } else {
                                        selectedCategory = cat
                                        selectedAdultSubCategory = null
                                    }
                                },
                                onClearCategory = {
                                    selectedCategory = null
                                    selectedAdultSubCategory = null
                                },
                                onApiClick = { api ->
                                    repo.addToHistory(api.id)
                                    selectedApiForDetails = api
                                },
                                onToggleFavorite = { id -> repo.toggleFavorite(id) }
                            )
                        }
                        "FAVORITES" -> {
                            FavoritesScreen(
                                repo = repo,
                                onApiClick = { api ->
                                    repo.addToHistory(api.id)
                                    selectedApiForDetails = api
                                },
                                onToggleFavorite = { id -> repo.toggleFavorite(id) }
                            )
                        }
                        "HISTORY" -> {
                            HistoryScreen(
                                repo = repo,
                                onApiClick = { api -> selectedApiForDetails = api }
                            )
                        }
                        "SETTINGS" -> {
                            SettingsScreen(
                                repo = repo,
                                onManualScan = onScan,
                                onOpenAbout = { showAboutDialog = true }
                            )
                        }
                    }
                }
            }
        }
    }

    // Adult 18+ Warning Gate Dialog
    if (showAdultGateDialog) {
        AlertDialog(
            onDismissRequest = { showAdultGateDialog = false },
            containerColor = UmbrellaPanel,
            titleContentColor = UmbrellaRed,
            textContentColor = UmbrellaWhite,
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Warning, contentDescription = null, tint = UmbrellaRed)
                    Spacer(Modifier.width(8.dp))
                    Text("18+ Content Warning", fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Text(
                    "The 18+ / Adult AI section indexes adult AI platforms, uncensored LLM models, NSFW Image-to-Video, and voice cloning.\n\nYou must be at least 18 years of age to access these resources."
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        adultGateConfirmed = true
                        showAdultGateDialog = false
                        selectedCategory = "18+ / Adult AI"
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = UmbrellaRed)
                ) {
                    Text("I AM 18 OR OLDER")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAdultGateDialog = false }) {
                    Text("CANCEL", color = UmbrellaGray)
                }
            }
        )
    }

    if (showAboutDialog) {
        AlertDialog(
            onDismissRequest = { showAboutDialog = false },
            containerColor = UmbrellaPanel,
            titleContentColor = UmbrellaWhite,
            textContentColor = UmbrellaWhite,
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Image(
                        painter = painterResource(R.drawable.umbrella_icon),
                        contentDescription = null,
                        modifier = Modifier.size(32.dp)
                    )
                    Spacer(Modifier.width(10.dp))
                    Text("Umbrella Corporation", fontWeight = FontWeight.Black)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        "FREE API RADAR v2.0",
                        color = UmbrellaRedGlow,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        "Automated reconnaissance platform continuously scanning for verified free AI keys, trial credits, and inference endpoints across Image-to-Video, Text-to-Video, Voice, and 18+ Uncensored models."
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "\"OUR BUSINESS IS LIFE ITSELF\"",
                        color = UmbrellaRed,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showAboutDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = UmbrellaRed)
                ) {
                    Text("CLOSE")
                }
            }
        )
    }
}

/* =========================================================================================
 * 3. TOP BAR & NAVIGATION DRAWER (CONCEPT 3)
 * ========================================================================================= */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun UmbrellaTopBar(onMenuClick: () -> Unit, onScanClick: () -> Unit) {
    TopAppBar(
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = UmbrellaBlack,
            titleContentColor = UmbrellaWhite,
            navigationIconContentColor = UmbrellaWhite,
            actionIconContentColor = UmbrellaRedGlow
        ),
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Image(
                    painter = painterResource(R.drawable.umbrella_icon),
                    contentDescription = "Umbrella Emblem",
                    modifier = Modifier.size(36.dp)
                )
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(
                        text = "Free API Radar",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = UmbrellaWhite,
                        letterSpacing = 0.5.sp
                    )
                    Text(
                        text = "UMBRELLA CORPORATION",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = UmbrellaRed,
                        letterSpacing = 1.2.sp
                    )
                }
            }
        },
        actions = {
            IconButton(onClick = onScanClick) {
                Icon(Icons.Default.Refresh, contentDescription = "Scan Now", tint = UmbrellaRedGlow)
            }
            IconButton(onClick = onMenuClick) {
                Icon(Icons.Default.Menu, contentDescription = "Open Drawer", tint = UmbrellaWhite)
            }
        }
    )
}

@Composable
private fun UmbrellaDrawerContent(currentTab: String, onItemClick: (String) -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .background(UmbrellaDarkBg)
            .padding(vertical = 24.dp, horizontal = 16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 20.dp, top = 8.dp)
            ) {
                Image(
                    painter = painterResource(R.drawable.umbrella_icon),
                    contentDescription = null,
                    modifier = Modifier.size(46.dp)
                )
                Spacer(Modifier.width(14.dp))
                Column {
                    Text(
                        text = "Free API Radar",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = UmbrellaWhite
                    )
                    Text(
                        text = "UMBRELLA CORPORATION",
                        color = UmbrellaRed,
                        fontSize = 9.sp,
                        letterSpacing = 1.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            HorizontalDivider(color = Color(0xFF262A36), thickness = 1.dp)
            Spacer(Modifier.height(14.dp))

            DrawerMenuItem(label = "Home", icon = Icons.Default.Home, selected = currentTab == "HOME") { onItemClick("HOME") }
            DrawerMenuItem(label = "Search", icon = Icons.Default.Search, selected = false) { onItemClick("SEARCH") }
            DrawerMenuItem(label = "Favorites", icon = Icons.Default.Star, selected = currentTab == "FAVORITES") { onItemClick("FAVORITES") }
            DrawerMenuItem(label = "History", icon = Icons.Default.History, selected = currentTab == "HISTORY") { onItemClick("HISTORY") }
            DrawerMenuItem(label = "Settings", icon = Icons.Default.Settings, selected = currentTab == "SETTINGS") { onItemClick("SETTINGS") }
            DrawerMenuItem(label = "About", icon = Icons.Default.Info, selected = false) { onItemClick("ABOUT") }
            DrawerMenuItem(label = "Exit", icon = Icons.Default.ExitToApp, selected = false) { onItemClick("EXIT") }
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth().padding(top = 16.dp)
        ) {
            Text(
                text = "— OUR BUSINESS IS LIFE ITSELF —",
                color = UmbrellaRed,
                fontFamily = FontFamily.Monospace,
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.5.sp,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(10.dp))
            Canvas(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF07080B))
            ) {
                val cx = size.width / 2
                val cy = size.height / 2
                for (i in 1..4) {
                    val rad = i * 20f
                    drawCircle(
                        color = UmbrellaDarkRed.copy(alpha = 0.4f),
                        center = Offset(cx, cy),
                        radius = rad,
                        style = androidx.compose.ui.graphics.drawscope.Stroke(width = 1f)
                    )
                }
                drawLine(
                    color = UmbrellaDarkRed.copy(alpha = 0.6f),
                    start = Offset(0f, cy),
                    end = Offset(size.width, cy),
                    strokeWidth = 1f
                )
                drawLine(
                    color = UmbrellaDarkRed.copy(alpha = 0.6f),
                    start = Offset(cx, 0f),
                    end = Offset(cx, size.height),
                    strokeWidth = 1f
                )
                val nodeColor = UmbrellaRedGlow
                drawCircle(color = nodeColor, radius = 3.dp.toPx(), center = Offset(cx - 50f, cy - 15f))
                drawCircle(color = nodeColor, radius = 3.dp.toPx(), center = Offset(cx + 40f, cy - 20f))
                drawCircle(color = nodeColor, radius = 3.dp.toPx(), center = Offset(cx + 70f, cy + 18f))
                drawCircle(color = nodeColor, radius = 3.dp.toPx(), center = Offset(cx - 30f, cy + 22f))
                drawCircle(color = UmbrellaRed, radius = 5.dp.toPx(), center = Offset(cx, cy))
            }
        }
    }
}

@Composable
private fun DrawerMenuItem(label: String, icon: ImageVector, selected: Boolean, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(10.dp),
        color = if (selected) UmbrellaRed.copy(alpha = 0.16f) else Color.Transparent,
        border = if (selected) BorderStroke(1.dp, UmbrellaRed.copy(alpha = 0.5f)) else null,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (selected) UmbrellaRed else UmbrellaGray,
                modifier = Modifier.size(20.dp)
            )
            Spacer(Modifier.width(16.dp))
            Text(
                text = label,
                color = if (selected) UmbrellaWhite else UmbrellaGray,
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
                fontSize = 14.sp
            )
        }
    }
}

/* =========================================================================================
 * 4. BOTTOM NAVIGATION BAR (CONCEPT 3)
 * ========================================================================================= */
@Composable
private fun UmbrellaBottomNav(currentTab: String, onTabSelected: (String) -> Unit) {
    NavigationBar(
        containerColor = UmbrellaPanel,
        tonalElevation = 8.dp,
        modifier = Modifier.height(64.dp)
    ) {
        val items = listOf(
            Triple("HOME", "Home", Icons.Default.Home),
            Triple("FAVORITES", "Favorites", Icons.Default.Star),
            Triple("HISTORY", "History", Icons.Default.History),
            Triple("SETTINGS", "Settings", Icons.Default.Settings)
        )

        items.forEach { (tabId, label, icon) ->
            val isSelected = currentTab == tabId
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(tabId) },
                icon = {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        tint = if (isSelected) UmbrellaRed else UmbrellaGray
                    )
                },
                label = {
                    Text(
                        text = label,
                        fontSize = 11.sp,
                        color = if (isSelected) UmbrellaRed else UmbrellaGray,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = UmbrellaRed.copy(alpha = 0.18f)
                )
            )
        }
    }
}

/* =========================================================================================
 * 5. HOME SCREEN & CATEGORY DASHBOARD (CONCEPT 3 LEFT PHONE)
 * Full categories: Image to Video, Text to Video, Text to Voice, Voice to Text, 18+ with subcategories
 * ========================================================================================= */
@Composable
private fun HomeScreen(
    repo: ApiRepository,
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    selectedCategory: String?,
    selectedAdultSubCategory: String?,
    onSelectAdultSubCategory: (String?) -> Unit,
    onSelectCategory: (String) -> Unit,
    onClearCategory: () -> Unit,
    onApiClick: (ApiEntry) -> Unit,
    onToggleFavorite: (String) -> Unit
) {
    val apis by repo.observe().collectAsState(initial = emptyList())
    val hiddenIds = remember { repo.hiddenResultIds() }
    val favoriteIds = remember { repo.favoriteIds() }
    var authFilter by remember { mutableStateOf("ALL") }

    val filteredList = remember(apis, searchQuery, selectedCategory, selectedAdultSubCategory, authFilter, hiddenIds) {
        apis.filter { entry ->
            entry.id !in hiddenIds &&
            (selectedCategory == null || entry.category.equals(selectedCategory, ignoreCase = true)) &&
            (selectedAdultSubCategory == null || entry.tags.contains(selectedAdultSubCategory, ignoreCase = true) || entry.name.contains(selectedAdultSubCategory, ignoreCase = true)) &&
            (authFilter == "ALL" || (authFilter == "NO_KEY" && !entry.needsKey) || (authFilter == "KEY_NEEDED" && entry.needsKey)) &&
            (searchQuery.isBlank() ||
                    entry.name.contains(searchQuery, true) ||
                    entry.description.contains(searchQuery, true) ||
                    entry.category.contains(searchQuery, true) ||
                    entry.tags.contains(searchQuery, true))
        }
    }

    Column(
        Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        // Red-Bordered Glowing Search Bar
        UmbrellaSearchBar(
            query = searchQuery,
            onQueryChange = onSearchQueryChange
        )

        Spacer(Modifier.height(14.dp))

        if (searchQuery.isNotBlank() || selectedCategory != null) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = {
                        onClearCategory()
                        onSearchQueryChange("")
                    }, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = UmbrellaRed)
                    }
                    Spacer(Modifier.width(6.dp))
                    Text(
                        text = selectedCategory ?: "Search Results",
                        fontWeight = FontWeight.Bold,
                        color = UmbrellaWhite,
                        fontSize = 16.sp
                    )
                }

                Text(
                    text = "${filteredList.size} found",
                    color = UmbrellaGray,
                    fontSize = 12.sp,
                    fontFamily = FontFamily.Monospace
                )
            }

            // Subcategory filter chips for 18+ Section
            if (selectedCategory == "18+ / Adult AI") {
                Spacer(Modifier.height(8.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    val subFilters = listOf(
                        null to "All 18+",
                        "Video" to "18+ Image/Video",
                        "Image" to "18+ NSFW Art",
                        "Chat" to "18+ Uncensored Chat",
                        "Voice" to "18+ Adult Voice",
                        "Roleplay" to "18+ Roleplay"
                    )
                    items(subFilters) { (filterKey, filterLabel) ->
                        FilterChip(
                            selected = selectedAdultSubCategory == filterKey,
                            onClick = { onSelectAdultSubCategory(filterKey) },
                            label = { Text(filterLabel, fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = UmbrellaRed,
                                selectedLabelColor = Color.White
                            )
                        )
                    }
                }
            }

            Spacer(Modifier.height(8.dp))

            // Auth Filter Pills
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(
                    selected = authFilter == "ALL",
                    onClick = { authFilter = "ALL" },
                    label = { Text("All (${filteredList.size})", fontSize = 11.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = UmbrellaRed,
                        selectedLabelColor = Color.White
                    )
                )
                FilterChip(
                    selected = authFilter == "NO_KEY",
                    onClick = { authFilter = "NO_KEY" },
                    label = { Text("No Key Required", fontSize = 11.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = UmbrellaRed,
                        selectedLabelColor = Color.White
                    )
                )
                FilterChip(
                    selected = authFilter == "KEY_NEEDED",
                    onClick = { authFilter = "KEY_NEEDED" },
                    label = { Text("API Key / Free Tier", fontSize = 11.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = UmbrellaRed,
                        selectedLabelColor = Color.White
                    )
                )
            }

            Spacer(Modifier.height(10.dp))

            if (filteredList.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.Search, contentDescription = null, tint = UmbrellaGray, modifier = Modifier.size(48.dp))
                        Spacer(Modifier.height(8.dp))
                        Text("No free APIs found for this filter.", color = UmbrellaGray)
                    }
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    items(filteredList, key = { it.id }) { api ->
                        ApiListItemCard(
                            api = api,
                            isFavorite = favoriteIds.contains(api.id),
                            onCardClick = { onApiClick(api) },
                            onToggleFavorite = { onToggleFavorite(api.id) }
                        )
                    }
                }
            }
        } else {
            // Main Categories Dashboard (Section 3 Left Phone)
            Text(
                text = "EXPLORE CATEGORIES & STUDIOS",
                color = UmbrellaGray,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(vertical = 4.dp)
            )

            val categories = listOf(
                CategoryItem(
                    title = "Image to Video",
                    subtitle = "Animate images into video, motion AI",
                    icon = Icons.Default.MovieFilter,
                    count = apis.count { it.category == "Image to Video" }
                ),
                CategoryItem(
                    title = "Text to Video",
                    subtitle = "Generate video from text prompts",
                    icon = Icons.Default.Videocam,
                    count = apis.count { it.category == "Text to Video" }
                ),
                CategoryItem(
                    title = "Text to Voice",
                    subtitle = "TTS, voice cloning, speech synthesis",
                    icon = Icons.Default.RecordVoiceOver,
                    count = apis.count { it.category == "Text to Voice" }
                ),
                CategoryItem(
                    title = "Voice to Text",
                    subtitle = "Whisper speech recognition & STT",
                    icon = Icons.Default.GraphicEq,
                    count = apis.count { it.category == "Voice to Text" }
                ),
                CategoryItem(
                    title = "AI & Machine Learning",
                    subtitle = "Find free AI models & agent endpoints",
                    icon = Icons.Default.Memory,
                    count = apis.count { it.category == "AI & Machine Learning" }
                ),
                CategoryItem(
                    title = "Text & Language",
                    subtitle = "Translation, NLP, LLM chat",
                    icon = Icons.Default.ChatBubble,
                    count = apis.count { it.category == "Text & Language" }
                ),
                CategoryItem(
                    title = "Image & Vision",
                    subtitle = "Image generation, FLUX, OCR",
                    icon = Icons.Default.Visibility,
                    count = apis.count { it.category == "Image & Vision" }
                ),
                CategoryItem(
                    title = "Developer Tools",
                    subtitle = "Utilities, edge AI, inference clouds",
                    icon = Icons.Default.Build,
                    count = apis.count { it.category == "Developer Tools" }
                ),
                CategoryItem(
                    title = "18+ / Adult AI",
                    subtitle = "Uncensored models, adult video & voice",
                    icon = Icons.Default.Shield,
                    count = apis.count { it.category == "18+ / Adult AI" }
                )
            )

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(categories) { item ->
                    CategoryCardRow(
                        item = item,
                        onClick = { onSelectCategory(item.title) }
                    )
                }

                item {
                    Surface(
                        color = UmbrellaPanel,
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(1.dp, Color(0xFF272A35)),
                        modifier = Modifier.fillMaxWidth().padding(top = 6.dp, bottom = 12.dp)
                    ) {
                        Row(
                            Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(UmbrellaGreen)
                            )
                            Spacer(Modifier.width(10.dp))
                            Text(
                                "RADAR DAEMON: ACTIVE // PERIODIC RECON EVERY 15 MIN",
                                color = UmbrellaGray,
                                fontFamily = FontFamily.Monospace,
                                fontSize = 9.sp,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

private data class CategoryItem(
    val title: String,
    val subtitle: String,
    val icon: ImageVector,
    val count: Int
)

@Composable
private fun UmbrellaSearchBar(query: String, onQueryChange: (String) -> Unit) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = UmbrellaPanel,
        border = BorderStroke(1.dp, UmbrellaRed),
        modifier = Modifier.fillMaxWidth().height(52.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 14.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = UmbrellaRed,
                modifier = Modifier.size(20.dp)
            )
            Spacer(Modifier.width(10.dp))
            TextField(
                value = query,
                onValueChange = onQueryChange,
                placeholder = {
                    Text(
                        "Search free APIs...",
                        color = UmbrellaGray,
                        fontSize = 14.sp
                    )
                },
                singleLine = true,
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    focusedTextColor = UmbrellaWhite,
                    unfocusedTextColor = UmbrellaWhite,
                    cursorColor = UmbrellaRed
                ),
                modifier = Modifier.weight(1f)
            )
            if (query.isNotEmpty()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(
                        Icons.Default.Close,
                        contentDescription = "Clear",
                        tint = UmbrellaGray,
                        modifier = Modifier.size(18.dp)
                    )
                }
            } else {
                Icon(
                    Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = UmbrellaGray,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

@Composable
private fun CategoryCardRow(item: CategoryItem, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(12.dp),
        color = UmbrellaPanel,
        border = BorderStroke(1.dp, Color(0xFF282B36)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = UmbrellaRed.copy(alpha = 0.15f),
                border = BorderStroke(1.dp, UmbrellaRed.copy(alpha = 0.6f)),
                modifier = Modifier.size(46.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.title,
                        tint = UmbrellaRed,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }

            Spacer(Modifier.width(16.dp))

            Column(Modifier.weight(1f)) {
                Text(
                    text = item.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = UmbrellaWhite
                )
                Text(
                    text = item.subtitle,
                    fontSize = 12.sp,
                    color = UmbrellaGray
                )
            }

            if (item.count > 0) {
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = Color(0xFF222632)
                ) {
                    Text(
                        text = "${item.count}",
                        color = UmbrellaWhite,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
                Spacer(Modifier.width(6.dp))
            }

            Icon(
                Icons.Default.ChevronRight,
                contentDescription = null,
                tint = UmbrellaGray,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

@Composable
private fun ApiListItemCard(
    api: ApiEntry,
    isFavorite: Boolean,
    onCardClick: () -> Unit,
    onToggleFavorite: () -> Unit
) {
    Surface(
        onClick = onCardClick,
        shape = RoundedCornerShape(12.dp),
        color = UmbrellaPanel,
        border = BorderStroke(1.dp, Color(0xFF292C37)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(14.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                    Image(
                        painter = painterResource(R.drawable.umbrella_icon),
                        contentDescription = null,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(Modifier.width(10.dp))
                    Text(
                        text = api.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = UmbrellaWhite,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                IconButton(onClick = onToggleFavorite, modifier = Modifier.size(28.dp)) {
                    Icon(
                        imageVector = if (isFavorite) Icons.Default.Star else Icons.Default.StarBorder,
                        contentDescription = "Favorite",
                        tint = if (isFavorite) UmbrellaGold else UmbrellaGray
                    )
                }
            }

            Spacer(Modifier.height(6.dp))

            Text(
                text = api.description,
                color = UmbrellaGray,
                fontSize = 12.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(Modifier.height(10.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    api.tagList().take(3).forEach { tag ->
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = Color(0xFF222631)
                        ) {
                            Text(
                                text = tag,
                                color = UmbrellaWhite,
                                fontSize = 10.sp,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }

                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = if (api.needsKey) UmbrellaDarkRed.copy(alpha = 0.5f) else UmbrellaGreen.copy(alpha = 0.15f),
                    border = BorderStroke(1.dp, if (api.needsKey) UmbrellaRed else UmbrellaGreen)
                ) {
                    Text(
                        text = if (api.needsKey) "API KEY" else "NO KEY",
                        color = if (api.needsKey) UmbrellaWhite else UmbrellaGreen,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }
    }
}

/* =========================================================================================
 * 6. DETAILS SCREEN (CONCEPT 3 MIDDLE PHONE)
 * ========================================================================================= */
@Composable
private fun ApiDetailsScreen(
    api: ApiEntry,
    isFavorite: Boolean,
    onToggleFavorite: () -> Unit,
    onBack: () -> Unit,
    onOpenBrowser: () -> Unit
) {
    val context = LocalContext.current

    Column(
        Modifier
            .fillMaxSize()
            .background(UmbrellaBlack)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = UmbrellaWhite)
            }
            Spacer(Modifier.width(6.dp))
            Text(
                text = "Details",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = UmbrellaWhite
            )
        }

        Spacer(Modifier.height(16.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            Surface(
                shape = CircleShape,
                color = UmbrellaPanel,
                border = BorderStroke(2.dp, UmbrellaRed),
                modifier = Modifier.size(56.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Image(
                        painter = painterResource(R.drawable.umbrella_icon),
                        contentDescription = api.name,
                        modifier = Modifier.size(36.dp)
                    )
                }
            }

            Spacer(Modifier.width(14.dp))

            Column {
                Text(
                    text = api.name,
                    fontWeight = FontWeight.Black,
                    fontSize = 20.sp,
                    color = UmbrellaWhite
                )

                Spacer(Modifier.height(4.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    api.tagList().forEach { tag ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0xFF242732),
                            border = BorderStroke(1.dp, Color(0xFF383C4D))
                        ) {
                            Text(
                                text = tag,
                                color = UmbrellaWhite,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                            )
                        }
                    }
                }
            }
        }

        Spacer(Modifier.height(14.dp))

        Text(
            text = api.description,
            color = UmbrellaWhite,
            fontSize = 14.sp,
            lineHeight = 20.sp
        )

        Spacer(Modifier.height(18.dp))

        // 3-Column Info Stats Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            StatBox(
                title = "Rate Limit",
                value = api.rateLimit.ifBlank { "Unmetered" },
                icon = Icons.Default.Speed,
                modifier = Modifier.weight(1.2f)
            )
            StatBox(
                title = "Auth",
                value = if (api.needsKey) "API Key" else "No key",
                icon = Icons.Default.Key,
                modifier = Modifier.weight(0.9f)
            )
            StatBox(
                title = "Docs",
                value = "View",
                icon = Icons.Default.OpenInNew,
                modifier = Modifier.weight(0.8f)
            )
        }

        Spacer(Modifier.height(20.dp))

        // Big Red Button: "Open in Browser"
        Button(
            onClick = onOpenBrowser,
            shape = RoundedCornerShape(10.dp),
            colors = ButtonDefaults.buttonColors(containerColor = UmbrellaRed),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text(
                text = "Open in Browser",
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                color = Color.White
            )
        }

        Spacer(Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            OutlinedButton(
                onClick = onToggleFavorite,
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = UmbrellaWhite),
                border = BorderStroke(1.dp, Color(0xFF383C4D)),
                modifier = Modifier.weight(1f)
            ) {
                Icon(
                    imageVector = if (isFavorite) Icons.Default.Star else Icons.Default.StarBorder,
                    contentDescription = null,
                    tint = if (isFavorite) UmbrellaGold else UmbrellaWhite
                )
                Spacer(Modifier.width(8.dp))
                Text(if (isFavorite) "Favorited" else "Favorite")
            }

            OutlinedButton(
                onClick = {
                    val clip = ClipData.newPlainText("URL", api.docsUrl)
                    val cm = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                    cm.setPrimaryClip(clip)
                    Toast.makeText(context, "URL copied to clipboard", Toast.LENGTH_SHORT).show()
                },
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = UmbrellaWhite),
                border = BorderStroke(1.dp, Color(0xFF383C4D)),
                modifier = Modifier.weight(1f)
            ) {
                Icon(Icons.Default.ContentCopy, contentDescription = null, tint = UmbrellaWhite)
                Spacer(Modifier.width(8.dp))
                Text("Copy Link")
            }
        }

        Spacer(Modifier.height(24.dp))

        Text(
            text = "Response Example",
            fontWeight = FontWeight.Bold,
            fontSize = 15.sp,
            color = UmbrellaWhite
        )

        Spacer(Modifier.height(8.dp))

        Surface(
            shape = RoundedCornerShape(10.dp),
            color = Color(0xFF0F1117),
            border = BorderStroke(1.dp, Color(0xFF282C38)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(Modifier.padding(14.dp)) {
                val sampleJson = api.responseExample.ifBlank {
                    """{
  "status": "success",
  "model": "${api.name}",
  "free_access": true,
  "endpoint": "${api.docsUrl}"
}"""
                }

                Text(
                    text = formatJsonSyntax(sampleJson),
                    fontFamily = FontFamily.Monospace,
                    fontSize = 12.sp,
                    lineHeight = 18.sp
                )
            }
        }
    }
}

@Composable
private fun StatBox(title: String, value: String, icon: ImageVector, modifier: Modifier) {
    Surface(
        shape = RoundedCornerShape(10.dp),
        color = UmbrellaPanel,
        border = BorderStroke(1.dp, Color(0xFF2B2E3C)),
        modifier = modifier
    ) {
        Column(
            Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, contentDescription = title, tint = UmbrellaRed, modifier = Modifier.size(18.dp))
            Spacer(Modifier.height(4.dp))
            Text(title, color = UmbrellaGray, fontSize = 10.sp)
            Text(value, color = UmbrellaWhite, fontWeight = FontWeight.Bold, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
    }
}

/* =========================================================================================
 * 7. FAVORITES, HISTORY, SETTINGS SCREENS
 * ========================================================================================= */
@Composable
private fun FavoritesScreen(
    repo: ApiRepository,
    onApiClick: (ApiEntry) -> Unit,
    onToggleFavorite: (String) -> Unit
) {
    val apis by repo.observe().collectAsState(initial = emptyList())
    val favoriteIds = remember { repo.favoriteIds() }
    val favorites = apis.filter { it.id in favoriteIds }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("FAVORITES", fontWeight = FontWeight.Bold, color = UmbrellaWhite, fontSize = 18.sp)
        Text("Bookmarked free APIs and models", color = UmbrellaGray, fontSize = 12.sp)
        Spacer(Modifier.height(14.dp))

        if (favorites.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.StarBorder, contentDescription = null, tint = UmbrellaGray, modifier = Modifier.size(48.dp))
                    Spacer(Modifier.height(8.dp))
                    Text("No favorites saved yet.", color = UmbrellaGray)
                }
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(favorites, key = { it.id }) { api ->
                    ApiListItemCard(
                        api = api,
                        isFavorite = true,
                        onCardClick = { onApiClick(api) },
                        onToggleFavorite = { onToggleFavorite(api.id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun HistoryScreen(
    repo: ApiRepository,
    onApiClick: (ApiEntry) -> Unit
) {
    val apis by repo.observe().collectAsState(initial = emptyList())
    val historyIds = remember { repo.historyIds() }
    val historyItems = historyIds.mapNotNull { id -> apis.find { it.id == id } }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("HISTORY", fontWeight = FontWeight.Bold, color = UmbrellaWhite, fontSize = 18.sp)
        Text("Recently viewed models and APIs", color = UmbrellaGray, fontSize = 12.sp)
        Spacer(Modifier.height(14.dp))

        if (historyItems.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.History, contentDescription = null, tint = UmbrellaGray, modifier = Modifier.size(48.dp))
                    Spacer(Modifier.height(8.dp))
                    Text("No history recorded yet.", color = UmbrellaGray)
                }
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(historyItems, key = { it.id }) { api ->
                    ApiListItemCard(
                        api = api,
                        isFavorite = repo.favoriteIds().contains(api.id),
                        onCardClick = { onApiClick(api) },
                        onToggleFavorite = { repo.toggleFavorite(api.id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun SettingsScreen(
    repo: ApiRepository,
    onManualScan: () -> Unit,
    onOpenAbout: () -> Unit
) {
    var newSourceUrl by remember { mutableStateOf("") }
    val customSources = remember { repo.customSources() }
    val context = LocalContext.current

    Column(
        Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text("RADAR SETTINGS", fontWeight = FontWeight.Bold, color = UmbrellaWhite, fontSize = 18.sp)
        Text("Scanner cadence and custom source registries", color = UmbrellaGray, fontSize = 12.sp)
        Spacer(Modifier.height(16.dp))

        // Scanner Trigger Card
        Surface(
            shape = RoundedCornerShape(12.dp),
            color = UmbrellaPanel,
            border = BorderStroke(1.dp, Color(0xFF2C2F3D)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(Modifier.padding(14.dp)) {
                Text("Reconnaissance Daemon", fontWeight = FontWeight.Bold, color = UmbrellaWhite, fontSize = 15.sp)
                Spacer(Modifier.height(4.dp))
                Text("Periodically scans catalogs every 15 minutes in the background.", color = UmbrellaGray, fontSize = 12.sp)
                Spacer(Modifier.height(12.dp))
                Button(
                    onClick = {
                        onManualScan()
                        Toast.makeText(context, "Radar scan triggered", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = UmbrellaRed)
                ) {
                    Icon(Icons.Default.Radar, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Trigger Recon Scan Now")
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        // Add Custom HTTPS Source
        Surface(
            shape = RoundedCornerShape(12.dp),
            color = UmbrellaPanel,
            border = BorderStroke(1.dp, Color(0xFF2C2F3D)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(Modifier.padding(14.dp)) {
                Text("Custom Intelligence Sources", fontWeight = FontWeight.Bold, color = UmbrellaWhite, fontSize = 15.sp)
                Text("Add public HTTPS Markdown file or repository URL.", color = UmbrellaGray, fontSize = 12.sp)
                Spacer(Modifier.height(10.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    TextField(
                        value = newSourceUrl,
                        onValueChange = { newSourceUrl = it },
                        placeholder = { Text("https://raw.githubusercontent.com/...", color = UmbrellaGray, fontSize = 12.sp) },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFF101217),
                            unfocusedContainerColor = Color(0xFF101217),
                            focusedTextColor = UmbrellaWhite,
                            unfocusedTextColor = UmbrellaWhite,
                            cursorColor = UmbrellaRed
                        )
                    )
                    Spacer(Modifier.width(8.dp))
                    IconButton(
                        onClick = {
                            if (newSourceUrl.isNotBlank() && repo.addCustomSource(newSourceUrl)) {
                                newSourceUrl = ""
                                Toast.makeText(context, "Source added", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, "Invalid HTTPS URL", Toast.LENGTH_SHORT).show()
                            }
                        }
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add", tint = UmbrellaRedGlow)
                    }
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        // About Button
        Button(
            onClick = onOpenAbout,
            shape = RoundedCornerShape(10.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF242735)),
            modifier = Modifier.fillMaxWidth().height(48.dp)
        ) {
            Icon(Icons.Default.Info, contentDescription = null, tint = UmbrellaWhite)
            Spacer(Modifier.width(8.dp))
            Text("About Umbrella Corporation Radar", color = UmbrellaWhite)
        }
    }
}

// JSON Syntax Highlighting Formatter for Response Example
private fun formatJsonSyntax(json: String) = buildAnnotatedString {
    var inQuotes = false
    var isKey = false

    json.forEach { ch ->
        when {
            ch == '"' -> {
                inQuotes = !inQuotes
                if (inQuotes) isKey = true
                append(ch)
            }
            ch == ':' && !inQuotes -> {
                isKey = false
                append(ch)
            }
            ch in "{}[]," && !inQuotes -> {
                withStyle(SpanStyle(color = UmbrellaRed, fontWeight = FontWeight.Bold)) { append(ch) }
            }
            inQuotes && isKey -> {
                withStyle(SpanStyle(color = Color(0xFF00E5FF))) { append(ch) } // Cyan for keys
            }
            inQuotes && !isKey -> {
                withStyle(SpanStyle(color = Color(0xFF69F0AE))) { append(ch) } // Green for strings
            }
            ch.isDigit() && !inQuotes -> {
                withStyle(SpanStyle(color = Color(0xFFFFD54F))) { append(ch) } // Gold for numbers
            }
            else -> {
                withStyle(SpanStyle(color = UmbrellaWhite)) { append(ch) }
            }
        }
    }
}
