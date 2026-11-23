// Short showcase page for MinerAI (Projects app + mobile page).
import { site } from '$lib/config';
import orebody3d from '$lib/assets/projects/minerai/orebody-3d-rf.jpg';

export const mineraiReadme = `
# MinerAI

*Graduation thesis · Machine learning for gold exploration*

Mining companies can only drill a limited number of holes, so they have to estimate what lies between them.
For my graduation thesis I built **MinerAI**, a pipeline that turns raw drill-hole data into a **3D map of where
the gold is likely to be**, and compared machine learning with kriging, the traditional method geologists use.

![3D model of the gold-bearing zone (yellow) with drill holes and suggested new drill sites](${orebody3d})

**What I did**

- Cleaned and prepared real drilling data from a gold project in Western Australia
- Trained three machine-learning models and compared them with classical kriging
- Tested them fairly, holding out whole areas so no model could "peek" at nearby data
- Turned the results into 3D views, a resource estimate and suggested new drill sites

**Result:** every method pointed to the same high-grade zone. Machine learning gave a more continuous picture, while kriging was more cautious.

**Built with:** Python · scikit-learn · XGBoost · LightGBM · PyKrige · PyVista

[Full details and code on GitHub →](${site.githubUrl}/minerai)
`;
