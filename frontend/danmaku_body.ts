import danmakuDemo = require("./asset/danmaku_demo.mp4");
import { ENV_VARS } from "../env_vars";
import { newWishlistRequest } from "../service_interface/client";
import { createSecountBrandIcon } from "./icons";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export class DanmakuBody {
  public static create(): DanmakuBody {
    return new DanmakuBody(document, SERVICE_CLIENT);
  }

  private viewPortMeta: HTMLMetaElement;
  private tailwindScript: HTMLScriptElement;
  public container = new Ref<HTMLDivElement>();
  public wishlistForm = new Ref<HTMLFormElement>();
  public wishlistToast = new Ref<HTMLDivElement>();
  private videoDemo = new Ref<HTMLVideoElement>();

  public constructor(
    private document: Document,
    private serviceClient: WebServiceClient,
  ) {
    this.load();
  }

  private async load(): Promise<void> {
    this.document.title = ENV_VARS.platformName;
    this.document
      .querySelectorAll("meta[name=viewport]")
      .forEach((el) => el.remove());
    this.viewPortMeta = this.document.createElement("meta");
    this.viewPortMeta.name = "viewport";
    this.viewPortMeta.content = "width=device-width, initial-scale=1";
    this.document.head.appendChild(this.viewPortMeta);

    this.tailwindScript = this.document.createElement("script");
    this.tailwindScript.src = "https://cdn.tailwindcss.com";
    this.document.head.appendChild(this.tailwindScript);
    // Wait for Tailwind script to load before rendering the body
    await new Promise<void>((resolve, reject) => {
      this.tailwindScript.addEventListener("load", () => resolve());
      this.tailwindScript.addEventListener("error", () =>
        reject(new Error("Failed to load Tailwind CSS")),
      );
    });

    this.document.body.classList.add(
      "bg-neutral-950",
      "text-neutral-100",
      "selection:bg-blue-600/25",
      "font-sans",
    );

    this.document.body.append(
      E.div(
        { ref: this.container },
        E.div(
          { class: "container mx-auto px-6 py-6 flex items-center" },
          createSecountBrandIcon(2),
        ),
        E.div(
          {
            class:
              "container mx-auto px-6 pt-8 md:pt-10 pb-16 md:pb-20 grid md:grid-cols-2 gap-12 items-center",
          },
          E.div(
            {}, // Left: Copy + Wishlist
            E.div(
              { class: "text-3xl font-bold tracking-tight mb-3" },
              E.text("Real‑time comment overlay "),
              E.span({ class: "text-neutral-300" }, E.text("(danmaku)")),
              E.text("."),
            ),
            E.div(
              { class: "text-lg text-neutral-300 mb-8" },
              E.text(
                "After all these years, YouTube still won’t ship comment overlay—and BiliBili/NicoNico haven’t gone all‑in globally. ",
              ),
            ),
            E.div(
              {
                class:
                  "bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg",
              },
              E.div(
                { class: "p-4 md:p-6" },
                E.div(
                  { class: "text-sm text-neutral-200 font-medium mb-3" },
                  E.text("Care about this too? Join the wishlist."),
                ),
                E.form(
                  {
                    ref: this.wishlistForm,
                    id: "wishlistForm",
                    class: "flex flex-col gap-4",
                  },
                  E.div(
                    { class: "flex flex-col sm:flex-row gap-4" },
                    E.input({
                      type: "email",
                      name: "email",
                      placeholder: "Your email",
                      class:
                        "flex-1 px-4 py-3 border border-neutral-700 bg-neutral-950 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60",
                      required: "true",
                    }),
                    E.button(
                      {
                        class:
                          "px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow",
                        type: "submit",
                      },
                      E.text("Join Wishlist"),
                    ),
                  ),
                  E.textarea({
                    name: "idea",
                    placeholder:
                      "Optional — e.g. density slider, per‑user mute, pause‑on‑hover, emoji packs…",
                    class:
                      "px-4 py-3 border border-neutral-700 bg-neutral-950 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60",
                    rows: "3",
                  }),
                  E.div(
                    { class: "text-sm text-neutral-400" },
                    E.text(
                      "We’ll only email you prototypes and launch updates. No spam.",
                    ),
                  ),
                ),
                E.div(
                  {
                    ref: this.wishlistToast,
                    id: "wishlistToast",
                    class: "hidden mt-3 text-sm text-emerald-300",
                  },
                  E.text("Thanks! You’re on the wishlist."),
                ),
              ),
            ),
          ),
          E.div(
            {
              class:
                "border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900",
            },
            E.video({
              ref: this.videoDemo,
              src: danmakuDemo,
              alt: "Comment overlay demo",
              class: "w-full h-auto block",
            }),
            E.div(
              {
                class:
                  "p-4 border-t border-neutral-800 flex items-center gap-4 text-sm text-neutral-400",
              },
              E.text(
                "Demo video credit: @mintfantome on YouTube. Enabled by Chrome extension: DanMage.",
              ),
            ),
          ),
        ),
        E.div(
          { class: "py-14" },
          E.div(
            {
              class:
                "container mx-auto px-6 grid md:grid-cols-3 gap-10 text-center",
            },
            E.div(
              {
                class:
                  "bg-neutral-900 border border-neutral-800 rounded-2xl p-6",
              },
              E.div(
                { class: "font-semibold text-xl mb-3" },
                E.text("Viewer comfort tools"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text("Filters and density controls — playful, not chaotic."),
              ),
            ),
            E.div(
              {
                class:
                  "bg-neutral-900 border border-neutral-800 rounded-2xl p-6",
              },
              E.div(
                { class: "font-semibold text-xl mb-3" },
                E.text("Permanent ownership"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Your favorite videos can be saved to your own storage space. Forever replayable.",
                ),
              ),
            ),
            E.div(
              {
                class:
                  "bg-neutral-900 border border-neutral-800 rounded-2xl p-6",
              },
              E.div({ class: "font-semibold text-xl mb-3" }, E.text("No ads")),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Pure focus on content and community. No interruptions.",
                ),
              ),
            ),
          ),
        ),
        E.div(
          { class: "container mx-auto px-6 py-16" },
          E.div(
            { class: "text-3xl font-bold text-center mb-10" },
            E.text("FAQ"),
          ),
          E.div(
            { class: "max-w-2xl mx-auto space-y-6" },
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("What is danmaku / comment overlay?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Danmaku is real-time comments that float across the screen while you watch. It makes watching feel like hanging out together, not watching alone.",
                ),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("Is this for livestreams or uploaded videos?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Both — but we’re starting with uploaded videos first. Live streaming and more media formats comes later.",
                ),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("Do I need to install anything?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text("No. The experience runs directly in the browser."),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("Will comments be chaotic and unreadable?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text("No — viewer comfort tools are built-in, including density slider and speed controls. Playful, but not overwhelming."),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("Can I save a video to keep forever?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text("Yes. If you saved it, it stays in your personal library, even if the creator deletes it. Think of it like buying a physical DVD — even if the store stops selling it, your copy is still yours."),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("Does this mean creators lose control?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text("No. Creators choose whether their videos can be saved or not when they upload. If they mark a video as “streaming only,” viewers can watch but can’t keep a copy."),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("Can I download my saved videos?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text("Yes. Your library is yours. You can download your saved videos anytime."),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("Can I share or reupload what I saved?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text("No. Your saved copies are for personal viewing only, like keeping a book or DVD. You own your copy to watch, not to redistribute."),
              ),
            ),
          ),
        ),
        E.div(
          {
            class:
              "bg-neutral-900 border-t border-neutral-800 py-10 text-center text-neutral-400 text-sm",
          },
          E.div(
            {},
            E.text("Questions? Reach us at "),
            E.a(
              {
                href: "mailto:contact@secount.com",
                class: "text-blue-400 hover:text-blue-300 underline",
              },
              E.text("contact@secount.com"),
            ),
          ),
          E.div(
            { class: "mt-2" },
            E.text(
              "We’ll only use your email for prototypes and launch updates.",
            ),
          ),
        ),
      ),
    );
    this.wishlistForm.val.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.joinWaitList(this.wishlistForm.val);
    });
    this.videoDemo.val.muted = true;
    this.videoDemo.val.loop = true;
    this.videoDemo.val.autoplay = true;
  }

  private async joinWaitList(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const idea = formData.get("idea") as string | null;
    await this.serviceClient.send(
      newWishlistRequest({
        email,
        feature: "danmaku",
        idea,
      }),
    );
    form.reset();
    this.wishlistToast.val.classList.remove("hidden");
  }

  public remove(): void {
    this.document.body.classList.remove(
      "bg-neutral-950",
      "text-neutral-100",
      "font-sans",
    );
    this.container.val.remove();
    this.viewPortMeta.remove();
    this.tailwindScript.remove();
  }
}
