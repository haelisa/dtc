(intern - für Projektteam)

# Installation

- IDE: Visual Studio Code
(- API Plattform: Insomnia / Postman)
(- Docker & Docker compose)
- node.js (LTS): [Download-Website](https://nodejs.org/en/download)
- Angular: in Kommandozeile: `npm install -g @angular/cli`
- NestJS: in Kommandozeile: `npm install -g @nestjs/cli`

## Hilfreiche VSC Extensions
- PowerShell (Microsoft) -> PowerShell Terminal
- Live Server (Ritwick Dey) -> für Launch auf Smartphone 
- Auto Close Tag (Jun Han) -> HTML Auto Close Tags
- Auto Rename Tag (Jun Han) -> HTML Auto Rename Tags


# Anwendung starten

## Frontend
- Für Backend-Funktionalitäten in den jeweiligen Frontenddateien die eigene IPv4-Adresse angeben bspw. in 'helloworld.components.ts' (siehe unten) 
- `cd ./downtimecapture/frontend`
- `ng serve -o --host 0.0.0.0`
- Browser öffnet sich automatisch auf 'localhost:4200'
- `--host` öffnet den internen Angular Server

## Backend
- 2. Terminal öffnen
- `cd ./downtimecapture/backend`
- `npm run start:dev`
- Browser öffnen auf 'localhost:3000'


# Test auf remote Smartphone
- beide Geräte müssen mit dem selben Netzwerk verbunden sein!
- über `ipconig` in Kommandozeile IPv4-Adresse finden
- vorgegebenen QR-Code aus (US 6)[https://inf-git.fh-rosenheim.de/sep-wif-23/downtimecapture/-/issues/47] scannen oder (Website)[http://localhost:4200/712-005/002d9403-185c-4328-8640-02681be5275e/1682396626/Mouse/Micky] öffnen
- in URL localhost mit eigener IPv4-Adresse austauschen