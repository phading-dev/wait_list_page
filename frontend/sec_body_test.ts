import "../prod/env";
import path = require("path");
import { SecBody } from "./sec_body";
import { setDesktopView, setPhoneView, setTabletView } from "./view_port";
import { TEST_RUNNER, TestCase } from "@selfage/puppeteer_test_runner";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";

TEST_RUNNER.run({
  name: "BodyTest",
  cases: [
    new (class implements TestCase {
      public name = "DesktopView_TabletView_PhoneView";
      private cut: SecBody;
      public async execute() {
        // Prepare
        await setDesktopView();

        // Execute
        this.cut = new SecBody(document, undefined);

        // Verify
        await asyncAssertScreenshot(
          path.join(__dirname, "/sec_body_desktop.png"),
          path.join(__dirname, "/golden/sec_body_desktop.png"),
          path.join(__dirname, "/sec_body_desktop_diff.png"),
          {
            fullPage: true,
          },
        );

        // Execute
        await setTabletView();

        // Verify
        await asyncAssertScreenshot(
          path.join(__dirname, "/sec_body_tablet.png"),
          path.join(__dirname, "/golden/sec_body_tablet.png"),
          path.join(__dirname, "/sec_body_tablet_diff.png"),
          {
            fullPage: true,
          },
        );

        // Execute
        await setPhoneView();

        // Verify
        await asyncAssertScreenshot(
          path.join(__dirname, "/sec_body_phone.png"),
          path.join(__dirname, "/golden/sec_body_phone.png"),
          path.join(__dirname, "/sec_body_phone_diff.png"),
          {
            fullPage: true,
          },
        );

        // Execute
        this.cut.tabFanButton.val.click();

        // Verify
        await asyncAssertScreenshot(
          path.join(__dirname, "/sec_body_phone_fan.png"),
          path.join(__dirname, "/golden/sec_body_phone_fan.png"),
          path.join(__dirname, "/sec_body_phone_fan_diff.png"),
          {
            fullPage: true,
          },
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
  ],
});
