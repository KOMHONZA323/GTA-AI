from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        try:
            page.goto("http://localhost:8000/game.html")
            print("Page loaded")

            # Wait for canvas with short timeout
            try:
                page.wait_for_selector("canvas", timeout=3000, state="attached")
                print("Canvas attached")
            except:
                print("Canvas wait failed")

            # Wait for speed update
            time.sleep(5)

            page.screenshot(path="verification_debug.png")
            print("Screenshot taken")
        except Exception as e:
            print(f"Script Error: {e}")
            try:
                page.screenshot(path="verification_error.png")
            except:
                pass

        browser.close()

if __name__ == "__main__":
    run()
