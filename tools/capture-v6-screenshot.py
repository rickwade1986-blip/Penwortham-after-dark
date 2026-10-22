#!/usr/bin/env python3
"""Capture a real Phaser frame using Chrome DevTools, without waiting for an infinite game loop to exit."""
import base64
import json
import os
import shutil
import subprocess
import time
import urllib.request
import websocket

CHROME = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
if not CHROME:
    raise SystemExit("Chrome executable not found")
PORT = 9225
URL = os.environ.get("PENWORTHAM_CAPTURE_URL", "http://127.0.0.1:8000/v5/index.html?reset=1")
args = [
    CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
    "--enable-unsafe-swiftshader", "--disable-dev-shm-usage",
    "--remote-allow-origins=*", "--remote-debugging-port=" + str(PORT),
    "--window-size=1600,900", "--hide-scrollbars", URL,
]
chrome = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
sock = None
try:
    endpoint = None
    for _ in range(100):
        if chrome.poll() is not None:
            raise RuntimeError("Chrome exited during startup")
        try:
            data = json.load(urllib.request.urlopen("http://127.0.0.1:%s/json" % PORT, timeout=1))
            pages = [t for t in data if t.get("type") == "page" and "v5/index.html" in t.get("url", "")]
            if pages:
                endpoint = pages[0]["webSocketDebuggerUrl"]
                break
        except Exception:
            pass
        time.sleep(.15)
    if not endpoint:
        raise RuntimeError("Chrome page target not found")

    sock = websocket.create_connection(endpoint, timeout=12)
    sequence = 0
    def command(method, params=None):
        global sequence
        sequence += 1
        seq = sequence
        sock.send(json.dumps({"id": seq, "method": method, "params": params or {}}))
        while True:
            value = json.loads(sock.recv())
            if value.get("id") != seq:
                continue
            if "error" in value:
                raise RuntimeError(method + ": " + str(value["error"]))
            return value.get("result", {})

    command("Page.enable")
    command("Runtime.enable")
    rendered = False
    for _ in range(85):
        value = command("Runtime.evaluate", {"expression":
            "document.body.dataset.v5Ready === 'true' && !!document.querySelector('#game canvas')",
            "returnByValue": True})
        if value.get("result", {}).get("value") is True:
            rendered = True
            break
        time.sleep(.25)
    if not rendered:
        raise RuntimeError("Phaser did not render the Tap scene")
    time.sleep(1.25)
    capture = command("Page.captureScreenshot", {
        "format": "png", "captureBeyondViewport": False, "fromSurface": True
    })
    raw = base64.b64decode(capture["data"])
    if len(raw) < 100_000:
        raise RuntimeError("Screenshot suspiciously small: %s bytes" % len(raw))
    output = os.environ.get("PENWORTHAM_CAPTURE_FILE", "v6-tap.png")
    with open(output, "wb") as out:
        out.write(raw)
    print("Captured %s: %s bytes" % (output, len(raw)))
finally:
    if sock is not None:
        sock.close()
    chrome.terminate()
    try:
        chrome.wait(timeout=5)
    except subprocess.TimeoutExpired:
        chrome.kill()
