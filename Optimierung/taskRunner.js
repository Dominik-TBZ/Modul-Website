const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;
const cssMinify = require('css-minify').minify;

// Funktion zum Löschen der Ziel-Dateien (z.B. public Ordner)
const deleteFiles = (folderPath) => {
  fs.readdirSync(folderPath).forEach(file => {
    const filePath = path.join(folderPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      deleteFiles(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });
};

// HTML minimieren
const minifyHTML = (filePath) => {
  const html = fs.readFileSync(filePath, 'utf-8');
  const minifiedHTML = minify(html, {
    collapseWhitespace: true,
    removeComments: true
  });
  fs.writeFileSync(filePath, minifiedHTML, 'utf-8');
};

// CSS minimieren
const minifyCSS = (filePath) => {
  const css = fs.readFileSync(filePath, 'utf-8');
  const minifiedCSS = cssMinify(css).styles;
  fs.writeFileSync(filePath, minifiedCSS, 'utf-8');
};

// Bilder und andere Ressourcen kopieren
const copyAssets = (srcFolder, destFolder) => {
  fs.readdirSync(srcFolder).forEach(file => {
    const srcPath = path.join(srcFolder, file);
    const destPath = path.join(destFolder, file);
    if (fs.lstatSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyAssets(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

// Hauptfunktion ausführen
const run = () => {
  const sourceDir = './src'; // Quellordner (Anpassen)
  const buildDir = './build'; // Zielordner (Anpassen)

  // Zielordner löschen
  deleteFiles(buildDir);

  // HTML und CSS minimieren
  const htmlFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => minifyHTML(path.join(sourceDir, file)));

  const cssFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.css'));
  cssFiles.forEach(file => minifyCSS(path.join(sourceDir, file)));

  // Bilder und Ressourcen kopieren
  const assetSourceDir = './assets'; // Anpassen je nach Ordnerstruktur
  const assetDestDir = './build/assets'; // Zielordner für Assets
  copyAssets(assetSourceDir, assetDestDir);

  console.log('Minimierung abgeschlossen und Ressourcen kopiert.');
};

run();
