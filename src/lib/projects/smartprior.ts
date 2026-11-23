// Short showcase page for SmartPrior (Projects app + mobile page).
import { site } from '$lib/config';
import section from '$lib/assets/projects/smartprior/section-mu-sigma.jpg';

export const smartpriorReadme = `
# SmartPrior

*Research project · Predicting rock properties, with honest uncertainty*

Drill holes only sample a few points underground. **SmartPrior** is a neural network that predicts a rock
property, such as copper grade or density, **anywhere in 3D and also says how sure it is**. I tested it against
kriging on real drill-hole data from the Keivitsa deposit in Finland.

![Cross-section. Top: predicted copper. Bottom: how uncertain each method is. Left: kriging, right: SmartPrior](${section})

**Highlights**

- At least as accurate as kriging for copper, and measurably better for density
- Its uncertainty is realistic: it knows where data is sparse, while kriging tends to be overconfident
- Tested strictly, by hiding entire drill holes and predicting them from the rest

**Built with:** Julia · Lux.jl · deep learning · geostatistics

[Full details and code on GitHub →](${site.githubUrl}/SmartPrior)

<sub>Keivitsa drillhole data (Hakku), edited © Geological Survey of Finland 2026. Used under the GTK basic licence.</sub>
`;
