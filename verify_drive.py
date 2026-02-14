from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        try:
            page.goto("http://localhost:8000/map.html")

            # Wait for canvas
            page.wait_for_selector("canvas", timeout=5000)

            # Wait for HUD
            page.wait_for_selector("#speedDisplay", timeout=5000)

            # Check car pos
            car_pos = page.evaluate("() => { if(typeof carGroup !== 'undefined') return carGroup.position; return null; }")
            print(f"Car Position: {car_pos}")

            if car_pos and car_pos['x'] == 0 and car_pos['z'] == 0:
                print("Warning: Car still at 0,0,0 (Might be default fallback or coincidence)")
            else:
                print("Car spawned at valid location")

            time.sleep(1)
            page.screenshot(path="verification_drive_fixed.png")
            print("Screenshot saved to verification_drive_fixed.png")

        except Exception as e:
            print(f"Error: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    run()
