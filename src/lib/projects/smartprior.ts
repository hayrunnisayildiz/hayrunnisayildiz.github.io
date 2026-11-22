// Showcase page for SmartPrior (shown in the Projects app).
import section from '$lib/assets/projects/smartprior/section-mu-sigma.jpg';
import calibration from '$lib/assets/projects/smartprior/calibration-curve.jpg';
import method from '$lib/assets/projects/smartprior/method-overview.svg';

export const smartpriorReadme = `
# SmartPrior

**Neural-field priors with uncertainty from sparse drillholes** · Julia · Lux.jl

SmartPrior predicts a rock property, such as copper grade or density, **together with its uncertainty**
at any 3D point from sparse drillholes. A neural network trained on a Gaussian likelihood is compared with
kriging on real drillhole data from the **Keivitsa deposit, Finland** (Geological Survey of Finland, GTK).

*Status: research prototype. Cu and density are complete; magnetic susceptibility is next.*

![Cross-section: predicted Cu and its uncertainty, kriging vs neural field](${section})

**Kriging gives a patchier grade map, and only the neural field shows where it is unsure.**
The top row shows predicted Cu and the bottom row shows uncertainty (σ). Kriging's σ is nearly uniform,
while the neural field becomes less certain near the surface and around isolated holes where data are sparse.

## Results

10-fold cross-validation that holds out **whole drillholes**:

| Target | Skill: kriging | Skill: neural field | 90 % coverage: kriging | 90 % coverage: neural field |
|---|---:|---:|---:|---:|
| Cu (261 holes) | 0.106 | **0.151** | 0.78 | **0.87** |
| Density (263 holes) | 0.058 | **0.065** | 0.77 | **0.90** |

*Skill: 0 means no better than the mean, and higher is better. Coverage is the share of held-out samples inside the 90 % interval, where 0.90 is ideal.*

- **Cu:** the neural field is at least as accurate as kriging, and its uncertainty is more honest. The accuracy gain is not statistically significant.
- **Density** (30,908 core measurements): the network beats kriging on **153 of 263 holes** (mean skill difference +0.055, 95 % CI 0.016 to 0.093), and its intervals hit the 0.90 target while kriging's are too narrow.

![Calibration curve: neural field vs kriging](${calibration})

**Calibration:** if a method says it is X % sure, how often is it actually right? The neural field (red)
stays close to the ideal line, while kriging (blue) is overconfident, most clearly at 90 %.

## How it works

![Method overview: prepare drillhole data, train, test on held-out drillholes](${method})

- Drillhole desurveying, schema validation and covariates (position and depth)
- Neural field in **Lux.jl** that outputs a mean and σ, trained with AdamW on a Gaussian NLL loss
- Early stopping on validation RMSE, with a 5-seed ensemble for the final Cu block model
- Kriging baseline with variogram checks, ablations and sigma-vs-spread diagnostics
- Unit tests for I/O, schema, desurveying and synthetic fields

**Stack:** Julia · Lux.jl · Optimisers.jl · Zygote · kriging / variograms · 3D block modelling

---

<sub>Keivitsa drillhole data (Hakku), edited © Geological Survey of Finland 2026. Used under the GTK basic licence. Code: MIT.</sub>
`;
