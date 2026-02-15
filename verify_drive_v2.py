from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        try:
            # Navigate to the map page
            page.goto("http://localhost:8000/map.html")

            # Wait for canvas and HUD to ensure loading
            page.wait_for_selector("canvas", timeout=5000)
            page.wait_for_selector("#speedDisplay", timeout=5000)

            # Give physics a moment to settle
            time.sleep(2)

            # Check car position
            car_pos = page.evaluate("() => { if(typeof carGroup !== 'undefined') return carGroup.position; return null; }")
            print(f"Car Position: {car_pos}")

            if car_pos:
                y = car_pos['y']
                print(f"Car Y Position: {y}")
                if y > 0.8: # Close to 1.0
                    print("SUCCESS: Car is elevated on the road (y > 0.8).")
                elif y < 0.2:
                    print("WARNING: Car is low (y < 0.2), possibly clipping if on road.")
                else:
                    print(f"Car is at intermediate height {y}")
            else:
                print("ERROR: carGroup not found.")

            # Take a screenshot
            page.screenshot(path="verification_drive_v2.png")
            print("Screenshot saved to verification_drive_v2.png")

        except Exception as e:
            print(f"Error: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    run()
