# 📌 Next.js Project with WordPress CMS

This project is based on [Next.js](https://nextjs.org) and uses [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) with WordPress as the CMS for content management. It includes custom plugins for data and media management.

---

## 📖 Table of Contents
- [Installation and Usage](#installation-and-usage)
- [Integration with WordPress](#integration-with-wordpress)
- [Plugins](#plugins)
- [Media](#media)
- [Available Components](#available-components)
- [Helpful Tips](#helpful-tips)
- [Contributions](#contributions)

---

## 🚀 Installation and Usage

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

Then, open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The changes will be reflected automatically.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load and optimize fonts such as [Geist](https://vercel.com/font).

---

## 🔌 Integration with WordPress

### **1️⃣ Plugin: Data Manager**
This plugin allows the management of applications and the definition of their content. The following configurations can be made:

- **Application Type:** `Desktop` | `Options`
- **Auto-Open:** `Yes` | `No`
- **Content Type:** `Themes` | `Information` | `Music` | `Folder` | `Hyperlink` | `Video`
- **Custom options by content type:**
  - `Themes`: `Theme URL` and `Title` (Example: Visual theme name)
  - `Information`: `Title` (Example: "About Us")
  - `Music`: `NameMusic`, `Album`, `ImageMusic`, `UrlMusic`
  - `Folder`: File management using the **Media** plugin
  - `Hyperlink`: Allows linking to an external URL.
  - `Video`: Link to multimedia content uploaded to the system.

📌 **Example of Connection between Components:**
To establish links between different internal components, the `Reference ID` field is used, available in any content type within the **Data Manager**. This ID is obtained from the **Data Control Plugin** and allows elements within the system to be dynamically linked.

---

### **2️⃣ Plugin: Data Control**
This plugin manages the data created in the **Data Manager**, allowing it to be viewed and deleted as needed.

---

### **3️⃣ Plugin: Media (File Management)**
This plugin allows the upload and editing of multimedia files such as:
- 📷 Images
- 🎥 Videos
- 🎵 Audios
- 📄 PDF or text documents

Each uploaded file can be edited to add:
- **Title**
- **Description** (to link it to specific folders)
- **Caption** (where a reference is assigned to link it to another component)

📌 **Setting a Default Wallpaper**
To establish a default background image, type `default` in the **Description** field of the file within the **Media** plugin.

---

## 📁 Using Folder Apps
To assign files to a **Folder**-type application, follow these steps:

1️⃣ **Create the application in the Data Manager**
- Select `Folder` as the **Content Type**.
- Assign a name (Example: `My Documents`).

2️⃣ **Upload files in the Media plugin**
- Upload the files to **Multimedia**.
- Edit each file and, in the **Description** field, type the exact name of the folder (Example: `My Documents`).

✅ **Result:** Files with the description `My Documents` will be automatically assigned to the `My Documents` application within the system.

---

## 🎬 Using Videos in the Media Player
To have a video file appear in the **Media Player**, type `Multimedia` in the **File Description** field within the **Media** plugin.

---

## 🧩 Available Components
The following components are ready to use in the application:

- 📁 `Folder`
- ℹ `Information`
- 🎵 `Music`
- 🎨 `Themes`
- 🔗 `Hyperlink`
- 📽 `Video`

---

## 💡 Helpful Tips

🔹 **Get the URL of a media file**
1. Upload the file in **Media**.
2. Click on the uploaded file.
3. Copy the **File URL**.
4. Use that URL in your applications.

---

🛠 **This system facilitates the administration of dynamic content, allowing the structured and automated linking of files, multimedia, and components.**
