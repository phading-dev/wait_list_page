import { ENV_VARS } from "../env_vars";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { createFandazyBrandIcon } from "./icons";

export class FanBody {
  private viewPortMeta: HTMLMetaElement;
  private tailwindScript: HTMLScriptElement;
  private container = new Ref<HTMLDivElement>();
  public tabCreatorButton = new Ref<HTMLButtonElement>();
  private creatorNote = new Ref<HTMLDivElement>();
  public tabFanButton = new Ref<HTMLButtonElement>();
  private fanNote = new Ref<HTMLDivElement>();
  private creatorForm = new Ref<HTMLFormElement>();
  private fanForm = new Ref<HTMLFormElement>();

  public constructor(private document: Document) {
    this.load();
  }

  private async load(): Promise<void> {
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
      "selection:bg-pink-500/30",
      "font-sans",
    );
    this.document.body.append(
      E.divRef(
        this.container,
        {},
        E.div(
          { class: "container mx-auto px-6 py-6 flex items-center" },
          createFandazyBrandIcon(2)
        ),
        E.div(
          {
            class:
              "container mx-auto px-6 pt-8 md:pt-10 pb-16 md:py-20 grid md:grid-cols-2 gap-12 items-center",
          },
          E.div(
            {},
            E.div(
              { class: "text-3xl font-bold tracking-tight mb-3" },
              E.text("Indulge your fantasy."),
            ),
            E.div(
              { class: "text-lg text-neutral-300 mb-8" },
              E.text("Earn more. Stay protected. Grow your audience."),
            ),
            E.div(
              {
                class:
                  "bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg",
              },
              E.div(
                { class: "flex" },
                E.buttonRef(
                  this.tabCreatorButton,
                  {
                    id: "tabCreator",
                    class:
                      "flex-1 px-4 py-3 font-medium rounded-tl-2xl border-b-2 border-pink-500 hover:text-neutral-200",
                    type: "button",
                  },
                  E.text("I'm a Creator"),
                ),
                E.buttonRef(
                  this.tabFanButton,
                  {
                    id: "tabFan",
                    class:
                      "flex-1 px-4 py-3 font-medium rounded-tr-2xl border-b-2 border-transparent text-neutral-400 hover:text-neutral-200",
                    type: "button",
                  },
                  E.text("I'm a Fan"),
                ),
              ),
              E.div(
                { class: "p-5 md:p-6" },
                E.formRef(
                  this.creatorForm,
                  {
                    id: "creatorForm",
                    class: "flex flex-col sm:flex-row gap-4",
                  },
                  E.input({
                    type: "email",
                    name: "email",
                    placeholder: "Creator email",
                    class:
                      "flex-1 px-4 py-3 border border-neutral-700 bg-neutral-950 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60",
                    required: "true",
                  }),
                  E.input({
                    type: "hidden",
                    name: "role",
                    value: "creator",
                  }),
                  E.button(
                    {
                      class:
                        "px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium shadow",
                      type: "submit",
                    },
                    E.text("Join as Creator"),
                  ),
                ),
                E.divRef(
                  this.creatorNote,
                  { class: "text-xs text-neutral-400 mt-3" },
                  E.text(
                    "Help us shape the roadmap by joining early betas and feedback sessions.",
                  ),
                ),
                E.formRef(
                  this.fanForm,
                  {
                    id: "fanForm",
                    class: "hidden flex flex-col sm:flex-row gap-4",
                  },
                  E.input({
                    type: "email",
                    name: "email",
                    placeholder: "Fan email",
                    class:
                      "flex-1 px-4 py-3 border border-neutral-700 bg-neutral-950 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60",
                    required: "true",
                  }),
                  E.input({
                    type: "hidden",
                    name: "role",
                    value: "fan",
                  }),
                  E.button(
                    {
                      class:
                        "px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium shadow",
                      type: "submit",
                    },
                    E.text("Join as Fan"),
                  ),
                ),
                E.divRef(
                  this.fanNote,
                  { class: "text-xs text-neutral-400 mt-3" },
                  E.text("We’ll only use your email for updates. No spam."),
                ),
              ),
            ),
          ),
          E.div(
            {
              class:
                "bg-neutral-900 border border-neutral-800 rounded-2xl h-72 md:h-80 flex items-center justify-center",
            },
            E.span(
              { class: "text-neutral-500" },
              E.text("[Mockup Image of Video Grid]"),
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
                E.text("Refunds that build trust"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Fans feel safer to buy with built-in refunds, just like free returns. Creators stay shielded from chargebacks.",
                ),
              ),
            ),
            E.div(
              {
                class:
                  "bg-neutral-900 border border-neutral-800 rounded-2xl p-6",
              },
              E.div(
                { class: "font-semibold text-xl mb-3" },
                E.text("Transparent fees"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Keep ~80% of what you earn: 5% platform + ~15% adult‑industry processing. Fans cover the fixed top-up fee, not you.",
                ),
              ),
            ),
            E.div(
              {
                class:
                  "bg-neutral-900 border border-neutral-800 rounded-2xl p-6",
              },
              E.div(
                { class: "font-semibold text-xl mb-3" },
                E.text("Content‑first experience"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "A clean, discovery‑friendly layout built for episodes, series, and libraries.",
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
                E.text("What is Fandazy?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Fandazy is a platform where fans support creators through subscriptions and rentals.",
                ),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("How do refunds work?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Fans can request a refund within a limited time window if they’ve barely consumed the content. This lowers hesitation and drives more sales.",
                ),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("Why are refunds good for creators?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Refunds boost sales by lowering hesitation — the same way free returns make people more confident when shopping online.",
                ),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("What about chargebacks?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Refunds are handled inside the platform, so most disputes never reach the bank. If someone still files a chargeback, we absorb the cost — creators stay fully protected.",
                ),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("How much does the platform take?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Creators keep ~80%. That’s a 5% platform cut plus ~15% for processing in the adult space. Fans also pay a small fixed processing fee on each top-up order, so you don’t.",
                ),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("What kinds of content are supported?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "We’re starting with video subscriptions and rentals, and expanding to custom sessions and direct fan interactions.",
                ),
              ),
            ),
            E.div(
              {},
              E.div(
                { class: "font-semibold mb-1" },
                E.text("When will the platform launch?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "We’re inviting creators and fans in waves from the waitlist. Sign up to be first.",
                ),
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
                href: `mailto:${ENV_VARS.contactEmail}`,
                class: "text-pink-400 hover:text-pink-300 underline",
              },
              E.text(ENV_VARS.contactEmail),
            ),
          ),
          E.div(
            { class: "mt-2" },
            E.text("We’ll only use your email for updates. No spam."),
          ),
        ),
      ),
    );

