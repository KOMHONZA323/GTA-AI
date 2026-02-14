from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            page.goto("http://localhost:8000/map.html")
            page.wait_for_selector("canvas", timeout=5000)

            # Get initial position
            pos1 = page.evaluate("() => { return carGroup.position; }")
            print(f"Start Position: {pos1}")

            # Press W to drive forward
            page.keyboard.down("w")
            time.sleep(1) # Drive for 1 second
            page.keyboard.up("w")

            # Get new position
            pos2 = page.evaluate("() => { return carGroup.position; }")
            print(f"End Position: {pos2}")

            # Check movement
            dist = ((pos2['x'] - pos1['x'])**2 + (pos2['z'] - pos1['z'])**2)**0.5
            print(f"Distance Driven: {dist}")

            if dist > 0.5:
                print("SUCCESS: Car moved significantly.")
            else:
                print("WARNING: Car did not move much.")

            page.screenshot(path="verification_drive_move.png")

        except Exception as e:
            print(f"Error: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    run()
