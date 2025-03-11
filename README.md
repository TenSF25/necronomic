# Next.js project with WordPress CMS

This is a project based on [Next.js](https://nextjs.org) using [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and WordPress as CMS for content management.

## 📖 Table of Contents
- [Installation and Usage](#installation-and-usage)
- [Content Management with WordPress](#content-management-with-wordpress)
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

You can start editing the page by editing `app/page.tsx`. The changes will be reflected automatically.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load and optimize fonts such as [Geist](https://vercel.com/font).

---

## 📂 Content Management with WordPress

To manage the content, WordPress is used with custom plugins.
You can access the administration panel here:
🔗 [WordPress Dashboard](https://necronomicapitalism.cloud/wp-admin)

### 🔌 Plugins

#### **Data Manager**
Allows you to upload applications and define their content.
It has the following options:

- **Type of App**:
- `Desktop`: Displays the app on the desktop.
- `Options`: The app appears in a selection menu at the top left.

- **Auto Open** (`Yes / No`): Defines whether the app opens automatically when the application is started.

- **Content Type** (Type of content within the app):
- `Themes`: Wallpapers with image and title.
- `Info`: Textual information within an app.
- `Hyperlinked`: Links to external pages.
- `Music`: Audio files with title, album, image and URL.
- `Folder`: Allows uploading files organized in folders.

🔹 **Note**: When creating an app, the name must match that of the component to be used (except in `Folder` type apps, where I am working on improving this restriction).

#### **Data Control**
Manages the data created in **Manager of Data**, allowing you to delete or consult it.

---

### 📁 Media

The **Media** plugin allows you to upload files (images, videos, audios, etc.).
Each uploaded file can be edited to add information such as title and description.

#### **Usage for `Folder` Apps**
To assign files to a `Folder` app, follow these steps:

1. **Create the App in `Manager of Data`**
- Choose `Folder` as the content type.
- Assign a name (example: `MyDocuments`).

2. **Upload Files in `Media`**
- Upload the file in the **Media** plugin.
- Edit the file and in the **Description** field, enter exactly the same name as the `Folder` app (`MyDocuments` in this case).

3. **Result**
- Files with the description `MyDocuments` will be automatically assigned to the `MyDocuments` app within the system.

#### **Usage for Videos in `Media Player`**
To have a **video** file appear in the video player, type `"Media"` in the **Description** of the file under **Media**.

---

## 🧩 Available Components
The following components are ready to be used in the app:

- 📁 `Folder`
- ℹ `Information`
- 🎵 `Music`
- 🎨 `Themes`
- 📽 `Video`

---

## 💡 Useful Tips

🔹 If you need a URL for an image, audio, or any file you have locally:
1. Upload it to **Media**.
2. Click on the uploaded file.
3. Copy the **File URL**.
4. Use that URL in your apps.

### 🛠️ Developed with ❤️ by Thiago
