import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import {
  Code,
  Globe,
  HomeIcon,
  Rocket,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "About Us",
    description: `Learn about ${siteConfig.name} - A Modern Next.js Full Stack SaaS Boilerplate that helps developers build, deploy, and scale SaaS applications in days, not weeks.`,
    path: `/about`,
  });
}

export default function AboutPage() {
  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
            About {siteConfig.name}
          </h1>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-semibold">Our Mission</h2>
              <p className="mb-3">
                At {siteConfig.name}, we believe that building a SaaS
                application shouldn't take months of development time. Our
                mission is to empower developers, entrepreneurs, and businesses
                to launch production-ready SaaS applications in days, not weeks,
                by providing the most comprehensive Next.js SaaS boilerplate
                available.
              </p>
              <p className="mb-3">
                We've spent months crafting the perfect foundation so you can
                focus on what matters most - your unique business logic and
                delivering value to your customers.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                What is {siteConfig.name}?
              </h2>
              <p className="mb-3">
                {siteConfig.name} is a modern, full-stack Next.js SaaS
                boilerplate that includes everything you need to build, deploy,
                and scale your SaaS application. Our template is trusted by 130+
                customers and provides a complete solution with authentication,
                payments, AI integration, content management, and much more.
              </p>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <Code className="size-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Production-Ready
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Battle-tested code with enterprise-grade architecture and
                      best practices
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                  <Zap className="size-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                      Lightning Fast
                    </h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Launch your first project in 3-5 days, subsequent projects
                      in 1-2 days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-violet-50 dark:bg-violet-950/20">
                  <Users className="size-6 text-violet-600 dark:text-violet-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-violet-900 dark:text-violet-100">
                      Community Driven
                    </h3>
                    <p className="text-sm text-violet-700 dark:text-violet-300">
                      Join our Discord community with developers building
                      amazing SaaS products
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <Globe className="size-6 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                      Global Ready
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Built-in internationalization support for worldwide market
                      reach
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                What Makes Us Different
              </h2>
              <p className="mb-3">
                Unlike other Next.js templates that only provide basic
                components, {siteConfig.name} offers complete business workflows
                and production-ready features:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold mb-2">
                    Complete Business Logic
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Authentication, payments, user management, subscription
                    handling, and billing - all implemented and ready to use.
                  </p>
                </div>

                <div className="border-l-4 border-emerald-500 pl-4">
                  <h3 className="font-semibold mb-2">AI-First Architecture</h3>
                  <p className="text-sm text-muted-foreground">
                    Built-in AI SDK integration with support for GPT, Claude,
                    Gemini, DeepSeek, Grok, and more. Perfect for building
                    AI-powered SaaS applications.
                  </p>
                </div>

                <div className="border-l-4 border-violet-500 pl-4">
                  <h3 className="font-semibold mb-2">Advanced CMS</h3>
                  <p className="text-sm text-muted-foreground">
                    Content management system with paywall protection, AI
                    translation, multilingual support, and monetization
                    features.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold mb-2">
                    Enterprise Infrastructure
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cloudflare R2 file storage, Stripe payments, Resend emails,
                    Redis caching, and PostgreSQL database - all configured and
                    optimized.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                Our Technology Stack
              </h2>
              <p className="mb-3">
                We've carefully selected enterprise-grade technologies to ensure
                your SaaS application is stable, scalable, and maintainable for
                long-term success:
              </p>

              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <strong>Frontend:</strong> Next.js, TypeScript, Tailwind CSS,
                  Shadcn/ui
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <strong>Backend:</strong> Better Auth, Drizzle ORM,
                  PostgreSQL, Redis
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <strong>Services:</strong> Stripe, Cloudflare R2, Resend, AI
                  SDK
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <strong>AI:</strong> OpenRouter, Replicate, GPT, Claude,
                  Gemini
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <strong>Analytics:</strong> Google Analytics, Plausible,
                  AdSense
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <strong>Deploy:</strong> Vercel, Dokploy, Self-hosted options
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                Multiple Solutions, One Platform
              </h2>
              <p className="mb-3">
                {siteConfig.name} isn't just a template - it's a complete
                ecosystem that adapts to your needs:
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Rocket className="size-5 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">AI-Powered SaaS Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      Launch production-ready AI applications with built-in
                      integrations, usage tracking, and automated billing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="size-5 text-emerald-600 dark:text-emerald-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Content & Blog Platforms</h3>
                    <p className="text-sm text-muted-foreground">
                      SEO-optimized content websites with advanced CMS, paywall
                      protection, and monetization features.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="size-5 text-violet-600 dark:text-violet-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Subscription Platforms</h3>
                    <p className="text-sm text-muted-foreground">
                      Build recurring revenue businesses with automated billing,
                      customer management, and analytics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="size-5 text-purple-600 dark:text-purple-400 mt-1" />
                  <div>
                    <h3 className="font-semibold">Free Tools & Lead Magnets</h3>
                    <p className="text-sm text-muted-foreground">
                      Create viral free tools that drive organic traffic and
                      generate leads for your business.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Our Commitment</h2>
              <p className="mb-3">
                We're committed to providing you with the best possible
                experience:
              </p>

              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>
                  <strong>Lifetime Updates</strong>: Your one-time purchase
                  includes all future updates and improvements
                </li>
                <li>
                  <strong>Comprehensive Documentation</strong>: Detailed guides
                  and examples to help you get started quickly
                </li>
                <li>
                  <strong>Active Community</strong>: Join our Discord community
                  for support and collaboration
                </li>
                <li>
                  <strong>24/7 Email Support</strong>: Get help when you need it
                  with our dedicated support team
                </li>
                <li>
                  <strong>AI-Friendly Code</strong>: Designed to work seamlessly
                  with AI assistants for enhanced productivity
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                Join the {siteConfig.name} Community
              </h2>
              <p className="mb-3">
                Whether you're a seasoned developer or just starting your SaaS
                journey, {siteConfig.name} provides the foundation you need to
                succeed. Join hundreds of developers who have already launched
                their SaaS applications using our platform.
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                {siteConfig.socialLinks?.discord && (
                  <a
                    href={siteConfig.socialLinks.discord}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Users className="size-4" />
                    Join Discord
                  </a>
                )}
                <Button
                  asChild
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  <Link href="/">
                    <Rocket className="size-4" />
                    Get Started
                  </Link>
                </Button>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Contact Us</h2>
              <p className="mb-3">
                Have questions about {siteConfig.name} or need help with your
                project? We're here to help:
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                {siteConfig.socialLinks?.discord && (
                  <li>
                    <strong>Discord Community</strong>:{" "}
                    <a
                      href={siteConfig.socialLinks.discord}
                      className="text-primary hover:underline"
                    >
                      Join our Discord server
                    </a>
                  </li>
                )}
                {siteConfig.socialLinks?.email && (
                  <li>
                    <strong>Email Support</strong>:{" "}
                    <a
                      href={`mailto:${siteConfig.socialLinks.email}`}
                      className="hover:underline text-blue-500"
                    >
                      {siteConfig.socialLinks.email}
                    </a>
                  </li>
                )}
              </ul>
              <p className="mb-3">
                We typically respond within 24 hours and are committed to
                helping you succeed with your SaaS project.
              </p>
            </section>
          </div>

          <Separator />

          <div className="mt-8">
            <Link
              href="/"
              className="text-primary hover:underline flex items-center gap-2"
              title="Return to Home"
            >
              <HomeIcon className="size-4" /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