    this.tabCreatorButton.val.addEventListener("click", () =>
      this.activate("creator"),
    );
    this.tabFanButton.val.addEventListener("click", () => this.activate("fan"));
    this.activate("creator");
  }

  private activate(tab: "creator" | "fan") {
    const creatorForm = this.creatorForm.val;
    const creatorNote = this.creatorNote.val;
    const fanForm = this.fanForm.val;
    const fanNote = this.fanNote.val;
    const tabCreator = this.tabCreatorButton.val;
    const tabFan = this.tabFanButton.val;
    if (tab === "creator") {
      creatorForm.classList.remove("hidden");
      creatorNote.classList.remove("hidden");
      fanForm.classList.add("hidden");
      fanNote.classList.add("hidden");
      tabCreator.classList.remove("text-gray-500");
      tabFan.classList.add("text-gray-500");
      tabCreator.classList.replace("border-transparent", "border-pink-500");
      tabFan.classList.replace("border-pink-500", "border-transparent");
    } else {
      fanForm.classList.remove("hidden");
      fanNote.classList.remove("hidden");
      creatorForm.classList.add("hidden");
      creatorNote.classList.add("hidden");
      tabFan.classList.remove("text-gray-500");
      tabCreator.classList.add("text-gray-500");
      tabFan.classList.replace("border-transparent", "border-pink-500");
      tabCreator.classList.replace("border-pink-500", "border-transparent");
    }
  }

  public remove() {
    this.document.body.classList.remove(
      "bg-gray-50",
      "text-gray-900",
      "font-sans",
    );
    this.container.val.remove();
    this.viewPortMeta.remove();
    this.tailwindScript.remove();
  }
}
