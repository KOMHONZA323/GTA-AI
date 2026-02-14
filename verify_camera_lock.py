from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            page.goto("http://localhost:8000/map.html")
            page.wait_for_selector("canvas", timeout=5000)

            # Start turning immediately
            print("Turning...")
            page.keyboard.down("d")
            page.keyboard.down("w")
            time.sleep(2) # Drive/turn for 2 seconds
            page.keyboard.up("w")
            page.keyboard.up("d")

            # Check if car is roughly center-screen (by screenshot)
            # The previous code made the car go to the left edge during a right turn.
            # Now it should be centered.

            page.screenshot(path="verification_drive_turn_lock.png")
            print("Screenshot saved to verification_drive_turn_lock.png")

        except Exception as e:
            print(f"Error: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    run()
