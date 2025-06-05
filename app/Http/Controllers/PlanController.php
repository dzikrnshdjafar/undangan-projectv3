<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::orderBy('rank', 'asc')->get();
        $user = Auth::user();

        $activePlanDetails = collect();
        $currentPlan = null;

        if ($user) {
            $activePlanDetails = $user->subscriptions()
                ->where('status', 'active')
                ->where(function ($q) {
                    $q->whereNull('ends_at')->orWhere('ends_at', '>', now());
                })
                ->with('plan')
                ->get()
                ->mapWithKeys(function ($sub) {
                    if ($sub->plan) {
                        return [$sub->plan_id => [
                            'name' => $sub->plan->name,
                            'slug' => $sub->plan->slug,
                            'rank' => $sub->plan->rank,
                            'ends_at' => $sub->ends_at
                        ]];
                    }
                    return [];
                })->filter();

            if ($activePlanDetails->isNotEmpty()) {
                $highestRankPlanId = $user->subscriptions()->where('status', 'active')
                    ->where(function ($q) {
                        $q->whereNull('ends_at')->orWhere('ends_at', '>', now());
                    })
                    ->with('plan')
                    ->get()
                    ->sortByDesc(function ($sub) {
                        return $sub->plan ? $sub->plan->rank : 0;
                    })->first()->plan_id ?? null;
                if ($highestRankPlanId) {
                    $currentPlan = Plan::find($highestRankPlanId);
                }
            }
        }

        return Inertia::render('Plans/Index', [
            'plans' => $plans,
            'currentPlan' => $currentPlan,
            'activePlanDetails' => $activePlanDetails,
        ]);
    }
}
