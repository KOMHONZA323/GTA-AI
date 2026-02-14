from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/game.html")

        # Wait for canvas
        page.wait_for_selector("canvas")

        # Wait for HUD to update
        # Check if speed is visible and has text (initially '0')
        page.wait_for_selector("#speed", state="visible")

        # Wait a bit for the scene to render and cars to spawn
        time.sleep(5)

        # Take screenshot
        page.screenshot(path="verification.png")
        browser.close()

if __name__ == "__main__":
    run()
