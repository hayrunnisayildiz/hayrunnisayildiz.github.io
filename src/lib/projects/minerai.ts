// Showcase page for the MinerAI graduation thesis (shown in the Projects app).
import orebody3d from '$lib/assets/projects/minerai/orebody-3d-rf.jpg';
import modelComparison from '$lib/assets/projects/minerai/model-comparison.jpg';
import decisionMap from '$lib/assets/projects/minerai/decision-map.jpg';
import gradeTonnage from '$lib/assets/projects/minerai/grade-tonnage.jpg';
import whyAgree from '$lib/assets/projects/minerai/why-models-agree.jpg';

export const mineraiReadme = `
# MinerAI

**Graduation thesis** · Machine learning and geostatistics for 3D gold resource modelling

MinerAI turns raw drill-hole data into a 3D block model of where the gold is. It compares
machine-learning models (**Random Forest, XGBoost, LightGBM**) with classical
**Ordinary Kriging** and then uses the results to report resources and suggest new drill targets.

![3D orebody predicted by Random Forest, with drill traces and suggested drill holes](${orebody3d})

## The problem

Mining companies drill a limited number of holes and have to estimate what lies between them.
Geologists have traditionally done this with kriging. This project asks a simple question:
**can tree-based ML models, given geologically meaningful features, produce estimates that are
as reliable as kriging, and where do they differ?**

## Data

- Randalls gold project (Western Australia): **247 drill holes** after merging the site data with regional holes
- Au assays composited to **2 m intervals**, desurveyed into 3D and top-cut at **20 ppm**
- Estimated on a **5 × 5 × 5 m** block grid

## Approach

1. **Preprocessing:** interval validation, desurveying, compositing and detection-limit handling
2. **Feature engineering:** spatial and rotated coordinates, neighbour statistics, distance to holes, pathfinder elements, and kriging cross-validation estimates as *hybrid* features
3. **Geostatistics:** variogram analysis and 3D Ordinary Kriging as the baseline
4. **Models:** Random Forest, XGBoost and LightGBM for both grade regression and ore/waste classification at the 0.5 ppm economic cut-off, with class weighting for imbalance
5. **Validation:** *spatial* cross-validation to avoid spatial leakage, a bias feedback loop and uncertainty calibration
6. **Outputs:** grade-tonnage curves, resource tables, decision maps, interactive 3D views (PyVista / Plotly) and drill-target suggestions

## Results

All four methods place the high-grade zone along the same NW–SE trending structure.
The ML models produce a more continuous orebody, while kriging is more conservative.

![Plan view of the four models: grade (top) and ore/waste decision (bottom)](${modelComparison})

![Decision map at the 0.5 ppm cut-off](${decisionMap})

**Resource estimate (block model)**

| Cut-off | Tonnage | Avg. grade | Contained Au |
|---|---|---|---|
| 0.0 g/t (global) | 88.1 Mt | 0.26 g/t | 743,794 oz |
| 0.5 g/t (economic) | 7.6 Mt | 1.29 g/t | 316,002 oz |
| 1.0 g/t (high-grade core) | 3.6 Mt | 1.96 g/t | 224,948 oz |

![Grade-tonnage curves for all models](${gradeTonnage})

### Why do the models agree?

The correlation and Jaccard-similarity analysis shows that the models agree on most high-grade blocks.
Feature importance points to the kriging-based hybrid features, so the strong spatial structure of
the gold drives every method toward the same zone.

![Model agreement, feature importance and depth profile](${whyAgree})

## Engineering

- Installable \`minerai\` Python package with a **YAML-driven pipeline orchestrator**
- **37 test modules** (pytest) and **CI** with Ruff and pytest on Python 3.11 and 3.12
- Safe subprocess handling (\`shell=False\`, path-escape checks) and a lock to prevent concurrent pipeline runs

**Stack:** Python · scikit-learn · XGBoost · LightGBM · PyKrige · scikit-gstat · pandas · NumPy · PyVista · Plotly · Matplotlib
`;
