import layoutImage = require("./images/1.png");
import { ENV_VARS } from "../env_vars";
import { newJoinWaitListRequest } from "../service_interface/client";
import { createSecountBrandIcon } from "./icons";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export class MainBody {
  public static create(): MainBody {
    return new MainBody(document, SERVICE_CLIENT);
  }

  private viewPortMeta: HTMLMetaElement;
  private tailwindScript: HTMLScriptElement;
  private container = new Ref<HTMLDivElement>();
  public tabCreatorButton = new Ref<HTMLButtonElement>();
  private creatorNote = new Ref<HTMLDivElement>();
  public tabFanButton = new Ref<HTMLButtonElement>();
  private fanNote = new Ref<HTMLDivElement>();
  private creatorForm = new Ref<HTMLFormElement>();
  private fanForm = new Ref<HTMLFormElement>();

  public constructor(
    private document: Document,
    private serviceClient: WebServiceClient,
  ) {
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
      "selection:bg-blue-600/25",
      "font-sans",
    );
    this.document.body.append(
      E.divRef(
        this.container,
        {},
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
            {},
            E.div(
              { class: "text-3xl font-bold tracking-tight mb-3" },
              E.text("Where every second counts."),
            ),
            E.div(
              { class: "text-lg text-neutral-300 mb-8" },
              E.text("Keep more. Worry less. Grow faster."),
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
                      "flex-1 px-4 py-3 font-medium rounded-tl-2xl border-b-2 border-blue-500 hover:text-neutral-200",
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
                { class: "p-4 md:p-6" },
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
                      "flex-1 px-4 py-3 border border-neutral-700 bg-neutral-950 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60",
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
                        "px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow",
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
                      "flex-1 px-4 py-3 border border-neutral-700 bg-neutral-950 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60",
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
                        "px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow",
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
                "border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900",
            },
            E.image({
              src: layoutImage,
              alt: "Content grid preview",
              class: "w-full h-auto block",
              loading: "lazy",
              decoding: "async",
            }),
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
                E.text("Worry‑free refunds"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Refunds lower hesitation and boost sales—like free returns. Creators stay safe from chargebacks.",
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
                E.text("Low fees"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Keep ~95% of what you earn: 2% platform + ~3% processing. Fans cover the fixed top-up fee, not you.",
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
                E.text("What is Secount?"),
              ),
              E.div(
                { class: "text-neutral-300" },
                E.text(
                  "Secount is a platform where fans support creators through subscriptions and rentals.",
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
                  "Refunds are handled inside the platform, so most disputes never reach the bank. If someone still files a chargeback, we absorb the cost — creators stay protected.",
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
                  "Creators keep ~95%. That’s a 2% platform cut plus ~3% processing. Fans also pay a small fixed processing fee on each top-up order, so you don’t.",
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
                  "We’re video-first at launch, but expanding into other media formats like photo sets and novels.",
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
                class: "text-blue-400 hover:text-blue-300 underline",
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

    this.creatorForm.val.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.joinWaitList(this.creatorForm.val);
    });
    this.fanForm.val.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.joinWaitList(this.fanForm.val);
    });
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
      tabCreator.classList.remove("text-neutral-400");
      tabFan.classList.add("text-neutral-400");
      tabCreator.classList.replace("border-transparent", "border-blue-500");
      tabFan.classList.replace("border-blue-500", "border-transparent");
    } else {
      creatorForm.classList.add("hidden");
      creatorNote.classList.add("hidden");
      fanForm.classList.remove("hidden");
      fanNote.classList.remove("hidden");
      tabCreator.classList.add("text-neutral-400");
      tabFan.classList.remove("text-neutral-400");
      tabCreator.classList.replace("border-blue-500", "border-transparent");
      tabFan.classList.replace("border-transparent", "border-blue-500");
    }
  }

  private async joinWaitList(form: HTMLFormElement): Promise<void> {
    let formData = new FormData(form);
    let email = formData.get("email")?.toString() ?? "";
    let role = formData.get("role")?.toString() ?? "";
    await this.serviceClient.send(
      newJoinWaitListRequest({
        email,
        role,
      }),
    );
    this.fanForm.val.reset();
    alert("Thank you for joining the waitlist!");
  }

  public remove() {
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
