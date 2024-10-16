# VitaVoice

**VitaVoice** is a mobile voice assistant designed to empower seniors by providing personalized health support and companionship. By utilizing voice interactions, the application helps users manage their daily routines and stay on top of important activities like medications, appointments, and healthy habits. It also aims to combat loneliness through meaningful conversations, ultimately improving overall well-being.

---

## Introduction

VitaVoice is dedicated to creating a voice assistant tailored for seniors, with the goal of significantly improving their daily lives through voice interactions and providing personalized health support. 

The voice assistant will help seniors maintain healthy habits by gently reminding them about medications, appointments, and daily activities. It will also provide companionship and engage in meaningful conversations to help combat loneliness. By recording and analyzing voice data, the assistant will support better health management, allowing timely interventions and personalized care. 

Ultimately, the application aims to empower seniors to live more independently and with greater peace of mind.

---

## Features

- **Medication Reminders**: Timely, gentle reminders to help users stay on track with their medications.
- **Appointment Reminders**: Notifications about upcoming medical appointments to help users stay prepared.
- **Healthy Habits**: Encourages healthy behaviors like walking, checking blood pressure, sugar levels, and maintaining sleep routines.
- **Companionship**: Engages in conversations to provide emotional support and alleviate loneliness.
- **Speech Analysis & Emotion Detection**: Analyzes user speech to detect emotional cues like stress or fatigue, offering personalized suggestions.
- **Health Reports**: Records user interaction data to generate monthly health reports and alerts doctors if needed.

---

## Architecture

The system is divided into several major components:

- **Mobile App (React Native)**: The user interface for voice interaction, reminders, and notifications.
- **Backend (Node.js)**: Manages API requests, connects with the database, and handles business logic.
- **Database (MongoDB)**: Stores user data such as profiles, reminders, health reports, and interaction history.
- **AI/ML Module (Python)**: Handles voice interaction processing, emotion detection, and speech-to-text conversions.
- **Notification Service**: Sends push notifications and alerts for reminders and health updates (via Firebase).

---

## Branches

- **main**: Contains the primary version of the project.
- **design**: Includes design components, such as the application UI and UML diagrams.
- **mobile-app**: Houses the code for the mobile application (React Native).
- **ai-ml**: Contains AI/ML-based features, including emotion detection and speech analysis (Python).
- **database**: Code related to database integration (MongoDB).
- **backend**: Contains backend logic for APIs and server-side processing (Node.js).

---

## Figma Design Link

You can explore the app design on Figma using the link below:

[Figma Design](https://www.figma.com/proto/2bsdyAoSByOQaL1b2L7sXQ/VitaVoice?node-id=154-463&node-type=canvas&t=ncTtDgX0XsY34CTV-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1)
