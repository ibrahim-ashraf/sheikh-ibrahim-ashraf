export default {
  expo: {
    name: "تطبيق الشيخ إبراهيم أشرف",
    slug: "sheikh-ibrahim-ashraf",
    version: "1.3.5",
    orientation: "portrait",
    icon: "assets/images/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "sheikhibrahimashraf",
    splash: {
      image: "assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-4846811371537023~1051371561",
          iosAppId: "ca-app-pub-xxxxxxxx~xxxxxxxx"
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0",
            enableProguardInReleaseBuilds: false
          }
        }
      ]
    ],
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.meftahaloloom.sheikhibrahimashraf",
      versionCode: 12,
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "com.android.vending.BILLING"
      ],
      jsEngine: "hermes",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "50593fcb-5c4b-45bc-b278-f9f28c050c95"
      }
    },
    owner: "meftah.al-oloom",
    experiments: {
      tsconfigPaths: true
    },
    newArchEnabled: true
  }
};
