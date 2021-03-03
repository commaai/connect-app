package ai.comma.connect;

import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Context;
import androidx.multidex.MultiDex;
import androidx.multidex.MultiDexApplication;

import com.facebook.react.ReactApplication;
import io.sentry.RNSentryPackage;
import com.horcrux.svg.SvgPackage;
import com.segment.analytics.reactnative.core.RNAnalyticsPackage;
import com.segment.analytics.reactnative.integration.mixpanel.RNAnalyticsIntegration_MixpanelPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import org.reactnative.camera.RNCameraPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @SuppressLint("MissingPermission")
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.asList(
        new MainReactPackage(),
            new SvgPackage(),
        new RNAnalyticsIntegration_MixpanelPackage(),
        new RNAnalyticsPackage(),
        new ReactVideoPackage(),
        new RNFetchBlobPackage(),
        new RNSentryPackage(),
        new RCTMGLPackage(),
        new RNCameraPackage(),
        new LottiePackage(),
        new RNDeviceInfo(),
        new RNGestureHandlerPackage(),
        new RNGoogleSigninPackage(),
        new StripeReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  @Override
  protected void attachBaseContext(Context context) {
    super.attachBaseContext(context);
    MultiDex.install(this);
  }
}
