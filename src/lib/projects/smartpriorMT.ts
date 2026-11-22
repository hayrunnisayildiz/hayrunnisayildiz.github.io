// Showcase page for SmartPriorMT (shown in the Projects app).
import halfVsPrior from '$lib/assets/projects/smartprior-mt/half-vs-prior.jpg';
import meanHalf from '$lib/assets/projects/smartprior-mt/model-mean-half.jpg';
import meanPrior from '$lib/assets/projects/smartprior-mt/model-mean-prior.jpg';
import budget from '$lib/assets/projects/smartprior-mt/budget-overlay.jpg';

export const smartpriorMTReadme = `
# SmartPriorMT

**Smart starting models for 2D magnetotelluric inversion** · Julia · Lux.jl · MTGeophysics

2D MT inversion usually starts from a flat half-space. SmartPriorMT instead builds a **"smart" prior
model from gravity and MT data** with a Lux neural network and uses it as the starting model for a
**VFSA** (very fast simulated annealing) inversion. The question is whether that start makes the
inversion faster and its result closer to the truth.

\`\`\`
Gravity + MT data (Niblett–Bostick) → Lux network → Prior model (μ, σ) → VFSA2DMT (starting model)
\`\`\`

The forward solver, perturbation and cooling schedule stay the same; **only the starting point changes**.
Gravity is used to build the prior only, so this is not a joint inversion.

## Key findings

| Question | Answer |
|---|---|
| Does the prior fit the data faster? | **Yes:** consistently, from the first iteration, in 3/3 seeds |
| Does it match the true model better? | **Partly:** structural correlation improves, but absolute amplitude (RMSE) is mixed |
| Does it work for every geology? | **No:** it can fall behind on steep-dip or resistive-contrast structures |
| Does VFSA reach the target RMS = 1.0? | **No:** the bottleneck is the RBF parametrization, not the iteration budget |

### 1. The prior fits the data about 25 % better

Data RMS after 400 VFSA iterations:

| Seed | Half-space | Prior | Improvement |
|---|---:|---:|---:|
| t1 | 4.60 | 3.47 | 25 % |
| t2 | 5.02 | 3.64 | 27 % |
| t3 | 5.15 | 3.82 | 26 % |

![Data RMS vs iteration and final RMS for 3 seeds](${halfVsPrior})

### 2. Structure yes, amplitude unclear

Correlation with the true model is higher for the prior in all 3 seeds (e.g. 0.30 vs 0.21),
but RMSE against the true model is inconsistent. The prior captures *where* conductive and resistive zones are,
not their exact values.

| Half-space start | Prior start |
|---|---|
| ![Mean model, half-space start](${meanHalf}) | ![Mean model, prior start](${meanPrior}) |

### 3. It is a parametrization problem, not a budget problem

![Final RMS vs VFSA budget](${budget})

Raising the budget from 400 to 3000 iterations improved RMS (prior 3.47 → 2.64, half-space 4.60 → 3.50),
but the gains flattened out: acceptance fell to 4–9 % and the search effectively stopped.
The prior's advantage holds at every budget. The next lever is the **RBF parametrization**
(more control points or a narrower kernel), not more iterations.

## Honest limitations

- A single gravity–resistivity relationship is assumed, so reliability drops in mixed-lithology settings (e.g. the Musgrave real-data test)
- TE mode only so far; σ is not a calibrated uncertainty map and does not enter the inversion
- Partial inverse crime on the gravity side (same forward operator for synthetic data and inversion)
- 3D warm-start is out of scope for the upstream package

**Stack:** Julia · Lux.jl · MTGeophysics · Zygote · ForwardDiff · ArchGDAL · Plots
`;
