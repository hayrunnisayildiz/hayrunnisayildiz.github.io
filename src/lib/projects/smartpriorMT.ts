// Short showcase page for SmartPriorMT (Projects app + mobile page).
import { site } from '$lib/config';
import halfVsPrior from '$lib/assets/projects/smartprior-mt/half-vs-prior.jpg';

export const smartpriorMTReadme = `
# SmartPriorMT

*Research project · A smarter starting point for imaging the subsurface*

Magnetotellurics (MT) images what lies underground using natural electromagnetic signals. Turning the
measurements into a picture is a slow search that usually starts from a blank guess. **SmartPriorMT** uses a
neural network, trained on gravity and MT data, to **produce a better first guess** for that search.

![How well the model fits the data during the search (lower is better). Orange: starting from SmartPriorMT's guess. Blue: a blank start](${halfVsPrior})

**Highlights**

- Starting from the smart guess fit the data faster in every test run
- It recovered the shape of underground structures more accurately
- I also documented where it falls short, such as steeply tilted structures

**Built with:** Julia · Lux.jl · geophysical inversion

[Full details and code on GitHub →](${site.githubUrl}/SmartPriorMT)
`;
