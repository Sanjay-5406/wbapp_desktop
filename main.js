// main.js
const { app, BrowserWindow, ipcMain, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');





// checking whether custom image is present or not wbapp-python
function ensureDockerImage() {
  return new Promise((resolve, reject) => {
    exec("docker image inspect wbapp-pyimage", (err) => {
      if (!err) {
        console.log("Docker image already exists.");
        return resolve();
      }

      console.log("Building Docker image...");

      // Resolve the absolute path to the 'docker' folder
      const dockerDirPath = path.join(__dirname, 'docker');

      exec(
        `docker build -t wbapp-pyimage "${dockerDirPath}"`,
        (buildErr, stdout, stderr) => {
          console.log(stdout);
          console.log(stderr);

          if (buildErr) return reject(buildErr);

          resolve();
        }
      );
    });
  });
}






// Helper to determine your API backend origin
function getApiBaseUrl() {
  if (process.env.ELECTRON_START_URL) {
    return process.env.ELECTRON_START_URL;
  }
  return 'http://localhost:3000';
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'out/index.html')}`;
  mainWindow.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Helper function to download file via Electron's net.fetch
async function downloadFileWithFetch(rawUrl, destPath) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error(`Invalid URL parameter provided: ${rawUrl}`);
  }

  let fullUrl = rawUrl;

  // Prepend base origin if a relative API path was passed
  if (rawUrl.startsWith('/')) {
    const origin = getApiBaseUrl();
    fullUrl = new URL(rawUrl, origin).href;
  }

  // 1. Fetch endpoint
  let response = await net.fetch(fullUrl);

  if (!response.ok) {
    throw new Error(`Server returned HTTP status ${response.status} (${response.statusText})`);
  }

  let fileText = await response.text();

  // 2. Inspect for Supabase JSON payload containing signed URL
  if (fileText.trim().startsWith('{') && fileText.includes('"url"')) {
    try {
      const jsonData = JSON.parse(fileText);
      const signedUrl = jsonData.url || jsonData.downloadUrl || jsonData.signedUrl;

      if (signedUrl) {
        console.log('🔗 Found Supabase Signed URL. Fetching actual script...');
        
        const fileResponse = await net.fetch(signedUrl);

        if (!fileResponse.ok) {
          throw new Error(`Failed to download from Supabase. HTTP ${fileResponse.status}`);
        }

        fileText = await fileResponse.text();
      }
    } catch (parseErr) {
      console.log('JSON Parse fallback, treating as raw script text.');
    }
  }

  // 3. Save actual Python script content to disk
  fs.writeFileSync(destPath, fileText, 'utf-8');
}

// Helper to convert Windows paths (C:\Users\...) to Docker POSIX paths (/c/Users/...)
function toDockerPath(winPath) {
  let normalized = winPath.replace(/\\/g, '/');
  if (process.platform === 'win32') {
    // "C:/Users/Dell/..." -> "/c/Users/Dell/..."
    normalized = normalized.replace(/^([a-zA-Z]):/, (match, drive) => '/' + drive.toLowerCase());
  }
  return normalized;
}


function createExecutionFolder(resultsDir, filename) {

  const baseName = path.parse(filename).name;

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-');

  const runFolder = path.join(
    resultsDir,
    `${baseName}_${timestamp}`
  );

  fs.mkdirSync(runFolder, { recursive: true });

  return runFolder;
}



// ==========================================
// IPC HANDLER: EXECUTE PYTHON FILE IN DOCKER
// ==========================================
ipcMain.handle('execute-python-docker', async (event, arg1, arg2) => {
  console.log("IPC execute-python-docker called");
  try {
    let url, filename;
    if (typeof arg1 === 'object' && arg1 !== null) {
      url = arg1.url;
      filename = arg1.filename;
    } else {
      url = arg1;
      filename = arg2;
    }

    if (!filename || !filename.toLowerCase().endsWith('.py')) {
      return { success: false, error: 'Only .py files are supported for execution.' };
    }

    const desktopPath = app.getPath('desktop');
    const exeDir = path.join(desktopPath, 'wbapp', 'exefiles');
    const resultsDir = path.join(desktopPath, 'wbapp', 'results');

    fs.mkdirSync(exeDir, { recursive: true });
    fs.mkdirSync(resultsDir, { recursive: true });
    
    const executionDir = createExecutionFolder(
        resultsDir,
        filename
    );
    const targetScriptPath = path.join(executionDir, filename);
    await ensureDockerImage();


    // Download script to local directory
    await downloadFileWithFetch(url, targetScriptPath);

    // Format local folder path into a Docker POSIX path (/c/Users/...)
    const dockerVolumePath = toDockerPath(exeDir);

    // Command uses -u for unbuffered Python output
    // const dockerCmd = `docker run --rm -v "${dockerVolumePath}:/app" python:3.11-slim python -u "/app/${filename}"`;
    // console.log('Running Command:', dockerCmd);
//     const dockerCmd =
// `docker run --rm -v "${dockerVolumePath}:/app" wbapp-python python -u "/app/${filename}"`;
    const executionDockerPath = toDockerPath(executionDir);

//     const dockerCmd =
// `docker run --rm -v "${executionDockerPath}:/app" wbapp-pyimage python -u /app/runner.py /app/${filename}`;
    const dockerCmd = `docker run --rm -v "${executionDockerPath}:/app" wbapp-pyimage python -u /opt/runner.py /app/${filename}`;

    const outputData = await new Promise((resolve) => {
      exec(dockerCmd, { timeout: 30000 }, (error, stdout, stderr) => {
        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);
        console.log("ERROR:", error);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logHeader = `=== Execution Log for ${filename} [${new Date().toLocaleString()}] ===\n\n`;

        let content = logHeader;
        if (stdout) content += `[STDOUT]:\n${stdout}\n`;
        if (stderr) content += `[STDERR]:\n${stderr}\n`;
        if (error) content += `[EXEC ERROR]:\n${error.message}\n`;

        resolve({
          content,
          rawOutput: stdout || stderr || error?.message || 'Execution finished with no output.',
          timestamp,
        });
      });
    });

    const baseName = path.parse(filename).name;
    const resultFilename = `${baseName}_result_${outputData.timestamp}.txt`;
    const resultFilePath = path.join(
        executionDir,
        "execution_log.txt"
    );

    fs.writeFileSync(
        resultFilePath,
        outputData.content,
        "utf-8"
    );

    fs.writeFileSync(resultFilePath, outputData.content, 'utf-8');

    const generatedFiles = fs.readdirSync(executionDir);

    console.log(
        "Generated files:",
        generatedFiles
    );


    return {
      success: true,
      message: `Executed successfully! Saved to Desktop/wbapp/results/${resultFilename}`,
      output: outputData.rawOutput,
      savedFile: resultFilePath,
    };

  } catch (err) {
    return { success: false, error: err.message || 'An unknown error occurred.' };
  }
});