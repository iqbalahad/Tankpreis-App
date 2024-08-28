# Tankpreis App

Die **Tankpreis App** ist eine mobile Anwendung, die aktuelle Kraftstoffpreise von nahegelegenen Tankstellen anzeigt. Die App ermöglicht es den Nutzern, bevorzugte Tankstellen zu speichern und detaillierte Informationen zu diesen abzurufen. Die Daten werden von der [Tankerkönig API](https://www.tankerkoenig.de) bereitgestellt.

## Funktionen

- **Aktuelle Kraftstoffpreise:** Zeigt die neuesten Preise für Diesel, Super und E10 von nahegelegenen Tankstellen an.
- **Favoriten:** Ermöglicht es den Nutzern, bevorzugte Tankstellen zu speichern, um schnell auf deren Preise zugreifen zu können.
- **Detailansicht:** Bietet zusätzliche Informationen zu jeder Tankstelle, einschließlich Adresse, Öffnungszeiten und Entfernung.

## Installation

### Repository klonen:
```bash
git clone https://github.com/yourusername/tankpreis-app.git
cd tankpreis-app
```

### Abhängigkeiten installieren:

Stelle sicher, dass Node.js und npm (oder Yarn) installiert sind, und führe dann aus:

```bash
npm install
```
oder

```bash
yarn install
```
### API-Schlüssel einrichten:

Die App verwendet die Tankerkönig API. Um die App zu nutzen, musst du den Demo-API-Schlüssel im Projekt durch einen echten Schlüssel ersetzen, den du von der Tankerkönig-Website erhalten kannst.

Ersetze den Schlüssel in der ../src/api/tankerkönigApi.js Datei.

```javascript
const API_KEY = 'dein_echter_api_schlüssel';
```
### App starten:


Für iOS:

```bash
npx react-native run-ios
```
Für Android:

```bash
npx react-native run-android
```
## Nutzung

- **Tankstellen anzeigen:** Öffne die App, um eine Liste der nahegelegenen Tankstellen zu sehen. Die Preise werden automatisch aktualisiert.
- **Favoriten hinzufügen:** Wähle eine Tankstelle aus der Liste und füge sie zu deinen Favoriten hinzu, um schnell auf ihre Preise zugreifen zu können.
- **Detailansicht:** Klicke auf eine Tankstelle, um mehr Details zu sehen, wie die Adresse und die Öffnungszeiten.

## Abhängigkeiten

- **React Native:** Framework zum Erstellen mobiler Anwendungen.
- **Tankerkönig API:** Wird verwendet, um aktuelle Kraftstoffpreise abzurufen.
- **Weitere Abhängigkeiten:** Siehe `package.json` für eine vollständige Liste der verwendeten Bibliotheken.


## Bekannte Probleme

- **Fehlender API-Schlüssel:** Wenn kein gültiger API-Schlüssel bereitgestellt wird, werden keine Tankstellen angezeigt.
- **Keine Internetverbindung:** Die App benötigt eine aktive Internetverbindung, um die neuesten Kraftstoffpreise abzurufen.

## Lizenzen von Drittanbietern

Diese Anwendung nutzt die Tankerkönig API ([https://www.tankerkoenig.de](https://www.tankerkoenig.de)) für die Bereitstellung von Kraftstoffpreisen. Alle Rechte an dieser API liegen beim jeweiligen Inhaber.

## Beiträge

Beiträge zu diesem Projekt sind willkommen. Bitte öffne ein Issue oder erstelle einen Pull-Request.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe die `LICENSE` Datei für weitere Details.


