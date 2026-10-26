"use client";

import * as React from "react";
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Bookmark,
  Share2,
  Car,
  Home,
  Mountain,
  Utensils,
  Moon,
  Lightbulb,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { STORAGE_KEYS, storage } from "@/lib/storage";
import type { TripPlan } from "@/lib/types";

export default function TravelPage() {
  const [selectedDuration, setSelectedDuration] = React.useState("3 Days (Weekend)");
  const [targetBudget, setTargetBudget] = React.useState(220);
  const [destination, setDestination] = React.useState("Lake Tahoe, CA");
  const [startingCity, setStartingCity] = React.useState("San Francisco, CA");
  const [interests, setInterests] = React.useState(["Food", "Adventure & Hiking", "Nature"]);
  const [generatedPlan, setGeneratedPlan] = React.useState<{
    summary: string;
    days: Array<{ day: number; items: Array<{ time: string; title: string; description: string; estCost: number }> }>;
    totalEstCost: number;
    tips: string[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState("");
  const [activeDay, setActiveDay] = React.useState(1);

  const tripDays = selectedDuration.startsWith("Day") ? 1 : selectedDuration.startsWith("5") ? 5 : 3;

  const generateTrip = async () => {
    setError("");
    setIsGenerating(true);
    try {
      const response = await fetch("/api/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days: tripDays, budget: targetBudget, interests, startingCity }),
      });
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "Unable to generate your trip right now.");
      setGeneratedPlan(payload as NonNullable<typeof generatedPlan>);
      setActiveDay(1);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate your trip right now.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  };

  const saveTrip = () => {
    if (!generatedPlan) return;
    const trip: TripPlan = {
      id: `trip-${Date.now()}`,
      destination,
      startingPoint: startingCity,
      duration: selectedDuration,
      budget: targetBudget,
      estimatedCost: generatedPlan.totalEstCost,
      vibes: interests,
      itinerary: generatedPlan.days.map((day) => ({
        day: day.day,
        title: `Day ${day.day}`,
        activities: day.items.map((item) => ({ title: item.title, time: item.time, description: item.description, cost: item.estCost })),
      })),
      travelTips: generatedPlan.tips,
      createdAt: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.TRIPS, [trip, ...storage.get<TripPlan[]>(STORAGE_KEYS.TRIPS, [])]);
  };

  const exportCalendar = () => {
    if (!generatedPlan) return;
    const text = generatedPlan.days.flatMap((day) => day.items.map((item) => `Day ${day.day} - ${item.time}: ${item.title}\n${item.description}`)).join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${destination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-itinerary.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#635BFF] uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" /> GenAI Trip Architect
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Travel Planner ✈️
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Student-budget friendly getaways and break itineraries
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-surface border border-border px-4 py-2 text-xs font-semibold shadow-xs">
          <span className="h-2 w-2 rounded-full bg-[#00D287]" />
          <span className="text-slate-500">Average Student Trip Cost:</span>
          <span className="font-extrabold text-[#635BFF]">₹194 / weekend</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Form & Saved Trips (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Plan Your Next Adventure ✨
              </h2>
              <p className="text-xs text-slate-400">Customized to your class schedule & student wallet</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="starting-city" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Starting From <span className="text-slate-400 font-normal lowercase">(Campus Hub)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="starting-city"
                    type="text"
                    value={startingCity}
                    onChange={(event) => setStartingCity(event.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="destination" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Destination
                </label>
                <div className="relative">
                  <Compass className="absolute left-3.5 top-3 h-4 w-4 text-[#635BFF]" />
                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border text-xs sm:text-sm font-semibold"
                  />
                </div>
                {/* Popular chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] text-slate-400">Popular:</span>
                  {["Yosemite", "Joshua Tree", "San Diego", "Portland"].map((city) => (
                    <button
                      key={city}
                      onClick={() => setDestination(`${city}, CA`)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#635BFF]/10 hover:text-[#635BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF] dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Trip Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Day Trip", "3 Days (Weekend)", "5 Days (Break)"].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setSelectedDuration(dur)}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all ${
                        selectedDuration === dur
                          ? "bg-[#635BFF] text-white shadow-xs"
                          : "bg-slate-50 dark:bg-slate-900 border border-border text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="trip-budget" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Target Budget
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#E8FAF5] dark:bg-[#00D287]/20 text-[#00B894] px-2 py-0.5 text-[10px] font-bold">
                      Student friendly
                    </span>
                    <span className="font-extrabold text-sm text-[#635BFF]">₹{targetBudget} total</span>
                  </div>
                </div>
                <input
                  id="trip-budget"
                  type="range"
                  aria-label="Target trip budget"
                  min="100"
                  max="500"
                  step="10"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="w-full accent-[#635BFF]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹100 (Shoestring)</span>
                  <span>₹500 (Splurge)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Trip Vibe & Interests
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Food 🍜", active: true },
                    { label: "Adventure & Hiking 🏔️", active: true },
                    { label: "Culture 🏛️", active: false },
                    { label: "Nature 🌲", active: true },
                    { label: "Nightlife 🎉", active: false },
                  ].map((tag) => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => toggleInterest(tag.label.split(" ")[0])}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        interests.includes(tag.label.split(" ")[0])
                          ? "bg-[#635BFF] border-[#635BFF] text-white"
                          : "bg-slate-50 dark:bg-slate-900 border-border text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {tag.label} {tag.active && "✓"}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={generateTrip} disabled={isGenerating || !destination.trim() || !startingCity.trim()} className="w-full h-12 rounded-xl bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold text-sm shadow-md shadow-[#635BFF]/30 gap-2">
                <Sparkles className="h-4 w-4" /> {isGenerating ? "Generating..." : "Generate my trip ✨"}
              </Button>
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">{error}</p>}
            </div>
          </Card>

          {/* Saved Student Trips */}
          <Card className="p-6 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Saved Student Trips</h3>
              <span className="text-xs font-semibold text-[#635BFF] cursor-pointer hover:underline">View All (8)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: "Big Sur Road...", cost: "₹180", desc: "2 Days • Camping", bg: "from-sky-700 to-blue-900" },
                { title: "Yosemite Ca...", cost: "₹210", desc: "3 Days • Group 4", bg: "from-emerald-700 to-teal-900" },
                { title: "Zion Camping", cost: "₹165", desc: "3 Days • Hiking", bg: "from-amber-700 to-orange-900" },
              ].map((trip) => (
                <div key={trip.title} className="rounded-2xl border border-border overflow-hidden bg-slate-50 dark:bg-slate-900">
                  <div className={`h-16 bg-gradient-to-tr ${trip.bg} p-2 text-right`}>
                    <span className="inline-block bg-black/40 backdrop-blur-md rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {trip.cost}
                    </span>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <p className="text-xs font-bold truncate text-foreground">{trip.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{trip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Itinerary Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#E8FAF5] dark:bg-[#00D287]/20 text-[#00B894] px-3 py-1 text-xs font-bold">
                  Est. Total: ₹{generatedPlan?.totalEstCost.toFixed(0) || "215"}/person
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 text-xs font-semibold">
                  3 Days / 2 Nights
                </span>
                <span className="rounded-full bg-[#E7F3FE] dark:bg-[#0984E3]/20 text-[#0984E3] px-3 py-1 text-xs font-bold">
                  Best for Nature & Hiking
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {generatedPlan ? `${destination} itinerary` : "🌲 3-Day Scenic Lake Tahoe Weekend Adventure"}
              </h2>
            </div>

            {/* Banner card */}
            <div className="relative h-48 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 overflow-hidden p-6 flex flex-col justify-end text-white">
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#00D287] uppercase tracking-wider">Recommended Base</p>
                  <h4 className="text-xl font-black">Kings Beach & North Shore Basecamp</h4>
                </div>
                <div className="text-xs font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  ☀️ 68°F Sunny
                </div>
              </div>
              <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Button size="sm" onClick={saveTrip} disabled={!generatedPlan} className="rounded-xl bg-[#635BFF] text-white gap-1.5 font-bold shadow-xs">
                <Bookmark className="h-4 w-4" /> Save trip 💾
              </Button>
              <Button variant="outline" size="sm" onClick={exportCalendar} disabled={!generatedPlan} className="rounded-xl gap-1.5 font-semibold">
                <Calendar className="h-4 w-4" /> Export Calendar 📅
              </Button>
              <Button variant="outline" size="sm" onClick={() => generatedPlan && navigator.clipboard.writeText(`${destination}\n\n${generatedPlan.summary}`)} disabled={!generatedPlan} className="rounded-xl gap-1.5 font-semibold">
                <Share2 className="h-4 w-4" /> Share with Roommates 👥
              </Button>
            </div>

            {/* Timeline Tabs */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(generatedPlan?.days || [{ day: 1 }, { day: 2 }, { day: 3 }]).map((day) => (
                  <button key={day.day} type="button" onClick={() => setActiveDay(day.day)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${activeDay === day.day ? "bg-[#635BFF] text-white font-bold shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}>
                    {activeDay === day.day ? "• " : ""}Day {day.day}
                  </button>
                ))}
              </div>

              {generatedPlan && <p className="rounded-2xl bg-[#635BFF]/10 p-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{generatedPlan.summary}</p>}

              {/* Timeline Items */}
              <div className="space-y-3.5 pl-2 border-l-2 border-[#635BFF]/30 ml-2">
                {(generatedPlan?.days.find((day) => day.day === activeDay)?.items || [
                  { time: "09:00 AM", title: "Carpool Departure from Campus", desc: "Meet at student union lot. 3.5 hr scenic drive via I-80 E with student gas split factored.", cost: "₹18 / person", icon: Car },
                  { time: "01:30 PM", title: "Check-in at Kings Beach Rustic Cabin", desc: "Cozy wooden cabin 5 min walk from the lake shore. Total cost split 4 ways across the squad.", cost: "₹75 / night", icon: Home },
                  { time: "03:30 PM", title: "Hike to Stateline Fire Lookout", desc: "Moderate 1.8-mile trail leading to iconic 360-degree panoramic Lake Tahoe vistas and afternoon golden hour lighting.", cost: "Free (₹0)", icon: Mountain },
                  { time: "07:00 PM", title: "T.B.C. Burger Shack Dinner", desc: "Casual outdoor picnic tables with mountain fries & craft sodas. Show college ID for a 10% student meal combo discount.", cost: "₹16 / meal", icon: Utensils },
                  { time: "08:30 PM", title: "Campfire & Stargazing by the Shore", desc: "Gather around public beach fire rings with marshmallow s'mores and acoustic playlist under starry night sky.", cost: "₹5 / snacks", icon: Moon },
                ]).map((act) => {
                  const Icon = "icon" in act ? act.icon : Lightbulb;
                  return (
                    <div key={act.title} className="relative pl-6 space-y-1">
                      <div className="absolute -left-[17px] top-0 h-7 w-7 rounded-full bg-white dark:bg-surface border-2 border-[#635BFF] flex items-center justify-center text-[#635BFF]">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400">{act.time}</span>
                        <span className="text-[#00D287] bg-[#E8FAF5] dark:bg-[#00D287]/20 px-2 py-0.5 rounded-full">{"estCost" in act ? `₹${act.estCost.toFixed(0)}` : act.cost}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{act.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{"description" in act ? act.description : act.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Cost Split & Travel Tip */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cost Split Breakdown</span>
                <span className="font-extrabold text-[#635BFF] text-base">₹215 total</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span>Accommodation (2 nights)</span><span className="font-bold">₹75</span></div>
                <div className="flex justify-between"><span>Meals & Drinks</span><span className="font-bold">₹85</span></div>
                <div className="flex justify-between"><span>Activities & Rentals</span><span className="font-bold">₹30</span></div>
                <div className="flex justify-between"><span>Fuel & Transit Split</span><span className="font-bold">₹25</span></div>
              </div>
            </Card>

            <Card className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30 shadow-xs space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                <Lightbulb className="h-4 w-4 text-amber-500" /> Student Travel Tip
              </div>
              <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                💡 Use your campus recreation pass to rent kayaks for <strong>50% off</strong> at Tahoe City Marina! Just present your student ID before 11 AM on Saturday.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
