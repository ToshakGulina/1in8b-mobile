# APK — 1 из 8 миллиардов (мобильная адаптация)

**Файл:** `dist/1in8b-mobile.apk` (5.3 MB, debug, package `dev.qretexa.twa1in8b`, minSdk 24 / Android 7.0+)

**Что внутри:** WebView-оболочка с `index.html` (мобильная адаптация оригинала 1in8b.life). Работает офлайн, без Chrome TWA баннера, с hardware acceleration.

**Установка:**
1. Скачай `1in8b-mobile.apk` из `dist/` или из Actions → последний успешный ран → `1in8b-mobile-apk` artifact
2. На телефоне разреши «Установка из неизвестных источников» для браузера/файлового менеджера
3. Открой APK → Установить → Открыть. Иконка «1 из 8 млрд» появится в лаунчере.

**Прямые ссылки:**
- Raw: `https://raw.githubusercontent.com/ToshakGulina/1in8b-mobile/arena/63846101-1in8b-mobile/dist/1in8b-mobile.apk`
- Actions: `https://github.com/ToshakGulina/1in8b-mobile/actions/runs/40873293681`

**Сборка:** GitHub Actions `Build APK` (Ubuntu, JDK 17, Gradle 8.7, Android SDK 34). Исходник — эта ветка, workflow `.github/workflows/apk.yml` (WebView `file:///android_asset/index.html`).

**Важно:** Это debug-подпись. Для Play Store нужен release-keystore. Для проверки: `unzip -l dist/1in8b-mobile.apk` — внутри `assets/index.html` и `classes.dex`.
