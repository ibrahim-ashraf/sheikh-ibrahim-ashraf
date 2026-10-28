export default {
  expo: {
    name: "تطبيق الشيخ إبراهيم أشرف",
    slug: "sheikh-ibrahim-ashraf",
    version: "1.3.8",
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
      "./plugins/withAndroidGradlePluginVersion",
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 24,
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            buildToolsVersion: "36.0.0",
            enableProguardInReleaseBuilds: true
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
      versionCode: 16,
      edgeToEdgeEnabled: true,
      permissions: [
        "INTERNET",
        "POST_NOTIFICATIONS"
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
