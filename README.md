# 📌 Next.js Project with WordPress CMS

This project is built with [Next.js](https://nextjs.org) using [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), and uses WordPress as a CMS for content management. It includes custom plugins for managing data, media files, and interactive components.

---

## 📖 Table of Contents

* [Installation & Usage](#installation--usage)
* [WordPress Integration](#wordpress-integration)
* [Custom Plugins](#custom-plugins)
* [Using Media Files](#using-media-files)
* [Available Components](#available-components)
* [Helpful Tips](#helpful-tips)
* [Contributions](#contributions)

---

## 🚀 Installation & Usage

First, start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The changes will be applied automatically.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load and optimize fonts like [Geist](https://vercel.com/font).

---

## 🔌 WordPress Integration

### 1️⃣ Plugin: Data Manager

This plugin allows you to create and manage applications, defining their behavior and content. Each application can be configured with:

* **Application Type:** `Desktop` | `Options`
* **Auto Open:** `Yes` | `No`
* **Content Type:** `Themes` | `Information` | `Music` | `Folder` | `Hyperlink` | `Video`
* **Reference ID:** Dynamically links to other applications.
* **Position X / Y:** Sets the window's position when opened on the desktop.

#### Specific options based on content type:

* **Themes:** `Theme URL`, `Title`
* **Information:** `Title`
* **Music:** `Track Name`, `Album`, `Image`, `Playback URL`
* **Folder:** Files managed via the **Media** plugin
* **Hyperlink:** External URL
* **Video:** Link to uploaded video file

📌 **Component Linking Example:**  
The **Reference ID** field enables linking between elements. It can be obtained from either the **Data Control** or **Media Control** plugin, allowing structured navigation between windows.

---

### 2️⃣ Plugin: Data Control & Media Control

**Data Control:** Allows you to view, manage, and delete data created via the **Data Manager**.

**Media Control:** Provides an enhanced and detailed view of uploaded media files.

---

### 3️⃣ Plugin: Media (File Management)

This plugin allows uploading, viewing, and editing media files. It supports:

* 📷 Images  
* 🎥 Videos  
* 🎵 Audio  
* 📄 PDF or text documents

Each file can be edited with the following fields:

* **Title**
* **Description:** Used to link to specific folders, video apps, or define special behaviors like setting as background or showing on desktop.
* **Caption:** Where the Reference ID is added to link with other components.
* **Custom Icon:** Especially used when the file is added to the desktop.
* **Position X / Y:** Sets its position when displayed on screen.

📌 **Set a default background image:**  
Write `default` in the **Description** field.

📌 **Add files to the desktop:**  
Write `desktop` in the **Description** field.

---

## 📁 Using Folder-Type Applications

To assign files to a **Folder** type application, follow these steps:

1️⃣ **Create an app in the Data Manager:**

* Select `Folder` as the **Content Type**.
* Name the app (e.g., `My Documents`).

2️⃣ **Upload files to the Media plugin:**

* Upload the files.
* Edit each file and write the exact folder name (e.g., `My Documents`) in the **Description** field.

✅ **Result:** The files will be visible inside the corresponding folder application.

---

## 🎬 Using Videos in the Media Player

To make a video file accessible from the **Media Player**, assign the value `Multimedia` to the **Description** field of the file.

---

## 🧩 Available Components

The following components are ready to use in the system:

* 📁 `Folder`  
* ℹ `Information`  
* 🎵 `Music`  
* 🎨 `Themes`  
* 🔗 `Hyperlink`  
* 📽 `Video`  

---

## 💡 Helpful Tips

🔹 **How to get a media file URL**

1. Upload the file using the **Media** plugin.  
2. Click on the file.  
3. Copy the **File URL**.  
4. Paste it into any configurable field within your apps.

🛠 **This system allows you to manage dynamic content visually, in a structured manner, with high flexibility for linking components.**
