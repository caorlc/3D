"use client";

import { PricingCardDisplay } from "@/components/home/PricingCardDisplay";
import FeatureBadge from "@/components/shared/FeatureBadge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_LOCALE } from "@/i18n/routing";
import { pricingPlans as pricingPlansSchema } from "@/lib/db/schema";
import { PricingPlanLangJsonb, PricingPlanTranslation } from "@/types/pricing";
import { Gift } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type PricingPlan = typeof pricingPlansSchema.$inferSelect;

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pricingPlans?: PricingPlan[];
}

const getGridColsClass = (count: number) => {
  switch (count) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    default:
      return "grid-cols-1";
  }
};

const getDefaultTab = (monthly: number, annual: number, oneTime: number) => {
  if (annual > 0) return "annual";
  if (monthly > 0) return "monthly";
  if (oneTime > 0) return "one_time";
  return "monthly";
};

export function PricingDialog({ open, onOpenChange, pricingPlans }: PricingDialogProps) {
  const locale = useLocale();
  const t = useTranslations("Landing.Pricing");
  const [plans, setPlans] = useState<PricingPlan[]>(pricingPlans || []);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!open || plans.length > 0 || isFetching) {
      return;
    }

    let cancelled = false;
    const fetchPlans = async () => {
      setIsFetching(true);
      try {
        console.log('Fetching pricing plans...');
        const response = await fetch("/api/pricing/plans");
        const data = await response.json();
        console.log('Pricing plans response:', data);
        if (!cancelled && data?.success && Array.isArray(data.data)) {
          console.log('Setting plans:', data.data.length, 'plans');
          setPlans(data.data);
        } else {
          console.error('Invalid pricing data:', data);
        }
      } catch (error) {
        console.error("Failed to load pricing plans", error);
      } finally {
        if (!cancelled) {
          setIsFetching(false);
        }
      }
    };

    fetchPlans();
    return () => {
      cancelled = true;
    };
  }, [open, plans.length, isFetching]);

  const categorizedPlans = useMemo(() => {
    const resolveTranslation = (plan: PricingPlan): PricingPlanTranslation => {
      const langJson = plan.langJsonb as PricingPlanLangJsonb | undefined;
      const localized = langJson?.[locale] || langJson?.[DEFAULT_LOCALE];

      return {
        cardTitle: localized?.cardTitle || plan.cardTitle || "",
        cardDescription: localized?.cardDescription || plan.cardDescription || "",
        displayPrice: localized?.displayPrice || plan.displayPrice || "",
        originalPrice: localized?.originalPrice || plan.originalPrice || undefined,
        priceSuffix: localized?.priceSuffix || plan.priceSuffix || "月",
        features: localized?.features || (plan.features as any) || [],
        highlightText: localized?.highlightText || plan.highlightText || undefined,
        buttonText: localized?.buttonText || plan.buttonText || "立即升级",
      } satisfies PricingPlanTranslation;
    };

    const byType = {
      monthly: [] as { plan: PricingPlan; localizedPlan: PricingPlanTranslation }[],
      annual: [] as { plan: PricingPlan; localizedPlan: PricingPlanTranslation }[],
      one_time: [] as { plan: PricingPlan; localizedPlan: PricingPlanTranslation }[],
    };

    plans.forEach((plan) => {
      const entry = { plan, localizedPlan: resolveTranslation(plan) };
      if (plan.paymentType === "recurring" && plan.recurringInterval === "month") {
        byType.monthly.push(entry);
      } else if (plan.paymentType === "recurring" && plan.recurringInterval === "year") {
        byType.annual.push(entry);
      } else if (plan.paymentType === "one_time") {
        byType.one_time.push(entry);
      } else {
        byType.monthly.push(entry);
      }
    });

    const result = {
      monthly: byType.monthly,
      annual: byType.annual,
      oneTime: byType.one_time,
    };

    console.log('Categorized plans:', {
      monthly: result.monthly.length,
      annual: result.annual.length,
      oneTime: result.oneTime.length,
      totalPlans: plans.length
    });

    return result;
  }, [plans, locale, t]);

  const availablePlanTypes = [
    categorizedPlans.monthly.length > 0,
    categorizedPlans.annual.length > 0,
    categorizedPlans.oneTime.length > 0,
  ].filter(Boolean).length;

  const defaultTab = getDefaultTab(
    categorizedPlans.monthly.length,
    categorizedPlans.annual.length,
    categorizedPlans.oneTime.length
  );

  const renderPlans = (
    list: { plan: PricingPlan; localizedPlan: PricingPlanTranslation }[]
  ) => {
    if (isFetching) {
      return (
        <div className="text-center text-gray-400 py-10">加载中...</div>
      );
    }

    if (list.length === 0) {
      return (
        <div className="text-center text-gray-400 py-10">敬请期待</div>
      );
    }

    return (
      <div
        className={`grid gap-8 justify-center items-start ${list.length === 1
          ? "grid-cols-1 max-w-sm mx-auto"
          : list.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
            : "grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto"
          }`}
      >
        {list.map(({ plan, localizedPlan }) => (
          <PricingCardDisplay
            id={plan.isHighlighted ? "highlight-card" : undefined}
            key={plan.id}
            plan={plan as PricingPlan}
            localizedPlan={localizedPlan}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#070b12] text-white border border-[#1f283b] w-full max-w-[90vw] lg:max-w-6xl xl:max-w-7xl p-0 max-h-[92vh]">
        <div className="overflow-y-auto max-h-[92vh]">
          <section className="py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <FeatureBadge
                  label={t("badge.label")}
                  text={t("badge.text")}
                  className="mb-8"
                />
                <DialogTitle asChild>
                  <h2 className="text-center text-lg md:text-5xl font-sans font-semibold mb-4">
                    <span className="title-gradient">{t("title")}</span>
                  </h2>
                </DialogTitle>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  {t("description")}
                </p>
              </div>

              {plans.length === 0 && !isFetching ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-400 mb-4">暂无价格方案</p>
                  <p className="text-sm text-gray-500">请联系管理员配置价格方案</p>
                </div>
              ) : (
                <Tabs defaultValue={defaultTab} className="w-full mx-auto">
                  <TabsList
                    className={`grid w-fit mx-auto ${getGridColsClass(
                      availablePlanTypes || 1
                    )} h-12 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg`}
                  >
                    {categorizedPlans.monthly.length > 0 && (
                      <TabsTrigger
                        value="monthly"
                        className="px-6 py-2 text-sm font-normal rounded-md data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-gray-800 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        {t("monthly")}
                      </TabsTrigger>
                    )}
                    {categorizedPlans.annual.length > 0 && (
                      <TabsTrigger
                        value="annual"
                        className="px-6 py-2 text-sm font-normal rounded-md data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-gray-800 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white relative"
                      >
                        <span className="flex items-center gap-2">
                          {t("annual")}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold highlight-text">
                            <Gift className="w-4 h-4" />
                            {t("saveTip")}
                          </span>
                        </span>
                      </TabsTrigger>
                    )}
                    {categorizedPlans.oneTime.length > 0 && (
                      <TabsTrigger
                        value="one_time"
                        className="px-6 py-2 text-sm font-normal rounded-md data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-gray-800 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        {t("onetime")}
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {categorizedPlans.monthly.length > 0 && (
                    <TabsContent value="monthly" className="mt-8">
                      {renderPlans(categorizedPlans.monthly)}
                    </TabsContent>
                  )}

                  {categorizedPlans.annual.length > 0 && (
                    <TabsContent value="annual" className="mt-8">
                      {renderPlans(categorizedPlans.annual)}
                    </TabsContent>
                  )}

                  {categorizedPlans.oneTime.length > 0 && (
                    <TabsContent value="one_time" className="mt-8">
                      {renderPlans(categorizedPlans.oneTime)}
                    </TabsContent>
                  )}
                </Tabs>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
