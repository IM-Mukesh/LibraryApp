package com.gyaanshelf

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "gyaanshelf"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  // Show splash screen on app startup
  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme back to AppTheme after showing splash
    setTheme(R.style.AppTheme)
    super.onCreate(savedInstanceState)
  }
}
