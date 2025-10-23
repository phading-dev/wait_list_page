import "../prod/env";
import path = require("path");
import { DanmakuBody } from "./danmaku_body";
import { setDesktopView, setPhoneView, setTabletView } from "./view_port";
import { TEST_RUNNER, TestCase } from "@selfage/puppeteer_test_runner";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";

TEST_RUNNER.run({
  name: "BodyTest",
  cases: [
    new (class implements TestCase {
      public name = "DesktopView_TabletView_PhoneView";
      private cut: DanmakuBody;
      public async execute() {
        // Prepare
        await setDesktopView();

        // Execute
        this.cut = new DanmakuBody(document, undefined);

        // Verify
        await asyncAssertScreenshot(
          path.join(__dirname, "/danmaku_body_desktop.png"),
          path.join(__dirname, "/golden/danmaku_body_desktop.png"),
          path.join(__dirname, "/danmaku_body_desktop_diff.png"),
          {
            fullPage: true,
            excludedAreas: [
              {
                x: 720,
                y: 120,
                width: 600,
                height: 340,
              },
            ],
          },
        );

        // Execute
        await setTabletView();

        // Verify
        await asyncAssertScreenshot(
          path.join(__dirname, "/danmaku_body_tablet.png"),
          path.join(__dirname, "/golden/danmaku_body_tablet.png"),
          path.join(__dirname, "/danmaku_body_tablet_diff.png"),
          {
            fullPage: true,
            excludedAreas: [
              {
                x: 50,
                y: 560,
                width: 600,
                height: 340,
              },
            ],
          },
        );

        // Execute
        await setPhoneView();

        // Verify
        await asyncAssertScreenshot(
          path.join(__dirname, "/danmaku_body_phone.png"),
          path.join(__dirname, "/golden/danmaku_body_phone.png"),
          path.join(__dirname, "/danmaku_body_phone_diff.png"),
          {
            fullPage: true,
            excludedAreas: [
              {
                x: 20,
                y: 735,
                width: 320,
                height: 185,
              },
            ],
          },
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
  ],
});
