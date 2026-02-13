from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            page.goto("http://localhost:8000/map.html")

            # Wait for canvas
            page.wait_for_selector("canvas", timeout=5000)

            # Click to draw some cars
            # Center
            page.mouse.click(400, 300)
            time.sleep(0.5)
            # Offset
            page.mouse.click(500, 350)
            time.sleep(0.5)

            page.screenshot(path="verification_map.png")
            print("Screenshot taken")
        except Exception as e:
            print(f"Error: {e}")

        browser.close()

if __name__ == "__main__":
    run()
